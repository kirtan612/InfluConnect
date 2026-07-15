"""
Database migration script to add automation and missing columns.
Run this script to update your database schema for the automation system.
"""
import sys
from sqlalchemy import text
from app.db.session import engine

def migrate_database():
    """Add automation and missing columns to influencer_profiles table."""
    
    migrations = [
        # Add automation fields
        """
        ALTER TABLE influencer_profiles 
        ADD COLUMN IF NOT EXISTS followers INTEGER DEFAULT 0;
        """,
        
        """
        ALTER TABLE influencer_profiles 
        ADD COLUMN IF NOT EXISTS engagement_rate FLOAT DEFAULT 0.0;
        """,
        
        """
        ALTER TABLE influencer_profiles 
        ADD COLUMN IF NOT EXISTS suspicious_flag BOOLEAN DEFAULT FALSE;
        """,
        
        """
        ALTER TABLE influencer_profiles 
        ADD COLUMN IF NOT EXISTS last_active TIMESTAMP NULL;
        """,
        
        # Add profile fields
        """
        ALTER TABLE influencer_profiles 
        ADD COLUMN IF NOT EXISTS profile_image_url VARCHAR(500);
        """,
        
        """
        ALTER TABLE influencer_profiles 
        ADD COLUMN IF NOT EXISTS cover_image_url VARCHAR(500);
        """,
        
        """
        ALTER TABLE influencer_profiles 
        ADD COLUMN IF NOT EXISTS social_links JSON;
        """,
        
        """
        ALTER TABLE influencer_profiles 
        ADD COLUMN IF NOT EXISTS platforms JSON DEFAULT '[]'::json;
        """,
        
        # Update existing records with default values
        """
        UPDATE influencer_profiles 
        SET 
            followers = COALESCE(followers, 0),
            engagement_rate = COALESCE(engagement_rate, 0.0),
            suspicious_flag = COALESCE(suspicious_flag, FALSE)
        WHERE followers IS NULL OR engagement_rate IS NULL OR suspicious_flag IS NULL;
        """,
        
        # Create indexes for automation performance
        """
        CREATE INDEX IF NOT EXISTS idx_influencer_profiles_trust_score 
        ON influencer_profiles(trust_score);
        """,
        
        """
        CREATE INDEX IF NOT EXISTS idx_influencer_profiles_suspicious_flag 
        ON influencer_profiles(suspicious_flag);
        """,
        
        """
        CREATE INDEX IF NOT EXISTS idx_influencer_profiles_last_active 
        ON influencer_profiles(last_active);
        """,
        
        """
        CREATE INDEX IF NOT EXISTS idx_influencer_profiles_profile_completion 
        ON influencer_profiles(profile_completion);
        """,
        
        """
        CREATE INDEX IF NOT EXISTS idx_influencer_profiles_followers 
        ON influencer_profiles(followers);
        """
    ]
    
    print("Starting database migration for automation system...")
    print("=" * 70)
    
    try:
        with engine.connect() as connection:
            for i, migration in enumerate(migrations, 1):
                print(f"\nRunning migration {i}/{len(migrations)}...")
                migration_clean = migration.strip()
                
                # Show what we're doing
                if "ALTER TABLE" in migration_clean:
                    if "ADD COLUMN" in migration_clean:
                        column_name = migration_clean.split("ADD COLUMN IF NOT EXISTS ")[1].split(" ")[0]
                        print(f"  Adding column: {column_name}")
                elif "UPDATE" in migration_clean:
                    print("  Updating existing records with default values")
                elif "CREATE INDEX" in migration_clean:
                    index_name = migration_clean.split("CREATE INDEX IF NOT EXISTS ")[1].split(" ")[0]
                    print(f"  Creating index: {index_name}")
                
                connection.execute(text(migration_clean))
                connection.commit()
                
                print(f"  ✓ Migration {i} completed successfully")
        
        print("\n" + "=" * 70)
        print("✓ All migrations completed successfully!")
        print("\nVerifying database schema...")
        
        # Verify columns exist
        with engine.connect() as connection:
            result = connection.execute(text("""
                SELECT column_name, data_type, is_nullable, column_default
                FROM information_schema.columns
                WHERE table_name = 'influencer_profiles'
                ORDER BY ordinal_position;
            """))
            
            print("\nCurrent influencer_profiles columns:")
            print("-" * 70)
            automation_columns = ['followers', 'engagement_rate', 'suspicious_flag', 'last_active']
            profile_columns = ['profile_image_url', 'cover_image_url', 'social_links', 'platforms']
            
            for row in result:
                column_name = row[0]
                data_type = row[1]
                nullable = row[2]
                default = row[3] or 'None'
                
                # Highlight automation columns
                if column_name in automation_columns:
                    print(f"  🤖 {column_name:<25} {data_type:<15} Nullable: {nullable:<3} Default: {default}")
                elif column_name in profile_columns:
                    print(f"  👤 {column_name:<25} {data_type:<15} Nullable: {nullable:<3} Default: {default}")
                else:
                    print(f"     {column_name:<25} {data_type:<15} Nullable: {nullable:<3} Default: {default}")
        
        # Check indexes
        with engine.connect() as connection:
            result = connection.execute(text("""
                SELECT indexname 
                FROM pg_indexes 
                WHERE tablename = 'influencer_profiles' 
                AND indexname LIKE 'idx_influencer_profiles_%'
                ORDER BY indexname;
            """))
            
            indexes = [row[0] for row in result]
            print(f"\nAutomation indexes created: {len(indexes)}")
            for idx in indexes:
                print(f"  📊 {idx}")
        
        print("\n✓ Database migration completed successfully!")
        print("\n🚀 Your database is now ready for the automation system!")
        print("\nNext steps:")
        print("  1. Start Redis: redis-server")
        print("  2. Start all services: python start_all.py")
        print("  3. Test automation: python test_automation.py")
        
        return True
        
    except Exception as e:
        print(f"\n✗ Migration failed: {str(e)}")
        print("\nTroubleshooting:")
        print("  1. Make sure your database is running")
        print("  2. Check your .env file for correct database credentials")
        print("  3. Ensure you have the required permissions")
        print("\nManual migration option:")
        print("  Run the SQL files manually:")
        print("    psql -U postgres -d influconnect -f add_automation_fields.sql")
        print("    psql -U postgres -d influconnect -f add_missing_columns.sql")
        return False

if __name__ == "__main__":
    success = migrate_database()
    sys.exit(0 if success else 1)
