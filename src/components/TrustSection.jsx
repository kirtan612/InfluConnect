import React from 'react'

const TrustSection = () => {
  return (
    <section id="trust" className="py-24 bg-slate-50 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-mesh-light opacity-30 pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-20">
          <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 mb-6 tracking-tight">
            Built on <span className="text-gradient-primary">Trust & Verification</span>
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            Every influencer is verified, every metric is validated, every recommendation is explainable
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="card-glass p-8 text-center hover:-translate-y-2 transition-transform duration-300">
            <div className="w-16 h-16 bg-brand-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6 text-brand-primary">
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">Admin Verified</h3>
            <p className="text-slate-600">Every influencer profile is manually reviewed and verified by our trust team before approval.</p>
          </div>

          <div className="card-glass p-8 text-center hover:-translate-y-2 transition-transform duration-300">
            <div className="w-16 h-16 bg-brand-secondary/10 rounded-2xl flex items-center justify-center mx-auto mb-6 text-brand-secondary">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 00-2-2z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">Transparent Metrics</h3>
            <p className="text-slate-600">All engagement rates, follower counts, and performance data are validated and displayed transparently.</p>
          </div>

          <div className="card-glass p-8 text-center hover:-translate-y-2 transition-transform duration-300">
            <div className="w-16 h-16 bg-brand-accent/10 rounded-2xl flex items-center justify-center mx-auto mb-6 text-brand-accent">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">Explainable AI</h3>
            <p className="text-slate-600">Our recommendation engine explains exactly why each influencer is suggested for your campaign.</p>
          </div>

          <div className="card-glass p-8 text-center hover:-translate-y-2 transition-transform duration-300">
            <div className="w-16 h-16 bg-blue-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6 text-blue-500">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">Trust Badges</h3>
            <p className="text-slate-600">Verified influencers receive trust badges and scores based on authentic engagement and reliability.</p>
          </div>
        </div>

        <div className="mt-20 card-glass p-8 md:p-12 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-brand-primary/5 to-brand-secondary/5"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center relative z-10">
            <div className="p-4">
              <div className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-brand-primary to-purple-600 mb-2">2,400+</div>
              <div className="text-slate-600 font-medium">Verified Influencers</div>
            </div>
            <div className="p-4 border-t md:border-t-0 md:border-l border-slate-200">
              <div className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-brand-accent to-blue-500 mb-2">98.5%</div>
              <div className="text-slate-600 font-medium">Verification Accuracy</div>
            </div>
            <div className="p-4 border-t md:border-t-0 md:border-l border-slate-200">
              <div className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-brand-secondary to-pink-500 mb-2">4.9/5</div>
              <div className="text-slate-600 font-medium">Trust Rating</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default TrustSection