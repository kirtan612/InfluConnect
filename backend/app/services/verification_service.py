"""
Verification Service
Handles influencer verification requests and status updates.
"""
from datetime import datetime
from sqlalchemy.orm import Session
from app.db.models.verification import VerificationRequest
from app.db.models.influencer import InfluencerProfile
from app.core.roles import VerificationStatus
from app.services.trust_engine import TrustEngine


class VerificationService:
    """
    Service for managing influencer verification requests.
    Evaluates metrics and manages verification status.
    """
    
    @staticmethod
    def submit_verification_request(
        influencer_id: int,
        metrics_snapshot: dict = None,
        db: Session = None
    ) -> VerificationRequest:
        """
        Submit a verification request for an influencer.
        
        Args:
            influencer_id: ID of influencer
            metrics_snapshot: JSON data with influencer metrics
            db: Database session
            
        Returns:
            Created VerificationRequest
        """
        # Check if influencer exists
        influencer = db.query(InfluencerProfile).filter(
            InfluencerProfile.id == influencer_id
        ).first()
        
        if not influencer:
            raise ValueError(f"Influencer {influencer_id} not found")
        
        # Create new verification request
        verification_req = VerificationRequest(
            influencer_id=influencer_id,
            metrics_snapshot=metrics_snapshot or {},
            status=VerificationStatus.PENDING
        )
        
        db.add(verification_req)
        db.commit()
        db.refresh(verification_req)
        
        return verification_req
    
    @staticmethod
    def evaluate_verification(
        verification_request: VerificationRequest,
        db: Session
    ) -> VerificationStatus:
        """
        Evaluate verification request based on metrics.
        This is placeholder logic - could be extended with real metric analysis.
        
        Args:
            verification_request: VerificationRequest to evaluate
            db: Database session
            
        Returns:
            Recommended VerificationStatus
        """
        metrics = verification_request.metrics_snapshot or {}
        
        # Simple placeholder logic:
        # If metrics contains required fields, approve; otherwise, pending
        required_fields = ["followers", "engagement_rate"]
        has_required = all(field in metrics for field in required_fields)
        
        if has_required:
            followers = metrics.get("followers", 0)
            engagement = metrics.get("engagement_rate", 0)
            
            # Simple rule: If followers > 1000 and engagement > 2%, recommend approval
            if followers > 1000 and engagement > 2:
                return VerificationStatus.VERIFIED
        
        return VerificationStatus.PENDING
    
    @staticmethod
    def approve_verification(
        verification_request_id: int,
        admin_reason: str = None,
        db: Session = None
    ) -> VerificationRequest:
        """
        Admin approves a verification request.
        
        Args:
            verification_request_id: ID of request to approve
            admin_reason: Reason for approval
            db: Database session
            
        Returns:
            Updated VerificationRequest
        """
        verification_req = db.query(VerificationRequest).filter(
            VerificationRequest.id == verification_request_id
        ).first()
        
        if not verification_req:
            raise ValueError(f"VerificationRequest {verification_request_id} not found")
        
        # Update influencer profile
        influencer = verification_req.influencer
        influencer.verification_status = VerificationStatus.VERIFIED
        influencer.admin_note = admin_reason
        
        # Update verification request
        verification_req.status = VerificationStatus.VERIFIED
        verification_req.admin_reason = admin_reason
        verification_req.reviewed_at = datetime.utcnow()
        
        # Recalculate trust score
        TrustEngine.update_trust_score(influencer.id, db)
        
        db.commit()
        
        return verification_req
    
    @staticmethod
    def reject_verification(
        verification_request_id: int,
        admin_reason: str = None,
        db: Session = None
    ) -> VerificationRequest:
        """
        Admin rejects a verification request.
        
        Args:
            verification_request_id: ID of request to reject
            admin_reason: Reason for rejection
            db: Database session
            
        Returns:
            Updated VerificationRequest
        """
        verification_req = db.query(VerificationRequest).filter(
            VerificationRequest.id == verification_request_id
        ).first()
        
        if not verification_req:
            raise ValueError(f"VerificationRequest {verification_request_id} not found")
        
        # Update influencer profile
        influencer = verification_req.influencer
        influencer.verification_status = VerificationStatus.REJECTED
        influencer.admin_note = admin_reason
        
        # Update verification request
        verification_req.status = VerificationStatus.REJECTED
        verification_req.admin_reason = admin_reason
        verification_req.reviewed_at = datetime.utcnow()
        
        # Recalculate trust score (may decrease)
        TrustEngine.update_trust_score(influencer.id, db)
        
        db.commit()
        
        return verification_req
