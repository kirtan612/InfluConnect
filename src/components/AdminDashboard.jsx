import React, { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
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
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Menu,
  BarChart2,
  TrendingDown,
  Flag,
  ClipboardCheck
} from 'lucide-react'

const AdminDashboard = () => {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const activeTab = searchParams.get('tab') || 'overview'

  const setActiveTab = (tabId) => {
    setSearchParams({ tab: tabId })
  }

  useEffect(() => {
    if (!searchParams.get('tab')) {
      setSearchParams({ tab: activeTab }, { replace: true })
    }
  }, [])

  const [showUserMenu, setShowUserMenu] = useState(false)
  const [showMoreMenu, setShowMoreMenu] = useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const { user, logout } = useAuth()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/40 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-brand-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600 font-medium">Verifying admin access...</p>
        </div>
      </div>
    )
  }

  const primaryNav = [
    { id: 'overview', name: 'Overview', icon: LayoutDashboard, color: 'text-blue-500', shadow: 'shadow-[0_2px_8px_rgba(59,130,246,0.15)]', hover: 'hover:shadow-[0_4px_12px_rgba(59,130,246,0.2)] hover:text-blue-600' },
    { id: 'influencers', name: 'Influencers', icon: Users, color: 'text-violet-500', shadow: 'shadow-[0_2px_8px_rgba(139,92,246,0.15)]', hover: 'hover:shadow-[0_4px_12px_rgba(139,92,246,0.2)] hover:text-violet-600' },
    { id: 'brands', name: 'Brands', icon: Building2, color: 'text-rose-500', shadow: 'shadow-[0_2px_8px_rgba(244,63,110,0.15)]', hover: 'hover:shadow-[0_4px_12px_rgba(244,63,110,0.2)] hover:text-rose-600' },
    { id: 'campaigns', name: 'Campaigns', icon: Megaphone, color: 'text-emerald-500', shadow: 'shadow-[0_2px_8px_rgba(16,185,129,0.15)]', hover: 'hover:shadow-[0_4px_12px_rgba(16,185,129,0.2)] hover:text-emerald-600' }
  ]

  const secondaryNav = [
    { id: 'verification', name: 'Verification', icon: CheckCircle2, color: 'text-indigo-500', shadow: 'shadow-[0_2px_8px_rgba(99,102,241,0.15)]', hover: 'hover:shadow-[0_4px_12px_rgba(99,102,241,0.2)] hover:text-indigo-600' },
    { id: 'reports', name: 'Reports', icon: AlertTriangle, color: 'text-cyan-500', shadow: 'shadow-[0_2px_8px_rgba(6,182,212,0.15)]', hover: 'hover:shadow-[0_4px_12px_rgba(6,182,212,0.2)] hover:text-cyan-600' },
    { id: 'settings', name: 'Settings', icon: Settings, color: 'text-amber-500', shadow: 'shadow-[0_2px_8px_rgba(245,158,11,0.15)]', hover: 'hover:shadow-[0_4px_12px_rgba(245,158,11,0.2)] hover:text-amber-600' }
  ]

  const allNav = [...primaryNav, ...secondaryNav]
  const isSecondaryActive = secondaryNav.some(item => item.id === activeTab)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const tab = params.get('tab')
    if (tab) setActiveTab(tab)
  }, [])

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
          {isSidebarOpen ? <Logo size="md" className="drop-shadow-[5px_5px_15px_5px_rgba(199,210,254,0.3)]" /> : <div className="text-brand-primary font-bold text-xl drop-shadow-[5px_5px_15px_5px_rgba(199,210,254,0.3)]">IC</div>}
        </div>

        <div className="flex-1 overflow-y-auto py-6 flex flex-col gap-2 px-3">
          {allNav.map((item) => {
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
                className="flex items-center space-x-3 p-2 rounded-xl hover:bg-slate-50 transition-colors"
              >
                <div className="w-9 h-9 bg-brand-primary rounded-xl flex items-center justify-center shadow-md">
                  <Shield className="text-brand-accent" size={18} />
                </div>
                <div className="hidden md:block text-left">
                  <div className="text-sm font-medium text-slate-900">{user.email}</div>
                  <div className="text-xs text-brand-accent font-semibold">Administrator</div>
                </div>
              </button>

              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50">
                  <button onMouseDown={handleLogout} className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-brand-primary flex items-center space-x-2">
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
            {activeTab === 'overview' && <Overview />}
            {activeTab === 'influencers' && <Influencers />}
            {activeTab === 'brands' && <Brands />}
            {activeTab === 'campaigns' && <Campaigns />}
            {activeTab === 'verification' && <VerificationRequests />}
            {activeTab === 'reports' && <ReportsModeration />}
            {activeTab === 'settings' && <PlatformSettings />}
          </div>
        </main>
      </div>
    </div>
  )
}

const Overview = () => {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    adminService.getStats()
      .then(data => { setStats(data); setLoading(false) })
      .catch(err => { setError(err.message); setLoading(false) })
  }, [])

  if (loading) return <div className="flex items-center justify-center py-12"><div className="w-12 h-12 border-4 border-brand-primary border-t-transparent rounded-full animate-spin"></div></div>
  if (error) return <div className="card-glass p-6 bg-gradient-to-br from-red-50 to-rose-50 border-red-200"><p className="text-red-600 font-medium">Error loading stats: {error}</p></div>
  if (!stats) return <div className="card-glass p-6"><p className="text-slate-600">No statistics available</p></div>

  const kpis = [
    { label: 'Total Influencers', value: stats.total_influencers || 0, icon: Users, gradient: 'from-brand-primary to-indigo-600', bg: 'from-brand-primary/10 to-indigo-100/50', iconBg: 'from-brand-primary to-indigo-600', shadow: 'hover:shadow-[0_16px_32px_-6px_rgba(91,110,245,0.4)]' },
    { label: 'Verified Influencers', value: stats.verified_influencers || 0, icon: CheckCircle2, gradient: 'from-emerald-500 to-emerald-600', bg: 'from-emerald-50 to-emerald-100/50', iconBg: 'from-emerald-500 to-emerald-600', shadow: 'hover:shadow-[0_16px_32px_-6px_rgba(16,185,129,0.4)]' },
    { label: 'Pending Verifications', value: stats.pending_verifications || 0, icon: Clock, gradient: 'from-brand-secondary to-pink-600', bg: 'from-pink-50 to-pink-100/50', iconBg: 'from-brand-secondary to-pink-600', shadow: 'hover:shadow-[0_16px_32px_-6px_rgba(236,72,153,0.4)]' },
    { label: 'Active Brands', value: stats.active_brands || 0, icon: Building2, gradient: 'from-purple-500 to-purple-600', bg: 'from-purple-50 to-purple-100/50', iconBg: 'from-purple-500 to-purple-600', shadow: 'hover:shadow-[0_16px_32px_-6px_rgba(168,85,247,0.4)]' },
    { label: 'Live Campaigns', value: stats.live_campaigns || 0, icon: Megaphone, gradient: 'from-brand-accent to-cyan-600', bg: 'from-cyan-50 to-cyan-100/50', iconBg: 'from-brand-accent to-cyan-600', shadow: 'hover:shadow-[0_16px_32px_-6px_rgba(6,182,212,0.4)]' },
    { label: 'Reported Issues', value: stats.reported_issues || 0, icon: AlertTriangle, gradient: 'from-rose-500 to-rose-600', bg: 'from-rose-50 to-rose-100/50', iconBg: 'from-rose-500 to-rose-600', shadow: 'hover:shadow-[0_16px_32px_-6px_rgba(244,63,110,0.4)]' }
  ]

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="relative card-glass p-8 hover:shadow-2xl transition-all duration-300 hover:translate-y-[-4px] overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-brand-primary/10 to-transparent rounded-full blur-3xl"></div>
        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gradient mb-2">Dashboard Overview</h1>
              <p className="text-slate-500">Welcome back, Admin! Here's what's happening today.</p>
            </div>
            <div className="flex items-center space-x-2 px-5 py-2.5 bg-emerald-50 rounded-xl border border-emerald-200 shadow-sm">
              <div className="w-2 h-2 w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-emerald-700">System Online</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {kpis.map((kpi, index) => {
          const IconComponent = kpi.icon
          return (
            <div
              key={index}
              className={`relative p-6 group rounded-2xl bg-white border border-slate-100/80 shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all duration-300 hover:-translate-y-2 ${kpi.shadow}`}
              style={{ animationDelay: `${index * 80}ms` }}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${kpi.bg} opacity-40 rounded-2xl`}></div>
              <div className="relative z-10">
                <div className="flex items-start justify-between mb-5">
                  <div className="flex-1">
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">{kpi.label}</p>
                    <p className="text-3xl font-bold text-slate-900">{kpi.value.toLocaleString()}</p>
                  </div>
                  <div className={`w-12 h-12 bg-gradient-to-br ${kpi.iconBg} rounded-xl flex items-center justify-center shadow-lg icon-circle`}>
                    <IconComponent className="text-white" size={22} />
                  </div>
                </div>
                <div className={`w-full bg-gradient-to-r ${kpi.bg} rounded-full h-2 overflow-hidden shadow-inner`}>
                  <div
                    className={`h-full bg-gradient-to-r ${kpi.gradient} rounded-full transition-all duration-1000 ease-out shadow-sm`}
                    style={{ width: `${Math.min((kpi.value / 100) * 100, 100)}%` }}
                  ></div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

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

  if (loading) return <div className="flex justify-center py-12"><div className="w-12 h-12 border-4 border-brand-primary border-t-transparent rounded-full animate-spin"></div></div>
  if (error) return <div className="card-glass p-6 bg-gradient-to-br from-red-50 to-rose-50 border-red-200"><p className="text-red-600 font-medium">{error}</p><button onClick={fetchInfluencers} className="mt-3 text-sm text-red-700 underline hover:text-red-800 font-medium">Retry</button></div>

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="relative card-glass p-6 hover:shadow-2xl transition-all duration-300 overflow-hidden">
        <div className="absolute top-0 left-0 w-48 h-48 bg-gradient-to-br from-brand-primary/10 to-transparent rounded-full blur-2xl"></div>
        <div className="relative z-10">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gradient mb-1">Influencer Management</h1>
              <p className="text-sm text-slate-500">{influencers.length} influencers registered</p>
            </div>
            <button onClick={fetchInfluencers} className="btn-secondary text-sm">Refresh</button>
          </div>
        </div>
      </div>

      <div className="relative card-glass overflow-hidden hover:shadow-2xl transition-all duration-300">
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tl from-brand-secondary/10 to-transparent rounded-full blur-3xl"></div>
        <div className="relative z-10">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-slate-50/80">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Trust Score</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Profile %</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white/80 divide-y divide-slate-100">
                {influencers.map(inf => (
                  <tr key={inf.id} className={`hover:bg-slate-50 transition-colors ${inf.is_suspended ? 'opacity-60' : ''}`}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-9 h-9 bg-gradient-to-br from-brand-primary to-brand-secondary rounded-xl flex items-center justify-center mr-3 shadow-md">
                          <span className="text-white text-sm font-bold">{(inf.display_name || 'U')[0].toUpperCase()}</span>
                        </div>
                        <span className="text-sm font-semibold text-slate-900">{inf.display_name || 'No name'}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">{inf.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-semibold text-slate-900">{inf.trust_score}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1.5 rounded-xl text-xs font-semibold shadow-sm ${inf.verification_status === 'verified' ? 'bg-emerald-100 text-emerald-800' :
                        inf.verification_status === 'pending' ? 'bg-brand-secondary/10 text-brand-secondary border border-brand-secondary/20' :
                          inf.verification_status === 'rejected' ? 'bg-red-100 text-red-800' :
                            'bg-slate-100 text-slate-800'
                        }`}>
                        {inf.verification_status}
                      </span>
                      {inf.is_suspended && <span className="ml-2 px-3 py-1.5 rounded-xl text-xs font-semibold bg-red-100 text-red-800 shadow-sm">Suspended</span>}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">{inf.profile_completion}%</td>
                    <td className="px-6 py-4 whitespace-nowrap space-x-2">
                      {inf.verification_status !== 'verified' && (
                        <button
                          onClick={() => handleVerify(inf.user_id)}
                          disabled={actionLoading === inf.user_id}
                          className="px-4 py-2 text-xs font-semibold text-white bg-gradient-to-r from-brand-primary to-purple-600 hover:from-purple-600 hover:to-brand-primary rounded-xl disabled:opacity-50 transition-all duration-300 shadow-md hover:shadow-lg hover:scale-105"
                        >
                          {actionLoading === inf.user_id ? '...' : 'Verify'}
                        </button>
                      )}
                      <button
                        onClick={() => handleSuspend(inf.user_id, inf.is_suspended)}
                        disabled={actionLoading === inf.user_id}
                        className={`px-4 py-2 text-xs font-semibold rounded-xl disabled:opacity-50 transition-smooth shadow-md hover:shadow-lg hover:scale-105 ${inf.is_suspended
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
        </div>
        {influencers.length === 0 && (
          <div className="text-center py-12 text-slate-500">No influencers found</div>
        )}
      </div>
    </div>
  )
}

const Brands = () => {
  const [brands, setBrands] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    adminService.getBrands()
      .then(data => { setBrands(data); setLoading(false) })
      .catch(err => { setError(err.message); setLoading(false) })
  }, [])

  if (loading) return <div className="flex justify-center py-12"><div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div></div>
  if (error) return <div className="card-soft p-6 bg-gradient-to-br from-red-50 to-rose-50 border-red-200"><p className="text-red-600 font-medium">{error}</p></div>

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="relative card-glass p-6 hover:shadow-2xl transition-all duration-300 overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-bl from-brand-secondary/10 to-transparent rounded-full blur-2xl"></div>
        <div className="relative z-10">
          <div>
            <h1 className="text-2xl font-bold text-gradient mb-1">Brand Management</h1>
            <p className="text-sm text-slate-500">{brands.length} brands registered</p>
          </div>
        </div>
      </div>

      <div className="relative card-glass overflow-hidden hover:shadow-2xl transition-all duration-300">
        <div className="absolute top-0 left-0 w-80 h-80 bg-gradient-to-br from-brand-primary/10 to-transparent rounded-full blur-3xl"></div>
        <div className="relative z-10">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50/80">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Company</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Industry</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Location</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Campaigns</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white/80 divide-y divide-slate-100">
                {brands.map(brand => (
                  <tr key={brand.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-9 h-9 bg-gradient-to-br from-brand-primary to-brand-secondary rounded-xl flex items-center justify-center mr-3 shadow-md">
                          <span className="text-white text-sm font-bold">{(brand.company_name || 'C')[0].toUpperCase()}</span>
                        </div>
                        <span className="text-sm font-semibold text-slate-900">{brand.company_name || 'No name'}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">{brand.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">{brand.industry || '—'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">{brand.location || '—'}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-3 py-1.5 bg-brand-primary/10 text-brand-primary rounded-xl text-xs font-semibold shadow-sm border border-brand-primary/20">{brand.campaign_count}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1.5 rounded-xl text-xs font-semibold shadow-sm ${brand.status === 'active' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-800'}`}>{brand.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        {brands.length === 0 && (
          <div className="text-center py-12 text-slate-500">No brands found</div>
        )}
      </div>
    </div>
  )
}

const Campaigns = () => {
  const [campaigns, setCampaigns] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    adminService.getCampaigns()
      .then(data => { setCampaigns(data); setLoading(false) })
      .catch(err => { setError(err.message); setLoading(false) })
  }, [])

  if (loading) return <div className="flex justify-center py-12"><div className="w-12 h-12 border-4 border-brand-primary border-t-transparent rounded-full animate-spin"></div></div>
  if (error) return <div className="card-glass p-6 bg-gradient-to-br from-red-50 to-rose-50 border-red-200"><p className="text-red-600 font-medium">{error}</p></div>

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="relative card-glass p-6 hover:shadow-2xl transition-all duration-300 hover:translate-y-[-6px] hover:scale-[1.01] overflow-hidden">
        <div className="absolute bottom-0 left-0 w-56 h-56 bg-gradient-to-tr from-brand-accent/10 to-transparent rounded-full blur-2xl"></div>
        <div className="relative z-10">
          <div>
            <h1 className="text-2xl font-bold text-gradient mb-1">Campaign Oversight</h1>
            <p className="text-sm text-slate-500">{campaigns.length} campaigns across all brands</p>
          </div>
        </div>
      </div>

      {campaigns.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-2 pb-6 px-2">
          {campaigns.map((c, index) => {
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
              <div key={c.id} className={`relative bg-white/90 backdrop-blur-sm rounded-2xl p-6 transition-transform duration-300 hover:-translate-y-1.5 border border-slate-100 ${activeShadow}`}>
                {/* Floating Top-Right Status Badge */}
                <div className="absolute -top-3 -right-3">
                  <span className={`px-4 py-1.5 rounded-xl text-xs font-bold shadow-lg transform -translate-y-1 block ${c.status === 'active' ? 'bg-gradient-to-br from-emerald-400 to-emerald-500 text-white shadow-[0_8px_16px_rgba(16,185,129,0.4)]' :
                    c.status === 'draft' ? 'bg-slate-100 text-slate-700 shadow-[0_8px_16px_rgba(148,163,184,0.4)]' :
                      c.status === 'completed' ? 'bg-gradient-to-br from-brand-primary to-indigo-600 text-white shadow-[0_8px_16px_rgba(99,102,241,0.4)]' :
                        'bg-gradient-to-br from-brand-secondary to-pink-600 text-white shadow-[0_8px_16px_rgba(244,63,110,0.4)]'
                    }`}>
                    {c.status}
                  </span>
                </div>

                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 line-clamp-1">{c.name}</h3>
                    <p className="text-sm text-slate-500 font-medium mt-1">{c.brand_name || '—'} • {c.category || 'No Category'}</p>
                  </div>
                </div>

                <div className="space-y-3 mb-4">
                  <div className="flex justify-between items-center bg-slate-50/50 p-2.5 rounded-xl border border-slate-100">
                    <span className="text-xs text-slate-500 font-medium">Budget</span>
                    <span className="text-sm font-bold text-slate-700">{c.budget_min && c.budget_max ? `₹${c.budget_min} - ₹${c.budget_max}` : '—'}</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100/50">
                  <p className="text-xs text-slate-400 font-semibold mb-2 uppercase tracking-wider">Platforms</p>
                  <div className="flex flex-wrap gap-2">
                    {(c.platforms || []).map(p => (
                      <span key={p} className="px-2.5 py-1 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-600 shadow-sm">
                        {p === 'LinkedIn' || p === 'TikTok' ? 'Facebook' : p}
                      </span>
                    ))}
                    {(!c.platforms || c.platforms.length === 0) && <span className="text-xs text-slate-400 italic">None specified</span>}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <div className="text-center py-12 card-glass">
          <p className="text-slate-500">No campaigns found</p>
        </div>
      )}
    </div>
  )
}

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

  if (loading) return <div className="flex justify-center py-12"><div className="w-10 h-10 border-3 border-brand-primary border-t-transparent rounded-full animate-spin"></div></div>
  if (error) return <div className="card-glass p-6 bg-red-50 border-red-200"><p className="text-red-600 font-medium">{error}</p><button onClick={fetchVerifications} className="mt-2 text-sm text-red-700 underline hover:text-red-800">Retry</button></div>

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="relative card-glass p-6 hover:shadow-2xl transition-all duration-300 overflow-hidden">
        <div className="absolute top-0 left-0 w-64 h-64 bg-gradient-to-br from-brand-secondary/10 to-transparent rounded-full blur-2xl"></div>
        <div className="relative z-10">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gradient mb-1">Verification Requests</h1>
              <p className="text-sm text-slate-500">{verifications.filter(v => v.status === 'pending').length} pending review</p>
            </div>
            <button onClick={fetchVerifications} className="btn-secondary text-sm">Refresh</button>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {verifications.map(vr => (
          <div key={vr.id} className="relative card-glass p-6 hover:shadow-2xl transition-all duration-300 hover:translate-y-[-2px] overflow-hidden">
            <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-brand-primary/10 to-transparent rounded-full blur-2xl"></div>
            <div className="relative z-10">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-lg font-semibold text-slate-900">{vr.influencer_name || 'Unknown Influencer'}</h3>
                    <span className={`px-3 py-1 rounded-lg text-xs font-medium ${vr.status === 'pending' ? 'bg-brand-secondary/10 text-brand-secondary border border-brand-secondary/20' :
                      vr.status === 'approved' ? 'bg-emerald-100 text-emerald-800' :
                        'bg-red-100 text-red-800'
                      }`}>{vr.status}</span>
                  </div>
                  {vr.metrics_snapshot && (
                    <div className="grid grid-cols-3 gap-4 mt-3">
                      <div className="bg-slate-50/80 rounded-lg p-3 text-center">
                        <div className="text-sm font-semibold text-slate-900">{vr.metrics_snapshot.followers?.toLocaleString() || '—'}</div>
                        <div className="text-xs text-slate-500">Followers</div>
                      </div>
                      <div className="bg-slate-50/80 rounded-lg p-3 text-center">
                        <div className="text-sm font-semibold text-slate-900">{vr.metrics_snapshot.engagement_rate || '—'}%</div>
                        <div className="text-xs text-slate-500">Engagement</div>
                      </div>
                      <div className="bg-slate-50/80 rounded-lg p-3 text-center">
                        <div className="text-sm font-semibold text-slate-900">{vr.metrics_snapshot.average_likes?.toLocaleString() || '—'}</div>
                        <div className="text-xs text-slate-500">Avg Likes</div>
                      </div>
                    </div>
                  )}
                  <p className="text-xs text-slate-500 mt-2">
                    Submitted: {new Date(vr.created_at).toLocaleDateString()} at {new Date(vr.created_at).toLocaleTimeString()}
                    {vr.reviewed_at && ` • Reviewed: ${new Date(vr.reviewed_at).toLocaleDateString()}`}
                  </p>
                </div>
                {vr.status === 'pending' && (
                  <div className="flex space-x-2 ml-4">
                    <button
                      onClick={() => handleApprove(vr.id)}
                      disabled={actionLoading === vr.id}
                      className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-brand-primary to-purple-600 hover:from-purple-600 hover:to-brand-primary rounded-lg disabled:opacity-50 transition-all duration-300 shadow-md hover:shadow-lg"
                    >
                      {actionLoading === vr.id ? '...' : 'Approve'}
                    </button>
                    <button
                      onClick={() => handleReject(vr.id)}
                      disabled={actionLoading === vr.id}
                      className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg disabled:opacity-50 transition-smooth shadow-soft hover:shadow-md"
                    >
                      {actionLoading === vr.id ? '...' : 'Reject'}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
        {verifications.length === 0 && (
          <div className="card-glass text-center py-12">
            <p className="text-slate-500">No verification requests</p>
          </div>
        )}
      </div>
    </div>
  )
}

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

  if (loading) return <div className="flex justify-center py-12"><div className="w-10 h-10 border-3 border-brand-primary border-t-transparent rounded-full animate-spin"></div></div>
  if (error) return <div className="card-glass p-6 bg-red-50 border-red-200"><p className="text-red-600 font-medium">{error}</p></div>

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="relative card-glass p-6 hover:shadow-2xl transition-all duration-300 overflow-hidden">
        <div className="absolute bottom-0 right-0 w-56 h-56 bg-gradient-to-tl from-rose-100/20 to-transparent rounded-full blur-2xl"></div>
        <div className="relative z-10">
          <div>
            <h1 className="text-2xl font-bold text-gradient mb-1">Reports & Moderation</h1>
            <p className="text-sm text-slate-500">{reports.filter(r => r.status === 'pending').length} pending reports</p>
          </div>
        </div>
      </div>

      {reports.length > 0 ? (
        <div className="space-y-4">
          {reports.map(report => (
            <div key={report.id} className="relative card-glass p-6 hover:shadow-2xl transition-all duration-300 hover:translate-y-[-2px] overflow-hidden">
              <div className="absolute top-0 left-0 w-48 h-48 bg-gradient-to-br from-brand-accent/10 to-transparent rounded-full blur-2xl"></div>
              <div className="relative z-10">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold text-slate-900">Report #{report.id}</h3>
                      <span className={`px-2 py-1 rounded-lg text-xs font-medium ${report.status === 'pending' ? 'bg-brand-secondary/10 text-brand-secondary border border-brand-secondary/20' : 'bg-emerald-100 text-emerald-800'}`}>{report.status}</span>
                    </div>
                    <p className="text-sm text-slate-600">Type: {report.reported_entity_type} • ID: {report.reported_entity_id}</p>
                    <p className="text-sm text-slate-700 mt-2">{report.reason}</p>
                    <p className="text-xs text-slate-500 mt-1">{new Date(report.created_at).toLocaleDateString()}</p>
                  </div>
                  {report.status === 'pending' && (
                    <button onClick={() => handleReview(report.id)} className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-brand-primary to-purple-600 hover:from-purple-600 hover:to-brand-primary rounded-lg transition-all duration-300 shadow-md hover:shadow-lg">
                      Mark Reviewed
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="card-glass text-center py-12">
          <p className="text-slate-500">No reports submitted</p>
        </div>
      )}
    </div>
  )
}

const PlatformSettings = () => {
  const [loading, setLoading] = useState(null)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)

  const automationTasks = [
    { id: 'recalculate-trust', name: 'Recalculate Trust Scores', description: 'Recalculate trust scores for all influencers based on current metrics', icon: 'BarChart2', color: 'text-indigo-600', bg: 'bg-indigo-50 border-indigo-100' },
    { id: 'downgrade-inactive', name: 'Downgrade Inactive', description: 'Reduce trust scores for influencers who have been inactive', icon: 'TrendingDown', color: 'text-rose-500', bg: 'bg-rose-50 border-rose-100' },
    { id: 'flag-suspicious', name: 'Flag Suspicious', description: 'Automatically flag profiles with suspicious activity patterns', icon: 'Flag', color: 'text-amber-500', bg: 'bg-amber-50 border-amber-100' },
    { id: 'update-completion', name: 'Update Completion', description: 'Recalculate profile completion percentages for all influencers', icon: 'ClipboardCheck', color: 'text-emerald-600', bg: 'bg-emerald-50 border-emerald-100' }
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
    <div className="space-y-6 animate-fade-in">
      <div className="relative card-glass p-6 hover:shadow-2xl transition-all duration-300 overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-brand-primary/10 to-transparent rounded-full blur-2xl"></div>
        <div className="relative z-10">
          <div>
            <h1 className="text-2xl font-bold text-gradient mb-1">Platform Settings</h1>
            <p className="text-sm text-slate-500">Automation and system maintenance tasks</p>
          </div>
        </div>
      </div>

      {result && (
        <div className="card-glass p-4 bg-emerald-50/50 border-emerald-200">
          <p className="text-emerald-700 font-medium">✓ {result}</p>
        </div>
      )}
      {error && (
        <div className="card-glass p-4 bg-red-50/50 border-red-200">
          <p className="text-red-600 font-medium">{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {automationTasks.map(task => {
          const IconComp = {
            'BarChart2': BarChart2,
            'TrendingDown': TrendingDown,
            'Flag': Flag,
            'ClipboardCheck': ClipboardCheck
          }[task.icon] || Settings;

          return (
            <div key={task.id} className="relative card-glass p-6 hover:shadow-2xl transition-all duration-300 hover:translate-y-[-4px] overflow-hidden">
              <div className="absolute bottom-0 right-0 w-40 h-40 bg-gradient-to-tl from-brand-accent/10 to-transparent rounded-full blur-2xl"></div>
              <div className="relative z-10">
                <div className="flex items-start space-x-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 border ${task.bg}`}>
                    <IconComp className={`${task.color} drop-shadow-sm`} size={24} />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-slate-900">{task.name}</h3>
                    <p className="text-sm text-slate-600 mt-1">{task.description}</p>
                    <button
                      onClick={() => handleTrigger(task.id)}
                      disabled={loading === task.id}
                      className="mt-3 px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-brand-primary to-purple-600 hover:from-purple-600 hover:to-brand-primary rounded-lg disabled:opacity-50 transition-all duration-300 shadow-md hover:shadow-lg"
                    >
                      {loading === task.id ? 'Running...' : 'Run Now'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  )
}

export default AdminDashboard
