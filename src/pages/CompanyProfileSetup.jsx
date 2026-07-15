import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Logo from '../components/Logo'
import companyService from '../services/companyService'

const CompanyProfileSetup = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    company_name: '',
    industry: '',
    location: ''
  })
  const [errors, setErrors] = useState({})

  const industries = [
    'Technology',
    'Fashion & Beauty',
    'Food & Beverage',
    'Travel & Tourism',
    'Fitness & Health',
    'Gaming & Entertainment',
    'Business & Finance',
    'Education',
    'Healthcare',
    'Real Estate',
    'Automotive',
    'Retail',
    'Media & Publishing',
    'Other'
  ]

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }))
  }

  const validateForm = () => {
    const newErrors = {}
    if (!formData.company_name.trim()) newErrors.company_name = 'Company name is required'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) return

    setLoading(true)
    setErrors({})

    try {
      const profileData = {
        company_name: formData.company_name,
        industry: formData.industry || null,
        location: formData.location || null
      }

      await companyService.updateProfile(profileData)
      navigate('/company/dashboard')
    } catch (err) {
      setErrors({ submit: err.message || 'Failed to save profile' })
    } finally {
      setLoading(false)
    }
  }

  const handleSkip = () => {
    navigate('/company/dashboard')
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
              <h1 className="text-4xl font-bold mb-6 tracking-tight">Complete Your Company Profile</h1>
              <p className="text-xl text-slate-300 leading-relaxed">
                Help influencers discover your brand and start collaborating effectively.
              </p>
            </div>
            <div className="space-y-8">
              {[
                { icon: '🏢', title: 'Tell us about your company', description: 'Share your company name, industry, and location' },
                { icon: '🎯', title: 'Find the right influencers', description: 'Discover and connect with influencers in your industry' },
                { icon: '🚀', title: 'Launch campaigns', description: 'Create campaigns and manage collaborations efficiently' }
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
              <div className="text-center mb-10">
                <h2 className="text-3xl font-bold text-slate-900 mb-3 tracking-tight">Company Information</h2>
                <p className="text-slate-500">This information will be visible to influencers</p>
              </div>

              {errors.submit && (
                <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl text-center shadow-sm">
                  <p className="text-red-600 text-sm font-medium">{errors.submit}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Company Name *</label>
                  <input
                    type="text"
                    name="company_name"
                    value={formData.company_name}
                    onChange={handleInputChange}
                    className={`input-glass w-full px-4 py-3 rounded-xl focus:ring-2 focus:ring-brand-primary focus:border-transparent transition-all ${errors.company_name ? 'border-red-300 focus:ring-red-200' : ''}`}
                    placeholder="Your company name"
                    disabled={loading}
                    maxLength="150"
                  />
                  {errors.company_name && <p className="text-red-500 text-xs mt-1 ml-1">{errors.company_name}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Industry</label>
                  <select
                    name="industry"
                    value={formData.industry}
                    onChange={handleInputChange}
                    className="input-glass w-full px-4 py-3 rounded-xl focus:ring-2 focus:ring-brand-primary focus:border-transparent transition-all appearance-none bg-no-repeat bg-right pr-10"
                    style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: 'right 0.75rem center', backgroundSize: '1.5em 1.5em' }}
                    disabled={loading}
                  >
                    <option value="">Select an industry (optional)</option>
                    {industries.map(ind => (
                      <option key={ind} value={ind}>{ind}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Location</label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    className="input-glass w-full px-4 py-3 rounded-xl focus:ring-2 focus:ring-brand-primary focus:border-transparent transition-all"
                    placeholder="City, Country (optional)"
                    disabled={loading}
                    maxLength="200"
                  />
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
                    type="submit"
                    className="flex-1 btn-primary py-3.5 px-4 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={loading}
                  >
                    {loading ? 'Saving...' : 'Complete Setup'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CompanyProfileSetup
