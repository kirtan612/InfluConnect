"""
InfluConnect FastAPI application entry point.
"""
import os
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import JSONResponse

from app.db.init_db import init_db
from app.routers import auth, influencer, brand, campaign, request, admin, upload, collaboration, notification

# Initialize database tables
init_db()

app = FastAPI(
    title="InfluConnect API",
    description="Trust-first influencer platform API",
    version="1.0.0"
)

# ============================================================================
# CORS Middleware
# ============================================================================
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:3000"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ============================================================================
# Static files — serve uploaded images from /media
# ============================================================================
MEDIA_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "media")
os.makedirs(MEDIA_DIR, exist_ok=True)
app.mount("/media", StaticFiles(directory=MEDIA_DIR), name="media")

# ============================================================================
# Routers
# ============================================================================
app.include_router(auth.router, prefix="/api")
app.include_router(influencer.router, prefix="/api")
app.include_router(brand.router, prefix="/api")
app.include_router(campaign.router, prefix="/api")
app.include_router(request.router, prefix="/api")
app.include_router(collaboration.router, prefix="/api")
app.include_router(notification.router, prefix="/api")
app.include_router(admin.router, prefix="/api")
app.include_router(upload.router, prefix="/api")

# ============================================================================
# Global exception handler
# ============================================================================
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    """Catch-all exception handler."""
    return JSONResponse(
        status_code=500,
        content={"detail": f"Internal server error: {str(exc)}"}
    )

# ============================================================================
# Root endpoint
# ============================================================================
@app.get("/")
async def root():
    return {
        "message": "InfluConnect API",
        "version": "1.0.0",
        "docs": "/docs"
    }

@app.get("/health")
async def health_check():
    return {"status": "healthy"}
