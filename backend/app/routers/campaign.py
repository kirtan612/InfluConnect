"""
Campaign router - Campaign creation, listing, and management.
"""
from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.roles import UserRole, CampaignStatus
from app.db.session import get_db
from app.db.models.user import User
from app.db.models.brand import BrandProfile
from app.db.models.campaign import Campaign
from app.db.models.influencer import InfluencerProfile
from app.schemas.campaign import (
    CampaignCreate, CampaignUpdate, CampaignResponse
)
from app.schemas.influencer import InfluencerListResponse
from app.routers.auth import get_current_user
from app.utils.permissions import check_brand_can_create_campaign, check_campaign_access
from app.utils.validators import validate_platforms, validate_budget


router = APIRouter(prefix="/campaign", tags=["campaign"])


def get_brand_user(current_user: User = Depends(get_current_user)) -> User:
    """Ensure user is a brand."""
    if current_user.role != UserRole.BRAND:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="This endpoint is for brands only"
        )
    return current_user


@router.post("", response_model=CampaignResponse)
def create_campaign(
    data: CampaignCreate,
    current_user: User = Depends(get_brand_user),
    db: Session = Depends(get_db)
):
    """
    Create a new campaign.
    Only brands can create campaigns, and only if not flagged.
    """
    # Check brand can create campaigns
    check_brand_can_create_campaign(current_user, db)
    
    # Validate inputs
    validate_platforms(data.platforms)
    validate_budget(data.budget_min, data.budget_max)
    
    # Get brand profile
    brand = db.query(BrandProfile).filter(
        BrandProfile.user_id == current_user.id
    ).first()
    
    if not brand:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Brand profile not found"
        )
    
    # Create campaign
    db_campaign = Campaign(
        brand_id=brand.id,
        name=data.name,
        description=data.description,
        category=data.category,
        platforms=data.platforms,
        budget_min=data.budget_min,
        budget_max=data.budget_max,
        status=CampaignStatus.DRAFT  # New campaigns start in DRAFT
    )
    
    db.add(db_campaign)
    db.commit()
    db.refresh(db_campaign)
    
    return db_campaign


@router.get("/{campaign_id}", response_model=CampaignResponse)
def get_campaign(
    campaign_id: int,
    current_user: User = Depends(get_brand_user),
    db: Session = Depends(get_db)
):
    """
    Get campaign details.
    Brand can only view their own campaigns.
    """
    # Check access
    check_campaign_access(current_user, campaign_id, db)
    
    campaign = db.query(Campaign).filter(Campaign.id == campaign_id).first()
    if not campaign:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Campaign not found"
        )
    
    return campaign


@router.put("/{campaign_id}", response_model=CampaignResponse)
def update_campaign(
    campaign_id: int,
    data: CampaignUpdate,
    current_user: User = Depends(get_brand_user),
    db: Session = Depends(get_db)
):
    """
    Update campaign details.
    """
    # Check access
    check_campaign_access(current_user, campaign_id, db)
    
    campaign = db.query(Campaign).filter(Campaign.id == campaign_id).first()
    if not campaign:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Campaign not found"
        )
    
    # Validate inputs if provided
    if data.platforms is not None:
        validate_platforms(data.platforms)
    if data.budget_min is not None or data.budget_max is not None:
        validate_budget(data.budget_min or campaign.budget_min,
                       data.budget_max or campaign.budget_max)
    
    # Update fields
    if data.name is not None:
        campaign.name = data.name
    if data.description is not None:
        campaign.description = data.description
    if data.category is not None:
        campaign.category = data.category
    if data.platforms is not None:
        campaign.platforms = data.platforms
    if data.budget_min is not None:
        campaign.budget_min = data.budget_min
    if data.budget_max is not None:
        campaign.budget_max = data.budget_max
    if data.status is not None:
        campaign.status = data.status
    
    db.commit()
    db.refresh(campaign)
    
    return campaign


@router.delete("/{campaign_id}")
def delete_campaign(
    campaign_id: int,
    current_user: User = Depends(get_brand_user),
    db: Session = Depends(get_db)
):
    """
    Delete a campaign.
    Only draft campaigns can be deleted.
    """
    # Check access
    check_campaign_access(current_user, campaign_id, db)
    
    campaign = db.query(Campaign).filter(Campaign.id == campaign_id).first()
    if not campaign:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Campaign not found"
        )
    
    if campaign.status != CampaignStatus.DRAFT:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Only draft campaigns can be deleted"
        )
    
    db.delete(campaign)
    db.commit()
    
    return {"message": "Campaign deleted"}


@router.get("", response_model=List[CampaignResponse])
def list_campaigns(
    current_user: User = Depends(get_brand_user),
    db: Session = Depends(get_db),
    status_filter: str = None
):
    """
    List all campaigns for the current brand.
    """
    brand = db.query(BrandProfile).filter(
        BrandProfile.user_id == current_user.id
    ).first()
    
    if not brand:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Brand profile not found"
        )
    
    query = db.query(Campaign).filter(Campaign.brand_id == brand.id)
    
    if status_filter:
        try:
            status_enum = CampaignStatus(status_filter)
            query = query.filter(Campaign.status == status_enum)
        except ValueError:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Invalid status: {status_filter}"
            )
    
    campaigns = query.all()
    return campaigns
