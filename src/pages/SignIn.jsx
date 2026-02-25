import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Logo from '../components/Logo'
import { useAuth } from '../context/AuthContext.jsx'

const SignIn = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { login } = useAuth()

  const handleGoogleSignIn = () => {
    // Placeholder for real Google OAuth flow
    console.log('Google sign-in initiated')
  }

  const handleEmailSignIn = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const data = await login(email, password)
      if (data.role === 'BRAND') {
        navigate('/company/dashboard')
      } else if (data.role === 'INFLUENCER') {
        navigate('/influencer/dashboard')
      } else if (data.role === 'ADMIN') {
        navigate('/admin/dashboard')
      } else {
        navigate('/')
      }
    } catch (err) {
      setError(err.message || 'Unable to sign in')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center px-4 sm:px-6 lg:px-8 bg-slate-900">
      {/* Dynamic Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-slate-900"></div>

        {/* Animated Blobs similar to SignUp */}
        <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-brand-secondary/20 rounded-full blur-[100px] animate-blob"></div>
        <div className="absolute bottom-[-10%] left-[-5%] w-[600px] h-[600px] bg-brand-accent/20 rounded-full blur-[120px] animate-blob animation-delay-2000"></div>
        <div className="absolute top-[40%] left-[20%] w-[400px] h-[400px] bg-brand-secondary/20 rounded-full blur-[100px] animate-blob animation-delay-4000"></div>

        {/* Floating 3D Shapes */}
        <div className="absolute top-[15%] left-[10%] w-32 h-32 bg-gradient-to-br from-white/10 to-white/0 backdrop-blur-lg rounded-2xl border border-white/20 shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] animate-float rotate-12"></div>
        <div className="absolute bottom-[15%] right-[10%] w-40 h-40 bg-gradient-to-tr from-brand-secondary/30 to-brand-accent/10 backdrop-blur-lg rounded-full border border-white/20 shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] animate-float animation-delay-2000 -rotate-12"></div>
        <div className="absolute top-[30%] right-[20%] w-24 h-24 bg-gradient-to-bl from-brand-primary/40 to-white/5 backdrop-blur-lg rounded-xl border border-white/20 shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] animate-float animation-delay-4000 rotate-45"></div>
      </div>

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

      <div className="max-w-md w-full relative z-10 perspective-1000">
        <div className="bg-[#1e293b]/60 backdrop-blur-2xl rounded-[2rem] shadow-[0_20px_50px_rgba(0,_0,_0,_0.5)] p-8 sm:p-10 border border-white/10 relative overflow-hidden group">
          {/* Subtle unified ambient color overlay for the card itself */}
          <div className="absolute inset-0 bg-gradient-to-br from-brand-secondary/10 via-transparent to-brand-accent/10 opacity-50 mix-blend-overlay"></div>

          {/* Logo */}
          <div className="text-center mb-8 relative z-10">
            <div className="mb-4 flex justify-center transform transition-transform group-hover:scale-105 duration-500">
              <Logo size="lg" variant="icon" />
            </div>
            <h2 className="text-3xl font-extrabold text-white tracking-tight drop-shadow-sm">Welcome Back</h2>
            <p className="mt-2 text-sm text-slate-300 font-medium">Sign in to InfluConnect</p>
          </div>

          {/* Google Sign In */}
          <button
            onClick={handleGoogleSignIn}
            className="relative z-10 w-full flex items-center justify-center px-4 py-3.5 border border-white/20 hover:border-brand-primary/50 hover:bg-white/5 rounded-xl shadow-[0_4px_12px_rgba(0,0,0,0.1)] bg-white/10 text-white font-semibold transition-all duration-300 mb-6 group/btn backdrop-blur-sm"
          >
            <div className="bg-white p-1 rounded-full mr-3 group-hover/btn:scale-110 transition-transform duration-300">
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
            </div>
            Continue with Google
          </button>

          {/* Divider */}
          <div className="relative mb-6 z-10">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase font-bold tracking-wider">
              <span className="px-3 bg-transparent text-slate-400 backdrop-blur-md rounded-full">Or</span>
            </div>
          </div>

          {/* Email Form */}
          <form onSubmit={handleEmailSignIn} className="space-y-4 relative z-10">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-2">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3.5 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-brand-accent focus:border-transparent transition-colors text-white placeholder-slate-400 outline-none"
                placeholder="Enter your email"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-300 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3.5 pr-10 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-brand-accent focus:border-transparent transition-colors text-white placeholder-slate-400 outline-none"
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
                >
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
              <div className="text-right mt-2">
                <Link to="/forgot-password" className="text-sm text-brand-accent hover:text-brand-accent/80 font-medium transition-colors">
                  Forgot password?
                </Link>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-brand-secondary to-brand-accent hover:opacity-90 disabled:opacity-50 text-white py-3.5 px-4 rounded-xl font-bold shadow-lg shadow-brand-secondary/30 transition-all duration-300 transform hover:-translate-y-0.5 mt-4"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          {error && (
            <p className="mt-4 text-center text-sm text-red-600">
              {error}
            </p>
          )}

          {/* Sign Up Link */}
          <p className="text-center text-sm text-slate-400 mt-6 relative z-10">
            Don't have an account?{' '}
            <Link to="/signup" className="text-brand-accent hover:text-white font-bold transition-colors">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default SignIn