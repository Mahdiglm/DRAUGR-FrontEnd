import React, { createContext, useState, useContext, useEffect } from 'react';
import secureApi from '../services/api';
import { inputValidation, securityHelpers, csrfProtection } from '../utils/security';

// Create Auth Context
const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Initialize authentication state and CSRF protection
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Generate and set CSRF token
        const csrfToken = csrfProtection.generateToken();
        csrfProtection.setToken(csrfToken);

        // Check if user is already authenticated
        const userData = await secureApi.get('/auth/me');
        if (userData) {
          setUser(userData);
        }
      } catch (error) {
        // User is not authenticated or token is invalid
        console.log('کاربر وارد نشده است یا توکن نامعتبر است');
      }
    };

    initializeAuth();
  }, []);

  // Helper function to translate error messages to Persian
  const translateError = (errorMessage) => {
    if (typeof errorMessage !== 'string') return 'خطای ناشناخته';
    
    const errorMappings = {
      'Invalid credentials': 'نام کاربری یا رمز عبور اشتباه است',
      'User not found': 'کاربری با این مشخصات یافت نشد',
      'Email already exists': 'این ایمیل قبلاً ثبت شده است',
      'Invalid email': 'ایمیل نامعتبر است',
      'Password too weak': 'رمز عبور بسیار ضعیف است',
      'Account not activated': 'حساب کاربری فعال نشده است',
      'Account suspended': 'حساب کاربری مسدود شده است',
      'Too many attempts': 'تلاش‌های زیادی انجام شده، لطفاً بعداً تلاش کنید',
      'Network error': 'خطا در اتصال به شبکه',
      'Server error': 'خطا در سرور',
      'Token expired': 'نشست کاری منقضی شده، لطفاً دوباره وارد شوید',
      'Access denied': 'دسترسی مجاز نیست',
      'Validation failed': 'اطلاعات وارد شده نامعتبر است'
    };

    // Check for partial matches
    for (const [english, persian] of Object.entries(errorMappings)) {
      if (errorMessage.toLowerCase().includes(english.toLowerCase())) {
        return persian;
      }
    }

    return errorMessage; // Return original if no mapping found
  };

  const login = async (credentials) => {
    setLoading(true);
    setError(null);

    try {
      // Validate input data
      const validationResult = securityHelpers.validateLoginForm(credentials);
      if (!validationResult.isValid) {
        throw new Error(validationResult.errors[0]);
      }

      // Sanitize credentials
      const sanitizedCredentials = {
        email: credentials.email.trim().toLowerCase(),
        password: credentials.password // Don't sanitize password
      };

      // Make secure login request
      const response = await secureApi.post('/auth/login', sanitizedCredentials);
      
      if (response.success && response.data) {
        setUser(response.data.user);
        return response.data;
      } else {
        throw new Error(response.message || 'خطا در ورود');
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'خطا در ورود';
      const persianError = translateError(errorMessage);
      setError(persianError);
      throw new Error(persianError);
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    setLoading(true);
    setError(null);

    try {
      // Validate input data
      const validationResult = securityHelpers.validateRegisterForm(userData);
      if (!validationResult.isValid) {
        throw new Error(validationResult.errors[0]);
      }

      // Sanitize user data
      const sanitizedUserData = {
        firstName: userData.firstName.trim(),
        lastName: userData.lastName.trim(),
        email: userData.email.trim().toLowerCase(),
        password: userData.password // Don't sanitize password
      };

      // Remove confirmPassword before sending to API
      delete sanitizedUserData.confirmPassword;

      // Make secure register request
      const response = await secureApi.post('/auth/register', sanitizedUserData);
      
      if (response.success && response.data) {
        setUser(response.data.user);
        return response.data;
      } else {
        throw new Error(response.message || 'خطا در ثبت نام');
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'خطا در ثبت نام';
      const persianError = translateError(errorMessage);
      setError(persianError);
      throw new Error(persianError);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    
    try {
      // Call logout endpoint to invalidate token on server
      await secureApi.post('/auth/logout');
    } catch (error) {
      console.log('خطا در خروج از سمت سرور:', error.message);
    } finally {
      // Clear user state regardless of server response
      setUser(null);
      setError(null);
      
      // Clear stored tokens
      localStorage.removeItem('token');
      sessionStorage.removeItem('token');
      
      // Clear CSRF token
      const metaTag = document.querySelector('meta[name="csrf-token"]');
      if (metaTag) {
        metaTag.remove();
      }
      
      setLoading(false);
    }
  };

  const updateProfile = async (profileData) => {
    setLoading(true);
    setError(null);

    try {
      // Sanitize profile data
      const sanitizedData = {
        firstName: profileData.firstName.trim(),
        lastName: profileData.lastName.trim(),
        email: profileData.email.trim().toLowerCase()
      };

      const response = await secureApi.put('/auth/profile', sanitizedData);
      
      if (response.success && response.data) {
        setUser(response.data.user);
        return response.data;
      } else {
        throw new Error(response.message || 'خطا در به‌روزرسانی پروفایل');
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'خطا در به‌روزرسانی پروفایل';
      const persianError = translateError(errorMessage);
      setError(persianError);
      throw new Error(persianError);
    } finally {
      setLoading(false);
    }
  };

  const changePassword = async (passwordData) => {
    setLoading(true);
    setError(null);

    try {
      // Validate passwords
      if (!passwordData.currentPassword || !passwordData.newPassword) {
        throw new Error('رمز عبور فعلی و جدید الزامی است');
      }

      if (passwordData.newPassword !== passwordData.confirmPassword) {
        throw new Error('رمزهای عبور جدید یکسان نیستند');
      }

      const passwordValidation = inputValidation.validatePassword(passwordData.newPassword);
      if (!passwordValidation.isValid) {
        throw new Error(passwordValidation.errors[0]);
      }

      const response = await secureApi.put('/auth/change-password', {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });
      
      if (response.success) {
        return response.data;
      } else {
        throw new Error(response.message || 'خطا در تغییر رمز عبور');
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'خطا در تغییر رمز عبور';
      const persianError = translateError(errorMessage);
      setError(persianError);
      throw new Error(persianError);
    } finally {
      setLoading(false);
    }
  };

  const clearError = () => {
    setError(null);
  };

  const value = {
    user,
    loading,
    error,
    login,
    register,
    logout,
    updateProfile,
    changePassword,
    clearError,
    isAuthenticated: !!user,
    isAdmin: user?.isAdmin || false
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext; 