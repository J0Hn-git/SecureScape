import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};

// Theme styles object
export const themeStyles = {
  canvasBackground: (isDarkMode) => ({
    background: isDarkMode 
      ? 'linear-gradient(135deg, rgba(17, 24, 39, 0.98) 0%, rgba(31, 41, 55, 0.98) 100%)'
      : 'linear-gradient(135deg, rgba(255,255,255,0.98) 0%, rgba(249,250,251,0.98) 100%)',
    backdropFilter: 'blur(20px)',
    boxShadow: '-10px 0 40px rgba(0,0,0,0.2)'
  }),

  headerClasses: (isDarkMode) => 
    isDarkMode 
      ? 'bg-gradient-to-r from-gray-800 via-gray-900 to-gray-800 border-gray-700' 
      : 'bg-gradient-to-r from-green-50 via-emerald-50 to-teal-50 border-gray-200',

  textPrimary: (isDarkMode) => isDarkMode ? 'text-gray-200' : 'text-gray-900',
  textSecondary: (isDarkMode) => isDarkMode ? 'text-gray-400' : 'text-gray-600',
  textLabel: (isDarkMode) => isDarkMode ? 'text-gray-300' : 'text-gray-700',

  bgPrimary: (isDarkMode) => isDarkMode ? 'bg-gray-800' : 'bg-white',
  bgSecondary: (isDarkMode) => isDarkMode ? 'bg-gray-900' : 'bg-gray-50',

  borderPrimary: (isDarkMode) => isDarkMode ? 'border-gray-600' : 'border-gray-300',

  inputClasses: (isDarkMode) => 
    isDarkMode 
      ? 'bg-gray-800 border-gray-600 text-gray-200 focus:border-green-400' 
      : 'bg-white border-gray-300 text-gray-900 focus:border-green-500',

  lineNumberClasses: (isDarkMode) =>
    isDarkMode 
      ? 'bg-gradient-to-b from-gray-700 to-gray-800 text-gray-500 border-gray-600' 
      : 'bg-gradient-to-b from-gray-50 to-gray-100 text-gray-500 border-gray-200',

  activeLineHighlight: (isDarkMode) => ({
    backgroundColor: isDarkMode ? 'rgba(34, 197, 94, 0.15)' : 'rgba(34, 197, 94, 0.08)',
    borderLeft: `3px solid ${isDarkMode ? 'rgb(74, 222, 128)' : 'rgb(34, 197, 94)'}`
  }),

  placeholderClasses: (isDarkMode) =>
    isDarkMode ? 'placeholder-gray-500' : 'placeholder-gray-400'
};

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme === 'dark';
  });

  useEffect(() => {
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode(prev => !prev);
  };

  const value = {
    isDarkMode,
    toggleTheme,
    theme: isDarkMode ? 'dark' : 'light'
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};
