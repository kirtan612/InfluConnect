"""
Notification schemas for request/response validation.
"""
from datetime import datetime
from pydantic import BaseModel


class NotificationResponse(BaseModel):
    """Schema for notification response."""
    id: int
    user_id: int
    message: str
    type: str
    related_id: int | None
    is_read: bool
    created_at: datetime
    
    class Config:
        from_attributes = True


class UnreadCountResponse(BaseModel):
    """Schema for unread notification count."""
    count: int
