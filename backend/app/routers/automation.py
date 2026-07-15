"""
Admin automation endpoints for manually triggering background tasks.
"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import Dict, Any

from app.core.dependencies import get_current_user
from app.core.roles import UserRole
from app.db.session import get_db
from app.db.models.user import User
from app.tasks.automation_tasks import (
    recalculate_trust_scores,
    flag_suspicious_influencers,
    downgrade_inactive_influencers,
    update_profile_completion
)

router = APIRouter(prefix="/admin/automation", tags=["admin-automation"])


def get_admin_user(current_user: User = Depends(get_current_user)) -> User:
    """Dependency to ensure only admin users can access automation endpoints."""
    if current_user.role != UserRole.ADMIN:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin access required"
        )
    return current_user


@router.post("/run/trust-score", response_model=Dict[str, Any])
async def trigger_trust_score_recalculation(
    admin_user: User = Depends(get_admin_user),
    db: Session = Depends(get_db)
):
    """
    Manually trigger trust score recalculation for all influencers.
    
    This endpoint starts a background Celery task to recalculate trust scores
    based on current profile data, verification status, and engagement metrics.
    """
    try:
        # Trigger the Celery task
        task = recalculate_trust_scores.delay()
        
        return {
            "message": "Trust score recalculation task started",
            "task_id": task.id,
            "status": "started",
            "triggered_by": admin_user.email,
            "endpoint": "/admin/automation/run/trust-score"
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to start trust score recalculation: {str(e)}"
        )


@router.post("/run/suspicious-scan", response_model=Dict[str, Any])
async def trigger_suspicious_account_scan(
    admin_user: User = Depends(get_admin_user),
    db: Session = Depends(get_db)
):
    """
    Manually trigger suspicious account detection scan.
    
    This endpoint starts a background Celery task to analyze all influencer
    accounts for suspicious patterns and flag potentially problematic accounts.
    """
    try:
        # Trigger the Celery task
        task = flag_suspicious_influencers.delay()
        
        return {
            "message": "Suspicious account scan task started",
            "task_id": task.id,
            "status": "started",
            "triggered_by": admin_user.email,
            "endpoint": "/admin/automation/run/suspicious-scan"
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to start suspicious account scan: {str(e)}"
        )


@router.post("/run/inactive-check", response_model=Dict[str, Any])
async def trigger_inactive_influencer_check(
    admin_user: User = Depends(get_admin_user),
    db: Session = Depends(get_db)
):
    """
    Manually trigger inactive influencer downgrade process.
    
    This endpoint starts a background Celery task to identify inactive
    influencers and downgrade their trust scores accordingly.
    """
    try:
        # Trigger the Celery task
        task = downgrade_inactive_influencers.delay()
        
        return {
            "message": "Inactive influencer check task started",
            "task_id": task.id,
            "status": "started",
            "triggered_by": admin_user.email,
            "endpoint": "/admin/automation/run/inactive-check"
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to start inactive influencer check: {str(e)}"
        )


@router.post("/run/update-completion", response_model=Dict[str, Any])
async def trigger_profile_completion_update(
    admin_user: User = Depends(get_admin_user),
    db: Session = Depends(get_db)
):
    """
    Manually trigger profile completion percentage update.
    
    This endpoint starts a background Celery task to recalculate profile
    completion percentages for all influencers based on current profile data.
    """
    try:
        # Trigger the Celery task
        task = update_profile_completion.delay()
        
        return {
            "message": "Profile completion update task started",
            "task_id": task.id,
            "status": "started",
            "triggered_by": admin_user.email,
            "endpoint": "/admin/automation/run/update-completion"
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to start profile completion update: {str(e)}"
        )


@router.get("/tasks/status/{task_id}", response_model=Dict[str, Any])
async def get_task_status(
    task_id: str,
    admin_user: User = Depends(get_admin_user)
):
    """
    Get the status of a background task.
    
    Returns the current status and result (if completed) of a Celery task.
    """
    try:
        from app.core.celery_config import celery_app
        
        # Get task result
        result = celery_app.AsyncResult(task_id)
        
        response = {
            "task_id": task_id,
            "status": result.status,
            "current": getattr(result, 'current', 0),
            "total": getattr(result, 'total', 1),
        }
        
        if result.ready():
            if result.successful():
                response["result"] = result.result
            else:
                response["error"] = str(result.info)
        else:
            response["info"] = result.info
        
        return response
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to get task status: {str(e)}"
        )


@router.get("/tasks/active", response_model=Dict[str, Any])
async def get_active_tasks(
    admin_user: User = Depends(get_admin_user)
):
    """
    Get list of currently active/running tasks.
    
    Returns information about all currently running background tasks.
    """
    try:
        from app.core.celery_config import celery_app
        
        # Get active tasks from all workers
        inspect = celery_app.control.inspect()
        active_tasks = inspect.active()
        
        if not active_tasks:
            return {
                "active_tasks": [],
                "total_active": 0,
                "message": "No active tasks found"
            }
        
        # Flatten the active tasks from all workers
        all_active = []
        for worker, tasks in active_tasks.items():
            for task in tasks:
                task["worker"] = worker
                all_active.append(task)
        
        return {
            "active_tasks": all_active,
            "total_active": len(all_active),
            "workers": list(active_tasks.keys())
        }
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to get active tasks: {str(e)}"
        )