import { api } from './api';

// Admin Service - Handles admin operations
const adminService = {
  // Dashboard data
  getDashboardData: async () => {
    try {
      return await api.get('/api/admin/dashboard');
    } catch (error) {
      throw error;
    }
  },
  
  // Users
  getUsers: async () => {
    try {
      return await api.get('/api/admin/users');
    } catch (error) {
      throw error;
    }
  },
  
  getUserDetails: async (userId) => {
    try {
      return await api.get(`/api/admin/users/${userId}`);
    } catch (error) {
      throw error;
    }
  },
  
  updateUser: async (userId, userData) => {
    try {
      return await api.put(`/api/admin/users/${userId}`, userData);
    } catch (error) {
      throw error;
    }
  },
  
  deleteUser: async (userId) => {
    try {
      return await api.delete(`/api/admin/users/${userId}`);
    } catch (error) {
      throw error;
    }
  },
  
  // Blog posts
  getBlogs: async () => {
    try {
      return await api.get('/api/blogs');
    } catch (error) {
      throw error;
    }
  },
  
  createBlog: async (blogData) => {
    try {
      return await api.post('/api/admin/blogs', blogData);
    } catch (error) {
      throw error;
    }
  },
  
  updateBlog: async (blogId, blogData) => {
    try {
      return await api.put(`/api/admin/blogs/${blogId}`, blogData);
    } catch (error) {
      throw error;
    }
  },
  
  deleteBlog: async (blogId) => {
    try {
      return await api.delete(`/api/admin/blogs/${blogId}`);
    } catch (error) {
      throw error;
    }
  },
  
  // Orders
  getAllOrders: async (page = 1, pageSize = 10) => {
    try {
      return await api.get(`/api/admin/orders?page=${page}&pageSize=${pageSize}`);
    } catch (error) {
      throw error;
    }
  },
  
  updateOrderStatus: async (orderId, status) => {
    try {
      return await api.put(`/api/admin/orders/${orderId}/status`, { status });
    } catch (error) {
      throw error;
    }
  },
  
  // Products
  getAllProducts: async (page = 1, pageSize = 10) => {
    try {
      return await api.get(`/api/admin/products?page=${page}&pageSize=${pageSize}`);
    } catch (error) {
      throw error;
    }
  },
  
  createProduct: async (productData) => {
    try {
      return await api.post('/api/admin/products', productData);
    } catch (error) {
      throw error;
    }
  },
  
  updateProduct: async (productId, productData) => {
    try {
      return await api.put(`/api/admin/products/${productId}`, productData);
    } catch (error) {
      throw error;
    }
  },
  
  deleteProduct: async (productId) => {
    try {
      return await api.delete(`/api/admin/products/${productId}`);
    } catch (error) {
      throw error;
    }
  }
};

export default adminService; 