"""
Agreement and Dispute Management API endpoints.
"""
from datetime import datetime
from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.db.models.campaign import Campaign
from app.db.models.collaboration import Collaboration
from app.db.models.user import User
from app.core.dependencies import get_current_user
from app.core.roles import UserRole, CampaignStatus
from app.schemas.campaign import (
    AgreementAcceptResponse,
    DisputeCreate,
    DisputeResponse,
    AdminDecision,
    AdminDecisionResponse
)
from app.services.notification_service import create_notification, send_notification_email

router = APIRouter(prefix="/campaigns", tags=["Agreement & Dispute"])


# ============================================================================
# AGREEMENT ACCEPTANCE ENDPOINTS
# ============================================================================

@router.post("/{campaign_id}/brand-accept", response_model=AgreementAcceptResponse)
def brand_accept_agreement(
    campaign_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Brand accepts campaign agreement terms.
    
    Rules:
    - Only the campaign owner (brand) can accept
    - Cannot accept twice
    - Sets brand_accepted_terms = True and timestamp
    - If both parties accepted, campaign becomes ACTIVE
    """
    # Get campaign
    campaign = db.query(Campaign).filter(Campaign.id == campaign_id).first()
    if not campaign:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Campaign not found"
        )
    
    # Verify user is the brand owner
    if current_user.role != UserRole.BRAND:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only brands can accept brand agreement"
        )
    
    if current_user.brand_profile.id != campaign.brand_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You are not the owner of this campaign"
        )
    
    # Check if already accepted
    if campaign.brand_accepted_terms:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Brand has already accepted the agreement"
        )
    
    # Accept agreement
    campaign.brand_accepted_terms = True
    campaign.brand_accepted_at = datetime.utcnow()
    
    # Check if both parties have accepted
    both_accepted = campaign.brand_accepted_terms and campaign.influencer_accepted_terms
    
    if both_accepted:
        # Only activate if escrow is properly locked (or no escrow)
        if campaign.budget_amount:
            # Campaign has escrow - check if funds are locked
            if campaign.escrow_status == 'locked':
                campaign.status = CampaignStatus.ACTIVE
            else:
                # Escrow not locked - cannot activate
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"Cannot activate campaign. Escrow status is '{campaign.escrow_status}', must be 'locked'"
                )
        else:
            # No escrow - activate normally
            campaign.status = CampaignStatus.ACTIVE
    # Don't change status if only one party accepted - keep it as is
    
    db.commit()
    db.refresh(campaign)
    
    return AgreementAcceptResponse(
        message="Brand successfully accepted the agreement",
        campaign_id=campaign.id,
        accepted_by="brand",
        accepted_at=campaign.brand_accepted_at,
        both_accepted=both_accepted,
        campaign_status=campaign.status
    )


@router.post("/{campaign_id}/influencer-accept", response_model=AgreementAcceptResponse)
def influencer_accept_agreement(
    campaign_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Influencer accepts campaign agreement terms.
    
    Rules:
    - Only the assigned influencer can accept
    - Cannot accept twice
    - Sets influencer_accepted_terms = True and timestamp
    - If both parties accepted, campaign becomes ACTIVE
    """
    # Get campaign
    campaign = db.query(Campaign).filter(Campaign.id == campaign_id).first()
    if not campaign:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Campaign not found"
        )
    
    # Verify user is an influencer
    if current_user.role != UserRole.INFLUENCER:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only influencers can accept influencer agreement"
        )
    
    # Check if already accepted
    if campaign.influencer_accepted_terms:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Influencer has already accepted the agreement"
        )
    
    # Accept agreement
    campaign.influencer_accepted_terms = True
    campaign.influencer_accepted_at = datetime.utcnow()
    
    # Check if both parties have accepted
    both_accepted = campaign.brand_accepted_terms and campaign.influencer_accepted_terms
    
    if both_accepted:
        # Only activate if escrow is properly locked (or no escrow)
        if campaign.budget_amount:
            # Campaign has escrow - check if funds are locked
            if campaign.escrow_status == 'locked':
                campaign.status = CampaignStatus.ACTIVE
            else:
                # Escrow not locked - cannot activate
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"Cannot activate campaign. Escrow status is '{campaign.escrow_status}', must be 'locked'"
                )
        else:
            # No escrow - activate normally
            campaign.status = CampaignStatus.ACTIVE
    # Don't change status if only one party accepted - keep it as is
    
    db.commit()
    db.refresh(campaign)
    
    return AgreementAcceptResponse(
        message="Influencer successfully accepted the agreement",
        campaign_id=campaign.id,
        accepted_by="influencer",
        accepted_at=campaign.influencer_accepted_at,
        both_accepted=both_accepted,
        campaign_status=campaign.status
    )


# ============================================================================
# DISPUTE MANAGEMENT ENDPOINTS
# ============================================================================

@router.post("/{campaign_id}/raise-dispute", response_model=DisputeResponse)
def raise_dispute(
    campaign_id: int,
    dispute_data: DisputeCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Brand raises a dispute on campaign deliverables.
    
    Rules:
    - Only brand can raise disputes
    - Campaign must be in SUBMITTED or UNDER_REVIEW status
    - Dispute count increments by 1
    - If dispute_count < 3: status = DISPUTE (influencer can revise)
    - If dispute_count >= 3: status = ADMIN_REVIEW (escalated to admin)
    """
    # Get campaign
    campaign = db.query(Campaign).filter(Campaign.id == campaign_id).first()
    if not campaign:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Campaign not found"
        )
    
    # Verify user is the brand owner
    if current_user.role != UserRole.BRAND:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only brands can raise disputes"
        )
    
    if current_user.brand_profile.id != campaign.brand_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You are not the owner of this campaign"
        )
    
    # Validate campaign status
    if campaign.status not in [CampaignStatus.SUBMITTED, CampaignStatus.UNDER_REVIEW]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Cannot raise dispute. Campaign status must be SUBMITTED or UNDER_REVIEW, current: {campaign.status}"
        )
    
    # Check if both parties accepted agreement
    if not (campaign.brand_accepted_terms and campaign.influencer_accepted_terms):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Both parties must accept agreement before disputes can be raised"
        )
    
    # Increment dispute count
    campaign.dispute_count += 1
    campaign.dispute_reason = dispute_data.reason
    campaign.updated_at = datetime.utcnow()
    
    # Determine new status based on dispute count
    escalated_to_admin = False
    if campaign.dispute_count >= 3:
        campaign.status = CampaignStatus.ADMIN_REVIEW
        escalated_to_admin = True
        message = f"Dispute raised. Maximum disputes (3) reached. Escalated to admin review."
    else:
        campaign.status = CampaignStatus.DISPUTE
        message = f"Dispute raised. Influencer can revise and resubmit. Disputes remaining: {3 - campaign.dispute_count}"
    
    db.commit()
    db.refresh(campaign)
    
    # Notify admins about new dispute
    try:
        admins = db.query(User).filter(User.role == UserRole.ADMIN).all()
        for admin in admins:
            create_notification(
                db=db,
                user_id=admin.id,
                notification_type="dispute_filed",
                message=f"New dispute filed for Campaign #{campaign.id}. Reason: {dispute_data.reason}",
                related_id=campaign.id
            )
            
            send_notification_email(
                to_email=admin.email,
                subject="New Dispute Requires Review",
                message=f"A dispute has been filed for Campaign #{campaign.id}. Dispute count: {campaign.dispute_count}. Please review and take appropriate action.",
                action_url=f"http://localhost:5173/admin/disputes"
            )
    except Exception as e:
        print(f"Failed to send notification: {e}")
    
    return DisputeResponse(
        message=message,
        campaign_id=campaign.id,
        dispute_count=campaign.dispute_count,
        status=campaign.status,
        escalated_to_admin=escalated_to_admin
    )


@router.post("/{campaign_id}/admin-decision", response_model=AdminDecisionResponse)
def admin_make_decision(
    campaign_id: int,
    decision_data: AdminDecision,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Admin makes final decision on disputed campaign.
    
    Rules:
    - Only admins can make decisions
    - Campaign must be in ADMIN_REVIEW status
    - Admin can set status to COMPLETED or REJECTED
    - Decision is final and cannot be changed
    """
    # Verify user is admin
    if current_user.role != UserRole.ADMIN:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only admins can make decisions on disputes"
        )
    
    # Get campaign
    campaign = db.query(Campaign).filter(Campaign.id == campaign_id).first()
    if not campaign:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Campaign not found"
        )
    
    # Validate campaign status
    if campaign.status != CampaignStatus.ADMIN_REVIEW:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Campaign must be in ADMIN_REVIEW status. Current status: {campaign.status}"
        )
    
    # Check if decision already made
    if campaign.admin_decision:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Admin decision has already been made for this campaign"
        )
    
    # Record admin decision
    campaign.admin_decision = decision_data.decision
    campaign.status = decision_data.final_status
    campaign.admin_decided_at = datetime.utcnow()
    campaign.admin_decided_by = current_user.id
    campaign.updated_at = datetime.utcnow()
    
    db.commit()
    db.refresh(campaign)
    
    # Notify both parties about admin decision
    try:
        brand = db.query(User).join(User.brand_profile).filter(User.brand_profile.has(id=campaign.brand_id)).first()
        
        # Get influencer from collaboration
        collaboration = db.query(Collaboration).filter(Collaboration.campaign_id == campaign_id).first()
        influencer = None
        if collaboration:
            influencer = db.query(User).join(User.influencer_profile).filter(
                User.influencer_profile.has(id=collaboration.influencer_id)
            ).first()
        
        decision_message = f"Admin has resolved the dispute for Campaign #{campaign.id}. Decision: {decision_data.decision}"
        
        if brand:
            create_notification(
                db=db,
                user_id=brand.id,
                notification_type="dispute_resolved",
                message=decision_message,
                related_id=campaign.id
            )
            send_notification_email(
                to_email=brand.email,
                subject="Dispute Resolved - Campaign #" + str(campaign.id),
                message=f"The dispute for your campaign has been resolved. Decision: {decision_data.decision}. Final status: {campaign.status}",
                action_url=f"http://localhost:5173/company/campaigns"
            )
        
        if influencer:
            create_notification(
                db=db,
                user_id=influencer.id,
                notification_type="dispute_resolved",
                message=decision_message,
                related_id=campaign.id
            )
            send_notification_email(
                to_email=influencer.email,
                subject="Dispute Resolved - Campaign #" + str(campaign.id),
                message=f"The dispute for Campaign #{campaign.id} has been resolved. Decision: {decision_data.decision}. Final status: {campaign.status}",
                action_url=f"http://localhost:5173/influencer/collaborations"
            )
    except Exception as e:
        print(f"Failed to send notifications: {e}")
    
    return AdminDecisionResponse(
        message="Admin decision recorded successfully",
        campaign_id=campaign.id,
        decision=campaign.admin_decision,
        final_status=campaign.status,
        decided_at=campaign.admin_decided_at,
        decided_by=campaign.admin_decided_by
    )


# ============================================================================
# UTILITY ENDPOINTS
# ============================================================================

@router.get("/{campaign_id}/agreement-status")
def get_agreement_status(
    campaign_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get agreement acceptance status for a campaign."""
    campaign = db.query(Campaign).filter(Campaign.id == campaign_id).first()
    if not campaign:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Campaign not found"
        )
    
    return {
        "campaign_id": campaign.id,
        "brand_accepted": campaign.brand_accepted_terms,
        "brand_accepted_at": campaign.brand_accepted_at,
        "influencer_accepted": campaign.influencer_accepted_terms,
        "influencer_accepted_at": campaign.influencer_accepted_at,
        "both_accepted": campaign.brand_accepted_terms and campaign.influencer_accepted_terms,
        "status": campaign.status
    }


@router.get("/{campaign_id}/dispute-status")
def get_dispute_status(
    campaign_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get dispute status for a campaign."""
    campaign = db.query(Campaign).filter(Campaign.id == campaign_id).first()
    if not campaign:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Campaign not found"
        )
    
    return {
        "campaign_id": campaign.id,
        "dispute_count": campaign.dispute_count,
        "dispute_reason": campaign.dispute_reason,
        "status": campaign.status,
        "escalated_to_admin": campaign.status == CampaignStatus.ADMIN_REVIEW,
        "admin_decision": campaign.admin_decision,
        "admin_decided_at": campaign.admin_decided_at,
        "admin_decided_by": campaign.admin_decided_by
    }
