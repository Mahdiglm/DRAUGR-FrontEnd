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
      
      console.log('Calling API endpoint:', endpoint);
      const response = await secureApi.get(endpoint);
      console.log('Raw API response for products:', response);
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
      console.log('Calling API endpoint:', endpoint);
      const response = await secureApi.get(endpoint);
      console.log('Raw API response for all products:', response);
      return response;
    } catch (error) {
      console.error('Error in getAllProducts:', error);
      throw error;
    }
  },
  
  // Get featured products
  getFeaturedProducts: async () => {
    try {
      const response = await api.get('/api/products/featured');
      console.log('Raw API response for featured products:', response);
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
      console.log('Calling API endpoint:', endpoint);
      const response = await api.get(endpoint);
      console.log('Raw API response for product by ID:', response);
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
      console.log('Calling API endpoint:', endpoint);
      const response = await api.get(endpoint);
      console.log('Raw API response for categories:', response);
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
      console.log('Calling API endpoint:', endpoint);
      const response = await api.get(endpoint);
      console.log('Raw API response for category by slug:', response);
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
      console.log('Calling API endpoint:', endpoint);
      const response = await api.get(endpoint);
      console.log('Raw API response for search products:', response);
      return response;
    } catch (error) {
      console.error('Error in searchProducts:', error);
      throw error;
    }
  }
};

export default productService; 