# InfluConnect Frontend Architecture

## System Overview

```
┌─────────────────────────────────────────────────────────────┐
│                         USER                                 │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│                    REACT APP                                 │
│  ┌──────────────────────────────────────────────────────┐  │
│  │                  App.jsx                              │  │
│  │  - Routes Configuration                               │  │
│  │  - Protected Routes                                   │  │
│  │  - Role-Based Access                                  │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│                  AUTH CONTEXT                                │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  - User State (id, email, role)                      │  │
│  │  - Token Management                                   │  │
│  │  - Login/Logout Methods                               │  │
│  │  - Auto-load User on Start                            │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                     │
        ┌────────────┼────────────┐
        │            │            │
        ▼            ▼            ▼
┌──────────┐  ┌──────────┐  ┌──────────┐
│Influencer│  │ Company  │  │  Admin   │
│Dashboard │  │Dashboard │  │Dashboard │
└──────────┘  └──────────┘  └──────────┘
        │            │            │
        └────────────┼────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│                  SERVICE LAYER                               │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │   Auth       │  │  Influencer  │  │   Company    │     │
│  │  Service     │  │   Service    │  │   Service    │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
│  ┌──────────────┐                                           │
│  │   Admin      │                                           │
│  │  Service     │                                           │
│  └──────────────┘                                           │
└─────────────────────────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│                  BACKEND API                                 │
│              http://127.0.0.1:8000/api                      │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  /auth/*        - Authentication                      │  │
│  │  /influencer/*  - Influencer Operations               │  │
│  │  /brand/*       - Brand Operations                    │  │
│  │  /campaign/*    - Campaign Management                 │  │
│  │  /request/*     - Collaboration Requests              │  │
│  │  /admin/*       - Admin Operations                    │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│                  DATABASE                                    │
│                  PostgreSQL                                  │
└─────────────────────────────────────────────────────────────┘
```

## Authentication Flow

```
┌──────────┐
│  User    │
│ Visits   │
│  Login   │
└────┬─────┘
     │
     ▼
┌─────────────────┐
│  Login.jsx      │
│  - Enter email  │
│  - Enter pass   │
└────┬────────────┘
     │
     ▼
┌─────────────────────────┐
│  AuthContext.login()    │
│  - Call authService     │
└────┬────────────────────┘
     │
     ▼
┌─────────────────────────┐
│  authService.login()    │
│  - POST /api/auth/login │
└────┬────────────────────┘
     │
     ▼
┌─────────────────────────┐
│  Backend Response       │
│  {                      │
│    access_token,        │
│    refresh_token,       │
│    user_id,             │
│    email,               │
│    role                 │
│  }                      │
└────┬────────────────────┘
     │
     ▼
┌─────────────────────────┐
│  Store in Context       │
│  - setUser(userData)    │
│  - localStorage.token   │
└────┬────────────────────┘
     │
     ▼
┌─────────────────────────┐
│  Role-Based Redirect    │
│  - INFLUENCER → /inf... │
│  - BRAND → /company...  │
│  - ADMIN → /admin...    │
└─────────────────────────┘
```

## Protected Route Flow

```
┌──────────────────┐
│  User Navigates  │
│  to Dashboard    │
└────┬─────────────┘
     │
     ▼
┌─────────────────────────┐
│  ProtectedRoute         │
│  - Check user exists    │
│  - Check role matches   │
└────┬────────────────────┘
     │
     ├─── No User ────────────────┐
     │                            ▼
     │                    ┌──────────────┐
     │                    │ Redirect to  │
     │                    │   /login     │
     │                    └──────────────┘
     │
     ├─── Wrong Role ─────────────┐
     │                            ▼
     │                    ┌──────────────┐
     │                    │ Redirect to  │
     │                    │ Correct Dash │
     │                    └──────────────┘
     │
     └─── Authorized ─────────────┐
                                  ▼
                          ┌──────────────┐
                          │   Render     │
                          │  Dashboard   │
                          └──────────────┘
```

## Data Fetching Pattern

```
┌─────────────────┐
│   Component     │
│   Mounts        │
└────┬────────────┘
     │
     ▼
┌─────────────────────────┐
│  useEffect(() => {      │
│    fetchData()          │
│  }, [])                 │
└────┬────────────────────┘
     │
     ▼
┌─────────────────────────┐
│  Set Loading = true     │
└────┬────────────────────┘
     │
     ▼
┌─────────────────────────┐
│  Service Layer Call     │
│  service.getData()      │
└────┬────────────────────┘
     │
     ▼
┌─────────────────────────┐
│  Add Auth Header        │
│  Bearer <token>         │
└────┬────────────────────┘
     │
     ▼
┌─────────────────────────┐
│  Fetch from API         │
│  GET /api/endpoint      │
└────┬────────────────────┘
     │
     ├─── Success ─────────────┐
     │                         ▼
     │                 ┌──────────────┐
     │                 │ setData()    │
     │                 │ setLoading() │
     │                 └──────────────┘
     │
     └─── Error ──────────────┐
                              ▼
                      ┌──────────────┐
                      │ setError()   │
                      │ setLoading() │
                      └──────────────┘
```

## Component State Management

```
┌─────────────────────────────────────────┐
│           Component State                │
│                                          │
│  ┌────────────────────────────────────┐ │
│  │  data: null | object | array       │ │
│  │  loading: boolean                  │ │
│  │  error: string | null              │ │
│  └────────────────────────────────────┘ │
│                                          │
│  Render Logic:                           │
│  ┌────────────────────────────────────┐ │
│  │  if (loading) → LoadingSpinner     │ │
│  │  if (error) → ErrorMessage         │ │
│  │  if (!data) → EmptyState           │ │
│  │  else → Render Data                │ │
│  └────────────────────────────────────┘ │
└─────────────────────────────────────────┘
```

## Service Layer Structure

```
┌─────────────────────────────────────────────────────────┐
│                    Service Class                         │
│                                                          │
│  getAuthHeader() {                                       │
│    return { 'Authorization': `Bearer ${token}` }        │
│  }                                                       │
│                                                          │
│  async getData() {                                       │
│    const response = await fetch(url, {                  │
│      headers: this.getAuthHeader()                      │
│    })                                                    │
│    if (!response.ok) throw new Error()                  │
│    return response.json()                               │
│  }                                                       │
│                                                          │
│  async postData(body) {                                 │
│    const response = await fetch(url, {                  │
│      method: 'POST',                                    │
│      headers: {                                         │
│        ...this.getAuthHeader(),                         │
│        'Content-Type': 'application/json'               │
│      },                                                  │
│      body: JSON.stringify(body)                         │
│    })                                                    │
│    if (!response.ok) throw new Error()                  │
│    return response.json()                               │
│  }                                                       │
└─────────────────────────────────────────────────────────┘
```

## Role-Based Dashboard Routing

```
                    ┌──────────────┐
                    │   User       │
                    │   Logs In    │
                    └──────┬───────┘
                           │
                           ▼
                    ┌──────────────┐
                    │  Check Role  │
                    └──────┬───────┘
                           │
        ┌──────────────────┼──────────────────┐
        │                  │                  │
        ▼                  ▼                  ▼
┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│ INFLUENCER   │  │    BRAND     │  │    ADMIN     │
└──────┬───────┘  └──────┬───────┘  └──────┬───────┘
       │                 │                  │
       ▼                 ▼                  ▼
┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│ /influencer/ │  │  /company/   │  │   /admin/    │
│  dashboard   │  │  dashboard   │  │  dashboard   │
└──────┬───────┘  └──────┬───────┘  └──────┬───────┘
       │                 │                  │
       ▼                 ▼                  ▼
┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│ - Profile    │  │ - Profile    │  │ - Stats      │
│ - Verify     │  │ - Discover   │  │ - Users      │
│ - Requests   │  │ - Campaigns  │  │ - Reports    │
│ - Campaigns  │  │ - Requests   │  │ - Settings   │
└──────────────┘  └──────────────┘  └──────────────┘
```

## Data Flow Example: Influencer Profile

```
┌─────────────────────────────────────────────────────────┐
│  1. User navigates to /influencer/dashboard             │
└────┬────────────────────────────────────────────────────┘
     │
     ▼
┌─────────────────────────────────────────────────────────┐
│  2. ProtectedRoute checks role = INFLUENCER             │
└────┬────────────────────────────────────────────────────┘
     │
     ▼
┌─────────────────────────────────────────────────────────┐
│  3. InfluencerDashboard renders                         │
│     - Shows MyProfile component                         │
└────┬────────────────────────────────────────────────────┘
     │
     ▼
┌─────────────────────────────────────────────────────────┐
│  4. MyProfile useEffect triggers                        │
│     - setLoading(true)                                  │
└────┬────────────────────────────────────────────────────┘
     │
     ▼
┌─────────────────────────────────────────────────────────┐
│  5. influencerService.getProfile()                      │
│     - Adds Bearer token                                 │
│     - GET /api/influencer/profile                       │
└────┬────────────────────────────────────────────────────┘
     │
     ▼
┌─────────────────────────────────────────────────────────┐
│  6. Backend validates token                             │
│     - Checks user is INFLUENCER                         │
│     - Fetches profile from database                     │
└────┬────────────────────────────────────────────────────┘
     │
     ▼
┌─────────────────────────────────────────────────────────┐
│  7. Response returns                                    │
│     {                                                   │
│       id, user_id, display_name, bio,                  │
│       category, trust_score, verification_status,      │
│       profile_completion                               │
│     }                                                   │
└────┬────────────────────────────────────────────────────┘
     │
     ▼
┌─────────────────────────────────────────────────────────┐
│  8. Component updates state                             │
│     - setProfile(data)                                  │
│     - setLoading(false)                                 │
└────┬────────────────────────────────────────────────────┘
     │
     ▼
┌─────────────────────────────────────────────────────────┐
│  9. Component re-renders with data                      │
│     - Shows profile information                         │
│     - Shows trust score                                 │
│     - Shows verification status                         │
└─────────────────────────────────────────────────────────┘
```

## Error Handling Flow

```
┌─────────────────┐
│  API Call       │
└────┬────────────┘
     │
     ▼
┌─────────────────────────┐
│  Response Status        │
└────┬────────────────────┘
     │
     ├─── 200 OK ──────────────────┐
     │                             ▼
     │                     ┌──────────────┐
     │                     │ Return Data  │
     │                     └──────────────┘
     │
     ├─── 401 Unauthorized ────────┐
     │                             ▼
     │                     ┌──────────────┐
     │                     │ Clear Token  │
     │                     │ Redirect     │
     │                     └──────────────┘
     │
     ├─── 403 Forbidden ───────────┐
     │                             ▼
     │                     ┌──────────────┐
     │                     │ Show Error   │
     │                     │ "No Access"  │
     │                     └──────────────┘
     │
     └─── Other Error ────────────┐
                                  ▼
                          ┌──────────────┐
                          │ Throw Error  │
                          │ Show Message │
                          └──────────────┘
```

## File Organization

```
frontend/src/
│
├── services/              # API Communication Layer
│   ├── authService.js     # Authentication operations
│   ├── influencerService.js
│   ├── companyService.js
│   └── adminService.js
│
├── context/               # Global State Management
│   ├── AuthContext.jsx    # User state & auth methods
│   └── ThemeContext.jsx   # Theme state
│
├── components/            # Reusable Components
│   ├── ProtectedRoute.jsx # Route protection
│   ├── LoadingSpinner.jsx # Loading state
│   ├── ErrorMessage.jsx   # Error display
│   ├── EmptyState.jsx     # No data state
│   ├── AdminDashboard.jsx
│   ├── InfluencerDashboard.jsx
│   ├── CompanyDashboard.jsx
│   ├── Logo.jsx
│   └── Notifications.jsx
│
├── pages/                 # Page Components
│   ├── Login.jsx
│   ├── SignUp.jsx
│   ├── AdminLogin.jsx
│   └── LandingPage.jsx
│
└── App.jsx               # Root component with routing
```

## Security Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Security Layers                       │
│                                                          │
│  1. Route Protection                                     │
│     ProtectedRoute → Checks authentication               │
│                                                          │
│  2. Role Validation                                      │
│     ProtectedRoute → Checks user role                    │
│                                                          │
│  3. Token Management                                     │
│     AuthContext → Stores & manages JWT                   │
│                                                          │
│  4. Automatic Token Inclusion                            │
│     Service Layer → Adds Bearer token to requests        │
│                                                          │
│  5. Backend Validation                                   │
│     FastAPI → Validates token & permissions              │
│                                                          │
│  6. Database Security                                    │
│     PostgreSQL → Row-level security & constraints        │
└─────────────────────────────────────────────────────────┘
```

## Benefits of This Architecture

1. **Separation of Concerns**
   - UI components focus on presentation
   - Service layer handles API communication
   - Context manages global state

2. **Scalability**
   - Easy to add new endpoints
   - Simple to create new components
   - Clear pattern to follow

3. **Maintainability**
   - Single source of truth for API calls
   - Consistent error handling
   - Reusable helper components

4. **Security**
   - Role-based access control
   - Protected routes
   - Automatic token management

5. **User Experience**
   - Loading states
   - Error messages
   - Empty states
   - Smooth transitions

6. **Developer Experience**
   - Clear patterns
   - Comprehensive documentation
   - Easy to test
   - Type-safe (can add TypeScript later)

---

This architecture provides a solid foundation for a production-ready application with proper authentication, authorization, and data management.
