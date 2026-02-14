"""
Test script to verify JWT authentication is working correctly.
Run this to debug authentication issues.
"""
import requests
import json

BASE_URL = "http://127.0.0.1:8000/api"

def test_signup():
    """Test user signup"""
    print("\n=== Testing Signup ===")
    response = requests.post(
        f"{BASE_URL}/auth/signup",
        json={
            "email": "testinfluencer@test.com",
            "password": "testpass123",
            "role": "INFLUENCER"
        }
    )
    print(f"Status: {response.status_code}")
    if response.ok:
        data = response.json()
        print(f"User ID: {data['user_id']}")
        print(f"Email: {data['email']}")
        print(f"Role: {data['role']}")
        print(f"Access Token: {data['access_token'][:50]}...")
        return data['access_token']
    else:
        print(f"Error: {response.text}")
        return None

def test_login():
    """Test user login"""
    print("\n=== Testing Login ===")
    response = requests.post(
        f"{BASE_URL}/auth/login",
        data={
            "username": "testinfluencer@test.com",
            "password": "testpass123"
        }
    )
    print(f"Status: {response.status_code}")
    if response.ok:
        data = response.json()
        print(f"User ID: {data['user_id']}")
        print(f"Email: {data['email']}")
        print(f"Role: {data['role']}")
        print(f"Access Token: {data['access_token'][:50]}...")
        return data['access_token']
    else:
        print(f"Error: {response.text}")
        return None

def test_protected_endpoint(token):
    """Test accessing protected endpoint"""
    print("\n=== Testing Protected Endpoint ===")
    response = requests.get(
        f"{BASE_URL}/influencer/profile",
        headers={"Authorization": f"Bearer {token}"}
    )
    print(f"Status: {response.status_code}")
    if response.ok:
        data = response.json()
        print(f"Profile Data: {json.dumps(data, indent=2)}")
        return True
    else:
        print(f"Error: {response.text}")
        return False

def test_me_endpoint(token):
    """Test /auth/me endpoint"""
    print("\n=== Testing /auth/me Endpoint ===")
    response = requests.get(
        f"{BASE_URL}/auth/me",
        headers={"Authorization": f"Bearer {token}"}
    )
    print(f"Status: {response.status_code}")
    if response.ok:
        data = response.json()
        print(f"User Data: {json.dumps(data, indent=2)}")
        return True
    else:
        print(f"Error: {response.text}")
        return False

if __name__ == "__main__":
    print("=" * 60)
    print("JWT Authentication Test")
    print("=" * 60)
    
    # Try login first (user might already exist)
    token = test_login()
    
    # If login fails, try signup
    if not token:
        token = test_signup()
    
    if token:
        # Test /auth/me endpoint
        test_me_endpoint(token)
        
        # Test protected endpoint
        test_protected_endpoint(token)
    else:
        print("\n❌ Failed to get access token")
    
    print("\n" + "=" * 60)
