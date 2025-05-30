import { api } from './api';

// Auth Service - Handles user authentication and user management
const authService = {
  // Login user
  login: async (email, password) => {
    try {
      const response = await api.post('/api/users/authenticate', { email, password });
      
      // Store token and user info in local storage
      if (response.token) {
        localStorage.setItem('token', response.token);
        
        // Create proper user object with response data
        const user = {
          id: response.id,
          firstName: response.firstName,
          lastName: response.lastName,
          email: response.email,
          role: response.role,
        };
        localStorage.setItem('user', JSON.stringify(user));
      }
      
      return response;
    } catch (error) {
      throw error;
    }
  },
  
  // Register a new user
  register: async (userData) => {
    try {
      const response = await api.post('/api/users/register', userData);
      
      // Store token and user info if registration leads directly to login
      if (response.token) {
        localStorage.setItem('token', response.token);
        
        // Create proper user object with response data
        const user = {
          id: response.id,
          firstName: response.firstName,
          lastName: response.lastName,
          email: response.email,
          role: response.role,
        };
        localStorage.setItem('user', JSON.stringify(user));
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
      const user = localStorage.getItem('user');
      if (!user) return null;
      return JSON.parse(user);
    } catch (error) {
      console.error('Failed to parse user from localStorage', error);
      // Clear corrupted data
      localStorage.removeItem('user');
      return null;
    }
  },
  
  // Get current user profile from API
  getUserProfile: async () => {
    try {
      return await api.get('/api/users/profile');
    } catch (error) {
      throw error;
    }
  },
  
  // Update user profile
  updateProfile: async (userData) => {
    try {
      const response = await api.put('/api/users/profile', userData);
      
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
      return await api.put('/api/users/change-password', { 
        currentPassword, 
        newPassword 
      });
    } catch (error) {
      throw error;
    }
  }
};

export default authService; 