import React from 'react';
import { useSecurityMode } from '../../contexts/SecurityModeContext';
import { useTheme } from '../../contexts/ThemeContext';

const Button = ({ 
  children, 
  onClick, 
  variant = 'primary', 
  disabled = false,
  type = 'button',
  className = '',
  ...props 
}) => {
  const { mode } = useSecurityMode();
  const { isDarkMode } = useTheme();
  
  const baseClasses = 'px-4 py-2 rounded-md font-semibold transition-all duration-200 focus-ring disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variantClasses = {
    primary: mode === 'secure' 
      ? 'bg-green-600 hover:bg-green-700 text-white' 
      : 'bg-red-600 hover:bg-red-700 text-white',
    secondary: isDarkMode
      ? 'bg-gray-700 hover:bg-gray-600 text-gray-200'
      : 'bg-gray-200 hover:bg-gray-300 text-gray-900',
    outline: mode === 'secure'
      ? (isDarkMode 
          ? 'border-2 border-green-500 text-green-400 hover:bg-green-900/30'
          : 'border-2 border-green-600 text-green-600 hover:bg-green-50')
      : (isDarkMode
          ? 'border-2 border-red-500 text-red-400 hover:bg-red-900/30'
          : 'border-2 border-red-600 text-red-600 hover:bg-red-50'),
    ghost: isDarkMode
      ? 'hover:bg-gray-700 text-gray-300'
      : 'hover:bg-gray-100 text-gray-700',
  };
  
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
