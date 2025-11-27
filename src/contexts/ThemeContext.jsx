import React, { createContext, useContext, useState, useEffect } from 'react'

const ThemeContext = createContext()

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}

// Separate theme providers for different parts of the app
export const ThemeProvider = ({ children, storageKey = 'theme' }) => {
  const [isDarkMode, setIsDarkMode] = useState(false)

  useEffect(() => {
    const savedTheme = localStorage.getItem(storageKey)
    if (savedTheme) {
      setIsDarkMode(savedTheme === 'dark')
    } else {
      // Default to light mode
      setIsDarkMode(false)
    }
  }, [storageKey])

  useEffect(() => {
    const root = window.document.documentElement
    
    // Only apply dark mode class for dashboard
    if (storageKey === 'admin-theme') {
      if (isDarkMode) {
        root.classList.add('dark')
        localStorage.setItem(storageKey, 'dark')
      } else {
        root.classList.remove('dark')
        localStorage.setItem(storageKey, 'light')
      }
    } else {
      // For website, store preference but don't apply dark class
      localStorage.setItem(storageKey, isDarkMode ? 'dark' : 'light')
    }
  }, [isDarkMode, storageKey])

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode)
  }

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}
