"""
Collaboration Request router - Requests, search influencers, request management.
"""
from typing import List
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session

from app.core.roles import UserRole, CollaborationRequestStatus
from app.core.dependencies import get_current_user
from app.db.session import get_db
from app.db.models.user import User
from app.db.models.brand import BrandProfile
from app.db.models.influencer import InfluencerProfile
from app.db.models.request import CollaborationRequest
from app.db.models.campaign import Campaign
from app.schemas.request import (
    CollaborationRequestCreate, CollaborationRequestUpdate,
    CollaborationRequestResponse, CollaborationRequestWithDetails
)
from app.schemas.influencer import InfluencerListResponse
from app.utils.permissions import (
    check_influencer_can_receive_requests,
    check_campaign_access,
    check_brand_access_to_request
)


router = APIRouter(prefix="/request", tags=["request"])


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


@router.post("", response_model=CollaborationRequestResponse)
def create_request(
    data: CollaborationRequestCreate,
    current_user: User = Depends(get_brand_user),
    db: Session = Depends(get_db)
):
    """
    Create a collaboration request.
    Brand sends request to influencer for a campaign.
    
    Business Rules:
    - Influencer must be verified
    - Campaign must belong to the brand
    """
    # Check campaign access
    check_campaign_access(current_user, data.campaign_id, db)
    
    # Check influencer can receive requests
    check_influencer_can_receive_requests(data.influencer_id, db)
    
    # Check if request already exists
    existing = db.query(CollaborationRequest).filter(
        CollaborationRequest.campaign_id == data.campaign_id,
        CollaborationRequest.influencer_id == data.influencer_id
    ).first()
    
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Request already exists for this campaign and influencer"
        )
    
    # Create request
    db_request = CollaborationRequest(
        campaign_id=data.campaign_id,
        influencer_id=data.influencer_id,
        status=CollaborationRequestStatus.PENDING
    )
    
    db.add(db_request)
    db.commit()
    db.refresh(db_request)
    
    return db_request


@router.get("/{request_id}", response_model=CollaborationRequestWithDetails)
def get_request(
    request_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get collaboration request details.
    """
    collab_request = db.query(CollaborationRequest).filter(
        CollaborationRequest.id == request_id
    ).first()
    
    if not collab_request:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Request not found"
        )
    
    # Check access based on role
    if current_user.role == UserRole.BRAND:
        check_brand_access_to_request(current_user, request_id, db)
    elif current_user.role == UserRole.INFLUENCER:
        influencer = db.query(InfluencerProfile).filter(
            InfluencerProfile.user_id == current_user.id
        ).first()
        if not influencer or collab_request.influencer_id != influencer.id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Access denied"
            )
    
    # Get related data
    campaign = db.query(Campaign).filter(
        Campaign.id == collab_request.campaign_id
    ).first()
    
    influencer = db.query(InfluencerProfile).filter(
        InfluencerProfile.id == collab_request.influencer_id
    ).first()
    
    return CollaborationRequestWithDetails(
        id=collab_request.id,
        campaign_id=collab_request.campaign_id,
        influencer_id=collab_request.influencer_id,
        status=collab_request.status,
        created_at=collab_request.created_at,
        updated_at=collab_request.updated_at,
        campaign_name=campaign.name if campaign else "Unknown",
        influencer_display_name=influencer.display_name if influencer else None,
        influencer_trust_score=influencer.trust_score if influencer else 0
    )


@router.put("/{request_id}", response_model=CollaborationRequestResponse)
def update_request_status(
    request_id: int,
    data: CollaborationRequestUpdate,
    current_user: User = Depends(get_influencer_user),
    db: Session = Depends(get_db)
):
    """
    Update collaboration request status (accept/reject).
    Only influencers can accept/reject requests.
    """
    collab_request = db.query(CollaborationRequest).filter(
        CollaborationRequest.id == request_id
    ).first()
    
    if not collab_request:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Request not found"
        )
    
    # Check influencer owns this request
    influencer = db.query(InfluencerProfile).filter(
        InfluencerProfile.user_id == current_user.id
    ).first()
    
    if not influencer or collab_request.influencer_id != influencer.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Can only respond to requests sent to you"
        )
    
    # Can only update if pending
    if collab_request.status != CollaborationRequestStatus.PENDING:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Can only respond to pending requests"
        )
    
    # Update status
    collab_request.status = data.status
    db.commit()
    db.refresh(collab_request)
    
    # If accepted, update influencer trust score
    if data.status == CollaborationRequestStatus.ACCEPTED:
        from app.services.trust_engine import TrustEngine
        TrustEngine.update_trust_score(influencer.id, db)
    
    return collab_request


@router.get("/influencer/search", response_model=List[InfluencerListResponse])
def search_influencers(
    current_user: User = Depends(get_brand_user),
    db: Session = Depends(get_db),
    category: str = Query(None, description="Filter by category"),
    min_trust_score: float = Query(0, ge=0, le=100),
    verified_only: bool = Query(False)
):
    """
    Search for influencers.
    Brand can filter by category, minimum trust score, and verification status.
    """
    query = db.query(InfluencerProfile)
    
    if category:
        query = query.filter(InfluencerProfile.category == category)
    
    query = query.filter(InfluencerProfile.trust_score >= min_trust_score)
    
    if verified_only:
        from app.core.roles import VerificationStatus
        query = query.filter(
            InfluencerProfile.verification_status == VerificationStatus.VERIFIED
        )
    
    influencers = query.all()
    return influencers


@router.get("", response_model=List[CollaborationRequestResponse])
def list_requests(
    current_user: User = Depends(get_brand_user),
    db: Session = Depends(get_db)
):
    """
    List all collaboration requests for brand's campaigns.
    """
    brand = db.query(BrandProfile).filter(
        BrandProfile.user_id == current_user.id
    ).first()
    
    if not brand:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Brand profile not found"
        )
    
    # Get all campaigns for this brand
    campaigns = db.query(Campaign).filter(Campaign.brand_id == brand.id).all()
    campaign_ids = [c.id for c in campaigns]
    
    # Get all requests for these campaigns
    requests = db.query(CollaborationRequest).filter(
        CollaborationRequest.campaign_id.in_(campaign_ids)
    ).all()
    
    return requests
