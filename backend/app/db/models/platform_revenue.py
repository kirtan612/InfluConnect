"""
Platform Revenue model for tracking platform earnings.
"""
from sqlalchemy import Column, Integer, String, DECIMAL, TIMESTAMP, Text, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime

from app.db.base import Base


class PlatformRevenue(Base):
    """
    Platform Revenue model.
    Tracks all platform earnings from campaigns.
    """
    __tablename__ = "platform_revenue"
    
    id = Column(Integer, primary_key=True, index=True)
    campaign_id = Column(Integer, ForeignKey("campaigns.id", ondelete="CASCADE"), nullable=False)
    brand_fee = Column(DECIMAL(10, 2), nullable=False)
    influencer_fee = Column(DECIMAL(10, 2), nullable=False)
    total_fee = Column(DECIMAL(10, 2), nullable=False)
    fee_type = Column(String(20), nullable=False)  # 'brand_payment' or 'influencer_payment'
    created_at = Column(TIMESTAMP, default=datetime.utcnow)
    notes = Column(Text, nullable=True)
    
    # Relationships
    campaign = relationship("Campaign", back_populates="revenue_records")
    
    def __repr__(self):
        return f"<PlatformRevenue(id={self.id}, campaign_id={self.campaign_id}, total_fee={self.total_fee})>"
