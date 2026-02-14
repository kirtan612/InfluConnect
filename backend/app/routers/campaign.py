"""
Campaign router - Campaign creation, listing, and management.
"""
from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.roles import UserRole, CampaignStatus
from app.core.dependencies import get_current_user
from app.db.session import get_db
from app.db.models.user import User
from app.db.models.brand import BrandProfile
from app.db.models.campaign import Campaign
from app.db.models.influencer import InfluencerProfile
from app.schemas.campaign import (
    CampaignCreate, CampaignUpdate, CampaignResponse
)
from app.schemas.influencer import InfluencerListResponse
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


# ============================================================================
# PUBLIC/INFLUENCER ENDPOINTS (must come first for proper routing)
# ============================================================================

@router.get("/explore", response_model=List[CampaignResponse])
def explore_campaigns(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
    category: str = None
):
    """
    Browse active campaigns (available to all logged-in users, especially influencers).
    """
    query = db.query(Campaign).filter(Campaign.status == CampaignStatus.ACTIVE)
    
    if category:
        query = query.filter(Campaign.category == category)
    
    campaigns = query.order_by(Campaign.created_at.desc()).all()
    
    return [
        CampaignResponse(
            id=c.id,
            brand_id=c.brand_id,
            name=c.name,
            description=c.description,
            category=c.category,
            platforms=c.platforms if c.platforms else [],
            budget_min=c.budget_min,
            budget_max=c.budget_max,
            status=c.status,
            created_at=c.created_at,
            updated_at=c.updated_at
        )
        for c in campaigns
    ]


# ============================================================================
# BRAND-ONLY ENDPOINTS
# ============================================================================

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
    # Debug logging
    print(f"[DEBUG] Campaign creation request from user: {current_user.email} (role: {current_user.role})")
    print(f"[DEBUG] Campaign data: {data.model_dump()}")
    
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
        print(f"[DEBUG] Brand profile not found for user_id: {current_user.id}")
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Brand profile not found"
        )
    
    print(f"[DEBUG] Brand profile found: ID={brand.id}, Name={brand.company_name}")
    
    # Create campaign
    db_campaign = Campaign(
        brand_id=brand.id,
        name=data.name,
        description=data.description,
        category=data.category,
        platforms=data.platforms if data.platforms else [],
        budget_min=data.budget_min,
        budget_max=data.budget_max,
        status=CampaignStatus.DRAFT  # New campaigns start in DRAFT
    )
    
    db.add(db_campaign)
    db.commit()
    db.refresh(db_campaign)
    
    print(f"[DEBUG] Campaign created successfully: ID={db_campaign.id}")
    
    # Return explicit response
    return CampaignResponse(
        id=db_campaign.id,
        brand_id=db_campaign.brand_id,
        name=db_campaign.name,
        description=db_campaign.description,
        category=db_campaign.category,
        platforms=db_campaign.platforms if db_campaign.platforms else [],
        budget_min=db_campaign.budget_min,
        budget_max=db_campaign.budget_max,
        status=db_campaign.status,
        created_at=db_campaign.created_at,
        updated_at=db_campaign.updated_at
    )


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
    
    return CampaignResponse(
        id=campaign.id,
        brand_id=campaign.brand_id,
        name=campaign.name,
        description=campaign.description,
        category=campaign.category,
        platforms=campaign.platforms if campaign.platforms else [],
        budget_min=campaign.budget_min,
        budget_max=campaign.budget_max,
        status=campaign.status,
        created_at=campaign.created_at,
        updated_at=campaign.updated_at
    )


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
    update_data = data.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(campaign, key, value)
    
    db.commit()
    db.refresh(campaign)
    
    return CampaignResponse(
        id=campaign.id,
        brand_id=campaign.brand_id,
        name=campaign.name,
        description=campaign.description,
        category=campaign.category,
        platforms=campaign.platforms if campaign.platforms else [],
        budget_min=campaign.budget_min,
        budget_max=campaign.budget_max,
        status=campaign.status,
        created_at=campaign.created_at,
        updated_at=campaign.updated_at
    )


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
    
    # Convert to response format explicitly
    return [
        CampaignResponse(
            id=c.id,
            brand_id=c.brand_id,
            name=c.name,
            description=c.description,
            category=c.category,
            platforms=c.platforms if c.platforms else [],
            budget_min=c.budget_min,
            budget_max=c.budget_max,
            status=c.status,
            created_at=c.created_at,
            updated_at=c.updated_at
        )
        for c in campaigns
    ]
