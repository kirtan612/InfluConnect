import React from 'react'

const ThreeDObjects = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* 3D Cube */}
      <div className="absolute top-20 right-20 animate-float">
        <div className="relative w-16 h-16 transform-gpu" style={{ transformStyle: 'preserve-3d', transform: 'rotateX(15deg) rotateY(45deg)' }}>
          <div className="absolute w-16 h-16 bg-gradient-to-br from-accent-blue to-accent-cyan opacity-80 transform translate-z-8" style={{ transform: 'translateZ(32px)' }}></div>
          <div className="absolute w-16 h-16 bg-gradient-to-br from-accent-purple to-accent-pink opacity-60 transform rotate-y-90 translate-z-8" style={{ transform: 'rotateY(90deg) translateZ(32px)' }}></div>
          <div className="absolute w-16 h-16 bg-gradient-to-br from-accent-green to-accent-cyan opacity-40 transform rotate-x-90 translate-z-8" style={{ transform: 'rotateX(90deg) translateZ(32px)' }}></div>
        </div>
      </div>

      {/* 3D Pyramid */}
      <div className="absolute bottom-32 left-20 animate-float-delayed">
        <div className="relative w-20 h-20 transform-gpu" style={{ transformStyle: 'preserve-3d', transform: 'rotateX(20deg) rotateY(-30deg)' }}>
          <div className="absolute w-0 h-0 border-l-10 border-r-10 border-b-20 border-transparent border-b-accent-orange opacity-70 transform origin-bottom"></div>
          <div className="absolute w-0 h-0 border-l-10 border-r-10 border-b-20 border-transparent border-b-accent-pink opacity-50 transform origin-bottom rotate-90"></div>
        </div>
      </div>

      {/* 3D Sphere */}
      <div className="absolute top-1/2 left-1/4 animate-bounce-slow">
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-accent-purple via-accent-pink to-accent-orange opacity-60 shadow-2xl" style={{ boxShadow: '0 0 30px rgba(139, 92, 246, 0.4)' }}></div>
      </div>

      {/* Network Connection Lines */}
      <svg className="absolute inset-0 w-full h-full opacity-20" viewBox="0 0 800 600">
        <defs>
          <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3b82f6" />
            <stop offset="50%" stopColor="#8b5cf6" />
            <stop offset="100%" stopColor="#06b6d4" />
          </linearGradient>
        </defs>
        <path d="M100,100 Q400,50 700,200" stroke="url(#lineGradient)" strokeWidth="2" fill="none" className="animate-pulse" />
        <path d="M150,300 Q400,250 650,400" stroke="url(#lineGradient)" strokeWidth="2" fill="none" className="animate-pulse" style={{ animationDelay: '1s' }} />
        <circle cx="100" cy="100" r="4" fill="#3b82f6" className="animate-pulse" />
        <circle cx="700" cy="200" r="4" fill="#06b6d4" className="animate-pulse" />
        <circle cx="150" cy="300" r="4" fill="#8b5cf6" className="animate-pulse" />
        <circle cx="650" cy="400" r="4" fill="#ec4899" className="animate-pulse" />
      </svg>
    </div>
  )
}

export default ThreeDObjects