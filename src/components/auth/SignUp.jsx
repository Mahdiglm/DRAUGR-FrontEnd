import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { inputValidation, xssProtection } from '../../utils/security';
import AuthLayout from './AuthLayout';

const SignUp = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [validationErrors, setValidationErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(null);
  
  const { register, error: authError, loading, clearError } = useAuth();
  const navigate = useNavigate();

  // Clear validation errors when user starts typing
  useEffect(() => {
    if (Object.keys(validationErrors).length > 0) {
      const timer = setTimeout(() => {
        setValidationErrors({});
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [validationErrors]);

  // Clear auth errors when component mounts
  useEffect(() => {
    clearError();
  }, []);

  // Calculate password strength
  useEffect(() => {
    if (formData.password) {
      const validation = inputValidation.validatePassword(formData.password);
      setPasswordStrength(validation);
    } else {
      setPasswordStrength(null);
    }
  }, [formData.password]);

  const validateField = (name, value) => {
    const errors = {};
    
    switch (name) {
      case 'firstName':
        if (!value) {
          errors.firstName = 'نام الزامی است';
        } else if (!inputValidation.validateName(value)) {
          errors.firstName = 'نام باید فقط شامل حروف باشد و بین ۲-۵۰ کاراکتر باشد';
        }
        break;
        
      case 'lastName':
        if (!value) {
          errors.lastName = 'نام خانوادگی الزامی است';
        } else if (!inputValidation.validateName(value)) {
          errors.lastName = 'نام خانوادگی باید فقط شامل حروف باشد و بین ۲-۵۰ کاراکتر باشد';
        }
        break;
        
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
        } else {
          const passwordValidation = inputValidation.validatePassword(value);
          if (!passwordValidation.isValid) {
            // Convert English error messages to Persian
            const persianErrors = passwordValidation.errors.map(error => {
              if (error.includes('at least 8 characters')) return 'رمز عبور باید حداقل ۸ کاراکتر باشد';
              if (error.includes('less than 128 characters')) return 'رمز عبور باید کمتر از ۱۲۸ کاراکتر باشد';
              if (error.includes('uppercase letter')) return 'رمز عبور باید حداقل یک حرف بزرگ داشته باشد';
              if (error.includes('lowercase letter')) return 'رمز عبور باید حداقل یک حرف کوچک داشته باشد';
              if (error.includes('number')) return 'رمز عبور باید حداقل یک عدد داشته باشد';
              if (error.includes('special character')) return 'رمز عبور باید حداقل یک کاراکتر ویژه داشته باشد';
              return error;
            });
            errors.password = persianErrors[0];
          }
        }
        break;
        
      case 'confirmPassword':
        if (!value) {
          errors.confirmPassword = 'تأیید رمز عبور الزامی است';
        } else if (value !== formData.password) {
          errors.confirmPassword = 'رمزهای عبور یکسان نیستند';
        }
        break;
        
      default:
        break;
    }
    
    return errors;
  };

  const validateForm = () => {
    const errors = {};
    
    // Validate all fields
    Object.keys(formData).forEach(field => {
      const fieldErrors = validateField(field, formData[field]);
      Object.assign(errors, fieldErrors);
    });
    
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
    
    // Also clear confirmPassword error if password is being changed
    if (name === 'password' && validationErrors.confirmPassword) {
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.confirmPassword;
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
      await register(formData);
      
      // Redirect to home after successful registration
      navigate('/', { replace: true });
    } catch (error) {
      // Error will be handled by AuthContext
      console.error('Registration error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const getPasswordStrengthColor = () => {
    if (!passwordStrength) return '';
    
    const errorCount = passwordStrength.errors.length;
    if (errorCount === 0) return 'text-green-400';
    if (errorCount <= 2) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getPasswordStrengthText = () => {
    if (!passwordStrength) return '';
    
    const errorCount = passwordStrength.errors.length;
    if (errorCount === 0) return 'رمز عبور قوی';
    if (errorCount <= 2) return 'رمز عبور متوسط';
    return 'رمز عبور ضعیف';
  };

  const convertPasswordErrorToPersian = (error) => {
    if (error.includes('at least 8 characters')) return 'حداقل ۸ کاراکتر';
    if (error.includes('less than 128 characters')) return 'حداکثر ۱۲۸ کاراکتر';
    if (error.includes('uppercase letter')) return 'حداقل یک حرف بزرگ';
    if (error.includes('lowercase letter')) return 'حداقل یک حرف کوچک';
    if (error.includes('number')) return 'حداقل یک عدد';
    if (error.includes('special character')) return 'حداقل یک کاراکتر ویژه';
    return error;
  };

  return (
    <AuthLayout title="ایجاد حساب کاربری">
      <div className="space-y-6">
        
        {/* Display authentication error */}
        {authError && (
          <div className="mb-4 p-3 bg-red-800/20 border border-red-600 rounded text-red-400 text-sm">
            {authError}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          {/* First Name Field */}
          <div>
            <label htmlFor="firstName" className="block text-gray-300 mb-2">
              نام
            </label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`w-full px-4 py-3 bg-gray-800/70 border rounded-lg focus:outline-none focus:ring-2 text-white transition-all duration-300 ${
                validationErrors.firstName 
                  ? 'border-red-600 focus:ring-red-500 focus:border-red-500' 
                  : 'border-gray-700 focus:ring-red-500 focus:border-red-500 hover:border-gray-600'
              }`}
              placeholder="نام خود را وارد کنید"
              autoComplete="given-name"
              disabled={loading || isSubmitting}
              maxLength={50}
            />
            {validationErrors.firstName && (
              <p className="mt-1 text-red-400 text-sm">{validationErrors.firstName}</p>
            )}
          </div>

          {/* Last Name Field */}
          <div>
            <label htmlFor="lastName" className="block text-gray-300 mb-2">
              نام خانوادگی
            </label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`w-full px-4 py-3 bg-gray-800/70 border rounded-lg focus:outline-none focus:ring-2 text-white transition-all duration-300 ${
                validationErrors.lastName 
                  ? 'border-red-600 focus:ring-red-500 focus:border-red-500' 
                  : 'border-gray-700 focus:ring-red-500 focus:border-red-500 hover:border-gray-600'
              }`}
              placeholder="نام خانوادگی خود را وارد کنید"
              autoComplete="family-name"
              disabled={loading || isSubmitting}
              maxLength={50}
            />
            {validationErrors.lastName && (
              <p className="mt-1 text-red-400 text-sm">{validationErrors.lastName}</p>
            )}
          </div>

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
                autoComplete="new-password"
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
            {/* Password Strength Indicator */}
            {formData.password && passwordStrength && (
              <div className="mt-1">
                <p className={`text-xs ${getPasswordStrengthColor()}`}>
                  {getPasswordStrengthText()}
                </p>
                {passwordStrength.errors.length > 0 && (
                  <ul className="text-xs text-gray-400 mt-1">
                    {passwordStrength.errors.slice(0, 3).map((error, index) => (
                      <li key={index}>• {convertPasswordErrorToPersian(error)}</li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </div>

          {/* Confirm Password Field */}
          <div>
            <label htmlFor="confirmPassword" className="block text-gray-300 mb-2">
              تأیید رمز عبور
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`w-full px-4 py-3 bg-gray-800/70 border rounded-lg focus:outline-none focus:ring-2 text-white pr-12 transition-all duration-300 ${
                  validationErrors.confirmPassword 
                    ? 'border-red-600 focus:ring-red-500 focus:border-red-500' 
                    : 'border-gray-700 focus:ring-red-500 focus:border-red-500 hover:border-gray-600'
                }`}
                placeholder="رمز عبور خود را دوباره وارد کنید"
                autoComplete="new-password"
                disabled={loading || isSubmitting}
                maxLength={128}
              />
              <button
                type="button"
                onClick={toggleConfirmPasswordVisibility}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-white"
                disabled={loading || isSubmitting}
              >
                {showConfirmPassword ? '🙈' : '👁️'}
              </button>
            </div>
            {validationErrors.confirmPassword && (
              <p className="mt-1 text-red-400 text-sm">{validationErrors.confirmPassword}</p>
            )}
          </div>

          {/* Register Button */}
          <button
            type="submit"
            disabled={loading || isSubmitting || Object.keys(validationErrors).length > 0}
            className={`w-full py-3 px-4 rounded-lg font-semibold transition-all duration-300 ${
              loading || isSubmitting || Object.keys(validationErrors).length > 0
                ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white shadow-lg hover:shadow-red-500/25 transform hover:scale-[1.02]'
            }`}
          >
            {loading || isSubmitting ? 'در حال ایجاد حساب...' : 'ثبت نام'}
          </button>
        </form>

        {/* Links */}
        <div className="mt-6 text-center">
          <p className="text-gray-400">
            قبلاً حساب کاربری دارید؟{' '}
            <Link
              to="/auth/login"
              className="text-red-500 hover:text-red-400 font-semibold transition-colors"
            >
              وارد شوید
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

export default SignUp; 