import React, { createContext, useState, useContext, useEffect } from 'react';
import cartService from '../services/cartService';
import productService from '../services/productService';

// Create Cart Context
const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState({ items: [] });
  const [cartProducts, setCartProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Load cart on initial render
  useEffect(() => {
    const loadCart = async () => {
      setLoading(true);
      try {
        const cartData = await cartService.getCart();
        setCart(cartData);
      } catch (err) {
        // Only log cart errors once to avoid spam
        if (!window.cartErrorLogged) {
          console.error('Cart service unavailable, using local storage');
          window.cartErrorLogged = true;
        }
        setError('Failed to load cart');
      } finally {
        setLoading(false);
      }
    };
    
    loadCart();
  }, []);

  // Load product details whenever cart items change
  useEffect(() => {
    const loadCartProducts = async () => {
      if (!cart.items || cart.items.length === 0) {
        setCartProducts([]);
        return;
      }

      try {
        const productPromises = cart.items.map(async (item) => {
          try {
            // Handle different data structures from backend vs localStorage
            const productId = item.productId || item.id;
            const quantity = item.qty || item.quantity || 1;
            
            // If we already have product details in the cart item (from backend)
            if (item.name && item.price) {
              return {
                id: productId,
                _id: productId,
                name: item.name,
                price: item.price,
                imageUrl: item.image,
                images: item.image ? [{ url: item.image }] : [],
                quantity: quantity,
              };
            }
            
            // Otherwise fetch product details from API
            const product = await productService.getProductById(productId);
            return {
              ...product,
              quantity: quantity,
            };
          } catch (err) {
            console.error(`Error loading product ${item.productId || item.id}:`, err);
            return null;
          }
        });

        const products = await Promise.all(productPromises);
        // Filter out any null products (failed to load)
        setCartProducts(products.filter(p => p !== null));
      } catch (err) {
        console.error('Error loading cart products:', err);
        setError('Failed to load cart products');
      }
    };

    loadCartProducts();
  }, [cart.items]);

  // Add to cart
  const addToCart = async (productOrId, quantity = 1) => {
    setLoading(true);
    try {
      // Handle both product objects and product IDs
      let productId;
      if (typeof productOrId === 'object' && productOrId !== null) {
        // If it's a product object, extract the ID
        productId = productOrId._id || productOrId.id;
      } else {
        // If it's already an ID
        productId = productOrId;
      }
      
      if (!productId) {
        throw new Error('Product ID is required');
      }
      
      const updatedCart = await cartService.addToCart(productId, quantity);
      setCart(updatedCart);
      return updatedCart;
    } catch (err) {
      console.error('Failed to add to cart:', err);
      setError('Failed to add item to cart');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Update cart item
  const updateCartItem = async (productOrId, quantity) => {
    setLoading(true);
    try {
      // Handle both product objects and product IDs
      let productId;
      if (typeof productOrId === 'object' && productOrId !== null) {
        // If it's a product object, extract the ID
        productId = productOrId._id || productOrId.id;
      } else {
        // If it's already an ID
        productId = productOrId;
      }
      
      if (!productId) {
        throw new Error('Product ID is required');
      }
      
      const updatedCart = await cartService.updateCartItem(productId, quantity);
      setCart(updatedCart);
      return updatedCart;
    } catch (err) {
      console.error('Failed to update cart item:', err);
      setError('Failed to update cart');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Remove from cart
  const removeFromCart = async (productOrId) => {
    setLoading(true);
    try {
      // Handle both product objects and product IDs
      let productId;
      if (typeof productOrId === 'object' && productOrId !== null) {
        // If it's a product object, extract the ID
        productId = productOrId._id || productOrId.id;
      } else {
        // If it's already an ID
        productId = productOrId;
      }
      
      if (!productId) {
        throw new Error('Product ID is required');
      }
      
      const updatedCart = await cartService.removeFromCart(productId);
      setCart(updatedCart);
      return updatedCart;
    } catch (err) {
      console.error('Failed to remove from cart:', err);
      setError('Failed to remove item from cart');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Clear cart
  const clearCart = async () => {
    setLoading(true);
    try {
      const emptyCart = await cartService.clearCart();
      setCart(emptyCart);
      return emptyCart;
    } catch (err) {
      console.error('Failed to clear cart:', err);
      setError('Failed to clear cart');
      throw err;
    } finally {
      setLoading(false);
    }
  };
  
  // Toggle cart visibility
  const toggleCart = () => {
    setIsCartOpen(!isCartOpen);
  };

  // Calculate cart totals
  const cartTotals = React.useMemo(() => {
    const subtotal = cartProducts.reduce((total, product) => {
      return total + (product.price * product.quantity);
    }, 0);
    
    const itemCount = cartProducts.reduce((count, product) => {
      return count + product.quantity;
    }, 0);
    
    // You can add tax, shipping, etc. calculations here
    const tax = subtotal * 0.09; // 9% tax rate
    const shipping = subtotal > 0 ? 15 : 0; // $15 shipping, free for empty cart
    const total = subtotal + tax + shipping;
    
    return {
      subtotal,
      tax,
      shipping,
      total,
      itemCount
    };
  }, [cartProducts]);

  // Context value
  const value = {
    cart,
    cartProducts,
    cartTotals,
    loading,
    error,
    isCartOpen,
    toggleCart,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

export default CartContext; 