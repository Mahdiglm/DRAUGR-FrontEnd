import React, { createContext, useState, useContext, useEffect } from 'react';
import authService from '../services/authService';
import cartService from '../services/cartService';

// Create Auth Context
const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Initialize auth state from local storage
  useEffect(() => {
    const initializeAuth = async () => {
      setIsLoading(true);
      try {
        const currentUser = authService.getCurrentUser();
        
        if (currentUser) {
          // If token exists, try to get a fresh user profile
          try {
            const userProfile = await authService.getUserProfile();
            setUser(userProfile);
            setIsAuthenticated(true);
          } catch (profileError) {
            console.error('Error fetching user profile:', profileError);
            // If token is invalid, log the user out
            if (profileError.message.includes('Invalid token')) {
              authService.logout();
              setUser(null);
              setIsAuthenticated(false);
            } else {
              // Otherwise, use the stored user data
              setUser(currentUser);
              setIsAuthenticated(true);
            }
          }
          
          // Merge guest cart with user cart if needed
          try {
            await cartService.mergeCart();
          } catch (cartError) {
            console.error('Error merging cart:', cartError);
          }
        } else {
          setUser(null);
          setIsAuthenticated(false);
        }
      } catch (err) {
        console.error('Auth initialization error:', err);
        setError(err.message);
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };
    
    initializeAuth();
  }, []);

  // Login handler
  const login = async (email, password) => {
    setError(null);
    try {
      const response = await authService.login(email, password);
      localStorage.setItem('token', response.token);
      setUser(response.user);
      setIsAuthenticated(true);
      
      // Merge guest cart with user cart after login
      await cartService.mergeCart();
      
      return response.user;
    } catch (err) {
      setError(err.message || 'Login failed');
      throw err;
    }
  };

  // Register handler
  const register = async (userData) => {
    setError(null);
    try {
      const response = await authService.register(userData);
      localStorage.setItem('token', response.token);
      setUser(response.user);
      setIsAuthenticated(true);
      
      // Merge guest cart with user cart after registration
      await cartService.mergeCart();
      
      return response.user;
    } catch (err) {
      setError(err.message || 'Registration failed');
      throw err;
    }
  };

  // Logout handler
  const logout = () => {
    authService.logout();
    setUser(null);
    setIsAuthenticated(false);
  };

  // Update profile handler
  const updateProfile = async (userData) => {
    setError(null);
    
    try {
      const response = await authService.updateProfile(userData);
      setUser(response.user);
      return response;
    } catch (err) {
      setError(err.message || 'Failed to update profile');
      throw err;
    }
  };

  // Update user context after profile changes
  const updateUserContext = (updatedUserData) => {
    setUser(updatedUserData);
  };

  // Provide auth context
  const value = {
    user,
    isAuthenticated,
    isLoading,
    error,
    login,
    register,
    logout,
    updateProfile,
    updateUserContext
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext; 