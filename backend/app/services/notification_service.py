"""
Notification service for creating and managing notifications.
"""
from sqlalchemy.orm import Session
from app.db.models.notification import Notification
from app.services.email_service import send_email
import logging

logger = logging.getLogger(__name__)


class NotificationType:
    """Notification type constants."""
    REQUEST_SENT = "REQUEST_SENT"
    REQUEST_ACCEPTED = "REQUEST_ACCEPTED"
    REQUEST_REJECTED = "REQUEST_REJECTED"
    DELIVERABLES_SET = "DELIVERABLES_SET"
    CONTENT_SUBMITTED = "CONTENT_SUBMITTED"
    CONTENT_APPROVED = "CONTENT_APPROVED"
    COLLABORATION_COMPLETED = "COLLABORATION_COMPLETED"
    COLLABORATION_CANCELLED = "COLLABORATION_CANCELLED"


def create_notification(
    db: Session,
    user_id: int,
    message: str,
    notification_type: str,
    related_id: int = None
) -> Notification:
    """
    Create a new notification for a user.
    
    Args:
        db: Database session
        user_id: ID of the user to notify
        message: Notification message
        notification_type: Type of notification (use NotificationType constants)
        related_id: Optional related entity ID (collaboration_id, campaign_id, etc.)
    
    Returns:
        Created notification object
    """
    notification = Notification(
        user_id=user_id,
        message=message,
        type=notification_type,
        related_id=related_id,
        is_read=False
    )
    db.add(notification)
    db.commit()
    db.refresh(notification)
    
    logger.info(f"Created notification for user {user_id}: {notification_type}")
    return notification


def send_notification_email(
    to_email: str,
    subject: str,
    message: str,
    action_url: str = None
):
    """
    Send notification email to user.
    
    Args:
        to_email: Recipient email address
        subject: Email subject
        message: Main message content
        action_url: Optional URL for action button
    """
    # Plain text body
    plain_body = f"""
{subject}

{message}

{f'View Details: {action_url}' if action_url else ''}

---
This is an automated notification from InfluConnect. Please do not reply to this email.
"""
    
    # Build HTML email body
    html_body = f"""
    <html>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
            <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
                <div style="background: linear-gradient(135deg, #14b8a6 0%, #0891b2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
                    <h1 style="color: white; margin: 0; font-size: 28px;">InfluConnect</h1>
                </div>
                
                <div style="background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px;">
                    <h2 style="color: #14b8a6; margin-top: 0;">{subject}</h2>
                    <p style="font-size: 16px; margin: 20px 0;">{message}</p>
                    
                    {f'<div style="text-align: center; margin: 30px 0;"><a href="{action_url}" style="background: #14b8a6; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold;">View Details</a></div>' if action_url else ''}
                    
                    <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
                    
                    <p style="font-size: 14px; color: #6b7280; margin: 0;">
                        This is an automated notification from InfluConnect. Please do not reply to this email.
                    </p>
                </div>
            </div>
        </body>
    </html>
    """
    
    try:
        result = send_email(to_email, subject, plain_body, html_body)
        if result:
            logger.info(f"Notification email sent to {to_email}")
        else:
            logger.warning(f"Failed to send notification email to {to_email}")
    except Exception as e:
        logger.error(f"Failed to send notification email to {to_email}: {str(e)}")
        # Don't raise - email failure shouldn't break the notification system
