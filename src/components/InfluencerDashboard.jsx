import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Logo from './Logo'

const InfluencerDashboard = () => {
  const [activeTab, setActiveTab] = useState('profile')
  const [showUserMenu, setShowUserMenu] = useState(false)
  const navigate = useNavigate()

  const handleLogout = () => {
    navigate('/')
  }

  const navigation = [
    { id: 'profile', name: 'My Profile', icon: '👤' },
    { id: 'verification', name: 'Verification', icon: '✓' },
    { id: 'requests', name: 'Requests', icon: '📬' },
    { id: 'campaigns', name: 'Explore Campaigns', icon: '🔍' },
    { id: 'achievements', name: 'Achievements', icon: '🏆' }
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
                  onClick={() => setActiveTab(item.id)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 flex items-center space-x-2 hover:scale-105 ${
                    activeTab === item.id
                      ? 'text-brand-teal bg-teal-50 shadow-md transform scale-105'
                      : 'text-gray-600 hover:text-brand-navy hover:bg-gray-50'
                  }`}
                >
                  <span className="transition-transform duration-300 hover:scale-110">{item.icon}</span>
                  <span>{item.name}</span>
                </button>
              ))}
            </div>

            {/* User Menu */}
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="w-9 h-9 bg-gradient-to-br from-brand-indigo to-brand-navy rounded-lg flex items-center justify-center overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1494790108755-2616b612b786?w=36&h=36&fit=crop&crop=face" 
                    alt="Profile" 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.style.display = 'none'
                      e.target.nextSibling.style.display = 'flex'
                    }}
                  />
                  <span className="text-white text-sm font-semibold hidden">SJ</span>
                </div>
                <div className="hidden md:block text-left">
                  <div className="text-sm font-medium text-gray-900 flex items-center">
                    Sarah Johnson
                    <span className="ml-2 w-4 h-4 bg-brand-teal rounded-full flex items-center justify-center" title="Verified by InfluConnect Admin">
                      <span className="text-white text-xs">✓</span>
                    </span>
                  </div>
                  <div className="text-xs text-gray-500">Tech Reviewer</div>
                </div>
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50">
                  <div className="px-4 py-2 border-b border-gray-100">
                    <div className="text-sm font-medium text-gray-900">Sarah Johnson</div>
                    <div className="text-xs text-gray-500">sarah@example.com</div>
                  </div>
                  <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Account Settings</a>
                  <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Help Center</a>
                  <div className="border-t border-gray-100 mt-2 pt-2">
                    <button onClick={handleLogout} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Sign out</button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden border-t border-gray-200">
          <div className="px-4 py-2 flex space-x-1 overflow-x-auto">
            {navigation.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap flex items-center space-x-1 ${
                  activeTab === item.id
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

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'profile' && <MyProfile />}
        {activeTab === 'verification' && <Verification />}
        {activeTab === 'requests' && <Requests />}
        {activeTab === 'campaigns' && <ExploreCampaigns />}
        {activeTab === 'achievements' && <Achievements />}
      </main>
    </div>
  )
}

// My Profile Component
const MyProfile = () => {
  const [showPublicProfile, setShowPublicProfile] = useState(false)
  const [activeProfileTab, setActiveProfileTab] = useState('overview')
  
  const profile = {
    name: 'Sarah Johnson',
    verified: true,
    category: 'Tech Reviews',
    platforms: ['Instagram', 'YouTube'],
    location: 'San Francisco, CA',
    about: 'Tech reviewer focusing on consumer electronics, software, and emerging technologies. I help my audience make informed decisions about tech products through detailed reviews and comparisons.',
    stats: {
      followers: '125K',
      avgViews: '45K',
      engagement: '4.2%',
      totalPosts: '342',
      avgLikes: '5.2K',
      collaborations: '28'
    },
    completeness: 92,
    joinDate: '2022-03-15',
    responseRate: '98%',
    avgResponseTime: '2 hours'
  }

  const contentImages = [
    { id: 1, title: 'iPhone 15 Pro Review', views: '89K', likes: '4.2K', date: '2024-01-20' },
    { id: 2, title: 'Best Laptops 2024', views: '67K', likes: '3.8K', date: '2024-01-18' },
    { id: 3, title: 'AI Tools Comparison', views: '54K', likes: '2.9K', date: '2024-01-15' },
    { id: 4, title: 'Tech Setup Tour', views: '78K', likes: '4.1K', date: '2024-01-12' },
    { id: 5, title: 'Productivity Apps Review', views: '42K', likes: '2.3K', date: '2024-01-10' },
    { id: 6, title: 'Camera Comparison', views: '91K', likes: '5.1K', date: '2024-01-08' }
  ]

  const profileTabs = [
    { id: 'overview', name: 'Overview', icon: '👤' },
    { id: 'content', name: 'Content Portfolio', icon: '📱' },
    { id: 'analytics', name: 'Analytics', icon: '📊' },
    { id: 'settings', name: 'Profile Settings', icon: '⚙️' }
  ]

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <div className="bg-gradient-to-r from-brand-navy to-brand-indigo rounded-xl shadow-sm p-8 text-white">
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center space-x-6">
            <div className="relative">
              <div className="w-24 h-24 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center overflow-hidden border-2 border-white/30">
                <img 
                  src="https://images.unsplash.com/photo-1494790108755-2616b612b786?w=96&h=96&fit=crop&crop=face" 
                  alt="Profile" 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.style.display = 'none'
                    e.target.nextSibling.style.display = 'flex'
                  }}
                />
                <span className="text-2xl font-bold text-white hidden">SJ</span>
              </div>
              {profile.verified && (
                <div className="absolute -top-2 -right-2 w-7 h-7 bg-brand-teal rounded-full flex items-center justify-center border-2 border-white" title="Verified by InfluConnect Admin">
                  <span className="text-white text-sm font-bold">✓</span>
                </div>
              )}
              {/* Completeness Ring */}
              <div className="absolute -bottom-2 -right-2">
                <div className="relative w-10 h-10">
                  <svg className="w-10 h-10 transform -rotate-90" viewBox="0 0 40 40">
                    <circle cx="20" cy="20" r="16" stroke="currentColor" strokeWidth="3" fill="none" className="text-white/30" />
                    <circle cx="20" cy="20" r="16" stroke="currentColor" strokeWidth="3" fill="none" strokeDasharray={`${profile.completeness * 1.005} 100.5`} className="text-brand-teal" />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-xs font-bold text-white">{profile.completeness}%</span>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <h1 className="text-3xl font-bold mb-2 flex items-center">
                {profile.name}
                {profile.verified && (
                  <span className="ml-3 w-6 h-6 bg-brand-teal rounded-full flex items-center justify-center" title="Verified by InfluConnect Admin">
                    <span className="text-white text-sm font-bold">✓</span>
                  </span>
                )}
              </h1>
              <p className="text-white/90 text-lg mb-2">{profile.category} • {profile.location}</p>
              <div className="flex items-center space-x-4 text-sm text-white/80">
                <span>Joined {new Date(profile.joinDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
                <span>•</span>
                <span>{profile.responseRate} response rate</span>
                <span>•</span>
                <span>{profile.avgResponseTime} avg response</span>
              </div>
            </div>
          </div>
          <div className="flex space-x-3">
            <button className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg font-medium transition-colors backdrop-blur-sm border border-white/30">
              Edit Profile
            </button>
            <button 
              onClick={() => setShowPublicProfile(true)}
              className="bg-white text-brand-navy px-4 py-2 rounded-lg font-medium hover:bg-gray-50 transition-colors"
            >
              Preview Public Profile
            </button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center border border-white/20">
            <div className="text-2xl font-bold">{profile.stats.followers}</div>
            <div className="text-sm text-white/80">Followers</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center border border-white/20">
            <div className="text-2xl font-bold">{profile.stats.avgViews}</div>
            <div className="text-sm text-white/80">Avg Views</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center border border-white/20">
            <div className="text-2xl font-bold">{profile.stats.engagement}</div>
            <div className="text-sm text-white/80">Engagement</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center border border-white/20">
            <div className="text-2xl font-bold">{profile.stats.totalPosts}</div>
            <div className="text-sm text-white/80">Posts</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center border border-white/20">
            <div className="text-2xl font-bold">{profile.stats.avgLikes}</div>
            <div className="text-sm text-white/80">Avg Likes</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center border border-white/20">
            <div className="text-2xl font-bold">{profile.stats.collaborations}</div>
            <div className="text-sm text-white/80">Collaborations</div>
          </div>
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
                className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 transition-colors ${
                  activeProfileTab === tab.id
                    ? 'border-brand-teal text-brand-teal'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.name}</span>
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {activeProfileTab === 'overview' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">About</h3>
                <p className="text-gray-600 leading-relaxed">{profile.about}</p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Content Categories</h3>
                <div className="flex flex-wrap gap-2">
                  {['Tech Reviews', 'Product Unboxing', 'Tutorials', 'Comparisons', 'Industry News'].map((category, index) => (
                    <span key={index} className="px-3 py-1 bg-brand-teal/10 text-brand-teal rounded-full text-sm font-medium">
                      {category}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Platforms</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {profile.platforms.map((platform, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-brand-indigo rounded-lg flex items-center justify-center">
                          <span className="text-white font-semibold text-sm">{platform[0]}</span>
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{platform}</div>
                          <div className="text-sm text-gray-500">Active</div>
                        </div>
                      </div>
                      <span className="text-brand-teal text-sm font-medium">Connected</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeProfileTab === 'content' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900">Content Portfolio</h3>
                <div className="flex space-x-2">
                  <button className="btn-secondary text-sm">Filter</button>
                  <button className="btn-primary text-sm">Add Content</button>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {contentImages.map((content) => (
                  <div key={content.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                    <div className="aspect-video bg-gray-100 flex items-center justify-center relative group overflow-hidden">
                      <img 
                        src={`https://images.unsplash.com/photo-${1550000000000 + content.id}?w=400&h=225&fit=crop`} 
                        alt={content.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.style.display = 'none'
                          e.target.nextSibling.style.display = 'flex'
                        }}
                      />
                      <div className="text-4xl hidden">📱</div>
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 flex items-center justify-center">
                        <button className="bg-white text-gray-900 px-4 py-2 rounded-lg font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                          View Details
                        </button>
                      </div>
                    </div>
                    <div className="p-4">
                      <h4 className="font-semibold text-gray-900 mb-2">{content.title}</h4>
                      <div className="flex items-center justify-between text-sm text-gray-600">
                        <div className="flex items-center space-x-4">
                          <span>{content.views} views</span>
                          <span>{content.likes} likes</span>
                        </div>
                        <span>{new Date(content.date).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeProfileTab === 'analytics' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">Performance Analytics</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-6 text-white">
                  <div className="text-3xl font-bold mb-2">125K</div>
                  <div className="text-blue-100">Total Followers</div>
                  <div className="text-sm text-blue-200 mt-1">+12% this month</div>
                </div>
                <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-6 text-white">
                  <div className="text-3xl font-bold mb-2">4.2%</div>
                  <div className="text-green-100">Engagement Rate</div>
                  <div className="text-sm text-green-200 mt-1">Above average</div>
                </div>
                <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg p-6 text-white">
                  <div className="text-3xl font-bold mb-2">45K</div>
                  <div className="text-purple-100">Avg Views</div>
                  <div className="text-sm text-purple-200 mt-1">+8% this week</div>
                </div>
                <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg p-6 text-white">
                  <div className="text-3xl font-bold mb-2">28</div>
                  <div className="text-orange-100">Collaborations</div>
                  <div className="text-sm text-orange-200 mt-1">This year</div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-6">
                <h4 className="font-semibold text-gray-900 mb-4">Recent Performance</h4>
                <div className="space-y-3">
                  {contentImages.slice(0, 3).map((content) => (
                    <div key={content.id} className="flex items-center justify-between p-3 bg-white rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                          <span className="text-xl">📱</span>
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{content.title}</div>
                          <div className="text-sm text-gray-500">{content.date}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-gray-900">{content.views}</div>
                        <div className="text-sm text-gray-500">views</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeProfileTab === 'settings' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">Profile Settings</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Display Name</label>
                  <input type="text" defaultValue={profile.name} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-teal focus:border-transparent" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-teal focus:border-transparent">
                    <option>Tech Reviews</option>
                    <option>Lifestyle</option>
                    <option>Fashion</option>
                    <option>Travel</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
                <textarea rows={4} defaultValue={profile.about} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-teal focus:border-transparent" />
              </div>
              
              <div className="flex justify-end space-x-3">
                <button className="btn-secondary">Cancel</button>
                <button className="btn-primary">Save Changes</button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Public Profile Modal */}
      {showPublicProfile && (
        <PublicProfileModal 
          profile={profile}
          contentImages={contentImages}
          onClose={() => setShowPublicProfile(false)}
        />
      )}
    </div>
  )
}

// Public Profile Modal
const PublicProfileModal = ({ profile, contentImages, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-900">Public Profile Preview</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">✕</button>
          </div>
          <p className="text-sm text-gray-600 mt-1">This is how brands see your profile</p>
        </div>
        
        <div className="p-6">
          <div className="text-center mb-6">
            <div className="relative inline-block">
              <div className="w-20 h-20 bg-gradient-to-br from-brand-indigo to-brand-navy rounded-xl flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-white">SJ</span>
              </div>
              {profile.verified && (
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-brand-teal rounded-full flex items-center justify-center">
                  <span className="text-white text-sm">✓</span>
                </div>
              )}
            </div>
            <h3 className="text-xl font-bold text-gray-900">{profile.name}</h3>
            <p className="text-gray-600">{profile.category} • {profile.location}</p>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="text-lg font-bold text-gray-900">{profile.stats.followers}</div>
              <div className="text-xs text-gray-500">Followers</div>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="text-lg font-bold text-gray-900">{profile.stats.avgViews}</div>
              <div className="text-xs text-gray-500">Avg Views</div>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="text-lg font-bold text-gray-900">{profile.stats.engagement}</div>
              <div className="text-xs text-gray-500">Engagement</div>
            </div>
          </div>

          <div className="mb-6">
            <h4 className="font-semibold text-gray-900 mb-2">About</h4>
            <p className="text-gray-600 text-sm">{profile.about}</p>
          </div>

          <div className="mb-6">
            <h4 className="font-semibold text-gray-900 mb-2">Platforms</h4>
            <div className="flex flex-wrap gap-2">
              {profile.platforms.map((platform, index) => (
                <span key={index} className="px-2 py-1 bg-brand-teal/10 text-brand-teal rounded-full text-xs">
                  {platform}
                </span>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-gray-900 mb-3">Recent Content</h4>
            <div className="grid grid-cols-4 gap-2">
              {contentImages.map((content) => (
                <div key={content.id} className="bg-gray-100 rounded aspect-square flex items-center justify-center overflow-hidden">
                  <img 
                    src={`https://images.unsplash.com/photo-${1550000000000 + content.id}?w=100&h=100&fit=crop`} 
                    alt={content.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.style.display = 'none'
                      e.target.nextSibling.style.display = 'flex'
                    }}
                  />
                  <div className="text-2xl hidden">📱</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Verification Component
const Verification = () => {
  const [verificationStatus] = useState('approved') // 'pending', 'approved', 'rejected'
  
  const verificationData = {
    status: verificationStatus,
    submittedDate: '2024-01-15',
    approvedDate: verificationStatus === 'approved' ? '2024-01-18' : null,
    rejectionReason: verificationStatus === 'rejected' ? 'Insufficient follower engagement data' : null
  }

  const criteria = [
    'Minimum 10K followers on primary platform',
    'Consistent content creation (3+ posts/week)',
    'Authentic engagement rate above 2%',
    'Complete profile information',
    'No policy violations'
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Verification Status</h1>
        <p className="text-gray-600 mt-1">Your verification is managed by InfluConnect administrators</p>
      </div>

      {/* Status Card */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Current Status</h2>
          <div className={`px-4 py-2 rounded-full text-sm font-medium ${
            verificationStatus === 'approved' ? 'bg-green-100 text-green-800' :
            verificationStatus === 'pending' ? 'bg-yellow-100 text-yellow-800' :
            'bg-red-100 text-red-800'
          }`}>
            {verificationStatus === 'approved' ? '✓ Verified' :
             verificationStatus === 'pending' ? '⏳ Under Review' :
             '❌ Not Verified'}
          </div>
        </div>

        {verificationStatus === 'approved' && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-brand-teal rounded-full flex items-center justify-center">
                <span className="text-white text-xl">✓</span>
              </div>
              <div>
                <h3 className="font-semibold text-green-800">Congratulations! You're verified</h3>
                <p className="text-green-700 text-sm">Approved on {new Date(verificationData.approvedDate).toLocaleDateString()}</p>
                <p className="text-green-600 text-sm mt-1">Your verified badge is now visible to brands</p>
              </div>
            </div>
          </div>
        )}

        {verificationStatus === 'pending' && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xl">⏳</span>
              </div>
              <div>
                <h3 className="font-semibold text-yellow-800">Verification Under Review</h3>
                <p className="text-yellow-700 text-sm">Submitted on {new Date(verificationData.submittedDate).toLocaleDateString()}</p>
                <p className="text-yellow-600 text-sm mt-1">Our team is reviewing your application. This typically takes 3-5 business days.</p>
              </div>
            </div>
          </div>
        )}

        {verificationStatus === 'rejected' && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xl">❌</span>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-red-800">Verification Not Approved</h3>
                <p className="text-red-700 text-sm">Reason: {verificationData.rejectionReason}</p>
                <button className="mt-2 text-sm text-red-600 hover:text-red-800 font-medium">
                  Resubmit Application
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Verification Criteria */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Verification Criteria</h2>
        <p className="text-gray-600 mb-4">To maintain trust and quality, all verifications are reviewed by our admin team based on these criteria:</p>
        
        <div className="space-y-3">
          {criteria.map((criterion, index) => (
            <div key={index} className="flex items-center space-x-3">
              <div className="w-6 h-6 bg-brand-teal/10 rounded-full flex items-center justify-center">
                <span className="text-brand-teal text-sm">✓</span>
              </div>
              <span className="text-gray-700">{criterion}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Badge Preview */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Verified Badge Preview</h2>
        <div className="bg-gray-50 rounded-lg p-6 text-center">
          <div className="inline-flex items-center space-x-2 px-4 py-2 bg-white rounded-lg shadow-sm">
            <span className="font-medium text-gray-900">Sarah Johnson</span>
            <div className="w-5 h-5 bg-brand-teal rounded-full flex items-center justify-center">
              <span className="text-white text-xs">✓</span>
            </div>
          </div>
          <p className="text-sm text-gray-600 mt-3">This badge appears next to your name across the platform</p>
        </div>
      </div>
    </div>
  )
}

// Requests Component
const Requests = () => {
  const [filter, setFilter] = useState('all')
  const [showCompanyProfile, setShowCompanyProfile] = useState(null)

  const requests = [
    {
      id: 1,
      company: 'TechCorp Inc.',
      industry: 'Technology',
      logo: 'TC',
      campaign: 'Q4 Product Launch',
      message: 'Hi Sarah! We love your tech reviews and would like to collaborate on our new smartphone launch.',
      interests: ['Tech Reviews', 'Consumer Electronics'],
      status: 'pending',
      received: '2024-01-20'
    },
    {
      id: 2,
      company: 'StartupXYZ',
      industry: 'Software',
      logo: 'SX',
      campaign: 'App Launch Campaign',
      message: 'Your audience would be perfect for our new productivity app. Interested in a partnership?',
      interests: ['Productivity', 'Software'],
      status: 'pending',
      received: '2024-01-18'
    }
  ]

  const filteredRequests = filter === 'all' ? requests : requests.filter(req => req.status === filter)

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Collaboration Requests</h1>
          <p className="text-gray-600 mt-1">Manage incoming requests from brands</p>
        </div>
        
        <div className="flex bg-gray-100 rounded-lg p-1">
          {[
            { id: 'all', name: 'All', count: requests.length },
            { id: 'pending', name: 'Pending', count: requests.filter(r => r.status === 'pending').length },
            { id: 'accepted', name: 'Accepted', count: 0 },
            { id: 'rejected', name: 'Rejected', count: 0 }
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
            <div key={request.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-brand-indigo to-brand-navy rounded-xl flex items-center justify-center overflow-hidden">
                    <img 
                      src={`https://images.unsplash.com/photo-${1600000000000 + request.id}?w=48&h=48&fit=crop&crop=face`} 
                      alt={request.company}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.style.display = 'none'
                        e.target.nextSibling.style.display = 'flex'
                      }}
                    />
                    <span className="text-white font-semibold hidden">{request.logo}</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h3 className="text-lg font-semibold text-gray-900">{request.company}</h3>
                      <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">{request.industry}</span>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{request.campaign}</p>
                    
                    <div className="mb-3">
                      <h4 className="text-sm font-medium text-gray-700 mb-1">Campaign Interests:</h4>
                      <div className="flex flex-wrap gap-1">
                        {request.interests.map((interest, index) => (
                          <span key={index} className="px-2 py-1 bg-brand-teal/10 text-brand-teal rounded text-xs">
                            {interest}
                          </span>
                        ))}
                      </div>
                    </div>

                    {request.message && (
                      <div className="bg-gray-50 p-3 rounded-lg mb-3">
                        <h4 className="text-sm font-medium text-gray-700 mb-1">Message:</h4>
                        <p className="text-sm text-gray-600">{request.message}</p>
                      </div>
                    )}

                    <p className="text-xs text-gray-500">Received {new Date(request.received).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <button 
                  onClick={() => setShowCompanyProfile(request)}
                  className="text-sm text-brand-teal hover:text-brand-navy font-medium"
                >
                  View Company Profile
                </button>
                <div className="flex space-x-3">
                  <button className="btn-secondary text-sm px-4 py-2">Reject</button>
                  <button className="btn-primary text-sm px-4 py-2">Accept</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📬</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No requests yet</h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              When brands discover your profile, their collaboration requests will appear here.
            </p>
          </div>
        </div>
      )}

      {/* Company Profile Modal */}
      {showCompanyProfile && (
        <CompanyProfileModal 
          company={showCompanyProfile}
          onClose={() => setShowCompanyProfile(null)}
        />
      )}
    </div>
  )
}

// Company Profile Modal (Influencer View)
const CompanyProfileModal = ({ company, onClose }) => {
  const companyData = {
    name: company.company,
    industry: company.industry,
    location: 'San Francisco, CA',
    about: 'Leading technology company focused on innovative consumer electronics and software solutions.',
    interests: ['Tech Reviews', 'Consumer Electronics', 'Software', 'Innovation'],
    activeCampaigns: [
      { name: 'Q4 Product Launch', status: 'Active' },
      { name: 'Brand Awareness', status: 'Planning' }
    ]
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-900">Company Profile</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">✕</button>
          </div>
        </div>
        
        <div className="p-6">
          <div className="flex items-center space-x-4 mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-brand-indigo to-brand-navy rounded-xl flex items-center justify-center overflow-hidden">
              <img 
                src={`https://images.unsplash.com/photo-${1600000000000 + company.id}?w=64&h=64&fit=crop&crop=face`} 
                alt={companyData.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.style.display = 'none'
                  e.target.nextSibling.style.display = 'flex'
                }}
              />
              <span className="text-white font-bold text-lg hidden">{company.logo}</span>
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">{companyData.name}</h3>
              <p className="text-gray-600">{companyData.industry} • {companyData.location}</p>
            </div>
          </div>

          <div className="mb-6">
            <h4 className="font-semibold text-gray-900 mb-2">About</h4>
            <p className="text-gray-600">{companyData.about}</p>
          </div>

          <div className="mb-6">
            <h4 className="font-semibold text-gray-900 mb-2">Campaign Interests</h4>
            <div className="flex flex-wrap gap-2">
              {companyData.interests.map((interest, index) => (
                <span key={index} className="px-3 py-1 bg-brand-teal/10 text-brand-teal rounded-full text-sm">
                  {interest}
                </span>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-gray-900 mb-3">Active Campaigns</h4>
            <div className="space-y-2">
              {companyData.activeCampaigns.map((campaign, index) => (
                <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-900">{campaign.name}</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    campaign.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {campaign.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Explore Campaigns Component
const ExploreCampaigns = () => {
  const [showCompanyProfile, setShowCompanyProfile] = useState(null)
  const [showInterestModal, setShowInterestModal] = useState(null)

  const campaigns = [
    {
      id: 1,
      company: 'TechCorp Inc.',
      logo: 'TC',
      title: 'Smartphone Review Campaign',
      category: 'Tech Reviews',
      platform: 'YouTube',
      location: 'Global',
      budget: '$2,000-5,000',
      description: 'Looking for tech reviewers to create authentic reviews of our latest smartphone.',
      industry: 'Technology'
    },
    {
      id: 2,
      company: 'FashionBrand',
      logo: 'FB',
      title: 'Summer Collection Launch',
      category: 'Fashion',
      platform: 'Instagram',
      location: 'US & Canada',
      budget: '$1,000-3,000',
      description: 'Showcase our new summer collection with authentic lifestyle content.',
      industry: 'Fashion'
    },
    {
      id: 3,
      company: 'FitnessCo',
      logo: 'FC',
      title: 'Wellness App Promotion',
      category: 'Health & Fitness',
      platform: 'TikTok',
      location: 'Worldwide',
      budget: '$500-1,500',
      description: 'Create engaging content showing our fitness app in daily routines.',
      industry: 'Health & Wellness'
    }
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Explore Campaigns</h1>
        <p className="text-gray-600 mt-1">Discover collaboration opportunities from brands</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {campaigns.map((campaign) => (
          <div key={campaign.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-brand-indigo to-brand-navy rounded-xl flex items-center justify-center overflow-hidden">
                <img 
                  src={`https://images.unsplash.com/photo-${1600000000000 + campaign.id}?w=48&h=48&fit=crop&crop=face`} 
                  alt={campaign.company}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.style.display = 'none'
                    e.target.nextSibling.style.display = 'flex'
                  }}
                />
                <span className="text-white font-semibold hidden">{campaign.logo}</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">{campaign.company}</h3>
                <p className="text-sm text-gray-600">{campaign.industry}</p>
              </div>
            </div>

            <h4 className="text-lg font-semibold text-gray-900 mb-2">{campaign.title}</h4>
            <p className="text-gray-600 text-sm mb-4">{campaign.description}</p>

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
                <span className="text-gray-500">Location:</span>
                <span className="text-gray-900">{campaign.location}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Budget:</span>
                <span className="text-gray-900 font-medium">{campaign.budget}</span>
              </div>
            </div>

            <div className="flex space-x-2">
              <button 
                onClick={() => setShowCompanyProfile(campaign)}
                className="btn-secondary text-sm px-3 py-2 flex-1"
              >
                View Company
              </button>
              <button 
                onClick={() => setShowInterestModal(campaign)}
                className="btn-primary text-sm px-3 py-2 flex-1"
              >
                Show Interest
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Company Profile Modal */}
      {showCompanyProfile && (
        <CompanyProfileModal 
          company={showCompanyProfile}
          onClose={() => setShowCompanyProfile(null)}
        />
      )}

      {/* Interest Modal */}
      {showInterestModal && (
        <InterestModal 
          campaign={showInterestModal}
          onClose={() => setShowInterestModal(null)}
        />
      )}
    </div>
  )
}

// Interest Modal
const InterestModal = ({ campaign, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Express Interest</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">✕</button>
        </div>

        <div className="mb-4 p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-brand-indigo to-brand-navy rounded-lg flex items-center justify-center">
              <span className="text-white font-semibold">{campaign.logo}</span>
            </div>
            <div>
              <div className="font-medium text-gray-900">{campaign.title}</div>
              <div className="text-sm text-gray-600">{campaign.company}</div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Why are you interested? (Optional)</label>
            <textarea
              rows={3}
              placeholder="Tell them why you'd be a great fit for this campaign..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-teal focus:border-transparent"
            />
          </div>

          <div className="p-4 bg-blue-50 rounded-lg">
            <div className="text-sm font-medium text-gray-900 mb-2">How you'll appear:</div>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-brand-indigo to-brand-navy rounded-lg flex items-center justify-center">
                <span className="text-white text-sm font-semibold">SJ</span>
              </div>
              <div>
                <div className="text-sm font-medium flex items-center">
                  Sarah Johnson
                  <span className="ml-1 w-3 h-3 bg-brand-teal rounded-full flex items-center justify-center">
                    <span className="text-white text-xs">✓</span>
                  </span>
                </div>
                <div className="text-xs text-gray-600">Tech Reviewer • 125K followers</div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex space-x-3 mt-6">
          <button onClick={onClose} className="btn-secondary flex-1">Cancel</button>
          <button className="btn-primary flex-1">Send Interest</button>
        </div>
      </div>
    </div>
  )
}

// Achievements Component
const Achievements = () => {
  const [showAddModal, setShowAddModal] = useState(false)
  
  const achievements = [
    {
      id: 1,
      title: 'iPhone 15 Pro Unboxing',
      caption: 'First tech reviewer to unbox the iPhone 15 Pro in my city',
      image: '📱',
      date: '2024-01-15'
    },
    {
      id: 2,
      title: 'Tech Conference Speaker',
      caption: 'Spoke at TechCon 2024 about consumer electronics trends',
      image: '🎤',
      date: '2024-01-10'
    },
    {
      id: 3,
      title: '100K Milestone',
      caption: 'Reached 100,000 followers on YouTube!',
      image: '🎉',
      date: '2024-01-05'
    }
  ]

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Achievements</h1>
          <p className="text-gray-600 mt-1">Showcase your milestones and proof of work</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="btn-primary flex items-center space-x-2"
        >
          <span>+</span>
          <span>Add Achievement</span>
        </button>
      </div>

      {achievements.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {achievements.map((achievement) => (
            <div key={achievement.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
              <div className="aspect-video bg-gray-100 flex items-center justify-center overflow-hidden">
                <img 
                  src={`https://images.unsplash.com/photo-${1550000000000 + achievement.id}?w=400&h=225&fit=crop`} 
                  alt={achievement.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.style.display = 'none'
                    e.target.nextSibling.style.display = 'flex'
                  }}
                />
                <span className="text-6xl hidden">{achievement.image}</span>
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 mb-2">{achievement.title}</h3>
                <p className="text-gray-600 text-sm mb-3">{achievement.caption}</p>
                <p className="text-xs text-gray-500">{new Date(achievement.date).toLocaleDateString()}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🏆</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No achievements yet</h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              Start showcasing your milestones, collaborations, and proof of work to build credibility with brands.
            </p>
            <button 
              onClick={() => setShowAddModal(true)}
              className="btn-primary"
            >
              Add Your First Achievement
            </button>
          </div>
        </div>
      )}

      {/* Add Achievement Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Add Achievement</h3>
              <button onClick={() => setShowAddModal(false)} className="text-gray-400 hover:text-gray-600">✕</button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                <input 
                  type="text" 
                  placeholder="e.g., Product Launch Collaboration"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-teal focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Caption</label>
                <textarea 
                  rows={3}
                  placeholder="Describe your achievement..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-teal focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Image</label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <div className="text-4xl mb-2">📷</div>
                  <p className="text-sm text-gray-600">Click to upload image</p>
                </div>
              </div>
            </div>

            <div className="flex space-x-3 mt-6">
              <button onClick={() => setShowAddModal(false)} className="btn-secondary flex-1">Cancel</button>
              <button className="btn-primary flex-1">Add Achievement</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default InfluencerDashboard