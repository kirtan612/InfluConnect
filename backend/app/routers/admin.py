"""
Admin router.
Handles admin dashboard, influencer management, brand management,
campaign oversight, verification requests, reports, and automation.
"""
from datetime import datetime
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.db.session import get_db
from app.db.models.user import User
from app.db.models.influencer import InfluencerProfile
from app.db.models.brand import BrandProfile
from app.db.models.campaign import Campaign
from app.db.models.request import CollaborationRequest
from app.db.models.verification import VerificationRequest
from app.db.models.report import Report
from app.db.models.platform_revenue import PlatformRevenue
from app.db.models.wallet import Wallet
from app.core.dependencies import get_admin_user
from app.core.roles import VerificationStatus, CampaignStatus, BrandStatus
from app.schemas.admin import (
    AdminInfluencerResponse,
    AdminVerifyInfluencerRequest,
    AdminSuspendUserRequest,
    ReportResponse,
    AdminDashboardStats,
    AdminBrandResponse,
    AdminCampaignResponse,
    AdminVerificationResponse,
    AdminVerificationDecision,
)
from app.schemas.campaign import (
    PlatformRevenueResponse,
    PlatformRevenueStats,
    AdminEscrowStats
)
from app.services.automation import AutomationService

router = APIRouter(prefix="/admin", tags=["Admin"])


# ============================================================================
# Dashboard Statistics
# ============================================================================

@router.get("/stats", response_model=AdminDashboardStats)
async def get_dashboard_stats(
    current_user: User = Depends(get_admin_user),
    db: Session = Depends(get_db)
):
    """Get platform-wide dashboard statistics."""
    total_influencers = db.query(InfluencerProfile).count()
    verified_influencers = db.query(InfluencerProfile).filter(
        InfluencerProfile.verification_status == VerificationStatus.VERIFIED
    ).count()
    pending_verifications = db.query(VerificationRequest).filter(
        VerificationRequest.status == "pending"
    ).count()
    active_brands = db.query(BrandProfile).filter(
        BrandProfile.status == BrandStatus.ACTIVE
    ).count()
    live_campaigns = db.query(Campaign).filter(
        Campaign.status == CampaignStatus.ACTIVE
    ).count()
    reported_issues = db.query(Report).filter(
        Report.status == "pending"
    ).count()

    return AdminDashboardStats(
        total_influencers=total_influencers,
        verified_influencers=verified_influencers,
        pending_verifications=pending_verifications,
        active_brands=active_brands,
        live_campaigns=live_campaigns,
        reported_issues=reported_issues
    )


# ============================================================================
# Influencer Management
# ============================================================================

@router.get("/influencers", response_model=List[AdminInfluencerResponse])
async def list_influencers(
    verification_status: Optional[str] = Query(None),
    include_suspended: bool = Query(False),
    current_user: User = Depends(get_admin_user),
    db: Session = Depends(get_db)
):
    """List all influencers with admin-level details."""
    query = db.query(InfluencerProfile).join(User, InfluencerProfile.user_id == User.id)

    if verification_status:
        try:
            vs = VerificationStatus(verification_status)
            query = query.filter(InfluencerProfile.verification_status == vs)
        except ValueError:
            pass

    if not include_suspended:
        query = query.filter(User.is_suspended == False)

    profiles = query.all()
    result = []
    for p in profiles:
        user = p.user
        result.append(AdminInfluencerResponse(
            id=p.id,
            user_id=p.user_id,
            display_name=p.display_name,
            email=user.email if user else "unknown",
            trust_score=p.trust_score,
            verification_status=p.verification_status,
            profile_completion=p.profile_completion,
            is_suspended=user.is_suspended if user else False,
            admin_note=p.admin_note,
            created_at=p.created_at
        ))
    return result


@router.post("/verify/{user_id}")
async def verify_influencer(
    user_id: int,
    data: AdminVerifyInfluencerRequest,
    current_user: User = Depends(get_admin_user),
    db: Session = Depends(get_db)
):
    """Verify or reject an influencer."""
    profile = db.query(InfluencerProfile).filter(
        InfluencerProfile.user_id == user_id
    ).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Influencer not found")

    profile.verification_status = data.status
    if data.reason:
        profile.admin_note = data.reason
    profile.updated_at = datetime.utcnow()

    # Update trust score on verification
    if data.status == VerificationStatus.VERIFIED:
        profile.trust_score = min(100, profile.trust_score + 20)

    db.commit()
    return {"message": f"Influencer verification updated to {data.status.value}"}


@router.post("/suspend/{user_id}")
async def suspend_user(
    user_id: int,
    data: AdminSuspendUserRequest,
    current_user: User = Depends(get_admin_user),
    db: Session = Depends(get_db)
):
    """Suspend or unsuspend a user."""
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    user.is_suspended = data.is_suspended
    db.commit()
    action = "suspended" if data.is_suspended else "unsuspended"
    return {"message": f"User {action} successfully"}


# ============================================================================
# Brand Management
# ============================================================================

@router.get("/brands", response_model=List[AdminBrandResponse])
async def list_brands(
    current_user: User = Depends(get_admin_user),
    db: Session = Depends(get_db)
):
    """List all brands with admin-level details."""
    brands = db.query(BrandProfile).join(User, BrandProfile.user_id == User.id).all()
    result = []
    for b in brands:
        user = b.user
        campaign_count = db.query(Campaign).filter(Campaign.brand_id == b.id).count()
        result.append(AdminBrandResponse(
            id=b.id,
            user_id=b.user_id,
            company_name=b.company_name,
            email=user.email if user else "unknown",
            industry=b.industry,
            location=b.location,
            status=b.status,
            campaign_count=campaign_count,
            created_at=b.created_at
        ))
    return result


# ============================================================================
# Campaign Oversight
# ============================================================================

@router.get("/campaigns", response_model=List[AdminCampaignResponse])
async def list_all_campaigns(
    current_user: User = Depends(get_admin_user),
    db: Session = Depends(get_db)
):
    """List all campaigns across all brands."""
    campaigns = db.query(Campaign).order_by(Campaign.created_at.desc()).all()
    result = []
    for c in campaigns:
        brand = c.brand
        result.append(AdminCampaignResponse(
            id=c.id,
            name=c.name,
            brand_name=brand.company_name if brand else "Unknown",
            category=c.category,
            status=c.status.value if hasattr(c.status, 'value') else str(c.status),
            platforms=c.platforms or [],
            budget_min=c.budget_min,
            budget_max=c.budget_max,
            location=getattr(c, 'location', None),
            created_at=c.created_at
        ))
    return result


# ============================================================================
# Verification Requests
# ============================================================================

@router.get("/verifications", response_model=List[AdminVerificationResponse])
async def list_verification_requests(
    current_user: User = Depends(get_admin_user),
    db: Session = Depends(get_db)
):
    """List all verification requests."""
    vrs = db.query(VerificationRequest).order_by(VerificationRequest.created_at.desc()).all()
    result = []
    for vr in vrs:
        influencer = vr.influencer
        result.append(AdminVerificationResponse(
            id=vr.id,
            influencer_id=vr.influencer_id,
            influencer_name=influencer.display_name if influencer else "Unknown",
            status=vr.status,
            metrics_snapshot=vr.metrics_snapshot,
            created_at=vr.created_at,
            reviewed_at=vr.reviewed_at,
            admin_reason=getattr(vr, 'admin_reason', None)
        ))
    return result


@router.post("/verifications/{verification_id}/approve")
async def approve_verification(
    verification_id: int,
    data: AdminVerificationDecision,
    current_user: User = Depends(get_admin_user),
    db: Session = Depends(get_db)
):
    """Approve a verification request."""
    vr = db.query(VerificationRequest).filter(VerificationRequest.id == verification_id).first()
    if not vr:
        raise HTTPException(status_code=404, detail="Verification request not found")

    vr.status = VerificationStatus.VERIFIED  # Use enum instead of string
    vr.reviewed_at = datetime.utcnow()

    # Update influencer profile
    profile = db.query(InfluencerProfile).filter(InfluencerProfile.id == vr.influencer_id).first()
    if profile:
        profile.verification_status = VerificationStatus.VERIFIED
        profile.trust_score = min(100, profile.trust_score + 20)
        if data.reason:
            profile.admin_note = data.reason
        profile.updated_at = datetime.utcnow()

    db.commit()
    return {"message": "Verification approved"}


@router.post("/verifications/{verification_id}/reject")
async def reject_verification(
    verification_id: int,
    data: AdminVerificationDecision,
    current_user: User = Depends(get_admin_user),
    db: Session = Depends(get_db)
):
    """Reject a verification request."""
    vr = db.query(VerificationRequest).filter(VerificationRequest.id == verification_id).first()
    if not vr:
        raise HTTPException(status_code=404, detail="Verification request not found")

    vr.status = VerificationStatus.REJECTED  # Use enum instead of string
    vr.reviewed_at = datetime.utcnow()

    # Update influencer profile
    profile = db.query(InfluencerProfile).filter(InfluencerProfile.id == vr.influencer_id).first()
    if profile:
        profile.verification_status = VerificationStatus.REJECTED
        if data.reason:
            profile.admin_note = data.reason
        profile.updated_at = datetime.utcnow()

    db.commit()
    return {"message": "Verification rejected"}


# ============================================================================
# Reports & Moderation
# ============================================================================

@router.get("/reports", response_model=List[ReportResponse])
async def list_reports(
    current_user: User = Depends(get_admin_user),
    db: Session = Depends(get_db)
):
    """List all reports."""
    reports = db.query(Report).order_by(Report.created_at.desc()).all()
    return reports


@router.post("/reports/{report_id}/review")
async def review_report(
    report_id: int,
    status: str = Query(...),
    admin_notes: Optional[str] = None,
    current_user: User = Depends(get_admin_user),
    db: Session = Depends(get_db)
):
    """Review and update a report."""
    report = db.query(Report).filter(Report.id == report_id).first()
    if not report:
        raise HTTPException(status_code=404, detail="Report not found")

    report.status = status
    if admin_notes:
        report.admin_notes = admin_notes

    db.commit()
    return {"message": "Report reviewed successfully"}


# ============================================================================
# Automation
# ============================================================================

@router.post("/automation/{task}")
async def trigger_automation(
    task: str,
    current_user: User = Depends(get_admin_user),
    db: Session = Depends(get_db)
):
    """Trigger an automation task."""
    automation = AutomationService(db)

    if task == "recalculate-trust":
        result = automation.daily_trust_recalculation()
        return {"message": "Trust scores recalculated", "details": result}
    elif task == "downgrade-inactive":
        result = automation.downgrade_inactive_influencers()
        return {"message": "Inactive influencers downgraded", "details": result}
    elif task == "flag-suspicious":
        result = automation.flag_suspicious_profiles()
        return {"message": "Suspicious profiles flagged", "details": result}
    elif task == "update-completion":
        result = automation.update_profile_completion_scores()
        return {"message": "Profile completion updated", "details": result}
    else:
        raise HTTPException(status_code=400, detail=f"Unknown task: {task}")


# ============================================================================
# Platform Revenue & Escrow Management
# ============================================================================

@router.get("/platform-revenue", response_model=PlatformRevenueStats)
async def get_platform_revenue(
    current_user: User = Depends(get_admin_user),
    db: Session = Depends(get_db)
):
    """
    Get platform revenue statistics.
    Shows total earnings from brand and influencer fees.
    """
    # Get all revenue records
    revenues = db.query(PlatformRevenue).all()
    
    total_revenue = sum(r.total_fee for r in revenues)
    brand_fees_total = sum(r.brand_fee for r in revenues)
    influencer_fees_total = sum(r.influencer_fee for r in revenues)
    total_campaigns = db.query(Campaign).filter(Campaign.budget_amount.isnot(None)).count()
    
    # Revenue by campaign
    revenue_by_campaign = []
    campaigns_with_revenue = db.query(Campaign).filter(
        Campaign.budget_amount.isnot(None)
    ).all()
    
    for campaign in campaigns_with_revenue:
        campaign_revenues = db.query(PlatformRevenue).filter(
            PlatformRevenue.campaign_id == campaign.id
        ).all()
        
        campaign_total = sum(r.total_fee for r in campaign_revenues)
        
        revenue_by_campaign.append({
            "campaign_id": campaign.id,
            "campaign_name": campaign.name,
            "brand_fee": float(campaign.brand_fee or 0),
            "influencer_fee": float(campaign.influencer_fee or 0),
            "total_collected": campaign_total,
            "escrow_status": campaign.escrow_status
        })
    
    return PlatformRevenueStats(
        total_revenue=total_revenue,
        brand_fees_total=brand_fees_total,
        influencer_fees_total=influencer_fees_total,
        total_campaigns=total_campaigns,
        revenue_by_campaign=revenue_by_campaign
    )


@router.get("/escrow-overview", response_model=AdminEscrowStats)
async def get_escrow_overview(
    current_user: User = Depends(get_admin_user),
    db: Session = Depends(get_db)
):
    """
    Get complete escrow system overview.
    Shows all locked funds, campaigns, and revenue.
    """
    # Calculate total locked funds across all users
    wallets = db.query(Wallet).all()
    total_locked_funds = sum(w.locked_balance for w in wallets)
    
    # Count campaigns with escrow
    total_campaigns_with_escrow = db.query(Campaign).filter(
        Campaign.budget_amount.isnot(None)
    ).count()
    
    # Campaigns by escrow status
    campaigns_by_status = db.query(
        Campaign.escrow_status,
        func.count(Campaign.id)
    ).filter(
        Campaign.escrow_status.isnot(None)
    ).group_by(Campaign.escrow_status).all()
    
    campaigns_by_escrow_status = {
        status: count for status, count in campaigns_by_status
    }
    
    # Get platform revenue stats
    revenues = db.query(PlatformRevenue).all()
    total_revenue = sum(r.total_fee for r in revenues)
    brand_fees_total = sum(r.brand_fee for r in revenues)
    influencer_fees_total = sum(r.influencer_fee for r in revenues)
    
    # Revenue by campaign
    revenue_by_campaign = []
    campaigns_with_revenue = db.query(Campaign).filter(
        Campaign.budget_amount.isnot(None)
    ).order_by(Campaign.created_at.desc()).limit(10).all()
    
    for campaign in campaigns_with_revenue:
        campaign_revenues = db.query(PlatformRevenue).filter(
            PlatformRevenue.campaign_id == campaign.id
        ).all()
        
        campaign_total = sum(r.total_fee for r in campaign_revenues)
        
        revenue_by_campaign.append({
            "campaign_id": campaign.id,
            "campaign_name": campaign.name,
            "brand_fee": float(campaign.brand_fee or 0),
            "influencer_fee": float(campaign.influencer_fee or 0),
            "total_collected": campaign_total,
            "escrow_status": campaign.escrow_status
        })
    
    platform_revenue = PlatformRevenueStats(
        total_revenue=total_revenue,
        brand_fees_total=brand_fees_total,
        influencer_fees_total=influencer_fees_total,
        total_campaigns=total_campaigns_with_escrow,
        revenue_by_campaign=revenue_by_campaign
    )
    
    # Recent transactions
    recent_transactions = []
    recent_campaigns = db.query(Campaign).filter(
        Campaign.escrow_status.in_(['locked', 'released', 'refunded'])
    ).order_by(Campaign.funds_locked_at.desc()).limit(20).all()
    
    for campaign in recent_campaigns:
        brand = db.query(BrandProfile).filter(BrandProfile.id == campaign.brand_id).first()
        
        recent_transactions.append({
            "campaign_id": campaign.id,
            "campaign_name": campaign.name,
            "brand_name": brand.company_name if brand else "Unknown",
            "budget_amount": float(campaign.budget_amount or 0),
            "total_payment": float(campaign.total_payment or 0),
            "escrow_status": campaign.escrow_status,
            "locked_at": campaign.funds_locked_at,
            "released_at": campaign.funds_released_at
        })
    
    return AdminEscrowStats(
        total_locked_funds=total_locked_funds,
        total_campaigns_with_escrow=total_campaigns_with_escrow,
        campaigns_by_escrow_status=campaigns_by_escrow_status,
        platform_revenue=platform_revenue,
        recent_transactions=recent_transactions
    )
