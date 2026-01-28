import React from 'react';
import { FiAlertTriangle, FiCheckCircle, FiCopy, FiDownload } from 'react-icons/fi';
import { useTheme } from '../../contexts/ThemeContext';
import Badge from '../common/Badge';
import Button from '../common/Button';
import CodeBlock from '../common/CodeBlock';

const CodeComparison = ({ 
  originalCode, 
  fixedCode, 
  language, 
  vulnerabilities,
  onCopy,
  onDownload,
  onBack
}) => {
  const { isDarkMode } = useTheme();
  const textPrimary = isDarkMode ? 'text-gray-100' : 'text-gray-900';
  const textTertiary = isDarkMode ? 'text-gray-300' : 'text-gray-700';

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className={`text-lg font-bold transition-colors duration-300 ${textPrimary}`}>
          Code Comparison
        </h3>
        <div className="flex gap-2">
          <Button onClick={onCopy} variant="outline">
            <FiCopy className="w-4 h-4 inline mr-2" />
            Copy Fixed Code
          </Button>
          <Button onClick={onDownload} variant="outline">
            <FiDownload className="w-4 h-4 inline mr-2" />
            Download
          </Button>
          <Button onClick={onBack} variant="secondary">
            ← Back to Analysis
          </Button>
        </div>
      </div>

      {/* Side-by-Side Code */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Original Code */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <FiAlertTriangle className="w-5 h-5 text-red-500" />
            <h4 className={`font-semibold ${textPrimary} transition-colors duration-300`}>
              Vulnerable Code
            </h4>
            <Badge variant="error">Original</Badge>
          </div>
          <CodeBlock code={originalCode} language={language} />
        </div>

        {/* Fixed Code */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <FiCheckCircle className="w-5 h-5 text-green-500" />
            <h4 className={`font-semibold ${textPrimary} transition-colors duration-300`}>
              Secure Code
            </h4>
            <Badge variant="success">AI-Generated</Badge>
          </div>
          <CodeBlock code={fixedCode} language={language} />
        </div>
      </div>

      {/* Fixes Summary */}
      <div className={`p-4 rounded-lg border-2 transition-colors duration-300 ${
        isDarkMode ? 'bg-green-900/20 border-green-700' : 'bg-green-50 border-green-200'
      }`}>
        <h4 className={`font-semibold mb-2 ${textPrimary} transition-colors duration-300`}>
          🎉 Fixes Applied
        </h4>
        <ul className={`space-y-1 text-sm ${textTertiary} transition-colors duration-300`}>
          {vulnerabilities.map((vuln, idx) => (
            <li key={idx} className="flex items-start gap-2">
              <FiCheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
              <span>Fixed {vuln.type} vulnerability at line {vuln.line}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default CodeComparison;
