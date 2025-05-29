import { api } from './api';
import authService from './authService';

// Cart Service - Handles shopping cart operations
const cartService = {
  // Get current user's cart
  getCart: async () => {
    try {
      // For authenticated users, get cart from API
      if (authService.isAuthenticated()) {
        try {
          return await api.get('/api/cart');
        } catch (apiError) {
          // If authentication fails, fall back to local cart
          if (apiError.message === 'Unauthorized') {
            // Clear invalid token
            authService.logout();
            // Return local cart
            return getLocalCart();
          }
          throw apiError;
        }
      } else {
        // For guests, get cart from localStorage
        return getLocalCart();
      }
    } catch (error) {
      console.error('Error in getCart:', error);
      // Fallback to empty cart on any error
      return { items: [] };
    }
  },
  
  // Add item to cart
  addToCart: async (productId, quantity = 1) => {
    try {
      // For authenticated users, use API
      if (authService.isAuthenticated()) {
        return await api.post('/api/cart/items', { productId, quantity });
      } else {
        // For guests, store in localStorage
        const cart = getLocalCart();
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
        
        const updatedCart = { items };
        saveLocalCart(updatedCart);
        return updatedCart;
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
        return await api.put(`/api/cart/items/${productId}`, { quantity });
      } else {
        // For guests, update localStorage
        const cart = getLocalCart();
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
          
          const updatedCart = { items };
          saveLocalCart(updatedCart);
          return updatedCart;
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
        return await api.delete(`/api/cart/items/${productId}`);
      } else {
        // For guests, update localStorage
        const cart = getLocalCart();
        const items = cart.items.filter(item => item.productId !== productId);
        
        const updatedCart = { items };
        saveLocalCart(updatedCart);
        return updatedCart;
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
        return await api.delete('/api/cart');
      } else {
        // For guests, clear localStorage
        const emptyCart = { items: [] };
        saveLocalCart(emptyCart);
        return emptyCart;
      }
    } catch (error) {
      throw error;
    }
  },
  
  // Merge guest cart with user cart after login
  mergeCart: async () => {
    try {
      if (authService.isAuthenticated()) {
        const guestCart = getLocalCart();
        
        // Only proceed if there are items to merge
        if (guestCart.items && guestCart.items.length > 0) {
          try {
            // Send items to backend for merging
            await api.post('/api/cart/merge', { items: guestCart.items });
            
            // Clear guest cart from localStorage
            saveLocalCart({ items: [] });
          } catch (error) {
            console.error('Error merging cart:', error);
            // If unauthorized, just clear the guest cart
            if (error.message === 'Unauthorized') {
              saveLocalCart({ items: [] });
              authService.logout();
            }
          }
        }
      }
    } catch (error) {
      console.error('Error in mergeCart:', error);
    }
  }
};

// Helper to safely get cart from localStorage
const getLocalCart = () => {
  try {
    const cartItems = localStorage.getItem('cart');
    if (!cartItems) return { items: [] };
    return JSON.parse(cartItems);
  } catch (error) {
    console.error('Error parsing cart from localStorage:', error);
    // Reset corrupted cart data
    localStorage.setItem('cart', JSON.stringify({ items: [] }));
    return { items: [] };
  }
};

// Helper to safely save cart to localStorage
const saveLocalCart = (cart) => {
  try {
    localStorage.setItem('cart', JSON.stringify(cart));
  } catch (error) {
    console.error('Error saving cart to localStorage:', error);
  }
};

export default cartService; 