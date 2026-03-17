..
import React, { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import authService from '../services/authService'

const GoogleCallback = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { setUser } = useAuth()
  const [error, setError] = useState(null)

  useEffect(() => {
    const handleGoogleCallback = async () => {
      const code = searchParams.get('code')
      const state = searchParams.get('state') // role: 'BRAND' or 'INFLUENCER'
      const errorParam = searchParams.get('error')

      console.log('Google Callback Debug:')
      console.log('- Code:', code ? code.substring(0, 20) + '...' : 'NOT FOUND')
      console.log('- State (role):', state)
      console.log('- Error:', errorParam)

      if (errorParam) {
        console.error('Google OAuth error:', errorParam)
        setError('Google authentication was cancelled')
        setTimeout(() => navigate('/signup'), 2000)
        return
      }

      if (!code) {
        console.error('No authorization code in URL')
        setError('No authorization code received')
        setTimeout(() => navigate('/signup'), 2000)
        return
      }

      try {
        // State should already be 'BRAND' or 'INFLUENCER' from the OAuth URL
        const role = state || 'INFLUENCER'
        console.log('Sending to backend - Code:', code.substring(0, 20) + '...', 'Role:', role)
        
        const data = await authService.googleAuth(code, role)
        console.log('✓ Authentication successful:', data.email, data.role)
        console.log('✓ Profile complete:', data.profile_complete)

        // Store tokens
        localStorage.setItem('token', data.access_token)
        localStorage.setItem('refresh_token', data.refresh_token)

        // Set user
        const userData = {
          id: data.user_id,
          email: data.email,
          role: data.role,
          profile_complete: data.profile_complete
        }
        setUser(userData)

        // Redirect based on profile completion
        if (data.profile_complete === false) {
          // New user or incomplete profile - go to profile setup
          if (data.role === 'BRAND') {
            navigate('/company/profile-setup')
          } else if (data.role === 'INFLUENCER') {
            navigate('/influencer/profile-setup')
          } else {
            navigate('/')
          }
        } else {
          // Existing user with complete profile - go to dashboard
          if (data.role === 'BRAND') {
            navigate('/company/dashboard')
          } else if (data.role === 'INFLUENCER') {
            navigate('/influencer/dashboard')
          } else {
            navigate('/')
          }
        }
      } catch (err) {
        console.error('Google auth error:', err)
        setError(err.message || 'Authentication failed')
        setTimeout(() => navigate('/signup'), 3000)
      }
    }

    handleGoogleCallback()
  }, [searchParams, navigate, setUser])

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        {error ? (
          <div>
            <div className="text-red-600 text-xl mb-4">❌</div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Authentication Failed</h2>
            <p className="text-gray-600">{error}</p>
            <p className="text-sm text-gray-500 mt-2">Redirecting to signup...</p>
          </div>
        ) : (
          <div>
            <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Completing Google Sign In</h2>
            <p className="text-gray-600">Please wait...</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default GoogleCallback
