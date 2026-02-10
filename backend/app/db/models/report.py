"""
Report model for reporting violations.
"""
from datetime import datetime
from sqlalchemy import Column, Integer, String, DateTime, Enum

from app.db.base import Base
from app.core.roles import ReportStatus


class Report(Base):
    """
    Reports for flagging suspicious or violating profiles.
    """
    __tablename__ = "reports"
    
    id = Column(Integer, primary_key=True, index=True)
    reported_entity_type = Column(String(50), nullable=False)  # "influencer" or "brand"
    reported_entity_id = Column(Integer, nullable=False)  # ID of the flagged profile
    reason = Column(String(500), nullable=False)
    status = Column(Enum(ReportStatus), default=ReportStatus.PENDING)
    admin_notes = Column(String(1000), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    
    def __repr__(self):
        return f"<Report {self.id}>"
