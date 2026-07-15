import React from 'react'

const AudienceSplit = () => {
  return (
    <section className="py-20 bg-dark-800 relative overflow-hidden">
      {/* Animated background shapes */}
      <div className="absolute inset-0">
        <div className="absolute top-16 left-16 w-24 h-24 bg-accent-blue/10 rounded-full blur-xl animate-float"></div>
        <div className="absolute bottom-24 right-24 w-32 h-32 bg-accent-purple/10 rounded-full blur-xl animate-float-delayed"></div>
        <div className="absolute top-1/2 left-1/2 w-20 h-20 bg-accent-cyan/10 rounded-full blur-xl animate-bounce-slow"></div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
          {/* For Companies */}
          <div id="companies" className="text-center lg:text-left animate-slide-up group">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-accent-blue to-accent-cyan rounded-3xl mb-8 mx-auto lg:mx-0 group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-accent-blue/30">
              <span className="text-3xl">🏢</span>
            </div>
            
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              For 
              <span className="bg-gradient-to-r from-accent-blue to-accent-cyan bg-clip-text text-transparent">
                Companies
              </span>
            </h2>
            
            <p className="text-xl text-gray-300 mb-8 leading-relaxed">
              Find the perfect influencers for your brand with data-driven insights 
              and transparent metrics.
            </p>
            
            <div className="space-y-4">
              {[
                'Access verified influencer profiles',
                'Real engagement and audience data',
                'Smart matching algorithms',
                'Direct contact information',
                'No platform fees or commissions'
              ].map((feature, index) => (
                <div key={index} className="flex items-center justify-center lg:justify-start group/item">
                  <div className="w-6 h-6 bg-gradient-to-r from-accent-blue to-accent-cyan rounded-full flex items-center justify-center mr-3 flex-shrink-0 group-hover/item:scale-110 transition-transform duration-300">
                    <span className="text-white text-sm font-bold">✓</span>
                  </div>
                  <span className="text-gray-300 group-hover/item:text-white transition-colors duration-300">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {/* For Influencers */}
          <div id="influencers" className="text-center lg:text-left animate-slide-up group">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-accent-purple to-accent-pink rounded-3xl mb-8 mx-auto lg:mx-0 group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-accent-purple/30">
              <span className="text-3xl">⭐</span>
            </div>
            
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              For 
              <span className="bg-gradient-to-r from-accent-purple to-accent-pink bg-clip-text text-transparent">
                Influencers
              </span>
            </h2>
            
            <p className="text-xl text-gray-300 mb-8 leading-relaxed">
              Get discovered by brands that align with your values and audience 
              through our verification process.
            </p>
            
            <div className="space-y-4">
              {[
                'Get verified and build credibility',
                'Showcase authentic engagement',
                'Connect with relevant brands',
                'Maintain full control over partnerships',
                'No revenue sharing required'
              ].map((feature, index) => (
                <div key={index} className="flex items-center justify-center lg:justify-start group/item">
                  <div className="w-6 h-6 bg-gradient-to-r from-accent-purple to-accent-pink rounded-full flex items-center justify-center mr-3 flex-shrink-0 group-hover/item:scale-110 transition-transform duration-300">
                    <span className="text-white text-sm font-bold">✓</span>
                  </div>
                  <span className="text-gray-300 group-hover/item:text-white transition-colors duration-300">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default AudienceSplit