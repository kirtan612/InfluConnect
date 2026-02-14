import React from 'react'

const FloatingShapes = () => {
  const shapes = [
    { size: 'w-16 h-16', color: 'bg-accent-purple', position: 'top-20 left-10', animation: 'animate-float' },
    { size: 'w-12 h-12', color: 'bg-accent-blue', position: 'top-40 right-20', animation: 'animate-float-delayed' },
    { size: 'w-20 h-20', color: 'bg-accent-cyan', position: 'bottom-32 left-1/4', animation: 'animate-bounce-slow' },
    { size: 'w-8 h-8', color: 'bg-accent-pink', position: 'top-1/3 right-1/3', animation: 'animate-float' },
    { size: 'w-14 h-14', color: 'bg-accent-green', position: 'bottom-20 right-10', animation: 'animate-float-delayed' },
    { size: 'w-10 h-10', color: 'bg-accent-orange', position: 'top-1/2 left-20', animation: 'animate-bounce-slow' },
  ]

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {shapes.map((shape, index) => (
        <div
          key={index}
          className={`floating-shape ${shape.size} ${shape.color} ${shape.position} ${shape.animation} rounded-lg blur-sm`}
          style={{
            animationDelay: `${index * 0.5}s`,
          }}
        />
      ))}
    </div>
  )
}

export default FloatingShapes

Update according to backend
