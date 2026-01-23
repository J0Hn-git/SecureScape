import React, { useState } from 'react';
import { FiCopy, FiCheck } from 'react-icons/fi';
import { useTheme } from '../../contexts/ThemeContext';

const CodeBlock = ({ 
  code, 
  language = 'javascript', 
  title,
  className = '' 
}) => {
  const [copied, setCopied] = useState(false);
  const { isDarkMode } = useTheme();
  
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };
  
  // Theme-aware colors
  const bgColor = isDarkMode ? 'bg-gray-900' : 'bg-gray-800';
  const titleBg = isDarkMode ? 'bg-gray-800' : 'bg-gray-700';
  const titleText = isDarkMode ? 'text-gray-200' : 'text-gray-200';
  const codeText = isDarkMode ? 'text-gray-100' : 'text-gray-100';
  const buttonBg = isDarkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-700 hover:bg-gray-600';
  const buttonText = isDarkMode ? 'text-gray-300' : 'text-gray-300';
  
  return (
    <div className={`relative ${className}`}>
      {title && (
        <div className={`${titleBg} ${titleText} px-4 py-2 rounded-t-lg text-sm font-medium transition-colors duration-300`}>
          {title}
        </div>
      )}
      <div className={`relative ${bgColor} rounded-lg overflow-hidden transition-colors duration-300`}>
        <pre className="p-4 overflow-x-auto">
          <code className={`text-sm ${codeText} font-mono`}>
            {code}
          </code>
        </pre>
        <button
          onClick={handleCopy}
          className={`absolute top-2 right-2 p-2 ${buttonBg} ${buttonText} rounded transition-colors focus-ring`}
          aria-label="Copy code"
          title="Copy code"
        >
          {copied ? (
            <FiCheck className="w-4 h-4 text-green-400" />
          ) : (
            <FiCopy className="w-4 h-4" />
          )}
        </button>
      </div>
    </div>
  );
};

export default CodeBlock;
