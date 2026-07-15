import React, { createContext, useContext, useState, useEffect } from 'react'
import authService from '../services/authService'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if user is already logged in
    const token = localStorage.getItem('token')
    if (token) {
      authService.getCurrentUser(token)
        .then(data => {
          setUser({
            id: data.user_id,
            email: data.email,
            role: data.role
          })
        })
        .catch(() => {
          // Token invalid, clear storage
          localStorage.removeItem('token')
          localStorage.removeItem('refresh_token')
        })
        .finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [])

  const signup = async (email, password, role) => {
    const data = await authService.signup(email, password, role)
    const userData = {
      id: data.user_id,
      email: data.email,
      role: data.role
    }
    setUser(userData)
    localStorage.setItem('token', data.access_token)
    localStorage.setItem('refresh_token', data.refresh_token)
    return userData
  }

  const login = async (email, password) => {
    // Demo Login Logic
    if (email === 'brand@demo.com') {
      const demoUser = {
        id: 'demo-brand-123',
        email: 'brand@demo.com',
        role: 'BRAND',
        name: 'Demo Brand'
      }
      setUser(demoUser)
      localStorage.setItem('token', 'demo-token-brand')
      localStorage.setItem('refresh_token', 'demo-refresh-token')
      return demoUser
    }

    if (email === 'infl@demo.com') {
      const demoUser = {
        id: 'demo-infl-123',
        email: 'infl@demo.com',
        role: 'INFLUENCER',
        name: 'Demo Influencer'
      }
      setUser(demoUser)
      localStorage.setItem('token', 'demo-token-infl')
      localStorage.setItem('refresh_token', 'demo-refresh-token')
      return demoUser
    }

    if (email === 'admin@demo.com') {
      const demoUser = {
        id: 'demo-admin-123',
        email: 'admin@demo.com',
        role: 'ADMIN',
        name: 'Demo Admin'
      }
      setUser(demoUser)
      localStorage.setItem('token', 'demo-token-admin')
      localStorage.setItem('refresh_token', 'demo-refresh-token')
      return demoUser
    }

    const data = await authService.login(email, password)
    const userData = {
      id: data.user_id,
      email: data.email,
      role: data.role
    }
    setUser(userData)
    localStorage.setItem('token', data.access_token)
    localStorage.setItem('refresh_token', data.refresh_token)
    return userData
  }

  const adminLogin = async (email, password) => {
    // Demo Admin Login
    if (email === 'admin@demo.com') {
      const demoUser = {
        id: 'demo-admin-123',
        email: 'admin@demo.com',
        role: 'ADMIN',
        name: 'Demo Admin'
      }
      setUser(demoUser)
      localStorage.setItem('token', 'demo-token-admin')
      localStorage.setItem('refresh_token', 'demo-refresh-token')
      return demoUser
    }

    const data = await authService.adminLogin(email, password)
    const userData = {
      id: data.user_id,
      email: data.email,
      role: data.role
    }
    setUser(userData)
    localStorage.setItem('token', data.access_token)
    localStorage.setItem('refresh_token', data.refresh_token)
    return userData
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('token')
    localStorage.removeItem('refresh_token')
  }

  return (
    <AuthContext.Provider value={{ user, setUser, loading, signup, login, adminLogin, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
