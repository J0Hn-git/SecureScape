import React from 'react';
import { Link } from 'react-router-dom';
import { useSecurityMode } from '../../contexts/SecurityModeContext';
import { useTheme } from '../../contexts/ThemeContext';
import ModeToggle from './ModeToggle';
import ThemeToggle from '../common/ThemeToggle';

const Header = () => {
  const { mode } = useSecurityMode();
  const { isDarkMode, toggleTheme } = useTheme();
  
  const borderColor = mode === 'secure' 
    ? 'border-green-500' 
    : 'border-red-500';
  
  const headerBg = isDarkMode 
    ? 'bg-gray-800' 
    : 'bg-white';
    
  const textColor = isDarkMode 
    ? 'text-gray-100 hover:text-blue-400' 
    : 'text-gray-900 hover:text-blue-600';
  
  return (
    <header 
      className={`fixed top-0 left-0 right-0 h-16 ${headerBg} border-b-2 ${borderColor} shadow-sm z-50 transition-colors duration-300`}
      role="banner"
    >
      <div className="h-full px-4 lg:px-6 flex items-center justify-between max-w-full">
        <Link 
          to="/" 
          className={`flex items-center gap-2 text-xl font-bold ${textColor} transition-colors focus-ring rounded`}
          aria-label="SecureScape Home"
        >
          <span className="text-2xl">🛡️</span>
          <span>SecureScape</span>
        </Link>
        
        <div className="flex items-center gap-4">
          <ThemeToggle isDarkMode={isDarkMode} onToggle={toggleTheme} />
          <ModeToggle />
        </div>
      </div>
    </header>
  );
};

export default Header;
