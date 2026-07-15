"""
Collaboration router - Manage active collaborations lifecycle.
"""
from datetime import datetime
from typing import List
from fastapi import APIRouter, Depends, HTTPException, status, BackgroundTasks
from sqlalchemy.orm import Session

from app.core.roles import UserRole, CollaborationStatus, PaymentStatus
from app.core.dependencies import get_current_user
from app.db.session import get_db
from app.db.models.user import User
from app.db.models.brand import BrandProfile
from app.db.models.influencer import InfluencerProfile
from app.db.models.collaboration import Collaboration
from app.db.models.campaign import Campaign
from app.schemas.collaboration import (
    CollaborationResponse, CollaborationWithDetails,
    SetDeliverablesRequest, SubmitContentRequest,
    ApproveContentRequest, CompleteCollaborationRequest
)
from app.utils.collaboration import calculate_progress, validate_status_transition
from app.services.notification_service import (
    create_notification,
    send_notification_email,
    NotificationType
)


router = APIRouter(prefix="/collaboration", tags=["collaboration"])


def collaboration_to_response(collaboration: Collaboration) -> CollaborationResponse:
    """Convert Collaboration model to CollaborationResponse with progress."""
    progress = calculate_progress(collaboration.status)
    return CollaborationResponse(
        id=collaboration.id,
        request_id=collaboration.request_id,
        campaign_id=collaboration.campaign_id,
        influencer_id=collaboration.influencer_id,
        brand_id=collaboration.brand_id,
        status=collaboration.status,
        payment_status=collaboration.payment_status,
        deliverables=collaboration.deliverables,
        content_links=collaboration.content_links,
        deadline=collaboration.deadline,
        created_at=collaboration.created_at,
        updated_at=collaboration.updated_at,
        completed_at=collaboration.completed_at,
        progress_percentage=progress
    )


def get_brand_user(current_user: User = Depends(get_current_user)) -> User:
    """Ensure user is a brand."""
    if current_user.role != UserRole.BRAND:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="This endpoint is for brands only"
        )
    return current_user


def get_influencer_user(current_user: User = Depends(get_current_user)) -> User:
    """Ensure user is an influencer."""
    if current_user.role != UserRole.INFLUENCER:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="This endpoint is for influencers only"
        )
    return current_user


def check_brand_owns_collaboration(collaboration: Collaboration, user: User, db: Session):
    """Check if brand owns the collaboration."""
    brand = db.query(BrandProfile).filter(BrandProfile.user_id == user.id).first()
    if not brand or collaboration.brand_id != brand.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You don't have access to this collaboration"
        )


def check_influencer_owns_collaboration(collaboration: Collaboration, user: User, db: Session):
    """Check if influencer owns the collaboration."""
    influencer = db.query(InfluencerProfile).filter(InfluencerProfile.user_id == user.id).first()
    if not influencer or collaboration.influencer_id != influencer.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You don't have access to this collaboration"
        )


@router.get("/{collaboration_id}", response_model=CollaborationWithDetails)
def get_collaboration(
    collaboration_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get collaboration details.
    Accessible by both brand and influencer involved.
    """
    collaboration = db.query(Collaboration).filter(
        Collaboration.id == collaboration_id
    ).first()
    
    if not collaboration:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Collaboration not found"
        )
    
    # Check access
    if current_user.role == UserRole.BRAND:
        check_brand_owns_collaboration(collaboration, current_user, db)
    elif current_user.role == UserRole.INFLUENCER:
        check_influencer_owns_collaboration(collaboration, current_user, db)
    
    # Get related data
    campaign = db.query(Campaign).filter(Campaign.id == collaboration.campaign_id).first()
    brand = db.query(BrandProfile).filter(BrandProfile.id == collaboration.brand_id).first()
    influencer = db.query(InfluencerProfile).filter(InfluencerProfile.id == collaboration.influencer_id).first()
    
    # Calculate progress
    progress = calculate_progress(collaboration.status)
    
    return CollaborationWithDetails(
        id=collaboration.id,
        request_id=collaboration.request_id,
        campaign_id=collaboration.campaign_id,
        influencer_id=collaboration.influencer_id,
        brand_id=collaboration.brand_id,
        status=collaboration.status,
        payment_status=collaboration.payment_status,
        deliverables=collaboration.deliverables,
        content_links=collaboration.content_links,
        deadline=collaboration.deadline,
        created_at=collaboration.created_at,
        updated_at=collaboration.updated_at,
        completed_at=collaboration.completed_at,
        progress_percentage=progress,
        campaign_name=campaign.name if campaign else "Unknown",
        brand_company_name=brand.company_name if brand else "Unknown",
        influencer_display_name=influencer.display_name if influencer else None
    )


@router.put("/{collaboration_id}/deliverables", response_model=CollaborationResponse)
def set_deliverables(
    collaboration_id: int,
    data: SetDeliverablesRequest,
    current_user: User = Depends(get_brand_user),
    db: Session = Depends(get_db)
):
    """
    Set deliverables for collaboration.
    Only brand can set deliverables.
    Changes status from ACTIVE to DELIVERABLES_SET.
    """
    collaboration = db.query(Collaboration).filter(
        Collaboration.id == collaboration_id
    ).first()
    
    if not collaboration:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Collaboration not found"
        )
    
    # Check brand owns this collaboration
    check_brand_owns_collaboration(collaboration, current_user, db)
    
    # Validate status transition
    if collaboration.status != CollaborationStatus.ACTIVE:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Cannot set deliverables. Current status: {collaboration.status}. Must be ACTIVE."
        )
    
    # Update deliverables
    collaboration.deliverables = {
        "description": data.description,
        "requirements": data.requirements,
        "set_at": datetime.utcnow().isoformat()
    }
    collaboration.deadline = data.deadline
    collaboration.status = CollaborationStatus.DELIVERABLES_SET
    
    db.commit()
    db.refresh(collaboration)
    
    # Notify influencer about deliverables
    influencer = db.query(InfluencerProfile).filter(
        InfluencerProfile.id == collaboration.influencer_id
    ).first()
    if influencer:
        influencer_user = db.query(User).filter(User.id == influencer.user_id).first()
        campaign = db.query(Campaign).filter(Campaign.id == collaboration.campaign_id).first()
        
        if influencer_user and campaign:
            create_notification(
                db=db,
                user_id=influencer_user.id,
                message=f"Deliverables have been set for '{campaign.name}'",
                notification_type=NotificationType.DELIVERABLES_SET,
                related_id=collaboration.id
            )
    
    return collaboration_to_response(collaboration)


@router.post("/{collaboration_id}/submit", response_model=CollaborationResponse)
def submit_content(
    collaboration_id: int,
    data: SubmitContentRequest,
    background_tasks: BackgroundTasks,
    current_user: User = Depends(get_influencer_user),
    db: Session = Depends(get_db)
):
    """
    Submit content for collaboration.
    Only influencer can submit content.
    Changes status from DELIVERABLES_SET to CONTENT_SUBMITTED.
    """
    collaboration = db.query(Collaboration).filter(
        Collaboration.id == collaboration_id
    ).first()
    
    if not collaboration:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Collaboration not found"
        )
    
    # Check influencer owns this collaboration
    check_influencer_owns_collaboration(collaboration, current_user, db)
    
    # Validate status transition
    if collaboration.status != CollaborationStatus.DELIVERABLES_SET:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Cannot submit content. Current status: {collaboration.status}. Must be DELIVERABLES_SET."
        )
    
    # Add submission timestamp to each content link
    content_with_timestamp = []
    for content in data.content_links:
        content_with_timestamp.append({
            **content,
            "submitted_at": datetime.utcnow().isoformat()
        })
    
    # Update content links
    collaboration.content_links = content_with_timestamp
    collaboration.status = CollaborationStatus.CONTENT_SUBMITTED
    
    db.commit()
    db.refresh(collaboration)
    
    # Notify brand about content submission
    brand = db.query(BrandProfile).filter(
        BrandProfile.id == collaboration.brand_id
    ).first()
    if brand:
        brand_user = db.query(User).filter(User.id == brand.user_id).first()
        campaign = db.query(Campaign).filter(Campaign.id == collaboration.campaign_id).first()
        influencer = db.query(InfluencerProfile).filter(
            InfluencerProfile.id == collaboration.influencer_id
        ).first()
        
        if brand_user and campaign:
            create_notification(
                db=db,
                user_id=brand_user.id,
                message=f"Content submitted for '{campaign.name}' by {influencer.display_name if influencer else 'influencer'}",
                notification_type=NotificationType.CONTENT_SUBMITTED,
                related_id=collaboration.id
            )
            
            # Send email to brand
            background_tasks.add_task(
                send_notification_email,
                to_email=brand_user.email,
                subject="Content Submitted for Review",
                message=f"Content has been submitted for your campaign '{campaign.name}'. Please review and approve.",
                action_url="http://localhost:5173/dashboard"
            )
    
    return collaboration_to_response(collaboration)


@router.put("/{collaboration_id}/approve", response_model=CollaborationResponse)
def approve_content(
    collaboration_id: int,
    data: ApproveContentRequest,
    background_tasks: BackgroundTasks,
    current_user: User = Depends(get_brand_user),
    db: Session = Depends(get_db)
):
    """
    Approve submitted content.
    Only brand can approve content.
    Changes status from CONTENT_SUBMITTED to CONTENT_APPROVED.
    """
    collaboration = db.query(Collaboration).filter(
        Collaboration.id == collaboration_id
    ).first()
    
    if not collaboration:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Collaboration not found"
        )
    
    # Check brand owns this collaboration
    check_brand_owns_collaboration(collaboration, current_user, db)
    
    # Validate status transition
    if collaboration.status != CollaborationStatus.CONTENT_SUBMITTED:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Cannot approve content. Current status: {collaboration.status}. Must be CONTENT_SUBMITTED."
        )
    
    # Update status and add approval info
    collaboration.status = CollaborationStatus.CONTENT_APPROVED
    if data.feedback:
        # Add feedback to deliverables
        if not collaboration.deliverables:
            collaboration.deliverables = {}
        collaboration.deliverables["approval_feedback"] = data.feedback
        collaboration.deliverables["approved_at"] = datetime.utcnow().isoformat()
    
    db.commit()
    db.refresh(collaboration)
    
    # Notify influencer about approval
    influencer = db.query(InfluencerProfile).filter(
        InfluencerProfile.id == collaboration.influencer_id
    ).first()
    if influencer:
        influencer_user = db.query(User).filter(User.id == influencer.user_id).first()
        campaign = db.query(Campaign).filter(Campaign.id == collaboration.campaign_id).first()
        
        if influencer_user and campaign:
            create_notification(
                db=db,
                user_id=influencer_user.id,
                message=f"Your content for '{campaign.name}' has been approved!",
                notification_type=NotificationType.CONTENT_APPROVED,
                related_id=collaboration.id
            )
            
            # Send email to influencer
            background_tasks.add_task(
                send_notification_email,
                to_email=influencer_user.email,
                subject="Content Approved",
                message=f"Great work! Your content for '{campaign.name}' has been approved.",
                action_url="http://localhost:5173/dashboard"
            )
    
    return collaboration_to_response(collaboration)


@router.put("/{collaboration_id}/complete", response_model=CollaborationResponse)
def complete_collaboration(
    collaboration_id: int,
    data: CompleteCollaborationRequest,
    background_tasks: BackgroundTasks,
    current_user: User = Depends(get_brand_user),
    db: Session = Depends(get_db)
):
    """
    Complete collaboration and release payment.
    Only brand can complete collaboration.
    Changes status from CONTENT_APPROVED to COMPLETED.
    Sets payment_status to RELEASED.
    """
    collaboration = db.query(Collaboration).filter(
        Collaboration.id == collaboration_id
    ).first()
    
    if not collaboration:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Collaboration not found"
        )
    
    # Check brand owns this collaboration
    check_brand_owns_collaboration(collaboration, current_user, db)
    
    # Validate status transition
    if collaboration.status != CollaborationStatus.CONTENT_APPROVED:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Cannot complete collaboration. Current status: {collaboration.status}. Must be CONTENT_APPROVED."
        )
    
    # Update status
    collaboration.status = CollaborationStatus.COMPLETED
    collaboration.payment_status = PaymentStatus.RELEASED
    collaboration.completed_at = datetime.utcnow()
    
    if data.final_notes:
        if not collaboration.deliverables:
            collaboration.deliverables = {}
        collaboration.deliverables["final_notes"] = data.final_notes
        collaboration.deliverables["completed_at"] = datetime.utcnow().isoformat()
    
    db.commit()
    db.refresh(collaboration)
    
    # Notify both parties about completion
    influencer = db.query(InfluencerProfile).filter(
        InfluencerProfile.id == collaboration.influencer_id
    ).first()
    brand = db.query(BrandProfile).filter(
        BrandProfile.id == collaboration.brand_id
    ).first()
    campaign = db.query(Campaign).filter(Campaign.id == collaboration.campaign_id).first()
    
    # Notify influencer
    if influencer:
        influencer_user = db.query(User).filter(User.id == influencer.user_id).first()
        if influencer_user and campaign:
            create_notification(
                db=db,
                user_id=influencer_user.id,
                message=f"Collaboration for '{campaign.name}' has been completed! Payment released.",
                notification_type=NotificationType.COLLABORATION_COMPLETED,
                related_id=collaboration.id
            )
            
            # Send email to influencer
            background_tasks.add_task(
                send_notification_email,
                to_email=influencer_user.email,
                subject="Collaboration Completed",
                message=f"Congratulations! Your collaboration for '{campaign.name}' has been completed and payment has been released.",
                action_url="http://localhost:5173/dashboard"
            )
    
    # Notify brand
    if brand:
        brand_user = db.query(User).filter(User.id == brand.user_id).first()
        if brand_user and campaign:
            create_notification(
                db=db,
                user_id=brand_user.id,
                message=f"Collaboration for '{campaign.name}' has been completed successfully!",
                notification_type=NotificationType.COLLABORATION_COMPLETED,
                related_id=collaboration.id
            )
            
            # Send email to brand
            background_tasks.add_task(
                send_notification_email,
                to_email=brand_user.email,
                subject="Collaboration Completed",
                message=f"Your collaboration for '{campaign.name}' has been successfully completed.",
                action_url="http://localhost:5173/dashboard"
            )
    
    return collaboration_to_response(collaboration)


@router.get("", response_model=List[CollaborationResponse])
def list_collaborations(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    List all collaborations for current user.
    Returns collaborations based on user role (brand or influencer).
    """
    if current_user.role == UserRole.BRAND:
        brand = db.query(BrandProfile).filter(BrandProfile.user_id == current_user.id).first()
        if not brand:
            return []
        collaborations = db.query(Collaboration).filter(
            Collaboration.brand_id == brand.id
        ).all()
    elif current_user.role == UserRole.INFLUENCER:
        influencer = db.query(InfluencerProfile).filter(InfluencerProfile.user_id == current_user.id).first()
        if not influencer:
            return []
        collaborations = db.query(Collaboration).filter(
            Collaboration.influencer_id == influencer.id
        ).all()
    else:
        return []
    
    # Add progress percentage to each collaboration
    result = []
    for collab in collaborations:
        result.append(collaboration_to_response(collab))
    
    return result
