"""
User model - base user table for all roles.
"""
from datetime import datetime
from sqlalchemy import Column, Integer, String, Boolean, DateTime, Enum
from sqlalchemy.orm import relationship

from app.db.base import Base
from app.core.roles import UserRole


class User(Base):
    """
    Base user table for all roles (INFLUENCER, BRAND, ADMIN).
    """
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    password_hash = Column(String, nullable=False)
    role = Column(Enum(UserRole), nullable=False)
    is_active = Column(Boolean, default=True)
    is_suspended = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    
    # Relationships
    influencer_profile = relationship("InfluencerProfile", back_populates="user", uselist=False)
    brand_profile = relationship("BrandProfile", back_populates="user", uselist=False)
    notifications = relationship("Notification", back_populates="user", cascade="all, delete-orphan")
    
    def __repr__(self):
        return f"<User {self.id} - {self.email} ({self.role})>"
