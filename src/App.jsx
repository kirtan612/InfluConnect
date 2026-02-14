import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ThemeProvider } from './context/ThemeContext'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import LandingPage from './pages/LandingPage'
import SignIn from './pages/SignIn'
import SignUp from './pages/SignUp'
import GoogleCallback from './pages/GoogleCallback'
import Login from './pages/Login'
import ForgotPassword from './pages/ForgotPassword'
import ResetPassword from './pages/ResetPassword'
import VerifyEmail from './pages/VerifyEmail'
import CompanyDashboard from './components/CompanyDashboard'
import InfluencerDashboard from './components/InfluencerDashboard'
import InfluencerProfileSetup from './pages/InfluencerProfileSetup'
import CompanyProfileSetup from './pages/CompanyProfileSetup'
import AdminDashboard from './components/AdminDashboard'
import AdminLogin from './pages/AdminLogin'

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/auth/google/callback" element={<GoogleCallback />} />
            <Route path="/influencer/profile-setup" element={<InfluencerProfileSetup />} />
            <Route path="/company/profile-setup" element={<CompanyProfileSetup />} />
            <Route path="/login" element={<Login />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/verify-email" element={<VerifyEmail />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            
            {/* Protected Routes */}
            <Route 
              path="/company/dashboard" 
              element={
                <ProtectedRoute allowedRoles={['BRAND']}>
                  <CompanyDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/influencer/dashboard" 
              element={
                <ProtectedRoute allowedRoles={['INFLUENCER']}>
                  <InfluencerDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/dashboard" 
              element={
                <ProtectedRoute allowedRoles={['ADMIN']}>
                  <AdminDashboard />
                </ProtectedRoute>
              } 
            />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App