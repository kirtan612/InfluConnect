"""
Report model for reporting violations.
"""
from datetime import datetime
from sqlalchemy import Column, Integer, String, DateTime, Enum, ForeignKey
from sqlalchemy.orm import relationship

from app.db.base import Base
from app.core.roles import ReportStatus


class Report(Base):
    """
    Reports for flagging suspicious or violating profiles, campaigns, and agreements.
    """
    __tablename__ = "reports"
    
    id = Column(Integer, primary_key=True, index=True)
    reported_by = Column(Integer, ForeignKey("users.id"), nullable=False)  # User who reported
    reported_entity_type = Column(String(50), nullable=False)  # "influencer", "brand", "campaign", "agreement", "dispute"
    reported_entity_id = Column(Integer, nullable=False)  # ID of the flagged entity
    reason = Column(String(500), nullable=False)
    description = Column(String(2000), nullable=True)  # Detailed description
    status = Column(Enum(ReportStatus), default=ReportStatus.PENDING)
    admin_notes = Column(String(1000), nullable=True)
    reviewed_by = Column(Integer, ForeignKey("users.id"), nullable=True)  # Admin who reviewed
    reviewed_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    
    def __repr__(self):
        return f"<Report {self.id} - {self.reported_entity_type}>"
