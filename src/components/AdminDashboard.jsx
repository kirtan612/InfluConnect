import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Logo from './Logo'
import Notifications from './Notifications'

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview')
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [adminUser, setAdminUser] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    const adminAuth = localStorage.getItem('adminAuth')
    if (!adminAuth) {
      navigate('/admin/login')
      return
    }
    setAdminUser(JSON.parse(adminAuth))
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('adminAuth')
    navigate('/')
  }

  if (!adminUser) {
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
      {/* Top Navigation */}
      <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center flex-shrink-0 min-w-0">
              <Logo size="md" />
              <div className="ml-2 flex items-center space-x-2">
                <div className="w-px h-6 bg-gray-300"></div>
                <span className="text-xs font-bold text-gray-800 tracking-wide whitespace-nowrap">
                  ADMIN CONTROL CENTER
                </span>
              </div>
            </div>

            {/* Navigation Items */}
            <div className="hidden lg:flex items-center space-x-1 flex-1 px-8">
              {navigation.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`px-2 py-1.5 rounded-md text-xs font-medium transition-all duration-300 flex items-center space-x-1 hover:scale-105 transform ${
                    activeTab === item.id
                      ? 'text-brand-navy bg-gradient-to-r from-brand-navy/10 to-brand-teal/10 shadow-md border border-brand-navy/20 scale-105'
                      : 'text-gray-600 hover:text-brand-navy hover:bg-gray-50 hover:shadow-sm'
                  }`}
                >
                  <span className="text-sm transition-transform duration-300 hover:scale-110">{item.icon}</span>
                  <span className="hidden xl:inline text-xs font-semibold">{item.name}</span>
                </button>
              ))}
            </div>

            {/* Notifications & Admin User Menu */}
            <div className="flex items-center space-x-3 flex-shrink-0">
              <Notifications />
              
              {/* Admin User Menu */}
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-50 transition-all duration-300 border border-gray-200 hover:border-gray-300 hover:shadow-md"
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-red-600 via-red-700 to-red-800 rounded-lg flex items-center justify-center shadow-lg">
                    <span className="text-white text-sm font-bold">A</span>
                  </div>
                  <div className="hidden md:block text-left">
                    <div className="text-xs font-bold text-gray-900">{adminUser.email}</div>
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
                    <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 font-medium">System Logs</a>
                    <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 font-medium">Security Settings</a>
                    <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 font-medium">Audit Trail</a>
                    <div className="border-t border-gray-100 mt-2 pt-2">
                      <button onClick={handleLogout} className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 font-medium">Logout & Exit</button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="lg:hidden border-t border-gray-100 bg-gray-50">
          <div className="px-4 py-3 flex space-x-2 overflow-x-auto">
            {navigation.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`px-3 py-2 rounded-md text-xs font-medium whitespace-nowrap flex items-center space-x-1 ${
                  activeTab === item.id
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

      {/* Main Content */}
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

// Overview Page
const Overview = () => {
  const kpis = [
    { label: 'Total Influencers', value: '2,847', change: '+12%', trend: 'up' },
    { label: 'Verified Influencers', value: '1,923', change: '+8%', trend: 'up' },
    { label: 'Pending Verifications', value: '47', change: '+15%', trend: 'alert' },
    { label: 'Active Brands', value: '156', change: '+5%', trend: 'up' },
    { label: 'Live Campaigns', value: '89', change: '+22%', trend: 'up' },
    { label: 'Reported Issues', value: '12', change: '-8%', trend: 'down' }
  ]

  const recentActivity = [
    { type: 'verification', message: 'Sarah Johnson submitted verification request', time: '2 hours ago' },
    { type: 'brand', message: 'TechCorp Inc. created new campaign', time: '4 hours ago' },
    { type: 'report', message: 'Fake engagement report filed against @techreview', time: '6 hours ago' },
    { type: 'verification', message: 'Mike Chen verification approved', time: '8 hours ago' },
    { type: 'campaign', message: 'Fashion Week campaign went live', time: '1 day ago' }
  ]

  const alerts = [
    { type: 'warning', message: '47 verification requests pending review', priority: 'high' },
    { type: 'info', message: '12 reports require moderation action', priority: 'medium' },
    { type: 'success', message: 'Platform uptime: 99.9% this month', priority: 'low' }
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

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {kpis.map((kpi, index) => (
          <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-lg hover:scale-105 transition-all duration-300 cursor-pointer group">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1 group-hover:text-gray-800 transition-colors">{kpi.label}</p>
                <p className="text-3xl font-bold text-gray-900 group-hover:text-brand-navy transition-colors">{kpi.value}</p>
              </div>
              <div className={`text-sm font-semibold px-3 py-1 rounded-full transition-all duration-300 group-hover:scale-110 ${
                kpi.trend === 'up' ? 'text-green-700 bg-green-100 group-hover:bg-green-200' :
                kpi.trend === 'down' ? 'text-green-700 bg-green-100 group-hover:bg-green-200' :
                'text-yellow-700 bg-yellow-100 group-hover:bg-yellow-200'
              }`}>
                {kpi.change}
              </div>
            </div>
            <div className="mt-4 h-1 bg-gray-100 rounded-full overflow-hidden">
              <div className={`h-full transition-all duration-1000 ease-out ${
                kpi.trend === 'up' ? 'bg-green-500' :
                kpi.trend === 'down' ? 'bg-green-500' :
                'bg-yellow-500'
              }`} style={{ width: `${Math.abs(parseInt(kpi.change))}%` }}></div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Activity */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-all duration-200 cursor-pointer group border border-transparent hover:border-gray-200">
                  <div className={`w-3 h-3 rounded-full mt-2 flex-shrink-0 transition-all duration-300 group-hover:scale-125 ${
                    activity.type === 'verification' ? 'bg-brand-teal group-hover:shadow-lg group-hover:shadow-teal-200' :
                    activity.type === 'brand' ? 'bg-brand-indigo group-hover:shadow-lg group-hover:shadow-indigo-200' :
                    activity.type === 'report' ? 'bg-red-500 group-hover:shadow-lg group-hover:shadow-red-200' :
                    'bg-gray-400 group-hover:shadow-lg group-hover:shadow-gray-200'
                  }`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-900 font-medium group-hover:text-gray-800 transition-colors">{activity.message}</p>
                    <p className="text-xs text-gray-500 mt-1 group-hover:text-gray-600 transition-colors">{activity.time}</p>
                  </div>
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Alerts Panel */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900">System Alerts</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {alerts.map((alert, index) => (
                <div key={index} className={`p-4 rounded-lg border transition-all duration-300 hover:scale-105 cursor-pointer group ${
                  alert.type === 'warning' ? 'bg-yellow-50 border-yellow-200 hover:bg-yellow-100 hover:border-yellow-300' :
                  alert.type === 'info' ? 'bg-blue-50 border-blue-200 hover:bg-blue-100 hover:border-blue-300' :
                  'bg-green-50 border-green-200 hover:bg-green-100 hover:border-green-300'
                }`}>
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3">
                      <span className={`text-lg flex-shrink-0 transition-transform duration-300 group-hover:scale-125 ${
                        alert.type === 'warning' ? 'text-yellow-600' :
                        alert.type === 'info' ? 'text-blue-600' :
                        'text-green-600'
                      }`}>
                        {alert.type === 'warning' ? '⚠️' : alert.type === 'info' ? 'ℹ️' : '✅'}
                      </span>
                      <p className={`text-sm font-medium transition-colors duration-200 ${
                        alert.type === 'warning' ? 'text-yellow-800 group-hover:text-yellow-900' :
                        alert.type === 'info' ? 'text-blue-800 group-hover:text-blue-900' :
                        'text-green-800 group-hover:text-green-900'
                      }`}>
                        {alert.message}
                      </p>
                    </div>
                    <div className={`px-2 py-1 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-200 ${
                      alert.priority === 'high' ? 'bg-red-100 text-red-700 group-hover:bg-red-200' :
                      alert.priority === 'medium' ? 'bg-orange-100 text-orange-700 group-hover:bg-orange-200' :
                      'bg-gray-100 text-gray-700 group-hover:bg-gray-200'
                    }`}>
                      {alert.priority}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Influencers Management Page
const Influencers = () => {
  const [selectedInfluencer, setSelectedInfluencer] = useState(null)
  const [filter, setFilter] = useState('all')

  const influencers = [
    {
      id: 1,
      name: 'Sarah Johnson',
      email: 'sarah@example.com',
      categories: ['Tech Reviews'],
      platforms: ['Instagram', 'YouTube'],
      verified: true,
      completeness: 92,
      joinDate: '2024-01-15',
      followers: '125K',
      engagement: '4.2%'
    },
    {
      id: 2,
      name: 'Mike Chen',
      email: 'mike@example.com',
      categories: ['Business'],
      platforms: ['LinkedIn', 'YouTube'],
      verified: false,
      completeness: 78,
      joinDate: '2024-01-20',
      followers: '89K',
      engagement: '5.1%'
    },
    {
      id: 3,
      name: 'Emma Davis',
      email: 'emma@example.com',
      categories: ['Lifestyle'],
      platforms: ['TikTok', 'Instagram'],
      verified: 'pending',
      completeness: 85,
      joinDate: '2024-01-18',
      followers: '200K',
      engagement: '6.8%'
    }
  ]

  const filteredInfluencers = filter === 'all' ? influencers : 
    influencers.filter(inf => inf.verified === (filter === 'verified' ? true : filter === 'pending' ? 'pending' : false))

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Influencer Management</h1>
          <p className="text-gray-600 mt-1">Full oversight of platform creators</p>
        </div>
        
        <div className="flex bg-gray-100 rounded-lg p-1">
          {[
            { id: 'all', name: 'All' },
            { id: 'verified', name: 'Verified' },
            { id: 'pending', name: 'Pending' },
            { id: 'unverified', name: 'Unverified' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                filter === tab.id
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {tab.name}
            </button>
          ))}
        </div>
      </div>

      {/* Influencers Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Influencer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Categories</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Platforms</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Completeness</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredInfluencers.map((influencer) => (
                <tr key={influencer.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{influencer.name}</div>
                      <div className="text-sm text-gray-500">{influencer.email}</div>
                      <div className="text-xs text-gray-400">Joined {new Date(influencer.joinDate).toLocaleDateString()}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-wrap gap-1">
                      {influencer.categories.map((cat, idx) => (
                        <span key={idx} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                          {cat}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-wrap gap-1">
                      {influencer.platforms.map((platform, idx) => (
                        <span key={idx} className="px-2 py-1 bg-brand-indigo/10 text-brand-indigo text-xs rounded">
                          {platform}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      influencer.verified === true ? 'bg-green-100 text-green-800' :
                      influencer.verified === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {influencer.verified === true ? '✓ Verified' :
                       influencer.verified === 'pending' ? '⏳ Pending' :
                       'Unverified'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                        <div 
                          className="bg-brand-teal h-2 rounded-full" 
                          style={{ width: `${influencer.completeness}%` }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-600">{influencer.completeness}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => setSelectedInfluencer(influencer)}
                      className="text-brand-teal hover:text-brand-navy mr-3"
                    >
                      View Profile
                    </button>
                    {influencer.verified === 'pending' && (
                      <button className="text-green-600 hover:text-green-800">
                        Review
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Influencer Profile Modal */}
      {selectedInfluencer && (
        <InfluencerProfileModal 
          influencer={selectedInfluencer}
          onClose={() => setSelectedInfluencer(null)}
        />
      )}
    </div>
  )
}

// Influencer Profile Modal (Admin View)
const InfluencerProfileModal = ({ influencer, onClose }) => {
  const [verificationAction, setVerificationAction] = useState('')
  const [rejectionReason, setRejectionReason] = useState('')

  const handleVerificationAction = (action) => {
    if (action === 'approve') {
      // Update influencer verification status
      console.log('Approved verification for', influencer.name)
    } else if (action === 'reject' && rejectionReason) {
      console.log('Rejected verification for', influencer.name, 'Reason:', rejectionReason)
    }
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-900">Admin Profile Review</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl">×</button>
          </div>
        </div>
        
        <div className="p-6 space-y-6">
          {/* Profile Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Profile Information</h3>
              <div className="space-y-3">
                <div>
                  <span className="text-sm font-medium text-gray-500">Name:</span>
                  <span className="ml-2 text-sm text-gray-900">{influencer.name}</span>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">Email:</span>
                  <span className="ml-2 text-sm text-gray-900">{influencer.email}</span>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">Followers:</span>
                  <span className="ml-2 text-sm text-gray-900">{influencer.followers}</span>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">Engagement:</span>
                  <span className="ml-2 text-sm text-gray-900">{influencer.engagement}</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Verification Status</h3>
              <div className="space-y-3">
                <div className={`p-3 rounded-lg ${
                  influencer.verified === true ? 'bg-green-50 border border-green-200' :
                  influencer.verified === 'pending' ? 'bg-yellow-50 border border-yellow-200' :
                  'bg-gray-50 border border-gray-200'
                }`}>
                  <span className={`text-sm font-medium ${
                    influencer.verified === true ? 'text-green-800' :
                    influencer.verified === 'pending' ? 'text-yellow-800' :
                    'text-gray-800'
                  }`}>
                    {influencer.verified === true ? '✓ Verified' :
                     influencer.verified === 'pending' ? '⏳ Pending Review' :
                     'Not Verified'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Admin Actions */}
          {influencer.verified === 'pending' && (
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Admin Actions</h3>
              <div className="space-y-4">
                <div className="flex space-x-3">
                  <button
                    onClick={() => handleVerificationAction('approve')}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium"
                  >
                    Approve Verification
                  </button>
                  <button
                    onClick={() => setVerificationAction('reject')}
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium"
                  >
                    Reject Verification
                  </button>
                </div>
                
                {verificationAction === 'reject' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Rejection Reason (Required)
                    </label>
                    <textarea
                      value={rejectionReason}
                      onChange={(e) => setRejectionReason(e.target.value)}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-teal focus:border-transparent"
                      placeholder="Provide a clear reason for rejection..."
                    />
                    <div className="mt-3 flex space-x-3">
                      <button
                        onClick={() => handleVerificationAction('reject')}
                        disabled={!rejectionReason}
                        className="bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg font-medium"
                      >
                        Confirm Rejection
                      </button>
                      <button
                        onClick={() => setVerificationAction('')}
                        className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded-lg font-medium"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// Brands Management Page
const Brands = () => {
  const [selectedBrand, setSelectedBrand] = useState(null)

  const brands = [
    {
      id: 1,
      name: 'TechCorp Inc.',
      industry: 'Technology',
      location: 'San Francisco, CA',
      activeCampaigns: 3,
      status: 'Active',
      joinDate: '2024-01-10'
    },
    {
      id: 2,
      name: 'Fashion Forward',
      industry: 'Fashion',
      location: 'New York, NY',
      activeCampaigns: 1,
      status: 'Active',
      joinDate: '2024-01-15'
    },
    {
      id: 3,
      name: 'Wellness Co',
      industry: 'Health & Wellness',
      location: 'Los Angeles, CA',
      activeCampaigns: 0,
      status: 'Flagged',
      joinDate: '2024-01-20'
    }
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Brand Management</h1>
        <p className="text-gray-600 mt-1">Ensure brand legitimacy and campaign quality</p>
      </div>

      {/* Brands Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Company</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Industry</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Campaigns</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {brands.map((brand) => (
                <tr key={brand.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{brand.name}</div>
                      <div className="text-xs text-gray-400">Joined {new Date(brand.joinDate).toLocaleDateString()}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{brand.industry}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{brand.location}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{brand.activeCampaigns}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      brand.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {brand.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => setSelectedBrand(brand)}
                      className="text-brand-teal hover:text-brand-navy mr-3"
                    >
                      View Details
                    </button>
                    {brand.status === 'Flagged' && (
                      <button className="text-red-600 hover:text-red-800">
                        Review
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Brand Detail Modal */}
      {selectedBrand && (
        <BrandDetailModal 
          brand={selectedBrand}
          onClose={() => setSelectedBrand(null)}
        />
      )}
    </div>
  )
}

// Brand Detail Modal
const BrandDetailModal = ({ brand, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-900">Brand Details</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl">×</button>
          </div>
        </div>
        
        <div className="p-6 space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Company Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-sm font-medium text-gray-500">Company Name:</span>
                <p className="text-sm text-gray-900">{brand.name}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-500">Industry:</span>
                <p className="text-sm text-gray-900">{brand.industry}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-500">Location:</span>
                <p className="text-sm text-gray-900">{brand.location}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-500">Status:</span>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                  brand.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {brand.status}
                </span>
              </div>
            </div>
          </div>

          {brand.status === 'Flagged' && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <h4 className="text-sm font-medium text-red-800 mb-2">Admin Actions Required</h4>
              <div className="flex space-x-3">
                <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium">
                  Clear Flag
                </button>
                <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium">
                  Suspend Brand
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// Campaigns Oversight Page
const Campaigns = () => {
  const [selectedCampaign, setSelectedCampaign] = useState(null)

  const campaigns = [
    {
      id: 1,
      brand: 'TechCorp Inc.',
      title: 'Q4 Product Launch',
      category: 'Tech Reviews',
      platform: 'YouTube',
      budget: '₹4,00,000-8,00,000',
      status: 'Live'
    },
    {
      id: 2,
      brand: 'Fashion Forward',
      title: 'Summer Collection',
      category: 'Fashion',
      platform: 'Instagram',
      budget: '₹1,60,000-4,00,000',
      status: 'Draft'
    },
    {
      id: 3,
      brand: 'Wellness Co',
      title: 'Fitness App Promo',
      category: 'Health & Fitness',
      platform: 'Instagram',
      budget: '₹80,000-2,40,000',
      status: 'Disabled'
    }
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Campaign Oversight</h1>
        <p className="text-gray-600 mt-1">Monitor all campaigns on the platform</p>
      </div>

      {/* Campaign Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {campaigns.map((campaign) => (
          <div key={campaign.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{campaign.title}</h3>
                <p className="text-sm text-gray-600">{campaign.brand}</p>
              </div>
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                campaign.status === 'Live' ? 'bg-green-100 text-green-800' :
                campaign.status === 'Draft' ? 'bg-yellow-100 text-yellow-800' :
                'bg-red-100 text-red-800'
              }`}>
                {campaign.status}
              </span>
            </div>
            
            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Category:</span>
                <span className="text-gray-900">{campaign.category}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Platform:</span>
                <span className="text-gray-900">{campaign.platform}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Budget:</span>
                <span className="text-gray-900">{campaign.budget}</span>
              </div>
            </div>

            <div className="flex space-x-2">
              <button
                onClick={() => setSelectedCampaign(campaign)}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-lg text-sm font-medium"
              >
                View Details
              </button>
              {campaign.status === 'Live' && (
                <button className="bg-red-100 hover:bg-red-200 text-red-700 px-3 py-2 rounded-lg text-sm font-medium">
                  Disable
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// Verification Requests Page
const VerificationRequests = () => {
  const [requests, setRequests] = useState([
    {
      id: 1,
      name: 'Alex Rodriguez',
      email: 'alex@example.com',
      platforms: ['Instagram', 'YouTube'],
      followers: '85K',
      engagement: '3.9%',
      submittedDate: '2024-01-22',
      status: 'pending'
    },
    {
      id: 2,
      name: 'Lisa Wang',
      email: 'lisa@example.com',
      platforms: ['YouTube', 'Facebook'],
      followers: '120K',
      engagement: '4.5%',
      submittedDate: '2024-01-21',
      status: 'pending'
    }
  ])

  const handleVerification = (requestId, action, reason = '') => {
    setRequests(prev => prev.map(req => 
      req.id === requestId 
        ? { ...req, status: action, rejectionReason: reason }
        : req
    ))
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Verification Requests</h1>
        <p className="text-gray-600 mt-1">Admin-controlled trust system</p>
      </div>

      {/* Verification Queue */}
      <div className="space-y-4">
        {requests.filter(req => req.status === 'pending').map((request) => (
          <VerificationCard 
            key={request.id}
            request={request}
            onAction={handleVerification}
          />
        ))}
        
        {requests.filter(req => req.status === 'pending').length === 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
            <div className="text-4xl mb-4">✅</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Pending Requests</h3>
            <p className="text-gray-600">All verification requests have been processed</p>
          </div>
        )}
      </div>
    </div>
  )
}

// Verification Card Component
const VerificationCard = ({ request, onAction }) => {
  const [showRejectForm, setShowRejectForm] = useState(false)
  const [rejectionReason, setRejectionReason] = useState('')

  const handleReject = () => {
    if (rejectionReason.trim()) {
      onAction(request.id, 'rejected', rejectionReason)
      setShowRejectForm(false)
      setRejectionReason('')
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{request.name}</h3>
              <p className="text-sm text-gray-600">{request.email}</p>
              <p className="text-xs text-gray-500">Submitted {new Date(request.submittedDate).toLocaleDateString()}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <span className="text-sm font-medium text-gray-500">Platforms:</span>
              <div className="flex flex-wrap gap-1 mt-1">
                {request.platforms.map((platform, idx) => (
                  <span key={idx} className="px-2 py-1 bg-brand-indigo/10 text-brand-indigo text-xs rounded">
                    {platform}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-500">Metrics:</span>
              <p className="text-sm text-gray-900">{request.followers} followers</p>
              <p className="text-sm text-gray-900">{request.engagement} engagement</p>
            </div>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="text-sm font-medium text-gray-900 mb-3">Admin Actions</h4>
            
            {!showRejectForm ? (
              <div className="space-y-2">
                <button
                  onClick={() => onAction(request.id, 'approved')}
                  className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
                >
                  ✓ Approve Verification
                </button>
                <button
                  onClick={() => setShowRejectForm(true)}
                  className="w-full bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
                >
                  ✕ Reject Request
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <textarea
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  placeholder="Provide rejection reason..."
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-brand-teal focus:border-transparent"
                />
                <div className="flex space-x-2">
                  <button
                    onClick={handleReject}
                    disabled={!rejectionReason.trim()}
                    className="flex-1 bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white px-3 py-2 rounded-lg text-sm font-medium"
                  >
                    Confirm
                  </button>
                  <button
                    onClick={() => setShowRejectForm(false)}
                    className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 px-3 py-2 rounded-lg text-sm font-medium"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// Reports & Moderation Page
const ReportsModeration = () => {
  const [reports, setReports] = useState([
    {
      id: 1,
      type: 'Fake Engagement',
      reportedEntity: '@techreview_fake',
      reporterType: 'Brand',
      reason: 'Suspicious engagement patterns detected',
      status: 'pending',
      submittedDate: '2024-01-22'
    },
    {
      id: 2,
      type: 'Misleading Profile',
      reportedEntity: 'FashionInfluencer123',
      reporterType: 'Influencer',
      reason: 'False follower count claims',
      status: 'pending',
      submittedDate: '2024-01-21'
    }
  ])

  const handleReportAction = (reportId, action) => {
    setReports(prev => prev.map(report => 
      report.id === reportId 
        ? { ...report, status: action }
        : report
    ))
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Reports & Moderation</h1>
        <p className="text-gray-600 mt-1">Platform safety and integrity oversight</p>
      </div>

      {/* Reports List */}
      <div className="space-y-4">
        {reports.filter(report => report.status === 'pending').map((report) => (
          <div key={report.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{report.type}</h3>
                <p className="text-sm text-gray-600">Reported: {report.reportedEntity}</p>
                <p className="text-xs text-gray-500">By {report.reporterType} • {new Date(report.submittedDate).toLocaleDateString()}</p>
              </div>
              <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full">
                Pending Review
              </span>
            </div>

            <div className="mb-4">
              <span className="text-sm font-medium text-gray-500">Reason:</span>
              <p className="text-sm text-gray-900 mt-1">{report.reason}</p>
            </div>

            <div className="flex space-x-3">
              <button
                onClick={() => handleReportAction(report.id, 'resolved')}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
              >
                Mark as Resolved
              </button>
              <button
                onClick={() => handleReportAction(report.id, 'flagged')}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
              >
                Flag Account
              </button>
              <button className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg text-sm font-medium">
                Suspend Entity
              </button>
            </div>
          </div>
        ))}

        {reports.filter(report => report.status === 'pending').length === 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
            <div className="text-4xl mb-4">🛡️</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Pending Reports</h3>
            <p className="text-gray-600">All reports have been reviewed and resolved</p>
          </div>
        )}
      </div>
    </div>
  )
}

// Platform Settings Page
const PlatformSettings = () => {
  const verificationCriteria = [
    'Minimum 10K followers on primary platform',
    'Consistent content creation (3+ posts/week)',
    'Authentic engagement rate above 2%',
    'Complete profile information',
    'No policy violations'
  ]

  const platformCategories = [
    'Tech Reviews', 'Fashion', 'Lifestyle', 'Business', 'Travel', 
    'Food & Beverage', 'Health & Wellness', 'Gaming', 'Beauty', 'Sports'
  ]

  const industryTags = [
    'Technology', 'Fashion', 'Healthcare', 'Finance', 'Education',
    'Entertainment', 'Automotive', 'Real Estate', 'Food Service', 'Retail'
  ]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Platform Settings</h1>
        <p className="text-gray-600 mt-1">System-level configuration and rules</p>
      </div>

      {/* Verification Criteria */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Verification Criteria</h2>
        <p className="text-gray-600 mb-4">Current requirements for influencer verification:</p>
        <div className="space-y-2">
          {verificationCriteria.map((criterion, index) => (
            <div key={index} className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-brand-teal rounded-full"></div>
              <span className="text-gray-700">{criterion}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Badge Rules */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Verification Badge Rules</h2>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <span className="w-5 h-5 bg-brand-teal rounded-full flex items-center justify-center">
              <span className="text-white text-xs font-bold">✓</span>
            </span>
            <span className="font-medium text-gray-900">Verified Badge</span>
          </div>
          <ul className="text-sm text-gray-700 space-y-1 ml-7">
            <li>• Only admins can grant verification badges</li>
            <li>• Badges are permanent unless revoked by admin</li>
            <li>• Verified status appears across all platform interactions</li>
            <li>• Badge cannot be self-assigned or transferred</li>
          </ul>
        </div>
      </div>

      {/* Platform Categories */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Platform Categories</h2>
        <div className="flex flex-wrap gap-2">
          {platformCategories.map((category, index) => (
            <span key={index} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
              {category}
            </span>
          ))}
        </div>
      </div>

      {/* Industry Tags */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Industry Tags</h2>
        <div className="flex flex-wrap gap-2">
          {industryTags.map((tag, index) => (
            <span key={index} className="px-3 py-1 bg-brand-indigo/10 text-brand-indigo rounded-full text-sm">
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Admin Roles */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Admin Roles</h2>
        <div className="space-y-3">
          <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
            <div>
              <span className="font-medium text-gray-900">Super Admin</span>
              <p className="text-sm text-gray-600">Full platform control and settings access</p>
            </div>
            <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded">Active</span>
          </div>
          <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
            <div>
              <span className="font-medium text-gray-900">Verification Admin</span>
              <p className="text-sm text-gray-600">Influencer verification and trust management</p>
            </div>
            <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded">Active</span>
          </div>
          <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
            <div>
              <span className="font-medium text-gray-900">Moderation Admin</span>
              <p className="text-sm text-gray-600">Reports and content moderation oversight</p>
            </div>
            <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded">Active</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard