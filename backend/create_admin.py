"""
Admin creation script
Run this to create admin users in the database.
Usage: python create_admin.py
"""
import sys
from sqlalchemy.orm import Session

from app.db.session import SessionLocal
import app.db.models.user
import app.db.models.influencer
import app.db.models.brand
import app.db.models.campaign
import app.db.models.request
import app.db.models.verification
import app.db.models.report

from app.db.models.user import User
from app.core.security import hash_password
from app.core.roles import UserRole


def create_admin(email: str, password: str) -> bool:
    """Create an admin user."""
    db = SessionLocal()
    
    try:
        # Check if admin already exists
        existing = db.query(User).filter(User.email == email).first()
        if existing:
            print(f"✗ Admin with email {email} already exists")
            return False
        
        # Create admin user
        admin_user = User(
            email=email,
            password_hash=hash_password(password),
            role=UserRole.ADMIN,
            is_active=True,
            is_suspended=False
        )
        
        db.add(admin_user)
        db.commit()
        
        print(f"✓ Admin created successfully")
        print(f"  Email: {email}")
        print(f"  ID: {admin_user.id}")
        
        return True
    
    except ValueError as ve:
        db.rollback()
        # More user-friendly message for bcrypt-related password issues
        print(f"✗ Error creating admin: {str(ve)}")
        return False
    except Exception as e:
        db.rollback()
        print(f"✗ Error creating admin: {str(e)}")
        return False
    
    finally:
        db.close()


def main():
    """Main function."""
    print("=" * 60)
    print("InfluConnect Admin Creation Script")
    print("=" * 60)
    
    if len(sys.argv) < 3:
        # Interactive mode
        print("\n[Interactive Mode]")
        email = input("Enter admin email: ").strip()
        password = input("Enter admin password: ").strip()
        
        if not email or not password:
            print("✗ Email and password are required")
            return
        
        if len(password) < 8:
            print("✗ Password must be at least 8 characters")
            return
        
        create_admin(email, password)
    else:
        # Command line mode
        email = sys.argv[1]
        password = sys.argv[2]
        
        if len(password) < 8:
            print("✗ Password must be at least 8 characters")
            return
        
        create_admin(email, password)


if __name__ == "__main__":
    main()
