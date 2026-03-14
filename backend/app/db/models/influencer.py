"""
InfluencerProfile model.
"""
from datetime import datetime
from sqlalchemy import Column, Integer, String, Float, ForeignKey, DateTime, Enum, JSON, Boolean
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
    
    # Metrics for automation tasks
    followers = Column(Integer, default=0)  # Follower count
    engagement_rate = Column(Float, default=0.0)  # Engagement rate (0.0-1.0)
    trust_score = Column(Float, default=0.0)  # 0-100
    profile_completion = Column(Float, default=0.0)  # 0-100 percentage
    
    # Status fields
    verification_status = Column(
        Enum(VerificationStatus),
        default=VerificationStatus.UNVERIFIED
    )
    suspicious_flag = Column(Boolean, default=False)  # For suspicious detection
    last_active = Column(DateTime, nullable=True)  # Last activity timestamp
    
    # Admin and system fields
    admin_note = Column(String(500), nullable=True)
    profile_image_url = Column(String(500), nullable=True)
    cover_image_url = Column(String(500), nullable=True)
    social_links = Column(JSON, nullable=True)  # {"instagram": "...", "youtube": "..."}
    platforms = Column(JSON, default=lambda: [])  # ["Instagram", "YouTube"]
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    user = relationship("User", back_populates="influencer_profile")
    collaboration_requests = relationship("CollaborationRequest", back_populates="influencer")
    verification_requests = relationship("VerificationRequest", back_populates="influencer")
    achievements = relationship("Achievement", back_populates="influencer")
    
    def __repr__(self):
        return f"<InfluencerProfile {self.id} - {self.display_name}>"
