import React, { useState } from "react";
import { useTheme } from "../../contexts/ThemeContext";

const FormInput = ({
    id,
    name,
    type = 'text',
    value,
    onChange,
    placeholder,
    label,
    icon: Icon,
    required = false,
    endIcon: EndIcon,
    onEndIconClick
}) => {

    const {isDarkMode} = useTheme();
    const textSecondary = isDarkMode ? 'text-gray-400' : 'text-gray-600';


    return (
        <div>
            {label && (
                <label
                 htmlFor={id}
                 className={`block text-sm font-medium ${textSecondary} mb-1 transition-colors duration-300`}
                >
                    {label}
                </label>
            )}
            <div className="relative">
                {Icon && (
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Icon className={`w-5 h-5 ${textSecondary}`}/>
                    </div>
                )}
                <input 
                 id={id}
                 name={name}
                 type={type}
                 value={value}
                 onChange={onChange}
                 placeholder={placeholder}
                 required={required}
                 className={`w-full ${Icon ? 'pl-10' : 'pl-4'} ${EndIcon ? 'pr-10' : 'pr-4'}
                             px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500
                             focus:border-green-500 transition-colors duration-200 ${
                                isDarkMode 
                                 ? 'bg-gray-700 border-gray-600 text-gray-200 placeholder-gray-400'
                                 : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
                             }`}
                />
                {EndIcon && (
                    <button
                     type="button"
                     onClick={onEndIconClick}
                     className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    >
                        <EndIcon className={`w-5 h-5 ${textSecondary} hover:text-green-600
                                             transition-colors
                          `}/>
                    </button>
                )}
            </div>
        </div>
    );
};

export default FormInput;