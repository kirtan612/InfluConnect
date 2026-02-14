"""
Database initialization.
Creates all tables from imported models.
"""
from app.db.base import Base
from app.db.session import engine

# Import ALL models so they are registered with Base
from app.db.models.user import User
from app.db.models.influencer import InfluencerProfile
from app.db.models.brand import BrandProfile
from app.db.models.campaign import Campaign
from app.db.models.request import CollaborationRequest
from app.db.models.verification import VerificationRequest
from app.db.models.report import Report
from app.db.models.achievement import Achievement


def init_db():
    """Create all database tables."""
    Base.metadata.create_all(bind=engine)
    print("Database tables created successfully.")


if __name__ == "__main__":
    init_db()
