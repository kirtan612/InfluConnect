"""
Campaign model.
"""
from datetime import datetime
from sqlalchemy import Column, Integer, String, Float, ForeignKey, DateTime, Enum, JSON
from sqlalchemy.orm import relationship

from app.db.base import Base
from app.core.roles import CampaignStatus


class Campaign(Base):
    """
    Marketing campaign created by brands.
    """
    __tablename__ = "campaigns"
    
    id = Column(Integer, primary_key=True, index=True)
    brand_id = Column(Integer, ForeignKey("brand_profiles.id"), nullable=False)
    name = Column(String(200), nullable=False)
    description = Column(String(2000), nullable=True)
    category = Column(String(100), nullable=True)
    # Stored as JSON list: ["Instagram", "YouTube", "LinkedIn"]
    platforms = Column(JSON, default=lambda: [])
    budget_min = Column(Float, nullable=True)
    budget_max = Column(Float, nullable=True)
    status = Column(Enum(CampaignStatus), default=CampaignStatus.DRAFT)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    brand = relationship("BrandProfile", back_populates="campaigns")
    collaboration_requests = relationship("CollaborationRequest", back_populates="campaign")
    
    def __repr__(self):
        return f"<Campaign {self.id} - {self.name}>"
