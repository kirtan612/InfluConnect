"""
Automation tasks for InfluConnect platform.
Background jobs for trust scores, suspicious detection, and profile updates.
"""
import logging
import time
from datetime import datetime, timedelta
from typing import Dict, Any
from sqlalchemy.orm import Session
from sqlalchemy import func, and_

from app.core.celery_config import celery_app
from app.db.session import SessionLocal
from app.db.models.influencer import InfluencerProfile
from app.db.models.user import User
from app.core.roles import UserRole, VerificationStatus

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


def get_db() -> Session:
    """Get database session for tasks."""
    db = SessionLocal()
    try:
        return db
    except Exception as e:
        db.close()
        raise e


@celery_app.task(bind=True, name="app.tasks.automation_tasks.recalculate_trust_scores")
def recalculate_trust_scores(self) -> Dict[str, Any]:
    """
    Recalculate trust scores for all influencers based on current metrics.
    
    Trust score calculation factors:
    - Profile completion (0-40 points)
    - Verification status (0-30 points)
    - Account age (0-20 points)
    - Engagement consistency (0-10 points)
    """
    task_id = self.request.id
    logger.info(f"[TASK {task_id}] Starting trust score recalculation...")
    
    db = get_db()
    try:
        # Get all influencer profiles
        influencers = db.query(InfluencerProfile).join(User).filter(
            User.role == UserRole.INFLUENCER,
            User.is_active == True
        ).all()
        
        updated_count = 0
        total_count = len(influencers)
        
        logger.info(f"[TASK {task_id}] Processing {total_count} influencers...")
        
        for influencer in influencers:
            try:
                # Calculate new trust score
                new_score = calculate_trust_score(influencer)
                
                # Update if score changed significantly (>5 points)
                if abs(influencer.trust_score - new_score) > 5:
                    old_score = influencer.trust_score
                    influencer.trust_score = new_score
                    updated_count += 1
                    
                    logger.info(
                        f"[TASK {task_id}] Updated influencer {influencer.id}: "
                        f"{old_score:.1f} → {new_score:.1f}"
                    )
                
                # Simulate processing time
                time.sleep(0.1)
                
            except Exception as e:
                logger.error(f"[TASK {task_id}] Error processing influencer {influencer.id}: {e}")
                continue
        
        # Commit all changes
        db.commit()
        
        result = {
            "task_id": task_id,
            "status": "completed",
            "total_processed": total_count,
            "updated_count": updated_count,
            "execution_time": datetime.utcnow().isoformat(),
            "message": f"Trust scores recalculated for {total_count} influencers, {updated_count} updated"
        }
        
        logger.info(f"[TASK {task_id}] Completed: {result['message']}")
        return result
        
    except Exception as e:
        db.rollback()
        error_msg = f"Trust score recalculation failed: {str(e)}"
        logger.error(f"[TASK {task_id}] {error_msg}")
        
        return {
            "task_id": task_id,
            "status": "failed",
            "error": error_msg,
            "execution_time": datetime.utcnow().isoformat()
        }
    finally:
        db.close()


@celery_app.task(bind=True, name="app.tasks.automation_tasks.flag_suspicious_influencers")
def flag_suspicious_influencers(self) -> Dict[str, Any]:
    """
    Detect and flag suspicious influencer accounts based on various criteria.
    
    Suspicious indicators:
    - Sudden follower spikes (>50% increase in 24h)
    - Engagement rate anomalies (<1% or >15%)
    - Profile completion drops
    - Inactive for >30 days but high engagement
    """
    task_id = self.request.id
    logger.info(f"[TASK {task_id}] Starting suspicious account detection...")
    
    db = get_db()
    try:
        # Get all active influencers
        influencers = db.query(InfluencerProfile).join(User).filter(
            User.role == UserRole.INFLUENCER,
            User.is_active == True
        ).all()
        
        flagged_count = 0
        total_count = len(influencers)
        
        logger.info(f"[TASK {task_id}] Analyzing {total_count} influencers...")
        
        for influencer in influencers:
            try:
                suspicious_reasons = []
                
                # Check engagement rate anomalies
                if hasattr(influencer, 'engagement_rate'):
                    if influencer.engagement_rate < 0.01:  # Less than 1%
                        suspicious_reasons.append("Very low engagement rate")
                    elif influencer.engagement_rate > 0.15:  # More than 15%
                        suspicious_reasons.append("Unusually high engagement rate")
                
                # Check profile completion drops
                if influencer.profile_completion < 30:
                    suspicious_reasons.append("Low profile completion")
                
                # Check last activity (if user has last_login)
                if hasattr(influencer.user, 'last_login'):
                    if influencer.user.last_login:
                        days_inactive = (datetime.utcnow() - influencer.user.last_login).days
                        if days_inactive > 30:
                            suspicious_reasons.append(f"Inactive for {days_inactive} days")
                
                # Flag if suspicious
                if suspicious_reasons:
                    if not influencer.suspicious_flag:
                        influencer.suspicious_flag = True
                        influencer.admin_note = f"Auto-flagged: {'; '.join(suspicious_reasons)}"
                        flagged_count += 1
                        
                        logger.info(
                            f"[TASK {task_id}] Flagged influencer {influencer.id}: "
                            f"{'; '.join(suspicious_reasons)}"
                        )
                else:
                    # Remove flag if no longer suspicious
                    if influencer.suspicious_flag:
                        influencer.suspicious_flag = False
                        influencer.admin_note = "Auto-cleared: No longer suspicious"
                
                # Simulate processing time
                time.sleep(0.05)
                
            except Exception as e:
                logger.error(f"[TASK {task_id}] Error analyzing influencer {influencer.id}: {e}")
                continue
        
        # Commit all changes
        db.commit()
        
        result = {
            "task_id": task_id,
            "status": "completed",
            "total_analyzed": total_count,
            "flagged_count": flagged_count,
            "execution_time": datetime.utcnow().isoformat(),
            "message": f"Analyzed {total_count} influencers, {flagged_count} flagged as suspicious"
        }
        
        logger.info(f"[TASK {task_id}] Completed: {result['message']}")
        return result
        
    except Exception as e:
        db.rollback()
        error_msg = f"Suspicious account detection failed: {str(e)}"
        logger.error(f"[TASK {task_id}] {error_msg}")
        
        return {
            "task_id": task_id,
            "status": "failed",
            "error": error_msg,
            "execution_time": datetime.utcnow().isoformat()
        }
    finally:
        db.close()


@celery_app.task(bind=True, name="app.tasks.automation_tasks.downgrade_inactive_influencers")
def downgrade_inactive_influencers(self) -> Dict[str, Any]:
    """
    Downgrade trust scores for inactive influencers.
    
    Criteria for downgrade:
    - No login for >60 days: -10 points
    - No login for >90 days: -20 points
    - No login for >180 days: -30 points
    """
    task_id = self.request.id
    logger.info(f"[TASK {task_id}] Starting inactive influencer downgrade...")
    
    db = get_db()
    try:
        # Calculate cutoff dates
        now = datetime.utcnow()
        cutoff_60 = now - timedelta(days=60)
        cutoff_90 = now - timedelta(days=90)
        cutoff_180 = now - timedelta(days=180)
        
        # Get inactive influencers (assuming last_login exists on User model)
        # For now, we'll use created_at as a proxy for last activity
        influencers = db.query(InfluencerProfile).join(User).filter(
            User.role == UserRole.INFLUENCER,
            User.is_active == True
        ).all()
        
        downgraded_count = 0
        total_count = len(influencers)
        
        logger.info(f"[TASK {task_id}] Processing {total_count} influencers for inactivity...")
        
        for influencer in influencers:
            try:
                # Use created_at as proxy for last activity (in real app, use last_login)
                last_activity = influencer.user.created_at
                days_inactive = (now - last_activity).days
                
                penalty = 0
                reason = ""
                
                if days_inactive > 180:
                    penalty = 30
                    reason = f"Inactive for {days_inactive} days (>180)"
                elif days_inactive > 90:
                    penalty = 20
                    reason = f"Inactive for {days_inactive} days (>90)"
                elif days_inactive > 60:
                    penalty = 10
                    reason = f"Inactive for {days_inactive} days (>60)"
                
                if penalty > 0:
                    old_score = influencer.trust_score
                    new_score = max(0, old_score - penalty)  # Don't go below 0
                    
                    if new_score != old_score:
                        influencer.trust_score = new_score
                        influencer.admin_note = f"Auto-downgraded: {reason}"
                        downgraded_count += 1
                        
                        logger.info(
                            f"[TASK {task_id}] Downgraded influencer {influencer.id}: "
                            f"{old_score:.1f} → {new_score:.1f} ({reason})"
                        )
                
                # Simulate processing time
                time.sleep(0.05)
                
            except Exception as e:
                logger.error(f"[TASK {task_id}] Error processing influencer {influencer.id}: {e}")
                continue
        
        # Commit all changes
        db.commit()
        
        result = {
            "task_id": task_id,
            "status": "completed",
            "total_processed": total_count,
            "downgraded_count": downgraded_count,
            "execution_time": datetime.utcnow().isoformat(),
            "message": f"Processed {total_count} influencers, {downgraded_count} downgraded for inactivity"
        }
        
        logger.info(f"[TASK {task_id}] Completed: {result['message']}")
        return result
        
    except Exception as e:
        db.rollback()
        error_msg = f"Inactive influencer downgrade failed: {str(e)}"
        logger.error(f"[TASK {task_id}] {error_msg}")
        
        return {
            "task_id": task_id,
            "status": "failed",
            "error": error_msg,
            "execution_time": datetime.utcnow().isoformat()
        }
    finally:
        db.close()


@celery_app.task(bind=True, name="app.tasks.automation_tasks.update_profile_completion")
def update_profile_completion(self) -> Dict[str, Any]:
    """
    Update profile completion percentages for all influencers.
    
    Profile completion factors:
    - Display name: 20%
    - Bio: 15%
    - Category: 10%
    - Profile image: 15%
    - Social links: 25%
    - Platform data: 15%
    """
    task_id = self.request.id
    logger.info(f"[TASK {task_id}] Starting profile completion update...")
    
    db = get_db()
    try:
        # Get all influencer profiles
        influencers = db.query(InfluencerProfile).join(User).filter(
            User.role == UserRole.INFLUENCER,
            User.is_active == True
        ).all()
        
        updated_count = 0
        total_count = len(influencers)
        
        logger.info(f"[TASK {task_id}] Processing {total_count} influencers...")
        
        for influencer in influencers:
            try:
                # Calculate completion percentage
                new_completion = calculate_profile_completion(influencer)
                
                # Update if changed
                if abs(influencer.profile_completion - new_completion) > 1:
                    old_completion = influencer.profile_completion
                    influencer.profile_completion = new_completion
                    updated_count += 1
                    
                    logger.info(
                        f"[TASK {task_id}] Updated influencer {influencer.id}: "
                        f"{old_completion:.1f}% → {new_completion:.1f}%"
                    )
                
                # Simulate processing time
                time.sleep(0.05)
                
            except Exception as e:
                logger.error(f"[TASK {task_id}] Error processing influencer {influencer.id}: {e}")
                continue
        
        # Commit all changes
        db.commit()
        
        result = {
            "task_id": task_id,
            "status": "completed",
            "total_processed": total_count,
            "updated_count": updated_count,
            "execution_time": datetime.utcnow().isoformat(),
            "message": f"Profile completion updated for {total_count} influencers, {updated_count} changed"
        }
        
        logger.info(f"[TASK {task_id}] Completed: {result['message']}")
        return result
        
    except Exception as e:
        db.rollback()
        error_msg = f"Profile completion update failed: {str(e)}"
        logger.error(f"[TASK {task_id}] {error_msg}")
        
        return {
            "task_id": task_id,
            "status": "failed",
            "error": error_msg,
            "execution_time": datetime.utcnow().isoformat()
        }
    finally:
        db.close()


# Helper functions

def calculate_trust_score(influencer: InfluencerProfile) -> float:
    """Calculate trust score for an influencer."""
    score = 0.0
    
    # Profile completion (0-40 points)
    score += (influencer.profile_completion / 100) * 40
    
    # Verification status (0-30 points)
    if influencer.verification_status == VerificationStatus.VERIFIED:
        score += 30
    elif influencer.verification_status == VerificationStatus.PENDING:
        score += 15
    
    # Account age (0-20 points) - newer accounts get lower scores
    if influencer.user:
        account_age_days = (datetime.utcnow() - influencer.user.created_at).days
        age_score = min(20, account_age_days / 30 * 20)  # Max score after 30 days
        score += age_score
    
    # Engagement consistency (0-10 points) - placeholder
    if hasattr(influencer, 'engagement_rate'):
        if 0.02 <= influencer.engagement_rate <= 0.08:  # Good engagement range
            score += 10
        elif 0.01 <= influencer.engagement_rate <= 0.12:  # Acceptable range
            score += 5
    else:
        score += 5  # Default if no engagement data
    
    return min(100.0, max(0.0, score))


def calculate_profile_completion(influencer: InfluencerProfile) -> float:
    """Calculate profile completion percentage."""
    completion = 0.0
    
    # Display name (20%)
    if influencer.display_name:
        completion += 20
    
    # Bio (15%)
    if influencer.bio:
        completion += 15
    
    # Category (10%)
    if influencer.category:
        completion += 10
    
    # Profile image (15%)
    if influencer.profile_image_url:
        completion += 15
    
    # Social links (25%)
    if influencer.social_links:
        # Count number of social links
        link_count = len(influencer.social_links) if isinstance(influencer.social_links, dict) else 0
        completion += min(25, link_count * 8)  # Up to 25% for 3+ links
    
    # Platform data (15%)
    if influencer.platforms:
        platform_count = len(influencer.platforms) if isinstance(influencer.platforms, list) else 0
        completion += min(15, platform_count * 7)  # Up to 15% for 2+ platforms
    
    return min(100.0, completion)