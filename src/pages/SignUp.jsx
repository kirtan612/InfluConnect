import React, { useState } from 'react'
import { Link } from 'react-router-dom'

const SignUp = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [selectedRole, setSelectedRole] = useState('')
  const [step, setStep] = useState(1) // 1: credentials, 2: role selection

  const handleGoogleSignUp = () => {
    // Mock Google sign-up - goes directly to role selection
    setStep(2)
  }

  const handleEmailNext = (e) => {
    e.preventDefault()
    if (email && password) {
      setStep(2)
    }
  }

  const handleRoleSelect = (role) => {
    setSelectedRole(role)
  }

  const handleCreateAccount = () => {
    if (selectedRole) {
      console.log('Account created:', { email, password, role: selectedRole })
      // Mock redirect based on role
      const redirectUrl = selectedRole === 'company' ? '/company/dashboard' : '/influencer/dashboard'
      window.location.href = redirectUrl
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex min-h-screen">
        {/* Left Side - Branding (Hidden on mobile) */}
        <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700 relative overflow-hidden">
          {/* Subtle gradient mesh background */}
          <div className="absolute inset-0 bg-gradient-to-br from-teal-500/10 via-transparent to-indigo-500/10"></div>
          
          <div className="relative z-10 flex flex-col justify-center px-12 xl:px-16">
            {/* Logo */}
            <div className="mb-12">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-white/10 backdrop-blur-sm rounded-xl mb-4">
                <span className="text-2xl font-bold text-white">IC</span>
              </div>
              <h1 className="text-4xl font-bold text-white mb-4">
                Welcome to InfluConnect
              </h1>
              <p className="text-xl text-gray-300 leading-relaxed">
                The trust-first platform connecting verified influencers with authentic brands
              </p>
            </div>

            {/* Value Propositions */}
            <div className="space-y-6">
              {[
                {
                  icon: '✓',
                  title: 'Verified influencers',
                  description: 'Every creator goes through our rigorous verification process'
                },
                {
                  icon: '📊',
                  title: 'Transparent metrics',
                  description: 'Real engagement data and authentic audience insights'
                },
                {
                  icon: '🛡️',
                  title: 'Trust-first discovery',
                  description: 'Quality connections built on verified credibility'
                },
                {
                  icon: '🚫',
                  title: 'No spam or fake data',
                  description: 'Clean, reliable platform free from bots and fake accounts'
                }
              ].map((item, index) => (
                <div key={index} className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-white/10 backdrop-blur-sm rounded-lg flex items-center justify-center">
                    <span className="text-sm">{item.icon}</span>
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

        {/* Right Side - Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center px-4 sm:px-6 lg:px-8">
          <div className="max-w-md w-full space-y-8">
            {step === 1 ? (
              /* Step 1: Credentials */
              <div className="bg-white rounded-xl shadow-lg p-8">
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Create your account</h2>
                  <p className="text-gray-600">Join thousands of verified creators and brands</p>
                </div>

                {/* Google Sign Up */}
                <button
                  onClick={handleGoogleSignUp}
                  className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg shadow-sm bg-white text-gray-700 hover:bg-gray-50 font-medium transition-colors duration-200 mb-4"
                >
                  <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Continue with Google
                </button>

                {/* Divider */}
                <div className="relative mb-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500">Or</span>
                  </div>
                </div>

                {/* Email Form */}
                <form onSubmit={handleEmailNext} className="space-y-4">
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      Email
                    </label>
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent transition-colors"
                      placeholder="Enter your email"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                      Password
                    </label>
                    <input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent transition-colors"
                      placeholder="Create a password"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-slate-900 hover:bg-slate-800 text-white py-3 px-4 rounded-lg font-semibold transition-colors duration-200"
                  >
                    Continue
                  </button>
                </form>

                {/* Sign In Link */}
                <p className="text-center text-sm text-gray-600 mt-6">
                  Already have an account?{' '}
                  <Link to="/signin" className="text-slate-900 hover:text-slate-700 font-medium">
                    Sign in
                  </Link>
                </p>
              </div>
            ) : (
              /* Step 2: Role Selection */
              <div className="bg-white rounded-xl shadow-lg p-8">
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Choose your role</h2>
                  <p className="text-gray-600">This helps us customize your experience</p>
                </div>

                {/* Role Selection Cards */}
                <div className="space-y-4 mb-8">
                  {/* Company Card */}
                  <div
                    onClick={() => handleRoleSelect('company')}
                    className={`p-6 border-2 rounded-xl cursor-pointer transition-all duration-200 ${
                      selectedRole === 'company'
                        ? 'border-slate-900 bg-slate-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                          <span className="text-xl">🏢</span>
                        </div>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">Company</h3>
                        <p className="text-gray-600 text-sm">Find verified influencers for your brand campaigns</p>
                      </div>
                      <div className="flex-shrink-0">
                        <div className={`w-5 h-5 rounded-full border-2 ${
                          selectedRole === 'company'
                            ? 'border-slate-900 bg-slate-900'
                            : 'border-gray-300'
                        }`}>
                          {selectedRole === 'company' && (
                            <div className="w-full h-full rounded-full bg-white scale-50"></div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Influencer Card */}
                  <div
                    onClick={() => handleRoleSelect('influencer')}
                    className={`p-6 border-2 rounded-xl cursor-pointer transition-all duration-200 ${
                      selectedRole === 'influencer'
                        ? 'border-slate-900 bg-slate-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                          <span className="text-xl">⭐</span>
                        </div>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">Influencer</h3>
                        <p className="text-gray-600 text-sm">Build credibility & get discovered by authentic brands</p>
                      </div>
                      <div className="flex-shrink-0">
                        <div className={`w-5 h-5 rounded-full border-2 ${
                          selectedRole === 'influencer'
                            ? 'border-slate-900 bg-slate-900'
                            : 'border-gray-300'
                        }`}>
                          {selectedRole === 'influencer' && (
                            <div className="w-full h-full rounded-full bg-white scale-50"></div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Create Account Button */}
                <button
                  onClick={handleCreateAccount}
                  disabled={!selectedRole}
                  className={`w-full py-3 px-4 rounded-lg font-semibold transition-colors duration-200 ${
                    selectedRole
                      ? 'bg-slate-900 hover:bg-slate-800 text-white'
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  Create Account
                </button>

                {/* Back Button */}
                <button
                  onClick={() => setStep(1)}
                  className="w-full mt-3 py-2 px-4 text-gray-600 hover:text-gray-800 font-medium transition-colors duration-200"
                >
                  ← Back
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default SignUp