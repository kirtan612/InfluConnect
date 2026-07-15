"""
Transaction schemas for escrow system.
"""
from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field


# Transaction schemas
class TransactionCreate(BaseModel):
    seller_id: int = Field(..., description="Seller user ID")
    amount: float = Field(..., gt=0, description="Transaction amount (must be positive)")


class TransactionResponse(BaseModel):
    id: int
    buyer_id: int
    seller_id: int
    amount: float
    status: str
    agreement_status: str
    buyer_accepted: bool
    seller_accepted: bool
    buyer_accepted_at: Optional[datetime]
    seller_accepted_at: Optional[datetime]
    dispute_count: int
    dispute_status: Optional[str]
    dispute_reason: Optional[str]
    dispute_raised_by: Optional[int]
    dispute_raised_at: Optional[datetime]
    admin_resolved_by: Optional[int]
    admin_resolved_at: Optional[datetime]
    admin_notes: Optional[str]
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


# Agreement schemas
class AgreementAccept(BaseModel):
    pass  # No body needed, user is from token


class AgreementAcceptResponse(BaseModel):
    message: str
    transaction_id: int
    accepted_by: str
    both_accepted: bool
    agreement_status: str
    transaction_status: str


# Dispute schemas
class DisputeRaise(BaseModel):
    reason: str = Field(..., min_length=10, description="Reason for dispute")


class DisputeRaiseResponse(BaseModel):
    message: str
    transaction_id: int
    dispute_count: int
    status: str
    escalated_to_admin: bool


# Admin resolution schemas
class AdminResolution(BaseModel):
    action: str = Field(..., description="Action: 'release' or 'refund'")
    admin_notes: str = Field(..., min_length=10, description="Admin notes")


class AdminResolutionResponse(BaseModel):
    message: str
    transaction_id: int
    action: str
    final_status: str
    resolved_at: datetime


# Wallet schemas
class WalletResponse(BaseModel):
    id: int
    user_id: int
    wallet_balance: float
    locked_balance: float
    total_balance: float
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class AddFundsRequest(BaseModel):
    amount: float = Field(..., gt=0, le=10000, description="Amount to add (max 10000)")


class AddFundsResponse(BaseModel):
    message: str
    new_balance: float
    amount_added: float
