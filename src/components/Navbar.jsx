import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Logo from './Logo'

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
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'nav-glass shadow-sm' : 'bg-transparent'
      }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center">
              <Logo size="md" />
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            {['How it Works', 'For Companies', 'For Influencers', 'Trust'].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase().replace(/ /g, '-')}`}
                className="text-slate-600 hover:text-brand-primary transition-colors font-medium text-sm"
              >
                {item}
              </a>
            ))}
            <div className="flex items-center space-x-4">
              <Link to="/signin" className="text-slate-600 hover:text-brand-primary transition-colors font-medium text-sm">Sign In</Link>
              <Link to="/signup" className="btn-primary py-2 px-5 text-sm shadow-md hover:shadow-lg">Sign Up</Link>
            </div>
          </div>

          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-slate-600 hover:text-brand-primary transition-colors"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="md:hidden bg-white/95 backdrop-blur-xl border-t border-slate-100">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {['How it Works', 'For Companies', 'For Influencers', 'Trust'].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase().replace(/ /g, '-')}`}
                className="block px-3 py-2 text-slate-600 hover:text-brand-primary hover:bg-slate-50 rounded-lg transition-colors font-medium"
              >
                {item}
              </a>
            ))}
            <div className="border-t border-slate-100 pt-2 mt-2">
              <Link to="/signin" className="block px-3 py-2 text-slate-600 hover:text-brand-primary font-medium">Sign In</Link>
              <Link to="/signup" className="btn-primary w-full mt-2 text-center block shadow-md">Sign Up</Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}

export default Navbar