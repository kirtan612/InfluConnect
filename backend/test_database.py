"""
Test database connection and verify columns exist.
"""
from sqlalchemy import text
from app.db.session import engine

def test_database():
    """Test database connection and schema."""
    print("=" * 60)
    print("Testing Database Connection")
    print("=" * 60)
    
    try:
        with engine.connect() as connection:
            print("\n✓ Database connection successful!")
            
            # Check influencer_profiles table
            print("\nChecking influencer_profiles table...")
            result = connection.execute(text("""
                SELECT column_name, data_type, is_nullable
                FROM information_schema.columns
                WHERE table_name = 'influencer_profiles'
                ORDER BY ordinal_position;
            """))
            
            columns = result.fetchall()
            print(f"\nFound {len(columns)} columns:")
            print("-" * 60)
            
            required_columns = ['profile_image_url', 'cover_image_url', 'social_links', 'platforms']
            found_columns = []
            
            for col in columns:
                status = "✓" if col[0] in required_columns else " "
                print(f"{status} {col[0]:<25} {col[1]:<15} Nullable: {col[2]}")
                if col[0] in required_columns:
                    found_columns.append(col[0])
            
            print("\n" + "=" * 60)
            print("Required Columns Check:")
            print("=" * 60)
            
            for req_col in required_columns:
                if req_col in found_columns:
                    print(f"✓ {req_col} - EXISTS")
                else:
                    print(f"✗ {req_col} - MISSING!")
            
            if len(found_columns) == len(required_columns):
                print("\n✓ All required columns exist!")
                print("✓ Database is ready for use!")
                return True
            else:
                print(f"\n✗ Missing {len(required_columns) - len(found_columns)} columns!")
                print("✗ Run: python migrate_database.py")
                return False
                
    except Exception as e:
        print(f"\n✗ Database error: {str(e)}")
        return False

if __name__ == "__main__":
    success = test_database()
    exit(0 if success else 1)
