"""
FastAPI dependencies for authentication and database access.
"""
from typing import Optional
from fastapi import Depends, HTTPException, status
from jose import JWTError
from sqlalchemy.orm import Session

from app.core.config import settings
from app.core.security import decode_token
from app.core.roles import UserRole
from app.db.session import get_db
from app.db.models.user import User


async def get_current_user(
    token: str = Depends(lambda: None),
    db: Session = Depends(get_db)
) -> User:
    """
    Get current authenticated user from JWT token.
    Extract token from Authorization header.
    """
    # This will be properly implemented in the router with OAuth2PasswordBearer
    raise HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Not authenticated"
    )


def get_current_user_dependency(token: str, db: Session) -> User:
    """
    Internal function to verify token and get user.
    Used by routers with proper OAuth2PasswordBearer.
    """
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    try:
        payload = decode_token(token)
        user_id: Optional[int] = payload.get("sub")
        if user_id is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    
    user = db.query(User).filter(User.id == int(user_id)).first()
    if user is None:
        raise credentials_exception
    
    if user.is_suspended:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="User account is suspended"
        )
    
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="User account is inactive"
        )
    
    return user


def get_admin_user(current_user: User = Depends(get_current_user)) -> User:
    """Dependency to ensure user is admin."""
    if current_user.role != UserRole.ADMIN:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin access required"
        )
    return current_user


def get_influencer_user(current_user: User = Depends(get_current_user)) -> User:
    """Dependency to ensure user is influencer."""
    if current_user.role != UserRole.INFLUENCER:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Influencer access required"
        )
    return current_user


def get_brand_user(current_user: User = Depends(get_current_user)) -> User:
    """Dependency to ensure user is brand."""
    if current_user.role != UserRole.BRAND:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Brand access required"
        )
    return current_user
