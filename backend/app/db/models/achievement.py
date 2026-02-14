"""
Achievement model for influencer milestones.
"""
from datetime import datetime
from sqlalchemy import Column, Integer, String, ForeignKey, DateTime
from sqlalchemy.orm import relationship

from app.db.base import Base


class Achievement(Base):
    """
    Achievement / milestone for influencer profiles.
    """
    __tablename__ = "achievements"

    id = Column(Integer, primary_key=True, index=True)
    influencer_id = Column(Integer, ForeignKey("influencer_profiles.id"), nullable=False)
    title = Column(String(200), nullable=False)
    description = Column(String(1000), nullable=True)
    date = Column(String(50), nullable=True)
    icon = Column(String(50), nullable=True)
    proof_link = Column(String(500), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    # Relationships
    influencer = relationship("InfluencerProfile", back_populates="achievements")

    def __repr__(self):
        return f"<Achievement {self.id} - {self.title}>"
