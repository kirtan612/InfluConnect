"""
Simple test without external dependencies.
Just checks if the database columns exist.
"""
from sqlalchemy import text, inspect
from app.db.session import engine
from app.db.models.influencer import InfluencerProfile

def test_columns():
    """Check if all required columns exist."""
    print("=" * 60)
    print("Checking Database Columns")
    print("=" * 60)
    
    try:
        # Get column names from the model
        inspector = inspect(engine)
        columns = inspector.get_columns('influencer_profiles')
        
        column_names = [col['name'] for col in columns]
        
        print(f"\nFound {len(column_names)} columns in influencer_profiles:")
        print("-" * 60)
        
        required = ['profile_image_url', 'cover_image_url', 'social_links', 'platforms']
        
        for col_name in column_names:
            status = "✓" if col_name in required else " "
            print(f"{status} {col_name}")
        
        print("\n" + "=" * 60)
        print("Required Columns Check:")
        print("=" * 60)
        
        all_found = True
        for req in required:
            if req in column_names:
                print(f"✓ {req} - EXISTS")
            else:
                print(f"✗ {req} - MISSING!")
                all_found = False
        
        if all_found:
            print("\n✓ All required columns exist!")
            print("✓ Database is ready!")
            
            # Now test if we can create a profile
            print("\n" + "=" * 60)
            print("Testing Profile Creation")
            print("=" * 60)
            
            with engine.connect() as conn:
                # Try to insert a test record
                result = conn.execute(text("""
                    INSERT INTO influencer_profiles 
                    (user_id, display_name, bio, category, social_links, platforms, trust_score, verification_status, profile_completion, created_at, updated_at)
                    VALUES 
                    (99999, 'Test User', 'Test bio', 'Technology', '{"instagram": "test"}', '["Tech"]', 0.0, 'UNVERIFIED', 0.0, NOW(), NOW())
                    RETURNING id;
                """))
                
                test_id = result.fetchone()[0]
                print(f"✓ Test profile created with ID: {test_id}")
                
                # Clean up
                conn.execute(text(f"DELETE FROM influencer_profiles WHERE id = {test_id}"))
                conn.commit()
                print("✓ Test profile deleted")
                
            print("\n✓ Profile creation works!")
            print("✓ Signup should work correctly!")
            return True
        else:
            print("\n✗ Missing required columns!")
            print("✗ Run: python migrate_database.py")
            return False
            
    except Exception as e:
        print(f"\n✗ Error: {str(e)}")
        print("\nThis might mean:")
        print("1. Database is not running")
        print("2. Connection settings are wrong")
        print("3. Table doesn't exist")
        return False

if __name__ == "__main__":
    success = test_columns()
    
    if success:
        print("\n" + "=" * 60)
        print("NEXT STEPS:")
        print("=" * 60)
        print("1. Make sure backend is running: python app/main.py")
        print("2. Clear browser: localStorage.clear()")
        print("3. Register new user at: http://localhost:5173/signup")
        print("4. Fill ALL fields and submit")
        print("5. Should redirect to dashboard with your data!")
    
    exit(0 if success else 1)
