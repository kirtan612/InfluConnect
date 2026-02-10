#!/usr/bin/env python
"""
Test/Example script for InfluConnect API
Demonstrates complete user flow with curl-like examples
"""

import json

def print_section(title):
"""Print a section header."""
print("\n" + "=" _ 70)
print(f" {title}")
print("=" _ 70)

def print_request(method, endpoint, data=None):
"""Print a formatted API request."""
print(f"\n► {method} {endpoint}")
if data:
print(f" Body: {json.dumps(data, indent=2)}")

def main():
print_section("InfluConnect API - Complete Usage Guide")

    print("\n📚 This guide shows all API endpoints and their usage.")
    print("For actual requests, use curl, Postman, or any HTTP client.")

    # 1. AUTHENTICATION FLOW
    print_section("1. AUTHENTICATION FLOW")

    print_request("POST", "/api/auth/signup", {
        "email": "influencer@example.com",
        "password": "SecurePass123",
        "role": "INFLUENCER"
    })
    print("Response: { access_token, refresh_token, token_type }")

    print_request("POST", "/api/auth/login", {
        "username": "influencer@example.com",
        "password": "SecurePass123"
    })
    print("Response: { access_token, refresh_token, token_type }")
    print("Note: Use username field even though email is required")

    print_request("POST", "/api/auth/refresh", {
        "refresh_token": "your_refresh_token_here"
    })
    print("Response: { access_token, refresh_token, token_type }")

    # 2. INFLUENCER ENDPOINTS
    print_section("2. INFLUENCER ENDPOINTS")

    print("Requires: Authorization: Bearer <access_token>")

    print_request("GET", "/api/influencer/profile")
    print("Response: InfluencerProfile (display_name, bio, trust_score, etc.)")

    print_request("PUT", "/api/influencer/profile", {
        "display_name": "Emma Fashion",
        "bio": "Fashion and lifestyle influencer",
        "category": "Fashion"
    })
    print("Response: Updated InfluencerProfile")

    print_request("POST", "/api/influencer/verify", {
        "metrics_snapshot": {
            "followers": 50000,
            "engagement_rate": 4.5,
            "average_likes": 2500
        }
    })
    print("Response: { id, status, message }")

    print_request("GET", "/api/influencer/trust-explanation")
    print("Response: TrustExplanation with calculation breakdown")

    # 3. BRAND ENDPOINTS
    print_section("3. BRAND ENDPOINTS")

    print("Requires: Authorization: Bearer <access_token> (BRAND role)")

    print_request("GET", "/api/brand/profile")
    print("Response: BrandProfile (company_name, industry, location, status)")

    print_request("PUT", "/api/brand/profile", {
        "company_name": "TechBrand Inc",
        "industry": "Technology",
        "location": "San Francisco, CA"
    })
    print("Response: Updated BrandProfile")

    # 4. CAMPAIGN ENDPOINTS
    print_section("4. CAMPAIGN ENDPOINTS")

    print("Requires: Authorization: Bearer <access_token> (BRAND role)")

    print_request("POST", "/api/campaign", {
        "name": "Summer Collection 2024",
        "description": "Promote our new summer fashion line",
        "category": "Fashion",
        "platforms": ["Instagram", "YouTube"],
        "budget_min": 5000,
        "budget_max": 15000
    })
    print("Response: Campaign (status starts as DRAFT)")
    print("Note: TikTok is NOT allowed - only Instagram, YouTube, LinkedIn")

    print_request("GET", "/api/campaign")
    print("Response: List[Campaign] - your campaigns")

    print_request("GET", "/api/campaign/123")
    print("Response: Campaign details")

    print_request("PUT", "/api/campaign/123", {
        "status": "active",
        "budget_max": 20000
    })
    print("Response: Updated Campaign")

    print_request("DELETE", "/api/campaign/123")
    print("Note: Only DRAFT campaigns can be deleted")
    print("Response: { message }")

    # 5. COLLABORATION REQUEST ENDPOINTS
    print_section("5. COLLABORATION REQUEST ENDPOINTS")

    print("Requires: Authorization: Bearer <access_token>")

    print_request("POST", "/api/request", {
        "campaign_id": 1,
        "influencer_id": 5
    })
    print("Response: CollaborationRequest (status: PENDING)")
    print("Rule: Influencer MUST be verified")

    print_request("GET", "/api/request/influencer/search", {
        "category": "Fashion",
        "min_trust_score": 50,
        "verified_only": True
    })
    print("Response: List[InfluencerProfile] - matching influencers")

    print_request("GET", "/api/request/1")
    print("Response: CollaborationRequest with campaign and influencer details")

    print_request("PUT", "/api/request/1", {
        "status": "accepted"
    })
    print("Note: Influencers accept/reject. Updates trust score if accepted.")
    print("Response: Updated CollaborationRequest")

    print_request("GET", "/api/request")
    print("Response: List[CollaborationRequest] - your brand's requests")

    # 6. ADMIN ENDPOINTS
    print_section("6. ADMIN ENDPOINTS")

    print("Requires: Authorization: Bearer <access_token> (ADMIN role)")
    print("Admin accounts must be created via create_admin.py script!")

    print_request("GET", "/api/admin/influencers", {
        "verification_status": "pending",
        "include_suspended": False
    })
    print("Response: List[AdminInfluencerResponse]")

    print_request("POST", "/api/admin/verify/5", {
        "status": "verified",
        "reason": "Metrics verified and approved"
    })
    print("Response: { id, status, reason, message }")

    print_request("POST", "/api/admin/suspend/10", {
        "is_suspended": True,
        "reason": "Suspicious activity detected"
    })
    print("Response: { user_id, email, action, reason, message }")

    print_request("GET", "/api/admin/reports", {
        "status_filter": "pending"
    })
    print("Response: List[ReportResponse]")

    print_request("POST", "/api/admin/reports/1/review", {
        "status": "resolved",
        "admin_notes": "User warned about policy violations"
    })
    print("Response: { id, status, message }")

    print_request("GET", "/api/admin/stats")
    print("Response: AdminDashboardStats (counts and metrics)")

    print_request("POST", "/api/admin/automation/recalculate-trust")
    print("Response: Task results with details")

    print_request("POST", "/api/admin/automation/downgrade-inactive", {
        "inactivity_days": 90
    })
    print("Response: Task results with downgraded influencers")

    print_request("POST", "/api/admin/automation/flag-suspicious")
    print("Response: Task results with flagged profiles")

    print_request("POST", "/api/admin/automation/update-completion")
    print("Response: Task results with updated completion scores")

    # 7. SYSTEM ENDPOINTS
    print_section("7. SYSTEM ENDPOINTS")

    print_request("GET", "/health")
    print("Response: { status, service, version }")

    print_request("GET", "/")
    print("Response: { name, version, docs_url, redoc_url }")

    # AUTHENTICATION HEADER
    print_section("AUTHENTICATION HEADERS")

    print("\nAll protected endpoints require Authorization header:")
    print('  Authorization: Bearer <your_access_token>')
    print("\nExample with curl:")
    print('  curl -H "Authorization: Bearer eyJhbGc..." http://localhost:8000/api/influencer/profile')

    # IMPORTANT NOTES
    print_section("IMPORTANT BUSINESS RULES")

    rules = [
        "🔐 Admin accounts cannot be created via signup - use create_admin.py",
        "🔐 Suspended users cannot login",
        "📱 Only Instagram, YouTube, LinkedIn allowed - TikTok explicitly rejected",
        "✅ Unverified influencers cannot receive collaboration requests",
        "✅ Flagged brands cannot create campaigns",
        "🔄 Trust score automatically updates when profile updated",
        "🔄 Trust score updates when collaboration request accepted",
        "🔄 Verification status changes affect trust score",
        "🗓️ Tokens expire - use refresh endpoint to extend",
        "📊 Profile completion calculated automatically",
    ]

    for rule in rules:
        print(f"\n  {rule}")

    # ERROR CODES
    print_section("HTTP STATUS CODES")

    codes = {
        "200": "OK - Request successful",
        "201": "Created - Resource created",
        "400": "Bad Request - Validation or business logic error",
        "401": "Unauthorized - Missing or invalid token",
        "403": "Forbidden - Insufficient permissions (e.g., role check, suspended)",
        "404": "Not Found - Resource doesn't exist",
        "422": "Unprocessable Entity - Invalid data format",
    }

    for code, desc in codes.items():
        print(f"\n  {code}: {desc}")

    # EXAMPLE FLOW
    print_section("EXAMPLE USER FLOW")

    print("\n1. Influencer signs up:")
    print("   POST /api/auth/signup with role='INFLUENCER'")

    print("\n2. Influencer completes profile:")
    print("   PUT /api/influencer/profile (add name, bio, category)")

    print("\n3. Influencer submits verification:")
    print("   POST /api/influencer/verify (provide metrics)")

    print("\n4. Admin reviews verification:")
    print("   POST /api/admin/verify/{id} with status='verified'")

    print("\n5. Brand creates campaign:")
    print("   POST /api/campaign (create marketing campaign)")

    print("\n6. Brand searches for influencers:")
    print("   GET /api/request/influencer/search (filter by category/trust)")

    print("\n7. Brand sends collaboration request:")
    print("   POST /api/request (send to verified influencer)")

    print("\n8. Influencer accepts/rejects:")
    print("   PUT /api/request/{id} (update status)")

    print("\n9. Influencer trust score updates:")
    print("   Automatic when collaboration accepted")

    print("\n" + "=" * 70)
    print("✓ API is ready to use!")
    print("✓ Start server: uvicorn app.main:app --reload")
    print("✓ API docs: http://localhost:8000/api/docs")
    print("=" * 70 + "\n")

if **name** == "**main**":
main()
