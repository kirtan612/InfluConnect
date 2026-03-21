"""
Wallet model for simulated escrow system.
"""
from sqlalchemy import Column, Integer, Float, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime

from app.db.base import Base


class Wallet(Base):
    """User wallet for simulated money management."""
    __tablename__ = "wallets"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True, nullable=False)
    wallet_balance = Column(Float, default=0.0, nullable=False)  # Available money
    locked_balance = Column(Float, default=0.0, nullable=False)  # Escrow money
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    user = relationship("User", back_populates="wallet")
    
    @property
    def total_balance(self):
        """Total balance including locked funds."""
        return self.wallet_balance + self.locked_balance
