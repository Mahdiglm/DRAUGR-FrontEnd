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

  const removeFromCart = (productId, removeCompletely = false) => {
    const product = cartItems.find(item => item.id === productId);
    
    if (product && product.quantity > 1 && !removeCompletely) {
      // If quantity > 1, just decrement the quantity (unless removeCompletely flag is true)
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

      {/* Floating Message - Moved to right side and made responsive */}
      <AnimatePresence>
        {showMessage && (
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
            className="fixed top-20 sm:top-24 right-4 sm:right-6 max-w-[calc(100vw-32px)] sm:max-w-xs z-50"
          >
            <div className="bg-draugr-800 text-white text-xs sm:text-sm px-3 sm:px-4 py-2 sm:py-3 rounded-lg shadow-horror flex items-center">
              <div className="mr-2 flex-shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <span className="line-clamp-2">{message}</span>
            </div>
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