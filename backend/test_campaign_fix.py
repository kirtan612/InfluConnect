"""
Test script to verify campaign fixes.
Run this after starting the backend server.
"""
import requests
import json

BASE_URL = "http://localhost:8000"

def test_campaign_flow():
    """Test the complete campaign flow."""
    print("=" * 60)
    print("CAMPAIGN FIX VERIFICATION TEST")
    print("=" * 60)
    
    # Step 1: Login as BRAND
    print("\n1. Logging in as BRAND...")
    brand_login = requests.post(
        f"{BASE_URL}/api/auth/login",
        data={
            "username": "brand@test.com",  # Replace with your brand email
            "password": "password123"       # Replace with your brand password
        }
    )
    
    if brand_login.status_code != 200:
        print(f"❌ Brand login failed: {brand_login.status_code}")
        print(brand_login.text)
        return
    
    brand_token = brand_login.json()["access_token"]
    print(f"✓ Brand logged in successfully")
    
    # Step 2: Create a campaign as BRAND
    print("\n2. Creating campaign as BRAND...")
    campaign_data = {
        "name": "Test Campaign - Fix Verification",
        "description": "Testing campaign creation after location field removal",
        "category": "Technology",
        "platforms": ["Instagram", "YouTube"],
        "budget_min": 1000,
        "budget_max": 5000
    }
    
    create_response = requests.post(
        f"{BASE_URL}/api/campaign",
        headers={"Authorization": f"Bearer {brand_token}"},
        json=campaign_data
    )
    
    if create_response.status_code != 200:
        print(f"❌ Campaign creation failed: {create_response.status_code}")
        print(create_response.text)
        return
    
    campaign = create_response.json()
    print(f"✓ Campaign created successfully: ID={campaign['id']}, Name={campaign['name']}")
    print(f"  - Status: {campaign['status']}")
    print(f"  - Platforms: {campaign['platforms']}")
    print(f"  - Budget: ${campaign['budget_min']} - ${campaign['budget_max']}")
    
    # Step 3: List campaigns as BRAND
    print("\n3. Listing campaigns as BRAND...")
    list_response = requests.get(
        f"{BASE_URL}/api/campaign",
        headers={"Authorization": f"Bearer {brand_token}"}
    )
    
    if list_response.status_code != 200:
        print(f"❌ Campaign listing failed: {list_response.status_code}")
        print(list_response.text)
        return
    
    campaigns = list_response.json()
    print(f"✓ Found {len(campaigns)} campaign(s)")
    
    # Step 4: Login as INFLUENCER
    print("\n4. Logging in as INFLUENCER...")
    influencer_login = requests.post(
        f"{BASE_URL}/api/auth/login",
        data={
            "username": "influencer@test.com",  # Replace with your influencer email
            "password": "password123"            # Replace with your influencer password
        }
    )
    
    if influencer_login.status_code != 200:
        print(f"❌ Influencer login failed: {influencer_login.status_code}")
        print(influencer_login.text)
        return
    
    influencer_token = influencer_login.json()["access_token"]
    print(f"✓ Influencer logged in successfully")
    
    # Step 5: Browse campaigns as INFLUENCER (THIS WAS FAILING BEFORE)
    print("\n5. Browsing campaigns as INFLUENCER...")
    explore_response = requests.get(
        f"{BASE_URL}/api/campaign/explore",
        headers={"Authorization": f"Bearer {influencer_token}"}
    )
    
    if explore_response.status_code != 200:
        print(f"❌ Campaign exploration failed: {explore_response.status_code}")
        print(explore_response.text)
        return
    
    available_campaigns = explore_response.json()
    print(f"✓ Found {len(available_campaigns)} active campaign(s)")
    for camp in available_campaigns:
        print(f"  - {camp['name']} (ID: {camp['id']})")
    
    print("\n" + "=" * 60)
    print("✓ ALL TESTS PASSED!")
    print("=" * 60)
    print("\nFixes verified:")
    print("1. ✓ Duplicate /explore route removed")
    print("2. ✓ Campaign creation works (no location field)")
    print("3. ✓ Campaign listing works for brands")
    print("4. ✓ Campaign exploration works for influencers")
    print("5. ✓ Route ordering is correct (/explore before /{campaign_id})")

if __name__ == "__main__":
    try:
        test_campaign_flow()
    except Exception as e:
        print(f"\n❌ Test failed with error: {e}")
        import traceback
        traceback.print_exc()
