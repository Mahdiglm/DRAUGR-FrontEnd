// Base API configuration for the Draugr Shop frontend

// API Base URL - use environment variable in production, fallback to local dev server
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Helper for handling API responses and errors consistently
const handleResponse = async (response) => {
  try {
    const text = await response.text();
    // Try to parse as JSON, but handle empty responses gracefully
    const data = text ? JSON.parse(text) : {};
    
    if (!response.ok) {
      // If the server response includes an error message, use it
      const errorMessage = data.message || data.error || response.statusText;
      
      // If authentication error, clear token
      if (response.status === 401) {
        localStorage.removeItem('token');
      }
      
      throw new Error(errorMessage);
    }
    
    return data;
  } catch (error) {
    if (error.name === 'SyntaxError') {
      throw new Error('Invalid response from server');
    }
    throw error;
  }
};

// Get JWT token from localStorage
const getToken = () => localStorage.getItem('token');

// API request methods with authentication handling
export const api = {
  // GET request
  async get(endpoint) {
    const token = getToken();
    const headers = {
      'Content-Type': 'application/json',
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'GET',
      headers,
    });
    
    return handleResponse(response);
  },
  
  // POST request
  async post(endpoint, body) {
    const token = getToken();
    const headers = {
      'Content-Type': 'application/json',
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
    });
    
    return handleResponse(response);
  },
  
  // PUT request
  async put(endpoint, body) {
    const token = getToken();
    const headers = {
      'Content-Type': 'application/json',
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(body),
    });
    
    return handleResponse(response);
  },
  
  // DELETE request
  async delete(endpoint) {
    const token = getToken();
    const headers = {
      'Content-Type': 'application/json',
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'DELETE',
      headers,
    });
    
    return handleResponse(response);
  }
};

export default api; 