import React from 'react';
import { Link } from 'react-router-dom';
import { FiDatabase, FiCode, FiLink, FiArrowRight, FiShield, FiZap } from 'react-icons/fi';
import { useSecurityMode } from '../contexts/SecurityModeContext';
import DemoCard from '../components/common/DemoCard';
import Alert from '../components/common/Alert';
import Badge from '../components/common/Badge';

const Dashboard = () => {
  const { mode, isSecure } = useSecurityMode();
  
  const colorMap = {
    blue: {
      bg: 'bg-blue-100',
      bgHover: 'group-hover:bg-blue-200',
      text: 'text-blue-600',
    },
    purple: {
      bg: 'bg-purple-100',
      bgHover: 'group-hover:bg-purple-200',
      text: 'text-purple-600',
    },
    orange: {
      bg: 'bg-orange-100',
      bgHover: 'group-hover:bg-orange-200',
      text: 'text-orange-600',
    },
  };
  
  const attackCategories = [
    {
      path: '/sql-injection',
      icon: FiDatabase,
      title: 'SQL Injection',
      description: 'Learn how attackers exploit database queries by injecting malicious SQL code.',
      color: 'blue',
    },
    {
      path: '/xss',
      icon: FiCode,
      title: 'Cross-Site Scripting (XSS)',
      description: 'Understand how malicious scripts are injected into web pages viewed by users.',
      color: 'purple',
    },
    {
      path: '/csrf',
      icon: FiLink,
      title: 'Cross-Site Request Forgery (CSRF)',
      description: 'Explore how attackers trick users into performing unwanted actions.',
      color: 'orange',
    },
  ];
  
  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="text-center py-8">
        <div className="flex items-center justify-center gap-3 mb-4">
          <FiShield className="w-12 h-12 text-blue-600" />
          <h1 className="text-4xl font-bold text-gray-900">SecureScape</h1>
        </div>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-6">
          An educational platform demonstrating common web security vulnerabilities 
          and their secure mitigations.
        </p>
        <div className="flex items-center justify-center gap-2">
          <Badge variant="mode">
            {isSecure ? 'Secure Mode' : 'Insecure Mode'}
          </Badge>
        </div>
      </div>
      
      {/* Mode Explanation */}
      <Alert 
        type={isSecure ? 'success' : 'warning'}
        title={isSecure ? 'Secure Mode Active' : 'Insecure Mode Active'}
      >
        {isSecure 
          ? 'You are viewing secure implementations with proper mitigations. Toggle to insecure mode to see vulnerable code.'
          : 'You are viewing vulnerable implementations. Toggle to secure mode to see how these vulnerabilities are mitigated.'}
      </Alert>
      
      {/* Attack Categories */}
      <div>
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">Attack Demonstrations</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {attackCategories.map((category) => {
            const Icon = category.icon;
            return (
              <Link
                key={category.path}
                to={category.path}
                className="block bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-all duration-200 hover:border-blue-500 focus-ring group"
              >
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-lg ${colorMap[category.color].bg} ${colorMap[category.color].bgHover} transition-colors`}>
                    <Icon className={`w-6 h-6 ${colorMap[category.color].text}`} />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                      {category.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4">
                      {category.description}
                    </p>
                    <div className="flex items-center text-blue-600 font-medium text-sm">
                      <span>Explore Demo</span>
                      <FiArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      <div>
        <h2 className='text-2xl font-semibold text-gray-900 mb-6'>
          AI-Powered Code Analysis
        </h2>
        <Link
          to="/code-regenerator"
          className='block bg-gradient-to-r from-white-50 to-white-50 border-2 border-
                     blue-200 rounded-lg p-8 hover:shadow-xl transition-all duration-200 hover:border-blue-400
                     focus-ring group'
        >
          <div className='flex items-start gap-6'>
            <div className='p-4 bg-green-100 rounded-lg group-hover:bg-green-200 transition-colors'>
              <FiZap className='w-8 h-8 text-green-600' />
            </div>
            <div className='flex-1'>
              <div className='flex items-center gap-3 mb-3'>
                <h3 className='text-2xl font-semibold text-gray-900 group-hover:text-blue-600
                               transition-colors'>
                                Smart Code Analyzer
                </h3>
                <Badge variant='success'>AI-Powered</Badge>
              </div>
              <p className='text-gray-700 text-base mb-4'>
                Upload your Java, Python or JavaScript code to automatically detect vulnerabilites
                and generate secure fixes instantly.
              </p>
              <div className='flex flex-wrap gap-4 mb-4'>
                <div className='flex items-center gap-2 text-sm text-gray-600'>
                  <span className='w-2 h-2 bg-green-500 rounded-full'></span>
                    <span>Automated Vulnerability Detection</span>
                </div>
                <div className='flex items-center gap-2 text-sm text-gray-600'>
                  <span className='w-2 h-2 bg-green-500 rounded-full'></span>
                  <span>AI-Generated Secure Fixes</span>
                </div>
                <div className='flex items-center gap-2 text-sm text-gray-600'>
                  <span className='w-2 h-2 bg-green-500 rounded-full'></span>
                  <span>Multi-Language Support</span>
                </div>
              </div>
              <div className='flex items-center text-blue-600 font-semibold text-base'>
                <span>Try Smart Analyzer</span>
                <FiArrowRight className='w-5 h-5 ml-2 group-hover:translate-x-2 transition-transform'/>
              </div>
            </div>
          </div>
        </Link>
      </div>
      
      {/* Quick Start Guide */}
      <DemoCard title="Quick Start Guide" badge="Getting Started">
        <ol className="list-decimal list-inside space-y-3 text-gray-700">
          <li>
            <strong>Select an attack type</strong> from the categories above or use the sidebar navigation.
          </li>
          <li>
            <strong>Toggle between modes</strong> using the button in the header (or press Alt+M) to compare 
            vulnerable vs secure implementations.
          </li>
          <li>
            <strong>Try the attacks</strong> using the interactive demos. Payloads are available in the 
            Attacker Panel (press Alt+A or click the bottom panel).
          </li>
          <li>
            <strong>Read the explanations</strong> in each demo to understand what's happening and why 
            the secure implementation prevents the attack.
          </li>
          <li>
            <strong>Use the Smart Analyzer</strong> to upload your own code (Java, Python or JavaScript)
            and get instant vulnerability reports with AI-generated fixes.
          </li>
          <li>
            <strong>Compare fixes</strong> - View side-by-side comparisons of your vulnerable code
            and the secure alternatives suggested by our machine learning model.
          </li>
        </ol>
      </DemoCard>
      
      {/* Learning Objectives */}
      <DemoCard title="Learning Objectives" badge="Education">
        <ul className="list-disc list-inside space-y-2 text-gray-700">
          <li>Understand common web security vulnerabilities (SQL Injection, XSS, CSRF)</li>
          <li>Recognize vulnerable code patterns and attack vectors</li>
          <li>Learn industry-standard mitigation techniques</li>
          <li>Compare vulnerable vs secure implementations side-by-side</li>
          <li>Practice identifying and preventing security flaws</li>
          <li>Learn to interpret automated security reports and implement suggested fixes.</li>
        </ul>
      </DemoCard>
    </div>
  );
};

export default Dashboard;
