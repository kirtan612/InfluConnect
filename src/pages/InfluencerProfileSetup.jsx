import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Logo from '../components/Logo'
import influencerService from '../services/influencerService'

const InfluencerProfileSetup = () => {
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    display_name: '',
    bio: '',
    category: '',
    categories: [],
    instagram: '',
    youtube: '',
    facebook: ''
  })
  const [errors, setErrors] = useState({})

  const categories = [
    'Technology',
    'Fashion & Beauty',
    'Food & Beverage',
    'Travel & Tourism',
    'Fitness & Health',
    'Gaming & Entertainment',
    'Business & Finance',
    'Education',
    'Lifestyle',
    'Other'
  ]

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }))
  }

  const handleCategoryToggle = (category) => {
    setFormData(prev => ({
      ...prev,
      categories: prev.categories.includes(category)
        ? prev.categories.filter(c => c !== category)
        : [...prev.categories, category]
    }))
    if (errors.categories) setErrors(prev => ({ ...prev, categories: '' }))
  }

  const validateStep1 = () => {
    const newErrors = {}
    if (!formData.display_name.trim()) newErrors.display_name = 'Display name is required'
    if (!formData.bio.trim()) newErrors.bio = 'Bio is required'
    else if (formData.bio.length < 50) newErrors.bio = 'Bio must be at least 50 characters'
    if (formData.categories.length === 0) newErrors.categories = 'Select at least one category'
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNext = () => {
    if (validateStep1()) {
      setStep(2)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setErrors({})

    try {
      const socialLinks = {}
      if (formData.instagram) socialLinks.instagram = formData.instagram
      if (formData.youtube) socialLinks.youtube = formData.youtube
      if (formData.facebook) socialLinks.facebook = formData.facebook

      const profileData = {
        display_name: formData.display_name,
        bio: formData.bio,
        category: formData.categories.join(', '),
        social_links: Object.keys(socialLinks).length > 0 ? socialLinks : null,
        platforms: formData.categories
      }

      await influencerService.updateProfile(profileData)
      navigate('/influencer/dashboard')
    } catch (err) {
      setErrors({ submit: err.message || 'Failed to save profile' })
    } finally {
      setLoading(false)
    }
  }

  const handleSkip = () => {
    navigate('/influencer/dashboard')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex min-h-screen">
        {/* Left Side - Info */}
        <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-slate-900 to-slate-700 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-white/5"></div>
          
          <div className="relative z-10 flex flex-col justify-center px-12 xl:px-16">
            <div className="mb-12">
              <div className="mb-4"><Logo size="lg" variant="icon" /></div>
              <h1 className="text-4xl font-bold text-white mb-4">Complete Your Profile</h1>
              <p className="text-xl text-gray-300 leading-relaxed">
                Help brands discover you by completing your influencer profile
              </p>
            </div>
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-8 h-8 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center shadow-lg">
                  <span className="text-xl">👤</span>
                </div>
                <div>
                  <h3 className="text-white font-semibold mb-1">Tell us about yourself</h3>
                  <p className="text-gray-300 text-sm">Share your name, bio, and content categories</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-8 h-8 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center shadow-lg">
                  <span className="text-xl">📱</span>
                </div>
                <div>
                  <h3 className="text-white font-semibold mb-1">Connect your socials</h3>
                  <p className="text-gray-300 text-sm">Link your Instagram, YouTube, and Facebook profiles</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-8 h-8 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center shadow-lg">
                  <span className="text-xl">🚀</span>
                </div>
                <div>
                  <h3 className="text-white font-semibold mb-1">Get discovered</h3>
                  <p className="text-gray-300 text-sm">Start receiving collaboration requests from brands</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-8">
          <div className="max-w-md w-full">
            <div className="bg-white rounded-xl shadow-lg p-8">
              {/* Progress Indicator */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Step {step} of 2</span>
                  <span className="text-sm text-gray-500">{step === 1 ? 'Basic Info' : 'Social Links'}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(step / 2) * 100}%` }}
                  ></div>
                </div>
              </div>

              {errors.submit && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-600 text-sm">{errors.submit}</p>
                </div>
              )}

              {step === 1 ? (
                <div className="space-y-4">
                  <div className="text-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Tell Us About Yourself</h2>
                    <p className="text-gray-600">This information will be visible to brands</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Display Name *</label>
                    <input
                      type="text"
                      name="display_name"
                      value={formData.display_name}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.display_name ? 'border-red-500' : 'border-gray-300'}`}
                      placeholder="Your name or brand name"
                      disabled={loading}
                    />
                    {errors.display_name && <p className="text-red-500 text-xs mt-1">{errors.display_name}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Bio *</label>
                    <textarea
                      name="bio"
                      value={formData.bio}
                      onChange={handleInputChange}
                      rows={4}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.bio ? 'border-red-500' : 'border-gray-300'}`}
                      placeholder="Tell brands about yourself and your content... (minimum 50 characters)"
                      maxLength="500"
                      disabled={loading}
                    />
                    <div className="flex justify-between items-center mt-1">
                      {errors.bio && <p className="text-red-500 text-xs">{errors.bio}</p>}
                      <p className="text-xs text-gray-500 ml-auto">{formData.bio.length}/500</p>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Content Categories *</label>
                    <div className="grid grid-cols-2 gap-2 max-h-64 overflow-y-auto p-2 border rounded-lg">
                      {categories.map(cat => (
                        <label key={cat} className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-2 rounded">
                          <input
                            type="checkbox"
                            checked={formData.categories.includes(cat)}
                            onChange={() => handleCategoryToggle(cat)}
                            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                            disabled={loading}
                          />
                          <span className="text-sm text-gray-700">{cat}</span>
                        </label>
                      ))}
                    </div>
                    {errors.categories && <p className="text-red-500 text-xs mt-1">{errors.categories}</p>}
                    {formData.categories.length > 0 && (
                      <p className="text-xs text-gray-500 mt-1">{formData.categories.length} selected</p>
                    )}
                  </div>

                  <div className="flex space-x-3 mt-6">
                    <button
                      type="button"
                      onClick={handleSkip}
                      className="flex-1 py-3 px-4 border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                      disabled={loading}
                    >
                      Skip for Now
                    </button>
                    <button
                      type="button"
                      onClick={handleNext}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-semibold transition-colors"
                      disabled={loading}
                    >
                      Next
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="text-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Connect Your Socials</h2>
                    <p className="text-gray-600">Add your social media profiles (optional)</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <span className="inline-flex items-center space-x-2">
                        <span>📷</span>
                        <span>Instagram</span>
                      </span>
                    </label>
                    <input
                      type="url"
                      name="instagram"
                      value={formData.instagram}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="https://instagram.com/username"
                      disabled={loading}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <span className="inline-flex items-center space-x-2">
                        <span>▶️</span>
                        <span>YouTube</span>
                      </span>
                    </label>
                    <input
                      type="url"
                      name="youtube"
                      value={formData.youtube}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="https://youtube.com/@username"
                      disabled={loading}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <span className="inline-flex items-center space-x-2">
                        <span>📘</span>
                        <span>Facebook</span>
                      </span>
                    </label>
                    <input
                      type="url"
                      name="facebook"
                      value={formData.facebook}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="https://facebook.com/username"
                      disabled={loading}
                    />
                  </div>

                  <div className="flex space-x-3 mt-6">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="flex-1 py-3 px-4 border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                      disabled={loading}
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={loading}
                    >
                      {loading ? 'Saving...' : 'Complete Setup'}
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={handleSkip}
                    className="w-full text-sm text-gray-600 hover:text-gray-800 mt-2"
                    disabled={loading}
                  >
                    Skip and complete later
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default InfluencerProfileSetup
Profile setup
