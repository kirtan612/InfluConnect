import React, { createContext, useContext, useState, useEffect } from 'react'

const ThemeContext = createContext()

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}

export const ThemeProvider = ({ children }) => {
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme')
    if (savedTheme) {
      setIsDark(savedTheme === 'dark')
    }
  }, [])

  const toggleTheme = () => {
    const newTheme = !isDark
    setIsDark(newTheme)
    localStorage.setItem('theme', newTheme ? 'dark' : 'light')
  }

  const theme = {
    isDark,
    toggleTheme,
    colors: isDark ? {
      bg: 'bg-gray-900',
      bgSecondary: 'bg-gray-800',
      text: 'text-white',
      textSecondary: 'text-gray-300',
      primary: '#7C3AED',
      accent: '#F59E0B',
    } : {
      bg: 'bg-blue-50',
      bgSecondary: 'bg-white',
      text: 'text-gray-900',
      textSecondary: 'text-gray-600',
      primary: '#2563EB',
      accent: '#059669',
    }
  }

  return (
    <ThemeContext.Provider value={theme}>
      <div className={isDark ? 'dark' : 'light'}>
        {children}
      </div>
    </ThemeContext.Provider>
  )
}