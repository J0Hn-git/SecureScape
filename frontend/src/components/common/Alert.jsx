import React from 'react';
import { FiInfo, FiAlertTriangle, FiCheckCircle, FiXCircle } from 'react-icons/fi';
import { useTheme } from '../../contexts/ThemeContext';

const Alert = ({ 
  type = 'info', 
  title, 
  children, 
  className = '' 
}) => {
  const { isDarkMode } = useTheme();
  
  const icons = {
    info: FiInfo,
    warning: FiAlertTriangle,
    success: FiCheckCircle,
    error: FiXCircle,
  };
  
  const styles = {
    info: isDarkMode 
      ? 'bg-blue-900/30 border-blue-700 text-blue-300'
      : 'bg-blue-50 border-blue-200 text-blue-800',
    warning: isDarkMode
      ? 'bg-amber-900/30 border-amber-700 text-amber-300'
      : 'bg-amber-50 border-amber-200 text-amber-800',
    success: isDarkMode
      ? 'bg-green-900/30 border-green-700 text-green-300'
      : 'bg-green-50 border-green-200 text-green-800',
    error: isDarkMode
      ? 'bg-red-900/30 border-red-700 text-red-300'
      : 'bg-red-50 border-red-200 text-red-800',
  };
  
  const Icon = icons[type];
  
  return (
    <div 
      className={`border rounded-lg p-4 flex items-start gap-3 transition-colors duration-300 ${styles[type]} ${className}`}
      role="alert"
    >
      <Icon className="w-5 h-5 mt-0.5 flex-shrink-0" aria-hidden="true" />
      <div className="flex-1">
        {title && (
          <h4 className="font-semibold mb-1">{title}</h4>
        )}
        <div className="text-sm">{children}</div>
      </div>
    </div>
  );
};

export default Alert;
