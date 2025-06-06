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
  getAllProducts: async (page = 1, pageSize = 100) => {
    try {
      // Only use the admin endpoint to get ALL products including those not connected to the shop
      return await api.get(`/api/admin/products?page=${page}&pageSize=${pageSize}`);
    } catch (error) {
      console.error('Error fetching admin products:', error);
      throw error;
    }
  },
  
  createProduct: async (productData) => {
    try {
      console.log('Creating product with data:', JSON.stringify(productData, null, 2));
      const response = await api.post('/api/admin/products', productData);
      console.log('Product creation API response:', response);
      return response;
    } catch (error) {
      console.error('Product creation error:', error);
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