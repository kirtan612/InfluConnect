import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Logo from './Logo'
import Notifications from './Notifications'
import LoadingSpinner from './LoadingSpinner'
import ErrorMessage from './ErrorMessage'
import EmptyState from './EmptyState'
import influencerService from '../services/influencerService'
import collaborationService from '../services/collaborationService'

const InfluencerDashboard = () => {
  const [activeTab, setActiveTab] = useState('profile')
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
          <p>Loading...</p>
        </div>
      </div>
    )
  }

  const navigation = [
    { id: 'profile', name: 'My Profile', icon: '👤' },
    { id: 'achievements', name: 'Achievements', icon: '🏆' },
    { id: 'verification', name: 'Verification', icon: '✓' },
    { id: 'campaigns', name: 'Browse Campaigns', icon: '🎯' },
    { id: 'collaborations', name: 'Collaborations', icon: '🤝' },
    { id: 'requests', name: 'Requests', icon: '📬' }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation */}
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
        {activeTab === 'profile' && <MyProfile />}
        {activeTab === 'achievements' && <Achievements />}
        {activeTab === 'verification' && <Verification />}
        {activeTab === 'campaigns' && <BrowseCampaigns />}
        {activeTab === 'collaborations' && <InfluencerCollaborations />}
        {activeTab === 'requests' && <Requests />}
      </main>
    </div>
  )
}

// My Profile Component
const MyProfile = () => {
  const [profile, setProfile] = useState(null)
  const [trustExplanation, setTrustExplanation] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [editing, setEditing] = useState(false)
  const [formData, setFormData] = useState({})

  const fetchProfile = () => {
    setLoading(true)
    setError(null)

    Promise.all([
      influencerService.getProfile(),
      influencerService.getTrustExplanation()
    ])
      .then(([profileData, trustData]) => {
        setProfile(profileData)
        setTrustExplanation(trustData)
        setFormData({
          display_name: profileData.display_name || '',
          bio: profileData.bio || '',
          category: profileData.category || '',
          social_links: profileData.social_links || { instagram: '', youtube: '', tiktok: '' },
          platforms: profileData.platforms || []
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
      const updated = await influencerService.updateProfile(formData)
      setProfile(updated)
      setEditing(false)
      fetchProfile() // Refresh to get updated trust score
    } catch (err) {
      setError(err.message)
    }
  }

  if (loading) return <LoadingSpinner message="Loading profile..." />
  if (error) return <ErrorMessage error={error} onRetry={fetchProfile} />
  if (!profile) return <EmptyState title="No profile" message="Profile not found" />

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-brand-navy to-brand-indigo rounded-xl shadow-sm p-8 text-white">
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center space-x-6">
            <div className="relative">
              <div className="w-24 h-24 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center border-2 border-white/30">
                <span className="text-2xl font-bold text-white">
                  {profile.display_name ? profile.display_name[0].toUpperCase() : 'U'}
                </span>
              </div>
              {profile.verification_status === 'verified' && (
                <div className="absolute -top-2 -right-2 w-7 h-7 bg-brand-teal rounded-full flex items-center justify-center border-2 border-white">
                  <span className="text-white text-sm font-bold">✓</span>
                </div>
              )}
              <div className="absolute -bottom-2 -right-2">
                <div className="relative w-10 h-10">
                  <svg className="w-10 h-10 transform -rotate-90" viewBox="0 0 40 40">
                    <circle cx="20" cy="20" r="16" stroke="currentColor" strokeWidth="3" fill="none" className="text-white/30" />
                    <circle cx="20" cy="20" r="16" stroke="currentColor" strokeWidth="3" fill="none" strokeDasharray={`${profile.profile_completion * 1.005} 100.5`} className="text-brand-teal" />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-xs font-bold text-white">{profile.profile_completion}%</span>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <h1 className="text-3xl font-bold mb-2 flex items-center">
                {profile.display_name || 'No name set'}
                {profile.verification_status === 'verified' && (
                  <span className="ml-3 w-6 h-6 bg-brand-teal rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-bold">✓</span>
                  </span>
                )}
              </h1>
              <p className="text-white/90 text-lg mb-2">{profile.category || 'No category set'}</p>
            </div>
          </div>
          <button
            onClick={() => setEditing(!editing)}
            className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg font-medium transition-colors backdrop-blur-sm border border-white/30"
          >
            {editing ? 'Cancel' : 'Edit Profile'}
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center border border-white/20">
            <div className="text-2xl font-bold">{profile.trust_score}</div>
            <div className="text-sm text-white/80">Trust Score</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center border border-white/20">
            <div className="text-2xl font-bold">{profile.profile_completion}%</div>
            <div className="text-sm text-white/80">Complete</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center border border-white/20">
            <div className="text-2xl font-bold">{profile.verification_status === 'verified' ? '✓' : '○'}</div>
            <div className="text-sm text-white/80">Verified</div>
          </div>
        </div>

        {trustExplanation && (
          <div className="mt-4 bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
            <p className="text-sm text-white/90">
              <span className="font-medium">Trust Score Breakdown:</span> {trustExplanation.calculation_breakdown}
            </p>
            <p className="text-xs text-white/70 mt-1">
              Collaborations: {trustExplanation.collaboration_count} • Profile: {trustExplanation.profile_completion}% • Status: {trustExplanation.verification_status}
            </p>
          </div>
        )}
      </div>

      {editing ? (
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Edit Profile</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Display Name</label>
              <input
                type="text"
                value={formData.display_name}
                onChange={(e) => setFormData({ ...formData, display_name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-teal focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <input
                type="text"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-teal focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
              <textarea
                rows={4}
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-teal focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Social Links</label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Instagram</label>
                  <input
                    type="text"
                    value={formData.social_links?.instagram || ''}
                    onChange={(e) => setFormData({ ...formData, social_links: { ...(formData.social_links || {}), instagram: e.target.value } })}
                    placeholder="@username"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-teal focus:border-transparent text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">YouTube</label>
                  <input
                    type="text"
                    value={formData.social_links?.youtube || ''}
                    onChange={(e) => setFormData({ ...formData, social_links: { ...(formData.social_links || {}), youtube: e.target.value } })}
                    placeholder="channel URL"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-teal focus:border-transparent text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">TikTok</label>
                  <input
                    type="text"
                    value={formData.social_links?.tiktok || ''}
                    onChange={(e) => setFormData({ ...formData, social_links: { ...(formData.social_links || {}), tiktok: e.target.value } })}
                    placeholder="@username"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-teal focus:border-transparent text-sm"
                  />
                </div>
              </div>
            </div>
            <div className="flex justify-end space-x-3">
              <button onClick={() => setEditing(false)} className="btn-secondary">Cancel</button>
              <button onClick={handleUpdate} className="btn-primary">Save Changes</button>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">About</h3>
            <p className="text-gray-600 leading-relaxed">{profile.bio || 'No bio added yet'}</p>
          </div>

          {profile.social_links && Object.keys(profile.social_links).some(k => profile.social_links[k]) && (
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Social Media Profiles</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {profile.social_links.instagram && (
                  <a
                    href={profile.social_links.instagram.startsWith('http') ? profile.social_links.instagram : `https://instagram.com/${profile.social_links.instagram.replace('@', '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-3 p-4 bg-gradient-to-br from-pink-50 to-purple-50 rounded-lg hover:shadow-md transition-shadow border border-pink-100"
                  >
                    <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-purple-600 rounded-lg flex items-center justify-center">
                      <span className="text-white text-lg">📷</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-medium text-gray-500">Instagram</div>
                      <div className="text-sm font-semibold text-gray-900 truncate">{profile.social_links.instagram}</div>
                    </div>
                  </a>
                )}
                {profile.social_links.youtube && (
                  <a
                    href={profile.social_links.youtube.startsWith('http') ? profile.social_links.youtube : `https://youtube.com/${profile.social_links.youtube}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-3 p-4 bg-gradient-to-br from-red-50 to-pink-50 rounded-lg hover:shadow-md transition-shadow border border-red-100"
                  >
                    <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-red-600 rounded-lg flex items-center justify-center">
                      <span className="text-white text-lg">▶️</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-medium text-gray-500">YouTube</div>
                      <div className="text-sm font-semibold text-gray-900 truncate">{profile.social_links.youtube}</div>
                    </div>
                  </a>
                )}
                {profile.social_links.facebook && (
                  <a
                    href={profile.social_links.facebook.startsWith('http') ? profile.social_links.facebook : `https://facebook.com/${profile.social_links.facebook}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-3 p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg hover:shadow-md transition-shadow border border-blue-100"
                  >
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                      <span className="text-white text-lg">📘</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-medium text-gray-500">Facebook</div>
                      <div className="text-sm font-semibold text-gray-900 truncate">{profile.social_links.facebook}</div>
                    </div>
                  </a>
                )}
              </div>
            </div>
          )}

          {profile.platforms && profile.platforms.length > 0 && (
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Content Categories</h3>
              <div className="flex flex-wrap gap-2">
                {profile.platforms.map((platform, index) => (
                  <span
                    key={index}
                    className="px-4 py-2 bg-gradient-to-r from-brand-navy/10 to-brand-teal/10 text-brand-navy rounded-full text-sm font-medium border border-brand-navy/20"
                  >
                    {platform}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// ============================================================================
// Achievements Component
// ============================================================================
const Achievements = () => {
  const [achievements, setAchievements] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    icon: '🏆',
    proof_link: ''
  })

  const iconOptions = ['🏆', '⭐', '🎯', '🚀', '💎', '🔥', '👑', '🎬', '📈', '🤝']

  const fetchAchievements = () => {
    setLoading(true)
    setError(null)
    influencerService.getAchievements()
      .then(data => { setAchievements(data); setLoading(false) })
      .catch(err => { setError(err.message); setLoading(false) })
  }

  useEffect(() => { fetchAchievements() }, [])

  const handleSubmit = async () => {
    if (!formData.title.trim()) {
      setError('Title is required')
      return
    }
    setSubmitting(true)
    setError(null)
    try {
      await influencerService.addAchievement(formData)
      setShowForm(false)
      setFormData({ title: '', description: '', date: '', icon: '🏆', proof_link: '' })
      fetchAchievements()
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this achievement?')) return
    try {
      await influencerService.deleteAchievement(id)
      fetchAchievements()
    } catch (err) {
      setError(err.message)
    }
  }

  if (loading) return <LoadingSpinner message="Loading achievements..." />
  if (error && !achievements.length) return <ErrorMessage error={error} onRetry={fetchAchievements} />

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Achievements</h1>
          <p className="text-gray-600 mt-1">Showcase your milestones and accomplishments</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="btn-primary"
        >
          {showForm ? 'Cancel' : '+ Add Achievement'}
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}

      {showForm && (
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Add Achievement</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Icon</label>
              <div className="flex space-x-2">
                {iconOptions.map(icon => (
                  <button
                    key={icon}
                    onClick={() => setFormData({ ...formData, icon })}
                    className={`w-10 h-10 rounded-lg text-xl flex items-center justify-center transition-all ${formData.icon === icon ? 'bg-brand-teal/20 ring-2 ring-brand-teal scale-110' : 'bg-gray-100 hover:bg-gray-200'
                      }`}
                  >
                    {icon}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Title *</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g., Reached 100K followers"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-teal focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Tell us more about this achievement..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-teal focus:border-transparent"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                <input
                  type="text"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  placeholder="e.g., January 2024"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-teal focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Proof Link</label>
                <input
                  type="url"
                  value={formData.proof_link}
                  onChange={(e) => setFormData({ ...formData, proof_link: e.target.value })}
                  placeholder="https://..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-teal focus:border-transparent"
                />
              </div>
            </div>
            <div className="flex justify-end space-x-3">
              <button onClick={() => setShowForm(false)} className="btn-secondary">Cancel</button>
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="btn-primary"
              >
                {submitting ? 'Adding...' : 'Add Achievement'}
              </button>
            </div>
          </div>
        </div>
      )}

      {achievements.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {achievements.map(ach => (
            <div key={ach.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center text-xl flex-shrink-0">
                    {ach.icon || '🏆'}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{ach.title}</h3>
                    {ach.description && (
                      <p className="text-sm text-gray-600 mt-1">{ach.description}</p>
                    )}
                    {ach.date && (
                      <p className="text-xs text-gray-500 mt-2">{ach.date}</p>
                    )}
                    {ach.proof_link && (
                      <a href={ach.proof_link} target="_blank" rel="noopener noreferrer" className="text-xs text-brand-teal hover:underline mt-1 inline-block">
                        View proof →
                      </a>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => handleDelete(ach.id)}
                  className="text-gray-400 hover:text-red-500 transition-colors p-1"
                  title="Delete"
                >
                  ×
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          icon="🏆"
          title="No achievements yet"
          message="Add your first achievement to showcase your milestones to brands."
          action={{
            label: 'Add Achievement',
            onClick: () => setShowForm(true)
          }}
        />
      )}
    </div>
  )
}

// Verification Component
const Verification = () => {
  const [verificationData, setVerificationData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [showSubmitForm, setShowSubmitForm] = useState(false)
  const [metrics, setMetrics] = useState({
    followers: '',
    engagement_rate: '',
    average_likes: ''
  })

  const fetchVerificationStatus = () => {
    setLoading(true)
    setError(null)

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

  const handleSubmitVerification = async () => {
    setSubmitting(true)
    try {
      await influencerService.submitVerification({
        followers: parseInt(metrics.followers),
        engagement_rate: parseFloat(metrics.engagement_rate),
        average_likes: parseInt(metrics.average_likes)
      })
      setShowSubmitForm(false)
      fetchVerificationStatus()
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return <LoadingSpinner message="Loading verification status..." />
  if (error) return <ErrorMessage error={error} onRetry={fetchVerificationStatus} />

  const status = verificationData?.current_status || 'unverified'

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Verification Status</h1>
        <p className="text-gray-600 mt-1">Your verification is managed by InfluConnect administrators</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Current Status</h2>
          <div className={`px-4 py-2 rounded-full text-sm font-medium ${status === 'verified' ? 'bg-green-100 text-green-800' :
              status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                status === 'rejected' ? 'bg-red-100 text-red-800' :
                  'bg-gray-100 text-gray-800'
            }`}>
            {status === 'verified' ? '✓ Verified' :
              status === 'pending' ? '⏳ Under Review' :
                status === 'rejected' ? '❌ Rejected' :
                  '○ Not Verified'}
          </div>
        </div>

        {status === 'verified' && verificationData.latest_request && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-brand-teal rounded-full flex items-center justify-center">
                <span className="text-white text-xl">✓</span>
              </div>
              <div>
                <h3 className="font-semibold text-green-800">Congratulations! You're verified</h3>
                <p className="text-green-700 text-sm">
                  Approved on {new Date(verificationData.latest_request.reviewed_at).toLocaleDateString()}
                </p>
                <p className="text-green-600 text-sm mt-1">Your verified badge is now visible to brands</p>
              </div>
            </div>
          </div>
        )}

        {status === 'pending' && verificationData.latest_request && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xl">⏳</span>
              </div>
              <div>
                <h3 className="font-semibold text-yellow-800">Verification Under Review</h3>
                <p className="text-yellow-700 text-sm">
                  Submitted on {new Date(verificationData.latest_request.submitted_at).toLocaleDateString()}
                </p>
                <p className="text-yellow-600 text-sm mt-1">Our team is reviewing your application</p>
              </div>
            </div>
          </div>
        )}

        {status === 'rejected' && verificationData.latest_request && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xl">❌</span>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-red-800">Verification Not Approved</h3>
                <p className="text-red-700 text-sm">Reason: {verificationData.latest_request.admin_reason || 'Not specified'}</p>
                <button
                  onClick={() => setShowSubmitForm(true)}
                  className="mt-2 text-sm text-red-600 hover:text-red-800 font-medium"
                >
                  Resubmit Application
                </button>
              </div>
            </div>
          </div>
        )}

        {(!verificationData.latest_request || status === 'unverified') && (
          <div className="text-center py-8">
            <p className="text-gray-600 mb-4">You haven't submitted a verification request yet</p>
            <button
              onClick={() => setShowSubmitForm(true)}
              className="btn-primary"
            >
              Submit Verification Request
            </button>
          </div>
        )}
      </div>

      {showSubmitForm && (
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Submit Verification</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Followers</label>
              <input
                type="number"
                value={metrics.followers}
                onChange={(e) => setMetrics({ ...metrics, followers: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-teal focus:border-transparent"
                placeholder="e.g., 125000"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Engagement Rate (%)</label>
              <input
                type="number"
                step="0.1"
                value={metrics.engagement_rate}
                onChange={(e) => setMetrics({ ...metrics, engagement_rate: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-teal focus:border-transparent"
                placeholder="e.g., 4.2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Average Likes</label>
              <input
                type="number"
                value={metrics.average_likes}
                onChange={(e) => setMetrics({ ...metrics, average_likes: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-teal focus:border-transparent"
                placeholder="e.g., 5200"
              />
            </div>
            <div className="flex justify-end space-x-3">
              <button onClick={() => setShowSubmitForm(false)} className="btn-secondary">Cancel</button>
              <button
                onClick={handleSubmitVerification}
                disabled={submitting}
                className="btn-primary"
              >
                {submitting ? 'Submitting...' : 'Submit Request'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// Browse Campaigns Component
const BrowseCampaigns = () => {
  const [campaigns, setCampaigns] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [categoryFilter, setCategoryFilter] = useState(null)
  const [applying, setApplying] = useState(null)
  const [profile, setProfile] = useState(null)

  const fetchCampaigns = () => {
    setLoading(true)
    setError(null)

    Promise.all([
      influencerService.exploreCampaigns(categoryFilter),
      influencerService.getProfile()
    ])
      .then(([campaignsData, profileData]) => {
        setCampaigns(campaignsData)
        setProfile(profileData)
        setLoading(false)
      })
      .catch(err => {
        setError(err.message)
        setLoading(false)
      })
  }

  useEffect(() => {
    fetchCampaigns()
  }, [categoryFilter])

  const handleApply = async (campaignId) => {
    if (!profile || !profile.id) {
      setError('Profile not loaded')
      return
    }

    setApplying(campaignId)
    try {
      await influencerService.applyToCampaign(campaignId, profile.id)
      alert('Application submitted successfully!')
    } catch (err) {
      setError(err.message)
    } finally {
      setApplying(null)
    }
  }

  if (loading) return <LoadingSpinner message="Loading campaigns..." />
  if (error) return <ErrorMessage error={error} onRetry={fetchCampaigns} />

  const categories = ['Technology', 'Fashion & Beauty', 'Food & Beverage', 'Travel & Tourism', 'Fitness & Health', 'Gaming & Entertainment', 'Business & Finance', 'Education', 'Lifestyle']

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Browse Campaigns</h1>
        <p className="text-gray-600 mt-1">Discover and apply to active brand campaigns</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Category</label>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setCategoryFilter(null)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${!categoryFilter ? 'bg-brand-teal text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
          >
            All
          </button>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${categoryFilter === cat ? 'bg-brand-teal text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {campaigns.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {campaigns.map(campaign => (
            <div key={campaign.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
              <div className="mb-4">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{campaign.name}</h3>
                <p className="text-sm text-gray-600 mb-3">{campaign.description}</p>
                
                <div className="flex flex-wrap gap-2 mb-3">
                  {campaign.category && (
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                      {campaign.category}
                    </span>
                  )}
                  {campaign.platforms && campaign.platforms.length > 0 && campaign.platforms.map((platform, idx) => (
                    <span key={idx} className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-medium">
                      {platform}
                    </span>
                  ))}
                </div>

                <div className="space-y-1 text-sm text-gray-600">
                  {campaign.budget_min && campaign.budget_max && (
                    <p><span className="font-medium">Budget:</span> ${campaign.budget_min} - ${campaign.budget_max}</p>
                  )}
                  <p><span className="font-medium">Status:</span> <span className="text-green-600 font-medium">{campaign.status}</span></p>
                </div>
              </div>

              <button
                onClick={() => handleApply(campaign.id)}
                disabled={applying === campaign.id}
                className="w-full bg-brand-teal hover:bg-teal-600 text-white py-2 px-4 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {applying === campaign.id ? 'Applying...' : 'Apply to Campaign'}
              </button>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          icon="🎯"
          title="No campaigns available"
          message={categoryFilter ? `No campaigns found in ${categoryFilter} category.` : "No active campaigns at the moment. Check back later!"}
        />
      )}
    </div>
  )
}

// Requests Component
const Requests = () => {
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [filter, setFilter] = useState('all')
  const [actionLoading, setActionLoading] = useState(null)

  const fetchRequests = () => {
    setLoading(true)
    setError(null)

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
    setActionLoading(requestId)
    try {
      await influencerService.updateRequestStatus(requestId, status)
      fetchRequests()
    } catch (err) {
      setError(err.message)
    } finally {
      setActionLoading(null)
    }
  }

  if (loading) return <LoadingSpinner message="Loading requests..." />
  if (error) return <ErrorMessage error={error} onRetry={fetchRequests} />

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
            { id: 'accepted', name: 'Accepted', count: requests.filter(r => r.status === 'accepted').length },
            { id: 'rejected', name: 'Rejected', count: requests.filter(r => r.status === 'rejected').length }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center space-x-2 ${filter === tab.id
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
            <div key={request.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{request.campaign_name}</h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${request.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        request.status === 'accepted' ? 'bg-green-100 text-green-800' :
                          'bg-red-100 text-red-800'
                      }`}>
                      {request.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-1">
                    <span className="font-medium">Brand:</span> {request.brand_name}
                  </p>
                  <p className="text-xs text-gray-500">
                    Received: {new Date(request.created_at).toLocaleDateString()} at {new Date(request.created_at).toLocaleTimeString()}
                  </p>
                </div>
              </div>

              {request.status === 'pending' && (
                <div className="flex justify-end space-x-3 pt-4 border-t border-gray-100">
                  <button
                    onClick={() => handleUpdateStatus(request.id, 'rejected')}
                    disabled={actionLoading === request.id}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors disabled:opacity-50"
                  >
                    {actionLoading === request.id ? '...' : 'Reject'}
                  </button>
                  <button
                    onClick={() => handleUpdateStatus(request.id, 'accepted')}
                    disabled={actionLoading === request.id}
                    className="px-4 py-2 text-sm font-medium text-white bg-brand-teal hover:bg-teal-600 rounded-lg transition-colors disabled:opacity-50"
                  >
                    {actionLoading === request.id ? '...' : 'Accept'}
                  </button>
                </div>
              )}

              {request.status === 'accepted' && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <div className="flex items-center text-sm text-green-700 bg-green-50 px-3 py-2 rounded-lg">
                    <span className="mr-2">✓</span>
                    <span>You accepted this collaboration request</span>
                  </div>
                </div>
              )}

              {request.status === 'rejected' && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <div className="flex items-center text-sm text-red-700 bg-red-50 px-3 py-2 rounded-lg">
                    <span className="mr-2">✕</span>
                    <span>You declined this collaboration request</span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          icon="📬"
          title="No requests"
          message={filter === 'all' ? "You haven't received any collaboration requests yet." : `No ${filter} requests found.`}
        />
      )}
    </div>
  )
}

// Influencer Collaborations Component
const InfluencerCollaborations = () => {
  const [collaborations, setCollaborations] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedCollab, setSelectedCollab] = useState(null)
  const [showSubmit, setShowSubmit] = useState(false)

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
      'ACTIVE': 'Active - Waiting for deliverables',
      'DELIVERABLES_SET': 'Ready to work',
      'CONTENT_SUBMITTED': 'Content submitted - Under review',
      'CONTENT_APPROVED': 'Content approved',
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
        <h1 className="text-3xl font-bold text-gray-900">My Collaborations</h1>
        <p className="text-gray-600 mt-1">Track and manage your ongoing collaborations</p>
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
                  </div>
                  <p className="text-sm text-gray-600">Campaign ID: {collab.campaign_id}</p>
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
                <div className="mb-4 p-4 bg-purple-50 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">📋 Deliverables</h4>
                  <p className="text-sm text-gray-700 mb-2">{collab.deliverables.description}</p>
                  {collab.deliverables.requirements && (
                    <ul className="space-y-1 mb-2">
                      {collab.deliverables.requirements.map((req, idx) => (
                        <li key={idx} className="text-sm text-gray-600 flex items-start">
                          <span className="text-brand-teal mr-2">✓</span>
                          {req}
                        </li>
                      ))}
                    </ul>
                  )}
                  {collab.deadline && (
                    <p className="text-xs text-gray-500 mt-2">
                      ⏰ Deadline: {new Date(collab.deadline).toLocaleDateString()} at {new Date(collab.deadline).toLocaleTimeString()}
                    </p>
                  )}
                </div>
              )}

              {/* Submitted Content */}
              {collab.content_links && collab.content_links.length > 0 && (
                <div className="mb-4 p-4 bg-green-50 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">✅ Your Submitted Content</h4>
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

              {/* Approval Feedback */}
              {collab.deliverables?.approval_feedback && (
                <div className="mb-4 p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">💬 Brand Feedback</h4>
                  <p className="text-sm text-gray-700">{collab.deliverables.approval_feedback}</p>
                </div>
              )}

              {/* Payment Status */}
              {collab.payment_status === 'RELEASED' && (
                <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-sm text-green-800 font-medium">
                    💰 Payment has been released!
                  </p>
                </div>
              )}

              {/* Actions */}
              <div className="flex space-x-3">
                {collab.status === 'DELIVERABLES_SET' && (
                  <button
                    onClick={() => {
                      setSelectedCollab(collab)
                      setShowSubmit(true)
                    }}
                    className="btn-primary text-sm"
                  >
                    Submit Content
                  </button>
                )}
                {collab.status === 'COMPLETED' && (
                  <div className="text-sm text-gray-600">
                    🎉 Collaboration completed successfully!
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          icon="🤝"
          title="No active collaborations"
          message="You don't have any active collaborations yet. Accept collaboration requests to get started!"
        />
      )}

      {/* Submit Content Modal */}
      {showSubmit && selectedCollab && (
        <SubmitContentModal
          collaboration={selectedCollab}
          onClose={() => {
            setShowSubmit(false)
            setSelectedCollab(null)
          }}
          onSuccess={() => {
            setShowSubmit(false)
            setSelectedCollab(null)
            fetchCollaborations()
          }}
        />
      )}
    </div>
  )
}

// Submit Content Modal Component
const SubmitContentModal = ({ collaboration, onClose, onSuccess }) => {
  const [contentLinks, setContentLinks] = useState([
    { url: '', platform: 'Instagram', description: '' }
  ])
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)

  const handleAddLink = () => {
    setContentLinks([...contentLinks, { url: '', platform: 'Instagram', description: '' }])
  }

  const handleLinkChange = (index, field, value) => {
    const newLinks = [...contentLinks]
    newLinks[index][field] = value
    setContentLinks(newLinks)
  }

  const handleRemoveLink = (index) => {
    const newLinks = contentLinks.filter((_, i) => i !== index)
    setContentLinks(newLinks)
  }

  const handleSubmit = async () => {
    const validLinks = contentLinks.filter(link => link.url.trim())
    
    if (validLinks.length === 0) {
      setError('At least one content link is required')
      return
    }

    setSubmitting(true)
    setError(null)

    try {
      await collaborationService.submitContent(collaboration.id, {
        content_links: validLinks
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
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Submit Content</h3>
        
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
            {error}
          </div>
        )}

        <div className="space-y-4">
          {contentLinks.map((link, index) => (
            <div key={index} className="p-4 border border-gray-200 rounded-lg">
              <div className="flex justify-between items-center mb-3">
                <h4 className="font-medium text-gray-900">Content #{index + 1}</h4>
                {contentLinks.length > 1 && (
                  <button
                    onClick={() => handleRemoveLink(index)}
                    className="text-red-600 hover:bg-red-50 px-2 py-1 rounded"
                  >
                    Remove
                  </button>
                )}
              </div>
              
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Platform</label>
                  <select
                    value={link.platform}
                    onChange={(e) => handleLinkChange(index, 'platform', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-teal focus:border-transparent"
                  >
                    <option value="Instagram">Instagram</option>
                    <option value="YouTube">YouTube</option>
                    <option value="TikTok">TikTok</option>
                    <option value="LinkedIn">LinkedIn</option>
                    <option value="Twitter">Twitter</option>
                    <option value="Facebook">Facebook</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Content URL</label>
                  <input
                    type="url"
                    value={link.url}
                    onChange={(e) => handleLinkChange(index, 'url', e.target.value)}
                    placeholder="https://..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-teal focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <input
                    type="text"
                    value={link.description}
                    onChange={(e) => handleLinkChange(index, 'description', e.target.value)}
                    placeholder="Brief description of the content"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-teal focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          ))}

          <button
            onClick={handleAddLink}
            className="text-sm text-brand-teal hover:text-teal-700 font-medium"
          >
            + Add Another Content Link
          </button>
        </div>

        <div className="flex justify-end space-x-3 mt-6">
          <button onClick={onClose} className="btn-secondary">Cancel</button>
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="btn-primary"
          >
            {submitting ? 'Submitting...' : 'Submit Content'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default InfluencerDashboard
