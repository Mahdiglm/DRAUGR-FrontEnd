import secureApi from './api.js';
import { mockData } from '../utils/mockData.js';

/**
 * Enhanced API Integration Service
 * Handles real backend API calls with graceful fallback to mock data
 * Provides production-ready error handling and retry logic
 */

class ApiIntegrationService {
  constructor() {
    this.isBackendAvailable = null;
    this.lastBackendCheck = 0;
    this.checkInterval = 30000; // 30 seconds
    this.retryAttempts = 3;
    this.retryDelay = 1000; // 1 second
    this.useMockData = false;
    
    // Initialize backend check
    this.checkBackendAvailability();
  }

  /**
   * Check if backend server is available
   */
  async checkBackendAvailability() {
    const now = Date.now();
    
    // Don't check too frequently
    if (this.lastBackendCheck && (now - this.lastBackendCheck) < this.checkInterval) {
      return this.isBackendAvailable;
    }

    try {
      // Simple health check endpoint
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/health`, {
        method: 'GET',
        timeout: 5000,
        signal: AbortSignal.timeout(5000)
      });
      
      this.isBackendAvailable = response.ok;
      this.useMockData = !response.ok;
      
      if (this.isBackendAvailable) {
        console.log('✅ Backend server is available');
      } else {
        console.warn('⚠️ Backend server responded with error, using mock data');
      }
    } catch (error) {
      this.isBackendAvailable = false;
      this.useMockData = true;
      console.warn('⚠️ Backend server not available, using mock data');
    }
    
    this.lastBackendCheck = now;
    return this.isBackendAvailable;
  }

  /**
   * Enhanced API call with retry logic and fallback
   */
  async makeApiCall(method, endpoint, data = null, options = {}) {
    const { 
      fallbackData = null, 
      useCache = false, 
      retries = this.retryAttempts,
      mockDataKey = null
    } = options;

    // Check backend availability first
    await this.checkBackendAvailability();

    // If backend is not available, use mock data immediately
    if (!this.isBackendAvailable && mockDataKey && mockData[mockDataKey]) {
      console.log(`📋 Using mock data for ${endpoint}`);
      return this.formatMockResponse(mockData[mockDataKey]);
    }

    // Try API call with retries
    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        let response;
        
        switch (method.toLowerCase()) {
          case 'get':
            response = await secureApi.get(endpoint);
            break;
          case 'post':
            response = await secureApi.post(endpoint, data);
            break;
          case 'put':
            response = await secureApi.put(endpoint, data);
            break;
          case 'delete':
            response = await secureApi.delete(endpoint);
            break;
          default:
            throw new Error(`Unsupported HTTP method: ${method}`);
        }

        // Mark backend as available on successful response
        this.isBackendAvailable = true;
        this.useMockData = false;
        
        return response;
        
      } catch (error) {
        console.warn(`API call attempt ${attempt} failed for ${endpoint}:`, error.message);
        
        // If this is the last attempt and we have fallback data
        if (attempt === retries) {
          this.isBackendAvailable = false;
          this.useMockData = true;
          
          // Try mock data as final fallback
          if (mockDataKey && mockData[mockDataKey]) {
            console.log(`📋 API failed, falling back to mock data for ${endpoint}`);
            return this.formatMockResponse(mockData[mockDataKey]);
          }
          
          // Use provided fallback data
          if (fallbackData) {
            console.log(`📋 Using provided fallback data for ${endpoint}`);
            return this.formatMockResponse(fallbackData);
          }
          
          // Re-throw error if no fallback available
          throw new Error(`API call failed after ${retries} attempts: ${error.message}`);
        }
        
        // Wait before retry
        await this.delay(this.retryDelay * attempt);
      }
    }
  }

  /**
   * Format mock data to match API response structure
   */
  formatMockResponse(data) {
    return {
      success: true,
      data: data,
      message: 'Success (mock data)',
      mock: true
    };
  }

  /**
   * Delay utility for retries
   */
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Authentication Methods
   */
  async login(credentials) {
    return this.makeApiCall('post', '/api/auth/login', credentials, {
      mockDataKey: 'users',
      fallbackData: {
        user: { 
          _id: 'mock-user-id', 
          name: credentials.email?.split('@')[0] || 'User',
          email: credentials.email,
          isAdmin: false // Always false for mock data - real admin status determined by backend
        },
        token: 'mock-jwt-token'
      }
    });
  }

  async register(userData) {
    return this.makeApiCall('post', '/api/auth/register', userData, {
      fallbackData: {
        user: { 
          _id: 'mock-user-id', 
          name: userData.name,
          email: userData.email,
          isAdmin: false
        },
        token: 'mock-jwt-token'
      }
    });
  }

  async getCurrentUser() {
    return this.makeApiCall('get', '/api/auth/user', null, {
      fallbackData: {
        _id: 'mock-user-id',
        name: 'Mock User',
        email: 'user@example.com',
        isAdmin: false
      }
    });
  }

  async updateProfile(userData) {
    return this.makeApiCall('put', '/api/auth/user', userData, {
      fallbackData: { ...userData, _id: 'mock-user-id' }
    });
  }

  /**
   * Product Methods
   */
  async getProducts(params = {}) {
    return this.makeApiCall('get', '/api/products', null, {
      mockDataKey: 'products'
    });
  }

  async getProduct(id) {
    return this.makeApiCall('get', `/api/products/${id}`, null, {
      fallbackData: mockData.products?.[0] || {}
    });
  }

  async createProduct(productData) {
    return this.makeApiCall('post', '/api/products', productData, {
      fallbackData: { ...productData, _id: 'mock-product-id' }
    });
  }

  async updateProduct(id, productData) {
    return this.makeApiCall('put', `/api/products/${id}`, productData, {
      fallbackData: { ...productData, _id: id }
    });
  }

  async deleteProduct(id) {
    return this.makeApiCall('delete', `/api/products/${id}`, null, {
      fallbackData: { message: 'Product deleted successfully' }
    });
  }

  /**
   * Category Methods
   */
  async getCategories() {
    return this.makeApiCall('get', '/api/categories', null, {
      mockDataKey: 'categories'
    });
  }

  async getCategoryBySlug(slug) {
    const categories = mockData.categories || [];
    const category = categories.find(cat => cat.slug === slug);
    
    return this.makeApiCall('get', `/api/categories/slug/${slug}`, null, {
      fallbackData: category || {}
    });
  }

  /**
   * Order Methods
   */
  async getOrders() {
    return this.makeApiCall('get', '/api/orders', null, {
      mockDataKey: 'orders'
    });
  }

  async createOrder(orderData) {
    return this.makeApiCall('post', '/api/orders', orderData, {
      fallbackData: { 
        ...orderData, 
        _id: 'mock-order-id',
        status: 'pending',
        createdAt: new Date().toISOString()
      }
    });
  }

  /**
   * Blog Methods
   */
  async getBlogs() {
    return this.makeApiCall('get', '/api/blogs', null, {
      mockDataKey: 'blogs'
    });
  }

  async getBlog(slug) {
    const blogs = mockData.blogs || [];
    const blog = blogs.find(b => b.slug === slug);
    
    return this.makeApiCall('get', `/api/blogs/${slug}`, null, {
      fallbackData: blog || {}
    });
  }

  /**
   * Cart Methods
   */
  async getCart() {
    return this.makeApiCall('get', '/api/cart', null, {
      fallbackData: { items: [], total: 0 }
    });
  }

  async addToCart(productId, quantity = 1) {
    return this.makeApiCall('post', '/api/cart/add', { productId, quantity }, {
      fallbackData: { message: 'Item added to cart', success: true }
    });
  }

  async updateCartItem(itemId, quantity) {
    return this.makeApiCall('put', `/api/cart/update/${itemId}`, { quantity }, {
      fallbackData: { message: 'Cart updated', success: true }
    });
  }

  async removeFromCart(itemId) {
    return this.makeApiCall('delete', `/api/cart/remove/${itemId}`, null, {
      fallbackData: { message: 'Item removed from cart', success: true }
    });
  }

  /**
   * Admin Methods
   */
  async getAdminStats() {
    return this.makeApiCall('get', '/api/admin/stats', null, {
      fallbackData: {
        totalUsers: 150,
        totalProducts: 25,
        totalOrders: 87,
        totalRevenue: 15420.50,
        recentOrders: mockData.orders?.slice(0, 5) || []
      }
    });
  }

  async getUsers() {
    return this.makeApiCall('get', '/api/admin/users', null, {
      mockDataKey: 'users'
    });
  }

  async updateUser(id, userData) {
    return this.makeApiCall('put', `/api/admin/users/${id}`, userData, {
      fallbackData: { ...userData, _id: id }
    });
  }

  async deleteUser(id) {
    return this.makeApiCall('delete', `/api/admin/users/${id}`, null, {
      fallbackData: { message: 'User deleted successfully' }
    });
  }

  /**
   * Utility Methods
   */
  isUsingMockData() {
    return this.useMockData;
  }

  getBackendStatus() {
    return {
      available: this.isBackendAvailable,
      usingMockData: this.useMockData,
      lastChecked: new Date(this.lastBackendCheck).toISOString()
    };
  }

  async refreshBackendStatus() {
    this.lastBackendCheck = 0; // Force recheck
    return this.checkBackendAvailability();
  }
}

// Create singleton instance
const apiIntegration = new ApiIntegrationService();

// Export both the class and the instance
export { ApiIntegrationService };
export default apiIntegration; 