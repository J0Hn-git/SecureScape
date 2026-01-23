import React from 'react';
import { useSecurityMode } from '../../contexts/SecurityModeContext';
import { useTheme } from '../../contexts/ThemeContext';

const Badge = ({ 
  children, 
  variant = 'default',
  className = '' 
}) => {
  const { mode } = useSecurityMode();
  const { isDarkMode } = useTheme();
  
  const variants = {
    default: isDarkMode
      ? 'bg-gray-700 text-gray-200'
      : 'bg-gray-100 text-gray-800',
    insecure: isDarkMode
      ? 'bg-red-900/40 text-red-300'
      : 'bg-red-100 text-red-800',
    secure: isDarkMode
      ? 'bg-green-900/40 text-green-300'
      : 'bg-green-100 text-green-800',
    warning: isDarkMode
      ? 'bg-amber-900/40 text-amber-300'
      : 'bg-amber-100 text-amber-800',
    info: isDarkMode
      ? 'bg-blue-900/40 text-blue-300'
      : 'bg-blue-100 text-blue-800',
    success: isDarkMode
      ? 'bg-green-900/40 text-green-300'
      : 'bg-green-100 text-green-800',
  };
  
  // If variant is 'mode', use current security mode
  const badgeVariant = variant === 'mode' 
    ? (mode === 'secure' ? 'secure' : 'insecure')
    : variant;
  
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold transition-colors duration-300 ${variants[badgeVariant]} ${className}`}>
      {children}
    </span>
  );
};

export default Badge;
