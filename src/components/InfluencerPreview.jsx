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
      bgColor: 'bg-gradient-to-br from-pink-500 to-rose-500'
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
      bgColor: 'bg-gradient-to-br from-blue-500 to-indigo-500'
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
      bgColor: 'bg-gradient-to-br from-emerald-500 to-teal-500'
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
      bgColor: 'bg-gradient-to-br from-purple-500 to-violet-500'
    }
  ]

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 mb-6 tracking-tight">
            Discover <span className="text-gradient-primary">Verified Influencers</span>
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            Browse our curated database of admin-verified influencers with transparent metrics and trust scores
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {influencers.map((influencer) => (
            <div key={influencer.id} className="card-glass p-6 hover:-translate-y-2 transition-transform duration-300 group">
              <div className="flex items-center justify-between mb-6">
                <div className={`w-14 h-14 ${influencer.bgColor} rounded-2xl flex items-center justify-center text-white font-bold text-lg shadow-lg`}>
                  {influencer.avatar}
                </div>
                {influencer.verified && (
                  <div className="bg-blue-50 p-2 rounded-full">
                    <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
              </div>

              <h3 className="text-lg font-bold text-slate-900 mb-1">{influencer.name}</h3>
              <p className="text-sm text-slate-500 mb-6">{influencer.category}</p>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-500">Followers</span>
                  <span className="font-bold text-slate-900">{influencer.followers}</span>
                </div>

                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-500">Engagement</span>
                  <span className="font-bold text-slate-900">{influencer.engagement}</span>
                </div>

                <div className="pt-4 border-t border-slate-100">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-semibold text-brand-primary">Trust Score</span>
                    <span className="text-sm font-bold text-slate-900">{influencer.trustScore}</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-brand-primary to-brand-secondary"
                      style={{ width: `${influencer.trustScore}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              <button className="w-full py-3 border border-slate-200 text-slate-700 rounded-xl hover:border-brand-primary hover:text-brand-primary transition-all duration-300 font-semibold bg-white group-hover:shadow-md">
                View Profile
              </button>
            </div>
          ))}
        </div>

        <div className="text-center mt-16">
          <button className="btn-primary text-lg px-8 py-4 shadow-xl">
            Browse All Verified Influencers
          </button>
        </div>
      </div>
    </section>
  )
}

export default InfluencerPreview
