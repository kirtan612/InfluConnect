"""
Database initialization and table creation.
"""
from app.db.base import Base
from app.db.session import engine
from app.db.models import user, influencer, brand, campaign, request, verification, report


def init_db():
    """Create all database tables."""
    Base.metadata.create_all(bind=engine)
    print("✓ Database tables created successfully")


if __name__ == "__main__":
    init_db()
