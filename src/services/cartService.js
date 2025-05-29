import { api } from './api';
import authService from './authService';

// Helper function to ensure productId is a primitive value (string or number)
const normalizeProductId = (productId) => {
  if (typeof productId === 'object') {
    // Try to get the id from the object
    return productId.id || productId._id || null;
  }
  return productId;
};

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
      // Ensure productId is a primitive value
      const normalizedId = normalizeProductId(productId);
      if (!normalizedId) {
        throw new Error('Invalid product ID');
      }
      
      // For authenticated users, use API
      if (authService.isAuthenticated()) {
        return await api.post('/api/cart/items', { productId: normalizedId, quantity });
      } else {
        // For guests, store in localStorage
        const cart = getLocalCart();
        const items = cart.items || [];
        
        // Check if item already exists
        const existingItemIndex = items.findIndex(item => {
          const itemId = normalizeProductId(item.productId);
          return itemId === normalizedId;
        });
        
        if (existingItemIndex !== -1) {
          // Update quantity if item exists
          items[existingItemIndex].quantity += quantity;
          items[existingItemIndex].productId = normalizedId; // Ensure clean ID
        } else {
          // Add new item
          items.push({ productId: normalizedId, quantity });
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
      // Ensure productId is a primitive value
      const normalizedId = normalizeProductId(productId);
      if (!normalizedId) {
        throw new Error('Invalid product ID');
      }
      
      // For authenticated users, use API
      if (authService.isAuthenticated()) {
        return await api.put(`/api/cart/items/${normalizedId}`, { quantity });
      } else {
        // For guests, update localStorage
        const cart = getLocalCart();
        const items = cart.items || [];
        
        // Find the item
        const existingItemIndex = items.findIndex(item => {
          const itemId = normalizeProductId(item.productId);
          return itemId === normalizedId;
        });
        
        if (existingItemIndex !== -1) {
          // Update quantity
          items[existingItemIndex].quantity = quantity;
          items[existingItemIndex].productId = normalizedId; // Ensure clean ID
          
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
      // Ensure productId is a primitive value
      const normalizedId = normalizeProductId(productId);
      if (!normalizedId) {
        throw new Error('Invalid product ID');
      }
      
      // For authenticated users, use API
      if (authService.isAuthenticated()) {
        return await api.delete(`/api/cart/items/${normalizedId}`);
      } else {
        // For guests, update localStorage
        const cart = getLocalCart();
        const items = cart.items.filter(item => {
          const itemId = normalizeProductId(item.productId);
          return itemId !== normalizedId;
        });
        
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
            // Clean up product IDs before sending to backend
            const cleanItems = guestCart.items.map(item => ({
              productId: normalizeProductId(item.productId),
              quantity: item.quantity
            })).filter(item => item.productId);
            
            // Send items to backend for merging
            await api.post('/api/cart/merge', { items: cleanItems });
            
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
    
    const cart = JSON.parse(cartItems);
    
    // Clean up product IDs in the loaded cart
    if (cart.items && Array.isArray(cart.items)) {
      cart.items = cart.items.map(item => ({
        productId: normalizeProductId(item.productId),
        quantity: item.quantity
      })).filter(item => item.productId);
    } else {
      cart.items = [];
    }
    
    return cart;
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
    // Ensure all product IDs are normalized before saving
    if (cart.items && Array.isArray(cart.items)) {
      cart.items = cart.items.map(item => ({
        productId: normalizeProductId(item.productId),
        quantity: item.quantity
      })).filter(item => item.productId);
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
  } catch (error) {
    console.error('Error saving cart to localStorage:', error);
  }
};

export default cartService; 