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
    <div className="min-h-screen bg-gray-50">
      <div className="flex min-h-screen">
        {/* Left Side - Info */}
        <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-900 to-blue-700 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-white/5"></div>
          
          <div className="relative z-10 flex flex-col justify-center px-12 xl:px-16">
            <div className="mb-12">
              <div className="mb-4"><Logo size="lg" variant="icon" /></div>
              <h1 className="text-4xl font-bold text-white mb-4">Complete Your Company Profile</h1>
              <p className="text-xl text-gray-300 leading-relaxed">
                Help influencers discover your brand and start collaborating
              </p>
            </div>
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-8 h-8 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center shadow-lg">
                  <span className="text-xl">🏢</span>
                </div>
                <div>
                  <h3 className="text-white font-semibold mb-1">Tell us about your company</h3>
                  <p className="text-gray-300 text-sm">Share your company name, industry, and location</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-8 h-8 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center shadow-lg">
                  <span className="text-xl">🎯</span>
                </div>
                <div>
                  <h3 className="text-white font-semibold mb-1">Find the right influencers</h3>
                  <p className="text-gray-300 text-sm">Discover and connect with influencers in your industry</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-8 h-8 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center shadow-lg">
                  <span className="text-xl">🚀</span>
                </div>
                <div>
                  <h3 className="text-white font-semibold mb-1">Launch campaigns</h3>
                  <p className="text-gray-300 text-sm">Create campaigns and manage collaborations</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-8">
          <div className="max-w-md w-full">
            <div className="bg-white rounded-xl shadow-lg p-8">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Company Information</h2>
                <p className="text-gray-600">This information will be visible to influencers</p>
              </div>

              {errors.submit && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-600 text-sm">{errors.submit}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Company Name *</label>
                  <input
                    type="text"
                    name="company_name"
                    value={formData.company_name}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.company_name ? 'border-red-500' : 'border-gray-300'}`}
                    placeholder="Your company name"
                    disabled={loading}
                    maxLength="150"
                  />
                  {errors.company_name && <p className="text-red-500 text-xs mt-1">{errors.company_name}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Industry</label>
                  <select
                    name="industry"
                    value={formData.industry}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    disabled={loading}
                  >
                    <option value="">Select an industry (optional)</option>
                    {industries.map(ind => (
                      <option key={ind} value={ind}>{ind}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="City, Country (optional)"
                    disabled={loading}
                    maxLength="200"
                  />
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
                    type="submit"
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
