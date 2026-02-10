"""
Data validation utilities.
"""
from typing import Optional, List
from fastapi import HTTPException, status
from app.core.roles import AllowedPlatforms


def validate_platforms(platforms: List[str]) -> List[str]:
    """
    Validate platform list.
    Only INSTAGRAM, YOUTUBE, LINKEDIN are allowed.
    TikTok is explicitly rejected.
    """
    allowed = {p.value for p in AllowedPlatforms}
    
    for platform in platforms:
        if platform.lower() == "tiktok":
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="TikTok is not an allowed platform"
            )
        
        if platform not in allowed:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Invalid platform: {platform}. Allowed platforms: {', '.join(allowed)}"
            )
    
    return platforms


def validate_budget(budget_min: Optional[float], budget_max: Optional[float]) -> bool:
    """Validate budget range."""
    if budget_min is not None and budget_max is not None:
        if budget_min > budget_max:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="budget_min cannot be greater than budget_max"
            )
    
    if budget_min is not None and budget_min < 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="budget_min cannot be negative"
        )
    
    if budget_max is not None and budget_max < 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="budget_max cannot be negative"
        )
    
    return True
