"""
Database migration script to create reports table.
Run this script to create the reports table for the report system.
"""
import sys
from sqlalchemy import text
from app.db.session import engine

def migrate_reports():
    """Create reports table."""
    
    migrations = [
        # Create reports table
        """
        CREATE TABLE IF NOT EXISTS reports (
            id SERIAL PRIMARY KEY,
            reported_by INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
            reported_entity_type VARCHAR(50) NOT NULL,
            reported_entity_id INTEGER NOT NULL,
            reason VARCHAR(500) NOT NULL,
            description VARCHAR(2000),
            status VARCHAR(50) NOT NULL DEFAULT 'PENDING',
            admin_notes VARCHAR(1000),
            reviewed_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
            reviewed_at TIMESTAMP,
            created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
        );
        """,
        
        # Create indexes
        """
        CREATE INDEX IF NOT EXISTS idx_reports_reported_by 
        ON reports(reported_by);
        """,
        
        """
        CREATE INDEX IF NOT EXISTS idx_reports_entity 
        ON reports(reported_entity_type, reported_entity_id);
        """,
        
        """
        CREATE INDEX IF NOT EXISTS idx_reports_status 
        ON reports(status);
        """,
        
        """
        CREATE INDEX IF NOT EXISTS idx_reports_reviewed_by 
        ON reports(reviewed_by);
        """,
        
        """
        CREATE INDEX IF NOT EXISTS idx_reports_created_at 
        ON reports(created_at DESC);
        """
    ]
    
    print("Starting reports table migration...")
    print("=" * 70)
    
    try:
        with engine.connect() as connection:
            for i, migration in enumerate(migrations, 1):
                print(f"\nRunning migration {i}/{len(migrations)}...")
                migration_clean = migration.strip()
                
                # Show what we're doing
                if "CREATE TABLE" in migration_clean:
                    print("  Creating reports table")
                elif "CREATE INDEX" in migration_clean:
                    try:
                        index_name = migration_clean.split("CREATE INDEX IF NOT EXISTS ")[1].split(" ")[0]
                        print(f"  Creating index: {index_name}")
                    except:
                        print("  Creating index...")
                
                connection.execute(text(migration_clean))
                connection.commit()
                
                print(f"  ✓ Migration {i} completed successfully")
        
        print("\n" + "=" * 70)
        print("✓ All migrations completed successfully!")
        print("\nVerifying database schema...")
        
        # Verify table exists
        with engine.connect() as connection:
            result = connection.execute(text("""
                SELECT column_name, data_type, is_nullable, column_default
                FROM information_schema.columns
                WHERE table_name = 'reports'
                ORDER BY ordinal_position;
            """))
            
            print("\nReports table columns:")
            print("-" * 70)
            
            columns_found = []
            for row in result:
                column_name = row[0]
                data_type = row[1]
                nullable = row[2]
                default = row[3] or 'None'
                columns_found.append(column_name)
                print(f"  ✓ {column_name:<25} {data_type:<20} Nullable: {nullable:<3}")
            
            # Check if all required columns exist
            required_columns = [
                'id', 'reported_by', 'reported_entity_type', 'reported_entity_id',
                'reason', 'description', 'status', 'admin_notes',
                'reviewed_by', 'reviewed_at', 'created_at'
            ]
            
            missing = [col for col in required_columns if col not in columns_found]
            if missing:
                print(f"\n⚠ Warning: Missing columns: {', '.join(missing)}")
            else:
                print(f"\n✓ All {len(required_columns)} required columns exist!")
        
        # Check indexes
        with engine.connect() as connection:
            result = connection.execute(text("""
                SELECT indexname 
                FROM pg_indexes 
                WHERE tablename = 'reports' 
                AND indexname LIKE 'idx_reports_%'
                ORDER BY indexname;
            """))
            
            indexes = [row[0] for row in result]
            print(f"\nIndexes created: {len(indexes)}")
            for idx in indexes:
                print(f"  📊 {idx}")
        
        print("\n✓ Reports table migration completed successfully!")
        print("\n🚀 Your reports table is now ready for the report system!")
        print("\nNext steps:")
        print("  1. Restart your FastAPI server")
        print("  2. Test the report endpoints")
        print("  3. Check the admin dashboard for report moderation")
        
        return True
        
    except Exception as e:
        print(f"\n✗ Migration failed: {str(e)}")
        print("\nTroubleshooting:")
        print("  1. Make sure your database is running")
        print("  2. Check your .env file for correct database credentials")
        print("  3. Ensure you have the required permissions")
        print("\nIf the table already exists, this is normal and you can ignore this error.")
        return False

if __name__ == "__main__":
    success = migrate_reports()
    sys.exit(0 if success else 1)
