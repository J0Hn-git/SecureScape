import React from 'react';
import { useSecurityMode } from '../../contexts/SecurityModeContext';
import { useTheme } from '../../contexts/ThemeContext';

const Input = ({ 
  label, 
  type = 'text', 
  value, 
  onChange, 
  placeholder,
  error,
  required = false,
  className = '',
  ...props 
}) => {
  const { mode } = useSecurityMode();
  const { isDarkMode } = useTheme();
  
  const inputId = `input-${label?.toLowerCase().replace(/\s+/g, '-') || 'input'}`;
  
  // Theme-aware colors
  const labelColor = isDarkMode ? 'text-gray-300' : 'text-gray-700';
  const inputBg = isDarkMode ? 'bg-gray-700' : 'bg-white';
  const inputText = isDarkMode ? 'text-gray-200' : 'text-gray-900';
  const inputBorder = isDarkMode ? 'border-gray-600' : 'border-gray-300';
  const placeholderColor = isDarkMode ? 'placeholder-gray-400' : 'placeholder-gray-400';
  
  const baseClasses = `w-full px-3 py-2 border rounded-md transition-colors duration-200 focus-ring ${inputBg} ${inputText} ${placeholderColor}`;
  
  const modeClasses = mode === 'secure' 
    ? 'focus:border-green-500 focus:ring-green-500' 
    : 'focus:border-red-500 focus:ring-red-500';
  
  const errorClasses = error ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : inputBorder;
  
  return (
    <div className="w-full">
      {label && (
        <label 
          htmlFor={inputId} 
          className={`block text-sm font-medium ${labelColor} mb-1 transition-colors duration-300`}
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <input
        id={inputId}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`${baseClasses} ${modeClasses} ${errorClasses} ${className}`}
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={error ? `${inputId}-error` : undefined}
        {...props}
      />
      {error && (
        <p id={`${inputId}-error`} className="mt-1 text-sm text-red-600" role="alert">
          {error}
        </p>
      )}
    </div>
  );
};

export default Input;
