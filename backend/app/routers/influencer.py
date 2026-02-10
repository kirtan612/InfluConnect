"""
Influencer router - Profile management, verification, trust info.
"""
from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.roles import UserRole
from app.db.session import get_db
from app.db.models.user import User
from app.db.models.influencer import InfluencerProfile
from app.db.models.verification import VerificationRequest
from app.schemas.influencer import (
    InfluencerProfileResponse, InfluencerProfileUpdate,
    VerificationRequestSubmit, TrustExplanation
)
from app.routers.auth import get_current_user
from app.services.trust_engine import TrustEngine
from app.services.verification_service import VerificationService


router = APIRouter(prefix="/influencer", tags=["influencer"])


def get_influencer_user(current_user: User = Depends(get_current_user)) -> User:
    """Ensure user is an influencer."""
    if current_user.role != UserRole.INFLUENCER:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="This endpoint is for influencers only"
        )
    return current_user


@router.get("/profile", response_model=InfluencerProfileResponse)
def get_profile(
    current_user: User = Depends(get_influencer_user),
    db: Session = Depends(get_db)
):
    """
    Get influencer's own profile.
    """
    influencer = db.query(InfluencerProfile).filter(
        InfluencerProfile.user_id == current_user.id
    ).first()
    
    if not influencer:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Influencer profile not found"
        )
    
    return influencer


@router.put("/profile", response_model=InfluencerProfileResponse)
def update_profile(
    data: InfluencerProfileUpdate,
    current_user: User = Depends(get_influencer_user),
    db: Session = Depends(get_db)
):
    """
    Update influencer profile.
    Also recalculates profile completion and trust score.
    """
    influencer = db.query(InfluencerProfile).filter(
        InfluencerProfile.user_id == current_user.id
    ).first()
    
    if not influencer:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Influencer profile not found"
        )
    
    # Update fields
    if data.display_name is not None:
        influencer.display_name = data.display_name
    if data.bio is not None:
        influencer.bio = data.bio
    if data.category is not None:
        influencer.category = data.category
    
    # Recalculate profile completion
    completion = TrustEngine.recalculate_profile_completion(influencer)
    influencer.profile_completion = completion
    
    # Recalculate trust score
    new_trust_score = TrustEngine.calculate_trust_score(influencer, db)
    influencer.trust_score = new_trust_score
    
    db.commit()
    db.refresh(influencer)
    
    return influencer


@router.post("/verify")
def submit_verification(
    data: VerificationRequestSubmit,
    current_user: User = Depends(get_influencer_user),
    db: Session = Depends(get_db)
):
    """
    Submit a verification request.
    Influencer provides metrics for review.
    """
    influencer = db.query(InfluencerProfile).filter(
        InfluencerProfile.user_id == current_user.id
    ).first()
    
    if not influencer:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Influencer profile not found"
        )
    
    # Submit verification request
    verification_req = VerificationService.submit_verification_request(
        influencer_id=influencer.id,
        metrics_snapshot=data.metrics_snapshot,
        db=db
    )
    
    return {
        "id": verification_req.id,
        "status": verification_req.status.value,
        "message": "Verification request submitted. Admin will review shortly."
    }


@router.get("/trust-explanation", response_model=TrustExplanation)
def get_trust_info(
    current_user: User = Depends(get_influencer_user),
    db: Session = Depends(get_db)
):
    """
    Get detailed explanation of trust score calculation.
    """
    influencer = db.query(InfluencerProfile).filter(
        InfluencerProfile.user_id == current_user.id
    ).first()
    
    if not influencer:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Influencer profile not found"
        )
    
    explanation = TrustEngine.get_trust_explanation(influencer, db)
    return TrustExplanation(**explanation)


@router.get("/verification-status")
def get_verification_status(
    current_user: User = Depends(get_influencer_user),
    db: Session = Depends(get_db)
):
    """
    Get current verification status and history.
    """
    influencer = db.query(InfluencerProfile).filter(
        InfluencerProfile.user_id == current_user.id
    ).first()
    
    if not influencer:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Influencer profile not found"
        )
    
    # Get current verification request
    current_request = db.query(VerificationRequest).filter(
        VerificationRequest.influencer_id == influencer.id
    ).order_by(VerificationRequest.created_at.desc()).first()
    
    return {
        "current_status": influencer.verification_status.value,
        "is_verified": influencer.verification_status.value == "verified",
        "latest_request": {
            "id": current_request.id,
            "status": current_request.status.value,
            "submitted_at": current_request.created_at,
            "reviewed_at": current_request.reviewed_at,
            "admin_reason": current_request.admin_reason
        } if current_request else None
    }

