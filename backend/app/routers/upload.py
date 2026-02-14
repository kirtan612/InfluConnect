"""
File upload router.
Handles image uploads to local /media folder.
"""
import os
import uuid
from datetime import datetime
from fastapi import APIRouter, UploadFile, File, HTTPException, Depends
from app.core.dependencies import get_current_user
from app.db.models.user import User

router = APIRouter(prefix="/upload", tags=["Upload"])

# Media directory relative to backend root
MEDIA_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))), "media")
os.makedirs(MEDIA_DIR, exist_ok=True)

ALLOWED_EXTENSIONS = {".jpg", ".jpeg", ".png", ".gif", ".webp", ".svg"}
MAX_FILE_SIZE = 5 * 1024 * 1024  # 5 MB


@router.post("/image")
async def upload_image(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user)
):
    """
    Upload an image file. Returns the URL to access it.
    """
    if not file.filename:
        raise HTTPException(status_code=400, detail="No file provided")
    
    # Validate extension
    _, ext = os.path.splitext(file.filename)
    ext = ext.lower()
    if ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid file type '{ext}'. Allowed: {ALLOWED_EXTENSIONS}"
        )
    
    # Read and validate size
    content = await file.read()
    if len(content) > MAX_FILE_SIZE:
        raise HTTPException(status_code=400, detail="File too large. Maximum 5MB.")
    
    # Generate unique filename
    unique_name = f"{uuid.uuid4().hex}_{int(datetime.utcnow().timestamp())}{ext}"
    filepath = os.path.join(MEDIA_DIR, unique_name)
    
    # Save file
    with open(filepath, "wb") as f:
        f.write(content)
    
    # Return URL (relative to API base)
    url = f"/media/{unique_name}"
    return {"url": url, "filename": unique_name}
