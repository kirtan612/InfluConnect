"""
Permissions utilities for access control.
"""
from fastapi import HTTPException, status
from sqlalchemy.orm import Session
from app.db.models.user import User
from app.db.models.brand import BrandProfile
from app.db.models.influencer import InfluencerProfile
from app.core.roles import BrandStatus, VerificationStatus


def check_brand_can_create_campaign(user: User, db: Session) -> bool:
    """
    Check if brand can create a campaign.
    Flagged brands cannot create campaigns.
    """
    brand = db.query(BrandProfile).filter(BrandProfile.user_id == user.id).first()
    if not brand:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Brand profile not found"
        )
    
    if brand.status == BrandStatus.FLAGGED:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Flagged brands cannot create campaigns"
        )
    
    return True


def check_influencer_can_receive_requests(influencer_id: int, db: Session) -> bool:
    """
    Check if influencer can receive collaboration requests.
    Only verified influencers with sufficient trust score can receive requests.
    """
    influencer = db.query(InfluencerProfile).filter(
        InfluencerProfile.id == influencer_id
    ).first()
    
    if not influencer:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Influencer not found"
        )
    
    if influencer.verification_status != VerificationStatus.VERIFIED:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only verified influencers can receive collaboration requests"
        )
    
    return True


def check_campaign_access(user: User, campaign_id: int, db: Session) -> bool:
    """Check if user (brand) has access to a campaign."""
    from app.db.models.campaign import Campaign
    
    campaign = db.query(Campaign).filter(Campaign.id == campaign_id).first()
    if not campaign:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Campaign not found"
        )
    
    brand = db.query(BrandProfile).filter(BrandProfile.user_id == user.id).first()
    if not brand or campaign.brand_id != brand.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied to this campaign"
        )
    
    return True


def check_brand_access_to_request(user: User, request_id: int, db: Session) -> bool:
    """Check if brand has access to a collaboration request."""
    from app.db.models.request import CollaborationRequest
    from app.db.models.campaign import Campaign
    
    collab_request = db.query(CollaborationRequest).filter(
        CollaborationRequest.id == request_id
    ).first()
    
    if not collab_request:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Request not found"
        )
    
    campaign = db.query(Campaign).filter(
        Campaign.id == collab_request.campaign_id
    ).first()
    
    brand = db.query(BrandProfile).filter(BrandProfile.user_id == user.id).first()
    if not brand or campaign.brand_id != brand.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied to this request"
        )
    
    return True
