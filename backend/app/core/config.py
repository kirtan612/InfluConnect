"""
Configuration module for InfluConnect backend.
Handles environment variables and application settings.
"""
import os
from dotenv import load_dotenv
from pydantic_settings import BaseSettings

load_dotenv()


class Settings(BaseSettings):
    """Application settings loaded from environment variables."""
    
    # App
    APP_NAME: str = "InfluConnect"
    APP_VERSION: str = "1.0.0"
    DEBUG: bool = os.getenv("DEBUG", "False").lower() == "true"
    
    # Database
    DATABASE_URL: str = os.getenv(
        "DATABASE_URL",
        "postgresql://postgres:0613@localhost:5432/influconnect"
    )
    
    # JWT
    SECRET_KEY: str = os.getenv("SECRET_KEY", "your-secret-key-change-in-production")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7
    
    # CORS
    CORS_ORIGINS: list = [
        "http://localhost:3000",
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:3000"
    ]
    
    # Frontend URL (for email links)
    FRONTEND_URL: str = os.getenv("FRONTEND_URL", "http://localhost:5173")
    
    # Email (optional, for future use)
    SMTP_SERVER: str = os.getenv("SMTP_SERVER", "smtp.gmail.com")
    SMTP_PORT: int = int(os.getenv("SMTP_PORT", 587))
    SMTP_USER: str = os.getenv("SMTP_USER", "")
    SMTP_PASSWORD: str = os.getenv("SMTP_PASSWORD", "")
    
    class Config:
        case_sensitive = True


settings = Settings()

# Debug: Print SECRET_KEY to verify it's loaded (remove in production)
print(f"[DEBUG] SECRET_KEY loaded: {settings.SECRET_KEY[:10]}... (length: {len(settings.SECRET_KEY)})")
print(f"[DEBUG] ALGORITHM: {settings.ALGORITHM}")
print(f"[DEBUG] DATABASE_URL: {settings.DATABASE_URL[:30]}...")
