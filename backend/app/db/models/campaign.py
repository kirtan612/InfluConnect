"""
Campaign model with integrated escrow system.
"""
from datetime import datetime
from sqlalchemy import Column, Integer, String, Float, DECIMAL, ForeignKey, DateTime, Enum, JSON, Boolean
from sqlalchemy.orm import relationship

from app.db.base import Base
from app.core.roles import CampaignStatus


class Campaign(Base):
    """
    Marketing campaign created by brands.
    Now includes escrow functionality - campaign acts as escrow contract.
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
    
    # Escrow fields (NEW - Campaign-based escrow)
    budget_amount = Column(DECIMAL(10, 2), nullable=True)  # Actual budget for escrow
    brand_fee = Column(DECIMAL(10, 2), default=0.00)  # 2.5% platform fee from brand
    influencer_fee = Column(DECIMAL(10, 2), default=0.00)  # 2.5% platform fee from influencer
    total_payment = Column(DECIMAL(10, 2), nullable=True)  # budget_amount + brand_fee
    escrow_status = Column(String(20), default='pending')  # pending/locked/released/refunded
    funds_locked_at = Column(DateTime, nullable=True)
    funds_released_at = Column(DateTime, nullable=True)
    
    # Agreement acceptance fields
    brand_accepted_terms = Column(Boolean, default=False, nullable=False)
    brand_accepted_at = Column(DateTime, nullable=True)
    influencer_accepted_terms = Column(Boolean, default=False, nullable=False)
    influencer_accepted_at = Column(DateTime, nullable=True)
    
    # Dispute management fields
    dispute_count = Column(Integer, default=0, nullable=False)
    dispute_reason = Column(String(1000), nullable=True)
    admin_decision = Column(String(1000), nullable=True)
    admin_decided_at = Column(DateTime, nullable=True)
    admin_decided_by = Column(Integer, ForeignKey("users.id"), nullable=True)
    
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    brand = relationship("BrandProfile", back_populates="campaigns")
    collaboration_requests = relationship("CollaborationRequest", back_populates="campaign")
    revenue_records = relationship("PlatformRevenue", back_populates="campaign", cascade="all, delete-orphan")
    
    def __repr__(self):
        return f"<Campaign {self.id} - {self.name} (Escrow: {self.escrow_status})>"
    
    @property
    def influencer_receives(self):
        """Calculate amount influencer will receive after platform fee."""
        if self.budget_amount:
            return float(self.budget_amount) - float(self.influencer_fee or 0)
        return 0.0
    
    @property
    def total_platform_fee(self):
        """Calculate total platform fee (brand_fee + influencer_fee)."""
        return float(self.brand_fee or 0) + float(self.influencer_fee or 0)
