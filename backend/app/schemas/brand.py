"""
Brand profile schemas.
"""
from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field
from app.core.roles import BrandStatus


class BrandProfileBase(BaseModel):
    """Base schema for brand profile."""
    company_name: str = Field(..., max_length=150)
    industry: Optional[str] = Field(None, max_length=100)
    location: Optional[str] = Field(None, max_length=200)


class BrandProfileCreate(BrandProfileBase):
    """Schema for creating brand profile."""
    pass


class BrandProfileUpdate(BaseModel):
    """Schema for updating brand profile."""
    company_name: Optional[str] = Field(None, max_length=150)
    industry: Optional[str] = Field(None, max_length=100)
    location: Optional[str] = Field(None, max_length=200)


class BrandProfileResponse(BrandProfileBase):
    """Schema for brand profile response."""
    id: int
    user_id: int
    status: BrandStatus
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True
