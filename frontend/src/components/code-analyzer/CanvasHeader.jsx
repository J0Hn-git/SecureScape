import React from 'react';
import { FiZap, FiX, FiMaximize2, FiMinimize2 } from 'react-icons/fi';
import { useTheme } from '../../contexts/ThemeContext';

const CanvasHeader = ({ isExpanded, onToggleSize, onClose }) => {
  const { isDarkMode } = useTheme();

  return (
    <div className={`relative flex items-center justify-between p-5 shadow-sm transition-colors duration-300 ${
      isDarkMode 
        ? 'bg-gradient-to-r from-gray-800 via-gray-900 to-gray-800 border-b border-gray-700'
        : 'bg-gradient-to-r from-green-50 via-emerald-50 to-teal-50 border-b border-gray-200'
    }`}>
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-lg shadow-sm transition-colors duration-300 ${
          isDarkMode ? 'bg-gray-800' : 'bg-white'
        }`}>
          <FiZap className="w-6 h-6 text-green-600" />
        </div>
        <div>
          <h2 className="text-xl font-bold bg-gradient-to-r from-green-700 to-emerald-700 bg-clip-text text-transparent">
            Code Analyzer Canvas
          </h2>
          <p className={`text-xs transition-colors duration-300 ${
            isDarkMode ? 'text-gray-400' : 'text-gray-600'
          }`}>
            AI-powered vulnerability detection & code fixing
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={onToggleSize}
          className={`p-2 rounded-lg transition-all duration-200 hover:shadow-md ${
            isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-white/80'
          }`}
          title={isExpanded ? 'Minimize' : 'Maximize'}
        >
          {isExpanded ? (
            <FiMinimize2 className={`w-5 h-5 transition-colors duration-300 ${
              isDarkMode ? 'text-gray-300' : 'text-gray-700'
            }`} />
          ) : (
            <FiMaximize2 className={`w-5 h-5 transition-colors duration-300 ${
              isDarkMode ? 'text-gray-300' : 'text-gray-700'
            }`} />
          )}
        </button>
        <button
          onClick={onClose}
          className={`p-2 rounded-lg transition-all duration-200 hover:shadow-md group ${
            isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-red-50'
          }`}
          title="Close"
        >
          <FiX className={`w-5 h-5 group-hover:text-red-600 transition-colors ${
            isDarkMode ? 'text-gray-300' : 'text-gray-700'
          }`} />
        </button>
      </div>
    </div>
  );
};

export default CanvasHeader;
