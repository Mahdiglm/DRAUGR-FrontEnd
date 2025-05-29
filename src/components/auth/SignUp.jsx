import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import AuthLayout from './AuthLayout';
import { useAuth } from '../../contexts/AuthContext';

const SignUp = () => {
  const navigate = useNavigate();
  const { register, error: authError, loading: authLoading } = useAuth();
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [focusedInput, setFocusedInput] = useState(null);

  // Input change handler
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
    
    // Calculate password strength
    if (name === 'password') {
      calculatePasswordStrength(value);
    }
  };
  
  // Calculate password strength (0-100)
  const calculatePasswordStrength = (password) => {
    if (!password) {
      setPasswordStrength(0);
      return;
    }
    
    let strength = 0;
    
    // Length check
    strength += Math.min(password.length * 5, 25);
    
    // Character variety checks
    if (/[A-Z]/.test(password)) strength += 15; // Uppercase
    if (/[a-z]/.test(password)) strength += 10; // Lowercase
    if (/[0-9]/.test(password)) strength += 20; // Numbers
    if (/[^A-Za-z0-9]/.test(password)) strength += 30; // Special chars
    
    setPasswordStrength(strength);
  };
  
  // Get password strength color
  const getStrengthColor = () => {
    if (passwordStrength < 30) return 'bg-draugr-900';
    if (passwordStrength < 60) return 'bg-draugr-700';
    return 'bg-draugr-500';
  };
  
  // Get password strength label
  const getStrengthLabel = () => {
    if (passwordStrength < 30) return 'ضعیف';
    if (passwordStrength < 60) return 'متوسط';
    return 'قوی';
  };

  // Form submission handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Comprehensive form validation
    const newErrors = {};
    
    if (!formData.firstName) newErrors.firstName = 'نام الزامی است';
    else if (formData.firstName.length < 2) newErrors.firstName = 'حداقل ۲ کاراکتر';
    
    if (!formData.lastName) newErrors.lastName = 'نام خانوادگی الزامی است';
    else if (formData.lastName.length < 2) newErrors.lastName = 'حداقل ۲ کاراکتر';
    
    if (!formData.email) newErrors.email = 'ایمیل الزامی است';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'فرمت نامعتبر';
    
    if (!formData.password) newErrors.password = 'رمز عبور الزامی است';
    else if (formData.password.length < 8) newErrors.password = 'حداقل ۸ کاراکتر';
    else if (passwordStrength < 40) newErrors.password = 'رمز عبور ضعیف است';
    
    if (!formData.confirmPassword) newErrors.confirmPassword = 'تایید رمز الزامی است';
    else if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'عدم تطابق';
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    try {
      // Call registration endpoint
      const userData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
      };
      
      await register(userData);
      
      // Redirect to home page after successful registration
      navigate('/');
    } catch (err) {
      // Handle specific errors
      if (err.message.includes('email')) {
        setErrors(prev => ({
          ...prev,
          email: 'این ایمیل قبلا ثبت شده است'
        }));
      } else {
        // General error (displayed by AuthContext)
        console.error('Registration error:', err);
      }
    }
  };

  // Animation variants
  const formControls = {
    hidden: { opacity: 0, y: 15 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.08,
        duration: 0.4,
      }
    })
  };
  
  return (
    <AuthLayout title="ثبت نام">
      <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4 md:space-y-5">
        {/* First Name field */}
        <motion.div
          custom={1}
          initial="hidden"
          animate="visible"
          variants={formControls}
        >
          <div className="flex items-center justify-between mb-1 md:mb-2">
            <label htmlFor="firstName" className="block text-xs md:text-sm font-medium text-gray-300">
              نام
            </label>
            {errors.firstName && (
              <motion.span 
                initial={{ opacity: 0, x: -5 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-xs md:text-sm text-draugr-500"
              >
                {errors.firstName}
              </motion.span>
            )}
          </div>
          <div className="relative">
            <input
              id="firstName"
              name="firstName"
              type="text"
              autoComplete="given-name"
              value={formData.firstName}
              onChange={handleChange}
              onFocus={() => setFocusedInput('firstName')}
              onBlur={() => setFocusedInput(null)}
              className={`w-full px-8 md:px-10 py-2 md:py-3 lg:py-4 rounded-md bg-black/50 border ${
                errors.firstName 
                  ? 'border-draugr-500 text-draugr-200' 
                  : focusedInput === 'firstName'
                    ? 'border-draugr-800 text-white' 
                    : 'border-gray-800 text-gray-300'
              } focus:outline-none text-sm md:text-base transition-colors duration-200`}
              placeholder="نام خود را وارد کنید"
            />
            <div className="absolute right-2.5 md:right-3 top-1/2 -translate-y-1/2 text-gray-500">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 md:h-5 md:w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        </motion.div>
        
        {/* Last Name field */}
        <motion.div
          custom={2}
          initial="hidden"
          animate="visible"
          variants={formControls}
        >
          <div className="flex items-center justify-between mb-1 md:mb-2">
            <label htmlFor="lastName" className="block text-xs md:text-sm font-medium text-gray-300">
              نام خانوادگی
            </label>
            {errors.lastName && (
              <motion.span 
                initial={{ opacity: 0, x: -5 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-xs md:text-sm text-draugr-500"
              >
                {errors.lastName}
              </motion.span>
            )}
          </div>
          <div className="relative">
            <input
              id="lastName"
              name="lastName"
              type="text"
              autoComplete="family-name"
              value={formData.lastName}
              onChange={handleChange}
              onFocus={() => setFocusedInput('lastName')}
              onBlur={() => setFocusedInput(null)}
              className={`w-full px-8 md:px-10 py-2 md:py-3 lg:py-4 rounded-md bg-black/50 border ${
                errors.lastName 
                  ? 'border-draugr-500 text-draugr-200' 
                  : focusedInput === 'lastName'
                    ? 'border-draugr-800 text-white' 
                    : 'border-gray-800 text-gray-300'
              } focus:outline-none text-sm md:text-base transition-colors duration-200`}
              placeholder="نام خانوادگی خود را وارد کنید"
            />
            <div className="absolute right-2.5 md:right-3 top-1/2 -translate-y-1/2 text-gray-500">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 md:h-5 md:w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        </motion.div>

        {/* Email field */}
        <motion.div
          custom={3}
          initial="hidden"
          animate="visible"
          variants={formControls}
        >
          <div className="flex items-center justify-between mb-1 md:mb-2">
            <label htmlFor="email" className="block text-xs md:text-sm font-medium text-gray-300">
              ایمیل
            </label>
            {errors.email && (
              <motion.span 
                initial={{ opacity: 0, x: -5 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-xs md:text-sm text-draugr-500"
              >
                {errors.email}
              </motion.span>
            )}
          </div>
          <div className="relative">
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              value={formData.email}
              onChange={handleChange}
              onFocus={() => setFocusedInput('email')}
              onBlur={() => setFocusedInput(null)}
              className={`w-full px-8 md:px-10 py-2 md:py-3 lg:py-4 rounded-md bg-black/50 border ${
                errors.email 
                  ? 'border-draugr-500 text-draugr-200' 
                  : focusedInput === 'email'
                    ? 'border-draugr-800 text-white' 
                    : 'border-gray-800 text-gray-300'
              } focus:outline-none text-sm md:text-base transition-colors duration-200`}
              placeholder="ایمیل خود را وارد کنید"
            />
            <div className="absolute right-2.5 md:right-3 top-1/2 -translate-y-1/2 text-gray-500">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 md:h-5 md:w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
              </svg>
            </div>
          </div>
        </motion.div>

        {/* Password field - with strength meter */}
        <motion.div
          custom={4}
          initial="hidden"
          animate="visible"
          variants={formControls}
        >
          <div className="flex items-center justify-between mb-1 md:mb-2">
            <label htmlFor="password" className="block text-xs md:text-sm font-medium text-gray-300">
              رمز عبور
            </label>
            {errors.password && (
              <motion.span 
                initial={{ opacity: 0, x: -5 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-xs md:text-sm text-draugr-500"
              >
                {errors.password}
              </motion.span>
            )}
          </div>
          <div className="relative">
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              value={formData.password}
              onChange={handleChange}
              onFocus={() => setFocusedInput('password')}
              onBlur={() => setFocusedInput(null)}
              className={`w-full px-8 md:px-10 py-2 md:py-3 lg:py-4 rounded-md bg-black/50 border ${
                errors.password 
                  ? 'border-draugr-500 text-draugr-200' 
                  : focusedInput === 'password'
                    ? 'border-draugr-800 text-white' 
                    : 'border-gray-800 text-gray-300'
              } focus:outline-none text-sm md:text-base transition-colors duration-200`}
              placeholder="رمز عبور خود را وارد کنید"
            />
            <div className="absolute right-2.5 md:right-3 top-1/2 -translate-y-1/2 text-gray-500">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 md:h-5 md:w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
              </svg>
            </div>
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute left-0.5 md:left-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 focus:outline-none"
            >
              {showPassword ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 md:h-5 md:w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                  <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 md:h-5 md:w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clipRule="evenodd" />
                  <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
                </svg>
              )}
            </button>
          </div>
          
          {/* Password strength meter */}
          {formData.password && (
            <motion.div 
              className="mt-1 md:mt-1.5"
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="flex items-center justify-between mb-1">
                <div className="h-0.5 w-full bg-gray-800 rounded-full overflow-hidden">
                  <motion.div 
                    className={`h-full ${getStrengthColor()}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${passwordStrength}%` }}
                    transition={{ duration: 0.5 }}
                  ></motion.div>
                </div>
                <span className="mx-2 text-xs text-gray-400">{getStrengthLabel()}</span>
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Confirm Password field */}
        <motion.div
          custom={5}
          initial="hidden"
          animate="visible"
          variants={formControls}
        >
          <div className="flex items-center justify-between mb-1 md:mb-2">
            <label htmlFor="confirmPassword" className="block text-xs md:text-sm font-medium text-gray-300">
              تکرار رمز عبور
            </label>
            {errors.confirmPassword && (
              <motion.span 
                initial={{ opacity: 0, x: -5 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-xs md:text-sm text-draugr-500"
              >
                {errors.confirmPassword}
              </motion.span>
            )}
          </div>
          <div className="relative">
            <input
              id="confirmPassword"
              name="confirmPassword"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              value={formData.confirmPassword}
              onChange={handleChange}
              onFocus={() => setFocusedInput('confirmPassword')}
              onBlur={() => setFocusedInput(null)}
              className={`w-full px-8 md:px-10 py-2 md:py-3 lg:py-4 rounded-md bg-black/50 border ${
                errors.confirmPassword 
                  ? 'border-draugr-500 text-draugr-200' 
                  : focusedInput === 'confirmPassword'
                    ? 'border-draugr-800 text-white' 
                    : 'border-gray-800 text-gray-300'
              } focus:outline-none text-sm md:text-base transition-colors duration-200`}
              placeholder="رمز عبور را مجددا وارد کنید"
            />
            <div className="absolute right-2.5 md:right-3 top-1/2 -translate-y-1/2 text-gray-500">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 md:h-5 md:w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        </motion.div>

        {/* Signup button */}
        <motion.div
          custom={6}
          initial="hidden"
          animate="visible"
          variants={formControls}
          className="mt-6"
        >
          <motion.button
            type="submit"
            disabled={authLoading}
            className="w-full bg-gradient-to-r from-draugr-900 to-draugr-700 text-white py-2 md:py-3 lg:py-4 px-4 rounded-md text-sm md:text-base font-medium shadow-md focus:outline-none relative overflow-hidden"
            whileHover={{ scale: 1.02, boxShadow: "0 0 10px rgba(255,0,0,0.3)" }}
            whileTap={{ scale: 0.98 }}
          >
            {authLoading ? (
              <div className="flex justify-center items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 md:h-5 md:w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                در حال ثبت نام...
              </div>
            ) : "ثبت نام"}
          </motion.button>
        </motion.div>

        {/* Auth error message */}
        {authError && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-sm text-draugr-500 text-center mt-3"
          >
            {authError}
          </motion.div>
        )}
        
        {/* Auth navigation buttons */}
        <motion.div
          custom={7}
          initial="hidden"
          animate="visible"
          variants={formControls}
          className="text-center mt-4 md:mt-6 text-xs md:text-sm text-gray-400"
        >
          قبلا ثبت نام کرده‌اید؟{' '}
          <Link to="/login" className="text-draugr-400 hover:text-draugr-300 transition-colors duration-200 font-medium">
            ورود
          </Link>
        </motion.div>
      </form>
    </AuthLayout>
  );
};

export default SignUp; 