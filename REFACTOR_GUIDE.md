# Step-by-Step Refactor Guide

## Overview
This guide shows exactly how to refactor each dashboard component to use real API data instead of hardcoded dummy data.

## Pattern to Follow

Every component that displays data should follow this pattern:

```javascript
import { useState, useEffect } from 'react'
import serviceLayer from '../services/serviceLayer'
import LoadingSpinner from './LoadingSpinner'
import ErrorMessage from './ErrorMessage'
import EmptyState from './EmptyState'

const Component = () => {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchData = () => {
    setLoading(true)
    setError(null)
    
    serviceLayer.getData()
      .then(response => {
        setData(response)
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

  if (loading) return <LoadingSpinner message="Loading data..." />
  if (error) return <ErrorMessage error={error} onRetry={fetchData} />
  if (!data) return <EmptyState title="No data" message="No data available" />

  return (
    // Render component with real data
  )
}
```

## Influencer Dashboard Refactoring

### 1. Update Main Dashboard Component

**File**: `frontend/src/components/InfluencerDashboard.jsx`

**Find** (around line 1-30):
```javascript
import { api } from '../services/api'
```

**Replace with**:
```javascript
import { useAuth } from '../context/AuthContext'
import influencerService from '../services/influencerService'
```

**Find** (around line 10-25):
```javascript
const [userData, setUserData] = useState(null)
const navigate = useNavigate()

useEffect(() => {
  const token = localStorage.getItem('token')
  if (!token) {
    navigate('/signin')
    return
  }
  
  api.getProfile(token)
    .then(data => setUserData(data))
    .catch(() => navigate('/signin'))
}, [navigate])
```

**Replace with**:
```javascript
const { user, logout } = useAuth()
const navigate = useNavigate()

if (!user) {
  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="text-white text-center">
        <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p>Loading...</p>
      </div>
    </div>
  )
}
```

**Find** (around line 25):
```javascript
const handleLogout = () => {
  localStorage.removeItem('token')
  navigate('/')
}
```

**Replace with**:
```javascript
const handleLogout = () => {
  logout()
  navigate('/')
}
```

**Find** (around line 100):
```javascript
{userData.email}
```

**Replace with**:
```javascript
{user.email}
```

**Find** (around line 105):
```javascript
{userData.role}
```

**Replace with**:
```javascript
{user.role}
```

### 2. Refactor MyProfile Component

**Find** (around line 180-210):
```javascript
const MyProfile = () => {
  const [showPublicProfile, setShowPublicProfile] = useState(false)
  const [activeProfileTab, setActiveProfileTab] = useState('overview')
  
  const profile = {
    name: 'Sarah Johnson',
    verified: true,
    category: 'Tech Reviews',
    // ... rest of hardcoded data
  }

  const contentImages = [
    // ... hardcoded array
  ]
```

**Replace with**:
```javascript
import influencerService from '../services/influencerService'
import LoadingSpinner from './LoadingSpinner'
import ErrorMessage from './ErrorMessage'

const MyProfile = () => {
  const [showPublicProfile, setShowPublicProfile] = useState(false)
  const [activeProfileTab, setActiveProfileTab] = useState('overview')
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    influencerService.getProfile()
      .then(data => {
        setProfile(data)
        setLoading(false)
      })
      .catch(err => {
        setError(err.message)
        setLoading(false)
      })
  }, [])

  if (loading) return <LoadingSpinner message="Loading profile..." />
  if (error) return <ErrorMessage error={error} />
  if (!profile) return <EmptyState title="No profile" message="Profile not found" />
```

**Then update the JSX to use real data**:
```javascript
<h1 className="text-3xl font-bold mb-2 flex items-center">
  {profile.display_name}
  {profile.verification_status === 'verified' && (
    <span className="ml-3 w-6 h-6 bg-brand-teal rounded-full flex items-center justify-center">
      <span className="text-white text-sm font-bold">✓</span>
    </span>
  )}
</h1>
<p className="text-white/90 text-lg mb-2">{profile.category}</p>
```

**For stats, since backend doesn't return detailed stats, show what's available**:
```javascript
<div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center border border-white/20">
  <div className="text-2xl font-bold">{profile.trust_score}</div>
  <div className="text-sm text-white/80">Trust Score</div>
</div>
<div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center border border-white/20">
  <div className="text-2xl font-bold">{profile.profile_completion}%</div>
  <div className="text-sm text-white/80">Profile Complete</div>
</div>
```

### 3. Refactor Verification Component

**Find** (around line 650):
```javascript
const Verification = () => {
  const [verificationStatus] = useState('approved')
  
  const verificationData = {
    status: verificationStatus,
    submittedDate: '2024-01-15',
    // ... hardcoded data
  }
```

**Replace with**:
```javascript
const Verification = () => {
  const [verificationData, setVerificationData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  const fetchVerificationStatus = () => {
    setLoading(true)
    influencerService.getVerificationStatus()
      .then(data => {
        setVerificationData(data)
        setLoading(false)
      })
      .catch(err => {
        setError(err.message)
        setLoading(false)
      })
  }

  useEffect(() => {
    fetchVerificationStatus()
  }, [])

  const handleSubmitVerification = async (metricsSnapshot) => {
    setSubmitting(true)
    try {
      await influencerService.submitVerification(metricsSnapshot)
      // Refresh status
      fetchVerificationStatus()
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return <LoadingSpinner message="Loading verification status..." />
  if (error) return <ErrorMessage error={error} onRetry={fetchVerificationStatus} />
```

**Update JSX to use real data**:
```javascript
{verificationData.current_status === 'verified' && (
  <div className="bg-green-50 border border-green-200 rounded-lg p-6">
    <div className="flex items-center space-x-3">
      <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
        <span className="text-white text-2xl">✓</span>
      </div>
      <div>
        <h3 className="text-lg font-semibold text-green-900">Verified Creator</h3>
        <p className="text-green-700">Your account is verified</p>
      </div>
    </div>
  </div>
)}

{verificationData.current_status === 'pending' && (
  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
    <h3 className="text-lg font-semibold text-yellow-900">Verification Pending</h3>
    <p className="text-yellow-700">Your verification request is under review</p>
  </div>
)}
```

### 4. Refactor Requests Component

**Find** (around line 850):
```javascript
const Requests = () => {
  const requests = [
    // ... hardcoded array
  ]
```

**Replace with**:
```javascript
const Requests = () => {
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchRequests = () => {
    setLoading(true)
    influencerService.getRequests()
      .then(data => {
        setRequests(data)
        setLoading(false)
      })
      .catch(err => {
        setError(err.message)
        setLoading(false)
      })
  }

  useEffect(() => {
    fetchRequests()
  }, [])

  const handleUpdateStatus = async (requestId, status) => {
    try {
      await influencerService.updateRequestStatus(requestId, status)
      // Refresh requests
      fetchRequests()
    } catch (err) {
      setError(err.message)
    }
  }

  if (loading) return <LoadingSpinner message="Loading requests..." />
  if (error) return <ErrorMessage error={error} onRetry={fetchRequests} />
  if (requests.length === 0) {
    return (
      <EmptyState 
        icon="📬"
        title="No collaboration requests"
        message="You haven't received any collaboration requests yet."
      />
    )
  }
```

**Update JSX to handle status updates**:
```javascript
<button
  onClick={() => handleUpdateStatus(request.id, 'accepted')}
  className="btn-primary"
>
  Accept
</button>
<button
  onClick={() => handleUpdateStatus(request.id, 'rejected')}
  className="btn-secondary"
>
  Decline
</button>
```

## Company Dashboard Refactoring

### 1. Update Main Dashboard Component

**File**: `frontend/src/components/CompanyDashboard.jsx`

**Add imports**:
```javascript
import { useAuth } from '../context/AuthContext'
import companyService from '../services/companyService'
```

**Replace authentication logic** (similar to Influencer dashboard):
```javascript
const { user, logout } = useAuth()
const navigate = useNavigate()

const handleLogout = () => {
  logout()
  navigate('/')
}
```

### 2. Refactor CompanyProfile Component

**Find** (around line 180):
```javascript
const CompanyProfile = ({ onComplete }) => {
  const [activeProfileTab, setActiveProfileTab] = useState('overview')
  const [profile, setProfile] = useState({
    name: 'Acme Corporation',
    // ... hardcoded data
  })
```

**Replace with**:
```javascript
const CompanyProfile = ({ onComplete }) => {
  const [activeProfileTab, setActiveProfileTab] = useState('overview')
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    companyService.getProfile()
      .then(data => {
        setProfile(data)
        setLoading(false)
      })
      .catch(err => {
        setError(err.message)
        setLoading(false)
      })
  }, [])

  if (loading) return <LoadingSpinner message="Loading profile..." />
  if (error) return <ErrorMessage error={error} />
  if (!profile) return <EmptyState title="No profile" />
```

**Update JSX**:
```javascript
<h1 className="text-2xl font-bold text-gray-900">{profile.company_name}</h1>
<p className="text-gray-600">{profile.industry} • {profile.location}</p>
```

### 3. Refactor DiscoverInfluencers Component

**Find** (around line 400):
```javascript
const DiscoverInfluencers = () => {
  const [showFilters, setShowFilters] = useState(true)
  const [selectedInfluencer, setSelectedInfluencer] = useState(null)
  const [showProfile, setShowProfile] = useState(null)
  const [filters, setFilters] = useState({
    category: 'all',
    platform: 'all',
    location: 'all',
    sortBy: 'match'
  })

  const influencers = [
    // ... hardcoded array of 4 influencers
  ]
```

**Replace with**:
```javascript
const DiscoverInfluencers = () => {
  const [showFilters, setShowFilters] = useState(true)
  const [selectedInfluencer, setSelectedInfluencer] = useState(null)
  const [showProfile, setShowProfile] = useState(null)
  const [filters, setFilters] = useState({
    category: '',
    verified_only: true,
    min_trust_score: 70
  })
  const [influencers, setInfluencers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchInfluencers = () => {
    setLoading(true)
    const searchParams = {}
    if (filters.category && filters.category !== 'all') {
      searchParams.category = filters.category
    }
    searchParams.verified_only = filters.verified_only
    searchParams.min_trust_score = filters.min_trust_score

    companyService.searchInfluencers(searchParams)
      .then(data => {
        setInfluencers(data)
        setLoading(false)
      })
      .catch(err => {
        setError(err.message)
        setLoading(false)
      })
  }

  useEffect(() => {
    fetchInfluencers()
  }, [filters])

  if (loading) return <LoadingSpinner message="Searching influencers..." />
  if (error) return <ErrorMessage error={error} onRetry={fetchInfluencers} />
  if (influencers.length === 0) {
    return (
      <EmptyState 
        icon="🔍"
        title="No influencers found"
        message="Try adjusting your filters to see more results."
      />
    )
  }
```

**Update filter handling**:
```javascript
const handleFilterChange = (key, value) => {
  setFilters(prev => ({ ...prev, [key]: value }))
}
```

**Update JSX to use real data**:
```javascript
{influencers.map((influencer) => (
  <div key={influencer.id} className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all">
    <div className="p-6">
      <h3 className="font-semibold text-gray-900">{influencer.display_name}</h3>
      <p className="text-sm text-gray-600">{influencer.category}</p>
      <div className="text-lg font-bold text-gray-900">{influencer.trust_score}</div>
      <div className="text-xs text-gray-500">Trust Score</div>
      {influencer.verification_status === 'verified' && (
        <span className="text-brand-teal text-xs">✓ Verified</span>
      )}
    </div>
  </div>
))}
```

### 4. Refactor Campaigns Component

**Find** (around line 900):
```javascript
const Campaigns = () => {
  const campaigns = [
    // ... hardcoded array
  ]
```

**Replace with**:
```javascript
const Campaigns = () => {
  const [campaigns, setCampaigns] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showCreateModal, setShowCreateModal] = useState(false)

  const fetchCampaigns = () => {
    setLoading(true)
    companyService.getCampaigns()
      .then(data => {
        setCampaigns(data)
        setLoading(false)
      })
      .catch(err => {
        setError(err.message)
        setLoading(false)
      })
  }

  useEffect(() => {
    fetchCampaigns()
  }, [])

  const handleCreateCampaign = async (campaignData) => {
    try {
      await companyService.createCampaign(campaignData)
      setShowCreateModal(false)
      fetchCampaigns()
    } catch (err) {
      setError(err.message)
    }
  }

  const handleDeleteCampaign = async (campaignId) => {
    if (window.confirm('Are you sure you want to delete this campaign?')) {
      try {
        await companyService.deleteCampaign(campaignId)
        fetchCampaigns()
      } catch (err) {
        setError(err.message)
      }
    }
  }

  if (loading) return <LoadingSpinner message="Loading campaigns..." />
  if (error) return <ErrorMessage error={error} onRetry={fetchCampaigns} />
  if (campaigns.length === 0) {
    return (
      <EmptyState 
        icon="📋"
        title="No campaigns yet"
        message="Create your first campaign to start collaborating with influencers."
        action={{
          label: 'Create Campaign',
          onClick: () => setShowCreateModal(true)
        }}
      />
    )
  }
```

### 5. Refactor Requests Component

**Find** (around line 1200):
```javascript
const Requests = () => {
  const requests = [
    // ... hardcoded array
  ]
```

**Replace with**:
```javascript
const Requests = () => {
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchRequests = () => {
    setLoading(true)
    companyService.getRequests()
      .then(data => {
        setRequests(data)
        setLoading(false)
      })
      .catch(err => {
        setError(err.message)
        setLoading(false)
      })
  }

  useEffect(() => {
    fetchRequests()
  }, [])

  if (loading) return <LoadingSpinner message="Loading requests..." />
  if (error) return <ErrorMessage error={error} onRetry={fetchRequests} />
  if (requests.length === 0) {
    return (
      <EmptyState 
        icon="📤"
        title="No requests sent"
        message="You haven't sent any collaboration requests yet."
      />
    )
  }
```

## Testing Checklist

After refactoring each component:

- [ ] Component loads without errors
- [ ] Loading spinner shows while fetching data
- [ ] Error message shows if API call fails
- [ ] Empty state shows when no data
- [ ] Real data from backend displays correctly
- [ ] User actions (create, update, delete) work
- [ ] Component refreshes after actions
- [ ] No console errors
- [ ] UI layout preserved
- [ ] Responsive design still works

## Common Issues & Solutions

### Issue: "Cannot read property of undefined"
**Solution**: Add null checks and loading states before rendering data

### Issue: "401 Unauthorized"
**Solution**: Check that token is stored in localStorage and user is logged in

### Issue: "CORS error"
**Solution**: Ensure backend CORS is configured for frontend URL

### Issue: "Data not refreshing"
**Solution**: Call fetch function after create/update/delete operations

### Issue: "Empty state shows even with data"
**Solution**: Check data structure matches what component expects

## Final Notes

- Always test with real backend running
- Check browser console for errors
- Use React DevTools to inspect state
- Test all user flows (create, read, update, delete)
- Verify role-based access works correctly
- Test loading and error states
- Ensure responsive design still works

The refactor is systematic - follow the pattern for each component and you'll have a production-ready application with real data!
