"""
InfluencerProfile model.
"""
from datetime import datetime
from sqlalchemy import Column, Integer, String, Float, ForeignKey, DateTime, Enum, JSON
from sqlalchemy.orm import relationship

from app.db.base import Base
from app.core.roles import VerificationStatus


class InfluencerProfile(Base):
    """
    Profile for influencer users.
    Contains influencer-specific data and trust metrics.
    """
    __tablename__ = "influencer_profiles"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True, nullable=False)
    display_name = Column(String(100), nullable=True)
    bio = Column(String(500), nullable=True)
    category = Column(String(100), nullable=True)  # Fashion, Tech, Beauty, etc.
    trust_score = Column(Float, default=0.0)  # 0-100
    verification_status = Column(
        Enum(VerificationStatus),
        default=VerificationStatus.UNVERIFIED
    )
    profile_completion = Column(Float, default=0.0)  # 0-100 percentage
    admin_note = Column(String(500), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    user = relationship("User", back_populates="influencer_profile")
    collaboration_requests = relationship("CollaborationRequest", back_populates="influencer")
    verification_requests = relationship("VerificationRequest", back_populates="influencer")
    
    def __repr__(self):
        return f"<InfluencerProfile {self.id} - {self.display_name}>"
