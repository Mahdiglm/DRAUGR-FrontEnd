// Base API configuration for the Draugr Shop frontend

import axios from 'axios';

// API Base URL - use environment variable in production, fallback to local dev server
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Create axios instance with base configuration
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000, // 10 second timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

// Token management
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  
  failedQueue = [];
};

// Security utilities
const sanitizeUrl = (url) => {
  // Remove any potential XSS vectors from URL
  return url.replace(/[<>\"']/g, '');
};

const validateToken = (token) => {
  if (!token || typeof token !== 'string') return false;
  
  try {
    // Basic JWT format validation
    const parts = token.split('.');
    if (parts.length !== 3) return false;
    
    // Check if token is expired
    const payload = JSON.parse(atob(parts[1]));
    const currentTime = Date.now() / 1000;
    
    return payload.exp > currentTime;
  } catch (error) {
    console.error('Token validation error:', error);
    return false;
  }
};

const secureStorage = {
  setToken: (token) => {
    if (validateToken(token)) {
      localStorage.setItem('token', token);
      return true;
    }
    return false;
  },
  
  getToken: () => {
    const token = localStorage.getItem('token');
    return validateToken(token) ? token : null;
  },
  
  removeToken: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
  },
  
  setRefreshToken: (token) => {
    if (token && typeof token === 'string') {
      localStorage.setItem('refreshToken', token);
    }
  },
  
  getRefreshToken: () => {
    return localStorage.getItem('refreshToken');
  }
};

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    // Sanitize URL
    config.url = sanitizeUrl(config.url);
    
    // Add security headers
    config.headers['X-Requested-With'] = 'XMLHttpRequest';
    config.headers['Cache-Control'] = 'no-cache';
    
    // Add auth token
    const token = secureStorage.getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Add CSRF protection for state-changing operations
    if (['post', 'put', 'patch', 'delete'].includes(config.method?.toLowerCase())) {
      const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
      if (csrfToken) {
        config.headers['X-CSRF-Token'] = csrfToken;
      }
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor with token refresh
apiClient.interceptors.response.use(
  (response) => {
    // Check for new token in response headers
    const newToken = response.headers['x-new-token'];
    if (newToken && validateToken(newToken)) {
      secureStorage.setToken(newToken);
    }
    
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    
    // Handle network errors
    if (!error.response) {
      console.error('Network error:', error.message);
      return Promise.reject(new Error('Conexão com o servidor falhada. Verifique sua internet.'));
    }
    
    // Handle 401 unauthorized
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // Queue the request while token is being refreshed
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(token => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return apiClient(originalRequest);
        }).catch(err => {
          return Promise.reject(err);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshToken = secureStorage.getRefreshToken();
        if (!refreshToken) {
          throw new Error('No refresh token available');
        }

        // Attempt to refresh token
        const response = await axios.post(`${API_BASE_URL}/api/auth/refresh`, {
          refreshToken: refreshToken
        });

        const { token: newToken, refreshToken: newRefreshToken } = response.data;
        
        if (validateToken(newToken)) {
          secureStorage.setToken(newToken);
          if (newRefreshToken) {
            secureStorage.setRefreshToken(newRefreshToken);
          }
          
          // Update authorization header
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          
          processQueue(null, newToken);
          return apiClient(originalRequest);
        } else {
          throw new Error('Invalid token received');
        }
      } catch (refreshError) {
        processQueue(refreshError, null);
        secureStorage.removeToken();
        
        // Redirect to login page
        window.location.href = '/login';
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }
    
    // Handle other specific errors
    const errorMessage = error.response?.data?.message || error.message || 'Erro desconhecido';
    
    // Security: Don't expose sensitive error details
    const sanitizedError = {
      message: errorMessage.replace(/<[^>]*>/g, ''), // Remove HTML tags
      status: error.response?.status,
      code: error.response?.data?.code
    };
    
    return Promise.reject(sanitizedError);
  }
);

// Enhanced API wrapper with security features
const handleResponse = async (response) => {
  // Validate response structure
  if (!response || typeof response !== 'object') {
    throw new Error('Invalid response format');
  }
  
  return response.data;
};

const secureApi = {
  async get(endpoint, config = {}) {
    try {
      const response = await apiClient.get(endpoint, {
        ...config,
        // Add security-specific config
        validateStatus: (status) => status >= 200 && status < 300,
      });
      return handleResponse(response);
    } catch (error) {
      console.error(`GET ${endpoint} error:`, error);
      throw error;
    }
  },

  async post(endpoint, data = {}, config = {}) {
    try {
      // Validate and sanitize data
      const sanitizedData = typeof data === 'object' ? data : {};
      
      const response = await apiClient.post(endpoint, sanitizedData, {
        ...config,
        validateStatus: (status) => status >= 200 && status < 300,
      });
      return handleResponse(response);
    } catch (error) {
      console.error(`POST ${endpoint} error:`, error);
      throw error;
    }
  },

  async put(endpoint, data = {}, config = {}) {
    try {
      const sanitizedData = typeof data === 'object' ? data : {};
      
      const response = await apiClient.put(endpoint, sanitizedData, {
        ...config,
        validateStatus: (status) => status >= 200 && status < 300,
      });
      return handleResponse(response);
    } catch (error) {
      console.error(`PUT ${endpoint} error:`, error);
      throw error;
    }
  },

  async delete(endpoint, config = {}) {
    try {
      const response = await apiClient.delete(endpoint, {
        ...config,
        validateStatus: (status) => status >= 200 && status < 300,
      });
      return handleResponse(response);
    } catch (error) {
      console.error(`DELETE ${endpoint} error:`, error);
      throw error;
    }
  },

  // Security utilities
  clearTokens: () => {
    secureStorage.removeToken();
  },
  
  isAuthenticated: () => {
    return !!secureStorage.getToken();
  },
  
  getTokenPayload: () => {
    const token = secureStorage.getToken();
    if (!token) return null;
    
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload;
    } catch (error) {
      console.error('Error parsing token payload:', error);
      return null;
    }
  }
};

export default secureApi; 