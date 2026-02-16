"""
Role definitions and constants for InfluConnect.
"""
from enum import Enum


class UserRole(str, Enum):
    """User roles in the system."""
    INFLUENCER = "INFLUENCER"
    BRAND = "BRAND"
    ADMIN = "ADMIN"


class VerificationStatus(str, Enum):
    """Verification statuses for influencer profiles."""
    UNVERIFIED = "unverified"
    PENDING = "pending"
    VERIFIED = "verified"
    REJECTED = "rejected"


class CollaborationRequestStatus(str, Enum):
    """Status of collaboration requests."""
    PENDING = "pending"
    ACCEPTED = "accepted"
    REJECTED = "rejected"


class CollaborationStatus(str, Enum):
    """Status of active collaborations (after request accepted)."""
    ACTIVE = "ACTIVE"
    DELIVERABLES_SET = "DELIVERABLES_SET"
    CONTENT_SUBMITTED = "CONTENT_SUBMITTED"
    CONTENT_APPROVED = "CONTENT_APPROVED"
    COMPLETED = "COMPLETED"
    CANCELLED = "CANCELLED"


class PaymentStatus(str, Enum):
    """Payment status for collaborations."""
    PENDING = "PENDING"
    RELEASED = "RELEASED"
    CANCELLED = "CANCELLED"


class CampaignStatus(str, Enum):
    """Campaign status."""
    DRAFT = "draft"
    ACTIVE = "active"
    DISABLED = "disabled"


class BrandStatus(str, Enum):
    """Brand profile status."""
    ACTIVE = "active"
    FLAGGED = "flagged"


class AllowedPlatforms(str, Enum):
    """Allowed social media platforms."""
    INSTAGRAM = "Instagram"
    YOUTUBE = "YouTube"
    LINKEDIN = "LinkedIn"


class ReportStatus(str, Enum):
    """Report status."""
    PENDING = "pending"
    REVIEWED = "reviewed"
    RESOLVED = "resolved"


# Trust score tiers
TRUST_SCORE_MIN = 0
TRUST_SCORE_MAX = 100

# Trust score ranges
TRUST_LEVEL_UNVERIFIED = (0, 20)      # Unverified profiles
TRUST_LEVEL_LOW = (20, 50)             # Low trust
TRUST_LEVEL_MEDIUM = (50, 75)          # Medium trust
TRUST_LEVEL_HIGH = (75, 100)           # High trust

# Minimum trust score for collaboration requests
MIN_TRUST_FOR_COLLABORATION = 50

# Profile completion thresholds (percentage)
PROFILE_COMPLETION_HIGH_THRESHOLD = 80
PROFILE_COMPLETION_MEDIUM_THRESHOLD = 50
