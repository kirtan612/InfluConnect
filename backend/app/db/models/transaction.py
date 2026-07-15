"""
Transaction model for simulated escrow system.
"""
from sqlalchemy import Column, Integer, Float, String, ForeignKey, DateTime, Text, Enum as SQLEnum
from sqlalchemy.orm import relationship
from datetime import datetime
import enum

from app.db.base import Base


class TransactionStatus(str, enum.Enum):
    """Transaction status enum."""
    HELD = "held"
    ACTIVE = "active"
    DISPUTE = "dispute"
    ADMIN_REVIEW = "admin_review"
    RELEASED = "released"
    REFUNDED = "refunded"


class AgreementStatus(str, enum.Enum):
    """Agreement status enum."""
    PENDING = "pending"
    ACTIVE = "active"


class DisputeStatus(str, enum.Enum):
    """Dispute status enum."""
    OPEN = "open"
    RESOLVED = "resolved"


class Transaction(Base):
    """Escrow transaction model."""
    __tablename__ = "transactions"
    
    id = Column(Integer, primary_key=True, index=True)
    
    # Parties
    buyer_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    seller_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    
    # Amount
    amount = Column(Float, nullable=False)
    
    # Status
    status = Column(SQLEnum(TransactionStatus), default=TransactionStatus.HELD, nullable=False)
    
    # Agreement
    agreement_status = Column(SQLEnum(AgreementStatus), default=AgreementStatus.PENDING, nullable=False)
    buyer_accepted = Column(Integer, default=False, nullable=False)  # Using Integer for boolean
    seller_accepted = Column(Integer, default=False, nullable=False)
    buyer_accepted_at = Column(DateTime, nullable=True)
    seller_accepted_at = Column(DateTime, nullable=True)
    
    # Dispute
    dispute_count = Column(Integer, default=0, nullable=False)
    dispute_status = Column(SQLEnum(DisputeStatus), nullable=True)
    dispute_reason = Column(Text, nullable=True)
    dispute_raised_by = Column(Integer, ForeignKey("users.id"), nullable=True)
    dispute_raised_at = Column(DateTime, nullable=True)
    
    # Admin resolution
    admin_resolved_by = Column(Integer, ForeignKey("users.id"), nullable=True)
    admin_resolved_at = Column(DateTime, nullable=True)
    admin_notes = Column(Text, nullable=True)
    
    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    buyer = relationship("User", foreign_keys=[buyer_id], backref="purchases")
    seller = relationship("User", foreign_keys=[seller_id], backref="sales")
    dispute_raiser = relationship("User", foreign_keys=[dispute_raised_by])
    admin_resolver = relationship("User", foreign_keys=[admin_resolved_by])
