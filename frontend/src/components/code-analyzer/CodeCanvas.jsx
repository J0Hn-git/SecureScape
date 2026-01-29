import React, { useState } from 'react';
import { FiCode } from 'react-icons/fi';
import { useTheme } from '../../contexts/ThemeContext';
import Button from '../common/Button';
import CanvasHeader from './CanvasHeader';
import CodeEditor from './CodeEditor';
import VulnerabilityReport from './VulnerabilityReport';
import CodeComparison from './CodeComparsion';
import { analyzeAPI } from '../../services/api';


const CodeCanvas = ({ isOpen, onClose }) => {
  const { isDarkMode } = useTheme();
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('java');
  const [isScanning, setIsScanning] = useState(false);
  const [scanResults, setScanResults] = useState(null);
  const [fixedCode, setFixedCode] = useState('');
  const [isCanvasExpanded, setIsCanvasExpanded] = useState(false);
  const [showComparison, setShowComparison] = useState(false);

  const handleClose = () => {
    onClose();
    setIsCanvasExpanded(false);
  };

  const toggleCanvasSize = () => {
    setIsCanvasExpanded(!isCanvasExpanded);
  };

  const handleScan = async () => {
    setIsScanning(true);
    setShowComparison(false);
    setScanResults(null);
    setFixedCode('');
    
    try {
      const response = await analyzeAPI.analyze(language, code);
      const result = response.data;
      
      // Map backend response to frontend format
      const vulnerabilities = (result.vulnerabilities || []).map(v => ({
        type: v.type || 'UNKNOWN',
        line: v.line || 1,
        severity: v.severity || 'MEDIUM',
        description: v.description || 'Security issue detected'
      }));
      
      setScanResults({
        vulnerabilities: vulnerabilities
      });
      
      // Set fixed code if provided by backend
      setFixedCode(result.fixedCode || code);
      
    } catch (error) {
      console.error('Analysis failed:', error);
      setScanResults({
        vulnerabilities: [{
          type: 'ERROR',
          line: 1,
          severity: 'HIGH',
          description: error.response?.data?.error || 'Failed to analyze code. Please check that the ML model service is running.'
        }]
      });
      setFixedCode(code); // Keep original code on error
    } finally {
      setIsScanning(false);
    }
  };

  const handleViewFix = () => {
    setShowComparison(true);
  };

  const handleCopyFixed = () => {
    navigator.clipboard.writeText(fixedCode);
  };

  const handleDownloadFixed = () => {
    const blob = new Blob([fixedCode], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `fixed_${language}_code.${language === 'java' ? 'java' : language === 'python' ? 'py' : 'js'}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const canvasStyle = {
    background: isDarkMode 
      ? 'linear-gradient(135deg, rgba(17, 24, 39, 0.98) 0%, rgba(31, 41, 55, 0.98) 100%)'
      : 'linear-gradient(135deg, rgba(255,255,255,0.98) 0%, rgba(249,250,251,0.98) 100%)',
    backdropFilter: 'blur(20px)',
    boxShadow: '-10px 0 40px rgba(0,0,0,0.2)'
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-gradient-to-br from-black/40 via-black/30 to-black/40 backdrop-blur-md z-40 transition-all duration-500 ${
          isOpen ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={handleClose}
      />

      {/* Canvas Panel */}
      <div
        className={`fixed top-0 right-0 h-full shadow-2xl z-50 transition-all duration-700 ease-out ${
          isCanvasExpanded ? 'w-full' : 'w-full lg:w-2/3'
        } ${isOpen ? 'translate-x-0 opacity-100 scale-100' : 'translate-x-full opacity-0 scale-95'}`}
        style={canvasStyle}
      >
        {/* Header */}
        <CanvasHeader 
          isExpanded={isCanvasExpanded}
          onToggleSize={toggleCanvasSize}
          onClose={handleClose}
        />

        {/* Content */}
        <div className="h-[calc(100%-80px)] overflow-y-auto p-6 space-y-6">
          {!showComparison ? (
            <>
              {/* Language Selector */}
              <div className="transform transition-all duration-300 hover:scale-[1.01]">
                <label 
                  htmlFor="canvas-language" 
                  className={`block text-sm font-semibold mb-2 transition-colors duration-300 ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}
                >
                  Select Language
                </label>
                <select
                  id="canvas-language"
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className={`w-48 px-4 py-2 border-2 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 shadow-sm hover:shadow-md transition-all duration-200 ${
                    isDarkMode 
                      ? 'bg-gray-800 border-gray-600 text-gray-200'
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                >
                  <option value="java">Java</option>
                  <option value="python">Python</option>
                  <option value="javascript">JavaScript</option>
                </select>
              </div>

              {/* Code Editor */}
              <CodeEditor 
                code={code}
                setCode={setCode}
                language={language}
              />

              {/* Action Buttons */}
              <div className="flex gap-3">
                <Button
                  onClick={handleScan}
                  disabled={!code || isScanning}
                  variant="primary"
                >
                  {isScanning ? (
                    <>
                      <span className="animate-spin inline-block mr-2">⚙️</span>
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <FiCode className="w-5 h-5 inline mr-2" />
                      Analyze Code
                    </>
                  )}
                </Button>
                <Button
                  onClick={() => setCode('')}
                  variant="secondary"
                >
                  Clear
                </Button>
              </div>

              {/* Vulnerability Report */}
              {scanResults && (
                <VulnerabilityReport 
                  vulnerabilities={scanResults.vulnerabilities}
                  onViewFix={handleViewFix}
                />
              )}
            </>
          ) : (
            <CodeComparison 
              originalCode={code}
              fixedCode={fixedCode}
              language={language}
              vulnerabilities={scanResults.vulnerabilities}
              onCopy={handleCopyFixed}
              onDownload={handleDownloadFixed}
              onBack={() => setShowComparison(false)}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default CodeCanvas;
