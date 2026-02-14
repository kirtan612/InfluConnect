"""
Influencer router.
Handles influencer profile management, achievements, verification, and requests.
"""
from datetime import datetime
from typing import List
from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.db.models.user import User
from app.db.models.influencer import InfluencerProfile
from app.db.models.verification import VerificationRequest
from app.db.models.request import CollaborationRequest
from app.db.models.achievement import Achievement
from app.core.dependencies import get_current_user, get_influencer_user
from app.core.roles import VerificationStatus
from app.schemas.influencer import (
    InfluencerProfileUpdate,
    InfluencerProfileResponse,
    VerificationRequestSubmit,
    TrustExplanation,
)
from app.schemas.achievement import AchievementCreate, AchievementResponse
from app.services.verification_service import VerificationService
from app.services.trust_engine import TrustEngine

router = APIRouter(prefix="/influencer", tags=["Influencer"])


def get_influencer_profile(db: Session, user: User) -> InfluencerProfile:
    """Helper to get influencer profile or 404."""
    profile = db.query(InfluencerProfile).filter(
        InfluencerProfile.user_id == user.id
    ).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Influencer profile not found")
    return profile


# ============================================================================
# Profile endpoints
# ============================================================================

@router.get("/profile", response_model=InfluencerProfileResponse)
async def get_profile(
    current_user: User = Depends(get_influencer_user),
    db: Session = Depends(get_db)
):
    """Get current influencer's profile."""
    profile = get_influencer_profile(db, current_user)
    return profile


@router.put("/profile", response_model=InfluencerProfileResponse)
async def update_profile(
    data: InfluencerProfileUpdate,
    current_user: User = Depends(get_influencer_user),
    db: Session = Depends(get_db)
):
    """Update current influencer's profile."""
    profile = get_influencer_profile(db, current_user)

    update_data = data.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(profile, key, value)

    # Recalculate profile completion
    profile.profile_completion = _calc_profile_completion(profile)
    profile.updated_at = datetime.utcnow()

    db.commit()
    db.refresh(profile)
    return profile


def _calc_profile_completion(profile: InfluencerProfile) -> float:
    """Calculate profile completion percentage."""
    fields = [
        profile.display_name,
        profile.bio,
        profile.category,
        profile.profile_image_url,
        profile.social_links,
    ]
    filled = sum(1 for f in fields if f)
    return round((filled / len(fields)) * 100, 1)


# ============================================================================
# Achievement endpoints
# ============================================================================

@router.get("/achievements", response_model=List[AchievementResponse])
async def get_achievements(
    current_user: User = Depends(get_influencer_user),
    db: Session = Depends(get_db)
):
    """Get all achievements for the current influencer."""
    profile = get_influencer_profile(db, current_user)
    achievements = db.query(Achievement).filter(
        Achievement.influencer_id == profile.id
    ).order_by(Achievement.created_at.desc()).all()
    return achievements


@router.post("/achievements", response_model=AchievementResponse, status_code=201)
async def add_achievement(
    data: AchievementCreate,
    current_user: User = Depends(get_influencer_user),
    db: Session = Depends(get_db)
):
    """Add a new achievement to the current influencer's profile."""
    profile = get_influencer_profile(db, current_user)

    achievement = Achievement(
        influencer_id=profile.id,
        title=data.title,
        description=data.description,
        date=data.date,
        icon=data.icon,
        proof_link=data.proof_link,
        created_at=datetime.utcnow()
    )
    db.add(achievement)
    db.commit()
    db.refresh(achievement)
    return achievement


@router.delete("/achievements/{achievement_id}")
async def delete_achievement(
    achievement_id: int,
    current_user: User = Depends(get_influencer_user),
    db: Session = Depends(get_db)
):
    """Delete an achievement."""
    profile = get_influencer_profile(db, current_user)
    ach = db.query(Achievement).filter(
        Achievement.id == achievement_id,
        Achievement.influencer_id == profile.id
    ).first()
    if not ach:
        raise HTTPException(status_code=404, detail="Achievement not found")
    db.delete(ach)
    db.commit()
    return {"message": "Achievement deleted"}


# ============================================================================
# Verification endpoints
# ============================================================================

@router.post("/verify")
async def submit_verification(
    data: VerificationRequestSubmit,
    background_tasks: BackgroundTasks,
    current_user: User = Depends(get_influencer_user),
    db: Session = Depends(get_db)
):
    """Submit a verification request."""
    profile = get_influencer_profile(db, current_user)

    # Check for existing pending request
    existing = db.query(VerificationRequest).filter(
        VerificationRequest.influencer_id == profile.id,
        VerificationRequest.status == "pending"
    ).first()
    if existing:
        raise HTTPException(status_code=400, detail="You already have a pending verification request")

    # Create verification request
    vr = VerificationRequest(
        influencer_id=profile.id,
        metrics_snapshot=data.metrics_snapshot,
        status="pending",
        created_at=datetime.utcnow()
    )
    db.add(vr)

    # Update influencer status to PENDING
    profile.verification_status = VerificationStatus.PENDING
    profile.updated_at = datetime.utcnow()

    db.commit()
    db.refresh(vr)

    # Auto-evaluate in background
    background_tasks.add_task(_auto_evaluate_verification, vr.id)

    return {
        "message": "Verification request submitted successfully",
        "request_id": vr.id,
        "status": "pending"
    }


def _auto_evaluate_verification(verification_id: int):
    """Auto-evaluate verification request in background."""
    from app.db.session import SessionLocal
    db = SessionLocal()
    try:
        vr = db.query(VerificationRequest).filter(VerificationRequest.id == verification_id).first()
        if not vr or vr.status != "pending":
            return

        metrics = vr.metrics_snapshot or {}
        followers = metrics.get("followers", 0)
        engagement = metrics.get("engagement_rate", 0)

        # Simple auto-approval: followers > 1000 AND engagement > 2%
        if followers > 1000 and engagement > 2.0:
            vr.status = "approved"
            vr.reviewed_at = datetime.utcnow()

            profile = db.query(InfluencerProfile).filter(
                InfluencerProfile.id == vr.influencer_id
            ).first()
            if profile:
                profile.verification_status = VerificationStatus.VERIFIED
                profile.updated_at = datetime.utcnow()
                # Boost trust score
                profile.trust_score = min(100, profile.trust_score + 20)
        # If not auto-approved, stays as "pending" for manual admin review

        db.commit()
    except Exception:
        db.rollback()
    finally:
        db.close()


@router.get("/verification-status")
async def get_verification_status(
    current_user: User = Depends(get_influencer_user),
    db: Session = Depends(get_db)
):
    """Get current verification status and latest request."""
    profile = get_influencer_profile(db, current_user)

    latest_request = db.query(VerificationRequest).filter(
        VerificationRequest.influencer_id == profile.id
    ).order_by(VerificationRequest.created_at.desc()).first()

    result = {
        "current_status": profile.verification_status.value if hasattr(profile.verification_status, 'value') else str(profile.verification_status),
        "latest_request": None
    }

    if latest_request:
        result["latest_request"] = {
            "id": latest_request.id,
            "status": latest_request.status,
            "metrics_snapshot": latest_request.metrics_snapshot,
            "submitted_at": latest_request.created_at.isoformat() if latest_request.created_at else None,
            "reviewed_at": latest_request.reviewed_at.isoformat() if latest_request.reviewed_at else None,
            "admin_reason": getattr(latest_request, "admin_reason", None)
        }

    return result


@router.get("/trust-explanation", response_model=TrustExplanation)
async def get_trust_explanation(
    current_user: User = Depends(get_influencer_user),
    db: Session = Depends(get_db)
):
    """Get explanation of trust score calculation."""
    profile = get_influencer_profile(db, current_user)

    collab_count = db.query(CollaborationRequest).filter(
        CollaborationRequest.influencer_id == profile.id,
        CollaborationRequest.status == "accepted"
    ).count()

    return TrustExplanation(
        current_score=profile.trust_score,
        profile_completion=profile.profile_completion,
        verification_status=profile.verification_status,
        collaboration_count=collab_count,
        calculation_breakdown=f"Score based on: profile ({profile.profile_completion}%), verification ({profile.verification_status.value if hasattr(profile.verification_status, 'value') else str(profile.verification_status)}), collaborations ({collab_count})"
    )


# ============================================================================
# Collaboration Requests endpoint (for influencer)
# ============================================================================

@router.get("/requests")
async def get_influencer_requests(
    current_user: User = Depends(get_influencer_user),
    db: Session = Depends(get_db)
):
    """Get collaboration requests for the current influencer."""
    profile = get_influencer_profile(db, current_user)

    requests = db.query(CollaborationRequest).filter(
        CollaborationRequest.influencer_id == profile.id
    ).order_by(CollaborationRequest.created_at.desc()).all()

    result = []
    for req in requests:
        campaign = req.campaign
        brand = campaign.brand if campaign else None
        result.append({
            "id": req.id,
            "campaign_id": req.campaign_id,
            "campaign_name": campaign.name if campaign else "Unknown",
            "brand_name": brand.company_name if brand else "Unknown",
            "status": req.status,
            "created_at": req.created_at.isoformat() if req.created_at else None,
            "updated_at": req.updated_at.isoformat() if req.updated_at else None,
        })

    return result
