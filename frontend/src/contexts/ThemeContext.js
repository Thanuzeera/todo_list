import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    // Check localStorage for saved theme preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      return savedTheme === 'dark';
    }
    // Default to light mode
    return false;
  });

  useEffect(() => {
    // Save theme preference to localStorage
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
    
    // Apply theme to document body and html
    if (isDarkMode) {
      document.documentElement.classList.add('dark-theme');
      document.documentElement.classList.remove('light-theme');
      document.body.classList.add('dark-theme');
      document.body.classList.remove('light-theme');
    } else {
      document.documentElement.classList.add('light-theme');
      document.documentElement.classList.remove('dark-theme');
      document.body.classList.add('light-theme');
      document.body.classList.remove('dark-theme');
    }
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode(prev => !prev);
  };

  const theme = {
    isDarkMode,
    toggleTheme,
    colors: {
      primary: isDarkMode ? '#4a90e2' : '#1e3a8a',
      background: isDarkMode ? '#1a1a1a' : '#ffffff',
      surface: isDarkMode ? '#2d2d2d' : '#f8f9fa',
      text: isDarkMode ? '#ffffff' : '#000000',
      textSecondary: isDarkMode ? '#b0b0b0' : '#6c757d',
      border: isDarkMode ? '#404040' : '#dee2e6',
      card: isDarkMode ? '#2d2d2d' : '#ffffff',
      navbar:  '#1e3a8a',
      success: '#198754',
      warning: '#ffc107',
      danger: '#dc3545',
      info: '#0dcaf0'
    }
  };

  

  return (
    <ThemeContext.Provider value={theme}>
      {children}
    </ThemeContext.Provider>
  );
};
