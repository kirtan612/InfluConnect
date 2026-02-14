import requests

API_URL = "http://127.0.0.1:8000/api"

# Test signup
print("Testing signup...")
try:
    response = requests.post(
        f"{API_URL}/auth/signup",
        json={
            "email": "testuser@example.com",
            "password": "password123",
            "role": "INFLUENCER"
        }
    )
    print(f"Status: {response.status_code}")
    print(f"Response: {response.json()}")
except Exception as e:
    print(f"Error: {e}")
