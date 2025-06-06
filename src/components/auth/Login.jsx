import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { inputValidation, xssProtection } from '../../utils/security';

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
        } else if (!inputValidation.validateEmail(value)) {
          errors.email = 'لطفاً یک ایمیل معتبر وارد کنید';
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
    
    // Sanitize input to prevent XSS
    const sanitizedValue = xssProtection.sanitizeInput(value);
    
    setFormData(prev => ({
      ...prev,
      [name]: sanitizedValue
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
      await login(formData.email, formData.password);
      
      // Redirect to intended page or home
      navigate(from, { replace: true });
    } catch (error) {
      // Error will be handled by AuthContext
      console.error('Login error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-gray-900 border border-red-900 rounded-lg p-6">
        <h2 className="text-2xl font-bold text-center text-red-500 mb-6">
          ورود
        </h2>
        
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
              className={`w-full px-3 py-2 bg-gray-800 border rounded-lg focus:outline-none focus:ring-2 text-white ${
                validationErrors.email 
                  ? 'border-red-600 focus:ring-red-500' 
                  : 'border-gray-700 focus:ring-red-500'
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
                className={`w-full px-3 py-2 bg-gray-800 border rounded-lg focus:outline-none focus:ring-2 text-white pr-10 ${
                  validationErrors.password 
                    ? 'border-red-600 focus:ring-red-500' 
                    : 'border-gray-700 focus:ring-red-500'
                }`}
                placeholder="رمز عبور خود را وارد کنید"
                autoComplete="current-password"
                disabled={loading || isSubmitting}
                maxLength={128}
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-white"
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
            className={`w-full py-2 px-4 rounded-lg font-semibold transition-colors ${
              loading || isSubmitting || Object.keys(validationErrors).length > 0
                ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                : 'bg-red-600 hover:bg-red-700 text-white'
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
              className="text-red-500 hover:text-red-400 font-semibold"
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
    </div>
  );
};

export default Login; 