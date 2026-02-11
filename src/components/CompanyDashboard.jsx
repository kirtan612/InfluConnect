import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Logo from './Logo'
import Notifications from './Notifications'

const CompanyDashboard = () => {
  const navigate = useNavigate()
  const [profileComplete, setProfileComplete] = useState(true) // Set to true for demo
  const [showUserMenu, setShowUserMenu] = useState(false)
  
  // Get tab from URL parameter
  const urlParams = new URLSearchParams(window.location.search)
  const tabFromUrl = urlParams.get('tab')
  const [activeTab, setActiveTab] = useState(tabFromUrl || 'profile')

  // Update tab when URL changes
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const tab = params.get('tab')
    if (tab && tab !== activeTab) {
      setActiveTab(tab)
    }
  }, [window.location.search])

  const handleLogout = () => {
    navigate('/')
  }

  // Auto-redirect to discover after profile completion
  useEffect(() => {
    if (profileComplete && activeTab === 'profile') {
      setActiveTab('discover')
    }
  }, [profileComplete])

  const navigation = [
    { id: 'profile', name: 'Company Profile', icon: '🏢' },
    { id: 'discover', name: 'Discover', icon: '🔍', disabled: !profileComplete },
    { id: 'campaigns', name: 'Campaigns', icon: '📋', disabled: !profileComplete },
    { id: 'requests', name: 'Requests', icon: '📤', disabled: !profileComplete }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation */}
      <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Logo size="md" />
              </div>
            </div>

            {/* Navigation Items */}
            <div className="hidden md:flex items-center space-x-1">
              {navigation.map((item) => (
                <button
                  key={item.id}
                  onClick={() => !item.disabled && setActiveTab(item.id)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 flex items-center space-x-2 hover:scale-105 ${
                    activeTab === item.id
                      ? 'text-brand-teal bg-teal-50 shadow-md transform scale-105'
                      : item.disabled
                      ? 'text-gray-400 cursor-not-allowed'
                      : 'text-gray-600 hover:text-brand-navy hover:bg-gray-50'
                  }`}
                  disabled={item.disabled}
                >
                  <span className="transition-transform duration-300 hover:scale-110">{item.icon}</span>
                  <span>{item.name}</span>
                </button>
              ))}
            </div>

            {/* Notifications & User Menu */}
            <div className="flex items-center space-x-3">
              <Notifications />
              
              {/* User Menu */}
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="w-9 h-9 bg-gradient-to-br from-brand-indigo to-brand-navy rounded-lg flex items-center justify-center overflow-hidden">
                    <img 
                      src="https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=36&h=36&fit=crop&crop=face" 
                      alt="Company Profile" 
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.style.display = 'none'
                        e.target.nextSibling.style.display = 'flex'
                      }}
                    />
                    <span className="text-white text-sm font-semibold hidden">AC</span>
                  </div>
                  <div className="hidden md:block text-left">
                    <div className="text-sm font-medium text-gray-900">Acme Corp</div>
                    <div className="text-xs text-gray-500">Technology</div>
                  </div>
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                
                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <div className="text-sm font-medium text-gray-900">Acme Corporation</div>
                      <div className="text-xs text-gray-500">acme@company.com</div>
                    </div>
                    <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Account Settings</a>
                    <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Billing</a>
                    <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Help Center</a>
                    <div className="border-t border-gray-100 mt-2 pt-2">
                      <button onClick={handleLogout} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Sign out</button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden border-t border-gray-200">
          <div className="px-4 py-2 flex space-x-1 overflow-x-auto">
            {navigation.map((item) => (
              <button
                key={item.id}
                onClick={() => !item.disabled && setActiveTab(item.id)}
                className={`px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap flex items-center space-x-1 ${
                  activeTab === item.id
                    ? 'text-brand-teal bg-teal-50'
                    : item.disabled
                    ? 'text-gray-400'
                    : 'text-gray-600'
                }`}
                disabled={item.disabled}
              >
                <span>{item.icon}</span>
                <span>{item.name}</span>
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'profile' && <CompanyProfile onComplete={setProfileComplete} />}
        {activeTab === 'discover' && <DiscoverInfluencers />}
        {activeTab === 'campaigns' && <Campaigns />}
        {activeTab === 'requests' && <Requests />}
      </main>
    </div>
  )
}

// Company Profile Component
const CompanyProfile = ({ onComplete }) => {
  const [activeProfileTab, setActiveProfileTab] = useState('overview')
  const [profile, setProfile] = useState({
    name: 'Acme Corporation',
    logo: null,
    industry: 'Technology',
    location: 'San Francisco, CA',
    about: 'Leading technology company focused on innovative solutions for modern businesses.',
    interests: ['Tech Reviews', 'Business', 'Lifestyle']
  })

  const completeness = 85

  const profileTabs = [
    { id: 'overview', name: 'Overview' },
    { id: 'interests', name: 'Campaign Interests' },
    { id: 'edit', name: 'Edit Profile' }
  ]

  return (
    <div className="space-y-6">
      {/* Profile Hero */}
      <div className="bg-white rounded-xl shadow-sm p-8">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-6">
            <div className="relative">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=80&h=80&fit=crop&crop=face" 
                  alt="Company Logo" 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.style.display = 'none'
                    e.target.nextSibling.style.display = 'flex'
                  }}
                />
                <span className="text-2xl font-bold text-white hidden">AC</span>
              </div>
              {/* Completeness Ring */}
              <div className="absolute -top-2 -right-2">
                <div className="relative w-8 h-8">
                  <svg className="w-8 h-8 transform -rotate-90" viewBox="0 0 32 32">
                    <circle cx="16" cy="16" r="14" stroke="currentColor" strokeWidth="4" fill="none" className="text-gray-200" />
                    <circle cx="16" cy="16" r="14" stroke="currentColor" strokeWidth="4" fill="none" strokeDasharray={`${completeness * 0.88} 88`} className="text-brand-teal" />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-xs font-semibold text-brand-teal">{completeness}%</span>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{profile.name}</h1>
              <p className="text-gray-600">{profile.industry} • {profile.location}</p>
              <p className="text-sm text-gray-500 mt-1">Profile {completeness}% complete</p>
            </div>
          </div>
          <button className="btn-primary">Complete Profile</button>
        </div>
      </div>

      {/* Profile Tabs */}
      <div className="bg-white rounded-xl shadow-sm">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {profileTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveProfileTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeProfileTab === tab.id
                    ? 'border-brand-teal text-brand-teal'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab.name}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {activeProfileTab === 'overview' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">About</h3>
                <p className="text-gray-600">{profile.about}</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Campaign Interests</h3>
                <div className="flex flex-wrap gap-2">
                  {profile.interests.map((interest, index) => (
                    <span key={index} className="px-3 py-1 bg-brand-teal/10 text-brand-teal rounded-full text-sm">
                      {interest}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeProfileTab === 'interests' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">Campaign Interests</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Categories</label>
                  <div className="space-y-2">
                    {['Tech Reviews', 'Business', 'Lifestyle', 'Fashion', 'Travel'].map((category) => (
                      <label key={category} className="flex items-center">
                        <input type="checkbox" defaultChecked={profile.interests.includes(category)} className="rounded" />
                        <span className="ml-2 text-sm text-gray-700">{category}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Platforms</label>
                  <div className="space-y-2">
                    {['Instagram', 'YouTube', 'TikTok', 'Twitter', 'LinkedIn'].map((platform) => (
                      <label key={platform} className="flex items-center">
                        <input type="checkbox" className="rounded" />
                        <span className="ml-2 text-sm text-gray-700">{platform}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeProfileTab === 'edit' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Company Name</label>
                  <input type="text" defaultValue={profile.name} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-teal focus:border-transparent" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Industry</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-teal focus:border-transparent">
                    <option>Technology</option>
                    <option>Fashion</option>
                    <option>Food & Beverage</option>
                    <option>Travel</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">About</label>
                <textarea rows={3} defaultValue={profile.about} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-teal focus:border-transparent" />
              </div>
              <button className="btn-primary">Save Changes</button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// Discover Influencers Component
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
    {
      id: 1,
      name: 'Sarah Johnson',
      platform: 'Instagram',
      verified: true,
      category: 'Tech Reviews',
      followers: '125K',
      engagement: '4.2%',
      avgViews: '45K',
      pricing: '₹40,000-1,20,000',
      location: 'San Francisco, CA',
      avatar: 'SJ',
      trustScore: 94,
      whyRecommended: ['Matches your tech category', 'High engagement rate'],
      badges: ['Verified Creator', 'Top Performer'],
      bio: 'Tech reviewer focusing on consumer electronics and software',
      socialLinks: {
        instagram: 'https://instagram.com/sarahjohnson',
        youtube: 'https://youtube.com/sarahjohnson',
        facebook: 'https://facebook.com/sarahjohnson'
      },
      recentPosts: [
        { title: 'iPhone 15 Pro Review', views: '89K', engagement: '5.2%' },
        { title: 'Best Laptops 2024', views: '67K', engagement: '4.8%' },
        { title: 'AI Tools for Productivity', views: '45K', engagement: '6.1%' }
      ],
      audienceDemo: {
        ageGroups: { '18-24': 25, '25-34': 45, '35-44': 20, '45+': 10 },
        gender: { male: 60, female: 40 },
        topCountries: ['United States', 'Canada', 'United Kingdom']
      }
    },
    {
      id: 2,
      name: 'Mike Chen',
      platform: 'YouTube',
      verified: true,
      category: 'Business',
      followers: '89K',
      engagement: '5.1%',
      avgViews: '32K',
      pricing: '₹64,000-1,60,000',
      location: 'New York, NY',
      avatar: 'MC',
      trustScore: 91,
      whyRecommended: ['Business content expert', 'Professional audience'],
      badges: ['Verified Creator', 'B2B Specialist'],
      bio: 'Business strategist and entrepreneur sharing insights',
      socialLinks: {
        youtube: 'https://youtube.com/mikechen',
        facebook: 'https://facebook.com/mikechen',
        instagram: 'https://instagram.com/mikechen'
      },
      recentPosts: [
        { title: 'Startup Growth Strategies', views: '45K', engagement: '6.2%' },
        { title: 'B2B Marketing Tips', views: '38K', engagement: '5.8%' },
        { title: 'Leadership in Remote Teams', views: '52K', engagement: '4.9%' }
      ],
      audienceDemo: {
        ageGroups: { '18-24': 15, '25-34': 40, '35-44': 35, '45+': 10 },
        gender: { male: 65, female: 35 },
        topCountries: ['United States', 'Canada', 'Australia']
      }
    },
    {
      id: 3,
      name: 'Emma Davis',
      platform: 'Instagram',
      verified: true,
      category: 'Lifestyle',
      followers: '200K',
      engagement: '6.8%',
      avgViews: '85K',
      pricing: '₹24,000-64,000',
      location: 'Los Angeles, CA',
      avatar: 'ED',
      trustScore: 88,
      whyRecommended: ['Trending content creator', 'Gen Z audience'],
      badges: ['Verified Creator', 'Trending'],
      bio: 'Lifestyle content creator with focus on wellness and productivity',
      socialLinks: {
        instagram: 'https://instagram.com/emmadavis',
        youtube: 'https://youtube.com/emmadavis',
        facebook: 'https://facebook.com/emmadavis'
      },
      recentPosts: [
        { title: 'Morning Routine for Success', views: '120K', engagement: '8.1%' },
        { title: 'Productivity Hacks', views: '95K', engagement: '7.2%' },
        { title: 'Wellness Wednesday Tips', views: '78K', engagement: '6.5%' }
      ],
      audienceDemo: {
        ageGroups: { '18-24': 55, '25-34': 30, '35-44': 10, '45+': 5 },
        gender: { male: 35, female: 65 },
        topCountries: ['United States', 'United Kingdom', 'Canada']
      }
    },
    {
      id: 4,
      name: 'Alex Rodriguez',
      platform: 'LinkedIn',
      verified: true,
      category: 'Business',
      followers: '45K',
      engagement: '3.9%',
      avgViews: '12K',
      pricing: '₹96,000-2,40,000',
      location: 'Austin, TX',
      avatar: 'AR',
      trustScore: 96,
      whyRecommended: ['B2B expertise', 'Executive audience'],
      badges: ['Verified Creator', 'Industry Expert'],
      bio: 'Marketing executive and thought leader in B2B space',
      socialLinks: {
        facebook: 'https://facebook.com/alexrodriguez',
        youtube: 'https://youtube.com/alexrodriguez',
        instagram: 'https://instagram.com/alexrodriguez'
      },
      recentPosts: [
        { title: 'B2B Marketing Trends 2024', views: '18K', engagement: '4.5%' },
        { title: 'Sales Funnel Optimization', views: '15K', engagement: '3.8%' },
        { title: 'Customer Success Stories', views: '22K', engagement: '4.2%' }
      ],
      audienceDemo: {
        ageGroups: { '18-24': 5, '25-34': 35, '35-44': 40, '45+': 20 },
        gender: { male: 70, female: 30 },
        topCountries: ['United States', 'Canada', 'Germany']
      }
    }
  ]

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  const filteredInfluencers = influencers.filter(influencer => {
    if (filters.category !== 'all' && !influencer.category.toLowerCase().includes(filters.category)) return false
    if (filters.platform !== 'all' && influencer.platform.toLowerCase() !== filters.platform) return false
    if (filters.location !== 'all') {
      const locationMap = { sf: 'San Francisco', ny: 'New York', la: 'Los Angeles', austin: 'Austin' }
      if (!influencer.location.includes(locationMap[filters.location])) return false
    }
    return true
  })

  const sortedInfluencers = [...filteredInfluencers].sort((a, b) => {
    if (filters.sortBy === 'engagement') return parseFloat(b.engagement) - parseFloat(a.engagement)
    if (filters.sortBy === 'followers') return parseInt(b.followers) - parseInt(a.followers)
    return 0
  })

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Discover Influencers</h1>
          <p className="text-gray-600 mt-1">Find verified creators that match your brand values</p>
        </div>
        <div className="flex items-center space-x-3">
          <div className="text-sm text-gray-500">
            {sortedInfluencers.length} creators found
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`btn-secondary flex items-center space-x-2 ${
              showFilters ? 'bg-gray-100' : ''
            }`}
          >
            <span>🔍</span>
            <span>Filters</span>
          </button>
        </div>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <select 
                value={filters.category}
                onChange={(e) => handleFilterChange('category', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-teal focus:border-transparent"
              >
                <option value="all">All Categories</option>
                <option value="tech">Tech Reviews</option>
                <option value="business">Business</option>
                <option value="lifestyle">Lifestyle</option>
                <option value="fashion">Fashion</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Platform</label>
              <select 
                value={filters.platform}
                onChange={(e) => handleFilterChange('platform', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-teal focus:border-transparent"
              >
                <option value="all">All Platforms</option>
                <option value="instagram">Instagram</option>
                <option value="youtube">YouTube</option>
                <option value="facebook">Facebook</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
              <select 
                value={filters.location}
                onChange={(e) => handleFilterChange('location', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-teal focus:border-transparent"
              >
                <option value="all">All Locations</option>
                <option value="sf">San Francisco</option>
                <option value="ny">New York</option>
                <option value="la">Los Angeles</option>
                <option value="austin">Austin</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
              <select 
                value={filters.sortBy}
                onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-teal focus:border-transparent"
              >
                <option value="match">Best Match</option>
                <option value="engagement">Highest Engagement</option>
                <option value="followers">Most Followers</option>
                <option value="budget">Budget Fit</option>
              </select>
            </div>
          </div>
          <div className="mt-4 flex justify-end">
            <button 
              onClick={() => setFilters({ category: 'all', platform: 'all', location: 'all', sortBy: 'match' })}
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              Clear all filters
            </button>
          </div>
        </div>
      )}

      {/* Influencer Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {sortedInfluencers.map((influencer) => (
          <div key={influencer.id} className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 overflow-hidden group hover:scale-105">
            {/* Card Header */}
            <div className="p-6 pb-4">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <div className="w-12 h-12 bg-gradient-to-br from-brand-indigo to-brand-navy rounded-xl flex items-center justify-center overflow-hidden transition-transform duration-300 group-hover:scale-110">
                      <img 
                        src={`https://images.unsplash.com/photo-${1500000000000 + influencer.id}?w=48&h=48&fit=crop&crop=face`} 
                        alt={influencer.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.style.display = 'none'
                          e.target.nextSibling.style.display = 'flex'
                        }}
                      />
                      <span className="text-white font-semibold hidden">{influencer.avatar}</span>
                    </div>
                    {influencer.verified && (
                      <div className="absolute -top-1 -right-1 w-5 h-5 bg-brand-teal rounded-full flex items-center justify-center transition-transform duration-300 group-hover:scale-125">
                        <span className="text-white text-xs">✓</span>
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <h3 className="font-semibold text-gray-900 group-hover:text-brand-navy transition-colors">{influencer.name}</h3>
                    </div>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className="text-sm text-gray-600 group-hover:text-gray-800 transition-colors">{influencer.platform}</span>
                      <span className="text-gray-400">•</span>
                      <span className="text-sm text-gray-600 group-hover:text-gray-800 transition-colors">{influencer.category}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs font-medium text-brand-teal">Trust Score</div>
                  <div className="text-lg font-bold text-gray-900 group-hover:text-brand-teal transition-colors">{influencer.trustScore}</div>
                </div>
              </div>

              {/* Bio */}
              <p className="text-sm text-gray-600 mb-4 line-clamp-2">{influencer.bio}</p>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-3 mb-4">
                <div className="text-center p-2 bg-gray-50 rounded-lg">
                  <div className="text-sm font-semibold text-gray-900">{influencer.followers}</div>
                  <div className="text-xs text-gray-500">Followers</div>
                </div>
                <div className="text-center p-2 bg-gray-50 rounded-lg">
                  <div className="text-sm font-semibold text-gray-900">{influencer.engagement}</div>
                  <div className="text-xs text-gray-500">Engagement</div>
                </div>
                <div className="text-center p-2 bg-gray-50 rounded-lg">
                  <div className="text-sm font-semibold text-gray-900">{influencer.avgViews}</div>
                  <div className="text-xs text-gray-500">Avg Views</div>
                </div>
              </div>

              {/* Badges */}
              <div className="flex flex-wrap gap-1 mb-4">
                {influencer.badges.map((badge, index) => (
                  <span key={index} className="px-2 py-1 bg-brand-indigo/10 text-brand-indigo text-xs rounded-full">
                    {badge}
                  </span>
                ))}
              </div>

              {/* Why Recommended */}
              <div className="mb-4">
                <div className="text-xs font-medium text-gray-700 mb-2">Why recommended:</div>
                <div className="space-y-1">
                  {influencer.whyRecommended.map((reason, index) => (
                    <div key={index} className="text-xs text-gray-600 flex items-center">
                      <div className="w-1 h-1 bg-brand-teal rounded-full mr-2 flex-shrink-0"></div>
                      {reason}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Card Footer */}
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
              <div className="flex justify-between items-center">
                <div>
                  <div className="text-sm font-semibold text-gray-900">{influencer.pricing}</div>
                  <div className="text-xs text-gray-500">Per collaboration</div>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setShowProfile(influencer)}
                    className="text-sm text-brand-teal hover:text-brand-navy font-medium"
                  >
                    View Profile
                  </button>
                  <button
                    onClick={() => setSelectedInfluencer(influencer)}
                    className="btn-primary text-sm px-4 py-2"
                  >
                    Send Request
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Load More */}
      <div className="text-center">
        <button className="btn-secondary">
          Load More Influencers
        </button>
      </div>

      {/* Influencer Profile Modal */}
      {showProfile && (
        <InfluencerProfileModal
          influencer={showProfile}
          onClose={() => setShowProfile(null)}
          onSendRequest={() => {
            setSelectedInfluencer(showProfile)
            setShowProfile(null)
          }}
        />
      )}

      {/* Collaboration Request Modal */}
      {selectedInfluencer && (
        <CollaborationModal
          influencer={selectedInfluencer}
          onClose={() => setSelectedInfluencer(null)}
        />
      )}
    </div>
  )
}

// Influencer Profile Modal
const InfluencerProfileModal = ({ influencer, onClose, onSendRequest }) => {
  const [activeTab, setActiveTab] = useState('overview')

  const getSocialIcon = (platform) => {
    const icons = {
      instagram: '📷',
      youtube: '📺',
      tiktok: '🎵',
      linkedin: '💼',
      twitter: '🐦',
      medium: '📝'
    }
    return icons[platform] || '🔗'
  }

  const getSocialColor = (platform) => {
    const colors = {
      instagram: 'bg-pink-100 text-pink-600 hover:bg-pink-200',
      youtube: 'bg-red-100 text-red-600 hover:bg-red-200',
      tiktok: 'bg-gray-100 text-gray-600 hover:bg-gray-200',
      linkedin: 'bg-blue-100 text-blue-600 hover:bg-blue-200',
      twitter: 'bg-sky-100 text-sky-600 hover:bg-sky-200',
      medium: 'bg-green-100 text-green-600 hover:bg-green-200'
    }
    return colors[platform] || 'bg-gray-100 text-gray-600 hover:bg-gray-200'
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-brand-navy to-brand-indigo p-6 text-white">
          <div className="flex justify-between items-start">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center overflow-hidden">
                  <img 
                    src={`https://images.unsplash.com/photo-${1500000000000 + influencer.id}?w=80&h=80&fit=crop&crop=face`} 
                    alt={influencer.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.style.display = 'none'
                      e.target.nextSibling.style.display = 'flex'
                    }}
                  />
                  <span className="text-2xl font-bold hidden">{influencer.avatar}</span>
                </div>
                {influencer.verified && (
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-brand-teal rounded-full flex items-center justify-center">
                    <span className="text-white text-sm">✓</span>
                  </div>
                )}
              </div>
              <div>
                <h2 className="text-2xl font-bold mb-1">{influencer.name}</h2>
                <div className="flex items-center space-x-3 text-white/80">
                  <span>{influencer.platform}</span>
                  <span>•</span>
                  <span>{influencer.category}</span>
                  <span>•</span>
                  <span>{influencer.location}</span>
                </div>
                <div className="flex items-center space-x-4 mt-2">
                  <div className="text-sm">
                    <span className="font-semibold">{influencer.followers}</span> followers
                  </div>
                  <div className="text-sm">
                    <span className="font-semibold">{influencer.engagement}</span> engagement
                  </div>
                  <div className="text-sm">
                    Trust Score: <span className="font-semibold">{influencer.trustScore}</span>
                  </div>
                </div>
              </div>
            </div>
            <button onClick={onClose} className="text-white/80 hover:text-white text-2xl">×</button>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {[
              { id: 'overview', name: 'Overview' },
              { id: 'content', name: 'Recent Content' },
              { id: 'audience', name: 'Audience' },
              { id: 'social', name: 'Social Links' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-brand-teal text-brand-teal'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab.name}
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="p-6 max-h-96 overflow-y-auto">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">About</h3>
                <p className="text-gray-600 leading-relaxed">{influencer.bio}</p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Why Recommended</h3>
                <div className="space-y-2">
                  {influencer.whyRecommended.map((reason, index) => (
                    <div key={index} className="flex items-center text-gray-600">
                      <div className="w-2 h-2 bg-brand-teal rounded-full mr-3"></div>
                      {reason}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Badges & Achievements</h3>
                <div className="flex flex-wrap gap-2">
                  {influencer.badges.map((badge, index) => (
                    <span key={index} className="px-3 py-1 bg-brand-indigo/10 text-brand-indigo rounded-full text-sm font-medium">
                      {badge}
                    </span>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-gray-900">{influencer.followers}</div>
                  <div className="text-sm text-gray-500">Followers</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-gray-900">{influencer.engagement}</div>
                  <div className="text-sm text-gray-500">Engagement Rate</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-gray-900">{influencer.avgViews}</div>
                  <div className="text-sm text-gray-500">Avg Views</div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'content' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Posts</h3>
              {influencer.recentPosts.map((post, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 mb-2">{post.title}</h4>
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <span>{post.views} views</span>
                        <span>•</span>
                        <span>{post.engagement} engagement</span>
                      </div>
                    </div>
                    <button className="text-brand-teal hover:text-brand-navy text-sm font-medium">View Post</button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'audience' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Age Distribution</h3>
                <div className="space-y-3">
                  {Object.entries(influencer.audienceDemo.ageGroups).map(([age, percentage]) => (
                    <div key={age} className="flex items-center">
                      <div className="w-16 text-sm text-gray-600">{age}</div>
                      <div className="flex-1 bg-gray-200 rounded-full h-2 mx-3">
                        <div 
                          className="bg-brand-teal h-2 rounded-full transition-all duration-300"
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                      <div className="w-12 text-sm text-gray-900 font-medium">{percentage}%</div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Gender Split</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">{influencer.audienceDemo.gender.male}%</div>
                    <div className="text-sm text-gray-600">Male</div>
                  </div>
                  <div className="text-center p-4 bg-pink-50 rounded-lg">
                    <div className="text-2xl font-bold text-pink-600">{influencer.audienceDemo.gender.female}%</div>
                    <div className="text-sm text-gray-600">Female</div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Countries</h3>
                <div className="space-y-2">
                  {influencer.audienceDemo.topCountries.map((country, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-gray-900">{country}</span>
                      <span className="text-sm text-gray-600">#{index + 1}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'social' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Social Media Profiles</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {Object.entries(influencer.socialLinks).map(([platform, url]) => (
                  <a
                    key={platform}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex items-center space-x-3 p-4 rounded-lg transition-colors ${getSocialColor(platform)}`}
                  >
                    <span className="text-2xl">{getSocialIcon(platform)}</span>
                    <div>
                      <div className="font-medium capitalize">{platform}</div>
                      <div className="text-sm opacity-75">View Profile</div>
                    </div>
                    <svg className="w-4 h-4 ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 p-6 bg-gray-50">
          <div className="flex justify-between items-center">
            <div>
              <div className="text-lg font-semibold text-gray-900">{influencer.pricing}</div>
              <div className="text-sm text-gray-600">Per collaboration</div>
            </div>
            <div className="flex space-x-3">
              <button onClick={onClose} className="btn-secondary">Close</button>
              <button onClick={onSendRequest} className="btn-primary">Send Collaboration Request</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Collaboration Request Modal
const CollaborationModal = ({ influencer, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full mx-4 p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Send Collaboration Request</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">✕</button>
        </div>

        <div className="mb-4 p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-brand-indigo rounded-full flex items-center justify-center overflow-hidden">
              <img 
                src={`https://images.unsplash.com/photo-${1500000000000 + influencer.id}?w=40&h=40&fit=crop&crop=face`} 
                alt={influencer.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.style.display = 'none'
                  e.target.nextSibling.style.display = 'flex'
                }}
              />
              <span className="text-white font-semibold hidden">{influencer.avatar}</span>
            </div>
            <div>
              <div className="font-medium text-gray-900">{influencer.name}</div>
              <div className="text-sm text-gray-600">{influencer.platform} • {influencer.followers} followers</div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Campaign (Optional)</label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-lg">
              <option>Select a campaign</option>
              <option>Q4 Product Launch</option>
              <option>Brand Awareness</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Message (Optional)</label>
            <textarea
              rows={3}
              placeholder="Tell them about your collaboration idea..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            />
          </div>

          <div className="p-4 bg-blue-50 rounded-lg">
            <div className="text-sm font-medium text-gray-900 mb-2">How you'll appear:</div>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-brand-indigo rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-semibold">AC</span>
              </div>
              <div>
                <div className="text-sm font-medium">Acme Corporation</div>
                <div className="text-xs text-gray-600">Technology • San Francisco</div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex space-x-3 mt-6">
          <button onClick={onClose} className="btn-secondary flex-1">Cancel</button>
          <button className="btn-primary flex-1">Send Request</button>
        </div>
      </div>
    </div>
  )
}

// Campaigns Component
const Campaigns = () => {
  const [showCreateModal, setShowCreateModal] = useState(false)
  
  const campaigns = [
    {
      id: 1,
      name: 'Q4 Product Launch',
      status: 'Active',
      influencers: 5,
      budget: '₹8,00,000',
      created: '2024-01-15',
      description: 'Launch campaign for our new productivity software',
      category: 'Tech Reviews',
      platforms: ['Instagram', 'YouTube'],
      progress: 65
    },
    {
      id: 2,
      name: 'Brand Awareness Campaign',
      status: 'Planning',
      influencers: 0,
      budget: '₹4,00,000',
      created: '2024-01-20',
      description: 'Increase brand visibility in the business sector',
      category: 'Business',
      platforms: ['LinkedIn', 'Twitter'],
      progress: 25
    }
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Campaigns</h1>
          <p className="text-gray-600 mt-1">Organize and track your influencer collaborations</p>
        </div>
        <button 
          onClick={() => setShowCreateModal(true)}
          className="btn-primary flex items-center space-x-2"
        >
          <span>+</span>
          <span>Create Campaign</span>
        </button>
      </div>

      {campaigns.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {campaigns.map((campaign) => (
            <div key={campaign.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{campaign.name}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      campaign.status === 'Active' ? 'bg-green-100 text-green-800' :
                      campaign.status === 'Planning' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {campaign.status}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm mb-3">{campaign.description}</p>
                  
                  {/* Campaign Details */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <span className="w-20 font-medium">Category:</span>
                      <span>{campaign.category}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <span className="w-20 font-medium">Platforms:</span>
                      <div className="flex space-x-1">
                        {campaign.platforms.map((platform, index) => (
                          <span key={index} className="px-2 py-1 bg-gray-100 rounded text-xs">
                            {platform}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <span className="w-20 font-medium">Budget:</span>
                      <span>{campaign.budget}</span>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">Progress</span>
                      <span className="text-gray-900 font-medium">{campaign.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-brand-teal h-2 rounded-full transition-all duration-300"
                        style={{ width: `${campaign.progress}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <div className="text-lg font-semibold text-gray-900">{campaign.influencers}</div>
                      <div className="text-xs text-gray-500">Influencers</div>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <div className="text-lg font-semibold text-gray-900">{new Date(campaign.created).toLocaleDateString()}</div>
                      <div className="text-xs text-gray-500">Created</div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex space-x-2">
                <button className="btn-secondary text-sm px-4 py-2 flex-1">Edit</button>
                <button className="btn-primary text-sm px-4 py-2 flex-1">View Details</button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📋</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No campaigns yet</h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              Create your first campaign to organize and track your influencer collaborations more effectively.
            </p>
            <button 
              onClick={() => setShowCreateModal(true)}
              className="btn-primary"
            >
              Create Your First Campaign
            </button>
          </div>
        </div>
      )}

      {/* Create Campaign Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-lg w-full mx-4 p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-gray-900">Create New Campaign</h3>
              <button onClick={() => setShowCreateModal(false)} className="text-gray-400 hover:text-gray-600">✕</button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Campaign Name</label>
                <input 
                  type="text" 
                  placeholder="e.g., Q1 Product Launch"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-teal focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea 
                  rows={3}
                  placeholder="Describe your campaign goals and objectives..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-teal focus:border-transparent"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-teal focus:border-transparent">
                    <option>Tech Reviews</option>
                    <option>Business</option>
                    <option>Lifestyle</option>
                    <option>Fashion</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Budget</label>
                  <input 
                    type="text" 
                    placeholder="$5,000"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-teal focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Target Platforms</label>
                <div className="grid grid-cols-2 gap-2">
                  {['Instagram', 'YouTube', 'Facebook'].map((platform) => (
                    <label key={platform} className="flex items-center">
                      <input type="checkbox" className="rounded" />
                      <span className="ml-2 text-sm text-gray-700">{platform}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex space-x-3 mt-6">
              <button onClick={() => setShowCreateModal(false)} className="btn-secondary flex-1">Cancel</button>
              <button className="btn-primary flex-1">Create Campaign</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// Requests Component
const Requests = () => {
  const [filter, setFilter] = useState('all')
  const [showProfile, setShowProfile] = useState(null)
  
  const requests = [
    {
      id: 1,
      influencer: 'Sarah Johnson',
      campaign: 'Q4 Product Launch',
      status: 'Pending',
      sent: '2024-01-20',
      avatar: 'SJ',
      platform: 'Instagram',
      followers: '125K',
      message: 'Hi Sarah! We\'d love to collaborate on our new product launch...',
      pricing: '₹40,000-1,20,000'
    },
    {
      id: 2,
      influencer: 'Mike Chen',
      campaign: 'Brand Awareness Campaign',
      status: 'Accepted',
      sent: '2024-01-18',
      avatar: 'MC',
      platform: 'YouTube',
      followers: '89K',
      message: 'Hello Mike! Your business content aligns perfectly with our brand...',
      pricing: '₹64,000-1,60,000',
      acceptedDate: '2024-01-19'
    },
    {
      id: 3,
      influencer: 'Emma Davis',
      campaign: 'Q4 Product Launch',
      status: 'Rejected',
      sent: '2024-01-15',
      avatar: 'ED',
      platform: 'Instagram',
      followers: '200K',
      message: 'Hi Emma! We think your lifestyle content would be perfect...',
      pricing: '₹24,000-64,000',
      rejectedDate: '2024-01-16',
      rejectionReason: 'Schedule conflict with existing commitments'
    }
  ]

  const filteredRequests = filter === 'all' ? requests : requests.filter(req => req.status.toLowerCase() === filter)

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'Accepted': return 'bg-green-100 text-green-800 border-green-200'
      case 'Rejected': return 'bg-red-100 text-red-800 border-red-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Pending': return '🕰️'
      case 'Accepted': return '✅'
      case 'Rejected': return '❌'
      default: return '📝'
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Requests</h1>
          <p className="text-gray-600 mt-1">Track your collaboration requests and responses</p>
        </div>
        
        {/* Filter Tabs */}
        <div className="flex bg-gray-100 rounded-lg p-1">
          {[
            { id: 'all', name: 'All', count: requests.length },
            { id: 'pending', name: 'Pending', count: requests.filter(r => r.status === 'Pending').length },
            { id: 'accepted', name: 'Accepted', count: requests.filter(r => r.status === 'Accepted').length },
            { id: 'rejected', name: 'Rejected', count: requests.filter(r => r.status === 'Rejected').length }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center space-x-2 ${
                filter === tab.id
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <span>{tab.name}</span>
              <span className="bg-gray-200 text-gray-600 px-2 py-0.5 rounded-full text-xs">{tab.count}</span>
            </button>
          ))}
        </div>
      </div>

      {filteredRequests.length > 0 ? (
        <div className="space-y-4">
          {filteredRequests.map((request) => (
            <div key={request.id} className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start space-x-4 flex-1">
                    <div className="relative">
                      <div className="w-12 h-12 bg-gradient-to-br from-brand-indigo to-brand-navy rounded-xl flex items-center justify-center overflow-hidden">
                        <img 
                          src={`https://images.unsplash.com/photo-${1600000000000 + request.id}?w=48&h=48&fit=crop&crop=face`} 
                          alt={request.influencer}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.style.display = 'none'
                            e.target.nextSibling.style.display = 'flex'
                          }}
                        />
                        <span className="text-white font-semibold hidden">{request.avatar}</span>
                      </div>
                      <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-white rounded-full flex items-center justify-center border-2 border-gray-100">
                        <span className="text-xs">{getStatusIcon(request.status)}</span>
                      </div>
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">{request.influencer}</h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(request.status)}`}>
                          {request.status}
                        </span>
                      </div>
                      
                      <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                        <span>{request.platform}</span>
                        <span>•</span>
                        <span>{request.followers} followers</span>
                        <span>•</span>
                        <span>{request.pricing}</span>
                      </div>
                      
                      <div className="mb-3">
                        <div className="text-sm font-medium text-gray-700 mb-1">Campaign:</div>
                        <div className="text-sm text-gray-600">{request.campaign}</div>
                      </div>
                      
                      <div className="mb-3">
                        <div className="text-sm font-medium text-gray-700 mb-1">Message sent:</div>
                        <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                          {request.message}
                        </div>
                      </div>
                      
                      {/* Status-specific information */}
                      {request.status === 'Accepted' && request.acceptedDate && (
                        <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-3">
                          <div className="text-sm font-medium text-green-800 mb-1">✅ Request Accepted</div>
                          <div className="text-sm text-green-700">Accepted on {new Date(request.acceptedDate).toLocaleDateString()}</div>
                        </div>
                      )}
                      
                      {request.status === 'Rejected' && request.rejectedDate && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-3">
                          <div className="text-sm font-medium text-red-800 mb-1">❌ Request Declined</div>
                          <div className="text-sm text-red-700 mb-1">Declined on {new Date(request.rejectedDate).toLocaleDateString()}</div>
                          {request.rejectionReason && (
                            <div className="text-sm text-red-600">Reason: {request.rejectionReason}</div>
                          )}
                        </div>
                      )}
                      
                      <div className="flex items-center justify-between">
                        <div className="text-sm text-gray-500">
                          Sent on {new Date(request.sent).toLocaleDateString()}
                        </div>
                        
                        <div className="flex space-x-2">
                          {request.status === 'Pending' && (
                            <>
                              <button className="text-sm text-gray-600 hover:text-gray-800 font-medium">Edit Request</button>
                              <button className="text-sm text-red-600 hover:text-red-800 font-medium">Cancel</button>
                            </>
                          )}
                          {request.status === 'Accepted' && (
                            <button className="btn-primary text-sm px-4 py-2">View Collaboration</button>
                          )}
                          <button 
                            onClick={() => setShowProfile({
                              id: request.id,
                              name: request.influencer,
                              platform: request.platform,
                              verified: true,
                              category: 'Tech Reviews',
                              followers: request.followers,
                              engagement: '4.2%',
                              avgViews: '45K',
                              pricing: request.pricing,
                              location: 'San Francisco, CA',
                              avatar: request.avatar,
                              trustScore: 94,
                              whyRecommended: ['Matches your tech category', 'High engagement rate'],
                              badges: ['Verified Creator', 'Top Performer'],
                              bio: 'Tech reviewer focusing on consumer electronics and software',
                              socialLinks: {
                                instagram: 'https://instagram.com/sarahjohnson',
                                youtube: 'https://youtube.com/sarahjohnson',
                                twitter: 'https://twitter.com/sarahjohnson'
                              },
                              recentPosts: [
                                { title: 'iPhone 15 Pro Review', views: '89K', engagement: '5.2%' },
                                { title: 'Best Laptops 2024', views: '67K', engagement: '4.8%' }
                              ],
                              audienceDemo: {
                                ageGroups: { '18-24': 25, '25-34': 45, '35-44': 20, '45+': 10 },
                                gender: { male: 60, female: 40 },
                                topCountries: ['United States', 'Canada', 'United Kingdom']
                              }
                            })}
                            className="text-sm text-brand-teal hover:text-brand-navy font-medium"
                          >
                            View Profile
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📤</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {filter === 'all' ? 'No requests sent yet' : `No ${filter} requests`}
            </h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              {filter === 'all' 
                ? 'Start discovering influencers and send your first collaboration request to get started.'
                : `You don't have any ${filter} requests at the moment.`
              }
            </p>
            {filter === 'all' && (
              <button className="btn-primary">Discover Influencers</button>
            )}
          </div>
        </div>
      )}
      {/* Influencer Profile Modal */}
      {showProfile && (
        <InfluencerProfileModal
          influencer={showProfile}
          onClose={() => setShowProfile(null)}
          onSendRequest={() => setShowProfile(null)}
        />
      )}
    </div>
  )
}

export default CompanyDashboard