import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { FiDatabase, FiCode, FiLink, FiMenu, FiX, FiZap } from 'react-icons/fi';
import { useSecurityMode } from '../../contexts/SecurityModeContext';
import { useTheme } from '../../contexts/ThemeContext';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { mode } = useSecurityMode();
  const { isDarkMode } = useTheme();
  
  const navItems = [
    {
      path: '/sql-injection',
      label: 'SQL Injection',
      icon: FiDatabase,
    },
    {
      path: '/xss',
      label: 'XSS',
      icon: FiCode,
    },
    {
      path: '/csrf',
      label: 'CSRF',
      icon: FiLink,
    },
    {
      path: '/code-regenerator',
      label: 'Smart Fix',
      icon: FiZap,
    }
  ];
  
  const activeBg = mode === 'secure' 
    ? 'bg-green-600' 
    : 'bg-red-600';
  
  const activeText = 'text-white';
  const inactiveBg = isDarkMode 
    ? 'bg-transparent hover:bg-gray-700' 
    : 'bg-transparent hover:bg-gray-100';
  const inactiveText = isDarkMode ? 'text-gray-300' : 'text-gray-700';
  
  const sidebarBg = isDarkMode ? 'bg-gray-800' : 'bg-gray-50';
  const sidebarBorder = isDarkMode ? 'border-gray-700' : 'border-gray-200';
  const buttonBg = isDarkMode ? 'bg-gray-800' : 'bg-white';
  const buttonText = isDarkMode ? 'text-gray-200' : 'text-gray-700';
  
  React.useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);
  
  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`lg:hidden fixed top-4 left-4 z-50 p-2 ${buttonBg} ${buttonText} rounded-md shadow-md focus-ring transition-colors duration-300`}
        aria-label="Toggle navigation menu"
        aria-expanded={isOpen}
      >
        {isOpen ? (
          <FiX className="w-6 h-6" />
        ) : (
          <FiMenu className="w-6 h-6" />
        )}
      </button>
      
      <aside
        className={`
          fixed top-16 left-0 h-[calc(100vh-4rem)] w-64 ${sidebarBg} border-r ${sidebarBorder} z-40
          transform transition-all duration-300 ease-in-out
          lg:translate-x-0
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
        role="navigation"
        aria-label="Main navigation"
      >
        <nav className="p-4 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={`
                  flex items-center gap-3 px-4 py-3 rounded-md transition-colors duration-150
                  ${isActive ? `${activeBg} ${activeText}` : `${inactiveBg} ${inactiveText}`}
                  focus-ring
                `}
                onClick={() => setIsOpen(false)}
              >
                <Icon className="w-5 h-5" aria-hidden="true" />
                <span className="font-medium">{item.label}</span>
              </NavLink>
            );
          })}
        </nav>
      </aside>
      
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}
    </>
  );
};

export default Sidebar;
