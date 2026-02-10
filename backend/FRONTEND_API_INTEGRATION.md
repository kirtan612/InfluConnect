# Frontend API Integration Guide

## Overview

This document provides complete guidance for integrating the InfluConnect React frontend with the FastAPI backend. All endpoints are fully implemented and tested.

**Backend URL:** `http://localhost:8000`  
**API Base:** `http://localhost:8000/api`  
**API Docs:** `http://localhost:8000/api/docs` (Swagger UI)

---

## Authentication Flow

### 1. User Signup

**Endpoint:** `POST /api/auth/signup`

```javascript
// Request
{
  "email": "user@example.com",
  "password": "SecurePassword123",
  "role": "INFLUENCER" // or "BRAND"
}

// Response (Success)
{
  "access_token": "eyJhbGc...",
  "refresh_token": "eyJhbGc...",
  "token_type": "bearer",
  "user_id": 1,
  "email": "user@example.com",
  "role": "INFLUENCER"
}
```

**Business Rules:**

- Password must be at least 8 characters
- Email must be unique (not already registered)
- Only INFLUENCER and BRAND roles allowed (ADMIN cannot self-register)
- TikTok platform rejected during campaign creation

### 2. User Login

**Endpoint:** `POST /api/auth/login`

```javascript
// Request
{
  "username": "user@example.com",  // Note: sends as 'username' from OAuth2PasswordRequestForm
  "password": "SecurePassword123"
}

// Response (Success)
{
  "access_token": "eyJhbGc...",
  "refresh_token": "eyJhbGc...",
  "token_type": "bearer",
  "user_id": 1,
  "email": "user@example.com",
  "role": "INFLUENCER"
}
```

### 3. Admin Login

**Endpoint:** `POST /api/auth/admin/login`

```javascript
// Request (same as regular login)
{
  "username": "admin@example.com",
  "password": "admin_password"
}

// Response
{
  "access_token": "eyJhbGc...",
  "refresh_token": "eyJhbGc...",
  "token_type": "bearer",
  "user_id": 1,
  "email": "admin@example.com",
  "role": "ADMIN"
}
```

**Note:** Only users with ADMIN role can login via this endpoint.

### 4. Refresh Token

**Endpoint:** `POST /api/auth/refresh`

```javascript
// Request
{
  "refresh_token": "eyJhbGc..."
}

// Response
{
  "access_token": "eyJhbGc...",  // New access token
  "refresh_token": "eyJhbGc...",  // New refresh token
  "token_type": "bearer",
  "user_id": 1,
  "email": "user@example.com",
  "role": "INFLUENCER"
}
```

### 5. Get Current User

**Endpoint:** `GET /api/auth/me`

```javascript
// Request (with Authorization header)
Headers: {
  "Authorization": "Bearer eyJhbGc..."
}

// Response
{
  "access_token": "",  // Empty for this endpoint
  "refresh_token": "",
  "token_type": "bearer",
  "user_id": 1,
  "email": "user@example.com",
  "role": "INFLUENCER"
}
```

---

## Influencer Endpoints

### 1. Get Influencer Profile

**Endpoint:** `GET /api/influencer/profile`

```javascript
// Request
Headers: {
  "Authorization": "Bearer <access_token>"
}

// Response
{
  "id": 1,
  "user_id": 1,
  "display_name": "Sarah Johnson",
  "bio": "Tech reviewer focusing on...",
  "category": "Tech Reviews",
  "trust_score": 85,
  "verification_status": "verified",  // pending, verified, rejected
  "profile_completion": 92,
  "admin_note": null,
  "created_at": "2024-01-15T10:30:00Z",
  "updated_at": "2024-02-09T14:22:00Z"
}
```

### 2. Update Influencer Profile

**Endpoint:** `PUT /api/influencer/profile`

```javascript
// Request
{
  "display_name": "Sarah Johnson",
  "bio": "Updated bio...",
  "category": "Tech Reviews"
}

// Response (same as GET profile)
```

**Will automatically:**

- Recalculate profile completion percentage
- Recalculate trust score
- Update timestamps

### 3. Submit Verification Request

**Endpoint:** `POST /api/influencer/verify`

```javascript
// Request
{
  "metrics_snapshot": {
    "followers": 125000,
    "engagement_rate": 4.2,
    "average_likes": 5200
  }
}

// Response
{
  "id": 5,
  "status": "pending",
  "message": "Verification request submitted."
}
```

### 4. Get Verification Status

**Endpoint:** `GET /api/influencer/verification-status`

```javascript
// Request
Headers: {
  "Authorization": "Bearer <access_token>"
}

// Response
{
  "current_status": "verified",  // pending, verified, rejected
  "is_verified": true,
  "latest_request": {
    "id": 5,
    "status": "approved",
    "submitted_at": "2024-02-08T10:00:00Z",
    "reviewed_at": "2024-02-09T14:00:00Z",
    "admin_reason": "Metrics verified and authentic"
  }
}
```

### 5. Get Trust Score Explanation

**Endpoint:** `GET /api/influencer/trust-explanation`

```javascript
// Response
{
  "total_score": 85,
  "components": {
    "profile_completion": {
      "points": 25,
      "max": 30,
      "weight": "Low priority"
    },
    "verification": {
      "points": 50,
      "max": 50,
      "weight": "High priority"
    },
    "collaborations": {
      "points": 10,
      "max": 20,
      "weight": "Medium priority"
    }
  },
  "explanation": "Your trust score is strong..."
}
```

---

## Brand Endpoints

### 1. Get Brand Profile

**Endpoint:** `GET /api/brand/profile`

```javascript
// Response
{
  "id": 1,
  "user_id": 2,
  "company_name": "Acme Corporation",
  "industry": "Technology",
  "location": "San Francisco, CA",
  "status": "active",  // active, flagged
  "created_at": "2024-01-15T10:30:00Z",
  "updated_at": "2024-02-09T14:22:00Z"
}
```

### 2. Update Brand Profile

**Endpoint:** `PUT /api/brand/profile`

```javascript
// Request
{
  "company_name": "Acme Corp",
  "industry": "Technology",
  "location": "San Francisco, CA"
}

// Response (same as GET profile)
```

---

## Campaign Endpoints

### 1. Create Campaign

**Endpoint:** `POST /api/campaign`

```javascript
// Request
{
  "name": "Summer Product Launch",
  "description": "Launch campaign for new tech products",
  "platforms": ["Instagram", "YouTube"],
  "budget_min": 5000,
  "budget_max": 15000
}

// Response
{
  "id": 1,
  "brand_id": 1,
  "name": "Summer Product Launch",
  "description": "...",
  "platforms": ["Instagram", "YouTube"],
  "budget_min": 5000,
  "budget_max": 15000,
  "status": "draft",
  "created_at": "2024-02-09T14:00:00Z",
  "updated_at": "2024-02-09T14:00:00Z"
}
```

**Validation:**

- TikTok is explicitly rejected
- Budget min must be less than max
- Budget values must be positive

### 2. Get All Campaigns

**Endpoint:** `GET /api/campaign`

```javascript
// Response
[
  {
    "id": 1,
    "brand_id": 1,
    "name": "Summer Product Launch",
    ...
  },
  ...
]
```

### 3. Get Campaign Details

**Endpoint:** `GET /api/campaign/{campaign_id}`

```javascript
// Response
{
  "id": 1,
  "brand_id": 1,
  "name": "Summer Product Launch",
  ...
}
```

### 4. Update Campaign

**Endpoint:** `PUT /api/campaign/{campaign_id}`

```javascript
// Request
{
  "name": "Updated name",
  "description": "Updated...",
  "platforms": ["Instagram", "YouTube"],
  "budget_min": 5000,
  "budget_max": 20000
}

// Response (updated campaign)
```

### 5. Delete Campaign

**Endpoint:** `DELETE /api/campaign/{campaign_id}`

```javascript
// Response
{
  "detail": "Campaign deleted successfully"
}
```

**Restrictions:** Only draft campaigns can be deleted.

---

## Collaboration Request Endpoints

### 1. Create Request

**Endpoint:** `POST /api/request`

```javascript
// Request
{
  "campaign_id": 1,
  "influencer_id": 5
}

// Response
{
  "id": 1,
  "campaign_id": 1,
  "influencer_id": 5,
  "status": "pending",
  "created_at": "2024-02-09T14:00:00Z",
  "updated_at": "2024-02-09T14:00:00Z"
}
```

**Business Rules:**

- Influencer must be verified
- Campaign must belong to the requesting brand
- Duplicate requests not allowed
- Trust score >= 50 required to send requests

### 2. Get All Requests

**Endpoint:** `GET /api/request`

```javascript
// Response (filtered based on user role)
[
  {
    "id": 1,
    "campaign_id": 1,
    "influencer_id": 5,
    "status": "pending",
    ...
  },
  ...
]
```

### 3. Get Request Details

**Endpoint:** `GET /api/request/{request_id}`

```javascript
// Response
{
  "id": 1,
  "campaign_id": 1,
  "influencer_id": 5,
  "status": "pending",
  "created_at": "2024-02-09T14:00:00Z",
  "updated_at": "2024-02-09T14:00:00Z",
  "campaign_name": "Summer Launch",
  "influencer_display_name": "Sarah Johnson",
  "influencer_trust_score": 85
}
```

### 4. Update Request Status

**Endpoint:** `PUT /api/request/{request_id}`

```javascript
// Request
{
  "status": "accepted"  // pending, accepted, rejected
}

// Response (updated request)
```

**Business Rules:**

- Influencers can only accept/reject
- Brands can't change status
- Once accepted/rejected, can't be changed

### 5. Search Influencers

**Endpoint:** `GET /api/request/influencer/search`

```javascript
// Query parameters
?category=Tech Reviews&verified_only=true&min_trust_score=70

// Response
[
  {
    "id": 5,
    "display_name": "Sarah Johnson",
    "category": "Tech Reviews",
    "trust_score": 85,
    "verification_status": "verified",
    ...
  },
  ...
]
```

---

## Admin Endpoints

### 1. Get Dashboard Statistics

**Endpoint:** `GET /api/admin/stats`

```javascript
// Response
{
  "total_influencers": 2847,
  "verified_influencers": 1923,
  "pending_verifications": 47,
  "active_brands": 156,
  "live_campaigns": 89,
  "reported_issues": 12
}
```

### 2. List All Influencers

**Endpoint:** `GET /api/admin/influencers`

```javascript
// Query parameters
?verification_status=verified&include_suspended=false

// Response
[
  {
    "id": 5,
    "user_id": 10,
    "display_name": "Sarah Johnson",
    "category": "Tech Reviews",
    "trust_score": 85,
    "verification_status": "verified",
    "is_suspended": false,
    ...
  },
  ...
]
```

### 3. Verify Influencer

**Endpoint:** `POST /api/admin/verify/{user_id}`

```javascript
// Request
{
  "status": "verified",  // verified, rejected
  "reason": "Metrics verified and authentic"
}

// Response
{
  "id": 5,
  "verification_status": "verified",
  "updated_at": "2024-02-09T14:30:00Z"
}
```

### 4. Suspend User

**Endpoint:** `POST /api/admin/suspend/{user_id}`

```javascript
// Request
{
  "suspended": true,  // true to suspend, false to unsuspend
  "reason": "Fake engagement detected"  // optional
}

// Response
{
  "user_id": 10,
  "is_suspended": true,
  "updated_at": "2024-02-09T14:30:00Z"
}
```

### 5. Get Reports

**Endpoint:** `GET /api/admin/reports`

```javascript
// Response
[
  {
    "id": 1,
    "reported_entity_type": "influencer",
    "reported_entity_id": 5,
    "reason": "Fake engagement detected",
    "status": "open",  // open, resolved, dismissed
    "admin_notes": "Under investigation",
    "created_at": "2024-02-09T13:00:00Z",
    "updated_at": "2024-02-09T14:00:00Z"
  },
  ...
]
```

### 6. Review Report

**Endpoint:** `POST /api/admin/reports/{report_id}/review`

```javascript
// Request
{
  "status": "resolved",  // open, resolved, dismissed
  "admin_notes": "User suspended for 30 days"
}

// Response
{
  "id": 1,
  "status": "resolved",
  "admin_notes": "...",
  "updated_at": "2024-02-09T14:30:00Z"
}
```

### 7. Trigger Automation

**Endpoints:**

- `POST /api/admin/automation/recalculate-trust`
- `POST /api/admin/automation/downgrade-inactive`
- `POST /api/admin/automation/flag-suspicious`
- `POST /api/admin/automation/update-completion`

```javascript
// Request (no body required)

// Response
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

## Frontend Setup Instructions

### 1. Install Dependencies

```bash
cd frontend
npm install
# or
yarn install
```

### 2. Create API Client

```javascript
// src/api/client.js
const API_BASE = "http://localhost:8000/api";

export const apiClient = {
  async request(method, endpoint, body = null) {
    const token = localStorage.getItem("access_token");

    const headers = {
      "Content-Type": "application/json",
    };

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE}${endpoint}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    return response.json();
  },

  get: (endpoint) => apiClient.request("GET", endpoint),
  post: (endpoint, body) => apiClient.request("POST", endpoint, body),
  put: (endpoint, body) => apiClient.request("PUT", endpoint, body),
  delete: (endpoint) => apiClient.request("DELETE", endpoint),
};
```

### 3. Update Auth Context

```javascript
// src/context/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from "react";
import { apiClient } from "../api/client";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem("access_token");
    if (token) {
      apiClient
        .get("/auth/me")
        .then((data) => {
          setUser(data);
        })
        .catch(() => {
          localStorage.removeItem("access_token");
          localStorage.removeItem("refresh_token");
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    const data = await apiClient.post("/auth/login", {
      username: email,
      password,
    });
    localStorage.setItem("access_token", data.access_token);
    localStorage.setItem("refresh_token", data.refresh_token);
    setUser(data);
    return data;
  };

  const signup = async (email, password, role) => {
    const data = await apiClient.post("/auth/signup", {
      email,
      password,
      role,
    });
    localStorage.setItem("access_token", data.access_token);
    localStorage.setItem("refresh_token", data.refresh_token);
    setUser(data);
    return data;
  };

  const logout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
```

### 4. Update Login/Signup Components

```javascript
// In Login.jsx
const { login } = useAuth();

const handleEmailSignIn = async (e) => {
  e.preventDefault();
  try {
    const data = await login(email, password);
    // Redirect based on role
    const route =
      data.role === "BRAND" ? "/company/dashboard" : "/influencer/dashboard";
    window.location.href = route;
  } catch (error) {
    setError(error.message);
  }
};
```

---

## Error Handling

All endpoints return detailed error messages:

```javascript
// Validation Error (422)
{
  "detail": [
    {
      "loc": ["body", "password"],
      "msg": "ensure this value has at least 8 characters",
      "type": "value_error.string.min_length"
    }
  ]
}

// Unauthorized (401)
{
  "detail": "Could not validate credentials"
}

// Forbidden (403)
{
  "detail": "Admin access required"
}

// Not Found (404)
{
  "detail": "Influencer profile not found"
}

// Bad Request (400)
{
  "detail": "Email already registered"
}
```

---

## Token Management

### Token Expiration

- **Access Token:** 30 minutes
- **Refresh Token:** 7 days

### Refresh Token Flow

When access token expires, use refresh token:

```javascript
const refreshAccessToken = async () => {
  const refreshToken = localStorage.getItem("refresh_token");
  const data = await apiClient.post("/auth/refresh", {
    refresh_token: refreshToken,
  });
  localStorage.setItem("access_token", data.access_token);
  localStorage.setItem("refresh_token", data.refresh_token);
  return data.access_token;
};
```

---

## Testing the API

Use the Swagger UI at: `http://localhost:8000/api/docs`

Or test with curl:

```bash
# Signup
curl -X POST http://localhost:8000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "TestPassword123",
    "role": "INFLUENCER"
  }'

# Login
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "test@example.com",
    "password": "TestPassword123"
  }'

# Get Profile (replace TOKEN with actual access_token)
curl -X GET http://localhost:8000/api/influencer/profile \
  -H "Authorization: Bearer TOKEN"
```

---

## Common Integration Patterns

### Protected Routes

```javascript
import { useAuth } from "./context/AuthContext";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, requiredRole }) => {
  const { user, loading } = useAuth();

  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to="/" />;
  }

  return children;
};
```

### API Calls in Components

```javascript
import { useEffect, useState } from "react";
import { apiClient } from "../api/client";
import { useAuth } from "../context/AuthContext";

const InfluencerProfile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user) return;

    apiClient
      .get("/influencer/profile")
      .then(setProfile)
      .catch((err) => setError(err.message));
  }, [user]);

  if (error) return <div>Error: {error}</div>;
  if (!profile) return <div>Loading...</div>;

  return <div>{profile.display_name}</div>;
};
```

---

## Troubleshooting

### CORS Issues

- Ensure backend CORS is configured for `http://localhost:3000`
- Check that requests include proper `Authorization` header

### Token Expired

- Use refresh token to get new access token
- Redirect to login if refresh fails

### Validation Errors

- Check request payload matches schema
- Review error details in response

### 401 Unauthorized

- Verify token is valid and not expired
- Check token is being sent in Authorization header

---

## Production Deployment

Before deploying to production:

1. **Update API_BASE URL** in `src/api/client.js`
2. **Configure Backend CORS** for production domain
3. **Use HTTPS** for all requests
4. **Store tokens securely** (consider httpOnly cookies)
5. **Implement token refresh** automatically before expiry
6. **Add rate limiting** on backend
7. **Log authentication errors** for security monitoring

---

## Support

For issues or questions:

1. Check backend API docs: `http://localhost:8000/api/docs`
2. Review backend code in `app/routers/`
3. Check error messages in network requests
4. Verify token is valid: Use `/auth/me` endpoint

---

**Last Updated:** February 9, 2026
**Backend Version:** 1.0.0
**API Status:** ✅ Production Ready
