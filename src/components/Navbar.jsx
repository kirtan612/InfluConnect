import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled ? 'bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-200' : 'bg-white'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0">
            <Link to="/" className="text-2xl font-bold text-brand-navy">
              InfluConnect
            </Link>
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            <a href="#how-it-works" className="text-gray-600 hover:text-brand-navy transition-colors font-medium">How it Works</a>
            <a href="#companies" className="text-gray-600 hover:text-brand-navy transition-colors font-medium">For Companies</a>
            <a href="#influencers" className="text-gray-600 hover:text-brand-navy transition-colors font-medium">For Influencers</a>
            <a href="#trust" className="text-gray-600 hover:text-brand-navy transition-colors font-medium">Trust</a>
            <div className="flex items-center space-x-4">
              <Link to="/signin" className="text-gray-600 hover:text-brand-navy transition-colors font-medium">Sign In</Link>
              <Link to="/signup" className="btn-primary">Sign Up</Link>
            </div>
          </div>
          
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-600 hover:text-brand-navy transition-colors"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
      
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <a href="#how-it-works" className="block px-3 py-2 text-gray-600 hover:text-brand-navy transition-colors">How it Works</a>
            <a href="#companies" className="block px-3 py-2 text-gray-600 hover:text-brand-navy transition-colors">For Companies</a>
            <a href="#influencers" className="block px-3 py-2 text-gray-600 hover:text-brand-navy transition-colors">For Influencers</a>
            <a href="#trust" className="block px-3 py-2 text-gray-600 hover:text-brand-navy transition-colors">Trust</a>
            <div className="border-t border-gray-200 pt-2 mt-2">
              <Link to="/signin" className="block px-3 py-2 text-gray-600 hover:text-brand-navy transition-colors">Sign In</Link>
              <Link to="/signup" className="btn-primary w-full mt-2 text-center block">Sign Up</Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}

export default Navbar