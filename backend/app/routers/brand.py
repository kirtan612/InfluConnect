"""
Brand router - Profile management, campaign creation.
"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.roles import UserRole, CampaignStatus
from app.core.dependencies import get_current_user
from app.db.session import get_db
from app.db.models.user import User
from app.db.models.brand import BrandProfile
from app.schemas.brand import (
    BrandProfileResponse, BrandProfileCreate, BrandProfileUpdate
)
from app.utils.permissions import check_brand_can_create_campaign


router = APIRouter(prefix="/brand", tags=["brand"])


def get_brand_user(current_user: User = Depends(get_current_user)) -> User:
    """Ensure user is a brand."""
    if current_user.role != UserRole.BRAND:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="This endpoint is for brands only"
        )
    return current_user


@router.get("/profile", response_model=BrandProfileResponse)
def get_profile(
    current_user: User = Depends(get_brand_user),
    db: Session = Depends(get_db)
):
    """
    Get brand's own profile.
    """
    brand = db.query(BrandProfile).filter(
        BrandProfile.user_id == current_user.id
    ).first()
    
    if not brand:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Brand profile not found"
        )
    
    return brand


@router.put("/profile", response_model=BrandProfileResponse)
def update_profile(
    data: BrandProfileUpdate,
    current_user: User = Depends(get_brand_user),
    db: Session = Depends(get_db)
):
    """
    Update brand profile.
    """
    brand = db.query(BrandProfile).filter(
        BrandProfile.user_id == current_user.id
    ).first()
    
    if not brand:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Brand profile not found"
        )
    
    # Update fields
    update_data = data.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(brand, key, value)
    
    db.commit()
    db.refresh(brand)
    
    return brand

