"""
Influencer profile schemas.
"""
from datetime import datetime
from typing import Optional, List, Dict, Any
from pydantic import BaseModel, Field
from app.core.roles import VerificationStatus


class InfluencerProfileBase(BaseModel):
    """Base schema for influencer profile."""
    display_name: Optional[str] = Field(None, max_length=100)
    bio: Optional[str] = Field(None, max_length=500)
    category: Optional[str] = Field(None, max_length=100)


class InfluencerProfileCreate(InfluencerProfileBase):
    """Schema for creating influencer profile."""
    pass


class InfluencerProfileUpdate(BaseModel):
    """Schema for updating influencer profile."""
    display_name: Optional[str] = Field(None, max_length=100)
    bio: Optional[str] = Field(None, max_length=500)
    category: Optional[str] = Field(None, max_length=100)
    profile_image_url: Optional[str] = Field(None, max_length=500)
    cover_image_url: Optional[str] = Field(None, max_length=500)
    social_links: Optional[Dict[str, str]] = None
    platforms: Optional[List[str]] = None


class InfluencerProfileResponse(InfluencerProfileBase):
    """Schema for influencer profile response."""
    id: int
    user_id: int
    trust_score: float
    verification_status: VerificationStatus
    profile_completion: float
    admin_note: Optional[str] = None
    profile_image_url: Optional[str] = None
    cover_image_url: Optional[str] = None
    social_links: Optional[Dict[str, str]] = None
    platforms: Optional[List[str]] = None
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True


class VerificationRequestSubmit(BaseModel):
    """Schema for submitting verification request."""
    metrics_snapshot: Optional[dict] = Field(None, description="Influencer metrics data")


class TrustExplanation(BaseModel):
    """Schema explaining trust score calculation."""
    current_score: float
    profile_completion: float
    verification_status: VerificationStatus
    collaboration_count: int
    calculation_breakdown: str


class InfluencerListResponse(BaseModel):
    """Schema for list of influencers (search results)."""
    id: int
    user_id: int
    display_name: Optional[str] = None
    bio: Optional[str] = None
    category: Optional[str] = None
    trust_score: float
    verification_status: VerificationStatus
    profile_completion: float
    profile_image_url: Optional[str] = None
    
    class Config:
        from_attributes = True
