import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';

import Header from './Header';
import Footer from './Footer';
import Cart from '../cart/Cart';
import DevTools from '../shared/DevTools';

const MainLayout = () => {
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const [message, setMessage] = useState('');

  // Expose these functions through React Context in a real app
  const addToCart = (product) => {
    setCartItems([...cartItems, product]);
    showTemporaryMessage(`${product.name} به سبد خرید اضافه شد`);
  };

  const removeFromCart = (productId) => {
    const product = cartItems.find(item => item.id === productId);
    setCartItems(cartItems.filter(item => item.id !== productId));
    if (product) {
      showTemporaryMessage(`${product.name} از سبد خرید حذف شد`);
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
      <Header cartItems={cartItems} onCartClick={toggleCart} />
      
      <Cart 
        items={cartItems} 
        removeItem={removeFromCart} 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
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
      <Outlet context={{ addToCart, cartItems, showTemporaryMessage }} />
      
      <Footer />
      
      {/* Development Tools */}
      <DevTools />
    </div>
  );
};

export default MainLayout;