"""
Achievement schemas for request/response validation.
"""
from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field


class AchievementCreate(BaseModel):
    """Schema for creating an achievement."""
    title: str = Field(..., max_length=200)
    description: Optional[str] = Field(None, max_length=1000)
    date: Optional[str] = Field(None, max_length=50)
    icon: Optional[str] = Field(None, max_length=50)
    proof_link: Optional[str] = Field(None, max_length=500)


class AchievementResponse(BaseModel):
    """Schema for achievement response."""
    id: int
    influencer_id: int
    title: str
    description: Optional[str]
    date: Optional[str]
    icon: Optional[str]
    proof_link: Optional[str]
    created_at: datetime

    class Config:
        from_attributes = True
