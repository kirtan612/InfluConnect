import React from 'react'
import Navbar from '../components/Navbar'
import Hero from '../components/Hero'
import ProblemSolution from '../components/ProblemSolution'
import HowItWorks from '../components/HowItWorks'
import TrustSection from '../components/TrustSection'
import InfluencerPreview from '../components/InfluencerPreview'
import RoleBasedValue from '../components/RoleBasedValue'
import Footer from '../components/Footer'

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <Hero />
      <ProblemSolution />
      <HowItWorks />
      <TrustSection />
      <InfluencerPreview />
      <RoleBasedValue />
      <Footer />
    </div>
  )
}

export default LandingPage