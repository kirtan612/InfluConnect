"""
Report Management API endpoints.
"""
from datetime import datetime
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.db.models.report import Report
from app.db.models.user import User
from app.core.dependencies import get_current_user
from app.core.roles import UserRole, ReportStatus
from app.schemas.report import (
    ReportCreate,
    ReportResponse,
    ReportReview,
    ReportReviewResponse
)
from app.services.notification_service import create_notification
from app.services.email_service import send_email

router = APIRouter(prefix="/reports", tags=["Reports"])


@router.post("/", response_model=ReportResponse, status_code=status.HTTP_201_CREATED)
def create_report(
    report_data: ReportCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Create a new report for violations.
    
    Supported entity types:
    - influencer: Report an influencer profile
    - brand: Report a brand profile
    - campaign: Report a campaign
    - agreement: Report agreement violation
    - dispute: Report dispute handling issue
    """
    # Validate entity type
    valid_types = ["influencer", "brand", "campaign", "agreement", "dispute"]
    if report_data.reported_entity_type not in valid_types:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid entity type. Must be one of: {', '.join(valid_types)}"
        )
    
    # Create report
    report = Report(
        reported_by=current_user.id,
        reported_entity_type=report_data.reported_entity_type,
        reported_entity_id=report_data.reported_entity_id,
        reason=report_data.reason,
        description=report_data.description,
        status=ReportStatus.PENDING
    )
    
    db.add(report)
    db.commit()
    db.refresh(report)
    
    # Create notification for admins
    try:
        # Get all admin users
        admins = db.query(User).filter(User.role == UserRole.ADMIN).all()
        for admin in admins:
            create_notification(
                db=db,
                user_id=admin.id,
                notification_type="report_filed",
                title="New Report Filed",
                message=f"A new report has been filed for {report_data.reported_entity_type} (ID: {report_data.reported_entity_id}). Reason: {report_data.reason[:50]}...",
                link=f"/admin/reports/{report.id}"
            )
            
            # Send email notification to admin
            send_email(
                to=admin.email,
                subject="New Report Requires Review - InfluConnect",
                body=f"A new report has been submitted for {report_data.reported_entity_type} (ID: {report_data.reported_entity_id}). Reason: {report_data.reason}",
                html_body=f"""
                <h2>New Report Filed</h2>
                <p>A new report has been submitted and requires your review.</p>
                <p><strong>Report ID:</strong> {report.id}</p>
                <p><strong>Entity Type:</strong> {report_data.reported_entity_type}</p>
                <p><strong>Entity ID:</strong> {report_data.reported_entity_id}</p>
                <p><strong>Reason:</strong> {report_data.reason}</p>
                <p><strong>Description:</strong> {report_data.description}</p>
                <p>Please log in to the admin dashboard to review this report.</p>
                """
            )
    except Exception as e:
        print(f"Failed to send notification/email: {e}")
    
    return report


@router.get("/", response_model=List[ReportResponse])
def get_reports(
    entity_type: str = Query(None, description="Filter by entity type"),
    status_filter: ReportStatus = Query(None, description="Filter by status"),
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=100),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Get reports.
    
    - Regular users: See only their own reports
    - Admins: See all reports with optional filters
    """
    query = db.query(Report)
    
    # Non-admins can only see their own reports
    if current_user.role != UserRole.ADMIN:
        query = query.filter(Report.reported_by == current_user.id)
    
    # Apply filters
    if entity_type:
        query = query.filter(Report.reported_entity_type == entity_type)
    
    if status_filter:
        query = query.filter(Report.status == status_filter)
    
    # Order by most recent first
    query = query.order_by(Report.created_at.desc())
    
    reports = query.offset(skip).limit(limit).all()
    return reports


@router.get("/{report_id}", response_model=ReportResponse)
def get_report(
    report_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get a specific report by ID."""
    report = db.query(Report).filter(Report.id == report_id).first()
    
    if not report:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Report not found"
        )
    
    # Non-admins can only view their own reports
    if current_user.role != UserRole.ADMIN and report.reported_by != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You can only view your own reports"
        )
    
    return report


@router.post("/{report_id}/review", response_model=ReportReviewResponse)
def review_report(
    report_id: int,
    review_data: ReportReview,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Admin reviews a report.
    
    Only admins can review reports.
    """
    # Verify user is admin
    if current_user.role != UserRole.ADMIN:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only admins can review reports"
        )
    
    # Get report
    report = db.query(Report).filter(Report.id == report_id).first()
    if not report:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Report not found"
        )
    
    # Update report
    report.status = review_data.status
    report.admin_notes = review_data.admin_notes
    report.reviewed_by = current_user.id
    report.reviewed_at = datetime.utcnow()
    
    db.commit()
    db.refresh(report)
    
    # Notify the reporter
    try:
        reporter = db.query(User).filter(User.id == report.reported_by).first()
        if reporter:
            create_notification(
                db=db,
                user_id=reporter.id,
                notification_type="report_reviewed",
                title="Report Reviewed",
                message=f"Your report (ID: {report.id}) has been reviewed. Status: {report.status}",
                link=f"/reports/{report.id}"
            )
            
            # Send email to reporter
            send_email(
                to=reporter.email,
                subject="Your Report Has Been Reviewed - InfluConnect",
                body=f"Your report (ID: {report.id}) has been reviewed. Status: {report.status}. Admin Notes: {review_data.admin_notes}",
                html_body=f"""
                <h2>Report Review Update</h2>
                <p>Your report has been reviewed by our moderation team.</p>
                <p><strong>Report ID:</strong> {report.id}</p>
                <p><strong>Status:</strong> {report.status}</p>
                <p><strong>Admin Notes:</strong> {review_data.admin_notes}</p>
                <p>Thank you for helping keep InfluConnect safe and trustworthy.</p>
                """
            )
    except Exception as e:
        print(f"Failed to send notification/email: {e}")
    
    return ReportReviewResponse(
        message="Report reviewed successfully",
        report_id=report.id,
        status=report.status,
        reviewed_by=report.reviewed_by,
        reviewed_at=report.reviewed_at
    )


@router.get("/stats/summary")
def get_report_stats(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Get report statistics.
    
    Only admins can view statistics.
    """
    if current_user.role != UserRole.ADMIN:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only admins can view report statistics"
        )
    
    # Count reports by status
    pending_count = db.query(Report).filter(Report.status == ReportStatus.PENDING).count()
    reviewed_count = db.query(Report).filter(Report.status == ReportStatus.REVIEWED).count()
    resolved_count = db.query(Report).filter(Report.status == ReportStatus.RESOLVED).count()
    
    # Count by entity type
    from sqlalchemy import func
    entity_counts = db.query(
        Report.reported_entity_type,
        func.count(Report.id).label('count')
    ).group_by(Report.reported_entity_type).all()
    
    return {
        "total_reports": pending_count + reviewed_count + resolved_count,
        "by_status": {
            "pending": pending_count,
            "reviewed": reviewed_count,
            "resolved": resolved_count
        },
        "by_entity_type": {entity_type: count for entity_type, count in entity_counts}
    }
