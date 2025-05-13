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
    if (!formData.email) newErrors.email = 'لطفاً ایمیل خود را وارد کنید';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'فرمت ایمیل صحیح نیست';
    
    if (!formData.password) newErrors.password = 'لطفاً رمز عبور خود را وارد کنید';
    else if (formData.password.length < 6) newErrors.password = 'رمز عبور باید حداقل ۶ کاراکتر باشد';
    
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

  // Staggered animation for form elements
  const formControls = {
    hidden: { opacity: 0, y: 20 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
      }
    })
  };
  
  return (
    <AuthLayout title="ورود به حساب کاربری">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Email field */}
        <motion.div
          custom={1}
          initial="hidden"
          animate="visible"
          variants={formControls}
        >
          <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
            ایمیل
          </label>
          <div className="relative">
            <motion.div
              className="absolute inset-0 rounded-md pointer-events-none z-0"
              animate={{
                boxShadow: focusedInput === 'email' 
                  ? ['0 0 0 1px rgba(255,0,0,0.3)', '0 0 0 3px rgba(255,0,0,0.15)'] 
                  : '0 0 0 0 transparent'
              }}
              transition={{ duration: 0.3 }}
            />
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              value={formData.email}
              onChange={handleChange}
              onFocus={() => setFocusedInput('email')}
              onBlur={() => setFocusedInput(null)}
              className={`w-full px-4 py-3 rounded-md bg-midnight bg-opacity-20 border-2 ${
                errors.email 
                  ? 'border-draugr-500 text-draugr-200' 
                  : focusedInput === 'email'
                    ? 'border-draugr-800 text-white' 
                    : 'border-gray-800 text-gray-300'
              } focus:outline-none transition-colors duration-300 relative z-10`}
              placeholder="ایمیل خود را وارد کنید"
            />
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 z-20">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
              </svg>
            </div>
            {errors.email && (
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-2 text-sm text-draugr-500 font-medium"
              >
                {errors.email}
              </motion.p>
            )}
          </div>
        </motion.div>

        {/* Password field */}
        <motion.div
          custom={2}
          initial="hidden"
          animate="visible"
          variants={formControls}
        >
          <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">
            رمز عبور
          </label>
          <div className="relative">
            <motion.div
              className="absolute inset-0 rounded-md pointer-events-none z-0"
              animate={{
                boxShadow: focusedInput === 'password' 
                  ? ['0 0 0 1px rgba(255,0,0,0.3)', '0 0 0 3px rgba(255,0,0,0.15)'] 
                  : '0 0 0 0 transparent'
              }}
              transition={{ duration: 0.3 }}
            />
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              value={formData.password}
              onChange={handleChange}
              onFocus={() => setFocusedInput('password')}
              onBlur={() => setFocusedInput(null)}
              className={`w-full px-4 py-3 rounded-md bg-midnight bg-opacity-20 border-2 ${
                errors.password 
                  ? 'border-draugr-500 text-draugr-200' 
                  : focusedInput === 'password'
                    ? 'border-draugr-800 text-white' 
                    : 'border-gray-800 text-gray-300'
              } focus:outline-none transition-colors duration-300 relative z-10`}
              placeholder="رمز عبور خود را وارد کنید"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors duration-300 focus:outline-none z-20"
            >
              {showPassword ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                  <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clipRule="evenodd" />
                  <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
                </svg>
              )}
            </button>
            {errors.password && (
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-2 text-sm text-draugr-500 font-medium"
              >
                {errors.password}
              </motion.p>
            )}
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
          <Link to="/forgot-password" className="text-sm text-draugr-400 hover:text-draugr-300 transition-colors duration-300">
            فراموشی رمز عبور؟
          </Link>
        </motion.div>

        {/* Login button */}
        <motion.div
          custom={4}
          initial="hidden"
          animate="visible"
          variants={formControls}
        >
          <motion.button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-draugr-900 to-draugr-700 hover:from-draugr-800 hover:to-draugr-600 text-white py-3 px-4 rounded-md font-medium shadow-horror focus:outline-none overflow-hidden relative"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <motion.div 
              className="absolute inset-0 bg-draugr-500 opacity-0"
              whileHover={{ opacity: 0.1 }}
              transition={{ duration: 0.3 }}
            />
            
            {isLoading ? (
              <div className="flex justify-center items-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
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
          className="pt-4 border-t border-gray-800 mt-8"
        >
          <div className="flex flex-col space-y-2">
            <p className="text-sm text-center text-gray-400 mb-3">
              حساب کاربری ندارید؟
            </p>
            <Link to="/signup">
              <motion.button
                type="button"
                className="w-full bg-transparent border-2 border-draugr-800 text-draugr-400 hover:text-draugr-300 hover:border-draugr-700 py-2.5 px-4 rounded-md font-medium focus:outline-none relative overflow-hidden group"
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
              >
                <motion.div 
                  className="absolute inset-0 bg-draugr-900 opacity-0 group-hover:opacity-30"
                  transition={{ duration: 0.3 }}
                />
                <div className="flex items-center justify-center">
                  <span>ثبت نام کنید</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                  </svg>
                </div>
              </motion.button>
            </Link>
          </div>
        </motion.div>
      </form>
    </AuthLayout>
  );
};

export default Login; 