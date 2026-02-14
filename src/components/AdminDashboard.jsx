import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Logo from './Logo'
import Notifications from './Notifications'
import adminService from '../services/adminService'

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview')
  const [showUserMenu, setShowUserMenu] = useState(false)
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-center">
          <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p>Verifying admin access...</p>
        </div>
      </div>
    )
  }

  const navigation = [
    { id: 'overview', name: 'Overview', icon: '📊' },
    { id: 'influencers', name: 'Influencers', icon: '👤' },
    { id: 'brands', name: 'Brands', icon: '🏢' },
    { id: 'campaigns', name: 'Campaigns', icon: '📢' },
    { id: 'verification', name: 'Verification Requests', icon: '✅' },
    { id: 'reports', name: 'Reports & Moderation', icon: '🚨' },
    { id: 'settings', name: 'Platform Settings', icon: '⚙️' }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center flex-shrink-0 min-w-0">
              <Logo size="md" />
              <div className="ml-2 flex items-center space-x-2">
                <div className="w-px h-6 bg-gray-300"></div>
                <span className="text-xs font-bold text-gray-800 tracking-wide whitespace-nowrap">
                  ADMIN CONTROL CENTER
                </span>
              </div>
            </div>

            <div className="hidden lg:flex items-center space-x-1 flex-1 px-8">
              {navigation.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`px-2 py-1.5 rounded-md text-xs font-medium transition-all duration-300 flex items-center space-x-1 hover:scale-105 transform ${activeTab === item.id
                      ? 'text-brand-navy bg-gradient-to-r from-brand-navy/10 to-brand-teal/10 shadow-md border border-brand-navy/20 scale-105'
                      : 'text-gray-600 hover:text-brand-navy hover:bg-gray-50 hover:shadow-sm'
                    }`}
                >
                  <span className="text-sm transition-transform duration-300 hover:scale-110">{item.icon}</span>
                  <span className="hidden xl:inline text-xs font-semibold">{item.name}</span>
                </button>
              ))}
            </div>

            <div className="flex items-center space-x-3 flex-shrink-0">
              <Notifications />

              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-50 transition-all duration-300 border border-gray-200 hover:border-gray-300 hover:shadow-md"
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-red-600 via-red-700 to-red-800 rounded-lg flex items-center justify-center shadow-lg">
                    <span className="text-white text-sm font-bold">A</span>
                  </div>
                  <div className="hidden md:block text-left">
                    <div className="text-xs font-bold text-gray-900">{user.email}</div>
                    <div className="text-xs text-red-600 font-semibold flex items-center space-x-1">
                      <div className="w-1 h-1 bg-red-500 rounded-full"></div>
                      <span>Admin</span>
                    </div>
                  </div>
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50">
                    <div className="px-4 py-3 border-b border-gray-100 bg-red-50">
                      <div className="text-xs font-bold text-red-800 uppercase tracking-wide">ADMIN PANEL</div>
                      <div className="text-xs text-red-600">System Administrator Access</div>
                    </div>
                    <div className="border-t border-gray-100 mt-2 pt-2">
                      <button onClick={handleLogout} className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 font-medium">Logout & Exit</button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="lg:hidden border-t border-gray-100 bg-gray-50">
          <div className="px-4 py-3 flex space-x-2 overflow-x-auto">
            {navigation.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`px-3 py-2 rounded-md text-xs font-medium whitespace-nowrap flex items-center space-x-1 ${activeTab === item.id
                    ? 'text-brand-navy bg-brand-navy/10 border border-brand-navy/20'
                    : 'text-gray-600 hover:bg-white'
                  }`}
              >
                <span className="text-sm">{item.icon}</span>
                <span>{item.name}</span>
              </button>
            ))}
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'overview' && <Overview />}
        {activeTab === 'influencers' && <Influencers />}
        {activeTab === 'brands' && <Brands />}
        {activeTab === 'campaigns' && <Campaigns />}
        {activeTab === 'verification' && <VerificationRequests />}
        {activeTab === 'reports' && <ReportsModeration />}
        {activeTab === 'settings' && <PlatformSettings />}
      </main>
    </div>
  )
}

// ============================================================================
// Overview
// ============================================================================
const Overview = () => {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    adminService.getStats()
      .then(data => {
        setStats(data)
        setLoading(false)
      })
      .catch(err => {
        setError(err.message)
        setLoading(false)
      })
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-brand-navy border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading statistics...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-600">Error loading stats: {error}</p>
      </div>
    )
  }

  if (!stats) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <p className="text-gray-600">No statistics available</p>
      </div>
    )
  }

  const kpis = [
    { label: 'Total Influencers', value: stats.total_influencers || 0, icon: '👤', color: 'from-blue-500 to-blue-600' },
    { label: 'Verified Influencers', value: stats.verified_influencers || 0, icon: '✅', color: 'from-green-500 to-green-600' },
    { label: 'Pending Verifications', value: stats.pending_verifications || 0, icon: '⏳', color: 'from-yellow-500 to-yellow-600' },
    { label: 'Active Brands', value: stats.active_brands || 0, icon: '🏢', color: 'from-purple-500 to-purple-600' },
    { label: 'Live Campaigns', value: stats.live_campaigns || 0, icon: '📢', color: 'from-indigo-500 to-indigo-600' },
    { label: 'Reported Issues', value: stats.reported_issues || 0, icon: '🚨', color: 'from-red-500 to-red-600' }
  ]

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Platform Overview</h1>
          <p className="text-gray-600 mt-2">System health and trust metrics</p>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          <span>System Online</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {kpis.map((kpi, index) => (
          <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">{kpi.label}</p>
                <p className="text-3xl font-bold text-gray-900">{kpi.value}</p>
              </div>
              <div className={`w-12 h-12 bg-gradient-to-br ${kpi.color} rounded-xl flex items-center justify-center text-xl`}>
                {kpi.icon}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ============================================================================
// Influencers Management
// ============================================================================
const Influencers = () => {
  const [influencers, setInfluencers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [actionLoading, setActionLoading] = useState(null)

  const fetchInfluencers = () => {
    setLoading(true)
    setError(null)
    adminService.getInfluencers({ include_suspended: true })
      .then(data => { setInfluencers(data); setLoading(false) })
      .catch(err => { setError(err.message); setLoading(false) })
  }

  useEffect(() => { fetchInfluencers() }, [])

  const handleVerify = async (userId) => {
    setActionLoading(userId)
    try {
      await adminService.verifyInfluencer(userId, 'verified', 'Approved by admin')
      fetchInfluencers()
    } catch (err) { setError(err.message) }
    finally { setActionLoading(null) }
  }

  const handleSuspend = async (userId, isSuspended) => {
    setActionLoading(userId)
    try {
      await adminService.suspendUser(userId, !isSuspended, isSuspended ? 'Unsuspended by admin' : 'Suspended by admin')
      fetchInfluencers()
    } catch (err) { setError(err.message) }
    finally { setActionLoading(null) }
  }

  if (loading) return <div className="flex justify-center py-12"><div className="w-8 h-8 border-2 border-brand-navy border-t-transparent rounded-full animate-spin"></div></div>
  if (error) return <div className="bg-red-50 border border-red-200 rounded-lg p-4"><p className="text-red-600">{error}</p><button onClick={fetchInfluencers} className="mt-2 text-sm text-red-700 underline">Retry</button></div>

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Influencer Management</h1>
          <p className="text-gray-600 mt-1">{influencers.length} influencers registered</p>
        </div>
        <button onClick={fetchInfluencers} className="btn-secondary text-sm">Refresh</button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Trust Score</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Profile %</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {influencers.map(inf => (
                <tr key={inf.id} className={`hover:bg-gray-50 ${inf.is_suspended ? 'opacity-60' : ''}`}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-gradient-to-br from-brand-indigo to-brand-navy rounded-lg flex items-center justify-center mr-3">
                        <span className="text-white text-xs font-semibold">{(inf.display_name || 'U')[0].toUpperCase()}</span>
                      </div>
                      <span className="text-sm font-medium text-gray-900">{inf.display_name || 'No name'}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{inf.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-semibold text-gray-900">{inf.trust_score}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${inf.verification_status === 'verified' ? 'bg-green-100 text-green-800' :
                        inf.verification_status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          inf.verification_status === 'rejected' ? 'bg-red-100 text-red-800' :
                            'bg-gray-100 text-gray-800'
                      }`}>
                      {inf.verification_status}
                    </span>
                    {inf.is_suspended && <span className="ml-1 px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">Suspended</span>}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{inf.profile_completion}%</td>
                  <td className="px-6 py-4 whitespace-nowrap space-x-2">
                    {inf.verification_status !== 'verified' && (
                      <button
                        onClick={() => handleVerify(inf.user_id)}
                        disabled={actionLoading === inf.user_id}
                        className="px-3 py-1 text-xs font-medium text-white bg-green-600 hover:bg-green-700 rounded-lg disabled:opacity-50"
                      >
                        {actionLoading === inf.user_id ? '...' : 'Verify'}
                      </button>
                    )}
                    <button
                      onClick={() => handleSuspend(inf.user_id, inf.is_suspended)}
                      disabled={actionLoading === inf.user_id}
                      className={`px-3 py-1 text-xs font-medium rounded-lg disabled:opacity-50 ${inf.is_suspended
                          ? 'text-white bg-blue-600 hover:bg-blue-700'
                          : 'text-white bg-red-600 hover:bg-red-700'
                        }`}
                    >
                      {actionLoading === inf.user_id ? '...' : (inf.is_suspended ? 'Unsuspend' : 'Suspend')}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {influencers.length === 0 && (
          <div className="text-center py-8 text-gray-500">No influencers found</div>
        )}
      </div>
    </div>
  )
}

// ============================================================================
// Brands Management
// ============================================================================
const Brands = () => {
  const [brands, setBrands] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    adminService.getBrands()
      .then(data => { setBrands(data); setLoading(false) })
      .catch(err => { setError(err.message); setLoading(false) })
  }, [])

  if (loading) return <div className="flex justify-center py-12"><div className="w-8 h-8 border-2 border-brand-navy border-t-transparent rounded-full animate-spin"></div></div>
  if (error) return <div className="bg-red-50 border border-red-200 rounded-lg p-4"><p className="text-red-600">{error}</p></div>

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Brand Management</h1>
        <p className="text-gray-600 mt-1">{brands.length} brands registered</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Company</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Industry</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Location</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Campaigns</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {brands.map(brand => (
                <tr key={brand.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mr-3">
                        <span className="text-white text-xs font-semibold">{(brand.company_name || 'C')[0].toUpperCase()}</span>
                      </div>
                      <span className="text-sm font-medium text-gray-900">{brand.company_name || 'No name'}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{brand.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{brand.industry || '—'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{brand.location || '—'}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 bg-indigo-100 text-indigo-800 rounded-full text-xs font-medium">{brand.campaign_count}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${brand.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>{brand.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {brands.length === 0 && (
          <div className="text-center py-8 text-gray-500">No brands found</div>
        )}
      </div>
    </div>
  )
}

// ============================================================================
// Campaigns
// ============================================================================
const Campaigns = () => {
  const [campaigns, setCampaigns] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    adminService.getCampaigns()
      .then(data => { setCampaigns(data); setLoading(false) })
      .catch(err => { setError(err.message); setLoading(false) })
  }, [])

  if (loading) return <div className="flex justify-center py-12"><div className="w-8 h-8 border-2 border-brand-navy border-t-transparent rounded-full animate-spin"></div></div>
  if (error) return <div className="bg-red-50 border border-red-200 rounded-lg p-4"><p className="text-red-600">{error}</p></div>

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Campaign Oversight</h1>
        <p className="text-gray-600 mt-1">{campaigns.length} campaigns across all brands</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Campaign</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Brand</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Platforms</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Budget</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {campaigns.map(c => (
                <tr key={c.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{c.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{c.brand_name || '—'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{c.category || '—'}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${c.status === 'active' ? 'bg-green-100 text-green-800' :
                        c.status === 'draft' ? 'bg-gray-100 text-gray-800' :
                          c.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                            'bg-yellow-100 text-yellow-800'
                      }`}>{c.status}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{(c.platforms || []).join(', ') || '—'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {c.budget_min && c.budget_max ? `$${c.budget_min} - $${c.budget_max}` : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {campaigns.length === 0 && (
          <div className="text-center py-8 text-gray-500">No campaigns found</div>
        )}
      </div>
    </div>
  )
}

// ============================================================================
// Verification Requests
// ============================================================================
const VerificationRequests = () => {
  const [verifications, setVerifications] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [actionLoading, setActionLoading] = useState(null)

  const fetchVerifications = () => {
    setLoading(true)
    setError(null)
    adminService.getVerifications()
      .then(data => { setVerifications(data); setLoading(false) })
      .catch(err => { setError(err.message); setLoading(false) })
  }

  useEffect(() => { fetchVerifications() }, [])

  const handleApprove = async (id) => {
    setActionLoading(id)
    try {
      await adminService.approveVerification(id, 'Approved by admin')
      fetchVerifications()
    } catch (err) { setError(err.message) }
    finally { setActionLoading(null) }
  }

  const handleReject = async (id) => {
    const reason = prompt('Reason for rejection:')
    if (reason === null) return
    setActionLoading(id)
    try {
      await adminService.rejectVerification(id, reason || 'Rejected by admin')
      fetchVerifications()
    } catch (err) { setError(err.message) }
    finally { setActionLoading(null) }
  }

  if (loading) return <div className="flex justify-center py-12"><div className="w-8 h-8 border-2 border-brand-navy border-t-transparent rounded-full animate-spin"></div></div>
  if (error) return <div className="bg-red-50 border border-red-200 rounded-lg p-4"><p className="text-red-600">{error}</p><button onClick={fetchVerifications} className="mt-2 text-sm text-red-700 underline">Retry</button></div>

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Verification Requests</h1>
          <p className="text-gray-600 mt-1">{verifications.filter(v => v.status === 'pending').length} pending review</p>
        </div>
        <button onClick={fetchVerifications} className="btn-secondary text-sm">Refresh</button>
      </div>

      <div className="space-y-4">
        {verifications.map(vr => (
          <div key={vr.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">{vr.influencer_name || 'Unknown Influencer'}</h3>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${vr.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      vr.status === 'approved' ? 'bg-green-100 text-green-800' :
                        'bg-red-100 text-red-800'
                    }`}>{vr.status}</span>
                </div>
                {vr.metrics_snapshot && (
                  <div className="grid grid-cols-3 gap-4 mt-3">
                    <div className="bg-gray-50 rounded-lg p-3 text-center">
                      <div className="text-sm font-semibold text-gray-900">{vr.metrics_snapshot.followers?.toLocaleString() || '—'}</div>
                      <div className="text-xs text-gray-500">Followers</div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3 text-center">
                      <div className="text-sm font-semibold text-gray-900">{vr.metrics_snapshot.engagement_rate || '—'}%</div>
                      <div className="text-xs text-gray-500">Engagement</div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3 text-center">
                      <div className="text-sm font-semibold text-gray-900">{vr.metrics_snapshot.average_likes?.toLocaleString() || '—'}</div>
                      <div className="text-xs text-gray-500">Avg Likes</div>
                    </div>
                  </div>
                )}
                <p className="text-xs text-gray-500 mt-2">
                  Submitted: {new Date(vr.created_at).toLocaleDateString()} at {new Date(vr.created_at).toLocaleTimeString()}
                  {vr.reviewed_at && ` • Reviewed: ${new Date(vr.reviewed_at).toLocaleDateString()}`}
                </p>
              </div>
              {vr.status === 'pending' && (
                <div className="flex space-x-2 ml-4">
                  <button
                    onClick={() => handleApprove(vr.id)}
                    disabled={actionLoading === vr.id}
                    className="px-4 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-lg disabled:opacity-50"
                  >
                    {actionLoading === vr.id ? '...' : 'Approve'}
                  </button>
                  <button
                    onClick={() => handleReject(vr.id)}
                    disabled={actionLoading === vr.id}
                    className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg disabled:opacity-50"
                  >
                    {actionLoading === vr.id ? '...' : 'Reject'}
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
        {verifications.length === 0 && (
          <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
            <p className="text-gray-500">No verification requests</p>
          </div>
        )}
      </div>
    </div>
  )
}

// ============================================================================
// Reports & Moderation
// ============================================================================
const ReportsModeration = () => {
  const [reports, setReports] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchReports = () => {
    setLoading(true)
    setError(null)
    adminService.getReports()
      .then(data => { setReports(data); setLoading(false) })
      .catch(err => { setError(err.message); setLoading(false) })
  }

  useEffect(() => { fetchReports() }, [])

  const handleReview = async (reportId) => {
    try {
      await adminService.reviewReport(reportId, 'reviewed', 'Reviewed by admin')
      fetchReports()
    } catch (err) { setError(err.message) }
  }

  if (loading) return <div className="flex justify-center py-12"><div className="w-8 h-8 border-2 border-brand-navy border-t-transparent rounded-full animate-spin"></div></div>
  if (error) return <div className="bg-red-50 border border-red-200 rounded-lg p-4"><p className="text-red-600">{error}</p></div>

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Reports & Moderation</h1>
        <p className="text-gray-600 mt-1">{reports.filter(r => r.status === 'pending').length} pending reports</p>
      </div>

      {reports.length > 0 ? (
        <div className="space-y-4">
          {reports.map(report => (
            <div key={report.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">Report #{report.id}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${report.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'
                      }`}>{report.status}</span>
                  </div>
                  <p className="text-sm text-gray-600">Type: {report.reported_entity_type} • ID: {report.reported_entity_id}</p>
                  <p className="text-sm text-gray-700 mt-2">{report.reason}</p>
                  <p className="text-xs text-gray-500 mt-1">{new Date(report.created_at).toLocaleDateString()}</p>
                </div>
                {report.status === 'pending' && (
                  <button onClick={() => handleReview(report.id)} className="px-4 py-2 text-sm font-medium text-white bg-brand-navy hover:bg-brand-navy/90 rounded-lg">
                    Mark Reviewed
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
          <p className="text-gray-500">No reports submitted</p>
        </div>
      )}
    </div>
  )
}

// ============================================================================
// Platform Settings
// ============================================================================
const PlatformSettings = () => {
  const [loading, setLoading] = useState(null)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)

  const automationTasks = [
    { id: 'recalculate-trust', name: 'Recalculate Trust Scores', description: 'Recalculate trust scores for all influencers based on current metrics', icon: '📊' },
    { id: 'downgrade-inactive', name: 'Downgrade Inactive', description: 'Reduce trust scores for influencers who have been inactive', icon: '📉' },
    { id: 'flag-suspicious', name: 'Flag Suspicious', description: 'Automatically flag profiles with suspicious activity patterns', icon: '🚩' },
    { id: 'update-completion', name: 'Update Completion', description: 'Recalculate profile completion percentages for all influencers', icon: '📋' }
  ]

  const handleTrigger = async (task) => {
    setLoading(task)
    setResult(null)
    setError(null)
    try {
      const res = await adminService.triggerAutomation(task)
      setResult(res.message || 'Task completed successfully')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(null)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Platform Settings</h1>
        <p className="text-gray-600 mt-1">Automation and system maintenance tasks</p>
      </div>

      {result && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <p className="text-green-700">✓ {result}</p>
        </div>
      )}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {automationTasks.map(task => (
          <div key={task.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center text-2xl flex-shrink-0">
                {task.icon}
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900">{task.name}</h3>
                <p className="text-sm text-gray-600 mt-1">{task.description}</p>
                <button
                  onClick={() => handleTrigger(task.id)}
                  disabled={loading === task.id}
                  className="mt-3 px-4 py-2 text-sm font-medium text-white bg-brand-navy hover:bg-brand-navy/90 rounded-lg disabled:opacity-50 transition-colors"
                >
                  {loading === task.id ? 'Running...' : 'Run Now'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default AdminDashboard
