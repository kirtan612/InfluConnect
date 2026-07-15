import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import Logo from '../components/Logo'

const ForgotPassword = () => {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email) {
      setError('Email is required')
      return
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Invalid email format')
      return
    }

    try {
      const response = await fetch('http://localhost:8000/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      })

      if (!response.ok) {
        throw new Error('Failed to send reset email')
      }

      setSubmitted(true)
    } catch (err) {
      console.error('Password reset error:', err)
      // Still show success message for security (don't reveal if email exists)
      setSubmitted(true)
    }
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
              {submitted ? 'Check your email' : 'Forgot Password?'}
            </h2>
            <p className="text-slate-500 mt-2">
              {submitted
                ? 'We sent a password reset link to your email'
                : 'Enter your email and we\'ll send you a reset link'}
            </p>
          </div>

          {!submitted ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1.5">
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value)
                    setError('')
                  }}
                  className={`input-glass w-full px-4 py-3 rounded-xl focus:ring-2 focus:ring-brand-primary focus:border-transparent transition-all ${error ? 'border-red-300 focus:ring-red-200' : ''}`}
                  placeholder="Enter your email"
                />
                {error && <p className="text-red-500 text-xs mt-1 ml-1">{error}</p>}
              </div>

              <button
                type="submit"
                className="btn-primary w-full py-3.5 rounded-xl font-bold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300"
              >
                Send Reset Link
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
                If an account exists for <span className="font-semibold text-slate-900">{email}</span>, you will receive a password reset link shortly.
              </p>
              <Link
                to="/signin"
                className="btn-primary w-full inline-block py-3.5 rounded-xl font-bold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300"
              >
                Back to Sign In
              </Link>
            </div>
          )}

          {!submitted && (
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

export default ForgotPassword
