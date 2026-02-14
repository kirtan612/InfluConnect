# Quick Start Guide - Refactored InfluConnect

## What's Been Done ✅

### 1. Service Layer (Complete)
- ✅ `authService.js` - Login, signup, token management
- ✅ `influencerService.js` - All influencer endpoints
- ✅ `companyService.js` - All company/brand endpoints
- ✅ `adminService.js` - All admin endpoints

### 2. Authentication & Routing (Complete)
- ✅ `AuthContext.jsx` - Manages user state and role
- ✅ `ProtectedRoute.jsx` - Role-based access control
- ✅ `App.jsx` - Protected routes configured
- ✅ `Login.jsx` - Role-based redirects
- ✅ `AdminLogin.jsx` - Admin authentication

### 3. Helper Components (Complete)
- ✅ `LoadingSpinner.jsx` - Loading states
- ✅ `ErrorMessage.jsx` - Error handling
- ✅ `EmptyState.jsx` - No data states

### 4. Admin Dashboard (Complete)
- ✅ Uses real API data
- ✅ Loading and error states
- ✅ No dummy data

## What Needs To Be Done 🔄

### Influencer Dashboard Components
- [ ] MyProfile - Replace hardcoded profile data
- [ ] Verification - Use real verification API
- [ ] Requests - Fetch real collaboration requests
- [ ] ExploreCampaigns - Remove dummy campaigns
- [ ] Achievements - Use real achievement data

### Company Dashboard Components
- [ ] CompanyProfile - Replace hardcoded profile
- [ ] DiscoverInfluencers - Use search API
- [ ] Campaigns - Fetch real campaigns
- [ ] Requests - Use real request data

## How to Start Development

### 1. Start Backend
```bash
cd backend
python -m uvicorn app.main:app --reload
```
Backend will run at: `http://127.0.0.1:8000`
API Docs: `http://127.0.0.1:8000/api/docs`

### 2. Start Frontend
```bash
cd frontend
npm install  # if not already done
npm run dev
```
Frontend will run at: `http://localhost:5173`

### 3. Create Test Users

**Create Admin** (from backend folder):
```bash
python create_admin.py
```

**Create Influencer** (via API or Swagger UI):
```json
POST /api/auth/signup
{
  "email": "influencer@test.com",
  "password": "Test1234",
  "role": "INFLUENCER"
}
```

**Create Brand** (via API or Swagger UI):
```json
POST /api/auth/signup
{
  "email": "brand@test.com",
  "password": "Test1234",
  "role": "BRAND"
}
```

### 4. Test Role-Based Routing

1. Login as influencer → Should redirect to `/influencer/dashboard`
2. Login as brand → Should redirect to `/company/dashboard`
3. Login as admin → Should redirect to `/admin/dashboard`
4. Try accessing wrong dashboard → Should redirect to correct one

### 5. Verify What's Working

**Admin Dashboard** ✅
- Login at `/admin/login`
- View real statistics
- See loading states

**Authentication** ✅
- Signup works
- Login redirects based on role
- Protected routes enforce access
- Logout clears session

**Service Layer** ✅
- All API methods available
- Token automatically included
- Error handling built-in

## Refactoring Workflow

For each component that needs refactoring:

### Step 1: Add State Management
```javascript
const [data, setData] = useState(null)
const [loading, setLoading] = useState(true)
const [error, setError] = useState(null)
```

### Step 2: Add Data Fetching
```javascript
useEffect(() => {
  serviceLayer.getData()
    .then(data => {
      setData(data)
      setLoading(false)
    })
    .catch(err => {
      setError(err.message)
      setLoading(false)
    })
}, [])
```

### Step 3: Add Loading/Error States
```javascript
if (loading) return <LoadingSpinner />
if (error) return <ErrorMessage error={error} />
if (!data) return <EmptyState />
```

### Step 4: Update JSX with Real Data
Replace hardcoded values with data from API response

### Step 5: Test
- Check loading state appears
- Verify data displays correctly
- Test error handling
- Confirm empty state works

## File Structure

```
frontend/src/
├── services/
│   ├── authService.js          ✅ Complete
│   ├── influencerService.js    ✅ Complete
│   ├── companyService.js       ✅ Complete
│   └── adminService.js         ✅ Complete
├── context/
│   └── AuthContext.jsx         ✅ Complete
├── components/
│   ├── ProtectedRoute.jsx      ✅ Complete
│   ├── LoadingSpinner.jsx      ✅ Complete
│   ├── ErrorMessage.jsx        ✅ Complete
│   ├── EmptyState.jsx          ✅ Complete
│   ├── AdminDashboard.jsx      ✅ Complete
│   ├── InfluencerDashboard.jsx 🔄 Needs refactoring
│   └── CompanyDashboard.jsx    🔄 Needs refactoring
├── pages/
│   ├── Login.jsx               ✅ Complete
│   └── AdminLogin.jsx          ✅ Complete
└── App.jsx                     ✅ Complete
```

## API Endpoints Available

### Authentication
- `POST /api/auth/signup` - Create account
- `POST /api/auth/login` - Login
- `POST /api/auth/admin/login` - Admin login
- `GET /api/auth/me` - Get current user
- `POST /api/auth/refresh` - Refresh token

### Influencer
- `GET /api/influencer/profile` - Get profile
- `PUT /api/influencer/profile` - Update profile
- `POST /api/influencer/verify` - Submit verification
- `GET /api/influencer/verification-status` - Check status
- `GET /api/influencer/trust-explanation` - Trust breakdown
- `GET /api/request` - Get requests

### Brand/Company
- `GET /api/brand/profile` - Get profile
- `PUT /api/brand/profile` - Update profile
- `GET /api/campaign` - List campaigns
- `POST /api/campaign` - Create campaign
- `PUT /api/campaign/{id}` - Update campaign
- `DELETE /api/campaign/{id}` - Delete campaign
- `GET /api/request` - List requests
- `POST /api/request` - Create request
- `GET /api/request/influencer/search` - Search influencers

### Admin
- `GET /api/admin/stats` - Dashboard stats
- `GET /api/admin/influencers` - List influencers
- `POST /api/admin/verify/{user_id}` - Verify influencer
- `POST /api/admin/suspend/{user_id}` - Suspend user
- `GET /api/admin/reports` - Get reports
- `POST /api/admin/reports/{id}/review` - Review report

## Common Commands

### Check Backend Status
```bash
curl http://127.0.0.1:8000/api/docs
```

### Test Login
```bash
curl -X POST http://127.0.0.1:8000/api/auth/login \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "username=test@test.com&password=Test1234"
```

### View Logs
Backend logs show in terminal where uvicorn is running

### Clear Browser Storage
```javascript
// In browser console
localStorage.clear()
```

## Troubleshooting

### Backend not starting
- Check if port 8000 is available
- Verify Python virtual environment is activated
- Check database connection

### Frontend not connecting
- Verify backend is running at `http://127.0.0.1:8000`
- Check CORS configuration in backend
- Clear browser cache and localStorage

### Login not working
- Check credentials are correct
- Verify user exists in database
- Check browser console for errors
- Verify token is being stored

### Data not loading
- Check network tab in browser DevTools
- Verify API endpoint is correct
- Check token is valid
- Look for CORS errors

## Next Steps

1. **Start with one component** - Pick MyProfile in InfluencerDashboard
2. **Follow the pattern** - Use the refactor guide
3. **Test thoroughly** - Check all states (loading, error, empty, data)
4. **Move to next component** - Repeat the process
5. **Remove dummy data** - Delete hardcoded arrays and objects
6. **Add user actions** - Implement create, update, delete
7. **Polish UI** - Add transitions and feedback
8. **Final testing** - Test all user flows

## Resources

- **Refactor Guide**: `REFACTOR_GUIDE.md` - Detailed step-by-step instructions
- **Refactor Summary**: `REFACTOR_SUMMARY.md` - Overview of changes
- **Backend API Docs**: `backend/API_QUICK_REFERENCE.md`
- **Integration Guide**: `backend/FRONTEND_API_INTEGRATION.md`

## Success Criteria

Your refactor is complete when:
- ✅ No hardcoded data in any component
- ✅ All components fetch from API
- ✅ Loading states show during fetch
- ✅ Error states handle failures
- ✅ Empty states show when no data
- ✅ User actions work (create, update, delete)
- ✅ Role-based routing enforced
- ✅ Token management working
- ✅ All dashboards show user-specific data
- ✅ No console errors

## Time Estimate

- **Per component**: 30-60 minutes
- **Total remaining work**: 6-8 hours
- **Testing**: 2-3 hours
- **Polish**: 1-2 hours

**Total**: ~10-13 hours of focused work

## Support

If you encounter issues:
1. Check the refactor guide for your specific component
2. Review the API documentation
3. Test the endpoint in Swagger UI
4. Check browser console for errors
5. Verify backend is running and accessible

Good luck with the refactor! The foundation is solid, now it's just systematic replacement of dummy data with real API calls. 🚀
