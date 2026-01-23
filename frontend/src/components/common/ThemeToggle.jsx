import React from 'react';
import { FiMoon, FiSun } from 'react-icons/fi';

const ThemeToggle = ({ isDarkMode, onToggle, className = '' }) => {
  return (
    <button
      onClick={onToggle}
      className={`p-2 rounded-lg transition-all duration-300 hover:shadow-md ${
        isDarkMode 
          ? 'hover:bg-gray-700 text-yellow-400' 
          : 'hover:bg-white/80 text-gray-700'
      } ${className}`}
      title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
      aria-label={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
    >
      {isDarkMode ? (
        <FiSun className="w-5 h-5 transition-transform duration-300 hover:rotate-180" />
      ) : (
        <FiMoon className="w-5 h-5 transition-transform duration-300 hover:rotate-12" />
      )}
    </button>
  );
};

export default ThemeToggle;
