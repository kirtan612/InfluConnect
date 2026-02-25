import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const HowItWorks = () => {
  const [activeTab, setActiveTab] = useState('companies')
  const navigate = useNavigate()

  const companySteps = [
    {
      number: '01',
      title: 'Define Your Campaign',
      description: 'Tell us about your brand, target audience, and campaign goals. Our system analyzes your requirements.'
    },
    {
      number: '02',
      title: 'Get Verified Matches',
      description: 'Receive a curated list of admin-verified influencers with transparent metrics and trust scores.'
    },
    {
      number: '03',
      title: 'Connect Directly',
      description: 'Access verified contact information and connect directly with influencers. No platform fees.'
    }
  ]

  const influencerSteps = [
    {
      number: '01',
      title: 'Submit for Verification',
      description: 'Apply with your social profiles and authentic engagement data. Our team reviews every application.'
    },
    {
      number: '02',
      title: 'Get Verified Badge',
      description: 'Once approved, receive your verified badge and transparent trust score based on real metrics.'
    },
    {
      number: '03',
      title: 'Get Discovered',
      description: 'Appear in relevant brand searches with full transparency about why you\'re recommended.'
    }
  ]

  return (
    <section id="how-it-works" className="py-24 bg-slate-50 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 mb-6 tracking-tight">
            How InfluConnect Works
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            Simple, transparent process for both companies and influencers
          </p>
        </div>

        <div className="flex justify-center mb-16">
          <div className="bg-white p-1.5 rounded-xl flex flex-col sm:flex-row shadow-sm border border-slate-200">
            <button
              onClick={() => setActiveTab('companies')}
              className={`px-8 py-3 rounded-lg font-semibold transition-all duration-300 mb-1 sm:mb-0 sm:mr-1 ${activeTab === 'companies'
                  ? 'bg-brand-primary text-white shadow-md'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
            >
              For Companies
            </button>
            <button
              onClick={() => setActiveTab('influencers')}
              className={`px-8 py-3 rounded-lg font-semibold transition-all duration-300 ${activeTab === 'influencers'
                  ? 'bg-brand-accent text-white shadow-md'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
            >
              For Influencers
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {(activeTab === 'companies' ? companySteps : influencerSteps).map((step, index) => (
            <div key={index} className="relative group">
              <div className="text-center p-8 rounded-2xl bg-white border border-slate-100 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 h-full relative z-10">
                <div className={`w-16 h-16 ${activeTab === 'companies' ? 'bg-brand-primary' : 'bg-brand-accent'
                  } rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-brand-primary/20 transform group-hover:scale-110 transition-transform duration-300`}>
                  <span className="text-white text-xl font-bold">{step.number}</span>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-4">{step.title}</h3>
                <p className="text-slate-600 leading-relaxed">{step.description}</p>
              </div>

              {index < 2 && (
                <div className="hidden md:block absolute top-[25%] left-[60%] w-[80%] z-0 pointer-events-none">
                  <svg className={`w-full h-8 ${activeTab === 'companies' ? 'text-brand-primary/20' : 'text-brand-accent/20'
                    }`} fill="none" viewBox="0 0 100 20" preserveAspectRatio="none">
                    <path d="M0,10 Q50,20 100,10" stroke="currentColor" strokeWidth="2" strokeDasharray="5,5" />
                  </svg>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <button
            onClick={() => navigate('/signup')}
            className={activeTab === 'companies' ? 'btn-primary text-lg px-10 py-4 shadow-xl' : 'btn-accent text-lg px-10 py-4 shadow-xl'}
          >
            {activeTab === 'companies' ? 'Start Finding Influencers' : 'Apply for Verification'}
          </button>
        </div>
      </div>
    </section>
  )
}

export default HowItWorks
