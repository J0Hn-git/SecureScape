import React, { useState } from 'react';
import { FiChevronDown, FiChevronUp, FiInfo } from 'react-icons/fi';
import { useTheme } from '../../contexts/ThemeContext';

const InfoPanel = ({ 
  title, 
  children, 
  defaultOpen = false,
  className = '' 
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const { isDarkMode } = useTheme();
  
  const bgColor = isDarkMode ? 'bg-blue-900/30' : 'bg-blue-50';
  const borderColor = isDarkMode ? 'border-blue-700' : 'border-blue-200';
  const hoverBg = isDarkMode ? 'hover:bg-blue-900/50' : 'hover:bg-blue-100';
  const textColor = isDarkMode ? 'text-blue-300' : 'text-blue-900';
  const contentText = isDarkMode ? 'text-blue-300' : 'text-blue-800';
  
  return (
    <div className={`${bgColor} border ${borderColor} rounded-lg transition-colors duration-300 ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full px-4 py-3 flex items-center justify-between text-left ${hoverBg} transition-colors rounded-lg focus-ring`}
        aria-expanded={isOpen}
      >
        <div className="flex items-center gap-2">
          <FiInfo className="w-5 h-5 text-blue-600" aria-hidden="true" />
          <span className={`font-semibold ${textColor} transition-colors duration-300`}>{title}</span>
        </div>
        {isOpen ? (
          <FiChevronUp className="w-5 h-5 text-blue-600" aria-hidden="true" />
        ) : (
          <FiChevronDown className="w-5 h-5 text-blue-600" aria-hidden="true" />
        )}
      </button>
      {isOpen && (
        <div className={`px-4 pb-4 text-sm ${contentText} transition-colors duration-300`}>
          {children}
        </div>
      )}
    </div>
  );
};

export default InfoPanel;
