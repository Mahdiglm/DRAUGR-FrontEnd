import React, { createContext, useState, useContext, useEffect } from 'react';
import secureApi from '../services/api';

// Create Auth Context
const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize authentication state and CSRF protection
  useEffect(() => {
    // Prevent multiple initializations
    if (isInitialized) return;

    const initializeAuth = async () => {
      try {
        // Only check authentication if we have a token
        const token = localStorage.getItem('token');
        if (token) {
          try {
            const userData = await secureApi.get('/api/auth/user');
            if (userData) {
              setUser(userData);
            }
          } catch (error) {
            // Check if it's a network error (backend not available)
            if (!error.response) {
              // Backend not available, keep the token and try again later
              if (!window.authNetworkErrorLogged) {
                console.log('Backend not available during auth check');
                window.authNetworkErrorLogged = true;
              }
            } else {
              // Token is invalid, clear it
              localStorage.removeItem('token');
              sessionStorage.removeItem('token');
              // Only log once to avoid spam
              if (!window.authErrorLogged) {
                console.log('Token invalid, cleared');
                window.authErrorLogged = true;
              }
            }
          }
        }
      } catch (error) {
        // Initialization error
        if (!window.authInitErrorLogged) {
          console.log('Auth initialization error:', error);
          window.authInitErrorLogged = true;
        }
      } finally {
        setIsInitialized(true);
      }
    };

    initializeAuth();
  }, [isInitialized]);

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
      console.log('Login attempt with credentials:', credentials);
      
      // Basic validation with detailed logging
      if (!credentials) {
        console.error('No credentials provided');
        throw new Error('اطلاعات ورود ارائه نشده است');
      }
      
      if (!credentials.email) {
        console.error('No email provided');
        throw new Error('ایمیل الزامی است');
      }
      
      if (!credentials.password) {
        console.error('No password provided');
        throw new Error('رمز عبور الزامی است');
      }

      // Sanitize credentials
      const sanitizedCredentials = {
        email: credentials.email.trim().toLowerCase(),
        password: credentials.password // Don't sanitize password
      };

      console.log('Sanitized credentials:', { email: sanitizedCredentials.email, password: '[HIDDEN]' });

      // Basic email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(sanitizedCredentials.email)) {
        console.error('Invalid email format:', sanitizedCredentials.email);
        throw new Error('فرمت ایمیل نامعتبر است');
      }

      // Make secure login request
      const response = await secureApi.post('/api/auth/login', sanitizedCredentials);
      
      if (response.success && response.data) {
        setUser(response.data.user);
        return response.data;
      } else {
        throw new Error(response.message || 'خطا در ورود');
      }
    } catch (error) {
      console.error('Login error details:', error);
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
      // Basic validation
      if (!userData.firstName || !userData.lastName || !userData.email || !userData.password) {
        throw new Error('تمام فیلدها الزامی هستند');
      }

      if (userData.password !== userData.confirmPassword) {
        throw new Error('رمزهای عبور یکسان نیستند');
      }

      // Basic email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(userData.email)) {
        throw new Error('فرمت ایمیل نامعتبر است');
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
      const response = await secureApi.post('/api/auth/register', sanitizedUserData);
      
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
      await secureApi.get('/api/auth/logout');
    } catch (error) {
      console.log('خطا در خروج از سمت سرور:', error.message);
    } finally {
      // Clear user state regardless of server response
      setUser(null);
      setError(null);
      
      // Clear stored tokens
      localStorage.removeItem('token');
      sessionStorage.removeItem('token');
      
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

      const response = await secureApi.put('/api/auth/user', sanitizedData);
      
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

      // Basic password validation
      if (passwordData.newPassword.length < 6) {
        throw new Error('رمز عبور باید حداقل ۶ کاراکتر باشد');
      }

      const response = await secureApi.put('/api/auth/user', {
        password: passwordData.newPassword
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