"""
Campaign router - Campaign creation, listing, and management.
"""
from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.roles import UserRole, CampaignStatus
from app.core.dependencies import get_current_user
from app.db.session import get_db
from app.db.models.user import User
from app.db.models.brand import BrandProfile
from app.db.models.campaign import Campaign
from app.db.models.influencer import InfluencerProfile
from app.schemas.campaign import (
    CampaignCreate, CampaignUpdate, CampaignResponse
)
from app.schemas.influencer import InfluencerListResponse
from app.utils.permissions import check_brand_can_create_campaign, check_campaign_access
from app.utils.validators import validate_platforms, validate_budget


router = APIRouter(prefix="/campaign", tags=["campaign"])


def get_brand_user(current_user: User = Depends(get_current_user)) -> User:
    """Ensure user is a brand."""
    if current_user.role != UserRole.BRAND:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="This endpoint is for brands only"
        )
    return current_user


# ============================================================================
# PUBLIC/INFLUENCER ENDPOINTS (must come first for proper routing)
# ============================================================================

@router.get("/explore", response_model=List[CampaignResponse])
def explore_campaigns(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
    category: str = None
):
    """
    Browse active campaigns (available to all logged-in users, especially influencers).
    """
    query = db.query(Campaign).filter(Campaign.status == CampaignStatus.ACTIVE)
    
    if category:
        query = query.filter(Campaign.category == category)
    
    campaigns = query.order_by(Campaign.created_at.desc()).all()
    
    return [
        CampaignResponse(
            id=c.id,
            brand_id=c.brand_id,
            name=c.name,
            description=c.description,
            category=c.category,
            platforms=c.platforms if c.platforms else [],
            budget_min=c.budget_min,
            budget_max=c.budget_max,
            status=c.status,
            created_at=c.created_at,
            updated_at=c.updated_at
        )
        for c in campaigns
    ]


# ============================================================================
# BRAND-ONLY ENDPOINTS
# ============================================================================

@router.post("", response_model=CampaignResponse)
def create_campaign(
    data: CampaignCreate,
    current_user: User = Depends(get_brand_user),
    db: Session = Depends(get_db)
):
    """
    Create a new campaign with escrow lock.
    
    Flow:
    1. Calculate platform fees (2.5% brand + 2.5% influencer)
    2. Validate brand has sufficient wallet balance
    3. Lock funds: wallet_balance → locked_balance
    4. Create campaign with escrow_status = 'locked'
    5. Record platform revenue (brand_fee)
    """
    from app.db.models.wallet import Wallet
    from app.db.models.platform_revenue import PlatformRevenue
    from datetime import datetime
    
    # Debug logging
    print(f"[DEBUG] Campaign creation request from user: {current_user.email} (role: {current_user.role})")
    print(f"[DEBUG] Campaign data: {data.model_dump()}")
    
    # Check brand can create campaigns
    check_brand_can_create_campaign(current_user, db)
    
    # Validate inputs
    validate_platforms(data.platforms)
    validate_budget(data.budget_min, data.budget_max)
    
    # Get brand profile
    brand = db.query(BrandProfile).filter(
        BrandProfile.user_id == current_user.id
    ).first()
    
    if not brand:
        print(f"[DEBUG] Brand profile not found for user_id: {current_user.id}")
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Brand profile not found"
        )
    
    print(f"[DEBUG] Brand profile found: ID={brand.id}, Name={brand.company_name}")
    
    # Determine budget amount for escrow
    budget_amount = data.budget_amount if data.budget_amount else data.budget_max
    
    # If budget_amount is provided, use escrow system
    if budget_amount and budget_amount > 0:
        print(f"[DEBUG] Escrow enabled - Budget amount: ₹{budget_amount}")
        
        # Calculate platform fees (2.5% each side = 5% total)
        brand_fee = round(budget_amount * 0.025, 2)  # 2.5% from brand
        influencer_fee = round(budget_amount * 0.025, 2)  # 2.5% from influencer
        total_payment = budget_amount + brand_fee
        
        print(f"[DEBUG] Fees - Brand: ₹{brand_fee}, Influencer: ₹{influencer_fee}, Total Payment: ₹{total_payment}")
        
        # Get or create wallet
        wallet = db.query(Wallet).filter(Wallet.user_id == current_user.id).first()
        if not wallet:
            wallet = Wallet(
                user_id=current_user.id,
                wallet_balance=0.0,
                locked_balance=0.0
            )
            db.add(wallet)
            db.flush()
        
        print(f"[DEBUG] Wallet - Available: ₹{wallet.wallet_balance}, Locked: ₹{wallet.locked_balance}")
        
        # Validate sufficient balance
        if wallet.wallet_balance < total_payment:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Insufficient funds. Required: ₹{total_payment:,.2f} (Budget: ₹{budget_amount:,.2f} + Fee: ₹{brand_fee:,.2f}). Available: ₹{wallet.wallet_balance:,.2f}"
            )
        
        # Lock funds
        wallet.wallet_balance -= total_payment
        wallet.locked_balance += budget_amount
        
        print(f"[DEBUG] Funds locked - New Available: ₹{wallet.wallet_balance}, New Locked: ₹{wallet.locked_balance}")
        
        # Create campaign with escrow
        db_campaign = Campaign(
            brand_id=brand.id,
            name=data.name,
            description=data.description,
            category=data.category,
            platforms=data.platforms if data.platforms else [],
            budget_min=data.budget_min,
            budget_max=data.budget_max,
            budget_amount=budget_amount,
            brand_fee=brand_fee,
            influencer_fee=influencer_fee,
            total_payment=total_payment,
            escrow_status='locked',
            funds_locked_at=datetime.utcnow(),
            status=CampaignStatus.DRAFT  # Starts as DRAFT, becomes ACTIVE after agreements
        )
        
        db.add(db_campaign)
        db.flush()  # Get campaign ID
        
        # Record platform revenue (brand fee collected upfront)
        revenue = PlatformRevenue(
            campaign_id=db_campaign.id,
            brand_fee=brand_fee,
            influencer_fee=0.0,  # Will be collected when funds released
            total_fee=brand_fee,
            fee_type='brand_payment',
            notes=f'Brand fee collected on campaign creation'
        )
        db.add(revenue)
        
        print(f"[DEBUG] Campaign created with escrow: ID={db_campaign.id}, Escrow Status={db_campaign.escrow_status}")
        
    else:
        # Create campaign without escrow (legacy mode)
        print(f"[DEBUG] Creating campaign without escrow")
        db_campaign = Campaign(
            brand_id=brand.id,
            name=data.name,
            description=data.description,
            category=data.category,
            platforms=data.platforms if data.platforms else [],
            budget_min=data.budget_min,
            budget_max=data.budget_max,
            status=CampaignStatus.DRAFT
        )
        db.add(db_campaign)
    
    db.commit()
    db.refresh(db_campaign)
    
    print(f"[DEBUG] Campaign created successfully: ID={db_campaign.id}")
    
    return db_campaign


@router.get("/{campaign_id}", response_model=CampaignResponse)
def get_campaign(
    campaign_id: int,
    current_user: User = Depends(get_brand_user),
    db: Session = Depends(get_db)
):
    """
    Get campaign details.
    Brand can only view their own campaigns.
    """
    # Check access
    check_campaign_access(current_user, campaign_id, db)
    
    campaign = db.query(Campaign).filter(Campaign.id == campaign_id).first()
    if not campaign:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Campaign not found"
        )
    
    return CampaignResponse(
        id=campaign.id,
        brand_id=campaign.brand_id,
        name=campaign.name,
        description=campaign.description,
        category=campaign.category,
        platforms=campaign.platforms if campaign.platforms else [],
        budget_min=campaign.budget_min,
        budget_max=campaign.budget_max,
        status=campaign.status,
        created_at=campaign.created_at,
        updated_at=campaign.updated_at
    )


@router.put("/{campaign_id}", response_model=CampaignResponse)
def update_campaign(
    campaign_id: int,
    data: CampaignUpdate,
    current_user: User = Depends(get_brand_user),
    db: Session = Depends(get_db)
):
    """
    Update campaign details.
    """
    # Check access
    check_campaign_access(current_user, campaign_id, db)
    
    campaign = db.query(Campaign).filter(Campaign.id == campaign_id).first()
    if not campaign:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Campaign not found"
        )
    
    # Validate inputs if provided
    if data.platforms is not None:
        validate_platforms(data.platforms)
    if data.budget_min is not None or data.budget_max is not None:
        validate_budget(data.budget_min or campaign.budget_min,
                       data.budget_max or campaign.budget_max)
    
    # Update fields
    update_data = data.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(campaign, key, value)
    
    db.commit()
    db.refresh(campaign)
    
    return CampaignResponse(
        id=campaign.id,
        brand_id=campaign.brand_id,
        name=campaign.name,
        description=campaign.description,
        category=campaign.category,
        platforms=campaign.platforms if campaign.platforms else [],
        budget_min=campaign.budget_min,
        budget_max=campaign.budget_max,
        status=campaign.status,
        created_at=campaign.created_at,
        updated_at=campaign.updated_at
    )


@router.delete("/{campaign_id}")
def delete_campaign(
    campaign_id: int,
    current_user: User = Depends(get_brand_user),
    db: Session = Depends(get_db)
):
    """
    Delete a campaign.
    Only draft campaigns can be deleted.
    """
    # Check access
    check_campaign_access(current_user, campaign_id, db)
    
    campaign = db.query(Campaign).filter(Campaign.id == campaign_id).first()
    if not campaign:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Campaign not found"
        )
    
    if campaign.status != CampaignStatus.DRAFT:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Only draft campaigns can be deleted"
        )
    
    db.delete(campaign)
    db.commit()
    
    return {"message": "Campaign deleted"}


@router.get("", response_model=List[CampaignResponse])
def list_campaigns(
    current_user: User = Depends(get_brand_user),
    db: Session = Depends(get_db),
    status_filter: str = None
):
    """
    List all campaigns for the current brand.
    """
    brand = db.query(BrandProfile).filter(
        BrandProfile.user_id == current_user.id
    ).first()
    
    if not brand:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Brand profile not found"
        )
    
    query = db.query(Campaign).filter(Campaign.brand_id == brand.id)
    
    if status_filter:
        try:
            status_enum = CampaignStatus(status_filter)
            query = query.filter(Campaign.status == status_enum)
        except ValueError:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Invalid status: {status_filter}"
            )
    
    campaigns = query.all()
    
    # Convert to response format explicitly
    return [
        CampaignResponse(
            id=c.id,
            brand_id=c.brand_id,
            name=c.name,
            description=c.description,
            category=c.category,
            platforms=c.platforms if c.platforms else [],
            budget_min=c.budget_min,
            budget_max=c.budget_max,
            status=c.status,
            created_at=c.created_at,
            updated_at=c.updated_at
        )
        for c in campaigns
    ]



# ============================================================================
# ESCROW MANAGEMENT ENDPOINTS
# ============================================================================

@router.get("/{campaign_id}/escrow-details")
def get_escrow_details(
    campaign_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get detailed escrow breakdown for a campaign.
    Shows all fees and amounts for transparency.
    """
    from app.schemas.campaign import EscrowDetailsResponse
    
    campaign = db.query(Campaign).filter(Campaign.id == campaign_id).first()
    if not campaign:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Campaign not found"
        )
    
    # Check access (brand or involved influencer or admin)
    if current_user.role not in [UserRole.ADMIN]:
        brand = db.query(BrandProfile).filter(BrandProfile.user_id == current_user.id).first()
        if not brand or campaign.brand_id != brand.id:
            # TODO: Check if user is the assigned influencer
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You don't have access to this campaign"
            )
    
    if not campaign.budget_amount:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="This campaign doesn't have escrow enabled"
        )
    
    return EscrowDetailsResponse(
        campaign_id=campaign.id,
        campaign_name=campaign.name,
        budget_amount=float(campaign.budget_amount),
        brand_fee=float(campaign.brand_fee or 0),
        influencer_fee=float(campaign.influencer_fee or 0),
        total_payment=float(campaign.total_payment or 0),
        influencer_receives=campaign.influencer_receives,
        total_platform_fee=campaign.total_platform_fee,
        escrow_status=campaign.escrow_status,
        funds_locked_at=campaign.funds_locked_at,
        funds_released_at=campaign.funds_released_at
    )


@router.post("/{campaign_id}/admin-release")
def admin_release_funds(
    campaign_id: int,
    request: "AdminReleaseRequest",
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Admin releases escrow funds to influencer.
    
    Flow:
    1. Deduct from brand's locked_balance
    2. Add to influencer's wallet_balance (minus influencer_fee)
    3. Record platform revenue (influencer_fee)
    4. Set escrow_status = 'released'
    """
    from app.db.models.wallet import Wallet
    from app.db.models.platform_revenue import PlatformRevenue
    from app.db.models.collaboration import Collaboration
    from datetime import datetime
    from app.schemas.campaign import AdminReleaseRequest
    
    # Check admin role
    if current_user.role != UserRole.ADMIN:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only admins can release funds"
        )
    
    campaign = db.query(Campaign).filter(Campaign.id == campaign_id).first()
    if not campaign:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Campaign not found"
        )
    
    if campaign.escrow_status != 'locked':
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Cannot release funds. Escrow status is '{campaign.escrow_status}', must be 'locked'"
        )
    
    if not campaign.budget_amount:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Campaign doesn't have escrow enabled"
        )
    
    # Get brand wallet
    brand = db.query(BrandProfile).filter(BrandProfile.id == campaign.brand_id).first()
    brand_user = db.query(User).filter(User.id == brand.user_id).first()
    brand_wallet = db.query(Wallet).filter(Wallet.user_id == brand_user.id).first()
    
    if not brand_wallet or brand_wallet.locked_balance < float(campaign.budget_amount):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Insufficient locked funds in brand wallet"
        )
    
    # Get influencer from collaboration
    collaboration = db.query(Collaboration).filter(Collaboration.campaign_id == campaign_id).first()
    if not collaboration:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No collaboration found for this campaign"
        )
    
    influencer = db.query(InfluencerProfile).filter(InfluencerProfile.id == collaboration.influencer_id).first()
    influencer_user = db.query(User).filter(User.id == influencer.user_id).first()
    influencer_wallet = db.query(Wallet).filter(Wallet.user_id == influencer_user.id).first()
    
    if not influencer_wallet:
        influencer_wallet = Wallet(
            user_id=influencer_user.id,
            wallet_balance=0.0,
            locked_balance=0.0
        )
        db.add(influencer_wallet)
        db.flush()
    
    # Calculate amounts
    budget_amount = float(campaign.budget_amount)
    influencer_fee = float(campaign.influencer_fee or 0)
    influencer_receives = budget_amount - influencer_fee
    
    # Release funds
    brand_wallet.locked_balance -= budget_amount
    influencer_wallet.wallet_balance += influencer_receives
    
    # Record platform revenue (influencer fee)
    revenue = PlatformRevenue(
        campaign_id=campaign.id,
        brand_fee=0.0,
        influencer_fee=influencer_fee,
        total_fee=influencer_fee,
        fee_type='influencer_payment',
        notes=request.admin_notes or 'Funds released to influencer'
    )
    db.add(revenue)
    
    # Update campaign
    campaign.escrow_status = 'released'
    campaign.funds_released_at = datetime.utcnow()
    campaign.status = CampaignStatus.COMPLETED
    campaign.admin_decision = request.admin_notes or 'Funds released to influencer'
    campaign.admin_decided_at = datetime.utcnow()
    campaign.admin_decided_by = current_user.id
    
    db.commit()
    
    return {
        "message": "Funds released successfully",
        "campaign_id": campaign.id,
        "influencer_received": influencer_receives,
        "platform_fee": influencer_fee,
        "escrow_status": campaign.escrow_status
    }


@router.post("/{campaign_id}/admin-refund")
def admin_refund_to_brand(
    campaign_id: int,
    request: "AdminRefundRequest",
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Admin refunds escrow funds to brand.
    
    Flow:
    1. Deduct from brand's locked_balance
    2. Add back to brand's wallet_balance
    3. Optionally refund brand_fee
    4. Set escrow_status = 'refunded'
    """
    from app.db.models.wallet import Wallet
    from datetime import datetime
    from app.schemas.campaign import AdminRefundRequest
    
    # Check admin role
    if current_user.role != UserRole.ADMIN:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only admins can refund funds"
        )
    
    campaign = db.query(Campaign).filter(Campaign.id == campaign_id).first()
    if not campaign:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Campaign not found"
        )
    
    if campaign.escrow_status != 'locked':
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Cannot refund. Escrow status is '{campaign.escrow_status}', must be 'locked'"
        )
    
    if not campaign.budget_amount:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Campaign doesn't have escrow enabled"
        )
    
    # Get brand wallet
    brand = db.query(BrandProfile).filter(BrandProfile.id == campaign.brand_id).first()
    brand_user = db.query(User).filter(User.id == brand.user_id).first()
    brand_wallet = db.query(Wallet).filter(Wallet.user_id == brand_user.id).first()
    
    if not brand_wallet or brand_wallet.locked_balance < float(campaign.budget_amount):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Insufficient locked funds in brand wallet"
        )
    
    # Calculate refund amount
    budget_amount = float(campaign.budget_amount)
    refund_amount = budget_amount
    
    # Optionally refund brand fee
    if request.refund_brand_fee:
        refund_amount += float(campaign.brand_fee or 0)
    
    # Refund funds
    brand_wallet.locked_balance -= budget_amount
    brand_wallet.wallet_balance += refund_amount
    
    # Update campaign
    campaign.escrow_status = 'refunded'
    campaign.funds_released_at = datetime.utcnow()
    campaign.status = CampaignStatus.REJECTED
    campaign.admin_decision = request.admin_notes or 'Funds refunded to brand'
    campaign.admin_decided_at = datetime.utcnow()
    campaign.admin_decided_by = current_user.id
    
    db.commit()
    
    return {
        "message": "Funds refunded successfully",
        "campaign_id": campaign.id,
        "refund_amount": refund_amount,
        "brand_fee_refunded": request.refund_brand_fee,
        "escrow_status": campaign.escrow_status
    }
