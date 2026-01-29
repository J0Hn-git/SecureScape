import React from "react";
import { FiShield } from 'react-icons/fi';
import { useTheme } from "../../contexts/ThemeContext";


const AuthHeader = ({isLogin}) => {

    const {isDarkMode} = useTheme();
    const textPrimary = isDarkMode ? 'text-gray-100' : 'text-gray-900';
    const textSecondary = isDarkMode ? 'text-gray-400' : 'text-gray-600';


    return (
        <div className="text-center">
            <div className="flex justify-center">
                <div className={`p-3 rounded-full transition-colors duration-300 ${
                    isDarkMode ? 'bg-gray-800' : 'bg-white'
                } shadow-lg`}>
                    <FiShield className="w-12 h-12 text-green-600"/>
                </div>
            </div>
            <h2 className={`mt-6 text-3xl font-bold ${textPrimary} transition-colors duration-300`}>
                {isLogin ? 'Welcome back!' : 'Create your account'}
            </h2>
            <p className={`mt-2 text-sm ${textSecondary} transition-colors duration-300`}>
                {isLogin 
                  ? 'Sign in to access your account'
                  : 'Join Securescape to learn web securtiy'}
            </p>
        </div>
    );
};

export default AuthHeader;