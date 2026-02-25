import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Logo from './Logo'
import Notifications from './Notifications'
import adminService from '../services/adminService'
import { 
  LayoutDashboard, 
  Users, 
  Building2, 
  Megaphone, 
  CheckCircle2, 
  AlertTriangle, 
  Settings,
  Clock,
  Shield,
  Activity
} from 'lucide-react'

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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-3 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Verifying admin access...</p>
        </div>
      </div>
    )
  }

  const navigation = [
    { id: 'overview', name: 'Overview', icon: LayoutDashboard },
    { id: 'influencers', name: 'Influencers', icon: Users },
    { id: 'brands', name: 'Brands', icon: Building2 },
    { id: 'campaigns', name: 'Campaigns', icon: Megaphone },
    { id: 'verification', name: 'Verification Requests', icon: CheckCircle2 },
    { id: 'reports', name: 'Reports & Moderation', icon: AlertTriangle },
    { id: 'settings', name: 'Platform Settings', icon: Settings }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Premium Navbar */}
      <nav className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-soft">
        <div className="max-w-full mx-auto px-6">
          <div className="flex justify-between items-center h-16">
            {/* Logo Section */}
            <div className="flex items-center space-x-4">
              <Logo size="md" />
              <div className="hidden md:flex items-center space-x-3">
                <div className="w-px h-6 bg-gray-200"></div>
                <span className="text-sm font-semibold text-gray-700">
                  Admin Dashboard
                </span>
              </div>
            </div>

            {/* Navigation Links - Desktop */}
            <div className="hidden lg:flex items-center space-x-2 flex-1 justify-center px-8 max-w-4xl">
              {navigation.map((item) => {
                const IconComponent = item.icon
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-smooth flex items-center space-x-2 ${
                      activeTab === item.id
                        ? 'text-emerald-600 bg-emerald-50'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    <IconComponent size={18} />
                    <span className="hidden xl:inline">{item.name}</span>
                  </button>
                )
              })}
            </div>

            {/* Right Section */}
            <div className="flex items-center space-x-3">
              <Notifications />

              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-gray-50 transition-smooth border border-gray-200"
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-lg flex items-center justify-center shadow-soft">
                    <Shield className="text-white" size={16} />
                  </div>
                  <div className="hidden md:block text-left">
                    <div className="text-sm font-semibold text-gray-900">{user.email}</div>
                    <div className="text-xs text-emerald-600 font-medium flex items-center space-x-1">
                      <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div>
                      <span>Admin</span>
                    </div>
                  </div>
                  <svg className="w-4 h-4 text-gray-400 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-soft-lg border border-gray-100 py-2 z-50 animate-scale-in">
                    <div className="px-2 py-2">
                      <button 
                        onClick={handleLogout} 
                        className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 font-medium rounded-lg transition-smooth"
                      >
                        Logout & Exit
                      </button>
                    </div>
                    <div className="px-4 py-3 border-t border-gray-100 bg-gray-50 rounded-b-xl">
                      <div className="text-xs font-semibold text-gray-700 uppercase tracking-wide">Admin Panel</div>
                      <div className="text-xs text-gray-500">System Administrator</div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="lg:hidden border-t border-gray-100 bg-white">
          <div className="px-4 py-3 flex space-x-2 overflow-x-auto">
            {navigation.map((item) => {
              const IconComponent = item.icon
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-smooth ${
                    activeTab === item.id
                      ? 'text-emerald-600 bg-emerald-50'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <IconComponent size={16} />
                  <span>{item.name}</span>
                </button>
              )
            })}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
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

// Overview Component
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
        <div className="w-10 h-10 border-3 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="card-soft p-6 bg-red-50 border-red-200">
        <p className="text-red-600 font-medium">Error loading stats: {error}</p>
      </div>
    )
  }

  if (!stats) {
    return (
      <div className="card-soft p-6">
        <p className="text-gray-600">No statistics available</p>
      </div>
    )
  }

  const kpis = [
    { label: 'Total Influencers', value: stats.total_influencers || 0, icon: Users, color: 'bg-blue-500' },
    { label: 'Verified Influencers', value: stats.verified_influencers || 0, icon: CheckCircle2, color: 'bg-emerald-500' },
    { label: 'Pending Verifications', value: stats.pending_verifications || 0, icon: Clock, color: 'bg-orange-500' },
    { label: 'Active Brands', value: stats.active_brands || 0, icon: Building2, color: 'bg-purple-500' },
    { label: 'Live Campaigns', value: stats.live_campaigns || 0, icon: Megaphone, color: 'bg-indigo-500' },
    { label: 'Reported Issues', value: stats.reported_issues || 0, icon: AlertTriangle, color: 'bg-red-500' }
  ]

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="card-soft p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-1">Dashboard Overview</h1>
            <p className="text-sm text-gray-500">Welcome back, Admin! Here's what's happening today.</p>
          </div>
          <div className="flex items-center space-x-2 px-4 py-2 bg-emerald-50 rounded-lg border border-emerald-200">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium text-emerald-700">System Online</span>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {kpis.map((kpi, index) => {
          const IconComponent = kpi.icon
          return (
            <div 
              key={index} 
              className="card-soft p-6 group"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-500 mb-2">{kpi.label}</p>
                  <p className="text-3xl font-bold text-gray-900">{kpi.value.toLocaleString()}</p>
                </div>
                <div className={`w-12 h-12 ${kpi.color} rounded-xl flex items-center justify-center shadow-soft transition-smooth group-hover:scale-110`}>
                  <IconComponent className="text-white" size={24} />
                </div>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-1.5">
                <div 
                  className={`h-full ${kpi.color} rounded-full transition-smooth`}
                  style={{ width: `${Math.min((kpi.value / 100) * 100, 100)}%` }}
                ></div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// Placeholder components for other tabs
const Influencers = () => <div className="card-soft p-6"><h2 className="text-xl font-bold">Influencers Management</h2></div>
const Brands = () => <div className="card-soft p-6"><h2 className="text-xl font-bold">Brands Management</h2></div>
const Campaigns = () => <div className="card-soft p-6"><h2 className="text-xl font-bold">Campaigns</h2></div>
const VerificationRequests = () => <div className="card-soft p-6"><h2 className="text-xl font-bold">Verification Requests</h2></div>
const ReportsModeration = () => <div className="card-soft p-6"><h2 className="text-xl font-bold">Reports & Moderation</h2></div>
const PlatformSettings = () => <div className="card-soft p-6"><h2 className="text-xl font-bold">Platform Settings</h2></div>

export default AdminDashboard
