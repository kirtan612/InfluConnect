"""
CollaborationRequest model.
"""
from datetime import datetime
from sqlalchemy import Column, Integer, ForeignKey, DateTime, Enum
from sqlalchemy.orm import relationship

from app.db.base import Base
from app.core.roles import CollaborationRequestStatus


class CollaborationRequest(Base):
    """
    Request from brand to collaborate with influencer.
    """
    __tablename__ = "collaboration_requests"
    
    id = Column(Integer, primary_key=True, index=True)
    campaign_id = Column(Integer, ForeignKey("campaigns.id"), nullable=False)
    influencer_id = Column(Integer, ForeignKey("influencer_profiles.id"), nullable=False)
    status = Column(
        Enum(CollaborationRequestStatus),
        default=CollaborationRequestStatus.PENDING
    )
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    campaign = relationship("Campaign", back_populates="collaboration_requests")
    influencer = relationship("InfluencerProfile", back_populates="collaboration_requests")
    
    def __repr__(self):
        return f"<CollaborationRequest {self.id}>"
