import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Building2, Star, CheckCircle2, BarChart3, ShieldCheck } from 'lucide-react'
import Logo from '../components/Logo'
import { useAuth } from '../context/AuthContext.jsx'

const SignUp = () => {
  const [step, setStep] = useState(1)
  const [selectedRole, setSelectedRole] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [errors, setErrors] = useState({})

  const navigate = useNavigate()
  const { signup } = useAuth()

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const validateStep2 = () => {
    const newErrors = {}
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Invalid email format'
    }

    if (!formData.password) {
      newErrors.password = 'Password is required'
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters'
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleGoogleSignup = () => {
    const backendRole = selectedRole === 'company' ? 'BRAND' : 'INFLUENCER'
    const redirectUri = encodeURIComponent(window.location.origin + '/auth/google/callback')
    const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${import.meta.env.VITE_GOOGLE_CLIENT_ID}&redirect_uri=${redirectUri}&response_type=code&scope=email profile&state=${backendRole}`
    window.location.href = googleAuthUrl
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateStep2()) return

    setLoading(true)
    setErrors({})

    try {
      const backendRole = selectedRole === 'company' ? 'BRAND' : 'INFLUENCER'
      const data = await signup(formData.email, formData.password, backendRole)

      if (data.role === 'BRAND') {
        navigate('/company/profile-setup')
      } else if (data.role === 'INFLUENCER') {
        navigate('/influencer/profile-setup')
      } else {
        navigate('/')
      }
    } catch (err) {
      setErrors({ email: err.message || 'Unable to create account' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0f172a] relative overflow-hidden">
      <style>{`
        input[type="password"]::-ms-reveal,
        input[type="password"]::-ms-clear {
          display: none;
        }
        @keyframes float {
          0% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-30px) rotate(15deg); }
          100% { transform: translateY(0px) rotate(0deg); }
        }
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-float {
          animation: float 8s ease-in-out infinite;
        }
        .animate-blob {
          animation: blob 12s infinite alternate ease-in-out;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>

      {/* Unified Background Gradients & Blobs */}
      <div className="absolute inset-0 bg-gradient-to-br from-brand-primary/10 via-transparent to-brand-secondary/10 mix-blend-overlay pointer-events-none"></div>

      {/* Animated Blobs (Moved to root context to span both sides smoothly) */}
      <div className="absolute top-[-10%] right-[10%] w-[500px] h-[500px] bg-brand-primary/20 rounded-full blur-[120px] animate-blob pointer-events-none"></div>
      <div className="absolute bottom-[-10%] left-[-5%] w-[600px] h-[600px] bg-brand-secondary/20 rounded-full blur-[120px] animate-blob animation-delay-2000 pointer-events-none"></div>
      <div className="absolute top-[40%] left-[30%] w-[400px] h-[400px] bg-brand-accent/20 rounded-full blur-[100px] animate-blob animation-delay-4000 pointer-events-none"></div>

      {/* Floating 3D Shapes (Moved outwards so they are visible around the dialog) */}
      <div className="absolute top-[8%] right-[42%] w-32 h-32 bg-[#1e293b]/80 backdrop-blur-lg rounded-2xl border border-white/10 shadow-[0_8px_32px_0_rgba(0,0,0,0.5)] animate-float rotate-12 pointer-events-none hidden lg:block"></div>
      <div className="absolute bottom-[5%] right-[-2%] w-40 h-40 bg-[#1e293b]/80 backdrop-blur-lg rounded-full border border-white/10 shadow-[0_8px_32px_0_rgba(0,0,0,0.5)] animate-float animation-delay-2000 -rotate-12 pointer-events-none hidden lg:block"></div>
      <div className="absolute top-[35%] right-[2%] w-24 h-24 bg-[#1e293b]/80 backdrop-blur-lg rounded-xl border border-white/10 shadow-[0_8px_32px_0_rgba(0,0,0,0.5)] animate-float animation-delay-4000 rotate-45 pointer-events-none hidden lg:block"></div>

      <div className="flex min-h-screen relative z-10 max-w-[1600px] mx-auto">
        {/* Left Side - Hero/Info */}
        <div className="hidden lg:flex lg:w-1/2 flex-col justify-center px-12 xl:px-20 text-white py-12">
          <div className="mb-12">
            <div className="mb-8"><Logo size="lg" variant="icon" /></div>
            <h1 className="text-5xl font-bold mb-6 tracking-tight leading-tight">
              Join the Future of <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-accent to-brand-secondary">Influencer Marketing</span>
            </h1>
            <p className="text-xl text-slate-300 leading-relaxed max-w-lg">
              Connect with verified creators and authentic brands on the most trusted platform in the industry.
            </p>
          </div>

          <div className="space-y-8">
            {[
              { icon: <CheckCircle2 className="w-6 h-6 text-brand-primary" />, title: 'Verified Profiles', description: 'Every creator goes through our rigorous manual verification process' },
              { icon: <BarChart3 className="w-6 h-6 text-teal-400" />, title: 'Transparent Data', description: 'Access real-time engagement metrics and audience insights' },
              { icon: <ShieldCheck className="w-6 h-6 text-brand-secondary" />, title: 'Secure & Trusted', description: 'Built with safety-first principles for reliable partnerships' }
            ].map((item, index) => (
              <div key={index} className="flex items-start space-x-5 group">
                <div className="flex-shrink-0 w-12 h-12 bg-white/5 backdrop-blur-md rounded-2xl flex items-center justify-center shadow-lg border border-white/5 group-hover:bg-white/10 transition-all duration-300">
                  {item.icon}
                </div>
                <div>
                  <h3 className="text-white font-bold text-lg mb-1">{item.title}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center px-4 sm:px-8 lg:px-12 py-12">
          <div className="max-w-[440px] w-full relative perspective-1000 z-20">
            {step === 1 ? (
              <div className="bg-[#1e293b]/60 backdrop-blur-2xl rounded-[2rem] shadow-[0_20px_50px_rgba(0,_0,_0,_0.5)] p-8 sm:p-10 border border-white/10 relative overflow-hidden group transition-all duration-500">
                <div className="absolute inset-0 bg-gradient-to-br from-brand-secondary/10 via-transparent to-brand-accent/10 opacity-50 mix-blend-overlay pointer-events-none"></div>

                <div className="text-center mb-10 relative z-10">
                  <h2 className="text-3xl font-extrabold text-white mb-3 tracking-tight drop-shadow-sm">Choose your role</h2>
                  <p className="text-slate-300 font-medium">Select how you'll use InfluConnect</p>
                </div>

                <div className="space-y-4 mb-10 relative z-10">
                  <div
                    onClick={() => setSelectedRole('company')}
                    className={`p-4 border border-white/10 rounded-xl cursor-pointer transition-all duration-300 group hover:bg-white/10 ${selectedRole === 'company' ? 'bg-white/10 border-brand-primary shadow-[0_0_15px_rgba(59,130,246,0.5)]' : 'bg-transparent'}`}
                  >
                    <div className="flex items-center space-x-4">
                      <div className={`w-12 h-12 rounded-lg flex items-center justify-center transition-colors duration-300 ${selectedRole === 'company' ? 'bg-brand-primary text-white shadow-lg' : 'bg-white/10 text-white group-hover:bg-brand-primary/80'}`}>
                        <Building2 className="w-6 h-6" />
                      </div>
                      <div className="flex-1 text-left">
                        <div className="flex justify-between items-center mb-1">
                          <h3 className="text-base font-bold transition-colors text-white">Company</h3>
                          <div className={`w-5 h-5 flex-shrink-0 rounded-full border-2 flex items-center justify-center ${selectedRole === 'company' ? 'border-brand-primary bg-brand-primary' : 'border-slate-500 group-hover:border-brand-primary/50'}`}>
                            {selectedRole === 'company' && <div className="w-2 h-2 rounded-full bg-white"></div>}
                          </div>
                        </div>
                        <p className="text-slate-300 text-xs leading-relaxed">Find verified influencers for your brand campaigns</p>
                      </div>
                    </div>
                  </div>

                  <div
                    onClick={() => setSelectedRole('influencer')}
                    className={`p-4 border border-white/10 rounded-xl cursor-pointer transition-all duration-300 group hover:bg-white/10 ${selectedRole === 'influencer' ? 'bg-white/10 border-teal-400 shadow-[0_0_15px_rgba(45,212,191,0.5)]' : 'bg-transparent'}`}
                  >
                    <div className="flex items-center space-x-4">
                      <div className={`w-12 h-12 rounded-lg flex items-center justify-center transition-colors duration-300 ${selectedRole === 'influencer' ? 'bg-teal-500 text-white shadow-lg' : 'bg-white/10 text-white group-hover:bg-teal-500/80'}`}>
                        <Star className="w-6 h-6" />
                      </div>
                      <div className="flex-1 text-left">
                        <div className="flex justify-between items-center mb-1">
                          <h3 className="text-base font-bold transition-colors text-white">Influencer</h3>
                          <div className={`w-5 h-5 flex-shrink-0 rounded-full border-2 flex items-center justify-center ${selectedRole === 'influencer' ? 'border-teal-400 bg-teal-400' : 'border-slate-500 group-hover:border-teal-400/50'}`}>
                            {selectedRole === 'influencer' && <div className="w-2 h-2 rounded-full bg-white"></div>}
                          </div>
                        </div>
                        <p className="text-slate-300 text-xs leading-relaxed">Build credibility & get discovered by authentic brands</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="relative z-10">
                  <button
                    onClick={() => selectedRole && setStep(2)}
                    disabled={!selectedRole}
                    className={`w-full bg-gradient-to-r from-brand-secondary to-teal-400 hover:opacity-90 disabled:opacity-50 text-white py-3.5 px-4 rounded-xl font-bold shadow-lg shadow-teal-500/30 transition-all duration-300 transform ${!selectedRole ? 'cursor-not-allowed grayscale' : 'hover:-translate-y-0.5'}`}
                  >
                    Continue
                  </button>

                  <p className="text-center text-sm text-slate-400 mt-6 pt-2">
                    Already have an account?{' '}
                    <Link to="/signin" className="text-teal-400 hover:text-white font-bold transition-colors">Sign in</Link>
                  </p>
                </div>
              </div>
            ) : (
              <div className="bg-[#1e293b]/60 backdrop-blur-2xl rounded-[2rem] shadow-[0_20px_50px_rgba(0,_0,_0,_0.5)] p-8 sm:p-10 border border-white/10 relative overflow-hidden group transition-all duration-500">
                <div className="absolute inset-0 bg-gradient-to-br from-brand-secondary/10 via-transparent to-brand-accent/10 opacity-50 mix-blend-overlay pointer-events-none"></div>

                <div className="text-center mb-8 relative z-10">
                  <h2 className="text-3xl font-extrabold text-white mb-3 tracking-tight drop-shadow-sm">Create Account</h2>
                  <p className="text-slate-300 font-medium">
                    Sign up as <span className="font-bold text-white">{selectedRole === 'company' ? 'a Company' : 'an Influencer'}</span>
                  </p>
                </div>

                <div className="relative z-10">
                  {errors.email && (
                    <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-center mb-6">
                      <p className="text-red-400 text-sm">{errors.email}</p>
                    </div>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-4 text-left">
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-1.5">Email Address</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-teal-400 focus:border-transparent transition-colors text-white placeholder-slate-400 outline-none ${errors.email ? 'border-red-400/50 focus:ring-red-400' : ''}`}
                        placeholder="name@example.com"
                        disabled={loading}
                      />
                      {errors.email && errors.email !== 'Unable to create account' && <p className="text-red-400 text-xs mt-1 ml-1">{errors.email}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-1.5">Password</label>
                      <div className="relative">
                        <input
                          type={showPassword ? 'text' : 'password'}
                          name="password"
                          value={formData.password}
                          onChange={handleInputChange}
                          className={`w-full px-4 py-3 pr-12 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-teal-400 focus:border-transparent transition-colors text-white placeholder-slate-400 outline-none ${errors.password ? 'border-red-400/50 focus:ring-red-400' : ''}`}
                          placeholder="••••••••"
                          disabled={loading}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors p-1"
                          disabled={loading}
                        >
                          {showPassword ? (
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
                          ) : (
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                          )}
                        </button>
                      </div>
                      {errors.password && <p className="text-red-400 text-xs mt-1 ml-1">{errors.password}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-1.5">Confirm Password</label>
                      <div className="relative">
                        <input
                          type={showConfirmPassword ? 'text' : 'password'}
                          name="confirmPassword"
                          value={formData.confirmPassword}
                          onChange={handleInputChange}
                          className={`w-full px-4 py-3 pr-12 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-teal-400 focus:border-transparent transition-colors text-white placeholder-slate-400 outline-none ${errors.confirmPassword ? 'border-red-400/50 focus:ring-red-400' : ''}`}
                          placeholder="••••••••"
                          disabled={loading}
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors p-1"
                          disabled={loading}
                        >
                          {showConfirmPassword ? (
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
                          ) : (
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                          )}
                        </button>
                      </div>
                      {errors.confirmPassword && <p className="text-red-400 text-xs mt-1 ml-1">{errors.confirmPassword}</p>}
                    </div>

                    <div className="flex space-x-3 mt-8">
                      <button
                        type="button"
                        onClick={() => setStep(1)}
                        className="flex-1 py-3.5 px-4 border border-white/20 hover:border-white/40 bg-white/5 hover:bg-white/10 rounded-xl font-bold text-white transition-all shadow-sm"
                        disabled={loading}
                      >
                        Back
                      </button>
                      <button
                        type="submit"
                        className="flex-1 w-full bg-gradient-to-r from-brand-secondary to-teal-400 hover:opacity-90 disabled:opacity-50 text-white py-3.5 px-4 rounded-xl font-bold shadow-lg shadow-teal-400/30 transition-all duration-300 transform hover:-translate-y-0.5"
                        disabled={loading}
                      >
                        {loading ? 'Creating...' : 'Create Account'}
                      </button>
                    </div>

                    <div className="relative my-6">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-white/10"></div>
                      </div>
                      <div className="relative flex justify-center text-sm">
                        <span className="px-2 bg-[#1e293b] text-slate-400 rounded-full">Or</span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={handleGoogleSignup}
                      className="w-full flex items-center justify-center px-4 py-3.5 border border-white/20 hover:border-brand-primary/50 hover:bg-white/5 rounded-xl shadow-[0_4px_12px_rgba(0,0,0,0.1)] bg-white/10 text-white font-semibold transition-all duration-300 mb-4 group/btn backdrop-blur-sm"
                      disabled={loading}
                    >
                      <div className="bg-white p-1 rounded-full mr-3 group-hover/btn:scale-110 transition-transform duration-300">
                        <svg className="w-4 h-4" viewBox="0 0 24 24">
                          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                        </svg>
                      </div>
                      Sign up with Google
                    </button>
                  </form>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default SignUp
