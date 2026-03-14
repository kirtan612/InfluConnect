"""
Authentication router - User signup, login, token refresh.
"""
from datetime import timedelta
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
import httpx
from google.oauth2 import id_token
from google.auth.transport import requests

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
    ForgotPasswordRequest, ResetPasswordRequest, GoogleAuthRequest
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
        data={"sub": str(db_user.id), "role": db_user.role.value, "profile_complete": False}
    )
    refresh_token = create_refresh_token(
        data={"sub": str(db_user.id), "role": db_user.role.value}
    )
    
    return TokenResponse(
        access_token=access_token,
        refresh_token=refresh_token,
        user_id=db_user.id,
        email=db_user.email,
        role=db_user.role,
        profile_complete=False  # New users need to complete profile
    )


@router.post("/login", response_model=TokenResponse)
def login(
    credentials: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
):
    """
    User login endpoint.
    Validates email and password.
    Returns access and refresh tokens with profile completion status.
    
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
    
    # Check profile completion
    profile_complete = False
    if user.role == UserRole.INFLUENCER and user.influencer_profile:
        # Profile is complete if they have display_name and at least one social link
        profile = user.influencer_profile
        profile_complete = bool(profile.display_name and profile.social_links)
    elif user.role == UserRole.BRAND and user.brand_profile:
        # Profile is complete if they have company_name that's not "Unnamed"
        profile = user.brand_profile
        profile_complete = bool(profile.company_name and profile.company_name != "Unnamed")
    elif user.role == UserRole.ADMIN:
        profile_complete = True  # Admins don't need profile setup
    
    # Generate tokens
    access_token = create_access_token(
        data={"sub": str(user.id), "role": user.role.value, "profile_complete": profile_complete}
    )
    refresh_token = create_refresh_token(
        data={"sub": str(user.id), "role": user.role.value}
    )
    
    return TokenResponse(
        access_token=access_token,
        refresh_token=refresh_token,
        user_id=user.id,
        email=user.email,
        role=user.role,
        profile_complete=profile_complete
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


@router.post("/google", response_model=TokenResponse)
async def google_auth(
    request: GoogleAuthRequest,
    db: Session = Depends(get_db)
):
    """
    Google OAuth authentication endpoint.
    Exchanges authorization code for user info and creates/logs in user.
    """
    print(f"\n{'='*60}")
    print(f"Google OAuth Debug Info")
    print(f"{'='*60}")
    print(f"Received code: {request.code[:20]}...")
    print(f"Role: {request.role}")
    print(f"Client ID configured: {settings.GOOGLE_CLIENT_ID[:20] if settings.GOOGLE_CLIENT_ID else 'NOT SET'}...")
    print(f"Client Secret configured: {'YES' if settings.GOOGLE_CLIENT_SECRET else 'NO'}")
    print(f"Frontend URL: {settings.FRONTEND_URL}")
    print(f"{'='*60}\n")
    
    # Validate configuration
    if not settings.GOOGLE_CLIENT_ID or not settings.GOOGLE_CLIENT_SECRET:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Google OAuth not configured. Please set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in .env"
        )
    
    try:
        # Exchange authorization code for access token
        async with httpx.AsyncClient() as client:
            token_url = "https://oauth2.googleapis.com/token"
            token_data = {
                "code": request.code,
                "client_id": settings.GOOGLE_CLIENT_ID,
                "client_secret": settings.GOOGLE_CLIENT_SECRET,
                "redirect_uri": f"{settings.FRONTEND_URL}/auth/google/callback",
                "grant_type": "authorization_code",
            }
            
            print(f"Requesting token from Google...")
            print(f"Redirect URI: {token_data['redirect_uri']}")
            
            token_response = await client.post(token_url, data=token_data)
            
            print(f"Token response status: {token_response.status_code}")
            
            if token_response.status_code != 200:
                error_detail = token_response.json() if token_response.text else "Unknown error"
                print(f"Token exchange failed: {error_detail}")
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"Failed to exchange authorization code: {error_detail}"
                )
            
            token_json = token_response.json()
            access_token_google = token_json.get("access_token")
            id_token_str = token_json.get("id_token")
            
            if not id_token_str:
                print("No ID token in response")
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="No ID token received from Google"
                )
            
            print(f"✓ Token exchange successful")
            
            # Get user info from Google using access token (more reliable than ID token verification)
            userinfo_url = "https://www.googleapis.com/oauth2/v2/userinfo"
            userinfo_response = await client.get(
                userinfo_url,
                headers={"Authorization": f"Bearer {access_token_google}"}
            )
            
            if userinfo_response.status_code != 200:
                print(f"Failed to get user info: {userinfo_response.text}")
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Failed to get user information from Google"
                )
            
            userinfo = userinfo_response.json()
            email = userinfo.get("email")
            google_id = userinfo.get("id")
            name = userinfo.get("name", "")
            
            print(f"✓ User info retrieved: {email}")
            
            if not email:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Email not provided by Google"
                )
            
            # Check if user exists
            user = db.query(User).filter(User.email == email).first()
            
            is_new_user = False
            if user:
                print(f"✓ Existing user found: {email}")
                # User exists, log them in
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
            else:
                print(f"✓ Creating new user: {email}")
                is_new_user = True
                # Create new user
                user = User(
                    email=email,
                    password_hash=hash_password(google_id),  # Use Google ID as password
                    role=request.role
                )
                db.add(user)
                db.flush()
                
                # Create role-specific profile
                if request.role == UserRole.INFLUENCER:
                    influencer_profile = InfluencerProfile(user_id=user.id)
                    db.add(influencer_profile)
                    print(f"✓ Created influencer profile")
                elif request.role == UserRole.BRAND:
                    brand_profile = BrandProfile(
                        user_id=user.id,
                        company_name=name if name else "Unnamed"
                    )
                    db.add(brand_profile)
                    print(f"✓ Created brand profile")
                
                db.commit()
                db.refresh(user)
            
            # Check profile completion for existing users
            profile_complete = False
            if not is_new_user:
                if user.role == UserRole.INFLUENCER and user.influencer_profile:
                    profile = user.influencer_profile
                    profile_complete = bool(profile.display_name and profile.social_links)
                elif user.role == UserRole.BRAND and user.brand_profile:
                    profile = user.brand_profile
                    profile_complete = bool(profile.company_name and profile.company_name != "Unnamed")
            
            # Generate tokens
            access_token = create_access_token(
                data={"sub": str(user.id), "role": user.role.value, "profile_complete": profile_complete}
            )
            refresh_token = create_refresh_token(
                data={"sub": str(user.id), "role": user.role.value}
            )
            
            print(f"✓ JWT tokens generated for user {user.id}")
            print(f"✓ Profile complete: {profile_complete}")
            print(f"{'='*60}\n")
            
            return TokenResponse(
                access_token=access_token,
                refresh_token=refresh_token,
                user_id=user.id,
                email=user.email,
                role=user.role,
                profile_complete=profile_complete
            )
            
    except HTTPException:
        raise
    except Exception as e:
        print(f"\n❌ Google auth error: {str(e)}")
        print(f"Error type: {type(e).__name__}")
        import traceback
        traceback.print_exc()
        print(f"{'='*60}\n")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Google authentication failed: {str(e)}"
        )
