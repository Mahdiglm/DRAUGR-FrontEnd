import React, { createContext, useState, useContext, useEffect } from 'react';
import authService from '../services/authService';
import cartService from '../services/cartService';

// Create Auth Context
const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Initialize auth state from local storage
  useEffect(() => {
    const initializeAuth = async () => {
      setLoading(true);
      try {
        // First check if we have a token
        const token = localStorage.getItem('token');
        if (!token) {
          setUser(null);
          setLoading(false);
          return;
        }
        
        // Then get user data
        const currentUser = authService.getCurrentUser();
        
        if (currentUser) {
          // If token exists, try to get a fresh user profile
          try {
            const userProfile = await authService.getUserProfile();
            setUser(userProfile);
            
            // Merge guest cart with user cart if needed
            try {
              await cartService.mergeCart();
            } catch (cartError) {
              console.error('Error merging cart:', cartError);
            }
          } catch (profileError) {
            console.error('Error fetching user profile:', profileError);
            // If token is invalid or unauthorized, log the user out
            if (profileError.message.includes('Invalid token') || 
                profileError.message === 'Unauthorized') {
              authService.logout();
              setUser(null);
            } else {
              // Otherwise, use the stored user data
              setUser(currentUser);
            }
          }
        } else {
          // If we have a token but no user data, log out to clear invalid state
          if (token) {
            authService.logout();
          }
          setUser(null);
        }
      } catch (err) {
        console.error('Auth initialization error:', err);
        setError(err.message);
        // Clean up any corrupt data
        authService.logout();
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    
    initializeAuth();
  }, []);

  // Login handler
  const login = async (email, password) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await authService.login(email, password);
      setUser(response.user);
      
      // Merge guest cart with user cart after login
      await cartService.mergeCart();
      
      return response;
    } catch (err) {
      setError(err.message || 'خطا در ورود به سیستم');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Register handler
  const register = async (userData) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await authService.register(userData);
      setUser(response.user);
      
      // Merge guest cart with user cart after registration
      await cartService.mergeCart();
      
      return response;
    } catch (err) {
      setError(err.message || 'خطا در ثبت نام');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Logout handler
  const logout = () => {
    authService.logout();
    setUser(null);
  };

  // Update profile handler
  const updateProfile = async (userData) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await authService.updateProfile(userData);
      setUser(response.user);
      return response;
    } catch (err) {
      setError(err.message || 'خطا در بروزرسانی پروفایل');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Provide auth context
  const value = {
    user,
    loading,
    error,
    login,
    register,
    logout,
    updateProfile,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext; 