import React from 'react';
import { useSecurityMode } from '../../contexts/SecurityModeContext';
import { useTheme } from '../../contexts/ThemeContext';

const DemoCard = ({ 
  title, 
  children, 
  badge,
  className = '',
  ...props 
}) => {
  const { mode } = useSecurityMode();
  const { isDarkMode } = useTheme();
  
  const borderColor = mode === 'secure' ? 'border-green-500' : 'border-red-500';
  
  const bgBase = isDarkMode ? 'bg-gray-800' : 'bg-white';
  const bgTint = mode === 'secure' 
    ? (isDarkMode ? 'bg-green-900/20' : 'bg-green-50')
    : (isDarkMode ? 'bg-red-900/20' : 'bg-red-50');
  
  const textPrimary = isDarkMode ? 'text-gray-100' : 'text-gray-900';
  const textSecondary = isDarkMode ? 'text-gray-300' : 'text-gray-700';
  
  const badgeStyle = mode === 'secure'
    ? (isDarkMode ? 'bg-green-900/40 text-green-300' : 'bg-green-100 text-green-800')
    : (isDarkMode ? 'bg-red-900/40 text-red-300' : 'bg-red-100 text-red-800');
  
  return (
    <div 
      className={`${bgBase} ${bgTint} border-l-4 ${borderColor} rounded-lg shadow-sm p-6 transition-colors duration-300 ${className}`}
      {...props}
    >
      {title && (
        <div className="flex items-center justify-between mb-4">
          <h3 className={`text-xl font-semibold ${textPrimary} transition-colors duration-300`}>{title}</h3>
          {badge && (
            <span className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors duration-300 ${badgeStyle}`}>
              {badge}
            </span>
          )}
        </div>
      )}
      <div className={`${textSecondary} transition-colors duration-300`}>
        {children}
      </div>
    </div>
  );
};

export default DemoCard;
