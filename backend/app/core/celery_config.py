"""
Celery configuration for InfluConnect background tasks.
"""
from celery import Celery
from celery.schedules import crontab
from app.core.config import settings

# Create Celery instance
celery_app = Celery(
    "influconnect",
    broker=settings.CELERY_BROKER_URL,
    backend=settings.CELERY_RESULT_BACKEND,
    include=["app.tasks.automation_tasks"]
)

# Celery configuration
celery_app.conf.update(
    # Task settings
    task_serializer="json",
    accept_content=["json"],
    result_serializer="json",
    timezone="UTC",
    enable_utc=True,
    
    # Result backend settings
    result_expires=3600,  # 1 hour
    
    # Worker settings
    worker_prefetch_multiplier=1,
    task_acks_late=True,
    
    # Beat schedule for automated tasks
    beat_schedule={
        # Trust score recalculation - daily at 2 AM
        "recalculate-trust-scores": {
            "task": "app.tasks.automation_tasks.recalculate_trust_scores",
            "schedule": crontab(hour=2, minute=0),
        },
        
        # Suspicious account detection - daily at 3 AM
        "flag-suspicious-influencers": {
            "task": "app.tasks.automation_tasks.flag_suspicious_influencers",
            "schedule": crontab(hour=3, minute=0),
        },
        
        # Inactive influencer downgrade - weekly (Sunday at 4 AM)
        "downgrade-inactive-influencers": {
            "task": "app.tasks.automation_tasks.downgrade_inactive_influencers",
            "schedule": crontab(hour=4, minute=0, day_of_week=0),
        },
        
        # Profile completion update - daily at 1 AM
        "update-profile-completion": {
            "task": "app.tasks.automation_tasks.update_profile_completion",
            "schedule": crontab(hour=1, minute=0),
        },
    },
)

# Task routes (optional - for task routing to specific queues)
celery_app.conf.task_routes = {
    "app.tasks.automation_tasks.*": {"queue": "automation"},
}