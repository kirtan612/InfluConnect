# Quick Reference - InfluConnect Refactored

## 🚀 Start Application

```bash
# Terminal 1 - Backend
cd backend
python -m uvicorn app.main:app --reload

# Terminal 2 - Frontend
cd frontend
npm run dev
```

## 🔑 Test Credentials

Create users via Swagger UI: `http://127.0.0.1:8000/api/docs`

**Influencer:**
```json
{
  "email": "influencer@test.com",
  "password": "Test1234",
  "role": "INFLUENCER"
}
```

**Brand:**
```json
{
  "email": "brand@test.com",
  "password": "Test1234",
  "role": "BRAND"
}
```

**Admin:**
```bash
cd backend
python create_admin.py
```

## 📡 API Endpoints

### Authentication
- `POST /api/auth/signup` - Create account
- `POST /api/auth/login` - Login
- `POST /api/auth/admin/login` - Admin login
- `GET /api/auth/me` - Get current user

### Influencer
- `GET /api/influencer/profile` - Get profile
- `PUT /api/influencer/profile` - Update profile
- `POST /api/influencer/verify` - Submit verification
- `GET /api/influencer/verification-status` - Check status
- `GET /api/request` - Get requests
- `PUT /api/request/{id}` - Update request status

### Brand/Company
- `GET /api/brand/profile` - Get profile
- `PUT /api/brand/profile` - Update profile
- `GET /api/campaign` - List campaigns
- `POST /api/campaign` - Create campaign
- `DELETE /api/campaign/{id}` - Delete campaign
- `GET /api/request` - List requests
- `POST /api/request` - Create request
- `GET /api/request/influencer/search` - Search influencers

### Admin
- `GET /api/admin/stats` - Dashboard stats
- `GET /api/admin/influencers` - List influencers
- `POST /api/admin/verify/{user_id}` - Verify influencer
- `POST /api/admin/suspend/{user_id}` - Suspend user

## 🗂️ Service Layer

### authService
```javascript
import authService from '../services/authService'

await authService.signup(email, password, role)
await authService.login(email, password)
await authService.adminLogin(email, password)
await authService.getCurrentUser(token)
```

### influencerService
```javascript
import influencerService from '../services/influencerService'

await influencerService.getProfile()
await influencerService.updateProfile(data)
await influencerService.submitVerification(metrics)
await influencerService.getVerificationStatus()
await influencerService.getRequests()
await influencerService.updateRequestStatus(id, status)
```

### companyService
```javascript
import companyService from '../services/companyService'

await companyService.getProfile()
await companyService.updateProfile(data)
await companyService.getCampaigns()
await companyService.createCampaign(data)
await companyService.deleteCampaign(id)
await companyService.getRequests()
await companyService.createRequest(campaignId, influencerId)
await companyService.searchInfluencers(params)
```

### adminService
```javascript
import adminService from '../services/adminService'

await adminService.getStats()
await adminService.getInfluencers(params)
await adminService.verifyInfluencer(userId, status, reason)
await adminService.suspendUser(userId, suspended, reason)
```

## 🎨 Helper Components

### LoadingSpinner
```javascript
import LoadingSpinner from './LoadingSpinner'

<LoadingSpinner message="Loading data..." />
```

### ErrorMessage
```javascript
import ErrorMessage from './ErrorMessage'

<ErrorMessage error={error} onRetry={fetchData} />
```

### EmptyState
```javascript
import EmptyState from './EmptyState'

<EmptyState 
  icon="📬"
  title="No data"
  message="No data available"
  action={{
    label: 'Create New',
    onClick: handleCreate
  }}
/>
```

## 🔐 Authentication

### Using AuthContext
```javascript
import { useAuth } from '../context/AuthContext'

const { user, loading, login, logout } = useAuth()

// Login
await login(email, password)

// Logout
logout()

// Check user
if (user) {
  console.log(user.email, user.role)
}
```

### Protected Routes
```javascript
import ProtectedRoute from './components/ProtectedRoute'

<Route 
  path="/influencer/dashboard" 
  element={
    <ProtectedRoute allowedRoles={['INFLUENCER']}>
      <InfluencerDashboard />
    </ProtectedRoute>
  } 
/>
```

## 📝 Component Pattern

```javascript
const Component = () => {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchData = () => {
    setLoading(true)
    setError(null)
    
    serviceLayer.getData()
      .then(data => {
        setData(data)
        setLoading(false)
      })
      .catch(err => {
        setError(err.message)
        setLoading(false)
      })
  }

  useEffect(() => {
    fetchData()
  }, [])

  if (loading) return <LoadingSpinner />
  if (error) return <ErrorMessage error={error} onRetry={fetchData} />
  if (!data) return <EmptyState />

  return <div>{/* Render with data */}</div>
}
```

## 🐛 Debugging

### Check Backend
```bash
curl http://127.0.0.1:8000/api/docs
```

### Check Token
```javascript
// Browser console
localStorage.getItem('token')
```

### Clear Storage
```javascript
// Browser console
localStorage.clear()
```

### Check API Call
```javascript
// Browser DevTools → Network tab
// Look for failed requests
// Check response status and body
```

## 🎯 Role-Based Redirects

After login:
- `INFLUENCER` → `/influencer/dashboard`
- `BRAND` → `/company/dashboard`
- `ADMIN` → `/admin/dashboard`

## 📊 Data Flow

```
User Action
    ↓
Component
    ↓
Service Layer
    ↓
Backend API (with JWT token)
    ↓
Database
    ↓
Response
    ↓
Component State Update
    ↓
UI Re-render
```

## ✅ Verification

1. Backend running at `http://127.0.0.1:8000`
2. Frontend running at `http://localhost:5173`
3. Can create users via Swagger UI
4. Can login with different roles
5. Redirects work correctly
6. Data loads from API
7. CRUD operations work
8. No console errors

## 🔗 Useful Links

- **Backend API Docs:** http://127.0.0.1:8000/api/docs
- **Frontend:** http://localhost:5173
- **Backend Repo:** `backend/`
- **Frontend Repo:** `frontend/`

## 📚 Documentation

- `FINAL_REFACTOR_COMPLETE.md` - Complete summary
- `REFACTOR_GUIDE.md` - Step-by-step guide
- `ARCHITECTURE.md` - System architecture
- `QUICK_START.md` - Getting started
- `backend/API_QUICK_REFERENCE.md` - API reference

---

**Everything is ready to go! 🚀**
