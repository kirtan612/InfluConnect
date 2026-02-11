import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import Logo from '../components/Logo'

const ForgotPassword = () => {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!email) {
      setError('Email is required')
      return
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Invalid email format')
      return
    }
    
    // Mock password reset
    console.log('Password reset email sent to:', email)
    setSubmitted(true)
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="text-center mb-8">
            <div className="mb-4 flex justify-center">
              <Logo size="lg" variant="icon" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">
              {submitted ? 'Check your email' : 'Forgot Password?'}
            </h2>
            <p className="text-gray-600 mt-2">
              {submitted 
                ? 'We sent a password reset link to your email'
                : 'Enter your email and we\'ll send you a reset link'}
            </p>
          </div>

          {!submitted ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
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
                  className={`w-full px-3 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${error ? 'border-red-500' : 'border-gray-300'}`}
                  placeholder="Enter your email"
                />
                {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-semibold transition-colors"
              >
                Send Reset Link
              </button>
            </form>
          ) : (
            <div className="text-center">
              <div className="mb-6">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>
              <p className="text-gray-600 mb-6">
                If an account exists for {email}, you will receive a password reset link shortly.
              </p>
              <Link
                to="/signin"
                className="inline-block bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg font-semibold transition-colors"
              >
                Back to Sign In
              </Link>
            </div>
          )}

          {!submitted && (
            <p className="text-center text-sm text-gray-600 mt-6">
              Remember your password?{' '}
              <Link to="/signin" className="text-blue-600 hover:text-blue-700 font-semibold">
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
