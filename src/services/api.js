// Base API configuration for the Draugr Shop frontend

// API Base URL - use environment variable in production, fallback to local dev server
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://draugr-backend.onrender.com';

// Helper for handling API responses and errors consistently
const handleResponse = async (response) => {
  try {
    // First check for unauthorized response
    if (response.status === 401) {
      throw new Error('Unauthorized');
    }
    
    // Try to parse JSON response
    const text = await response.text();
    let data = {};
    
    // Only try to parse if there's actual content
    if (text && text.trim()) {
      try {
        data = JSON.parse(text);
      } catch (parseError) {
        console.error('Error parsing API response:', parseError);
        throw new Error(`Invalid response format: ${text.substring(0, 100)}`);
      }
    }
    
    if (!response.ok) {
      // If the server response includes an error message, use it
      const errorMessage = data.message || data.error || response.statusText;
      throw new Error(errorMessage);
    }
    
    return data;
  } catch (error) {
    // Re-throw the error with the original message
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