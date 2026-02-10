"""
Collaboration request schemas.
"""
from datetime import datetime
from typing import Optional
from pydantic import BaseModel
from app.core.roles import CollaborationRequestStatus


class CollaborationRequestCreate(BaseModel):
    """Schema for creating collaboration request."""
    campaign_id: int
    influencer_id: int


class CollaborationRequestUpdate(BaseModel):
    """Schema for updating collaboration request status."""
    status: CollaborationRequestStatus


class CollaborationRequestResponse(BaseModel):
    """Schema for collaboration request response."""
    id: int
    campaign_id: int
    influencer_id: int
    status: CollaborationRequestStatus
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True


class CollaborationRequestWithDetails(CollaborationRequestResponse):
    """Extended response with related data."""
    campaign_name: str
    influencer_display_name: Optional[str]
    influencer_trust_score: float
