"""
Admin schemas.
"""
from datetime import datetime
from typing import Optional, List, Dict, Any
from pydantic import BaseModel, Field
from app.core.roles import VerificationStatus, BrandStatus


class AdminInfluencerResponse(BaseModel):
    """Schema for admin to view influencer details."""
    id: int
    user_id: int
    display_name: Optional[str] = None
    email: str
    trust_score: float
    verification_status: VerificationStatus
    profile_completion: float
    is_suspended: bool
    admin_note: Optional[str] = None
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
    admin_notes: Optional[str] = None
    created_at: datetime
    
    class Config:
        from_attributes = True


class AdminDashboardStats(BaseModel):
    """Schema for admin dashboard statistics."""
    total_influencers: int
    verified_influencers: int
    pending_verifications: int
    active_brands: int
    live_campaigns: int
    reported_issues: int


class AdminBrandResponse(BaseModel):
    """Schema for admin brand listing."""
    id: int
    user_id: int
    company_name: Optional[str] = None
    email: str
    industry: Optional[str] = None
    location: Optional[str] = None
    status: BrandStatus
    campaign_count: int = 0
    created_at: datetime

    class Config:
        from_attributes = True


class AdminCampaignResponse(BaseModel):
    """Schema for admin campaign listing."""
    id: int
    name: str
    brand_name: Optional[str] = None
    category: Optional[str] = None
    status: str
    platforms: List[str] = []
    budget_min: Optional[float] = None
    budget_max: Optional[float] = None
    location: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True


class AdminVerificationResponse(BaseModel):
    """Schema for admin verification request listing."""
    id: int
    influencer_id: int
    influencer_name: Optional[str] = None
    status: str
    metrics_snapshot: Optional[Dict[str, Any]] = None
    created_at: datetime
    reviewed_at: Optional[datetime] = None
    admin_reason: Optional[str] = None

    class Config:
        from_attributes = True


class AdminVerificationDecision(BaseModel):
    """Schema for admin to approve/reject a verification."""
    reason: Optional[str] = Field(None, max_length=500, description="Reason for approval/rejection")
