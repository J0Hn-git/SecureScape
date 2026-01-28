import React, { useState } from 'react';
import { FiZap } from 'react-icons/fi';
import { useTheme } from '../contexts/ThemeContext';
import DemoCard from '../components/common/DemoCard';
import Alert from '../components/common/Alert';
import CodeCanvas from '../components/code-analyzer/CodeCanvas';

const CodeRegenerator = () => {
  const { isDarkMode } = useTheme();
  const [isCanvasOpen, setIsCanvasOpen] = useState(false);
  
  const textPrimary = isDarkMode ? 'text-gray-100' : 'text-gray-900';
  const textSecondary = isDarkMode ? 'text-gray-400' : 'text-gray-600';
  const textTertiary = isDarkMode ? 'text-gray-300' : 'text-gray-700';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <FiZap className="w-8 h-8 text-green-600" />
        <div>
          <h1 className={`text-3xl font-bold ${textPrimary} transition-colors duration-300`}>
            Smart Fix
          </h1>
          <p className={`${textSecondary} transition-colors duration-300`}>
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
          <p className={`${textTertiary} transition-colors duration-300`}>
            Click the button below to open the code analyzer canvas. You can paste your code,
            select the language, and get instant vulnerability reports with AI-generated fixes.
          </p>
          <button
            onClick={() => setIsCanvasOpen(true)}
            className="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 focus-ring flex items-center gap-2 font-medium shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
          >
            <FiZap className="w-5 h-5" />
            Open Code Canvas
          </button>
        </div>
      </DemoCard>

      {/* Features Section */}
      <DemoCard title="Features" badge="What You Get">
        <ul className={`space-y-2 ${textTertiary} transition-colors duration-300`}>
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
          <li className="flex items-start gap-2">
            <span className="text-green-600 font-bold">✓</span>
            <span>Download or copy fixed code instantly</span>
          </li>
        </ul>
      </DemoCard>

      {/* How to Use */}
      <DemoCard title="How to Use" badge="Quick Guide">
        <ol className={`list-decimal list-inside space-y-2 ${textTertiary} transition-colors duration-300`}>
          <li>
            <strong>Open the Canvas:</strong> Click the "Open Code Canvas" button above
          </li>
          <li>
            <strong>Select Language:</strong> Choose Java, Python, or JavaScript
          </li>
          <li>
            <strong>Paste Your Code:</strong> Copy and paste your code into the editor
          </li>
          <li>
            <strong>Analyze:</strong> Click "Analyze Code" to scan for vulnerabilities
          </li>
          <li>
            <strong>View Results:</strong> Review detected vulnerabilities with severity levels
          </li>
          <li>
            <strong>See Fixes:</strong> Click "View AI-Generated Fix" for side-by-side comparison
          </li>
          <li>
            <strong>Export:</strong> Copy or download the secure code
          </li>
        </ol>
      </DemoCard>


      {/* Code Canvas Component */}
      <CodeCanvas 
        isOpen={isCanvasOpen} 
        onClose={() => setIsCanvasOpen(false)} 
      />
    </div>
  );
};

export default CodeRegenerator;
