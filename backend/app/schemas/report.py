"""
Report schemas for reporting violations.
"""
from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field
from app.core.roles import ReportStatus


class ReportCreate(BaseModel):
    """Schema for creating a report."""
    reported_entity_type: str = Field(..., description="Type: influencer, brand, campaign, agreement, dispute")
    reported_entity_id: int = Field(..., description="ID of the entity being reported")
    reason: str = Field(..., min_length=10, max_length=500, description="Brief reason for report")
    description: Optional[str] = Field(None, max_length=2000, description="Detailed description")


class ReportResponse(BaseModel):
    """Schema for report response."""
    id: int
    reported_by: int
    reported_entity_type: str
    reported_entity_id: int
    reason: str
    description: Optional[str] = None
    status: ReportStatus
    admin_notes: Optional[str] = None
    reviewed_by: Optional[int] = None
    reviewed_at: Optional[datetime] = None
    created_at: datetime
    
    class Config:
        from_attributes = True


class ReportReview(BaseModel):
    """Schema for admin reviewing a report."""
    status: ReportStatus = Field(..., description="New status: reviewed or resolved")
    admin_notes: str = Field(..., min_length=10, max_length=1000, description="Admin notes on the report")


class ReportReviewResponse(BaseModel):
    """Response after admin reviews a report."""
    message: str
    report_id: int
    status: ReportStatus
    reviewed_by: int
    reviewed_at: datetime
