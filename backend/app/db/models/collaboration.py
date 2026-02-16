"""
Collaboration model - Active collaborations after request acceptance.
"""
from datetime import datetime
from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Enum, JSON
from sqlalchemy.orm import relationship

from app.db.base import Base
from app.core.roles import CollaborationStatus, PaymentStatus


class Collaboration(Base):
    """
    Active collaboration between brand and influencer.
    Created when a CollaborationRequest is accepted.
    """
    __tablename__ = "collaborations"
    
    id = Column(Integer, primary_key=True, index=True)
    request_id = Column(Integer, ForeignKey("collaboration_requests.id"), nullable=False, unique=True)
    campaign_id = Column(Integer, ForeignKey("campaigns.id"), nullable=False)
    influencer_id = Column(Integer, ForeignKey("influencer_profiles.id"), nullable=False)
    brand_id = Column(Integer, ForeignKey("brand_profiles.id"), nullable=False)
    
    # Status tracking
    status = Column(
        Enum(CollaborationStatus),
        default=CollaborationStatus.ACTIVE,
        nullable=False
    )
    payment_status = Column(
        Enum(PaymentStatus),
        default=PaymentStatus.PENDING,
        nullable=False
    )
    
    # Deliverables and content
    deliverables = Column(JSON, default=lambda: {})  # {"description": "...", "requirements": [...]}
    content_links = Column(JSON, default=lambda: [])  # [{"url": "...", "platform": "...", "submitted_at": "..."}]
    deadline = Column(DateTime, nullable=True)
    
    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    completed_at = Column(DateTime, nullable=True)
    
    # Relationships
    request = relationship("CollaborationRequest", backref="collaboration", uselist=False)
    campaign = relationship("Campaign")
    influencer = relationship("InfluencerProfile")
    brand = relationship("BrandProfile")
    
    def __repr__(self):
        return f"<Collaboration {self.id} - {self.status}>"
