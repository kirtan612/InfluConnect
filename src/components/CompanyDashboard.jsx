import React, { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Logo from './Logo'
import Notifications from './Notifications'
import LoadingSpinner from './LoadingSpinner'
import ErrorMessage from './ErrorMessage'
import EmptyState from './EmptyState'
import companyService from '../services/companyService'
import collaborationService from '../services/collaborationService'
import { ChevronLeft, ChevronRight, LogOut, Menu, Building2, Search, ClipboardList, Handshake, Send } from 'lucide-react'

const CompanyDashboard = () => {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const activeTab = searchParams.get('tab') || 'profile'

  const setActiveTab = (tabId) => {
    setSearchParams({ tab: tabId })
  }

  useEffect(() => {
    if (!searchParams.get('tab')) {
      setSearchParams({ tab: activeTab }, { replace: true })
    }
  }, [])

  const [showUserMenu, setShowUserMenu] = useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const { user, logout } = useAuth()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

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


  const navigation = [
    { id: 'profile', name: 'Company Profile', icon: Building2, color: 'text-blue-500', shadow: 'shadow-[0_2px_8px_rgba(59,130,246,0.15)]', hover: 'hover:shadow-[0_4px_12px_rgba(59,130,246,0.2)] hover:text-blue-600' },
    { id: 'discover', name: 'Discover', icon: Search, color: 'text-violet-500', shadow: 'shadow-[0_2px_8px_rgba(139,92,246,0.15)]', hover: 'hover:shadow-[0_4px_12px_rgba(139,92,246,0.2)] hover:text-violet-600' },
    { id: 'campaigns', name: 'Campaigns', icon: ClipboardList, color: 'text-rose-500', shadow: 'shadow-[0_2px_8px_rgba(244,63,110,0.15)]', hover: 'hover:shadow-[0_4px_12px_rgba(244,63,110,0.2)] hover:text-rose-600' },
    { id: 'collaborations', name: 'Collaborations', icon: Handshake, color: 'text-emerald-500', shadow: 'shadow-[0_2px_8px_rgba(16,185,129,0.15)]', hover: 'hover:shadow-[0_4px_12px_rgba(16,185,129,0.2)] hover:text-emerald-600' },
    { id: 'requests', name: 'Requests', icon: Send, color: 'text-indigo-500', shadow: 'shadow-[0_2px_8px_rgba(99,102,241,0.15)]', hover: 'hover:shadow-[0_4px_12px_rgba(99,102,241,0.2)] hover:text-indigo-600' }
  ]


  return (
    <div className="flex h-screen overflow-hidden bg-[#f4f7fb]">
      {/* Sidebar */}
      <aside className={`${isSidebarOpen ? 'w-64' : 'w-20'} flex flex-col bg-slate-50 transition-all duration-300 relative z-40 border-r border-slate-200/50 shadow-[12px_0_30px_rgba(226,232,240,0.8)]`}>
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="absolute -right-3 top-8 bg-white text-slate-600 border border-slate-200 p-1.5 rounded-full shadow-[0_4px_12px_rgba(0,0,0,0.1)] hover:scale-110 transition-transform z-50 flex items-center justify-center hover:bg-slate-50"
        >
          {isSidebarOpen ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
        </button>

        <div className={`h-20 flex items-center ${isSidebarOpen ? 'px-6' : 'justify-center'} border-b border-slate-200/50`}>
          {isSidebarOpen ? <Logo size="md" className="drop-shadow-[5px_5px_15px_5px_rgba(199,210,254,0.3)]" /> : <div className="text-indigo-600 font-bold text-xl drop-shadow-[5px_5px_15px_5px_rgba(199,210,254,0.3)]">IC</div>}
        </div>

        <div className="flex-1 overflow-y-auto py-6 flex flex-col gap-2 px-3">
          {navigation.map((item) => {
            const IconComponent = item.icon
            const isActive = activeTab === item.id
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center space-x-3 px-3 py-3 rounded-xl transition-all duration-300 ${isActive
                  ? `bg-white ${item.color} ${item.shadow} border border-slate-100 transform -translate-y-1`
                  : `text-slate-500 ${item.hover} transform hover:-translate-y-1 bg-transparent hover:bg-white border hidden-border hover:border-slate-100`
                  } ${!isSidebarOpen ? 'justify-center' : ''}`}
                title={!isSidebarOpen ? item.name : ''}
              >
                <IconComponent size={20} className={isActive ? item.color : 'text-slate-400 group-hover:' + item.color} />
                {isSidebarOpen && <span className="font-medium whitespace-nowrap">{item.name}</span>}
              </button>
            )
          })}
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 bg-white/80 backdrop-blur-md shadow-[0_4px_20px_rgba(0,0,0,0.05)] border-b border-indigo-50 flex items-center justify-end px-6 z-30 sticky top-0">
          <div className="flex items-center space-x-4">
            <Notifications />
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center space-x-3 p-2 rounded-xl hover:bg-[#f4f7fb] transition-colors"
              >
                <div className="w-9 h-9 bg-indigo-900 rounded-xl flex items-center justify-center shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-slate-100/50">
                  <span className="text-teal-600 font-semibold">{user.email[0].toUpperCase()}</span>
                </div>
                <div className="hidden md:block text-left">
                  <div className="text-sm font-medium text-slate-900">{user.email}</div>
                  <div className="text-xs text-teal-600 font-semibold">{user.role}</div>
                </div>
              </button>

              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-[20px_20px_50px_rgba(203,213,225,0.6)] border border-slate-100 py-2 z-50">
                  <button onMouseDown={handleLogout} className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-[#f4f7fb] hover:text-indigo-900 flex items-center space-x-2">
                    <LogOut size={16} />
                    <span>Log out</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-[#f4f7fb] p-6 md:p-8">
          <div className="max-w-7xl mx-auto">
            {activeTab === 'profile' && <CompanyProfile />}
            {activeTab === 'discover' && <DiscoverInfluencers />}
            {activeTab === 'campaigns' && <Campaigns />}
            {activeTab === 'collaborations' && <BrandCollaborations />}
            {activeTab === 'requests' && <Requests />}
          </div>
        </main>
      </div>
    </div>
  )
}

// Company Profile Component
const CompanyProfile = () => {
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [editing, setEditing] = useState(false)
  const [formData, setFormData] = useState({})

  const fetchProfile = () => {
    setLoading(true)
    setError(null)

    companyService.getProfile()
      .then(data => {
        setProfile(data)
        setFormData({
          company_name: data.company_name || '',
          industry: data.industry || '',
          location: data.location || ''
        })
        setLoading(false)
      })
      .catch(err => {
        setError(err.message)
        setLoading(false)
      })
  }

  useEffect(() => {
    fetchProfile()
  }, [])

  const handleUpdate = async () => {
    try {
      const updated = await companyService.updateProfile(formData)
      setProfile(updated)
      setEditing(false)
    } catch (err) {
      setError(err.message)
    }
  }

  if (loading) return <LoadingSpinner message="Loading profile..." />
  if (error) return <ErrorMessage error={error} onRetry={fetchProfile} />
  if (!profile) return <EmptyState title="No profile" message="Profile not found" />

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-slate-100/50 p-8">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-6">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
              <span className="text-2xl font-bold text-white">
                {profile.company_name ? profile.company_name[0].toUpperCase() : 'C'}
              </span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{profile.company_name || 'No name set'}</h1>
              <p className="text-gray-600">{profile.industry || 'No industry'} • {profile.location || 'No location'}</p>
              <p className="text-sm text-gray-500 mt-1">Status: {profile.status}</p>
            </div>
          </div>
          <button
            onClick={() => setEditing(!editing)}
            className="btn-primary"
          >
            {editing ? 'Cancel' : 'Edit Profile'}
          </button>
        </div>
      </div>

      {editing ? (
        <div className="bg-white rounded-xl shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-slate-100/50 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Edit Profile</h3>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Company Name</label>
                <input
                  type="text"
                  value={formData.company_name}
                  onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-600 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Industry</label>
                <input
                  type="text"
                  value={formData.industry}
                  onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-600 focus:border-transparent"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-600 focus:border-transparent"
              />
            </div>
            <div className="flex justify-end space-x-3">
              <button onClick={() => setEditing(false)} className="btn-secondary">Cancel</button>
              <button onClick={handleUpdate} className="btn-primary">Save Changes</button>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-slate-100/50 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Company Information</h3>
          <div className="space-y-2">
            <p className="text-gray-600"><span className="font-medium">Industry:</span> {profile.industry || 'Not set'}</p>
            <p className="text-gray-600"><span className="font-medium">Location:</span> {profile.location || 'Not set'}</p>
            <p className="text-gray-600"><span className="font-medium">Status:</span> {profile.status}</p>
          </div>
        </div>
      )}
    </div>
  )
}

// Discover Influencers Component
const DiscoverInfluencers = () => {
  const [influencers, setInfluencers] = useState([])
  const [campaigns, setCampaigns] = useState([])
  const [existingRequests, setExistingRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [filters, setFilters] = useState({
    category: '',
    verified_only: true,
    min_trust_score: 70
  })
  const [selectedCampaign, setSelectedCampaign] = useState(null)
  const [showCampaignModal, setShowCampaignModal] = useState(false)
  const [selectedInfluencer, setSelectedInfluencer] = useState(null)

  const fetchInfluencers = () => {
    setLoading(true)
    setError(null)

    const searchParams = {}
    if (filters.category) searchParams.category = filters.category
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

  const fetchCampaigns = () => {
    companyService.getCampaigns()
      .then(data => {
        setCampaigns(data.filter(c => c.status === 'active' || c.status === 'draft'))
      })
      .catch(err => {
        console.error('Failed to fetch campaigns:', err)
      })
  }

  const fetchExistingRequests = () => {
    companyService.getRequests()
      .then(data => {
        setExistingRequests(data)
      })
      .catch(err => {
        console.error('Failed to fetch requests:', err)
      })
  }

  useEffect(() => {
    fetchInfluencers()
    fetchCampaigns()
    fetchExistingRequests()
  }, [filters])

  const hasExistingRequest = (influencerId, campaignId) => {
    return existingRequests.some(
      req => req.influencer_id === influencerId && req.campaign_id === campaignId
    )
  }

  const getRequestStatus = (influencerId, campaignId) => {
    const request = existingRequests.find(
      req => req.influencer_id === influencerId && req.campaign_id === campaignId
    )
    return request ? request.status : null
  }

  const handleSendRequestClick = (influencer) => {
    if (campaigns.length === 0) {
      alert('Please create a campaign first before sending requests.')
      return
    }
    setSelectedInfluencer(influencer)
    setShowCampaignModal(true)
  }

  const handleSendRequest = async () => {
    if (!selectedCampaign) {
      alert('Please select a campaign')
      return
    }

    // Check if request already exists
    if (hasExistingRequest(selectedInfluencer.id, selectedCampaign)) {
      const status = getRequestStatus(selectedInfluencer.id, selectedCampaign)
      alert(`You already have a ${status} request for this influencer on this campaign.`)
      return
    }

    try {
      await companyService.createRequest(selectedCampaign, selectedInfluencer.id)
      alert('Request sent successfully!')
      setShowCampaignModal(false)
      setSelectedCampaign(null)
      setSelectedInfluencer(null)
      fetchExistingRequests() // Refresh requests
    } catch (err) {
      setError(err.message)
    }
  }

  if (loading) return <LoadingSpinner message="Searching influencers..." />
  if (error) return <ErrorMessage error={error} onRetry={fetchInfluencers} />

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Discover Influencers</h1>
        <p className="text-gray-600 mt-1">Find verified creators that match your brand</p>
      </div>

      <div className="bg-white rounded-xl shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-slate-100/50 p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
            <input
              type="text"
              value={filters.category}
              onChange={(e) => setFilters({ ...filters, category: e.target.value })}
              placeholder="e.g., Tech Reviews"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-600 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Min Trust Score</label>
            <input
              type="number"
              value={filters.min_trust_score}
              onChange={(e) => setFilters({ ...filters, min_trust_score: parseInt(e.target.value) })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-600 focus:border-transparent"
            />
          </div>
          <div className="flex items-end">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={filters.verified_only}
                onChange={(e) => setFilters({ ...filters, verified_only: e.target.checked })}
                className="rounded"
              />
              <span className="ml-2 text-sm text-gray-700">Verified only</span>
            </label>
          </div>
        </div>
      </div>

      {influencers.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-2 pb-6 px-2">
          {influencers.map((influencer, index) => {
            const shadowColors = [
              'shadow-[0_8px_24px_-4px_rgba(91,110,245,0.4)] hover:shadow-[0_16px_32px_-6px_rgba(91,110,245,0.5)]',
              'shadow-[0_8px_24px_-4px_rgba(23,163,152,0.4)] hover:shadow-[0_16px_32px_-6px_rgba(23,163,152,0.5)]',
              'shadow-[0_8px_24px_-4px_rgba(168,85,247,0.4)] hover:shadow-[0_16px_32px_-6px_rgba(168,85,247,0.5)]',
              'shadow-[0_8px_24px_-4px_rgba(244,63,110,0.4)] hover:shadow-[0_16px_32px_-6px_rgba(244,63,110,0.5)]',
              'shadow-[0_8px_24px_-4px_rgba(245,158,11,0.4)] hover:shadow-[0_16px_32px_-6px_rgba(245,158,11,0.5)]',
              'shadow-[0_8px_24px_-4px_rgba(14,165,233,0.4)] hover:shadow-[0_16px_32px_-6px_rgba(14,165,233,0.5)]'
            ];
            const activeShadow = shadowColors[index % shadowColors.length];

            return (
              <div key={influencer.id} className={`relative bg-white/90 backdrop-blur-sm rounded-2xl border border-slate-100/80 p-6 transition-all duration-300 hover:-translate-y-1.5 ${activeShadow}`}>
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-indigo-600 to-indigo-900 rounded-xl flex items-center justify-center">
                    <span className="text-white font-semibold">
                      {influencer.display_name ? influencer.display_name[0].toUpperCase() : 'U'}
                    </span>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 flex items-center">
                      {influencer.display_name || 'No name'}
                      {influencer.verification_status === 'verified' && (
                        <span className="ml-2 w-4 h-4 bg-teal-600 rounded-full flex items-center justify-center">
                          <span className="text-white text-xs">✓</span>
                        </span>
                      )}
                    </h3>
                    <p className="text-sm text-gray-600">{influencer.category || 'No category'}</p>
                  </div>
                </div>

                {influencer.bio && (
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">{influencer.bio}</p>
                )}

                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="text-center p-2 bg-gray-50 rounded-lg">
                    <div className="text-sm font-semibold text-gray-900">{influencer.trust_score}</div>
                    <div className="text-xs text-gray-500">Trust Score</div>
                  </div>
                  <div className="text-center p-2 bg-gray-50 rounded-lg">
                    <div className="text-sm font-semibold text-gray-900">{influencer.profile_completion}%</div>
                    <div className="text-xs text-gray-500">Complete</div>
                  </div>
                </div>

                <button
                  onClick={() => handleSendRequestClick(influencer)}
                  className="btn-primary w-full text-sm"
                >
                  Send Request
                </button>
              </div>
            )
          })}
        </div>
      ) : (
        <EmptyState
          icon="🔍"
          title="No influencers found"
          message="Try adjusting your filters to see more results."
        />
      )}

      {showCampaignModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-[20px_20px_50px_rgba(203,213,225,0.6)] max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Select Campaign</h3>
            <p className="text-sm text-gray-600 mb-4">
              Choose which campaign to send to {selectedInfluencer?.display_name}
            </p>
            <div className="space-y-2 mb-6 max-h-64 overflow-y-auto">
              {campaigns.map((campaign) => {
                const requestExists = hasExistingRequest(selectedInfluencer?.id, campaign.id)
                const requestStatus = getRequestStatus(selectedInfluencer?.id, campaign.id)

                return (
                  <label
                    key={campaign.id}
                    className={`flex items-center p-3 border-2 rounded-lg transition-all ${requestExists
                      ? 'border-gray-200 bg-gray-50 opacity-60 cursor-not-allowed'
                      : selectedCampaign === campaign.id
                        ? 'border-teal-600 bg-teal-50 cursor-pointer'
                        : 'border-gray-200 hover:border-gray-300 cursor-pointer'
                      }`}
                  >
                    <input
                      type="radio"
                      name="campaign"
                      value={campaign.id}
                      checked={selectedCampaign === campaign.id}
                      onChange={() => !requestExists && setSelectedCampaign(campaign.id)}
                      disabled={requestExists}
                      className="mr-3"
                    />
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">{campaign.name}</div>
                      <div className="text-xs text-gray-500">
                        {requestExists ? (
                          <span className="text-orange-600 font-medium">
                            Request {requestStatus} ✓
                          </span>
                        ) : (
                          campaign.status
                        )}
                      </div>
                    </div>
                  </label>
                )
              })}
            </div>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowCampaignModal(false)
                  setSelectedCampaign(null)
                  setSelectedInfluencer(null)
                }}
                className="btn-secondary"
              >
                Cancel
              </button>
              <button onClick={handleSendRequest} className="btn-primary">
                Send Request
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// Campaigns Component
const Campaigns = () => {
  const [campaigns, setCampaigns] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    platforms: [],
    budget_min: '',
    budget_max: ''
  })

  const fetchCampaigns = () => {
    setLoading(true)
    setError(null)

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

  const handleCreateCampaign = async () => {
    try {
      // Validate required fields
      if (!formData.name.trim()) {
        setError('Campaign name is required')
        return
      }
      if (formData.platforms.length === 0) {
        setError('Please select at least one platform')
        return
      }

      await companyService.createCampaign({
        ...formData,
        budget_min: formData.budget_min ? parseFloat(formData.budget_min) : null,
        budget_max: formData.budget_max ? parseFloat(formData.budget_max) : null
      })
      setShowCreateModal(false)
      setFormData({ name: '', description: '', category: '', platforms: [], budget_min: '', budget_max: '' })
      setError(null)
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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Campaigns</h1>
          <p className="text-gray-600 mt-1">Manage your collaboration campaigns</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="btn-primary"
        >
          Create Campaign
        </button>
      </div>

      {campaigns.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-2 pb-6 px-2">
          {campaigns.map((campaign, index) => {
            const shadowColors = [
              'shadow-[0_8px_24px_-4px_rgba(91,110,245,0.4)] hover:shadow-[0_16px_32px_-6px_rgba(91,110,245,0.5)]',
              'shadow-[0_8px_24px_-4px_rgba(23,163,152,0.4)] hover:shadow-[0_16px_32px_-6px_rgba(23,163,152,0.5)]',
              'shadow-[0_8px_24px_-4px_rgba(168,85,247,0.4)] hover:shadow-[0_16px_32px_-6px_rgba(168,85,247,0.5)]',
              'shadow-[0_8px_24px_-4px_rgba(244,63,110,0.4)] hover:shadow-[0_16px_32px_-6px_rgba(244,63,110,0.5)]',
              'shadow-[0_8px_24px_-4px_rgba(245,158,11,0.4)] hover:shadow-[0_16px_32px_-6px_rgba(245,158,11,0.5)]',
              'shadow-[0_8px_24px_-4px_rgba(14,165,233,0.4)] hover:shadow-[0_16px_32px_-6px_rgba(14,165,233,0.5)]'
            ];
            const activeShadow = shadowColors[index % shadowColors.length];

            return (
              <div key={campaign.id} className={`relative bg-white/90 backdrop-blur-sm rounded-2xl border border-slate-100/80 p-6 transition-all duration-300 hover:-translate-y-1.5 ${activeShadow}`}>
                <div className="absolute -top-3 -right-3">
                  <span className={`px-4 py-1.5 rounded-xl text-xs font-bold shadow-[0_8px_16px_rgba(0,0,0,0.12)] transform -translate-y-1 block ${campaign.status === 'active' ? 'bg-gradient-to-br from-emerald-400 to-emerald-500 text-white shadow-[0_8px_16px_rgba(16,185,129,0.4)]' :
                    campaign.status === 'draft' ? 'bg-slate-100 text-slate-700 shadow-[0_8px_16px_rgba(148,163,184,0.4)]' :
                      'bg-gradient-to-br from-amber-400 to-amber-500 text-white shadow-[0_8px_16px_rgba(245,158,11,0.4)]'
                    }`}>
                    {campaign.status}
                  </span>
                </div>

                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{campaign.name}</h3>
                    <p className="text-sm text-gray-600 mt-1">{campaign.description}</p>
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Platforms:</span> {campaign.platforms.map(p => p === 'LinkedIn' || p === 'TikTok' ? 'Facebook' : p).join(', ')}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Budget:</span> ₹{campaign.budget_min} - ₹{campaign.budget_max}
                  </p>
                </div>

                {campaign.status === 'draft' && (
                  <button
                    onClick={() => handleDeleteCampaign(campaign.id)}
                    className="btn-secondary w-full text-sm"
                  >
                    Delete
                  </button>
                )}
              </div>
            )
          })}
        </div>
      ) : (
        <EmptyState
          icon="📋"
          title="No campaigns yet"
          message="Create your first campaign to start collaborating with influencers."
          action={{
            label: 'Create Campaign',
            onClick: () => setShowCreateModal(true)
          }}
        />
      )}

      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-[20px_20px_50px_rgba(203,213,225,0.6)] max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Create Campaign</h3>
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Campaign Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-600 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-600 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Platforms</label>
                <div className="space-y-2">
                  {['Instagram', 'YouTube', 'LinkedIn'].map(platform => (
                    <label key={platform} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.platforms.includes(platform)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setFormData({ ...formData, platforms: [...formData.platforms, platform] })
                          } else {
                            setFormData({ ...formData, platforms: formData.platforms.filter(p => p !== platform) })
                          }
                        }}
                        className="mr-2 h-4 w-4 text-teal-600 focus:ring-teal-600 border-gray-300 rounded"
                      />
                      <span className="text-sm text-gray-700">{platform === 'LinkedIn' ? 'Facebook' : platform}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                  <input
                    type="text"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    placeholder="e.g., Fashion, Tech, Beauty"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-600 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Min Budget</label>
                  <input
                    type="number"
                    value={formData.budget_min}
                    onChange={(e) => setFormData({ ...formData, budget_min: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-600 focus:border-transparent"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Max Budget</label>
                  <input
                    type="number"
                    value={formData.budget_max}
                    onChange={(e) => setFormData({ ...formData, budget_max: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-600 focus:border-transparent"
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-3">
                <button onClick={() => setShowCreateModal(false)} className="btn-secondary">Cancel</button>
                <button onClick={handleCreateCampaign} className="btn-primary">Create</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// Requests Component
const Requests = () => {
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchRequests = () => {
    setLoading(true)
    setError(null)

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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Collaboration Requests</h1>
        <p className="text-gray-600 mt-1">Track your sent requests</p>
      </div>

      {requests.length > 0 ? (
        <div className="space-y-4">
          {requests.map((request) => (
            <div key={request.id} className="relative bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-slate-100/50 p-6 hover:shadow-[0_20px_40px_rgba(203,213,225,0.4)] hover:-translate-y-1 transition-all duration-300">

              {/* Floating Top-Right Status Badge */}
              <div className="absolute -top-3 -right-3">
                <span className={`px-4 py-1.5 rounded-xl text-xs font-bold shadow-[0_8px_16px_rgba(0,0,0,0.12)] transform -translate-y-1 block ${request.status === 'pending' ? 'bg-gradient-to-br from-amber-400 to-amber-500 text-white shadow-[0_8px_16px_rgba(245,158,11,0.4)]' :
                  request.status === 'accepted' ? 'bg-gradient-to-br from-emerald-400 to-emerald-500 text-white shadow-[0_8px_16px_rgba(16,185,129,0.4)]' :
                    'bg-gradient-to-br from-rose-400 to-rose-500 text-white shadow-[0_8px_16px_rgba(244,63,110,0.4)]'
                  }`}>
                  {request.status}
                </span>
              </div>

              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Request #{request.id}</h3>
                  <p className="text-sm text-gray-600">Campaign ID: {request.campaign_id}</p>
                  <p className="text-sm text-gray-600">Influencer ID: {request.influencer_id}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    Created: {new Date(request.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          icon="📤"
          title="No requests sent"
          message="You haven't sent any collaboration requests yet."
        />
      )}
    </div>
  )
}

// Brand Collaborations Component
const BrandCollaborations = () => {
  const [collaborations, setCollaborations] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedCollab, setSelectedCollab] = useState(null)
  const [showDeliverables, setShowDeliverables] = useState(false)
  const [showApprove, setShowApprove] = useState(false)
  const [showComplete, setShowComplete] = useState(false)

  const fetchCollaborations = () => {
    setLoading(true)
    setError(null)

    collaborationService.getCollaborations()
      .then(data => {
        setCollaborations(data)
        setLoading(false)
      })
      .catch(err => {
        setError(err.message)
        setLoading(false)
      })
  }

  useEffect(() => {
    fetchCollaborations()
  }, [])

  const getStatusColor = (status) => {
    const colors = {
      'ACTIVE': 'bg-blue-100 text-blue-800',
      'DELIVERABLES_SET': 'bg-purple-100 text-purple-800',
      'CONTENT_SUBMITTED': 'bg-yellow-100 text-yellow-800',
      'CONTENT_APPROVED': 'bg-green-100 text-green-800',
      'COMPLETED': 'bg-gray-100 text-gray-800',
      'CANCELLED': 'bg-red-100 text-red-800'
    }
    return colors[status] || 'bg-gray-100 text-gray-800'
  }

  const getStatusLabel = (status) => {
    const labels = {
      'ACTIVE': 'Active',
      'DELIVERABLES_SET': 'Deliverables Set',
      'CONTENT_SUBMITTED': 'Content Submitted',
      'CONTENT_APPROVED': 'Content Approved',
      'COMPLETED': 'Completed',
      'CANCELLED': 'Cancelled'
    }
    return labels[status] || status
  }

  if (loading) return <LoadingSpinner message="Loading collaborations..." />
  if (error) return <ErrorMessage error={error} onRetry={fetchCollaborations} />

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Active Collaborations</h1>
        <p className="text-gray-600 mt-1">Manage your ongoing collaborations</p>
      </div>

      {collaborations.length > 0 ? (
        <div className="grid grid-cols-1 gap-6">
          {collaborations.map((collab) => (
            <div key={collab.id} className="relative bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-slate-100/50 p-6 hover:shadow-[0_20px_40px_rgba(203,213,225,0.4)] hover:-translate-y-1 transition-all duration-300">

              {/* Floating Top-Right Status Badge */}
              <div className="absolute -top-3 -right-3">
                <span className={`px-4 py-1.5 rounded-xl text-xs font-bold shadow-[0_8px_16px_rgba(0,0,0,0.12)] transform -translate-y-1 block ${collab.status === 'ACTIVE' || collab.status === 'CONTENT_APPROVED' || collab.status === 'COMPLETED'
                  ? 'bg-gradient-to-br from-emerald-400 to-emerald-500 text-white shadow-[0_8px_16px_rgba(16,185,129,0.4)]'
                  : collab.status === 'CANCELLED'
                    ? 'bg-gradient-to-br from-rose-400 to-rose-500 text-white shadow-[0_8px_16px_rgba(244,63,110,0.4)]'
                    : 'bg-gradient-to-br from-indigo-400 to-indigo-500 text-white shadow-[0_8px_16px_rgba(99,102,241,0.4)]'
                  }`}>
                  {getStatusLabel(collab.status)}
                </span>
              </div>

              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                      Collaboration
                      <span className="text-sm font-semibold text-teal-700 bg-teal-50 px-2.5 py-0.5 rounded-lg border border-teal-100/50">
                        {collab.id}
                      </span>
                    </h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${collab.payment_status === 'RELEASED' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                      Payment: {collab.payment_status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">Campaign ID: {collab.campaign_id}</p>
                  <p className="text-sm text-gray-600">Influencer ID: {collab.influencer_id}</p>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mb-4">
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                  <span>Progress</span>
                  <span className="font-semibold">{collab.progress_percentage}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-teal-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${collab.progress_percentage}%` }}
                  ></div>
                </div>
              </div>

              {/* Deliverables */}
              {collab.deliverables && Object.keys(collab.deliverables).length > 0 && (
                <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">Deliverables</h4>
                  <p className="text-sm text-gray-600">{collab.deliverables.description}</p>
                  {collab.deliverables.requirements && (
                    <ul className="mt-2 space-y-1">
                      {collab.deliverables.requirements.map((req, idx) => (
                        <li key={idx} className="text-sm text-gray-600">• {req}</li>
                      ))}
                    </ul>
                  )}
                  {collab.deadline && (
                    <p className="text-xs text-gray-500 mt-2">
                      Deadline: {new Date(collab.deadline).toLocaleDateString()}
                    </p>
                  )}
                </div>
              )}

              {/* Content Links */}
              {collab.content_links && collab.content_links.length > 0 && (
                <div className="mb-4 p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">Submitted Content</h4>
                  <div className="space-y-2">
                    {collab.content_links.map((content, idx) => (
                      <div key={idx} className="flex items-center justify-between">
                        <div>
                          <a href={content.url} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline">
                            {content.platform} - {content.description || 'View Content'}
                          </a>
                          {content.submitted_at && (
                            <p className="text-xs text-gray-500">
                              Submitted: {new Date(content.submitted_at).toLocaleDateString()}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex space-x-3">
                {collab.status === 'ACTIVE' && (
                  <button
                    onClick={() => {
                      setSelectedCollab(collab)
                      setShowDeliverables(true)
                    }}
                    className="btn-primary text-sm"
                  >
                    Set Deliverables
                  </button>
                )}
                {collab.status === 'CONTENT_SUBMITTED' && (
                  <button
                    onClick={() => {
                      setSelectedCollab(collab)
                      setShowApprove(true)
                    }}
                    className="btn-primary text-sm"
                  >
                    Approve Content
                  </button>
                )}
                {collab.status === 'CONTENT_APPROVED' && (
                  <button
                    onClick={() => {
                      setSelectedCollab(collab)
                      setShowComplete(true)
                    }}
                    className="btn-primary text-sm"
                  >
                    Complete & Release Payment
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          icon="🤝"
          title="No active collaborations"
          message="You don't have any active collaborations yet."
        />
      )}

      {/* Set Deliverables Modal */}
      {showDeliverables && selectedCollab && (
        <DeliverableModal
          collaboration={selectedCollab}
          onClose={() => {
            setShowDeliverables(false)
            setSelectedCollab(null)
          }}
          onSuccess={() => {
            setShowDeliverables(false)
            setSelectedCollab(null)
            fetchCollaborations()
          }}
        />
      )}

      {/* Approve Content Modal */}
      {showApprove && selectedCollab && (
        <ApproveModal
          collaboration={selectedCollab}
          onClose={() => {
            setShowApprove(false)
            setSelectedCollab(null)
          }}
          onSuccess={() => {
            setShowApprove(false)
            setSelectedCollab(null)
            fetchCollaborations()
          }}
        />
      )}

      {/* Complete Collaboration Modal */}
      {showComplete && selectedCollab && (
        <CompleteModal
          collaboration={selectedCollab}
          onClose={() => {
            setShowComplete(false)
            setSelectedCollab(null)
          }}
          onSuccess={() => {
            setShowComplete(false)
            setSelectedCollab(null)
            fetchCollaborations()
          }}
        />
      )}
    </div>
  )
}

// Deliverable Modal Component
const DeliverableModal = ({ collaboration, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    description: '',
    requirements: [''],
    deadline: ''
  })
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)

  const handleAddRequirement = () => {
    setFormData({
      ...formData,
      requirements: [...formData.requirements, '']
    })
  }

  const handleRequirementChange = (index, value) => {
    const newRequirements = [...formData.requirements]
    newRequirements[index] = value
    setFormData({ ...formData, requirements: newRequirements })
  }

  const handleRemoveRequirement = (index) => {
    const newRequirements = formData.requirements.filter((_, i) => i !== index)
    setFormData({ ...formData, requirements: newRequirements })
  }

  const handleSubmit = async () => {
    if (!formData.description || !formData.deadline) {
      setError('Description and deadline are required')
      return
    }

    const validRequirements = formData.requirements.filter(r => r.trim())
    if (validRequirements.length === 0) {
      setError('At least one requirement is needed')
      return
    }

    setSubmitting(true)
    setError(null)

    try {
      await collaborationService.setDeliverables(collaboration.id, {
        description: formData.description,
        requirements: validRequirements,
        deadline: new Date(formData.deadline).toISOString()
      })
      onSuccess()
    } catch (err) {
      setError(err.response?.data?.detail || err.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-[20px_20px_50px_rgba(203,213,225,0.6)] max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Set Deliverables</h3>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe what the influencer needs to deliver..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-600 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Requirements</label>
            {formData.requirements.map((req, index) => (
              <div key={index} className="flex space-x-2 mb-2">
                <input
                  type="text"
                  value={req}
                  onChange={(e) => handleRequirementChange(index, e.target.value)}
                  placeholder={`Requirement ${index + 1}`}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-600 focus:border-transparent"
                />
                {formData.requirements.length > 1 && (
                  <button
                    onClick={() => handleRemoveRequirement(index)}
                    className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg"
                  >
                    ×
                  </button>
                )}
              </div>
            ))}
            <button
              onClick={handleAddRequirement}
              className="text-sm text-teal-600 hover:text-teal-700 font-medium"
            >
              + Add Requirement
            </button>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Deadline</label>
            <input
              type="datetime-local"
              value={formData.deadline}
              onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-600 focus:border-transparent"
            />
          </div>
        </div>

        <div className="flex justify-end space-x-3 mt-6">
          <button onClick={onClose} className="btn-secondary">Cancel</button>
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="btn-primary"
          >
            {submitting ? 'Setting...' : 'Set Deliverables'}
          </button>
        </div>
      </div>
    </div>
  )
}

// Approve Modal Component
const ApproveModal = ({ collaboration, onClose, onSuccess }) => {
  const [feedback, setFeedback] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)

  const handleSubmit = async () => {
    setSubmitting(true)
    setError(null)

    try {
      await collaborationService.approveContent(collaboration.id, { feedback })
      onSuccess()
    } catch (err) {
      setError(err.response?.data?.detail || err.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-[20px_20px_50px_rgba(203,213,225,0.6)] max-w-md w-full p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Approve Content</h3>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Feedback (Optional)</label>
            <textarea
              rows={4}
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Share your thoughts on the submitted content..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-600 focus:border-transparent"
            />
          </div>
        </div>

        <div className="flex justify-end space-x-3 mt-6">
          <button onClick={onClose} className="btn-secondary">Cancel</button>
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="btn-primary"
          >
            {submitting ? 'Approving...' : 'Approve Content'}
          </button>
        </div>
      </div>
    </div>
  )
}

// Complete Modal Component
const CompleteModal = ({ collaboration, onClose, onSuccess }) => {
  const [finalNotes, setFinalNotes] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)

  const handleSubmit = async () => {
    setSubmitting(true)
    setError(null)

    try {
      await collaborationService.completeCollaboration(collaboration.id, { final_notes: finalNotes })
      onSuccess()
    } catch (err) {
      setError(err.response?.data?.detail || err.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-[20px_20px_50px_rgba(203,213,225,0.6)] max-w-md w-full p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Complete Collaboration</h3>

        <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm text-yellow-800">
            This will mark the collaboration as complete and release the payment to the influencer.
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Final Notes (Optional)</label>
            <textarea
              rows={4}
              value={finalNotes}
              onChange={(e) => setFinalNotes(e.target.value)}
              placeholder="Any final thoughts or feedback..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-600 focus:border-transparent"
            />
          </div>
        </div>

        <div className="flex justify-end space-x-3 mt-6">
          <button onClick={onClose} className="btn-secondary">Cancel</button>
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50"
          >
            {submitting ? 'Completing...' : 'Complete & Release Payment'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default CompanyDashboard
