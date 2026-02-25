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
    <section className="pt-32 pb-32 bg-slate-50 overflow-hidden relative">
      <div className="absolute top-0 right-0 w-1/2 h-full bg-mesh-light opacity-60 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="text-left animate-fade-in">
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-brand-primary/10 text-brand-primary text-sm font-semibold mb-6 border border-brand-primary/20">
              <span className="w-2 h-2 rounded-full bg-brand-primary mr-2 animate-pulse"></span>
              The Future of Influencer Marketing
            </div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-slate-900 leading-[1.1] mb-8 tracking-tight">
              Discover{' '}
              <span className="text-gradient-primary">
                {displayedText}
                {isTyping && <span className="animate-pulse text-brand-primary">|</span>}
              </span>{' '}
              influencers
              <span className="block mt-2 text-slate-800">that truly match your brand</span>
            </h1>

            <p className="text-xl md:text-2xl text-slate-600 mb-12 leading-relaxed font-medium max-w-2xl">
              Connect with authentic influencers through our trust-first platform.
              Every profile is verified, every metric is transparent.
            </p>

            <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-8 space-y-4 sm:space-y-0 text-base text-slate-500 font-medium">
              {[
                { icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z", text: "Admin Verified" },
                { icon: "M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z", text: "Transparent Metrics" },
                { icon: "M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10", text: "Data-Driven" }
              ].map((feature, idx) => (
                <div key={idx} className="flex items-center">
                  <svg className="w-6 h-6 text-brand-accent mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d={feature.icon} />
                  </svg>
                  {feature.text}
                </div>
              ))}
            </div>
          </div>

          <div className="relative animate-float">
            <div className="absolute -inset-4 bg-gradient-to-r from-brand-primary/20 to-brand-secondary/20 rounded-[2rem] blur-2xl opacity-50 -z-10" />
            <div className="card-glass p-6 border border-white/60">
              <div className="bg-white/80 rounded-xl p-4 mb-4 shadow-sm border border-slate-100/50 backdrop-blur-sm">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-bold text-slate-900">Influencer Discovery</h3>
                  <span className="text-xs bg-brand-accent/10 text-brand-accent border border-brand-accent/20 px-2.5 py-1 rounded-full font-semibold">Live Demo</span>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3 p-3 bg-slate-50/80 rounded-xl hover:bg-white transition-colors duration-300 border border-transparent hover:border-slate-100">
                    <div className="w-12 h-12 rounded-full p-[2px] bg-gradient-to-tr from-brand-primary to-brand-secondary">
                      <div className="w-full h-full rounded-full border-2 border-white overflow-hidden">
                        <img
                          src="https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face"
                          alt="Jane Doe"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-slate-900">Jane Doe</span>
                        <svg className="w-4 h-4 text-brand-primary" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="text-sm text-slate-500 font-medium">Fashion • 125K followers</div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs font-semibold text-brand-primary uppercase tracking-wide">Trust</div>
                      <div className="text-xl font-extrabold text-slate-900">98</div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 p-3 bg-slate-50/80 rounded-xl hover:bg-white transition-colors duration-300 border border-transparent hover:border-slate-100">
                    <div className="w-12 h-12 rounded-full p-[2px] bg-gradient-to-tr from-brand-accent to-blue-500">
                      <div className="w-full h-full rounded-full border-2 border-white overflow-hidden">
                        <img
                          src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face"
                          alt="Mike Smith"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-slate-900">Mike Smith</span>
                        <svg className="w-4 h-4 text-brand-accent" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="text-sm text-slate-500 font-medium">Tech • 89K followers</div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs font-semibold text-brand-accent uppercase tracking-wide">Trust</div>
                      <div className="text-xl font-extrabold text-slate-900">94</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 text-center">
                {[
                  { label: "Verified", value: "2.4K", color: "text-brand-primary" },
                  { label: "Accuracy", value: "99%", color: "text-brand-secondary" },
                  { label: "Rating", value: "4.9", color: "text-brand-accent" }
                ].map((stat, idx) => (
                  <div key={idx} className="bg-white/80 p-4 rounded-xl border border-slate-100 shadow-sm backdrop-blur-sm transition-transform hover:-translate-y-1 duration-300">
                    <div className={`text-2xl font-black ${stat.color} mb-1`}>{stat.value}</div>
                    <div className="text-xs text-slate-500 font-bold uppercase tracking-wider">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero
