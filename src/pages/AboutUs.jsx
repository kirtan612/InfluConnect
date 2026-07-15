import React from 'react'
import { useTheme } from '../context/ThemeContext'

const AboutUs = () => {
  const { isDark, colors } = useTheme()

  return (
    <div className={`min-h-screen ${colors.bg} pt-20`}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className={`text-4xl md:text-5xl font-bold ${colors.text} mb-6`}>
            About InfluConnect
          </h1>
          <p className={`text-xl ${colors.textSecondary} max-w-3xl mx-auto`}>
            We're revolutionizing influencer marketing through trust, transparency, and data-driven connections.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
          <div className={`${colors.bgSecondary} p-8 rounded-xl shadow-lg`}>
            <h2 className={`text-2xl font-bold ${colors.text} mb-4`}>Our Mission</h2>
            <p className={`${colors.textSecondary} leading-relaxed`}>
              To create authentic connections between brands and influencers through verified data, 
              transparent metrics, and professional credibility. We believe in eliminating fake metrics 
              and building trust in the influencer marketing ecosystem.
            </p>
          </div>

          <div className={`${colors.bgSecondary} p-8 rounded-xl shadow-lg`}>
            <h2 className={`text-2xl font-bold ${colors.text} mb-4`}>Our Vision</h2>
            <p className={`${colors.textSecondary} leading-relaxed`}>
              To become the world's most trusted platform for influencer discovery, where every 
              partnership is built on authentic engagement, real audience data, and mutual respect 
              between brands and creators.
            </p>
          </div>
        </div>

        <div className={`${colors.bgSecondary} p-8 rounded-xl shadow-lg mb-12`}>
          <h2 className={`text-2xl font-bold ${colors.text} mb-6 text-center`}>Why Choose InfluConnect?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className={`w-16 h-16 ${isDark ? 'bg-purple-600' : 'bg-blue-600'} rounded-full flex items-center justify-center mx-auto mb-4`}>
                <span className="text-2xl text-white">🛡️</span>
              </div>
              <h3 className={`text-lg font-semibold ${colors.text} mb-2`}>Verified Profiles</h3>
              <p className={`${colors.textSecondary} text-sm`}>Every influencer is thoroughly vetted with authentic metrics</p>
            </div>
            
            <div className="text-center">
              <div className={`w-16 h-16 ${isDark ? 'bg-amber-600' : 'bg-emerald-600'} rounded-full flex items-center justify-center mx-auto mb-4`}>
                <span className="text-2xl text-white">📊</span>
              </div>
              <h3 className={`text-lg font-semibold ${colors.text} mb-2`}>Data-Driven</h3>
              <p className={`${colors.textSecondary} text-sm`}>Smart algorithms for perfect brand-influencer matching</p>
            </div>
            
            <div className="text-center">
              <div className={`w-16 h-16 ${isDark ? 'bg-purple-600' : 'bg-blue-600'} rounded-full flex items-center justify-center mx-auto mb-4`}>
                <span className="text-2xl text-white">🤝</span>
              </div>
              <h3 className={`text-lg font-semibold ${colors.text} mb-2`}>Direct Connect</h3>
              <p className={`${colors.textSecondary} text-sm`}>No middlemen, no fees - just authentic partnerships</p>
            </div>
          </div>
        </div>

        <div className="text-center">
          <div className={`${colors.bgSecondary} p-6 rounded-xl shadow-lg inline-block`}>
            <h3 className={`text-lg font-semibold ${colors.text} mb-2`}>Founded in 2024</h3>
            <p className={`${colors.textSecondary}`}>San Francisco, CA • Remote-First Team</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AboutUs