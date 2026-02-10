# API Quick Reference Guide

## Base URL

```
http://localhost:8000/api
```

## Authentication

### Signup

```
POST /auth/signup
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePass123",
  "role": "INFLUENCER"  // or "BRAND"
}

Response: 200 OK
{
  "access_token": "...",
  "refresh_token": "...",
  "token_type": "bearer",
  "user_id": 1,
  "email": "user@example.com",
  "role": "INFLUENCER"
}
```

### Login

```
POST /auth/login
Content-Type: application/json

{
  "username": "user@example.com",
  "password": "SecurePass123"
}

Response: 200 OK (same as signup)
```

### Admin Login

```
POST /auth/admin/login
Content-Type: application/json

{
  "username": "admin@example.com",
  "password": "admin_password"
}

Response: 200 OK (same as regular login but role: "ADMIN")
```

### Get Current User

```
GET /auth/me
Authorization: Bearer <access_token>

Response: 200 OK
{
  "user_id": 1,
  "email": "user@example.com",
  "role": "INFLUENCER"
}
```

### Refresh Token

```
POST /auth/refresh
Content-Type: application/json

{
  "refresh_token": "..."
}

Response: 200 OK (same as login)
```

---

## Influencer Routes

### Get Profile

```
GET /influencer/profile
Authorization: Bearer <access_token>

Response: 200 OK
{
  "id": 1,
  "user_id": 1,
  "display_name": "Sarah Johnson",
  "bio": "Tech reviewer",
  "category": "Tech Reviews",
  "trust_score": 85,
  "verification_status": "verified",
  "profile_completion": 92
}
```

### Update Profile

```
PUT /influencer/profile
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "display_name": "Sarah J",
  "bio": "Updated bio",
  "category": "Tech Reviews"
}

Response: 200 OK (updated profile)
```

### Submit Verification

```
POST /influencer/verify
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "metrics_snapshot": {
    "followers": 125000,
    "engagement_rate": 4.2,
    "average_likes": 5200
  }
}

Response: 200 OK
{
  "id": 5,
  "status": "pending",
  "message": "Verification request submitted"
}
```

### Get Verification Status

```
GET /influencer/verification-status
Authorization: Bearer <access_token>

Response: 200 OK
{
  "current_status": "verified",
  "is_verified": true,
  "latest_request": {
    "id": 5,
    "status": "approved",
    "submitted_at": "2024-02-08T10:00:00Z",
    "reviewed_at": "2024-02-09T14:00:00Z",
    "admin_reason": "Metrics verified"
  }
}
```

### Get Trust Explanation

```
GET /influencer/trust-explanation
Authorization: Bearer <access_token>

Response: 200 OK
{
  "total_score": 85,
  "components": {
    "profile_completion": { "points": 25, "max": 30 },
    "verification": { "points": 50, "max": 50 },
    "collaborations": { "points": 10, "max": 20 }
  }
}
```

---

## Brand Routes

### Get Profile

```
GET /brand/profile
Authorization: Bearer <access_token>

Response: 200 OK
{
  "id": 1,
  "user_id": 2,
  "company_name": "Acme Corp",
  "industry": "Technology",
  "location": "San Francisco, CA",
  "status": "active"
}
```

### Update Profile

```
PUT /brand/profile
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "company_name": "Acme Corp",
  "industry": "Technology",
  "location": "San Francisco, CA"
}

Response: 200 OK (updated profile)
```

---

## Campaign Routes

### Create Campaign

```
POST /campaign
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "name": "Summer Launch",
  "description": "Q3 product launch",
  "platforms": ["Instagram", "YouTube"],
  "budget_min": 5000,
  "budget_max": 15000
}

Response: 201 Created
{
  "id": 1,
  "brand_id": 1,
  "name": "Summer Launch",
  "status": "draft",
  ...
}
```

### List Campaigns

```
GET /campaign
Authorization: Bearer <access_token>

Response: 200 OK
[
  { "id": 1, "name": "Summer Launch", ... },
  { "id": 2, "name": "Fall Campaign", ... }
]
```

### Get Campaign

```
GET /campaign/{id}
Authorization: Bearer <access_token>

Response: 200 OK (single campaign)
```

### Update Campaign

```
PUT /campaign/{id}
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "name": "Updated Name",
  "description": "Updated description",
  "platforms": ["Instagram", "YouTube"],
  "budget_min": 5000,
  "budget_max": 20000
}

Response: 200 OK (updated campaign)
```

### Delete Campaign

```
DELETE /campaign/{id}
Authorization: Bearer <access_token>

Response: 200 OK
{"detail": "Campaign deleted successfully"}
```

---

## Request Routes

### Create Request

```
POST /request
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "campaign_id": 1,
  "influencer_id": 5
}

Response: 201 Created
{
  "id": 1,
  "campaign_id": 1,
  "influencer_id": 5,
  "status": "pending"
}
```

### List Requests

```
GET /request
Authorization: Bearer <access_token>

Response: 200 OK
[
  {
    "id": 1,
    "campaign_id": 1,
    "influencer_id": 5,
    "status": "pending"
  },
  ...
]
```

### Get Request

```
GET /request/{id}
Authorization: Bearer <access_token>

Response: 200 OK
{
  "id": 1,
  "campaign_id": 1,
  "influencer_id": 5,
  "status": "pending",
  "campaign_name": "Summer Launch",
  "influencer_display_name": "Sarah Johnson",
  "influencer_trust_score": 85
}
```

### Update Request

```
PUT /request/{id}
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "status": "accepted"  // pending, accepted, rejected
}

Response: 200 OK (updated request)
```

### Search Influencers

```
GET /request/influencer/search?category=Tech&verified_only=true&min_trust_score=70
Authorization: Bearer <access_token>

Response: 200 OK
[
  {
    "id": 5,
    "display_name": "Sarah Johnson",
    "category": "Tech Reviews",
    "trust_score": 85,
    "verification_status": "verified"
  },
  ...
]
```

---

## Admin Routes

### Get Stats

```
GET /admin/stats
Authorization: Bearer <admin_token>

Response: 200 OK
{
  "total_influencers": 2847,
  "verified_influencers": 1923,
  "pending_verifications": 47,
  "active_brands": 156,
  "live_campaigns": 89,
  "reported_issues": 12
}
```

### List Influencers

```
GET /admin/influencers?verification_status=verified
Authorization: Bearer <admin_token>

Response: 200 OK
[
  {
    "id": 5,
    "user_id": 10,
    "display_name": "Sarah Johnson",
    "category": "Tech Reviews",
    "trust_score": 85,
    "verification_status": "verified",
    "is_suspended": false
  },
  ...
]
```

### Verify Influencer

```
POST /admin/verify/{user_id}
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "status": "verified",  // or "rejected"
  "reason": "Metrics verified and authentic"
}

Response: 200 OK
{
  "id": 5,
  "verification_status": "verified"
}
```

### Suspend User

```
POST /admin/suspend/{user_id}
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "suspended": true,
  "reason": "Fake engagement detected"
}

Response: 200 OK
{
  "user_id": 10,
  "is_suspended": true
}
```

### Get Reports

```
GET /admin/reports
Authorization: Bearer <admin_token>

Response: 200 OK
[
  {
    "id": 1,
    "reported_entity_type": "influencer",
    "reported_entity_id": 5,
    "reason": "Fake engagement",
    "status": "open",
    "admin_notes": "Under investigation"
  },
  ...
]
```

### Review Report

```
POST /admin/reports/{report_id}/review
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "status": "resolved",  // open, resolved, dismissed
  "admin_notes": "User suspended for 30 days"
}

Response: 200 OK (updated report)
```

### Trigger Automation

```
POST /admin/automation/recalculate-trust
POST /admin/automation/downgrade-inactive
POST /admin/automation/flag-suspicious
POST /admin/automation/update-completion

Authorization: Bearer <admin_token>

Response: 200 OK
{
  "task": "recalculate_trust",
  "results": {
    "updated_count": 145,
    "new_verifications": 12,
    "message": "Trust scores recalculated"
  }
}
```

---

## HTTP Status Codes

| Code | Meaning          | Example                               |
| ---- | ---------------- | ------------------------------------- |
| 200  | OK               | Successful GET, PUT, DELETE           |
| 201  | Created          | POST resource created                 |
| 400  | Bad Request      | Invalid data, business rule violation |
| 401  | Unauthorized     | Invalid/missing token                 |
| 403  | Forbidden        | Insufficient permissions              |
| 404  | Not Found        | Resource doesn't exist                |
| 422  | Validation Error | Invalid input format                  |

---

## Common Headers

**Request:**

```
Authorization: Bearer <access_token>
Content-Type: application/json
```

**Response:**

```
Content-Type: application/json
```

---

## Error Examples

### Validation Error (422)

```json
{
  "detail": [
    {
      "loc": ["body", "password"],
      "msg": "ensure this value has at least 8 characters",
      "type": "value_error.string.min_length"
    }
  ]
}
```

### Unauthorized (401)

```json
{
  "detail": "Could not validate credentials"
}
```

### Validation Errors (400)

```json
{
  "detail": "Email already registered"
}
```

---

## Role-Based Access

- **INFLUENCER** - Can access `/influencer/*` routes
- **BRAND** - Can access `/brand/*` and create campaigns/requests
- **ADMIN** - Can access `/admin/*` routes (requires separate login)

---

## Token Flow

1. Login → Get `access_token` (30 min) and `refresh_token` (7 days)
2. Add token to all requests: `Authorization: Bearer <access_token>`
3. When access token expires, use refresh endpoint
4. Get new tokens, continue

---

## Testing Tools

- **Swagger UI:** `http://localhost:8000/api/docs`
- **cURL:** See examples in FRONTEND_API_INTEGRATION.md
- **Postman/Insomnia:** Import Swagger spec from `/api/openapi.json`

---

**Ready for Frontend Integration:** ✅
