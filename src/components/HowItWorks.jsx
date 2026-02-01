import React, { useState } from 'react'

const HowItWorks = () => {
  const [activeTab, setActiveTab] = useState('companies')

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
    <section id="how-it-works" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            How InfluConnect Works
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Simple, transparent process for both companies and influencers
          </p>
        </div>

        <div className="flex justify-center mb-12">
          <div className="bg-gray-100 p-1 rounded-lg flex flex-col sm:flex-row">
            <button
              onClick={() => setActiveTab('companies')}
              className={`px-6 py-3 rounded-md font-semibold transition-colors mb-1 sm:mb-0 sm:mr-1 ${
                activeTab === 'companies'
                  ? 'bg-brand-navy text-white'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              For Companies
            </button>
            <button
              onClick={() => setActiveTab('influencers')}
              className={`px-6 py-3 rounded-md font-semibold transition-colors ${
                activeTab === 'influencers'
                  ? 'bg-brand-teal text-white'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              For Influencers
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {(activeTab === 'companies' ? companySteps : influencerSteps).map((step, index) => (
            <div key={index} className="relative">
              <div className="text-center">
                <div className={`w-16 h-16 ${
                  activeTab === 'companies' ? 'bg-brand-navy' : 'bg-brand-teal'
                } rounded-full flex items-center justify-center mx-auto mb-6`}>
                  <span className="text-white text-xl font-bold">{step.number}</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">{step.title}</h3>
                <p className="text-gray-600 leading-relaxed">{step.description}</p>
              </div>
              
              {index < 2 && (
                <div className="hidden md:block absolute top-8 left-full w-full">
                  <div className="flex items-center">
                    <div className={`flex-1 h-0.5 ${
                      activeTab === 'companies' ? 'bg-brand-navy' : 'bg-brand-teal'
                    } opacity-30`}></div>
                    <div className={`w-2 h-2 ${
                      activeTab === 'companies' ? 'bg-brand-navy' : 'bg-brand-teal'
                    } rounded-full opacity-60 -ml-1`}></div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <button className={activeTab === 'companies' ? 'btn-primary' : 'btn-teal'}>
            {activeTab === 'companies' ? 'Start Finding Influencers' : 'Apply for Verification'}
          </button>
        </div>
      </div>
    </section>
  )
}

export default HowItWorks
