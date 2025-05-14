import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import AuthLayout from './AuthLayout';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
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
  };

  // Form submission handler
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Basic form validation
    const newErrors = {};
    if (!formData.email) newErrors.email = 'لطفاً ایمیل را وارد کنید';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'فرمت نامعتبر';
    
    if (!formData.password) newErrors.password = 'لطفاً رمز عبور را وارد کنید';
    else if (formData.password.length < 6) newErrors.password = 'حداقل ۶ کاراکتر';
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    // Simulate form submission
    setIsLoading(true);
    
    // Fake API call delay
    setTimeout(() => {
      setIsLoading(false);
      
      // Here you would normally handle response from your auth API
      console.log('Login attempt with:', formData);
      
      // Redirect to home page after successful login
      navigate('/');
    }, 2000);
  };

  // Animation variants
  const formControls = {
    hidden: { opacity: 0, y: 15 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.4,
      }
    })
  };
  
  return (
    <AuthLayout title="ورود به حساب کاربری">
      <form onSubmit={handleSubmit} className="space-y-3">
        {/* Email field */}
        <motion.div
          custom={1}
          initial="hidden"
          animate="visible"
          variants={formControls}
        >
          <div className="flex items-center justify-between mb-1">
            <label htmlFor="email" className="block text-xs font-medium text-gray-300">
              ایمیل
            </label>
            {errors.email && (
              <motion.span 
                initial={{ opacity: 0, x: -5 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-xs text-draugr-500"
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
              className={`w-full px-8 py-2 rounded-md bg-black/50 border ${
                errors.email 
                  ? 'border-draugr-500 text-draugr-200' 
                  : focusedInput === 'email'
                    ? 'border-draugr-800 text-white' 
                    : 'border-gray-800 text-gray-300'
              } focus:outline-none text-sm transition-colors duration-200`}
              placeholder="ایمیل خود را وارد کنید"
            />
            <div className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-500">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
              </svg>
            </div>
          </div>
        </motion.div>

        {/* Password field */}
        <motion.div
          custom={2}
          initial="hidden"
          animate="visible"
          variants={formControls}
        >
          <div className="flex items-center justify-between mb-1">
            <label htmlFor="password" className="block text-xs font-medium text-gray-300">
              رمز عبور
            </label>
            {errors.password && (
              <motion.span 
                initial={{ opacity: 0, x: -5 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-xs text-draugr-500"
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
              autoComplete="current-password"
              value={formData.password}
              onChange={handleChange}
              onFocus={() => setFocusedInput('password')}
              onBlur={() => setFocusedInput(null)}
              className={`w-full px-8 py-2 rounded-md bg-black/50 border ${
                errors.password 
                  ? 'border-draugr-500 text-draugr-200' 
                  : focusedInput === 'password'
                    ? 'border-draugr-800 text-white' 
                    : 'border-gray-800 text-gray-300'
              } focus:outline-none text-sm transition-colors duration-200`}
              placeholder="رمز عبور خود را وارد کنید"
            />
            <div className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-500">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
              </svg>
            </div>
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute left-0 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 focus:outline-none"
            >
              {showPassword ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                  <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clipRule="evenodd" />
                  <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
                </svg>
              )}
            </button>
          </div>
        </motion.div>

        {/* Forgot password link */}
        <motion.div
          custom={3}
          initial="hidden"
          animate="visible"
          variants={formControls}
          className="flex items-center justify-end"
        >
          <Link to="/forgot-password" className="text-xs text-draugr-400 hover:text-draugr-300 transition-colors duration-200">
            فراموشی رمز عبور؟
          </Link>
        </motion.div>

        {/* Login button */}
        <motion.div
          custom={4}
          initial="hidden"
          animate="visible"
          variants={formControls}
          className="mt-4"
        >
          <motion.button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-draugr-900 to-draugr-700 text-white py-2 px-4 rounded-md text-sm font-medium shadow-md focus:outline-none relative overflow-hidden"
            whileHover={{ scale: 1.02, boxShadow: "0 0 10px rgba(255,0,0,0.3)" }}
            whileTap={{ scale: 0.98 }}
          >
            {isLoading ? (
              <div className="flex justify-center items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                در حال ورود...
              </div>
            ) : "ورود"}
          </motion.button>
        </motion.div>
        
        {/* Auth navigation buttons */}
        <motion.div
          custom={5}
          initial="hidden"
          animate="visible"
          variants={formControls}
          className="text-center mt-4 text-xs text-gray-400"
        >
          حساب کاربری ندارید؟{' '}
          <Link to="/signup" className="text-draugr-400 hover:text-draugr-300 transition-colors duration-200 font-medium">
            ثبت نام
          </Link>
        </motion.div>
      </form>
    </AuthLayout>
  );
};

export default Login; 