import secureApi from './api';

// Order Service - Handles order operations
const orderService = {
  // Get all orders for current user
  getOrders: async () => {
    try {
      return await secureApi.get('/api/orders/user');
    } catch (error) {
      throw error;
    }
  },
  
  // Get order by ID
  getOrder: async (orderId) => {
    try {
      return await secureApi.get(`/api/orders/${orderId}`);
    } catch (error) {
      throw error;
    }
  },
  
  // Create a new order
  createOrder: async (orderData) => {
    try {
      return await api.post('/api/orders', orderData);
    } catch (error) {
      throw error;
    }
  },
  
  // Cancel an order
  cancelOrder: async (orderId) => {
    try {
      return await api.put(`/api/orders/${orderId}/cancel`);
    } catch (error) {
      throw error;
    }
  }
};

export default orderService; 