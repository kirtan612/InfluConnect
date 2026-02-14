"""
Test script to verify signup works correctly.
Run this to test if user registration is working.
"""
import requests
import json

API_BASE = "http://127.0.0.1:8000/api"

def test_signup():
    """Test user signup."""
    print("=" * 60)
    print("Testing User Signup")
    print("=" * 60)
    
    # Test data
    email = "testuser123@example.com"
    password = "testpass123"
    role = "INFLUENCER"
    
    print(f"\n1. Attempting signup...")
    print(f"   Email: {email}")
    print(f"   Role: {role}")
    
    try:
        response = requests.post(
            f"{API_BASE}/auth/signup",
            json={
                "email": email,
                "password": password,
                "role": role
            }
        )
        
        print(f"\n2. Response Status: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print(f"   ✓ Signup successful!")
            print(f"   User ID: {data.get('user_id')}")
            print(f"   Email: {data.get('email')}")
            print(f"   Role: {data.get('role')}")
            print(f"   Token: {data.get('access_token')[:50]}...")
            
            # Test getting profile
            token = data.get('access_token')
            print(f"\n3. Testing profile access...")
            
            profile_response = requests.get(
                f"{API_BASE}/influencer/profile",
                headers={"Authorization": f"Bearer {token}"}
            )
            
            print(f"   Profile Status: {profile_response.status_code}")
            
            if profile_response.status_code == 200:
                profile = profile_response.json()
                print(f"   ✓ Profile accessible!")
                print(f"   Display Name: {profile.get('display_name')}")
                print(f"   Trust Score: {profile.get('trust_score')}")
                print(f"   Verification: {profile.get('verification_status')}")
            else:
                print(f"   ✗ Profile access failed!")
                print(f"   Error: {profile_response.text}")
                
        else:
            print(f"   ✗ Signup failed!")
            print(f"   Error: {response.text}")
            
    except Exception as e:
        print(f"   ✗ Request failed: {str(e)}")
        print(f"   Make sure backend is running on {API_BASE}")

if __name__ == "__main__":
    test_signup()
