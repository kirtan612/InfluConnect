"""
Collaboration utility functions.
"""
from app.core.roles import CollaborationStatus


def calculate_progress(status: CollaborationStatus) -> int:
    """
    Calculate progress percentage based on collaboration status.
    
    Args:
        status: Current collaboration status
    
    Returns:
        Progress percentage (0-100)
    """
    progress_mapping = {
        CollaborationStatus.ACTIVE: 20,
        CollaborationStatus.DELIVERABLES_SET: 40,
        CollaborationStatus.CONTENT_SUBMITTED: 60,
        CollaborationStatus.CONTENT_APPROVED: 80,
        CollaborationStatus.COMPLETED: 100,
        CollaborationStatus.CANCELLED: 0
    }
    
    return progress_mapping.get(status, 0)


def validate_status_transition(current_status: CollaborationStatus, new_status: CollaborationStatus) -> bool:
    """
    Validate if status transition is allowed.
    
    Args:
        current_status: Current collaboration status
        new_status: Desired new status
    
    Returns:
        True if transition is valid, False otherwise
    """
    # Define valid transitions
    valid_transitions = {
        CollaborationStatus.ACTIVE: [
            CollaborationStatus.DELIVERABLES_SET,
            CollaborationStatus.CANCELLED
        ],
        CollaborationStatus.DELIVERABLES_SET: [
            CollaborationStatus.CONTENT_SUBMITTED,
            CollaborationStatus.CANCELLED
        ],
        CollaborationStatus.CONTENT_SUBMITTED: [
            CollaborationStatus.CONTENT_APPROVED,
            CollaborationStatus.DELIVERABLES_SET,  # Allow going back if content rejected
            CollaborationStatus.CANCELLED
        ],
        CollaborationStatus.CONTENT_APPROVED: [
            CollaborationStatus.COMPLETED,
            CollaborationStatus.CANCELLED
        ],
        CollaborationStatus.COMPLETED: [],  # Cannot transition from completed
        CollaborationStatus.CANCELLED: []   # Cannot transition from cancelled
    }
    
    allowed = valid_transitions.get(current_status, [])
    return new_status in allowed
