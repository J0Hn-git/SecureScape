import React from "react";
import FormInput from "./FormInput";
import { FiMail, FiLock, FiEye, FiEyeOff } from 'react-icons/fi';


const LoginForm  = ({
    formData,
    onChange,
    onSubmit,
    loading,
    showPassword,
    togglePassword
}) => {
    return (
        <form onSubmit={onSubmit} className="space-y-6">

            <FormInput
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={onChange}
                placeholder="you@example.com"
                label="Email Address"
                icon={FiMail}
                required
            />

            <FormInput 
               id="password"
               name="password"
               type={showPassword ? 'text' : 'password'}
               value={formData.password}
               onChange={onChange}
               placeholder="########"
               label="Password"
               icon={FiLock}
               endIcon={showPassword ? FiEyeOff : FiEye}
               onEndIconClick={togglePassword}
               required
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600
                         text-white font-semibold rounded-lg hover:from-green-700 hover:to-emerald-700
                         focus:ring-4 focus:ring-green-500 focus:ring-opacity-50 disabled:opacity-50
                         disabled:cursor-not-allowed transform hover:scale-[1.02] transition-all duration-200 shadow-lg"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="animate-spin inline-block">⚙️</span>
                  Signing in...
                </span>
              ) : (
                'Sign In'
              )}
            </button>
        </form>
    );
};

export default LoginForm;