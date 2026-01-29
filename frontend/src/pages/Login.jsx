import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../contexts/ThemeContext";
import AuthHeader from "../components/auth/AuthHeader";
import Alert from "../components/common/Alert";
import LoginForm from "../components/auth/LoginForm";

const Login = () => {
  const { isDarkMode } = useTheme();
  const navigate = useNavigate();

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const cardBg = isDarkMode ? "bg-gray-800" : "bg-white";
  const borderColor = isDarkMode ? "border-gray-700" : "border-gray-200";

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.email || !formData.password) {
      setError("Please enter both email and password.");
      return;
    }

    try {
      setLoading(true);

      // NOTE: This is a UI-only login for now. You can hook this up
      // to a real backend endpoint later (e.g. SQL demo or dedicated auth API).
      await new Promise((resolve) => setTimeout(resolve, 600));

      navigate("/");
    } catch (err) {
      setError("Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`min-h-screen flex items-center justify-center py-12 px-4
                         sm:px-6 lg:px-8 transition-colors duration-300 ${
                           isDarkMode
                             ? "bg-gray-900"
                             : "bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50"
                         }`}
    >
      <div className="max-w-md w-full space-y-8">
        <AuthHeader isLogin />

        <div
          className={`${cardBg} rounded-lg shadow-xl p-8 border ${borderColor}
                                 transition-colors duration-300`}
        >
          {error && (
            <div className="mb-4">
              <Alert type="error" title="Error">
                {error}
              </Alert>
            </div>
          )}

          <LoginForm
            formData={formData}
            onChange={handleInputChange}
            onSubmit={handleSubmit}
            loading={loading}
            showPassword={showPassword}
            togglePassword={() => setShowPassword((prev) => !prev)}
          />
        </div>
      </div>
    </div>
  );
};

export default Login;