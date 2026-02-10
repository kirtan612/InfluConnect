"""
Admin schemas.
"""
from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, Field
from app.core.roles import VerificationStatus, BrandStatus


class AdminInfluencerResponse(BaseModel):
    """Schema for admin to view influencer details."""
    id: int
    user_id: int
    display_name: Optional[str]
    email: str
    trust_score: float
    verification_status: VerificationStatus
    profile_completion: float
    is_suspended: bool
    admin_note: Optional[str]
    created_at: datetime
    
    class Config:
        from_attributes = True


class AdminVerifyInfluencerRequest(BaseModel):
    """Schema for admin to verify influencer."""
    status: VerificationStatus = Field(..., description="New verification status")
    reason: Optional[str] = Field(None, max_length=500, description="Admin reason for decision")


class AdminSuspendUserRequest(BaseModel):
    """Schema for admin to suspend user."""
    is_suspended: bool
    reason: Optional[str] = Field(None, max_length=500)


class ReportResponse(BaseModel):
    """Schema for report response."""
    id: int
    reported_entity_type: str
    reported_entity_id: int
    reason: str
    status: str
    admin_notes: Optional[str]
    created_at: datetime
    
    class Config:
        from_attributes = True


class AdminDashboardStats(BaseModel):
    """Schema for admin dashboard statistics."""
    total_influencers: int
    total_brands: int
    total_campaigns: int
    pending_verifications: int
    pending_reports: int
    suspended_users: int
