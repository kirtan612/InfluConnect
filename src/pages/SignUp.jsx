import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Logo from '../components/Logo'

const SignUp = () => {
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [selectedRole, setSelectedRole] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [profileImage, setProfileImage] = useState(null)
  const [profileImagePreview, setProfileImagePreview] = useState(null)
  const [formData, setFormData] = useState({
    // Common fields
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    countryCode: '+91',
    
    // Company specific
    brandName: '',
    website: '',
    targetIndustries: [],
    
    // Influencer specific
    birthDate: '',
    gender: '',
    categories: [],
    bio: '',
    instagram: '',
    youtube: '',
    facebook: ''
  })
  const [errors, setErrors] = useState({})



  const industries = ['Fashion', 'Beauty', 'Travel', 'Lifestyle', 'Food', 'Technology', 'Fitness', 'Entertainment', 'Parenting', 'Luxury', 'Sports', 'Others']
  
  const categories = ['Technology', 'Fashion & Beauty', 'Food & Beverage', 'Travel & Tourism', 'Fitness & Health', 'Gaming & Entertainment', 'Business & Finance', 'Education', 'Lifestyle', 'Other']

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }))
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      if (file.size > 5000000) {
        setErrors(prev => ({ ...prev, profileImage: 'Image size must be less than 5MB' }))
        return
      }
      setProfileImage(file)
      setProfileImagePreview(URL.createObjectURL(file))
      if (errors.profileImage) setErrors(prev => ({ ...prev, profileImage: '' }))
    }
  }

  const handleIndustryToggle = (industry) => {
    setFormData(prev => ({
      ...prev,
      targetIndustries: prev.targetIndustries.includes(industry)
        ? prev.targetIndustries.filter(i => i !== industry)
        : [...prev.targetIndustries, industry]
    }))
    if (errors.targetIndustries) setErrors(prev => ({ ...prev, targetIndustries: '' }))
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

  const validateStep2 = () => {
    const newErrors = {}
    
    if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required'
    if (!formData.email.trim()) newErrors.email = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Invalid email format'
    if (!formData.password) newErrors.password = 'Password is required'
    else if (formData.password.length < 8) newErrors.password = 'Password must be at least 8 characters'
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match'
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required'
    else if (!/^\d{10}$/.test(formData.phone)) newErrors.phone = 'Phone number must be 10 digits'
    
    if (selectedRole === 'company') {
      if (formData.targetIndustries.length === 0) newErrors.targetIndustries = 'Select at least one industry'
    } else {
      if (!formData.birthDate) newErrors.birthDate = 'Birth date is required'
      if (!formData.gender) newErrors.gender = 'Gender is required'
      if (formData.categories.length === 0) newErrors.categories = 'Select at least one category'
      if (!formData.bio.trim()) newErrors.bio = 'Bio is required'
      else if (formData.bio.length < 50) newErrors.bio = 'Bio must be at least 50 characters'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (validateStep2()) {
      console.log('Account created:', { ...formData, role: selectedRole })
      navigate(selectedRole === 'company' ? '/company/dashboard' : '/influencer/dashboard')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <style>{`
        input[type="password"]::-ms-reveal,
        input[type="password"]::-ms-clear {
          display: none;
        }
      `}</style>
      <div className="flex min-h-screen">
        <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-slate-900 to-slate-700 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-white/5"></div>
          
          <div className="relative z-10 flex flex-col justify-center px-12 xl:px-16">
            <div className="mb-12">
              <div className="mb-4"><Logo size="lg" variant="icon" /></div>
              <h1 className="text-4xl font-bold text-white mb-4">Welcome to InfluConnect</h1>
              <p className="text-xl text-gray-300 leading-relaxed">The trust-first platform connecting verified influencers with authentic brands</p>
            </div>
            <div className="space-y-6">
              {[
                { icon: '✓', title: 'Verified influencers', description: 'Every creator goes through our rigorous verification process' },
                { icon: '📊', title: 'Transparent metrics', description: 'Real engagement data and authentic audience insights' },
                { icon: '🛡️', title: 'Trust-first discovery', description: 'Quality connections built on verified credibility' },
                { icon: '🚫', title: 'No spam or fake data', description: 'Clean, reliable platform free from bots and fake accounts' }
              ].map((item, index) => (
                <div key={index} className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center shadow-lg">
                    <span className="text-xl">{item.icon}</span>
                  </div>
                  <div>
                    <h3 className="text-white font-semibold mb-1">{item.title}</h3>
                    <p className="text-gray-300 text-sm">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="w-full lg:w-1/2 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-8">
          <div className="max-w-md w-full space-y-8">
            {step === 1 ? (
              <div className="bg-white rounded-xl shadow-lg p-8">
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Choose your role</h2>
                  <p className="text-gray-600">Select how you'll use InfluConnect</p>
                </div>

                <div className="space-y-4 mb-8">
                  <div onClick={() => setSelectedRole('company')} className={`p-6 border-2 rounded-xl cursor-pointer transition-all duration-200 ${selectedRole === 'company' ? 'border-blue-500 bg-blue-50 shadow-lg' : 'border-gray-200 hover:border-gray-300 hover:shadow-md'}`}>
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                        <span className="text-2xl">🏢</span>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">Company</h3>
                        <p className="text-gray-600 text-sm">Find verified influencers for your brand campaigns</p>
                      </div>
                      <div className={`w-5 h-5 rounded-full border-2 ${selectedRole === 'company' ? 'border-blue-500 bg-blue-600' : 'border-gray-300'}`}>
                        {selectedRole === 'company' && <div className="w-full h-full rounded-full bg-white scale-50"></div>}
                      </div>
                    </div>
                  </div>

                  <div onClick={() => setSelectedRole('influencer')} className={`p-6 border-2 rounded-xl cursor-pointer transition-all duration-200 ${selectedRole === 'influencer' ? 'border-green-500 bg-green-50 shadow-lg' : 'border-gray-200 hover:border-gray-300 hover:shadow-md'}`}>
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center">
                        <span className="text-2xl">⭐</span>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">Influencer</h3>
                        <p className="text-gray-600 text-sm">Build credibility & get discovered by authentic brands</p>
                      </div>
                      <div className={`w-5 h-5 rounded-full border-2 ${selectedRole === 'influencer' ? 'border-green-500 bg-green-600' : 'border-gray-300'}`}>
                        {selectedRole === 'influencer' && <div className="w-full h-full rounded-full bg-white scale-50"></div>}
                      </div>
                    </div>
                  </div>
                </div>

                <button onClick={() => selectedRole && setStep(2)} disabled={!selectedRole} className={`w-full py-3 px-4 rounded-lg font-semibold transition-colors ${selectedRole ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}>
                  Continue
                </button>

                <p className="text-center text-sm text-gray-600 mt-6">
                  Already have an account?{' '}
                  <Link to="/signin" className="text-blue-600 hover:text-blue-700 font-semibold">Sign in</Link>
                </p>
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-lg p-8 max-h-[85vh] overflow-y-auto">
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Complete Your Profile</h2>
                  <p className="text-gray-600">Tell us about yourself</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="flex justify-center mb-4">
                    <div className="relative">
                      <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden border-2 border-gray-300">
                        {profileImagePreview ? (
                          <img src={profileImagePreview} alt="Profile" className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-4xl text-gray-400">{selectedRole === 'company' ? '🏢' : '👤'}</span>
                        )}
                      </div>
                      <label className="absolute bottom-0 right-0 bg-blue-600 text-white rounded-full p-2 cursor-pointer hover:bg-blue-700">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                      </label>
                    </div>
                  </div>
                  {errors.profileImage && <p className="text-red-500 text-xs text-center -mt-2">{errors.profileImage}</p>}

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">{selectedRole === 'company' ? 'Brand Name' : 'Full Name'} *</label>
                    <input type="text" name="fullName" value={formData.fullName} onChange={handleInputChange} className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.fullName ? 'border-red-500' : 'border-gray-300'}`} placeholder={selectedRole === 'company' ? 'Enter brand name' : 'John Doe'} />
                    {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email Address *</label>
                    <input type="email" name="email" value={formData.email} onChange={handleInputChange} className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.email ? 'border-red-500' : 'border-gray-300'}`} placeholder="your@email.com" />
                    {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Password *</label>
                      <div className="relative">
                        <input type={showPassword ? 'text' : 'password'} name="password" value={formData.password} onChange={handleInputChange} className={`w-full px-3 py-2 pr-10 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.password ? 'border-red-500' : 'border-gray-300'}`} placeholder="••••••••" />
                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700">
                          {showPassword ? (
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                            </svg>
                          ) : (
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                          )}
                        </button>
                      </div>
                      {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password *</label>
                      <div className="relative">
                        <input type={showConfirmPassword ? 'text' : 'password'} name="confirmPassword" value={formData.confirmPassword} onChange={handleInputChange} className={`w-full px-3 py-2 pr-10 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300'}`} placeholder="••••••••" />
                        <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700">
                          {showConfirmPassword ? (
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                            </svg>
                          ) : (
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                          )}
                        </button>
                      </div>
                      {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number *</label>
                    <div className="flex items-center">
                      <span className="px-3 py-2 bg-gray-100 border border-r-0 border-gray-300 rounded-l-lg text-gray-700 font-medium">+91</span>
                      <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} className={`flex-1 px-3 py-2 border rounded-r-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.phone ? 'border-red-500' : 'border-gray-300'}`} placeholder="Enter Mobile Number" maxLength="10" />
                    </div>
                    {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                    <p className="text-xs text-gray-500 mt-1">Enter 10-digit Indian mobile number</p>
                  </div>

                  {selectedRole === 'company' ? (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Website Link</label>
                        <input type="url" name="website" value={formData.website} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="https://yourwebsite.com" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Target Industries *</label>
                        <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto p-2 border rounded-lg">
                          {industries.map(ind => (
                            <label key={ind} className="flex items-center space-x-2 cursor-pointer">
                              <input type="checkbox" checked={formData.targetIndustries.includes(ind)} onChange={() => handleIndustryToggle(ind)} className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
                              <span className="text-sm text-gray-700">{ind}</span>
                            </label>
                          ))}
                        </div>
                        {errors.targetIndustries && <p className="text-red-500 text-xs mt-1">{errors.targetIndustries}</p>}
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Birth Date *</label>
                          <input type="date" name="birthDate" value={formData.birthDate} onChange={handleInputChange} className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.birthDate ? 'border-red-500' : 'border-gray-300'}`} />
                          {errors.birthDate && <p className="text-red-500 text-xs mt-1">{errors.birthDate}</p>}
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Gender *</label>
                          <select name="gender" value={formData.gender} onChange={handleInputChange} className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.gender ? 'border-red-500' : 'border-gray-300'}`}>
                            <option value="">Select</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                          </select>
                          {errors.gender && <p className="text-red-500 text-xs mt-1">{errors.gender}</p>}
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Categories *</label>
                        <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto p-2 border rounded-lg">
                          {categories.map(cat => (
                            <label key={cat} className="flex items-center space-x-2 cursor-pointer">
                              <input type="checkbox" checked={formData.categories.includes(cat)} onChange={() => handleCategoryToggle(cat)} className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
                              <span className="text-sm text-gray-700">{cat}</span>
                            </label>
                          ))}
                        </div>
                        {errors.categories && <p className="text-red-500 text-xs mt-1">{errors.categories}</p>}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">About Yourself *</label>
                        <textarea name="bio" value={formData.bio} onChange={handleInputChange} rows={4} className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.bio ? 'border-red-500' : 'border-gray-300'}`} placeholder="Tell us about yourself and your content..." maxLength="500" />
                        {errors.bio && <p className="text-red-500 text-xs mt-1">{errors.bio}</p>}
                        <p className="text-xs text-gray-500 mt-1">{formData.bio.length}/500 characters</p>
                      </div>

                      <div className="border-t border-gray-200 pt-4">
                        <h3 className="text-sm font-semibold text-gray-900 mb-3">Social Media Links</h3>
                        <div className="space-y-3">
                          <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">📷 Instagram</label>
                            <input type="url" name="instagram" value={formData.instagram} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm" placeholder="https://instagram.com/username" />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">📺 YouTube</label>
                            <input type="url" name="youtube" value={formData.youtube} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm" placeholder="https://youtube.com/@username" />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">📘 Facebook</label>
                            <input type="url" name="facebook" value={formData.facebook} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm" placeholder="https://facebook.com/username" />
                          </div>
                        </div>
                      </div>
                    </>
                  )}

                  <div className="flex space-x-3 mt-6">
                    <button type="button" onClick={() => setStep(1)} className="flex-1 py-3 px-4 border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition-colors">Back</button>
                    <button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-semibold transition-colors">Create Account</button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default SignUp
