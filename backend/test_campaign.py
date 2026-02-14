"""
Test script to verify campaign creation and fetching.
"""
import requests
import json

BASE_URL = "http://127.0.0.1:8000/api"

def test_brand_signup_and_campaign():
    """Test complete flow: signup as brand, create campaign, fetch campaigns"""
    
    print("\n" + "="*60)
    print("CAMPAIGN CREATION TEST")
    print("="*60)
    
    # Step 1: Signup as brand
    print("\n[1/5] Signing up as brand...")
    signup_response = requests.post(
        f"{BASE_URL}/auth/signup",
        json={
            "email": "testbrand@test.com",
            "password": "testpass123",
            "role": "BRAND"
        }
    )
    
    if signup_response.status_code == 400:
        # User already exists, try login
        print("   User exists, logging in...")
        login_response = requests.post(
            f"{BASE_URL}/auth/login",
            data={
                "username": "testbrand@test.com",
                "password": "testpass123"
            }
        )
        if not login_response.ok:
            print(f"   ❌ Login failed: {login_response.text}")
            return
        token_data = login_response.json()
    elif signup_response.ok:
        print("   ✓ Signup successful")
        token_data = signup_response.json()
    else:
        print(f"   ❌ Signup failed: {signup_response.text}")
        return
    
    access_token = token_data['access_token']
    print(f"   ✓ Got access token: {access_token[:30]}...")
    
    # Step 2: Update brand profile
    print("\n[2/5] Updating brand profile...")
    profile_response = requests.put(
        f"{BASE_URL}/brand/profile",
        headers={"Authorization": f"Bearer {access_token}"},
        json={
            "company_name": "Test Company",
            "industry": "Technology",
            "location": "San Francisco, CA"
        }
    )
    
    if profile_response.ok:
        print("   ✓ Profile updated")
    else:
        print(f"   ⚠ Profile update failed: {profile_response.text}")
    
    # Step 3: Create campaign
    print("\n[3/5] Creating campaign...")
    campaign_data = {
        "name": "Test Campaign",
        "description": "This is a test campaign for influencer marketing",
        "category": "Technology",
        "platforms": ["Instagram", "YouTube"],
        "budget_min": 1000,
        "budget_max": 5000
    }
    
    print(f"   Campaign data: {json.dumps(campaign_data, indent=2)}")
    
    create_response = requests.post(
        f"{BASE_URL}/campaign",
        headers={
            "Authorization": f"Bearer {access_token}",
            "Content-Type": "application/json"
        },
        json=campaign_data
    )
    
    print(f"   Status code: {create_response.status_code}")
    
    if create_response.ok:
        campaign = create_response.json()
        print(f"   ✓ Campaign created successfully!")
        print(f"   Campaign ID: {campaign['id']}")
        print(f"   Campaign Name: {campaign['name']}")
        print(f"   Status: {campaign['status']}")
    else:
        print(f"   ❌ Campaign creation failed")
        print(f"   Error: {create_response.text}")
        return
    
    # Step 4: Fetch campaigns
    print("\n[4/5] Fetching campaigns...")
    fetch_response = requests.get(
        f"{BASE_URL}/campaign",
        headers={"Authorization": f"Bearer {access_token}"}
    )
    
    if fetch_response.ok:
        campaigns = fetch_response.json()
        print(f"   ✓ Fetched {len(campaigns)} campaign(s)")
        for camp in campaigns:
            print(f"      - {camp['name']} (ID: {camp['id']}, Status: {camp['status']})")
    else:
        print(f"   ❌ Failed to fetch campaigns: {fetch_response.text}")
    
    # Step 5: Test explore endpoint (for influencers)
    print("\n[5/5] Testing explore endpoint...")
    explore_response = requests.get(
        f"{BASE_URL}/campaign/explore",
        headers={"Authorization": f"Bearer {access_token}"}
    )
    
    if explore_response.ok:
        explore_campaigns = explore_response.json()
        print(f"   ✓ Explore returned {len(explore_campaigns)} campaign(s)")
    else:
        print(f"   ⚠ Explore failed: {explore_response.text}")
    
    print("\n" + "="*60)
    print("TEST COMPLETE")
    print("="*60 + "\n")

if __name__ == "__main__":
    test_brand_signup_and_campaign()
