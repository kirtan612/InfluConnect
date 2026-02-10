"""
Admin router - Admin-only endpoints for managing verifications, suspension, reports.
"""
from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.roles import UserRole, VerificationStatus
from app.db.session import get_db
from app.db.models.user import User
from app.db.models.influencer import InfluencerProfile
from app.db.models.verification import VerificationRequest
from app.db.models.report import Report
from app.schemas.admin import (
    AdminInfluencerResponse, AdminVerifyInfluencerRequest,
    AdminSuspendUserRequest, ReportResponse, AdminDashboardStats
)
from app.routers.auth import get_current_user
from app.services.verification_service import VerificationService
from app.services.automation import AutomationService


router = APIRouter(prefix="/admin", tags=["admin"])


def get_admin_user(current_user: User = Depends(get_current_user)) -> User:
    """Ensure user is an admin."""
    if current_user.role != UserRole.ADMIN:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin access required"
        )
    return current_user


@router.get("/influencers", response_model=List[AdminInfluencerResponse])
def list_influencers(
    current_user: User = Depends(get_admin_user),
    db: Session = Depends(get_db),
    verification_status: str = None,
    include_suspended: bool = False
):
    """
    List all influencers with details.
    Admin can filter by verification status.
    """
    query = db.query(InfluencerProfile)
    
    if verification_status:
        try:
            status_enum = VerificationStatus(verification_status)
            query = query.filter(InfluencerProfile.verification_status == status_enum)
        except ValueError:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Invalid verification status: {verification_status}"
            )
    
    influencers = query.all()
    
    results = []
    for influencer in influencers:
        user = db.query(User).filter(User.id == influencer.user_id).first()
        
        if not include_suspended and user.is_suspended:
            continue
        
        results.append(AdminInfluencerResponse(
            id=influencer.id,
            user_id=influencer.user_id,
            display_name=influencer.display_name,
            email=user.email,
            trust_score=influencer.trust_score,
            verification_status=influencer.verification_status,
            profile_completion=influencer.profile_completion,
            is_suspended=user.is_suspended,
            admin_note=influencer.admin_note,
            created_at=influencer.created_at
        ))
    
    return results


@router.post("/verify/{verification_request_id}")
def verify_influencer(
    verification_request_id: int,
    data: AdminVerifyInfluencerRequest,
    current_user: User = Depends(get_admin_user),
    db: Session = Depends(get_db)
):
    """
    Admin approves or rejects a verification request.
    """
    verification_req = db.query(VerificationRequest).filter(
        VerificationRequest.id == verification_request_id
    ).first()
    
    if not verification_req:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Verification request not found"
        )
    
    if data.status == VerificationStatus.VERIFIED:
        result = VerificationService.approve_verification(
            verification_request_id=verification_request_id,
            admin_reason=data.reason,
            db=db
        )
    elif data.status == VerificationStatus.REJECTED:
        result = VerificationService.reject_verification(
            verification_request_id=verification_request_id,
            admin_reason=data.reason,
            db=db
        )
    else:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid status. Must be 'verified' or 'rejected'"
        )
    
    return {
        "id": result.id,
        "status": result.status.value,
        "reason": result.admin_reason,
        "message": "Verification decision recorded"
    }


@router.post("/suspend/{user_id}")
def suspend_user(
    user_id: int,
    data: AdminSuspendUserRequest,
    current_user: User = Depends(get_admin_user),
    db: Session = Depends(get_db)
):
    """
    Admin suspend or unsuspend a user.
    """
    user = db.query(User).filter(User.id == user_id).first()
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    old_status = user.is_suspended
    user.is_suspended = data.is_suspended
    
    db.commit()
    
    action = "suspended" if data.is_suspended else "unsuspended"
    return {
        "user_id": user_id,
        "email": user.email,
        "action": action,
        "reason": data.reason,
        "message": f"User {action} successfully"
    }


@router.get("/reports", response_model=List[ReportResponse])
def list_reports(
    current_user: User = Depends(get_admin_user),
    db: Session = Depends(get_db),
    status_filter: str = None
):
    """
    List all reports.
    Admin can filter by status.
    """
    query = db.query(Report)
    
    if status_filter:
        query = query.filter(Report.status == status_filter)
    
    reports = query.all()
    return reports


@router.post("/reports/{report_id}/review")
def review_report(
    report_id: int,
    status: str,
    admin_notes: str = None,
    current_user: User = Depends(get_admin_user),
    db: Session = Depends(get_db)
):
    """
    Admin reviews and marks report as reviewed/resolved.
    """
    report = db.query(Report).filter(Report.id == report_id).first()
    
    if not report:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Report not found"
        )
    
    report.status = status
    report.admin_notes = admin_notes
    db.commit()
    
    return {
        "id": report.id,
        "status": report.status,
        "message": "Report updated"
    }


@router.get("/stats", response_model=AdminDashboardStats)
def get_dashboard_stats(
    current_user: User = Depends(get_admin_user),
    db: Session = Depends(get_db)
):
    """
    Get admin dashboard statistics.
    """
    from app.db.models.brand import BrandProfile
    from app.db.models.campaign import Campaign
    
    total_influencers = db.query(InfluencerProfile).count()
    total_brands = db.query(BrandProfile).count()
    total_campaigns = db.query(Campaign).count()
    
    pending_verifications = db.query(VerificationRequest).filter(
        VerificationRequest.status == VerificationStatus.PENDING
    ).count()
    
    pending_reports = db.query(Report).filter(
        Report.status == "pending"
    ).count()
    
    suspended_users = db.query(User).filter(
        User.is_suspended == True
    ).count()
    
    return AdminDashboardStats(
        total_influencers=total_influencers,
        total_brands=total_brands,
        total_campaigns=total_campaigns,
        pending_verifications=pending_verifications,
        pending_reports=pending_reports,
        suspended_users=suspended_users
    )


@router.post("/automation/recalculate-trust")
def trigger_trust_recalculation(
    current_user: User = Depends(get_admin_user),
    db: Session = Depends(get_db)
):
    """
    Admin manually trigger trust score recalculation.
    """
    result = AutomationService.daily_trust_recalculation(db)
    return {
        "task": "daily_trust_recalculation",
        "result": result
    }


@router.post("/automation/downgrade-inactive")
def trigger_downgrade_inactive(
    inactivity_days: int = 90,
    current_user: User = Depends(get_admin_user),
    db: Session = Depends(get_db)
):
    """
    Admin manually trigger downgrade of inactive influencers.
    """
    result = AutomationService.downgrade_inactive_influencers(
        inactivity_threshold_days=inactivity_days,
        db=db
    )
    return {
        "task": "downgrade_inactive_influencers",
        "result": result
    }


@router.post("/automation/flag-suspicious")
def trigger_flag_suspicious(
    current_user: User = Depends(get_admin_user),
    db: Session = Depends(get_db)
):
    """
    Admin manually trigger suspicious profile detection.
    """
    result = AutomationService.flag_suspicious_profiles(db)
    return {
        "task": "flag_suspicious_profiles",
        "result": result
    }


@router.post("/automation/update-completion")
def trigger_update_completion(
    current_user: User = Depends(get_admin_user),
    db: Session = Depends(get_db)
):
    """
    Admin manually trigger profile completion recalculation.
    """
    result = AutomationService.update_profile_completion_scores(db)
    return {
        "task": "update_profile_completion_scores",
        "result": result
    }
