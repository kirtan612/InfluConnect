"""
BrandProfile model.
"""
from datetime import datetime
from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Enum
from sqlalchemy.orm import relationship

from app.db.base import Base
from app.core.roles import BrandStatus


class BrandProfile(Base):
    """
    Profile for brand users.
    Contains brand-specific information and status.
    """
    __tablename__ = "brand_profiles"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True, nullable=False)
    company_name = Column(String(150), nullable=False)
    industry = Column(String(100), nullable=True)
    location = Column(String(200), nullable=True)
    status = Column(Enum(BrandStatus), default=BrandStatus.ACTIVE)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    user = relationship("User", back_populates="brand_profile")
    campaigns = relationship("Campaign", back_populates="brand")
    
    def __repr__(self):
        return f"<BrandProfile {self.id} - {self.company_name}>"
