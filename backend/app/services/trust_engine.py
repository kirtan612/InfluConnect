"""
Trust Engine Service
Calculates and updates trust scores for influencers based on multiple factors.
"""
from sqlalchemy.orm import Session
from app.db.models.influencer import InfluencerProfile
from app.db.models.request import CollaborationRequest
from app.core.roles import (
    VerificationStatus, CollaborationRequestStatus,
    TRUST_SCORE_MIN, TRUST_SCORE_MAX,
    PROFILE_COMPLETION_HIGH_THRESHOLD, PROFILE_COMPLETION_MEDIUM_THRESHOLD
)


class TrustEngine:
    """
    Trust Engine calculates influencer trust scores based on:
    1. Profile completeness
    2. Verification status
    3. Successful collaborations
    """
    
    @staticmethod
    def calculate_trust_score(influencer: InfluencerProfile, db: Session) -> float:
        """
        Calculate trust score for an influencer.
        
        Returns score between 0-100:
        - Profile completion: 0-30 points
        - Verification status: 0-50 points
        - Collaboration count: 0-20 points
        
        Args:
            influencer: InfluencerProfile instance
            db: Database session
            
        Returns:
            Trust score (0-100)
        """
        score = 0.0
        
        # 1. Profile Completion (0-30 points)
        completion_score = (influencer.profile_completion / 100.0) * 30
        score += completion_score
        
        # 2. Verification Status (0-50 points)
        verification_score = TrustEngine._calculate_verification_score(
            influencer.verification_status
        )
        score += verification_score
        
        # 3. Collaboration Count (0-20 points)
        accepted_collaborations = db.query(CollaborationRequest).filter(
            CollaborationRequest.influencer_id == influencer.id,
            CollaborationRequest.status == CollaborationRequestStatus.ACCEPTED
        ).count()
        
        # Cap at 10 successful collaborations for max points
        collab_score = min(accepted_collaborations / 10.0, 1.0) * 20
        score += collab_score
        
        # Clamp to valid range
        return max(TRUST_SCORE_MIN, min(score, TRUST_SCORE_MAX))
    
    @staticmethod
    def _calculate_verification_score(verification_status: VerificationStatus) -> float:
        """
        Calculate score based on verification status.
        
        Returns:
            Verification score (0-50 points)
        """
        scores = {
            VerificationStatus.UNVERIFIED: 0,
            VerificationStatus.PENDING: 15,
            VerificationStatus.VERIFIED: 50,
            VerificationStatus.REJECTED: 0,
        }
        return scores.get(verification_status, 0)
    
    @staticmethod
    def update_trust_score(influencer_id: int, db: Session) -> float:
        """
        Recalculate and update trust score for an influencer.
        
        Args:
            influencer_id: ID of influencer
            db: Database session
            
        Returns:
            New trust score
        """
        influencer = db.query(InfluencerProfile).filter(
            InfluencerProfile.id == influencer_id
        ).first()
        
        if not influencer:
            raise ValueError(f"Influencer {influencer_id} not found")
        
        new_score = TrustEngine.calculate_trust_score(influencer, db)
        influencer.trust_score = new_score
        db.commit()
        
        return new_score
    
    @staticmethod
    def recalculate_profile_completion(
        influencer: InfluencerProfile
    ) -> float:
        """
        Calculate profile completion percentage.
        
        Factors:
        - display_name (25%)
        - bio (25%)
        - category (25%)
        - Additional data (25%)
        
        Returns:
            Completion percentage (0-100)
        """
        completion = 0.0
        total_fields = 4
        
        if influencer.display_name:
            completion += 25
        if influencer.bio:
            completion += 25
        if influencer.category:
            completion += 25
        # Additional field (represented by other metadata or metrics)
        if influencer.trust_score > 0 or influencer.verification_status != VerificationStatus.UNVERIFIED:
            completion += 25
        
        return min(completion, 100)
    
    @staticmethod
    def get_trust_explanation(influencer: InfluencerProfile, db: Session) -> dict:
        """
        Generate human-readable explanation of trust score.
        
        Returns:
            Dictionary with breakdown and explanation
        """
        accepted_collaborations = db.query(CollaborationRequest).filter(
            CollaborationRequest.influencer_id == influencer.id,
            CollaborationRequest.status == CollaborationRequestStatus.ACCEPTED
        ).count()
        
        verification_score = TrustEngine._calculate_verification_score(
            influencer.verification_status
        )
        completion_score = (influencer.profile_completion / 100.0) * 30
        collab_score = min(accepted_collaborations / 10.0, 1.0) * 20
        
        breakdown = (
            f"Profile Completion: {completion_score:.1f}/30 | "
            f"Verification: {verification_score:.1f}/50 | "
            f"Collaborations: {collab_score:.1f}/20"
        )
        
        return {
            "current_score": influencer.trust_score,
            "profile_completion": influencer.profile_completion,
            "verification_status": influencer.verification_status.value,
            "collaboration_count": accepted_collaborations,
            "calculation_breakdown": breakdown
        }
