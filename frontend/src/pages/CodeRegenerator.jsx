import React, { useState } from 'react';
import { FiCode, FiAlertTriangle, FiZap, FiX, FiMaximize2, FiMinimize2 } from 'react-icons/fi';
import DemoCard from '../components/common/DemoCard';
import Alert from '../components/common/Alert';
import Badge from '../components/common/Badge';

const CodeRegenerator = () => {
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('java');
  const [isScanning, setIsScanning] = useState(false);
  const [scanResults, setScanResults] = useState(null);
  const [isCanvasOpen, setIsCanvasOpen] = useState(false);
  const [isCanvasExpanded, setIsCanvasExpanded] = useState(false);

  const handleOpenCanvas = () => {
    setIsCanvasOpen(true);
  };

  const handleCloseCanvas = () => {
    setIsCanvasOpen(false);
    setIsCanvasExpanded(false);
  };

  const toggleCanvasSize = () => {
    setIsCanvasExpanded(!isCanvasExpanded);
  };

  const handleScan = async () => {
    setIsScanning(true);
    // TODO: Call your Spring Boot backend API
    
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

      {/* Info Alert */}
      <Alert type="info" title="How It Works">
        Our ML model analyzes your code for vulnerabilities, then generates secure alternatives.
      </Alert>

      {/* Main Content - Intro Card */}
      <DemoCard title="Get Started" badge="AI-Powered">
        <div className="space-y-4">
          <p className="text-gray-700">
            Click the button below to open the code analyzer canvas. You can paste your code,
            select the language, and get instant vulnerability reports with AI-generated fixes.
          </p>
          <button
            onClick={handleOpenCanvas}
            className="px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 focus-ring flex items-center gap-2 font-medium"
          >
            <FiZap className="w-5 h-5" />
            Open Code Canvas
          </button>
        </div>
      </DemoCard>

      {/* Features Section */}
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
          {/* Blurred Overlay */}
          <div
            className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm z-40 transition-all duration-300"
            onClick={handleCloseCanvas}
          />

          {/* Canvas Panel */}
          <div
            className={`fixed top-0 right-0 h-full bg-white/95 backdrop-blur-md 
                        shadow-2xl z-50 transform transition-all duration-500 ease-in-out ${
              isCanvasExpanded ? 'w-full' : 'w-full lg:w-2/3'
            } ${isCanvasOpen ? 'translate-x-0' : 'translate-x-full'}`}
          >
            {/* Canvas Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50">
              <div className="flex items-center gap-3">
                <FiZap className="w-6 h-6 text-green-600" />
                <h2 className="text-xl font-bold text-gray-900">Code Analyzer Canvas</h2>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={toggleCanvasSize}
                  className="p-2 hover:bg-gray-200 rounded-md transition-colors"
                  title={isCanvasExpanded ? 'Minimize' : 'Maximize'}
                >
                  {isCanvasExpanded ? (
                    <FiMinimize2 className="w-5 h-5 text-gray-700" />
                  ) : (
                    <FiMaximize2 className="w-5 h-5 text-gray-700" />
                  )}
                </button>
                <button
                  onClick={handleCloseCanvas}
                  className="p-2 hover:bg-gray-200 rounded-md transition-colors"
                  title="Close"
                >
                  <FiX className="w-5 h-5 text-gray-700" />
                </button>
              </div>
            </div>

            {/* Canvas Content */}
            <div className="h-[calc(100%-64px)] overflow-y-auto p-6 space-y-6">
              {/* Language Selector */}
              <div>
                <label htmlFor="canvas-language" className="block text-sm font-medium text-gray-700 mb-2">
                  Select Language
                </label>
                <select
                  id="canvas-language"
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="w-48 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white"
                >
                  <option value="java">Java</option>
                  <option value="python">Python</option>
                  <option value="javascript">JavaScript</option>
                </select>
              </div>

              {/* Code Input */}
              <div>
                <label htmlFor="canvas-code" className="block text-sm font-medium text-gray-700 mb-2">
                  Paste Your Code
                </label>
                <textarea
                  id="canvas-code"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder={`Paste your ${language.charAt(0).toUpperCase() + language.slice(1)} code here...`}
                  className="w-full h-96 p-4 font-mono text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                />
                {code && (
                  <div className="mt-2 text-sm text-gray-500">
                    {code.split('\n').length} lines • {code.length} characters
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={handleScan}
                  disabled={!code || isScanning}
                  className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed focus-ring flex items-center gap-2"
                >
                  {isScanning ? (
                    <>
                      <span className="animate-spin inline-block">⚙️</span>
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <FiCode className="w-4 h-4" />
                      Analyze Code
                    </>
                  )}
                </button>
                <button
                  onClick={() => setCode('')}
                  className="px-6 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 focus-ring"
                >
                  Clear
                </button>
              </div>

              {/* Results */}
              {scanResults && (
                <div className="mt-6 space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">Vulnerability Report</h3>
                  {scanResults.vulnerabilities.map((vuln, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-4 p-4 border border-gray-200 rounded-md hover:border-green-300 transition-colors bg-white"
                    >
                      <FiAlertTriangle className="w-6 h-6 text-red-500 flex-shrink-0 mt-1" />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-semibold text-gray-900">{vuln.type}</h4>
                          <Badge variant={vuln.severity === 'Critical' ? 'danger' : 'warning'}>
                            {vuln.severity}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600">Found at line {vuln.line}</p>
                        <button className="mt-2 text-green-600 text-sm font-medium hover:underline">
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
