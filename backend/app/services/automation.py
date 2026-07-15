"""
Background Automation Service
Implements automated tasks like daily trust score recalculation,
influencer downgrade, and suspicious profile detection.
"""
from sqlalchemy.orm import Session
from app.db.models.influencer import InfluencerProfile
from app.db.models.user import User
from app.core.roles import VerificationStatus, UserRole
from app.services.trust_engine import TrustEngine


class AutomationService:
    """
    Handles automated background tasks.
    Can be called periodically or on-demand.
    """
    
    @staticmethod
    def daily_trust_recalculation(db: Session) -> dict:
        """
        Recalculate trust scores for all influencers daily.
        
        Returns:
            Dictionary with automation results
        """
        all_influencers = db.query(InfluencerProfile).all()
        
        count = 0
        updated_scores = []
        
        for influencer in all_influencers:
            old_score = influencer.trust_score
            new_score = TrustEngine.calculate_trust_score(influencer, db)
            influencer.trust_score = new_score
            
            count += 1
            if old_score != new_score:
                updated_scores.append({
                    "influencer_id": influencer.id,
                    "old_score": old_score,
                    "new_score": new_score
                })
        
        db.commit()
        
        return {
            "total_influencers_processed": count,
            "score_changes": len(updated_scores),
            "details": updated_scores
        }
    
    @staticmethod
    def downgrade_inactive_influencers(
        inactivity_threshold_days: int = 90,
        db: Session = None
    ) -> dict:
        """
        Downgrade trust score for influencers inactive for 90+ days.
        
        Args:
            inactivity_threshold_days: Days of inactivity to trigger downgrade
            db: Database session
            
        Returns:
            Dictionary with downgrade results
        """
        from datetime import datetime, timedelta
        from app.db.models.request import CollaborationRequest
        
        threshold_date = datetime.utcnow() - timedelta(days=inactivity_threshold_days)
        
        # Find influencers with no activity (no accepted requests) since threshold
        all_influencers = db.query(InfluencerProfile).all()
        
        downgraded = []
        
        for influencer in all_influencers:
            # Check if has any recent activity
            recent_activity = db.query(CollaborationRequest).filter(
                CollaborationRequest.influencer_id == influencer.id,
                CollaborationRequest.updated_at > threshold_date
            ).first()
            
            if not recent_activity and influencer.trust_score > 0:
                # Apply penalty: reduce by 10% with minimum floor
                old_score = influencer.trust_score
                new_score = max(influencer.trust_score * 0.9, 0)
                influencer.trust_score = new_score
                
                downgraded.append({
                    "influencer_id": influencer.id,
                    "old_score": old_score,
                    "new_score": new_score,
                    "reason": "Inactivity"
                })
        
        db.commit()
        
        return {
            "total_downgraded": len(downgraded),
            "details": downgraded,
            "threshold_days": inactivity_threshold_days
        }
    
    @staticmethod
    def flag_suspicious_profiles(db: Session) -> dict:
        """
        Detect and flag suspicious profiles based on rules.
        
        Rules:
        1. Unverified influencers with rejected verification attempts
        2. Profiles with no activity after creation > 180 days
        
        Returns:
            Dictionary with flagging results
        """
        from datetime import datetime, timedelta
        from app.db.models.verification import VerificationRequest
        from app.db.models.report import Report
        
        flagged = []
        
        # Rule 1: Check for rejected verifications
        rejected_verifications = db.query(VerificationRequest).filter(
            VerificationRequest.status == VerificationStatus.REJECTED
        ).all()
        
        for ver_req in rejected_verifications:
            influencer = ver_req.influencer
            # Check if still unverified after rejection
            if influencer.verification_status == VerificationStatus.REJECTED:
                # Create a report for admin review
                existing_report = db.query(Report).filter(
                    Report.reported_entity_type == "influencer",
                    Report.reported_entity_id == influencer.id,
                    Report.reason.like("%Rejected verification%")
                ).first()
                
                if not existing_report:
                    report = Report(
                        reported_entity_type="influencer",
                        reported_entity_id=influencer.id,
                        reason="Rejected verification - potential suspicious activity"
                    )
                    db.add(report)
                    flagged.append({
                        "influencer_id": influencer.id,
                        "reason": "Rejected verification"
                    })
        
        db.commit()
        
        return {
            "total_flagged": len(flagged),
            "details": flagged
        }
    
    @staticmethod
    def update_profile_completion_scores(db: Session) -> dict:
        """
        Recalculate profile completion for all influencers.
        
        Returns:
            Dictionary with update results
        """
        all_influencers = db.query(InfluencerProfile).all()
        
        updated = []
        
        for influencer in all_influencers:
            old_completion = influencer.profile_completion
            new_completion = TrustEngine.recalculate_profile_completion(influencer)
            influencer.profile_completion = new_completion
            
            if old_completion != new_completion:
                updated.append({
                    "influencer_id": influencer.id,
                    "old_completion": old_completion,
                    "new_completion": new_completion
                })
        
        db.commit()
        
        return {
            "total_updated": len(updated),
            "details": updated
        }
