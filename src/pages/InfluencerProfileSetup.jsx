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
    <div className="min-h-screen bg-slate-50">
      <div className="flex min-h-screen">
        {/* Left Side - Info */}
        <div className="hidden lg:flex lg:w-1/2 bg-slate-900 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-brand-primary/20 to-brand-secondary/20 mix-blend-overlay"></div>
          {/* Animated Blobs */}
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-primary/30 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2"></div>
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-brand-secondary/30 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/2"></div>

          <div className="relative z-10 flex flex-col justify-center px-16 h-full text-white">
            <div className="mb-12">
              <div className="mb-8"><Logo size="lg" variant="icon" /></div>
              <h1 className="text-4xl font-bold mb-6 tracking-tight">Complete Your Profile</h1>
              <p className="text-xl text-slate-300 leading-relaxed">
                Help brands discover you by completing your influencer profile with authentic details.
              </p>
            </div>
            <div className="space-y-8">
              {[
                { icon: '👤', title: 'Tell us about yourself', description: 'Share your name, bio, and content categories' },
                { icon: '📱', title: 'Connect your socials', description: 'Link your Instagram, YouTube, and Facebook profiles' },
                { icon: '🚀', title: 'Get discovered', description: 'Start receiving collaboration requests from brands' }
              ].map((item, index) => (
                <div key={index} className="flex items-start space-x-5 group">
                  <div className="flex-shrink-0 w-12 h-12 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center shadow-lg border border-white/10 group-hover:bg-white/20 transition-all duration-300">
                    <span className="text-2xl">{item.icon}</span>
                  </div>
                  <div>
                    <h3 className="text-white font-bold text-lg mb-1">{item.title}</h3>
                    <p className="text-slate-400 text-sm">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12 relative bg-slate-50">
          {/* Mobile Background Decoration */}
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none lg:hidden">
            <div className="absolute -top-[20%] -right-[20%] w-[80%] h-[80%] bg-brand-primary/10 rounded-full blur-[80px]"></div>
          </div>

          <div className="max-w-md w-full relative z-10">
            <div className="card-glass p-8 md:p-10">
              {/* Progress Indicator */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-bold text-slate-700">Step {step} of 2</span>
                  <span className="text-sm text-slate-500">{step === 1 ? 'Basic Info' : 'Social Links'}</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                  <div
                    className="bg-brand-primary h-full rounded-full transition-all duration-500 ease-out shadow-lg shadow-brand-primary/30"
                    style={{ width: `${(step / 2) * 100}%` }}
                  ></div>
                </div>
              </div>

              {errors.submit && (
                <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl text-center shadow-sm">
                  <p className="text-red-600 text-sm font-medium">{errors.submit}</p>
                </div>
              )}

              {step === 1 ? (
                <div className="space-y-6">
                  <div className="text-center mb-6">
                    <h2 className="text-3xl font-bold text-slate-900 mb-3 tracking-tight">Tell Us About Yourself</h2>
                    <p className="text-slate-500">This information will be visible to brands</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Display Name *</label>
                    <input
                      type="text"
                      name="display_name"
                      value={formData.display_name}
                      onChange={handleInputChange}
                      className={`input-glass w-full px-4 py-3 rounded-xl focus:ring-2 focus:ring-brand-primary focus:border-transparent transition-all ${errors.display_name ? 'border-red-300 focus:ring-red-200' : ''}`}
                      placeholder="Your name or brand name"
                      disabled={loading}
                    />
                    {errors.display_name && <p className="text-red-500 text-xs mt-1 ml-1">{errors.display_name}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Bio *</label>
                    <textarea
                      name="bio"
                      value={formData.bio}
                      onChange={handleInputChange}
                      rows={4}
                      className={`input-glass w-full px-4 py-3 rounded-xl focus:ring-2 focus:ring-brand-primary focus:border-transparent transition-all resize-none ${errors.bio ? 'border-red-300 focus:ring-red-200' : ''}`}
                      placeholder="Tell brands about yourself and your content... (minimum 50 characters)"
                      maxLength="500"
                      disabled={loading}
                    />
                    <div className="flex justify-between items-center mt-1">
                      {errors.bio ? <p className="text-red-500 text-xs ml-1">{errors.bio}</p> : <div></div>}
                      <p className="text-xs text-slate-400 font-medium">{formData.bio.length}/500</p>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Content Categories *</label>
                    <div className="grid grid-cols-2 gap-2 max-h-60 overflow-y-auto p-2 border border-slate-200 rounded-xl custom-scrollbar">
                      {categories.map(cat => (
                        <label key={cat} className={`flex items-center space-x-3 cursor-pointer p-2.5 rounded-lg transition-colors border ${formData.categories.includes(cat) ? 'bg-brand-primary/5 border-brand-primary/30' : 'hover:bg-slate-50 border-transparent'}`}>
                          <input
                            type="checkbox"
                            checked={formData.categories.includes(cat)}
                            onChange={() => handleCategoryToggle(cat)}
                            className="w-4 h-4 text-brand-primary border-slate-300 rounded focus:ring-brand-primary transition-all"
                            disabled={loading}
                          />
                          <span className={`text-sm font-medium ${formData.categories.includes(cat) ? 'text-brand-primary' : 'text-slate-600'}`}>{cat}</span>
                        </label>
                      ))}
                    </div>
                    {errors.categories && <p className="text-red-500 text-xs mt-1 ml-1">{errors.categories}</p>}
                    {formData.categories.length > 0 && (
                      <p className="text-xs text-brand-primary font-medium mt-2 ml-1">{formData.categories.length} selected</p>
                    )}
                  </div>

                  <div className="flex space-x-3 mt-8">
                    <button
                      type="button"
                      onClick={handleSkip}
                      className="flex-1 py-3.5 px-4 border border-slate-200 rounded-xl font-bold text-slate-600 hover:bg-slate-50 hover:border-slate-300 transition-colors"
                      disabled={loading}
                    >
                      Skip for Now
                    </button>
                    <button
                      type="button"
                      onClick={handleNext}
                      className="flex-1 btn-primary py-3.5 px-4 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={loading}
                    >
                      Next
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="text-center mb-6">
                    <h2 className="text-3xl font-bold text-slate-900 mb-3 tracking-tight">Connect Your Socials</h2>
                    <p className="text-slate-500">Add your social media profiles (optional)</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">
                      <span className="inline-flex items-center space-x-2">
                        <span className="text-lg">📷</span>
                        <span>Instagram</span>
                      </span>
                    </label>
                    <input
                      type="url"
                      name="instagram"
                      value={formData.instagram}
                      onChange={handleInputChange}
                      className="input-glass w-full px-4 py-3 rounded-xl focus:ring-2 focus:ring-brand-primary focus:border-transparent transition-all"
                      placeholder="https://instagram.com/username"
                      disabled={loading}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">
                      <span className="inline-flex items-center space-x-2">
                        <span className="text-lg">▶️</span>
                        <span>YouTube</span>
                      </span>
                    </label>
                    <input
                      type="url"
                      name="youtube"
                      value={formData.youtube}
                      onChange={handleInputChange}
                      className="input-glass w-full px-4 py-3 rounded-xl focus:ring-2 focus:ring-brand-primary focus:border-transparent transition-all"
                      placeholder="https://youtube.com/@username"
                      disabled={loading}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">
                      <span className="inline-flex items-center space-x-2">
                        <span className="text-lg">📘</span>
                        <span>Facebook</span>
                      </span>
                    </label>
                    <input
                      type="url"
                      name="facebook"
                      value={formData.facebook}
                      onChange={handleInputChange}
                      className="input-glass w-full px-4 py-3 rounded-xl focus:ring-2 focus:ring-brand-primary focus:border-transparent transition-all"
                      placeholder="https://facebook.com/username"
                      disabled={loading}
                    />
                  </div>

                  <div className="flex space-x-3 mt-8">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="flex-1 py-3.5 px-4 border border-slate-200 rounded-xl font-bold text-slate-600 hover:bg-slate-50 hover:border-slate-300 transition-colors"
                      disabled={loading}
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      className="flex-1 btn-primary py-3.5 px-4 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={loading}
                    >
                      {loading ? 'Saving...' : 'Complete Setup'}
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={handleSkip}
                    className="w-full text-sm font-semibold text-slate-500 hover:text-slate-700 mt-4 transition-colors"
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
