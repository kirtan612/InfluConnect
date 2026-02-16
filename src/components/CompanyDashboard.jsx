import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Logo from './Logo'
import Notifications from './Notifications'
import LoadingSpinner from './LoadingSpinner'
import ErrorMessage from './ErrorMessage'
import EmptyState from './EmptyState'
import companyService from '../services/companyService'
import collaborationService from '../services/collaborationService'

const CompanyDashboard = () => {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('profile')
  const [showUserMenu, setShowUserMenu] = useState(false)
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
    { id: 'profile', name: 'Company Profile', icon: '🏢' },
    { id: 'discover', name: 'Discover', icon: '🔍' },
    { id: 'campaigns', name: 'Campaigns', icon: '📋' },
    { id: 'collaborations', name: 'Collaborations', icon: '🤝' },
    { id: 'requests', name: 'Requests', icon: '📤' }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Logo size="md" />
              </div>
            </div>

            <div className="hidden md:flex items-center space-x-1">
              {navigation.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 flex items-center space-x-2 hover:scale-105 ${activeTab === item.id
                      ? 'text-brand-teal bg-teal-50 shadow-md transform scale-105'
                      : 'text-gray-600 hover:text-brand-navy hover:bg-gray-50'
                    }`}
                >
                  <span className="transition-transform duration-300 hover:scale-110">{item.icon}</span>
                  <span>{item.name}</span>
                </button>
              ))}
            </div>

            <div className="flex items-center space-x-3">
              <Notifications />

              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="w-9 h-9 bg-gradient-to-br from-brand-indigo to-brand-navy rounded-lg flex items-center justify-center">
                    <span className="text-white text-sm font-semibold">{user.email[0].toUpperCase()}</span>
                  </div>
                  <div className="hidden md:block text-left">
                    <div className="text-sm font-medium text-gray-900">{user.email}</div>
                    <div className="text-xs text-gray-500">{user.role}</div>
                  </div>
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <div className="text-sm font-medium text-gray-900">{user.email}</div>
                      <div className="text-xs text-gray-500">{user.role}</div>
                    </div>
                    <button onClick={handleLogout} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Sign out</button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="md:hidden border-t border-gray-200">
          <div className="px-4 py-2 flex space-x-1 overflow-x-auto">
            {navigation.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap flex items-center space-x-1 ${activeTab === item.id
                    ? 'text-brand-teal bg-teal-50'
                    : 'text-gray-600'
                  }`}
              >
                <span>{item.icon}</span>
                <span>{item.name}</span>
              </button>
            ))}
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'profile' && <CompanyProfile />}
        {activeTab === 'discover' && <DiscoverInfluencers />}
        {activeTab === 'campaigns' && <Campaigns />}
        {activeTab === 'collaborations' && <BrandCollaborations />}
        {activeTab === 'requests' && <Requests />}
      </main>
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
      <div className="bg-white rounded-xl shadow-sm p-8">
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
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Edit Profile</h3>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Company Name</label>
                <input
                  type="text"
                  value={formData.company_name}
                  onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-teal focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Industry</label>
                <input
                  type="text"
                  value={formData.industry}
                  onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-teal focus:border-transparent"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-teal focus:border-transparent"
              />
            </div>
            <div className="flex justify-end space-x-3">
              <button onClick={() => setEditing(false)} className="btn-secondary">Cancel</button>
              <button onClick={handleUpdate} className="btn-primary">Save Changes</button>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm p-6">
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

      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
            <input
              type="text"
              value={filters.category}
              onChange={(e) => setFilters({ ...filters, category: e.target.value })}
              placeholder="e.g., Tech Reviews"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-teal focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Min Trust Score</label>
            <input
              type="number"
              value={filters.min_trust_score}
              onChange={(e) => setFilters({ ...filters, min_trust_score: parseInt(e.target.value) })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-teal focus:border-transparent"
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {influencers.map((influencer) => (
            <div key={influencer.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-brand-indigo to-brand-navy rounded-xl flex items-center justify-center">
                  <span className="text-white font-semibold">
                    {influencer.display_name ? influencer.display_name[0].toUpperCase() : 'U'}
                  </span>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 flex items-center">
                    {influencer.display_name || 'No name'}
                    {influencer.verification_status === 'verified' && (
                      <span className="ml-2 w-4 h-4 bg-brand-teal rounded-full flex items-center justify-center">
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
          ))}
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
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
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
                    className={`flex items-center p-3 border-2 rounded-lg transition-all ${
                      requestExists
                        ? 'border-gray-200 bg-gray-50 opacity-60 cursor-not-allowed'
                        : selectedCampaign === campaign.id
                        ? 'border-brand-teal bg-teal-50 cursor-pointer'
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {campaigns.map((campaign) => (
            <div key={campaign.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{campaign.name}</h3>
                  <p className="text-sm text-gray-600 mt-1">{campaign.description}</p>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${campaign.status === 'active' ? 'bg-green-100 text-green-800' :
                    campaign.status === 'draft' ? 'bg-gray-100 text-gray-800' :
                      'bg-yellow-100 text-yellow-800'
                  }`}>
                  {campaign.status}
                </span>
              </div>

              <div className="space-y-2 mb-4">
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Platforms:</span> {campaign.platforms.join(', ')}
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Budget:</span> ${campaign.budget_min} - ${campaign.budget_max}
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
          ))}
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
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-teal focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-teal focus:border-transparent"
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
                        className="mr-2 h-4 w-4 text-brand-teal focus:ring-brand-teal border-gray-300 rounded"
                      />
                      <span className="text-sm text-gray-700">{platform}</span>
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-teal focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Min Budget</label>
                  <input
                    type="number"
                    value={formData.budget_min}
                    onChange={(e) => setFormData({ ...formData, budget_min: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-teal focus:border-transparent"
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-teal focus:border-transparent"
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
            <div key={request.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Request #{request.id}</h3>
                  <p className="text-sm text-gray-600">Campaign ID: {request.campaign_id}</p>
                  <p className="text-sm text-gray-600">Influencer ID: {request.influencer_id}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    Created: {new Date(request.created_at).toLocaleDateString()}
                  </p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${request.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    request.status === 'accepted' ? 'bg-green-100 text-green-800' :
                      'bg-red-100 text-red-800'
                  }`}>
                  {request.status}
                </span>
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
            <div key={collab.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">Collaboration #{collab.id}</h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(collab.status)}`}>
                      {getStatusLabel(collab.status)}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${collab.payment_status === 'RELEASED' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
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
                    className="bg-brand-teal h-2 rounded-full transition-all duration-300"
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
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
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
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-teal focus:border-transparent"
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
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-teal focus:border-transparent"
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
              className="text-sm text-brand-teal hover:text-teal-700 font-medium"
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
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-teal focus:border-transparent"
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
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
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
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-teal focus:border-transparent"
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
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
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
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-teal focus:border-transparent"
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
