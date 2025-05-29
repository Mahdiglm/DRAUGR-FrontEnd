import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';

import Header from './Header';
import Footer from './Footer';
import Cart from '../cart/Cart';
import DevTools from '../shared/DevTools';
import ScrollToTop from '../shared/ScrollToTop';
import { useCart } from '../../contexts/CartContext';

const MainLayout = () => {
  const { 
    cartProducts, 
    isCartOpen, 
    toggleCart, 
    addToCart,
    removeFromCart,
    updateCartItem
  } = useCart();
  
  const [showMessage, setShowMessage] = useState(false);
  const [message, setMessage] = useState('');

  // Helper to show temporary messages
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

  return (
    <div className="w-full font-vazirmatn bg-midnight dark">
      <ScrollToTop />
      <Header cartItems={cartProducts} onCartClick={toggleCart} />
      
      <Cart 
        items={cartProducts} 
        removeItem={removeFromCart} 
        isOpen={isCartOpen} 
        onClose={() => toggleCart()} 
        addToCartPlus={(product) => updateCartItem(product.id, product.quantity + 1)}
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
      <Outlet context={{ addToCart, showTemporaryMessage }} />
      <Footer />
      </main>
      
      {/* Development Tools */}
      <DevTools />
    </div>
  );
};

export default MainLayout;