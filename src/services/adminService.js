import secureApi from './api';

// Admin Service - Handles admin operations
const adminService = {
  // Dashboard data
  getDashboardData: async () => {
    try {
      return await secureApi.get('/api/admin/dashboard');
    } catch (error) {
      throw error;
    }
  },
  
  // Users
  getUsers: async () => {
    try {
      return await secureApi.get('/api/admin/users');
    } catch (error) {
      throw error;
    }
  },
  
  getUserDetails: async (userId) => {
    try {
      return await secureApi.get(`/api/admin/users/${userId}`);
    } catch (error) {
      throw error;
    }
  },
  
  updateUser: async (userId, userData) => {
    try {
      return await secureApi.put(`/api/admin/users/${userId}`, userData);
    } catch (error) {
      throw error;
    }
  },
  
  deleteUser: async (userId) => {
    try {
      return await secureApi.delete(`/api/admin/users/${userId}`);
    } catch (error) {
      throw error;
    }
  },
  
  // Blog posts
  getBlogs: async () => {
    try {
      return await secureApi.get('/api/blogs');
    } catch (error) {
      throw error;
    }
  },
  
  createBlog: async (blogData) => {
    try {
      return await secureApi.post('/api/admin/blogs', blogData);
    } catch (error) {
      throw error;
    }
  },
  
  updateBlog: async (blogId, blogData) => {
    try {
      return await secureApi.put(`/api/admin/blogs/${blogId}`, blogData);
    } catch (error) {
      throw error;
    }
  },
  
  deleteBlog: async (blogId) => {
    try {
      return await secureApi.delete(`/api/admin/blogs/${blogId}`);
    } catch (error) {
      throw error;
    }
  },
  
  // Orders
  getAllOrders: async (page = 1, pageSize = 10) => {
    try {
      return await secureApi.get(`/api/admin/orders?page=${page}&pageSize=${pageSize}`);
    } catch (error) {
      throw error;
    }
  },
  
  updateOrderStatus: async (orderId, status) => {
    try {
      return await secureApi.put(`/api/admin/orders/${orderId}/status`, { status });
    } catch (error) {
      throw error;
    }
  },
  
  // Products
  getAllProducts: async (page = 1, pageSize = 100) => {
    try {
      // Only use the admin endpoint to get ALL products including those not connected to the shop
      return await secureApi.get(`/api/admin/products?page=${page}&pageSize=${pageSize}`);
    } catch (error) {
      console.error('Error fetching admin products:', error);
      throw error;
    }
  },
  
  createProduct: async (productData) => {
    try {
      const response = await secureApi.post('/api/admin/products', productData);
      return response;
    } catch (error) {
      console.error('Product creation error:', error);
      throw error;
    }
  },
  
  updateProduct: async (productId, productData) => {
    try {
      return await secureApi.put(`/api/admin/products/${productId}`, productData);
    } catch (error) {
      throw error;
    }
  },
  
  deleteProduct: async (productId) => {
    try {
      return await secureApi.delete(`/api/admin/products/${productId}`);
    } catch (error) {
      throw error;
    }
  }
};

export default adminService; 