import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';

import Header from './Header';
import Footer from './Footer';
import Cart from '../cart/Cart';
import DevTools from '../shared/DevTools';
import ScrollToTop from '../shared/ScrollToTop';

const MainLayout = () => {
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const [message, setMessage] = useState('');

  // Expose these functions through React Context in a real app
  const addToCart = (product) => {
    // Check if the product is already in the cart
    const existingItemIndex = cartItems.findIndex(item => item.id === product.id);
    
    if (existingItemIndex !== -1) {
      // If product already exists, increment its quantity
      const updatedCartItems = [...cartItems];
      if (!updatedCartItems[existingItemIndex].quantity) {
        updatedCartItems[existingItemIndex].quantity = 1; // Initialize quantity if it doesn't exist
      }
      
      // If product comes with quantity (from product detail page), add that amount
      const quantityToAdd = product.quantity || 1;
      updatedCartItems[existingItemIndex].quantity += quantityToAdd;
      
      setCartItems(updatedCartItems);
    } else {
      // If product doesn't exist, add it with quantity from product or default to 1
      const productWithQuantity = { 
        ...product, 
        quantity: product.quantity || 1
      };
      setCartItems([...cartItems, productWithQuantity]);
    }
    
    // No need to show message here since the product page already shows one
    if (!product.quantity) {
      showTemporaryMessage(`${product.name} به سبد خرید اضافه شد`);
    }
  };

  const removeFromCart = (productId) => {
    const product = cartItems.find(item => item.id === productId);
    
    if (product && product.quantity > 1) {
      // If quantity > 1, just decrement the quantity
      const updatedCartItems = cartItems.map(item => 
        item.id === productId 
          ? { ...item, quantity: item.quantity - 1 } 
          : item
      );
      setCartItems(updatedCartItems);
      showTemporaryMessage(`یک عدد از ${product.name} از سبد خرید کم شد`);
    } else {
      // Remove the item completely
    setCartItems(cartItems.filter(item => item.id !== productId));
    if (product) {
      showTemporaryMessage(`${product.name} از سبد خرید حذف شد`);
      }
    }
  };

  const toggleCart = () => {
    setIsCartOpen(!isCartOpen);
  };
  
  const showTemporaryMessage = (msg) => {
    setMessage(msg);
    setShowMessage(true);
    setTimeout(() => {
      setShowMessage(false);
    }, 3000);
  };

  // Apply theme class to body for consistency
  useEffect(() => {
    // Ensure only default theme class is applied
    document.body.classList.add('theme-draugr');
    
    // Clean up on unmount
    return () => {
      document.body.classList.remove('theme-draugr');
    };
  }, []);

  // Add effect to manage scroll behavior
  useEffect(() => {
    // Ensure pages always start at the top
    if (history.scrollRestoration) {
      history.scrollRestoration = 'manual';
    }
    
    // Force scroll to top on component mount
    window.scrollTo(0, 0);
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
    
    // Add event listener for page visibility change
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        window.scrollTo(0, 0);
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  // Audio effect on page load
  useEffect(() => {
    const playSpookySound = () => {
      const audio = new Audio();
      audio.src = "https://www.soundjay.com/human/sounds/heartbeat-01.mp3"; // Heartbeat sound URL
      audio.volume = 0.2;
      audio.play().catch(e => console.log("Auto-play prevented:", e));
      
      // Event listener for user interaction to play sound
      const handleInteraction = () => {
        audio.play().catch(e => console.log("Play prevented:", e));
        document.removeEventListener('click', handleInteraction);
      };
      
      document.addEventListener('click', handleInteraction);
      
      return () => {
        audio.pause();
        audio.src = "";
        document.removeEventListener('click', handleInteraction);
      };
    };
    
    const cleanup = playSpookySound();
    return cleanup;
  }, []);

  return (
    <div className="w-full font-vazirmatn bg-midnight dark">
      <ScrollToTop />
      <Header cartItems={cartItems} onCartClick={toggleCart} />
      
      <Cart 
        items={cartItems} 
        removeItem={removeFromCart} 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
        addToCartPlus={addToCart}
      />

      {/* Floating Message */}
      <AnimatePresence>
        {showMessage && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-20 right-1/2 transform translate-x-1/2 bg-draugr-800 text-white px-6 py-3 rounded-md z-50 shadow-horror"
          >
            {message}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="main-content">
        <Outlet context={{ addToCart, cartItems, showTemporaryMessage }} />
        <Footer />
      </main>
      
      {/* Development Tools */}
      <DevTools />
    </div>
  );
};

export default MainLayout;