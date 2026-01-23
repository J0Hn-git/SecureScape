import React, { useEffect, useState, useRef } from 'react';
import { FiCode, FiAlertTriangle, FiZap, FiX, FiMaximize2, FiMinimize2 } from 'react-icons/fi';
import DemoCard from '../components/common/DemoCard';
import Alert from '../components/common/Alert';
import Badge from '../components/common/Badge';
import ThemeToggle from '../components/common/ThemeToggle';
import { useTheme } from '../contexts/ThemeContext';
import { themeStyles } from '../utils/themeStyles';

const CodeRegenerator = () => {
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('java');
  const [isScanning, setIsScanning] = useState(false);
  const [scanResults, setScanResults] = useState(null);
  const [isCanvasOpen, setIsCanvasOpen] = useState(false);
  const [isCanvasExpanded, setIsCanvasExpanded] = useState(false);
  const [lineNumbers, setLineNumbers] = useState([1]);
  const textareaRef = useRef(null);
  const lineNumbersRef = useRef(null);
  
  // Use theme context
  const { isDarkMode, toggleTheme } = useTheme();
 
  useEffect(() => {
    const lines = code.split('\n').length;
    setLineNumbers(Array.from({length: lines}, (_, i) => i + 1));
  }, [code]);

  const handleScroll = () => {
    if(textareaRef.current && lineNumbersRef.current) {
      lineNumbersRef.current.scrollTop = textareaRef.current.scrollTop;
    }
  };

  const handleOpenCanvas = () => {
    setIsCanvasOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const handleCloseCanvas = () => {
    setIsCanvasOpen(false);
    setIsCanvasExpanded(false);
    document.body.style.overflow = 'unset';
  };

  const toggleCanvasSize = () => {
    setIsCanvasExpanded(!isCanvasExpanded);
  };

  const handleScan = async () => {
    setIsScanning(true);
    
    setTimeout(() => {
      setScanResults({
        vulnerabilities: [
          { type: 'XSS', line: 12, severity: 'High' },
          { type: 'SQL Injection', line: 24, severity: 'Critical' },
        ],
      });
      setIsScanning(false);
    }, 2000);
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <FiZap className="w-8 h-8 text-green-600" />
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Smart Fix</h1>
          <p className="text-gray-600">
            Upload your code to detect vulnerabilities and generate secure fixes.
          </p>
        </div>
      </div>

      <Alert type="info" title="How It Works">
        Our ML model analyzes your code for vulnerabilities, then generates secure alternatives.
      </Alert>

      <DemoCard title="Get Started" badge="AI-Powered">
        <div className="space-y-4">
          <p className="text-gray-700">
            Click the button below to open the code analyzer canvas. You can paste your code,
            select the language, and get instant vulnerability reports with AI-generated fixes.
          </p>
          <button
            onClick={handleOpenCanvas}
            className="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 focus-ring flex items-center gap-2 font-medium shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
          >
            <FiZap className="w-5 h-5" />
            Open Code Canvas
          </button>
        </div>
      </DemoCard>

      <DemoCard title="Features" badge="What You Get">
        <ul className="space-y-2 text-gray-700">
          <li className="flex items-start gap-2">
            <span className="text-green-600 font-bold">✓</span>
            <span>Automated detection of XSS, CSRF, and SQL Injection vulnerabilities</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-600 font-bold">✓</span>
            <span>AI-generated secure code alternatives using CodeT5</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-600 font-bold">✓</span>
            <span>Support for Java, Python, and JavaScript</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-600 font-bold">✓</span>
            <span>Side-by-side code comparison view</span>
          </li>
        </ul>
      </DemoCard>

      {/* Sliding Canvas Panel */}
      {isCanvasOpen && (
        <>
          <div
            className={`fixed inset-0 bg-gradient-to-br from-black/40 via-black/30 to-black/40 backdrop-blur-md z-40 transition-all duration-500 ${
              isCanvasOpen ? 'opacity-100' : 'opacity-0'
            }`}
            onClick={handleCloseCanvas}
          />

          <div
            className={`fixed top-0 right-0 h-full shadow-2xl z-50 transition-all duration-700 ease-out ${
              isCanvasExpanded ? 'w-full' : 'w-full lg:w-2/3'
            } ${isCanvasOpen ? 'translate-x-0 opacity-100 scale-100' : 'translate-x-full opacity-0 scale-95'}`}
            style={themeStyles.canvasBackground(isDarkMode)}
          >
            {/* Enhanced Canvas Header with Theme Toggle */}
            <div className={`relative flex items-center justify-between p-5 border-b shadow-sm transition-colors duration-300 ${themeStyles.headerClasses(isDarkMode)}`}>
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg shadow-sm transition-colors duration-300 ${themeStyles.bgPrimary(isDarkMode)}`}>
                  <FiZap className={`w-6 h-6 transition-colors duration-300 ${
                    isDarkMode ? 'text-green-400' : 'text-green-600'
                  }`} />
                </div>
                <div>
                  <h2 className={`text-xl font-bold bg-gradient-to-r bg-clip-text text-transparent transition-colors duration-300 ${
                    isDarkMode ? 'from-green-400 to-emerald-400' : 'from-green-700 to-emerald-700'
                  }`}>
                    Code Analyzer Canvas
                  </h2>
                  <p className={`text-xs transition-colors duration-300 ${themeStyles.textSecondary(isDarkMode)}`}>
                    AI-powered vulnerability detection
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {/* Theme Toggle Component */}
                <ThemeToggle isDarkMode={isDarkMode} onToggle={toggleTheme} />
                
                <button
                  onClick={toggleCanvasSize}
                  className={`p-2 rounded-lg transition-all duration-200 hover:shadow-md ${
                    isDarkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-white/80 text-gray-700'
                  }`}
                  title={isCanvasExpanded ? 'Minimize' : 'Maximize'}
                >
                  {isCanvasExpanded ? <FiMinimize2 className="w-5 h-5" /> : <FiMaximize2 className="w-5 h-5" />}
                </button>
                <button
                  onClick={handleCloseCanvas}
                  className={`p-2 rounded-lg transition-all duration-200 hover:shadow-md group ${
                    isDarkMode ? 'hover:bg-red-900/50' : 'hover:bg-red-50'
                  }`}
                  title="Close"
                >
                  <FiX className={`w-5 h-5 transition-colors ${
                    isDarkMode ? 'text-gray-300 group-hover:text-red-400' : 'text-gray-700 group-hover:text-red-600'
                  }`} />
                </button>
              </div>
            </div>

            {/* Canvas Content */}
            <div className={`h-[calc(100%-80px)] overflow-y-auto p-6 space-y-6 transition-colors duration-300 ${
              isDarkMode ? 'bg-gray-900' : ''
            }`}>
              {/* Language Selector */}
              <div className="transform transition-all duration-300 hover:scale-[1.01]">
                <label htmlFor="canvas-language" className={`block text-sm font-semibold mb-2 transition-colors duration-300 ${themeStyles.textLabel(isDarkMode)}`}>
                  Select Language
                </label>
                <select
                  id="canvas-language"
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className={`w-48 px-4 py-2 border-2 rounded-lg focus:ring-2 focus:ring-green-500 shadow-sm hover:shadow-md transition-all duration-200 ${themeStyles.inputClasses(isDarkMode)}`}
                >
                  <option value="java">Java</option>
                  <option value="python">Python</option>
                  <option value="javascript">JavaScript</option>
                </select>
              </div>

              {/* Code Input */}
              <div className="transform transition-all duration-300 hover:scale-[1.005]">
                <label htmlFor="canvas-code" className={`block text-sm font-semibold mb-2 transition-colors duration-300 ${themeStyles.textLabel(isDarkMode)}`}>
                  Paste Your Code
                </label>
                <div className={`relative flex border-2 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-green-500 shadow-lg hover:shadow-xl transition-all duration-300 ${
                  isDarkMode ? 'bg-gray-800 border-gray-600 focus-within:border-green-400' : 'bg-white border-gray-300 focus-within:border-green-500'
                }`}>
                  
                  {/* Line Numbers */}
                  <div 
                    ref={lineNumbersRef}
                    className={`text-right select-none border-r-2 py-4 pr-3 transition-colors duration-300 ${themeStyles.lineNumberClasses(isDarkMode)}`}
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
                      <div key={num} style={{height: '21px', lineHeight: '21px'}}>
                        {num}
                      </div>
                    ))}
                  </div>

                  {/* Code Textarea Container */}
                  <div className="relative flex-1">
                    <div 
                      id="active-line-highlight"
                      className="absolute left-0 right-0 pointer-events-none transition-all duration-150 ease-out"
                      style={{
                        height: '21px',
                        ...themeStyles.activeLineHighlight(isDarkMode),
                        top: '16px',
                        zIndex: 0
                      }}
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
                        themeStyles.textPrimary(isDarkMode)
                      } ${themeStyles.placeholderClasses(isDarkMode)}`}
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
                  <div className={`mt-2 text-sm flex items-center gap-2 transition-colors duration-300 ${themeStyles.textSecondary(isDarkMode)}`}>
                    <span className="inline-block w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                    {code.split('\n').length} lines • {code.length} characters
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={handleScan}
                  disabled={!code || isScanning}
                  className="px-8 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed focus-ring flex items-center gap-2 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                >
                  {isScanning ? (
                    <>
                      <span className="animate-spin inline-block">⚙️</span>
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <FiCode className="w-5 h-5" />
                      Analyze Code
                    </>
                  )}
                </button>
                <button
                  onClick={() => setCode('')}
                  className={`px-6 py-3 rounded-lg focus-ring font-medium shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200 ${
                    isDarkMode ? 'bg-gray-700 text-gray-200 hover:bg-gray-600' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Clear
                </button>
              </div>

              {/* Results */}
              {scanResults && (
                <div className="mt-6 space-y-4">
                  <h3 className={`text-lg font-bold flex items-center gap-2 transition-colors duration-300 ${themeStyles.textPrimary(isDarkMode)}`}>
                    <span className="inline-block w-3 h-3 bg-red-500 rounded-full animate-pulse"></span>
                    Vulnerability Report
                  </h3>
                  {scanResults.vulnerabilities.map((vuln, index) => (
                    <div
                      key={index}
                      className={`flex items-start gap-4 p-4 border-2 rounded-lg hover:border-green-400 transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-[1.02] ${
                        isDarkMode ? 'bg-gray-800 border-gray-600' : 'bg-white border-gray-200'
                      }`}
                    >
                      <FiAlertTriangle className="w-6 h-6 text-red-500 flex-shrink-0 mt-1 animate-pulse" />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className={`font-bold transition-colors duration-300 ${themeStyles.textPrimary(isDarkMode)}`}>{vuln.type}</h4>
                          <Badge variant={vuln.severity === 'Critical' ? 'danger' : 'warning'}>
                            {vuln.severity}
                          </Badge>
                        </div>
                        <p className={`text-sm transition-colors duration-300 ${themeStyles.textSecondary(isDarkMode)}`}>Found at line {vuln.line}</p>
                        <button className="mt-2 text-green-600 text-sm font-semibold hover:underline hover:text-green-700 transition-colors">
                          View Fix →
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default CodeRegenerator;
