"""
Celery worker entry point for InfluConnect.
"""
from app.core.celery_config import celery_app

# Import tasks to register them
from app.tasks import automation_tasks

if __name__ == "__main__":
    celery_app.start()