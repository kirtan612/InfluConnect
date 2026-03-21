"""
Escrow system API endpoints.
"""
from datetime import datetime
from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.db.models.transaction import Transaction, TransactionStatus, AgreementStatus, DisputeStatus
from app.db.models.wallet import Wallet
from app.db.models.user import User
from app.core.dependencies import get_current_user
from app.core.roles import UserRole
from app.schemas.transaction import (
    TransactionCreate,
    TransactionResponse,
    AgreementAccept,
    AgreementAcceptResponse,
    DisputeRaise,
    DisputeRaiseResponse,
    AdminResolution,
    AdminResolutionResponse,
    WalletResponse,
    AddFundsRequest,
    AddFundsResponse
)
from app.services.notification_service import create_notification, send_notification_email

router = APIRouter(prefix="/escrow", tags=["Escrow"])


# ============================================================================
# WALLET ENDPOINTS
# ============================================================================

@router.get("/wallet", response_model=WalletResponse)
def get_wallet(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get current user's wallet."""
    wallet = db.query(Wallet).filter(Wallet.user_id == current_user.id).first()
    
    if not wallet:
        # Create wallet if doesn't exist
        wallet = Wallet(user_id=current_user.id, wallet_balance=0.0, locked_balance=0.0)
        db.add(wallet)
        db.commit()
        db.refresh(wallet)
    
    return wallet


@router.post("/wallet/add-funds", response_model=AddFundsResponse)
def add_demo_funds(
    request: AddFundsRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Add demo funds to wallet (simulated)."""
    wallet = db.query(Wallet).filter(Wallet.user_id == current_user.id).first()
    
    if not wallet:
        wallet = Wallet(user_id=current_user.id, wallet_balance=0.0, locked_balance=0.0)
        db.add(wallet)
    
    wallet.wallet_balance += request.amount
    wallet.updated_at = datetime.utcnow()
    
    db.commit()
    db.refresh(wallet)
    
    return AddFundsResponse(
        message=f"Successfully added ₹{request.amount:.2f} to your wallet",
        new_balance=wallet.wallet_balance,
        amount_added=request.amount
    )


# ============================================================================
# TRANSACTION ENDPOINTS
# ============================================================================

@router.post("/transactions", response_model=TransactionResponse, status_code=status.HTTP_201_CREATED)
def create_transaction(
    transaction_data: TransactionCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Create new escrow transaction (buyer creates).
    
    Flow:
    1. Check sufficient wallet balance
    2. Move funds: wallet_balance -> locked_balance
    3. Create transaction with status=HELD
    """
    # Prevent self-transaction
    if transaction_data.seller_id == current_user.id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot create transaction with yourself"
        )
    
    # Verify seller exists
    seller = db.query(User).filter(User.id == transaction_data.seller_id).first()
    if not seller:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Seller not found"
        )
    
    # Get buyer wallet
    buyer_wallet = db.query(Wallet).filter(Wallet.user_id == current_user.id).first()
    if not buyer_wallet:
        buyer_wallet = Wallet(user_id=current_user.id, wallet_balance=0.0, locked_balance=0.0)
        db.add(buyer_wallet)
        db.flush()
    
    # Check sufficient balance
    if buyer_wallet.wallet_balance < transaction_data.amount:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Insufficient funds. Available: ₹{buyer_wallet.wallet_balance:.2f}, Required: ₹{transaction_data.amount:.2f}"
        )
    
    # Move funds to escrow
    buyer_wallet.wallet_balance -= transaction_data.amount
    buyer_wallet.locked_balance += transaction_data.amount
    buyer_wallet.updated_at = datetime.utcnow()
    
    # Create transaction
    transaction = Transaction(
        buyer_id=current_user.id,
        seller_id=transaction_data.seller_id,
        amount=transaction_data.amount,
        status=TransactionStatus.HELD,
        agreement_status=AgreementStatus.PENDING,
        buyer_accepted=False,
        seller_accepted=False,
        dispute_count=0
    )
    
    db.add(transaction)
    db.commit()
    db.refresh(transaction)
    
    # Notify seller
    try:
        create_notification(
            db=db,
            user_id=seller.id,
            notification_type="transaction_created",
            message=f"New transaction created. Amount: ₹{transaction_data.amount:.2f}. Please accept the agreement.",
            related_id=transaction.id
        )
        
        send_notification_email(
            to_email=seller.email,
            subject="New Transaction - Agreement Required",
            message=f"A new transaction has been created for ₹{transaction_data.amount:.2f}. Please log in and accept the agreement to proceed.",
            action_url=f"http://localhost:5173/escrow/transactions"
        )
    except Exception as e:
        print(f"Failed to send notification: {e}")
    
    return transaction


@router.get("/transactions", response_model=List[TransactionResponse])
def get_transactions(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get user's transactions (as buyer or seller)."""
    if current_user.role == UserRole.ADMIN:
        # Admin sees all
        transactions = db.query(Transaction).order_by(Transaction.created_at.desc()).all()
    else:
        # Users see only their own
        transactions = db.query(Transaction).filter(
            (Transaction.buyer_id == current_user.id) | (Transaction.seller_id == current_user.id)
        ).order_by(Transaction.created_at.desc()).all()
    
    return transactions


@router.get("/transactions/{transaction_id}", response_model=TransactionResponse)
def get_transaction(
    transaction_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get specific transaction."""
    transaction = db.query(Transaction).filter(Transaction.id == transaction_id).first()
    
    if not transaction:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Transaction not found"
        )
    
    # Check access
    if current_user.role != UserRole.ADMIN:
        if transaction.buyer_id != current_user.id and transaction.seller_id != current_user.id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You can only view your own transactions"
            )
    
    return transaction


# ============================================================================
# AGREEMENT ENDPOINTS
# ============================================================================

@router.post("/transactions/{transaction_id}/accept-agreement", response_model=AgreementAcceptResponse)
def accept_agreement(
    transaction_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Accept transaction agreement (buyer or seller).
    
    Rules:
    - Both parties must accept
    - If both accepted: agreement_status=ACTIVE, transaction_status=ACTIVE
    """
    transaction = db.query(Transaction).filter(Transaction.id == transaction_id).first()
    
    if not transaction:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Transaction not found"
        )
    
    # Determine role
    is_buyer = transaction.buyer_id == current_user.id
    is_seller = transaction.seller_id == current_user.id
    
    if not is_buyer and not is_seller:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You are not part of this transaction"
        )
    
    # Check if already accepted
    if is_buyer and transaction.buyer_accepted:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="You have already accepted the agreement"
        )
    
    if is_seller and transaction.seller_accepted:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="You have already accepted the agreement"
        )
    
    # Accept agreement
    if is_buyer:
        transaction.buyer_accepted = True
        transaction.buyer_accepted_at = datetime.utcnow()
        accepted_by = "buyer"
    else:
        transaction.seller_accepted = True
        transaction.seller_accepted_at = datetime.utcnow()
        accepted_by = "seller"
    
    # Check if both accepted
    both_accepted = transaction.buyer_accepted and transaction.seller_accepted
    
    if both_accepted:
        transaction.agreement_status = AgreementStatus.ACTIVE
        transaction.status = TransactionStatus.ACTIVE
    
    transaction.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(transaction)
    
    # Notify other party
    try:
        other_party_id = transaction.seller_id if is_buyer else transaction.buyer_id
        other_party = db.query(User).filter(User.id == other_party_id).first()
        
        if both_accepted:
            message = f"Transaction #{transaction.id} is now ACTIVE. Both parties have accepted the agreement."
        else:
            message = f"The {'buyer' if is_buyer else 'seller'} has accepted the agreement for Transaction #{transaction.id}. Waiting for your acceptance."
        
        create_notification(
            db=db,
            user_id=other_party_id,
            notification_type="agreement_accepted",
            message=message,
            related_id=transaction.id
        )
        
        if other_party:
            send_notification_email(
                to_email=other_party.email,
                subject="Transaction Agreement Update",
                message=message,
                action_url=f"http://localhost:5173/escrow/transactions"
            )
    except Exception as e:
        print(f"Failed to send notification: {e}")
    
    return AgreementAcceptResponse(
        message="Agreement accepted successfully",
        transaction_id=transaction.id,
        accepted_by=accepted_by,
        both_accepted=both_accepted,
        agreement_status=transaction.agreement_status.value,
        transaction_status=transaction.status.value
    )


# ============================================================================
# DISPUTE ENDPOINTS
# ============================================================================

@router.post("/transactions/{transaction_id}/raise-dispute", response_model=DisputeRaiseResponse)
def raise_dispute(
    transaction_id: int,
    dispute_data: DisputeRaise,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Raise dispute on transaction.
    
    Rules:
    - Only when transaction is ACTIVE
    - dispute_count < 3: status=DISPUTE
    - dispute_count >= 3: status=ADMIN_REVIEW
    """
    transaction = db.query(Transaction).filter(Transaction.id == transaction_id).first()
    
    if not transaction:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Transaction not found"
        )
    
    # Check access
    is_buyer = transaction.buyer_id == current_user.id
    is_seller = transaction.seller_id == current_user.id
    
    if not is_buyer and not is_seller:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You are not part of this transaction"
        )
    
    # Check transaction status
    if transaction.status != TransactionStatus.ACTIVE:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Can only raise dispute on ACTIVE transactions. Current status: {transaction.status}"
        )
    
    # Increment dispute count
    transaction.dispute_count += 1
    transaction.dispute_reason = dispute_data.reason
    transaction.dispute_raised_by = current_user.id
    transaction.dispute_raised_at = datetime.utcnow()
    transaction.dispute_status = DisputeStatus.OPEN
    
    # Determine new status
    escalated = False
    if transaction.dispute_count >= 3:
        transaction.status = TransactionStatus.ADMIN_REVIEW
        escalated = True
        message = f"Dispute raised. Maximum disputes (3) reached. Escalated to admin review."
    else:
        transaction.status = TransactionStatus.DISPUTE
        message = f"Dispute raised. Disputes remaining: {3 - transaction.dispute_count}"
    
    transaction.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(transaction)
    
    # Notify other party and admins
    try:
        other_party_id = transaction.seller_id if is_buyer else transaction.buyer_id
        other_party = db.query(User).filter(User.id == other_party_id).first()
        
        # Notify other party
        create_notification(
            db=db,
            user_id=other_party_id,
            notification_type="dispute_raised",
            message=f"A dispute has been raised on Transaction #{transaction.id}. Reason: {dispute_data.reason}",
            related_id=transaction.id
        )
        
        if other_party:
            send_notification_email(
                to_email=other_party.email,
                subject="Dispute Raised on Transaction",
                message=f"A dispute has been raised on Transaction #{transaction.id}. Please review and respond.",
                action_url=f"http://localhost:5173/escrow/transactions"
            )
        
        # Notify admins if escalated
        if escalated:
            admins = db.query(User).filter(User.role == UserRole.ADMIN).all()
            for admin in admins:
                create_notification(
                    db=db,
                    user_id=admin.id,
                    notification_type="dispute_escalated",
                    message=f"Transaction #{transaction.id} has been escalated to admin review (3 disputes).",
                    related_id=transaction.id
                )
                
                send_notification_email(
                    to_email=admin.email,
                    subject="Transaction Escalated - Admin Review Required",
                    message=f"Transaction #{transaction.id} requires admin resolution.",
                    action_url=f"http://localhost:5173/admin/escrow"
                )
    except Exception as e:
        print(f"Failed to send notification: {e}")
    
    return DisputeRaiseResponse(
        message=message,
        transaction_id=transaction.id,
        dispute_count=transaction.dispute_count,
        status=transaction.status.value,
        escalated_to_admin=escalated
    )


# ============================================================================
# ADMIN ENDPOINTS
# ============================================================================

@router.post("/transactions/{transaction_id}/admin-resolve", response_model=AdminResolutionResponse)
def admin_resolve_transaction(
    transaction_id: int,
    resolution: AdminResolution,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Admin resolves disputed transaction.
    
    Actions:
    - release: Give funds to seller
    - refund: Return funds to buyer
    """
    # Check admin role
    if current_user.role != UserRole.ADMIN:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only admins can resolve transactions"
        )
    
    transaction = db.query(Transaction).filter(Transaction.id == transaction_id).first()
    
    if not transaction:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Transaction not found"
        )
    
    # Validate action
    if resolution.action not in ["release", "refund"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Action must be 'release' or 'refund'"
        )
    
    # Get wallets
    buyer_wallet = db.query(Wallet).filter(Wallet.user_id == transaction.buyer_id).first()
    seller_wallet = db.query(Wallet).filter(Wallet.user_id == transaction.seller_id).first()
    
    if not seller_wallet:
        seller_wallet = Wallet(user_id=transaction.seller_id, wallet_balance=0.0, locked_balance=0.0)
        db.add(seller_wallet)
        db.flush()
    
    # Execute action
    if resolution.action == "release":
        # Release to seller
        buyer_wallet.locked_balance -= transaction.amount
        seller_wallet.wallet_balance += transaction.amount
        transaction.status = TransactionStatus.RELEASED
        final_status = "released"
        
    else:  # refund
        # Refund to buyer
        buyer_wallet.locked_balance -= transaction.amount
        buyer_wallet.wallet_balance += transaction.amount
        transaction.status = TransactionStatus.REFUNDED
        final_status = "refunded"
    
    # Update transaction
    transaction.admin_resolved_by = current_user.id
    transaction.admin_resolved_at = datetime.utcnow()
    transaction.admin_notes = resolution.admin_notes
    transaction.dispute_status = DisputeStatus.RESOLVED
    transaction.updated_at = datetime.utcnow()
    
    buyer_wallet.updated_at = datetime.utcnow()
    seller_wallet.updated_at = datetime.utcnow()
    
    db.commit()
    db.refresh(transaction)
    
    # Notify both parties
    try:
        buyer = db.query(User).filter(User.id == transaction.buyer_id).first()
        seller = db.query(User).filter(User.id == transaction.seller_id).first()
        
        resolution_message = f"Transaction #{transaction.id} has been resolved by admin. Action: {resolution.action.upper()}"
        
        for user in [buyer, seller]:
            if user:
                create_notification(
                    db=db,
                    user_id=user.id,
                    notification_type="transaction_resolved",
                    message=resolution_message,
                    related_id=transaction.id
                )
                
                send_notification_email(
                    to_email=user.email,
                    subject="Transaction Resolved",
                    message=f"{resolution_message}. Admin notes: {resolution.admin_notes}",
                    action_url=f"http://localhost:5173/escrow/transactions"
                )
    except Exception as e:
        print(f"Failed to send notification: {e}")
    
    return AdminResolutionResponse(
        message=f"Transaction {resolution.action}d successfully",
        transaction_id=transaction.id,
        action=resolution.action,
        final_status=final_status,
        resolved_at=transaction.admin_resolved_at
    )


@router.get("/admin/stats")
def get_admin_stats(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get escrow system statistics (admin only)."""
    if current_user.role != UserRole.ADMIN:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only admins can view statistics"
        )
    
    total_transactions = db.query(Transaction).count()
    held = db.query(Transaction).filter(Transaction.status == TransactionStatus.HELD).count()
    active = db.query(Transaction).filter(Transaction.status == TransactionStatus.ACTIVE).count()
    dispute = db.query(Transaction).filter(Transaction.status == TransactionStatus.DISPUTE).count()
    admin_review = db.query(Transaction).filter(Transaction.status == TransactionStatus.ADMIN_REVIEW).count()
    released = db.query(Transaction).filter(Transaction.status == TransactionStatus.RELEASED).count()
    refunded = db.query(Transaction).filter(Transaction.status == TransactionStatus.REFUNDED).count()
    
    total_locked = db.query(Wallet).with_entities(
        db.func.sum(Wallet.locked_balance)
    ).scalar() or 0.0
    
    return {
        "total_transactions": total_transactions,
        "by_status": {
            "held": held,
            "active": active,
            "dispute": dispute,
            "admin_review": admin_review,
            "released": released,
            "refunded": refunded
        },
        "total_locked_funds": total_locked
    }
