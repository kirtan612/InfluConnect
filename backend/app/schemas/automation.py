"""
Pydantic schemas for automation tasks and responses.
"""
from datetime import datetime
from typing import Optional, Dict, Any, List
from pydantic import BaseModel, Field


class TaskResponse(BaseModel):
    """Base response schema for automation tasks."""
    message: str
    task_id: str
    status: str
    triggered_by: Optional[str] = None
    endpoint: Optional[str] = None


class TaskStatusResponse(BaseModel):
    """Response schema for task status queries."""
    task_id: str
    status: str
    current: Optional[int] = 0
    total: Optional[int] = 1
    result: Optional[Dict[str, Any]] = None
    error: Optional[str] = None
    info: Optional[Any] = None


class ActiveTaskInfo(BaseModel):
    """Information about an active task."""
    id: str
    name: str
    args: List[Any]
    kwargs: Dict[str, Any]
    worker: Optional[str] = None
    time_start: Optional[float] = None


class ActiveTasksResponse(BaseModel):
    """Response schema for active tasks query."""
    active_tasks: List[ActiveTaskInfo]
    total_active: int
    workers: List[str]
    message: Optional[str] = None


class TaskResult(BaseModel):
    """Schema for completed task results."""
    task_id: str
    status: str
    total_processed: Optional[int] = None
    updated_count: Optional[int] = None
    flagged_count: Optional[int] = None
    downgraded_count: Optional[int] = None
    execution_time: str
    message: str
    error: Optional[str] = None


class InfluencerMetrics(BaseModel):
    """Schema for influencer metrics used in automation."""
    id: int
    display_name: Optional[str] = None
    followers: int = 0
    engagement_rate: float = 0.0
    trust_score: float = 0.0
    profile_completion: float = 0.0
    suspicious_flag: bool = False
    last_active: Optional[datetime] = None
    verification_status: str
    created_at: datetime


class TrustScoreUpdate(BaseModel):
    """Schema for trust score updates."""
    influencer_id: int
    old_score: float
    new_score: float
    reason: str
    updated_at: datetime


class SuspiciousActivity(BaseModel):
    """Schema for suspicious activity detection."""
    influencer_id: int
    reasons: List[str]
    flagged_at: datetime
    previous_flag_status: bool


class ProfileCompletionUpdate(BaseModel):
    """Schema for profile completion updates."""
    influencer_id: int
    old_completion: float
    new_completion: float
    missing_fields: List[str]
    updated_at: datetime


class AutomationStats(BaseModel):
    """Schema for automation statistics."""
    total_influencers: int
    verified_influencers: int
    suspicious_influencers: int
    avg_trust_score: float
    avg_profile_completion: float
    last_automation_run: Optional[datetime] = None