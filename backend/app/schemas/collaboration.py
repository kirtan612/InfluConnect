"""
Collaboration schemas for request/response validation.
"""
from datetime import datetime
from typing import Optional, List, Dict, Any
from pydantic import BaseModel, Field
from app.core.roles import CollaborationStatus, PaymentStatus


class CollaborationBase(BaseModel):
    """Base schema for collaboration."""
    pass


class CollaborationResponse(BaseModel):
    """Schema for collaboration response."""
    id: int
    request_id: int
    campaign_id: int
    influencer_id: int
    brand_id: int
    status: CollaborationStatus
    payment_status: PaymentStatus
    deliverables: Dict[str, Any]
    content_links: List[Dict[str, Any]]
    deadline: Optional[datetime]
    created_at: datetime
    updated_at: datetime
    completed_at: Optional[datetime]
    progress_percentage: int  # Calculated field
    
    class Config:
        from_attributes = True


class SetDeliverablesRequest(BaseModel):
    """Schema for setting deliverables."""
    description: str = Field(..., min_length=1, max_length=2000)
    requirements: List[str] = Field(..., min_items=1)
    deadline: datetime


class SubmitContentRequest(BaseModel):
    """Schema for submitting content."""
    content_links: List[Dict[str, str]] = Field(..., min_items=1)
    # Each dict should have: {"url": "...", "platform": "...", "description": "..."}


class ApproveContentRequest(BaseModel):
    """Schema for approving content (optional feedback)."""
    feedback: Optional[str] = Field(None, max_length=1000)


class CompleteCollaborationRequest(BaseModel):
    """Schema for completing collaboration."""
    final_notes: Optional[str] = Field(None, max_length=1000)


class CollaborationWithDetails(CollaborationResponse):
    """Extended response with related data."""
    campaign_name: str
    brand_company_name: str
    influencer_display_name: Optional[str]
