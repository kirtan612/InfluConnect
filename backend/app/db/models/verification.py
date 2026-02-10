"""
VerificationRequest model.
"""
from datetime import datetime
from sqlalchemy import Column, Integer, ForeignKey, DateTime, Enum, JSON, String
from sqlalchemy.orm import relationship

from app.db.base import Base
from app.core.roles import VerificationStatus


class VerificationRequest(Base):
    """
    Verification request submitted by influencers.
    Admin reviews and approves/rejects.
    """
    __tablename__ = "verification_requests"
    
    id = Column(Integer, primary_key=True, index=True)
    influencer_id = Column(Integer, ForeignKey("influencer_profiles.id"), nullable=False)
    # Snapshot of metrics at submission time (JSON)
    metrics_snapshot = Column(JSON, nullable=True)
    status = Column(Enum(VerificationStatus), default=VerificationStatus.PENDING)
    admin_reason = Column(String(500), nullable=True)  # Reason for approval/rejection
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    reviewed_at = Column(DateTime, nullable=True)
    
    # Relationships
    influencer = relationship("InfluencerProfile", back_populates="verification_requests")
    
    def __repr__(self):
        return f"<VerificationRequest {self.id}>"
