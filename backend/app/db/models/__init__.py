"""
Database models package.
Import all models here so they are registered with SQLAlchemy Base.
"""
from app.db.models.user import User
from app.db.models.influencer import InfluencerProfile
from app.db.models.brand import BrandProfile
from app.db.models.campaign import Campaign
from app.db.models.request import CollaborationRequest
from app.db.models.verification import VerificationRequest
from app.db.models.report import Report
from app.db.models.achievement import Achievement

__all__ = [
    "User",
    "InfluencerProfile",
    "BrandProfile",
    "Campaign",
    "CollaborationRequest",
    "VerificationRequest",
    "Report",
    "Achievement",
]
