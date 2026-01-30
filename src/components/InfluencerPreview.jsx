import React from 'react'

const InfluencerPreview = () => {
  const influencers = [
    {
      id: 1,
      name: 'Sarah Johnson',
      avatar: 'SJ',
      category: 'Fashion & Lifestyle',
      followers: '125K',
      engagement: '4.2%',
      trustScore: 94,
      verified: true,
      bgColor: 'bg-pink-500'
    },
    {
      id: 2,
      name: 'Mike Chen',
      avatar: 'MC',
      category: 'Tech & Gaming',
      followers: '89K',
      engagement: '5.1%',
      trustScore: 91,
      verified: true,
      bgColor: 'bg-blue-500'
    },
    {
      id: 3,
      name: 'Emma Davis',
      avatar: 'ED',
      category: 'Health & Fitness',
      followers: '156K',
      engagement: '3.8%',
      trustScore: 96,
      verified: true,
      bgColor: 'bg-green-500'
    },
    {
      id: 4,
      name: 'Alex Rivera',
      avatar: 'AR',
      category: 'Travel & Food',
      followers: '203K',
      engagement: '4.7%',
      trustScore: 89,
      verified: true,
      bgColor: 'bg-purple-500'
    }
  ]

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            Discover Verified Influencers
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Browse our curated database of admin-verified influencers with transparent metrics and trust scores
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {influencers.map((influencer) => (
            <div key={influencer.id} className="bg-white border border-gray-200 rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 ${influencer.bgColor} rounded-full flex items-center justify-center text-white font-semibold`}>
                  {influencer.avatar}
                </div>
                {influencer.verified && (
                  <svg className="w-6 h-6 text-brand-teal" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
              
              <h3 className="font-semibold text-gray-900 mb-1">{influencer.name}</h3>
              <p className="text-sm text-gray-500 mb-4">{influencer.category}</p>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Followers</span>
                  <span className="font-semibold text-gray-900">{influencer.followers}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Engagement</span>
                  <span className="font-semibold text-gray-900">{influencer.engagement}</span>
                </div>
                
                <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                  <span className="text-sm font-medium text-brand-teal">Trust Score</span>
                  <div className="flex items-center">
                    <span className="text-lg font-bold text-gray-900 mr-1">{influencer.trustScore}</span>
                    <div className="w-12 h-2 bg-gray-200 rounded-full">
                      <div 
                        className="h-2 bg-brand-teal rounded-full" 
                        style={{ width: `${influencer.trustScore}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
              
              <button className="w-full mt-4 px-4 py-2 border border-brand-navy text-brand-navy rounded-lg hover:bg-brand-navy hover:text-white transition-colors font-medium">
                View Profile
              </button>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <button className="btn-primary">
            Browse All Verified Influencers
          </button>
        </div>
      </div>
    </section>
  )
}

export default InfluencerPreview