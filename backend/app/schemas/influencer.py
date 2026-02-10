"""
Influencer profile schemas.
"""
from datetime import datetime
from typing import Optional, List
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


class InfluencerProfileUpdate(InfluencerProfileBase):
    """Schema for updating influencer profile."""
    pass


class InfluencerProfileResponse(InfluencerProfileBase):
    """Schema for influencer profile response."""
    id: int
    user_id: int
    trust_score: float
    verification_status: VerificationStatus
    profile_completion: float
    admin_note: Optional[str]
    created_at: datetime
    updated_at: datetime
    
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
    display_name: Optional[str]
    category: Optional[str]
    trust_score: float
    verification_status: VerificationStatus
    profile_completion: float
    
    class Config:
        from_attributes = True
