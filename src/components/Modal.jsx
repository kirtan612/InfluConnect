import React from 'react'

const Modal = ({ isOpen, onClose, title, children, variant = 'default' }) => {
  if (!isOpen) return null

  const getVariantStyles = () => {
    switch (variant) {
      case 'login':
        return 'bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 border-blue-500/30'
      case 'signup':
        return 'bg-gradient-to-br from-emerald-900 via-teal-900 to-cyan-900 border-emerald-500/30'
      default:
        return 'bg-dark-800 border-accent-purple/30'
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 animate-fade-in backdrop-blur-sm">
      <div className={`${getVariantStyles()} border rounded-xl p-8 max-w-md w-full mx-4 animate-slide-up shadow-2xl`}>
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-bold text-white">{title}</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-2xl font-bold transition-colors hover:rotate-90 duration-300"
          >
            ×
          </button>
        </div>
        <div className="text-gray-300">
          {children}
        </div>
      </div>
    </div>
  )
}

export default Modal