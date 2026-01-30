import React, { useState, useEffect } from 'react'

const Hero = () => {
  const [currentKeywordIndex, setCurrentKeywordIndex] = useState(0)
  const [displayedText, setDisplayedText] = useState('')
  const [isTyping, setIsTyping] = useState(true)
  
  const keywords = ['verified', 'trusted', 'data-backed', 'high-quality']
  
  useEffect(() => {
    const currentKeyword = keywords[currentKeywordIndex]
    let charIndex = 0
    
    const typeInterval = setInterval(() => {
      if (charIndex < currentKeyword.length) {
        setDisplayedText(currentKeyword.slice(0, charIndex + 1))
        charIndex++
      } else {
        clearInterval(typeInterval)
        setIsTyping(false)
        
        setTimeout(() => {
          setIsTyping(true)
          setDisplayedText('')
          setCurrentKeywordIndex((prev) => (prev + 1) % keywords.length)
        }, 2000)
      }
    }, 100)
    
    return () => clearInterval(typeInterval)
  }, [currentKeywordIndex])

  return (
    <section className="pt-24 pb-32 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="text-left">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-gray-900 leading-[1.1] mb-8 tracking-tight">
              Discover{' '}
              <span className="text-brand-teal">
                {displayedText}
                {isTyping && <span className="animate-pulse">|</span>}
              </span>{' '}
              influencers
              <span className="text-brand-teal block mt-2">that truly match your brand</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-600 mb-12 leading-relaxed font-medium max-w-2xl">
              Connect with authentic influencers through our trust-first platform. 
              Every profile is verified, every metric is transparent, every recommendation is explainable.
            </p>
            
            <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-8 space-y-4 sm:space-y-0 text-base text-gray-500 font-medium">
              <div className="flex items-center">
                <svg className="w-6 h-6 text-brand-teal mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Admin Verified
              </div>
              <div className="flex items-center">
                <svg className="w-6 h-6 text-brand-teal mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Transparent Metrics
              </div>
              <div className="flex items-center">
                <svg className="w-6 h-6 text-brand-teal mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Data-Driven
              </div>
            </div>
          </div>
          
          <div className="relative">
            <div className="bg-gray-50 rounded-2xl p-6 shadow-xl border border-gray-200">
              <div className="bg-white rounded-lg p-4 mb-4 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-gray-900">Influencer Discovery</h3>
                  <span className="text-xs bg-brand-teal text-white px-2 py-1 rounded-full">Live</span>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <div className="w-10 h-10 bg-brand-indigo rounded-full flex items-center justify-center text-white font-semibold">
                      JD
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium text-gray-900">Jane Doe</span>
                        <svg className="w-4 h-4 text-brand-teal" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="text-sm text-gray-500">Fashion • 125K followers • 4.2% engagement</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-brand-teal">Trust Score</div>
                      <div className="text-lg font-bold text-gray-900">94</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <div className="w-10 h-10 bg-brand-navy rounded-full flex items-center justify-center text-white font-semibold">
                      MS
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium text-gray-900">Mike Smith</span>
                        <svg className="w-4 h-4 text-brand-teal" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="text-sm text-gray-500">Tech • 89K followers • 5.1% engagement</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-brand-teal">Trust Score</div>
                      <div className="text-lg font-bold text-gray-900">91</div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="bg-white p-3 rounded-lg border border-gray-100">
                  <div className="text-lg font-bold text-gray-900">2.4K</div>
                  <div className="text-xs text-gray-500">Verified</div>
                </div>
                <div className="bg-white p-3 rounded-lg border border-gray-100">
                  <div className="text-lg font-bold text-gray-900">98%</div>
                  <div className="text-xs text-gray-500">Accuracy</div>
                </div>
                <div className="bg-white p-3 rounded-lg border border-gray-100">
                  <div className="text-lg font-bold text-gray-900">4.9</div>
                  <div className="text-xs text-gray-500">Rating</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero