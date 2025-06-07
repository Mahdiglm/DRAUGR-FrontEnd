import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import AuthLayout from './AuthLayout';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [validationErrors, setValidationErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const { login, error: authError, loading, clearError } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const from = location.state?.from?.pathname || '/';

  // Clear validation errors when user starts typing
  useEffect(() => {
    if (Object.keys(validationErrors).length > 0) {
      const timer = setTimeout(() => {
        setValidationErrors({});
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [validationErrors]);

  // Clear auth errors when component mounts or when user starts typing
  useEffect(() => {
    clearError();
  }, []);

  const validateField = (name, value) => {
    const errors = {};
    
    switch (name) {
      case 'email':
        if (!value) {
          errors.email = 'ایمیل الزامی است';
        } else {
          // Simple but effective email validation
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(value.trim())) {
            errors.email = 'لطفاً یک ایمیل معتبر وارد کنید';
          }
        }
        break;
        
      case 'password':
        if (!value) {
          errors.password = 'رمز عبور الزامی است';
        } else if (value.length < 6) {
          errors.password = 'رمز عبور باید حداقل ۶ کاراکتر باشد';
        }
        break;
        
      default:
        break;
    }
    
    return errors;
  };

  const validateForm = () => {
    const errors = {};
    
    // Validate email
    const emailErrors = validateField('email', formData.email);
    Object.assign(errors, emailErrors);
    
    // Validate password
    const passwordErrors = validateField('password', formData.password);
    Object.assign(errors, passwordErrors);
    
    return errors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear any existing validation errors for this field
    if (validationErrors[name]) {
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
    
    // Clear auth error when user starts typing
    clearError();
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    const fieldErrors = validateField(name, value);
    
    if (Object.keys(fieldErrors).length > 0) {
      setValidationErrors(prev => ({
        ...prev,
        ...fieldErrors
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Prevent double submission
    if (isSubmitting) return;
    
    // Validate form
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Pass the entire formData object as credentials
      const result = await login(formData);
      
      // Redirect to intended page or home
      navigate(from, { replace: true });
    } catch (error) {
      // Error will be handled by AuthContext - no need to log sensitive data
      if (process.env.NODE_ENV === 'development') {
        console.error('Login failed:', error.message);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <AuthLayout title="ورود به حساب کاربری">
      <div className="space-y-6">
        
        {/* Display authentication error */}
        {authError && (
          <div className="mb-4 p-3 bg-red-800/20 border border-red-600 rounded text-red-400 text-sm">
            {authError}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          {/* Email Field */}
          <div>
            <label htmlFor="email" className="block text-gray-300 mb-2">
              ایمیل
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`w-full px-4 py-3 bg-gray-800/70 border rounded-lg focus:outline-none focus:ring-2 text-white transition-all duration-300 ${
                validationErrors.email 
                  ? 'border-red-600 focus:ring-red-500 focus:border-red-500' 
                  : 'border-gray-700 focus:ring-red-500 focus:border-red-500 hover:border-gray-600'
              }`}
              placeholder="ایمیل خود را وارد کنید"
              autoComplete="email"
              disabled={loading || isSubmitting}
              maxLength={254}
            />
            {validationErrors.email && (
              <p className="mt-1 text-red-400 text-sm">{validationErrors.email}</p>
            )}
          </div>

          {/* Password Field */}
          <div>
            <label htmlFor="password" className="block text-gray-300 mb-2">
              رمز عبور
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`w-full px-4 py-3 bg-gray-800/70 border rounded-lg focus:outline-none focus:ring-2 text-white pl-12 transition-all duration-300 ${
                  validationErrors.password 
                    ? 'border-red-600 focus:ring-red-500 focus:border-red-500' 
                    : 'border-gray-700 focus:ring-red-500 focus:border-red-500 hover:border-gray-600'
                }`}
                placeholder="رمز عبور خود را وارد کنید"
                autoComplete="current-password"
                disabled={loading || isSubmitting}
                maxLength={128}
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400 hover:text-white"
                disabled={loading || isSubmitting}
              >
                {showPassword ? '🙈' : '👁️'}
              </button>
            </div>
            {validationErrors.password && (
              <p className="mt-1 text-red-400 text-sm">{validationErrors.password}</p>
            )}
          </div>

          {/* Login Button */}
          <button
            type="submit"
            disabled={loading || isSubmitting || Object.keys(validationErrors).length > 0}
            className={`w-full py-3 px-4 rounded-lg font-semibold transition-all duration-300 ${
              loading || isSubmitting || Object.keys(validationErrors).length > 0
                ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white shadow-lg hover:shadow-red-500/25 transform hover:scale-[1.02]'
            }`}
          >
            {loading || isSubmitting ? 'در حال ورود...' : 'ورود'}
          </button>
        </form>

        {/* Links */}
        <div className="mt-6 text-center">
          <p className="text-gray-400">
            حساب کاربری ندارید؟{' '}
            <Link
              to="/auth/register"
              className="text-red-500 hover:text-red-400 font-semibold transition-colors"
            >
              ثبت نام کنید
            </Link>
          </p>
        </div>

        {/* Security Note */}
        <div className="mt-4 text-xs text-gray-500 text-center">
          <p>🔒 اتصال شما امن است و اطلاعات شما محافظت می‌شود</p>
        </div>
      </div>
    </AuthLayout>
  );
};

export default Login; 