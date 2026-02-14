"""
Database migration script to add missing columns.
Run this script to update your database schema.
"""
import sys
from sqlalchemy import text
from app.db.session import engine

def migrate_database():
    """Add missing columns to influencer_profiles table."""
    
    migrations = [
        # Add profile_image_url column
        """
        ALTER TABLE influencer_profiles 
        ADD COLUMN IF NOT EXISTS profile_image_url VARCHAR(500);
        """,
        
        # Add cover_image_url column
        """
        ALTER TABLE influencer_profiles 
        ADD COLUMN IF NOT EXISTS cover_image_url VARCHAR(500);
        """,
        
        # Add social_links column
        """
        ALTER TABLE influencer_profiles 
        ADD COLUMN IF NOT EXISTS social_links JSON;
        """,
        
        # Add platforms column
        """
        ALTER TABLE influencer_profiles 
        ADD COLUMN IF NOT EXISTS platforms JSON DEFAULT '[]'::json;
        """
    ]
    
    print("Starting database migration...")
    print("=" * 60)
    
    try:
        with engine.connect() as connection:
            for i, migration in enumerate(migrations, 1):
                print(f"\nRunning migration {i}/{len(migrations)}...")
                print(migration.strip())
                
                connection.execute(text(migration))
                connection.commit()
                
                print(f"✓ Migration {i} completed successfully")
        
        print("\n" + "=" * 60)
        print("✓ All migrations completed successfully!")
        print("\nVerifying columns...")
        
        # Verify columns exist
        with engine.connect() as connection:
            result = connection.execute(text("""
                SELECT column_name, data_type, is_nullable, column_default
                FROM information_schema.columns
                WHERE table_name = 'influencer_profiles'
                ORDER BY ordinal_position;
            """))
            
            print("\nCurrent influencer_profiles columns:")
            print("-" * 60)
            for row in result:
                print(f"  {row[0]:<25} {row[1]:<15} Nullable: {row[2]}")
        
        print("\n✓ Database migration completed successfully!")
        return True
        
    except Exception as e:
        print(f"\n✗ Migration failed: {str(e)}")
        print("\nPlease run the SQL script manually:")
        print("  psql -U postgres -d influconnect -f backend/add_missing_columns.sql")
        return False

if __name__ == "__main__":
    success = migrate_database()
    sys.exit(0 if success else 1)
