import secureApi from './api';
import authService from './authService';

// Cart Service - Handles shopping cart operations
const cartService = {
  // Get current user's cart
  getCart: async () => {
    try {
      // For authenticated users, get cart from API
      if (authService.isAuthenticated()) {
        return await secureApi.get('/api/cart');
      } else {
        // For guests, get cart from localStorage
        const cartItems = localStorage.getItem('cart');
        return cartItems ? JSON.parse(cartItems) : { items: [] };
      }
    } catch (error) {
      throw error;
    }
  },
  
  // Add item to cart
  addToCart: async (productId, quantity = 1) => {
    try {
      // For authenticated users, use API
      if (authService.isAuthenticated()) {
        return await secureApi.post('/api/cart/items', { productId, quantity });
      } else {
        // For guests, store in localStorage
        const cart = await cartService.getCart();
        const items = cart.items || [];
        
        // Check if item already exists
        const existingItemIndex = items.findIndex(item => item.productId === productId);
        
        if (existingItemIndex !== -1) {
          // Update quantity if item exists
          items[existingItemIndex].quantity += quantity;
        } else {
          // Add new item
          items.push({ productId, quantity });
        }
        
        localStorage.setItem('cart', JSON.stringify({ items }));
        return { items };
      }
    } catch (error) {
      throw error;
    }
  },
  
  // Update item quantity
  updateCartItem: async (productId, quantity) => {
    try {
      // For authenticated users, use API
      if (authService.isAuthenticated()) {
        return await secureApi.put(`/api/cart/items/${productId}`, { quantity });
      } else {
        // For guests, update localStorage
        const cart = await cartService.getCart();
        const items = cart.items || [];
        
        // Find the item
        const existingItemIndex = items.findIndex(item => item.productId === productId);
        
        if (existingItemIndex !== -1) {
          // Update quantity
          items[existingItemIndex].quantity = quantity;
          
          // Remove item if quantity is 0
          if (quantity <= 0) {
            items.splice(existingItemIndex, 1);
          }
          
          localStorage.setItem('cart', JSON.stringify({ items }));
          return { items };
        }
        
        return cart; // Return unchanged cart if item not found
      }
    } catch (error) {
      throw error;
    }
  },
  
  // Remove item from cart
  removeFromCart: async (productId) => {
    try {
      // For authenticated users, use API
      if (authService.isAuthenticated()) {
        return await secureApi.delete(`/api/cart/items/${productId}`);
      } else {
        // For guests, update localStorage
        const cart = await cartService.getCart();
        const items = cart.items.filter(item => item.productId !== productId);
        
        localStorage.setItem('cart', JSON.stringify({ items }));
        return { items };
      }
    } catch (error) {
      throw error;
    }
  },
  
  // Clear entire cart
  clearCart: async () => {
    try {
      // For authenticated users, use API
      if (authService.isAuthenticated()) {
        return await secureApi.delete('/api/cart');
      } else {
        // For guests, clear localStorage
        localStorage.setItem('cart', JSON.stringify({ items: [] }));
        return { items: [] };
      }
    } catch (error) {
      throw error;
    }
  },
  
  // Merge guest cart with user cart after login
  mergeCart: async () => {
    try {
      if (authService.isAuthenticated()) {
        const guestCart = localStorage.getItem('cart');
        
        if (guestCart) {
          const { items } = JSON.parse(guestCart);
          
          // Only proceed if there are items to merge
          if (items && items.length > 0) {
            // Send items to backend for merging
            await secureApi.post('/api/cart/merge', { items });
            
            // Clear guest cart from localStorage
            localStorage.removeItem('cart');
          }
        }
      }
    } catch (error) {
      throw error;
    }
  }
};

export default cartService; 