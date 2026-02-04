import React from 'react'

const Logo = ({ size = 'md', variant = 'full' }) => {
  const sizes = {
    sm: { container: 'w-6 h-6', text: 'text-xs', fullText: 'text-sm' },
    md: { container: 'w-8 h-8', text: 'text-sm', fullText: 'text-xl' },
    lg: { container: 'w-12 h-12', text: 'text-lg', fullText: 'text-2xl' },
    xl: { container: 'w-16 h-16', text: 'text-xl', fullText: 'text-3xl' }
  }

  const LogoIcon = () => (
    <div className={`${sizes[size].container} bg-gradient-to-br from-brand-navy via-brand-indigo to-brand-teal rounded-lg flex items-center justify-center shadow-sm`}>
      <span className={`${sizes[size].text} font-bold text-white tracking-wider`}>
        IC
      </span>
    </div>
  )

  if (variant === 'icon') {
    return <LogoIcon />
  }

  return (
    <div className="flex items-center space-x-3">
      <LogoIcon />
      <span className={`${sizes[size].fullText} font-bold bg-gradient-to-r from-brand-navy to-brand-teal bg-clip-text text-transparent`}>
        InfluConnect
      </span>
    </div>
  )
}

export default Logo