"""
Wallet management router for simulated funds.
"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from pydantic import BaseModel, Field

from app.db.session import get_db
from app.db.models.user import User
from app.db.models.wallet import Wallet
from app.core.dependencies import get_current_user

router = APIRouter(prefix="/wallet", tags=["Wallet"])


class WalletResponse(BaseModel):
    """Wallet balance response."""
    wallet_balance: float
    locked_balance: float
    total_balance: float
    
    class Config:
        from_attributes = True


class AddFundsRequest(BaseModel):
    """Request to add demo funds."""
    amount: float = Field(..., gt=0, le=50000, description="Amount to add (max ₹50,000)")


class AddFundsResponse(BaseModel):
    """Response after adding funds."""
    message: str
    new_balance: float
    amount_added: float


@router.get("", response_model=WalletResponse)
def get_wallet(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Get current user's wallet balance.
    Creates wallet if doesn't exist.
    """
    wallet = db.query(Wallet).filter(Wallet.user_id == current_user.id).first()
    
    if not wallet:
        # Create wallet if doesn't exist
        wallet = Wallet(
            user_id=current_user.id,
            wallet_balance=0.0,
            locked_balance=0.0
        )
        db.add(wallet)
        db.commit()
        db.refresh(wallet)
    
    return wallet


@router.post("/add-funds", response_model=AddFundsResponse)
def add_demo_funds(
    request: AddFundsRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Add demo funds to wallet (simulated - for college project).
    Maximum ₹50,000 per transaction.
    """
    wallet = db.query(Wallet).filter(Wallet.user_id == current_user.id).first()
    
    if not wallet:
        wallet = Wallet(
            user_id=current_user.id,
            wallet_balance=0.0,
            locked_balance=0.0
        )
        db.add(wallet)
    
    # Add funds
    wallet.wallet_balance += request.amount
    
    db.commit()
    db.refresh(wallet)
    
    return AddFundsResponse(
        message=f"Successfully added ₹{request.amount:,.2f} to your wallet",
        new_balance=wallet.wallet_balance,
        amount_added=request.amount
    )


@router.get("/transactions")
def get_wallet_transactions(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Get wallet transaction history.
    Shows all campaigns where funds were locked/released.
    """
    from app.db.models.campaign import Campaign
    from app.db.models.brand import BrandProfile
    
    wallet = db.query(Wallet).filter(Wallet.user_id == current_user.id).first()
    if not wallet:
        return []
    
    transactions = []
    
    # Get campaigns where user is brand (funds locked)
    brand = db.query(BrandProfile).filter(BrandProfile.user_id == current_user.id).first()
    if brand:
        campaigns = db.query(Campaign).filter(
            Campaign.brand_id == brand.id,
            Campaign.escrow_status.in_(['locked', 'released', 'refunded'])
        ).all()
        
        for campaign in campaigns:
            transactions.append({
                "type": "campaign_escrow",
                "campaign_id": campaign.id,
                "campaign_name": campaign.name,
                "amount": float(campaign.budget_amount) if campaign.budget_amount else 0,
                "fee": float(campaign.brand_fee) if campaign.brand_fee else 0,
                "total": float(campaign.total_payment) if campaign.total_payment else 0,
                "status": campaign.escrow_status,
                "date": campaign.funds_locked_at or campaign.created_at
            })
    
    return transactions
