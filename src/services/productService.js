import { api } from './api';

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
      
      return await api.get(endpoint);
    } catch (error) {
      throw error;
    }
  },
  
  // Get featured products
  getFeaturedProducts: async () => {
    try {
      return await api.get('/api/products/featured');
    } catch (error) {
      throw error;
    }
  },
  
  // Get a single product by ID
  getProductById: async (id) => {
    try {
      return await api.get(`/api/products/${id}`);
    } catch (error) {
      throw error;
    }
  },
  
  // Get all categories
  getCategories: async () => {
    try {
      return await api.get('/api/categories');
    } catch (error) {
      throw error;
    }
  },
  
  // Get a single category by slug
  getCategoryBySlug: async (slug) => {
    try {
      return await api.get(`/api/categories/${slug}`);
    } catch (error) {
      throw error;
    }
  },
  
  // Search products
  searchProducts: async (query) => {
    try {
      return await api.get(`/api/products/search?q=${encodeURIComponent(query)}`);
    } catch (error) {
      throw error;
    }
  }
};

export default productService; 