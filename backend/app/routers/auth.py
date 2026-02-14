"""
Authentication router - User signup, login, token refresh.
"""
from datetime import timedelta
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from app.core.config import settings
from app.core.security import (
    hash_password, verify_password,
    create_access_token, create_refresh_token, decode_token
)
from app.core.roles import UserRole
from app.db.session import get_db
from app.db.models.user import User
from app.db.models.influencer import InfluencerProfile
from app.db.models.brand import BrandProfile
from app.schemas.user import (
    UserCreate, UserLogin, TokenResponse, RefreshTokenRequest,
    ForgotPasswordRequest, ResetPasswordRequest
)
from app.services.trust_engine import TrustEngine
from app.services.email_service import send_password_reset_email

router = APIRouter(prefix="/auth", tags=["auth"])

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")


@router.post("/signup", response_model=TokenResponse)
def signup(user_data: UserCreate, db: Session = Depends(get_db)):
    """
    User signup endpoint.
    Creates new user account (INFLUENCER or BRAND only).
    Returns access and refresh tokens.
    """
    # Prevent admin signup
    if user_data.role == UserRole.ADMIN:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Admin accounts cannot be created via signup"
        )
    
    # Check if email already exists
    existing_user = db.query(User).filter(User.email == user_data.email).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Create user
    hashed_password = hash_password(user_data.password)
    db_user = User(
        email=user_data.email,
        password_hash=hashed_password,
        role=user_data.role
    )
    db.add(db_user)
    db.flush()  # Flush to get user ID
    
    # Create role-specific profile
    if user_data.role == UserRole.INFLUENCER:
        influencer_profile = InfluencerProfile(user_id=db_user.id)
        db.add(influencer_profile)
    elif user_data.role == UserRole.BRAND:
        brand_profile = BrandProfile(
            user_id=db_user.id,
            company_name="Unnamed"  # Required field, will be updated by user
        )
        db.add(brand_profile)
    
    db.commit()
    db.refresh(db_user)
    
    # Generate tokens
    access_token = create_access_token(
        data={"sub": str(db_user.id), "role": db_user.role.value}
    )
    refresh_token = create_refresh_token(
        data={"sub": str(db_user.id), "role": db_user.role.value}
    )
    
    return TokenResponse(
        access_token=access_token,
        refresh_token=refresh_token,
        user_id=db_user.id,
        email=db_user.email,
        role=db_user.role
    )


@router.post("/login", response_model=TokenResponse)
def login(
    credentials: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
):
    """
    User login endpoint.
    Validates email and password.
    Returns access and refresh tokens.
    
    Note: Using OAuth2PasswordRequestForm which expects:
    - username (maps to email in our case)
    - password
    """
    user = db.query(User).filter(User.email == credentials.username).first()
    
    if not user or not verify_password(credentials.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
            headers={"WWW-Authenticate": "Bearer"}
        )
    
    # Check if user is suspended
    if user.is_suspended:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="User account is suspended"
        )
    
    # Check if user is active
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="User account is inactive"
        )
    
    # Generate tokens
    access_token = create_access_token(
        data={"sub": str(user.id), "role": user.role.value}
    )
    refresh_token = create_refresh_token(
        data={"sub": str(user.id), "role": user.role.value}
    )
    
    return TokenResponse(
        access_token=access_token,
        refresh_token=refresh_token,
        user_id=user.id,
        email=user.email,
        role=user.role
    )


@router.post("/admin/login", response_model=TokenResponse)
def admin_login(
    credentials: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
):
    """
    Admin login endpoint.
    Only users with ADMIN role can login here.
    """
    user = db.query(User).filter(User.email == credentials.username).first()
    
    if not user or not verify_password(credentials.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
            headers={"WWW-Authenticate": "Bearer"}
        )
    
    # Check if user is admin
    if user.role != UserRole.ADMIN:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin access required"
        )
    
    # Check if admin is active
    if user.is_suspended:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin account is suspended"
        )
    
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin account is inactive"
        )
    
    # Generate tokens
    access_token = create_access_token(
        data={"sub": str(user.id), "role": user.role.value}
    )
    refresh_token = create_refresh_token(
        data={"sub": str(user.id), "role": user.role.value}
    )
    
    return TokenResponse(
        access_token=access_token,
        refresh_token=refresh_token,
        user_id=user.id,
        email=user.email,
        role=user.role
    )


@router.post("/refresh", response_model=TokenResponse)
def refresh_token(
    req: RefreshTokenRequest,
    db: Session = Depends(get_db)
):
    """
    Refresh access token using refresh token.
    """
    try:
        payload = decode_token(req.refresh_token)
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid refresh token",
            headers={"WWW-Authenticate": "Bearer"}
        )
    
    # Verify token type
    if payload.get("type") != "refresh":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not a refresh token"
        )
    
    user_id = payload.get("sub")
    user = db.query(User).filter(User.id == int(user_id)).first()
    
    if not user or not user.is_active or user.is_suspended:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found or inactive"
        )
    
    # Generate new access token
    new_access_token = create_access_token(
        data={"sub": str(user.id), "role": user.role.value}
    )
    new_refresh_token = create_refresh_token(
        data={"sub": str(user.id), "role": user.role.value}
    )
    
    return TokenResponse(
        access_token=new_access_token,
        refresh_token=new_refresh_token,
        user_id=user.id,
        email=user.email,
        role=user.role
    )


def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db)
) -> User:
    """
    Dependency to get current authenticated user.
    Used by all protected routes.
    """
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"}
    )
    
    try:
        payload = decode_token(token)
        user_id = payload.get("sub")
        if user_id is None:
            raise credentials_exception
    except Exception:
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


@router.get("/me", response_model=TokenResponse)
def get_current_auth(current_user: User = Depends(get_current_user)):
    """
    Get current authenticated user info.
    Useful for verifying the current session and user details.
    """
    return TokenResponse(
        access_token="",  # Not returning token, just user info
        refresh_token="",
        user_id=current_user.id,
        email=current_user.email,
        role=current_user.role
    )


@router.post("/forgot-password")
def forgot_password(
    request: ForgotPasswordRequest,
    db: Session = Depends(get_db)
):
    """
    Request password reset.
    Generates a reset token and sends it via email (or logs it in development).
    
    Note: Always returns success even if email doesn't exist (security best practice).
    """
    user = db.query(User).filter(User.email == request.email).first()
    
    if user:
        # Generate reset token (valid for 1 hour)
        reset_token = create_access_token(
            data={"sub": str(user.id), "type": "password_reset"},
            expires_delta=timedelta(hours=1)
        )
        
        # Send password reset email
        email_sent = send_password_reset_email(
            to=user.email,
            reset_token=reset_token,
            frontend_url=settings.FRONTEND_URL
        )
        
        if email_sent:
            print(f"✓ Password reset email sent to {user.email}")
        else:
            print(f"⚠️  Failed to send email to {user.email}")
            # Still log the token for development
            print(f"\n{'='*60}")
            print(f"PASSWORD RESET TOKEN for {user.email}")
            print(f"{'='*60}")
            print(f"Token: {reset_token}")
            print(f"Reset URL: http://localhost:5173/reset-password?token={reset_token}")
            print(f"{'='*60}\n")
    
    # Always return success (don't reveal if email exists)
    return {
        "message": "If an account exists for this email, you will receive a password reset link shortly."
    }


@router.post("/reset-password")
def reset_password(
    request: ResetPasswordRequest,
    db: Session = Depends(get_db)
):
    """
    Reset password using reset token.
    """
    try:
        payload = decode_token(request.token)
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid or expired reset token"
        )
    
    # Verify token type
    if payload.get("type") != "password_reset":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid token type"
        )
    
    user_id = payload.get("sub")
    user = db.query(User).filter(User.id == int(user_id)).first()
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    # Update password
    user.password_hash = hash_password(request.new_password)
    db.commit()
    
    print(f"\n✓ Password reset successful for {user.email}\n")
    
    return {
        "message": "Password reset successful. You can now login with your new password."
    }
