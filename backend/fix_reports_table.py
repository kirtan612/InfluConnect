"""
Fix script to drop and recreate the reports table correctly.
"""
import sys
from sqlalchemy import text
from app.db.session import engine

def fix_reports_table():
    """Drop and recreate reports table with correct schema."""
    
    print("Fixing reports table...")
    print("=" * 70)
    
    try:
        with engine.connect() as connection:
            # Drop the table if it exists
            print("\n1. Dropping existing reports table...")
            connection.execute(text("DROP TABLE IF EXISTS reports CASCADE;"))
            connection.commit()
            print("  ✓ Table dropped")
            
            # Create the table with correct schema
            print("\n2. Creating reports table with correct schema...")
            connection.execute(text("""
                CREATE TABLE reports (
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
            """))
            connection.commit()
            print("  ✓ Table created")
            
            # Create indexes
            print("\n3. Creating indexes...")
            indexes = [
                ("idx_reports_reported_by", "reported_by"),
                ("idx_reports_entity", "reported_entity_type, reported_entity_id"),
                ("idx_reports_status", "status"),
                ("idx_reports_reviewed_by", "reviewed_by"),
                ("idx_reports_created_at", "created_at DESC")
            ]
            
            for idx_name, idx_cols in indexes:
                connection.execute(text(f"""
                    CREATE INDEX IF NOT EXISTS {idx_name} ON reports({idx_cols});
                """))
                connection.commit()
                print(f"  ✓ Created index: {idx_name}")
            
            # Verify the table
            print("\n4. Verifying table structure...")
            result = connection.execute(text("""
                SELECT column_name, data_type, is_nullable
                FROM information_schema.columns
                WHERE table_name = 'reports'
                ORDER BY ordinal_position;
            """))
            
            columns = []
            for row in result:
                columns.append(row[0])
                print(f"  ✓ {row[0]:<25} {row[1]:<20} Nullable: {row[2]}")
            
            # Check all required columns exist
            required = [
                'id', 'reported_by', 'reported_entity_type', 'reported_entity_id',
                'reason', 'description', 'status', 'admin_notes',
                'reviewed_by', 'reviewed_at', 'created_at'
            ]
            
            missing = [col for col in required if col not in columns]
            if missing:
                print(f"\n✗ Missing columns: {', '.join(missing)}")
                return False
            
            print(f"\n✓ All {len(required)} required columns exist!")
            print("\n" + "=" * 70)
            print("✓ Reports table fixed successfully!")
            print("\n🚀 You can now use the report system!")
            return True
            
    except Exception as e:
        print(f"\n✗ Fix failed: {str(e)}")
        import traceback
        traceback.print_exc()
        return False

if __name__ == "__main__":
    success = fix_reports_table()
    sys.exit(0 if success else 1)
