import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import AuthLayout from './AuthLayout';

const SignUp = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);

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
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Comprehensive form validation
    const newErrors = {};
    
    if (!formData.name) newErrors.name = 'لطفاً نام خود را وارد کنید';
    else if (formData.name.length < 3) newErrors.name = 'نام باید حداقل ۳ کاراکتر باشد';
    
    if (!formData.email) newErrors.email = 'لطفاً ایمیل خود را وارد کنید';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'فرمت ایمیل صحیح نیست';
    
    if (!formData.password) newErrors.password = 'لطفاً رمز عبور را وارد کنید';
    else if (formData.password.length < 8) newErrors.password = 'رمز عبور باید حداقل ۸ کاراکتر باشد';
    else if (passwordStrength < 40) newErrors.password = 'رمز عبور شما کافی قوی نیست';
    
    if (!formData.confirmPassword) newErrors.confirmPassword = 'لطفاً تأیید رمز عبور را وارد کنید';
    else if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'تأیید رمز عبور مطابقت ندارد';
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    // Simulate form submission
    setIsLoading(true);
    
    // Fake API call delay
    setTimeout(() => {
      setIsLoading(false);
      
      // Here you would normally handle the response from your auth API
      console.log('Signup attempt with:', formData);
      
      // Redirect to home or login page after successful signup
      // history.push('/login');
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
  
  // Blood drip animation for input focus
  const bloodDrip = {
    initial: { height: 0, opacity: 0 },
    animate: { height: 15, opacity: 1 },
    exit: { height: 0, opacity: 0 }
  };
  
  return (
    <AuthLayout title="ثبت نام">
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Name field */}
        <motion.div
          custom={1}
          initial="hidden"
          animate="visible"
          variants={formControls}
        >
          <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">
            نام
          </label>
          <div className="relative">
            <input
              id="name"
              name="name"
              type="text"
              autoComplete="name"
              value={formData.name}
              onChange={handleChange}
              className={`horror-input w-full px-4 py-2 rounded-md bg-ash ${
                errors.name ? 'border-draugr-500' : 'border-gray-700'
              }`}
              placeholder="نام خود را وارد کنید"
            />
            {errors.name && (
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-2 text-sm text-draugr-500"
              >
                {errors.name}
              </motion.p>
            )}
          </div>
        </motion.div>

        {/* Email field */}
        <motion.div
          custom={2}
          initial="hidden"
          animate="visible"
          variants={formControls}
        >
          <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
            ایمیل
          </label>
          <div className="relative">
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              value={formData.email}
              onChange={handleChange}
              className={`horror-input w-full px-4 py-2 rounded-md bg-ash ${
                errors.email ? 'border-draugr-500' : 'border-gray-700'
              }`}
              placeholder="ایمیل خود را وارد کنید"
            />
            {errors.email && (
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-2 text-sm text-draugr-500"
              >
                {errors.email}
              </motion.p>
            )}
          </div>
        </motion.div>

        {/* Password field */}
        <motion.div
          custom={3}
          initial="hidden"
          animate="visible"
          variants={formControls}
        >
          <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">
            رمز عبور
          </label>
          <div className="relative">
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              value={formData.password}
              onChange={handleChange}
              className={`horror-input w-full px-4 py-2 rounded-md bg-ash ${
                errors.password ? 'border-draugr-500' : 'border-gray-700'
              }`}
              placeholder="رمز عبور جدید را وارد کنید"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 left-0 px-3 flex items-center bg-transparent border-0 text-gray-400 hover:text-white focus:outline-none"
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
          </div>
          
          {/* Password strength meter */}
          {formData.password && (
            <div className="mt-2">
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs text-gray-400">قدرت رمز عبور: </span>
                <span className={`text-xs ${
                  passwordStrength < 30 ? 'text-draugr-900' : 
                  passwordStrength < 60 ? 'text-draugr-700' : 'text-draugr-500'
                }`}>
                  {getStrengthLabel()}
                </span>
              </div>
              <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
                <motion.div
                  className={`h-full ${getStrengthColor()}`}
                  initial={{ width: 0 }}
                  animate={{ width: `${passwordStrength}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            </div>
          )}
          
          {errors.password && (
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-2 text-sm text-draugr-500"
            >
              {errors.password}
            </motion.p>
          )}
        </motion.div>
        
        {/* Confirm Password field */}
        <motion.div
          custom={4}
          initial="hidden"
          animate="visible"
          variants={formControls}
        >
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-1">
            تأیید رمز عبور
          </label>
          <div className="relative">
            <input
              id="confirmPassword"
              name="confirmPassword"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              value={formData.confirmPassword}
              onChange={handleChange}
              className={`horror-input w-full px-4 py-2 rounded-md bg-ash ${
                errors.confirmPassword ? 'border-draugr-500' : 'border-gray-700'
              }`}
              placeholder="رمز عبور را مجدداً وارد کنید"
            />
            {errors.confirmPassword && (
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-2 text-sm text-draugr-500"
              >
                {errors.confirmPassword}
              </motion.p>
            )}
          </div>
        </motion.div>

        {/* Signup button */}
        <motion.div
          custom={5}
          initial="hidden"
          animate="visible"
          variants={formControls}
          className="mt-8"
        >
          <motion.button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-draugr-900 to-draugr-700 hover:from-draugr-800 hover:to-draugr-600 text-white py-2 px-4 rounded-md font-medium shadow-horror border border-draugr-800 focus:outline-none focus:ring-2 focus:ring-draugr-500 focus:ring-offset-2 focus:ring-offset-gray-900"
            whileHover={{ scale: 1.02, boxShadow: '0 0 15px rgba(255, 0, 0, 0.5)' }}
            whileTap={{ scale: 0.98 }}
          >
            {isLoading ? (
              <div className="flex justify-center items-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                در حال ثبت نام...
              </div>
            ) : "ثبت نام"}
          </motion.button>
        </motion.div>
        
        {/* Login link */}
        <motion.div
          custom={6}
          initial="hidden"
          animate="visible"
          variants={formControls}
          className="text-center mt-4"
        >
          <p className="text-sm text-gray-400">
            قبلاً ثبت نام کرده‌اید؟{' '}
            <Link to="/login" className="text-draugr-400 hover:text-draugr-300 font-medium">
              وارد شوید
            </Link>
          </p>
        </motion.div>
      </form>
    </AuthLayout>
  );
};

export default SignUp; 