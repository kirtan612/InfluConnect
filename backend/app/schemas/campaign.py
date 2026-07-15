"""
Campaign schemas.
"""
from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, Field, field_validator
from app.core.roles import CampaignStatus, AllowedPlatforms


class CampaignBase(BaseModel):
    """Base schema for campaign."""
    name: str = Field(..., max_length=200)
    description: Optional[str] = Field(None, max_length=2000)
    category: Optional[str] = Field(None, max_length=100)
    platforms: List[str] = Field(default_factory=list)
    budget_min: Optional[float] = None
    budget_max: Optional[float] = None
    
    @field_validator('platforms')
    @classmethod
    def validate_platforms(cls, v: List[str]) -> List[str]:
        """Validate that only allowed platforms are used."""
        allowed = {p.value for p in AllowedPlatforms}
        for platform in v:
            if platform not in allowed:
                raise ValueError(f"Invalid platform: {platform}. Allowed: {allowed}")
        return v


class CampaignCreate(CampaignBase):
    """Schema for creating campaign with escrow."""
    budget_amount: Optional[float] = Field(None, description="Actual budget amount for escrow (if not provided, uses budget_max)")
    
    @field_validator('budget_amount')
    @classmethod
    def validate_budget_amount(cls, v: Optional[float]) -> Optional[float]:
        """Validate budget amount is positive."""
        if v is not None and v <= 0:
            raise ValueError("Budget amount must be positive")
        return v


class CampaignUpdate(BaseModel):
    """Schema for updating campaign."""
    name: Optional[str] = Field(None, max_length=200)
    description: Optional[str] = Field(None, max_length=2000)
    category: Optional[str] = Field(None, max_length=100)
    platforms: Optional[List[str]] = None
    budget_min: Optional[float] = None
    budget_max: Optional[float] = None
    status: Optional[CampaignStatus] = None
    
    @field_validator('platforms')
    @classmethod
    def validate_platforms(cls, v: Optional[List[str]]) -> Optional[List[str]]:
        """Validate that only allowed platforms are used."""
        if v is None:
            return v
        allowed = {p.value for p in AllowedPlatforms}
        for platform in v:
            if platform not in allowed:
                raise ValueError(f"Invalid platform: {platform}. Allowed: {allowed}")
        return v


class CampaignResponse(CampaignBase):
    """Schema for campaign response with escrow details."""
    id: int
    brand_id: int
    status: CampaignStatus
    
    # Escrow fields
    budget_amount: Optional[float] = None
    brand_fee: Optional[float] = None
    influencer_fee: Optional[float] = None
    total_payment: Optional[float] = None
    escrow_status: Optional[str] = None
    funds_locked_at: Optional[datetime] = None
    funds_released_at: Optional[datetime] = None
    
    # Agreement fields
    brand_accepted_terms: bool = False
    brand_accepted_at: Optional[datetime] = None
    influencer_accepted_terms: bool = False
    influencer_accepted_at: Optional[datetime] = None
    
    # Dispute fields
    dispute_count: int = 0
    dispute_reason: Optional[str] = None
    admin_decision: Optional[str] = None
    admin_decided_at: Optional[datetime] = None
    admin_decided_by: Optional[int] = None
    
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    @field_validator('platforms', mode='before')
    @classmethod
    def ensure_platforms_list(cls, v):
        """Ensure platforms is always a list."""
        if v is None:
            return []
        if isinstance(v, str):
            # If it's a string representation, try to parse it
            import json
            try:
                return json.loads(v)
            except:
                return []
        return v
    
    class Config:
        from_attributes = True


class EscrowDetailsResponse(BaseModel):
    """Detailed escrow breakdown for transparency."""
    campaign_id: int
    campaign_name: str
    budget_amount: float
    brand_fee: float
    influencer_fee: float
    total_payment: float
    influencer_receives: float
    total_platform_fee: float
    escrow_status: str
    funds_locked_at: Optional[datetime] = None
    funds_released_at: Optional[datetime] = None


class AdminReleaseRequest(BaseModel):
    """Request to release funds to influencer."""
    admin_notes: Optional[str] = Field(None, max_length=1000)


class AdminRefundRequest(BaseModel):
    """Request to refund to brand."""
    admin_notes: Optional[str] = Field(None, max_length=1000)
    refund_brand_fee: bool = Field(False, description="Whether to refund the brand fee as well")


class AgreementAcceptResponse(BaseModel):
    """Response after accepting agreement."""
    message: str
    campaign_id: int
    accepted_by: str  # "brand" or "influencer"
    accepted_at: datetime
    both_accepted: bool
    campaign_status: CampaignStatus


class DisputeCreate(BaseModel):
    """Schema for creating a dispute."""
    reason: str = Field(..., min_length=10, max_length=1000)


class DisputeResponse(BaseModel):
    """Response after raising a dispute."""
    message: str
    campaign_id: int
    dispute_count: int
    status: CampaignStatus
    escalated_to_admin: bool


class AdminDecision(BaseModel):
    """Schema for admin decision on dispute."""
    decision: str = Field(..., min_length=10, max_length=1000)
    final_status: CampaignStatus = Field(..., description="Must be 'completed' or 'rejected'")
    
    @field_validator('final_status')
    @classmethod
    def validate_final_status(cls, v: CampaignStatus) -> CampaignStatus:
        """Ensure admin can only set completed or rejected status."""
        if v not in [CampaignStatus.COMPLETED, CampaignStatus.REJECTED]:
            raise ValueError("Admin can only set status to 'completed' or 'rejected'")
        return v


class AdminDecisionResponse(BaseModel):
    """Response after admin makes a decision."""
    message: str
    campaign_id: int
    decision: str
    final_status: CampaignStatus
    decided_at: datetime
    decided_by: int



class PlatformRevenueResponse(BaseModel):
    """Platform revenue record response."""
    id: int
    campaign_id: int
    brand_fee: float
    influencer_fee: float
    total_fee: float
    fee_type: str
    created_at: datetime
    notes: Optional[str] = None
    
    class Config:
        from_attributes = True


class PlatformRevenueStats(BaseModel):
    """Platform revenue statistics."""
    total_revenue: float
    brand_fees_total: float
    influencer_fees_total: float
    total_campaigns: int
    revenue_by_campaign: List[dict]


class AdminEscrowStats(BaseModel):
    """Admin escrow system statistics."""
    total_locked_funds: float
    total_campaigns_with_escrow: int
    campaigns_by_escrow_status: dict
    platform_revenue: PlatformRevenueStats
    recent_transactions: List[dict]
