import React, { useState, useEffect } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import Logo from '../components/Logo'

const ResetPassword = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)
  const token = searchParams.get('token')

  useEffect(() => {
    if (!token) {
      setError('Invalid reset link. Please request a new password reset.')
    }
  }, [token])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!password) {
      setError('Password is required')
      return
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters')
      return
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    setLoading(true)

    try {
      const response = await fetch('http://localhost:8000/api/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token,
          new_password: password,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.detail || 'Failed to reset password')
      }

      setSuccess(true)
      setTimeout(() => {
        navigate('/signin')
      }, 3000)
    } catch (err) {
      setError(err.message || 'Failed to reset password. The link may have expired.')
    } finally {
      setLoading(false)
    }
  }

  if (!token) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Background Decorations */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] bg-brand-primary/20 rounded-full blur-[100px]"></div>
          <div className="absolute top-[20%] -right-[10%] w-[40%] h-[40%] bg-brand-secondary/20 rounded-full blur-[100px]"></div>
        </div>

        <div className="max-w-md w-full relative z-10">
          <div className="card-glass p-8 md:p-10 text-center">
            <div className="mb-6 flex justify-center">
              <Logo size="lg" variant="icon" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-4 tracking-tight">Invalid Reset Link</h2>
            <p className="text-slate-500 mb-8 leading-relaxed">
              This password reset link is invalid or has expired.
            </p>
            <Link
              to="/forgot-password"
              className="btn-primary inline-block py-3 px-6 rounded-xl font-bold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300"
            >
              Request New Reset Link
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] bg-brand-primary/20 rounded-full blur-[100px]"></div>
        <div className="absolute top-[20%] -right-[10%] w-[40%] h-[40%] bg-brand-secondary/20 rounded-full blur-[100px]"></div>
      </div>

      <div className="max-w-md w-full space-y-8 relative z-10">
        <div className="card-glass p-8 md:p-10">
          <div className="text-center mb-8">
            <div className="mb-6 flex justify-center">
              <Logo size="lg" variant="icon" />
            </div>
            <h2 className="text-3xl font-bold text-slate-900 tracking-tight">
              {success ? 'Password Reset Successful!' : 'Reset Your Password'}
            </h2>
            <p className="text-slate-500 mt-2">
              {success
                ? 'Redirecting you to sign in...'
                : 'Enter your new password below'}
            </p>
          </div>

          {!success ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-1.5">
                  New Password
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value)
                    setError('')
                  }}
                  className={`input-glass w-full px-4 py-3 rounded-xl focus:ring-2 focus:ring-brand-primary focus:border-transparent transition-all ${error ? 'border-red-300 focus:ring-red-200' : ''}`}
                  placeholder="Enter new password (min 8 characters)"
                  disabled={loading}
                />
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-700 mb-1.5">
                  Confirm Password
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value)
                    setError('')
                  }}
                  className={`input-glass w-full px-4 py-3 rounded-xl focus:ring-2 focus:ring-brand-primary focus:border-transparent transition-all ${error ? 'border-red-300 focus:ring-red-200' : ''}`}
                  placeholder="Confirm new password"
                  disabled={loading}
                />
              </div>

              {error && (
                <div className="bg-red-50 border border-red-100 rounded-lg p-3 text-center">
                  <p className="text-red-600 text-sm font-medium">{error}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full py-3.5 rounded-xl font-bold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Resetting Password...' : 'Reset Password'}
              </button>
            </form>
          ) : (
            <div className="text-center">
              <div className="mb-8">
                <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto shadow-inner border border-green-100">
                  <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>
              <p className="text-slate-600 mb-8 leading-relaxed">
                Your password has been reset successfully. You can now sign in with your new password.
              </p>
              <Link
                to="/signin"
                className="btn-primary w-full inline-block py-3.5 rounded-xl font-bold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300"
              >
                Go to Sign In
              </Link>
            </div>
          )}

          {!success && (
            <p className="text-center text-sm text-slate-500 mt-8">
              Remember your password?{' '}
              <Link to="/signin" className="text-brand-primary hover:text-brand-secondary font-bold transition-colors">
                Sign in
              </Link>
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

export default ResetPassword
