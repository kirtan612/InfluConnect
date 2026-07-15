"""
Migration script to create notifications table.
Run this after implementing the notification system.
"""
import sys
import os

# Add parent directory to path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from sqlalchemy import text
from app.db.session import engine
from app.core.config import settings

# Debug: Print config info
print(f"[DEBUG] SECRET_KEY loaded: {settings.SECRET_KEY[:10]}... (length: {len(settings.SECRET_KEY)})")
print(f"[DEBUG] ALGORITHM: {settings.ALGORITHM}")
print(f"[DEBUG] DATABASE_URL: {settings.DATABASE_URL[:40]}...")

def migrate_notifications():
    """Create notifications table and indexes."""
    print("=" * 60)
    print("NOTIFICATION SYSTEM MIGRATION")
    print("=" * 60)
    
    with engine.connect() as conn:
        # 1. Create notifications table
        print("\n1. Creating notifications table...")
        create_table_sql = """
        CREATE TABLE IF NOT EXISTS notifications (
            id SERIAL PRIMARY KEY,
            user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
            message VARCHAR(500) NOT NULL,
            type VARCHAR(50) NOT NULL,
            related_id INTEGER,
            is_read BOOLEAN NOT NULL DEFAULT FALSE,
            created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
        );
        """
        
        try:
            conn.execute(text(create_table_sql))
            conn.commit()
            print("✓ Notifications table created")
        except Exception as e:
            print(f"❌ Failed to create table: {e}")
            return
        
        # 2. Create indexes
        print("\n2. Creating indexes...")
        indexes = [
            "CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);",
            "CREATE INDEX IF NOT EXISTS idx_notifications_type ON notifications(type);",
            "CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON notifications(is_read);",
            "CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications(created_at DESC);"
        ]
        
        try:
            for idx_sql in indexes:
                conn.execute(text(idx_sql))
            conn.commit()
            print("✓ Indexes created")
        except Exception as e:
            print(f"❌ Failed to create indexes: {e}")
            return
        
        # 3. Verify table
        print("\n3. Verifying notifications table...")
        verify_sql = """
        SELECT column_name, data_type, is_nullable
        FROM information_schema.columns
        WHERE table_name = 'notifications'
        ORDER BY ordinal_position;
        """
        
        try:
            result = conn.execute(text(verify_sql))
            columns = result.fetchall()
            print("✓ Table structure:")
            for col in columns:
                print(f"  - {col[0]}: {col[1]} (nullable: {col[2]})")
        except Exception as e:
            print(f"❌ Verification failed: {e}")
            return
    
    print("\n" + "=" * 60)
    print("✅ NOTIFICATION MIGRATION COMPLETED SUCCESSFULLY")
    print("=" * 60)
    print("\nNext steps:")
    print("1. Restart your backend server")
    print("2. Test notification endpoints:")
    print("   - GET /api/notifications")
    print("   - GET /api/notifications/unread-count")
    print("   - PUT /api/notifications/{id}/read")
    print("3. Notifications will be created automatically on events")


if __name__ == "__main__":
    migrate_notifications()
