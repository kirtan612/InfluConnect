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
    """Schema for creating campaign."""
    pass


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
    """Schema for campaign response."""
    id: int
    brand_id: int
    status: CampaignStatus
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
