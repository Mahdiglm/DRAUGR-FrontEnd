import secureApi from './api';

// Product Service - Handles product and category operations
const productService = {
  // Get all products
  getProducts: async (filters = {}) => {
    try {
      // Convert filter object to query string
      const queryParams = new URLSearchParams();
      
      if (filters.category) queryParams.append('category', filters.category);
      if (filters.search) queryParams.append('search', filters.search);
      if (filters.sortBy) queryParams.append('sortBy', filters.sortBy);
      if (filters.page) queryParams.append('page', filters.page);
      if (filters.perPage) queryParams.append('perPage', filters.perPage);
      
      const queryString = queryParams.toString();
      const endpoint = `/api/products${queryString ? `?${queryString}` : ''}`;
      
      const response = await secureApi.get(endpoint);
      return response;
    } catch (error) {
      console.error('Error in getProducts:', error);
      throw error;
    }
  },
  
  // Get all products from the all endpoint (ignores isShopConnected)
  getAllProducts: async () => {
    try {
      const endpoint = '/api/products/all';
      const response = await secureApi.get(endpoint);
      return response;
    } catch (error) {
      console.error('Error in getAllProducts:', error);
      throw error;
    }
  },
  
  // Get featured products
  getFeaturedProducts: async () => {
    try {
      const response = await secureApi.get('/api/products/featured');
      return response;
    } catch (error) {
      console.error('Error in getFeaturedProducts:', error);
      throw error;
    }
  },
  
  // Get a single product by ID
  getProductById: async (id) => {
    try {
      const endpoint = `/api/products/${id}`;
      const response = await secureApi.get(endpoint);
      return response;
    } catch (error) {
      console.error('Error in getProductById:', error);
      throw error;
    }
  },
  
  // Get all categories
  getCategories: async () => {
    try {
      const endpoint = '/api/categories';
      const response = await secureApi.get(endpoint);
      return response;
    } catch (error) {
      console.error('Error in getCategories:', error);
      throw error;
    }
  },
  
  // Get a single category by slug
  getCategoryBySlug: async (slug) => {
    try {
      const endpoint = `/api/categories/${slug}`;
      const response = await secureApi.get(endpoint);
      return response;
    } catch (error) {
      console.error('Error in getCategoryBySlug:', error);
      throw error;
    }
  },
  
  // Search products
  searchProducts: async (query) => {
    try {
      const endpoint = `/api/products/search?q=${encodeURIComponent(query)}`;
      const response = await secureApi.get(endpoint);
      return response;
    } catch (error) {
      console.error('Error in searchProducts:', error);
      throw error;
    }
  }
};

export default productService; 