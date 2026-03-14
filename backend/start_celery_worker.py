#!/usr/bin/env python3
"""
Celery worker startup script for InfluConnect.
"""
import os
import sys
from pathlib import Path

# Add the app directory to Python path
app_dir = Path(__file__).parent
sys.path.insert(0, str(app_dir))

from app.core.celery_config import celery_app

if __name__ == "__main__":
    # Start the Celery worker
    celery_app.worker_main([
        "worker",
        "--loglevel=info",
        "--concurrency=2",
        "--queues=automation,celery"
    ])