import React, { useRef, useEffect, useState } from 'react';
import { useTheme } from '../../contexts/ThemeContext';

const CodeEditor = ({ code, setCode, language }) => {
  const { isDarkMode } = useTheme();
  const [lineNumbers, setLineNumbers] = useState([1]);
  const textareaRef = useRef(null);
  const lineNumbersRef = useRef(null);

  useEffect(() => {
    const lines = code.split('\n').length;
    setLineNumbers(Array.from({ length: lines }, (_, i) => i + 1));
  }, [code]);

  const handleScroll = () => {
    if (textareaRef.current && lineNumbersRef.current) {
      lineNumbersRef.current.scrollTop = textareaRef.current.scrollTop;
    }
  };

  const updateActiveLineHighlight = (textarea) => {
    if (!textarea) return;
    const cursorPosition = textarea.selectionStart;
    const textBeforeCursor = textarea.value.substring(0, cursorPosition);
    const currentLine = textBeforeCursor.split('\n').length;
    const highlightElement = document.getElementById('active-line-highlight');
    if (highlightElement) {
      highlightElement.style.top = `${(currentLine - 1) * 21 + 16}px`;
    }
  };

  const activeLineStyle = {
    height: '21px',
    backgroundColor: isDarkMode ? 'rgba(34, 197, 94, 0.15)' : 'rgba(34, 197, 94, 0.08)',
    borderLeft: `3px solid ${isDarkMode ? 'rgb(74, 222, 128)' : 'rgb(34, 197, 94)'}`,
    top: '16px',
    zIndex: 0
  };

  return (
    <div className="transform transition-all duration-300 hover:scale-[1.005]">
      <label 
        htmlFor="canvas-code" 
        className={`block text-sm font-semibold mb-2 transition-colors duration-300 ${
          isDarkMode ? 'text-gray-300' : 'text-gray-700'
        }`}
      >
        Paste Your Code
      </label>
      <div className={`relative flex border-2 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-green-500 focus-within:border-green-500 shadow-lg hover:shadow-xl transition-all duration-300 ${
        isDarkMode ? 'bg-gray-800 border-gray-600' : 'bg-white border-gray-300'
      }`}>
        
        {/* Line Numbers */}
        <div 
          ref={lineNumbersRef}
          className={`text-right select-none border-r-2 py-4 pr-3 transition-colors duration-300 ${
            isDarkMode 
              ? 'bg-gradient-to-b from-gray-700 to-gray-800 text-gray-500 border-gray-600'
              : 'bg-gradient-to-b from-gray-50 to-gray-100 text-gray-500 border-gray-200'
          }`}
          style={{
            width: '50px',
            minHeight: '384px',
            maxHeight: '384px',
            overflowY: 'hidden',
            fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
            fontSize: '14px',
            lineHeight: '21px'
          }}
        >
          {lineNumbers.map((num) => (
            <div key={num} style={{ height: '21px', lineHeight: '21px' }}>
              {num}
            </div>
          ))}
        </div>

        {/* Code Textarea */}
        <div className="relative flex-1">
          <div 
            id="active-line-highlight"
            className="absolute left-0 right-0 pointer-events-none transition-all duration-150 ease-out"
            style={activeLineStyle}
          />

          <textarea
            ref={textareaRef}
            id="canvas-code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            onScroll={handleScroll}
            onSelect={(e) => updateActiveLineHighlight(e.target)}
            onKeyUp={(e) => updateActiveLineHighlight(e.target)}
            onClick={(e) => updateActiveLineHighlight(e.target)}
            placeholder={`Paste your ${language.charAt(0).toUpperCase() + language.slice(1)} code here...`}
            spellCheck="false"
            className={`relative py-4 px-4 border-0 focus:ring-0 focus:outline-none resize-none bg-transparent w-full transition-colors duration-300 ${
              isDarkMode ? 'text-gray-200 placeholder-gray-500' : 'text-gray-900 placeholder-gray-400'
            }`}
            style={{
              fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
              fontSize: '14px',
              lineHeight: '21px',
              minHeight: '384px',
              maxHeight: '384px',
              zIndex: 1
            }}
          />
        </div>
      </div>
      {code && (
        <div className={`mt-2 text-sm flex items-center gap-2 transition-colors duration-300 ${
          isDarkMode ? 'text-gray-400' : 'text-gray-500'
        }`}>
          <span className="inline-block w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
          {code.split('\n').length} lines • {code.length} characters
        </div>
      )}
    </div>
  );
};

export default CodeEditor;
