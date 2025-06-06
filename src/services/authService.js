import secureApi from './api';

// Auth Service - Handles user authentication and user management
const authService = {
  // Login user
  login: async (email, password) => {
    try {
      const response = await secureApi.post('/api/auth/login', { email, password });
      
      // Store token and user info in local storage
      if (response.token) {
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));
      }
      
      return response;
    } catch (error) {
      throw error;
    }
  },
  
  // Register a new user
  register: async (userData) => {
    try {
      const response = await secureApi.post('/api/auth/register', userData);
      
      // Store token and user info if registration leads directly to login
      if (response.token) {
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));
      }
      
      return response;
    } catch (error) {
      throw error;
    }
  },
  
  // Logout user - clear local storage
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
  
  // Check if user is logged in
  isAuthenticated: () => {
    const token = localStorage.getItem('token');
    return !!token; // Return true if token exists
  },
  
  // Get current user data
  getCurrentUser: () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return null;
      
      // Return the stored user data if available
      const userData = localStorage.getItem('user');
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error('Error getting current user:', error);
      return null;
    }
  },
  
  // Get current user profile from API
  getUserProfile: async () => {
    try {
      return await secureApi.get('/api/auth/user');
    } catch (error) {
      throw error;
    }
  },
  
  // Update user profile
  updateProfile: async (userData) => {
    try {
      const response = await secureApi.put('/api/auth/user', userData);
      
      // Update stored user data if successful
      if (response.user) {
        localStorage.setItem('user', JSON.stringify(response.user));
      }
      
      return response;
    } catch (error) {
      throw error;
    }
  },
  
  // Change password
  changePassword: async (currentPassword, newPassword) => {
    try {
      const response = await api.put('/api/auth/user/password', {
        currentPassword,
        newPassword
      });
      return response;
    } catch (error) {
      throw error;
    }
  }
};

export default authService; 