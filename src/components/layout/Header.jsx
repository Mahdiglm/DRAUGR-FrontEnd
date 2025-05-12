import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Header = ({ cartItems, onCartClick }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [typedText, setTypedText] = useState("");
  const [isTyping, setIsTyping] = useState(true);
  const brandName = "DRAUGR";

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Typing animation effect
  useEffect(() => {
    if (isTyping) {
      if (typedText.length < brandName.length) {
        const timeout = setTimeout(() => {
          setTypedText(brandName.slice(0, typedText.length + 1));
        }, 200);
        return () => clearTimeout(timeout);
      } else {
        // Wait and then clear the text to restart
        const timeout = setTimeout(() => {
          setIsTyping(false);
        }, 3000);
        return () => clearTimeout(timeout);
      }
    } else {
      // Reset after a delay
      const timeout = setTimeout(() => {
        setTypedText("");
        setIsTyping(true);
      }, 1000);
      return () => clearTimeout(timeout);
    }
  }, [typedText, isTyping]);

  // Add scroll effect
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Blood drop animation for logo
  const bloodDropVariants = {
    initial: { y: -5, opacity: 0 },
    animate: { 
      y: 15, 
      opacity: [0, 1, 1, 0],
      transition: { 
        duration: 2,
        repeat: Infinity,
        repeatDelay: 4,
        ease: "easeInOut" 
      }
    }
  };

  return (
    <motion.header 
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`bg-black text-white py-4 sticky top-0 z-50 w-full transition-all duration-300 ${
        isScrolled ? 'shadow-[0_0_15px_rgba(255,0,0,0.3)]' : ''
      }`}
    >
      <div className="w-full max-w-7xl mx-auto px-4 flex justify-between items-center">
        <motion.div 
          whileHover={{ scale: 1.05 }}
          className="text-xl md:text-2xl font-bold flex items-center relative"
        >
          <div className="relative">
            <motion.span
              className="text-draugr-500 text-shadow-horror mr-2 hidden sm:inline"
              animate={{ scale: [1, 1.2, 1], rotate: [0, 5, 0, -5, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
            >
              🩸
            </motion.span>
            <motion.span
              variants={bloodDropVariants}
              initial="initial"
              animate="animate"
              className="absolute top-6 sm:left-3 left-0 w-1 h-2 bg-draugr-500 rounded-b-full"
            />
          </div>
          <span className="blood-text animate-pulse-slow relative overflow-hidden">
            <span className="inline-block">{typedText}</span>
            <span className={`inline-block w-0.5 h-6 bg-draugr-500 absolute ml-1 ${isTyping ? 'animate-pulse' : 'opacity-0'}`}></span>
          </span>
          <span className="mr-1"> فروشگاه</span>
        </motion.div>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex space-x-8">
          <NavLink href="#" label="خانه" />
          <NavLink href="#" label="محصولات" />
          <NavLink href="#" label="دسته‌بندی‌ها" />
          <NavLink href="#" label="درباره ما" />
        </nav>
        
        <div className="flex items-center space-x-3 md:space-x-4">
          <motion.button 
            whileHover={{ 
              scale: 1.05, 
              boxShadow: '0 0 12px rgba(255, 0, 0, 0.7)',
              textShadow: '0 0 8px rgba(255, 255, 255, 0.8)'
            }}
            whileTap={{ scale: 0.95 }}
            className="hidden sm:block bg-gradient-to-r from-draugr-900 to-draugr-700 text-white px-4 py-2 rounded-md font-medium border border-draugr-600 hover:border-draugr-500 text-sm ml-3 md:ml-4 transition-all duration-300"
          >
            ورود
          </motion.button>

          <motion.div 
            whileHover={{ scale: 1.1, rotate: [0, -5, 5, 0] }}
            transition={{ rotate: { duration: 0.5 } }}
            whileTap={{ scale: 0.95 }}
            className="relative cursor-pointer"
            onClick={onCartClick}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            {cartItems.length > 0 && (
              <motion.span 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-2 -right-2 bg-draugr-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
              >
                {cartItems.length}
              </motion.span>
            )}
          </motion.div>
          
          {/* Mobile Menu Button */}
          <motion.button 
            className="md:hidden text-white"
            onClick={toggleMobileMenu}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-6 w-6" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              {isMobileMenuOpen ? (
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M6 18L18 6M6 6l12 12" 
                />
              ) : (
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M4 6h16M4 12h16M4 18h16" 
                />
              )}
            </svg>
          </motion.button>
        </div>
      </div>
      
      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-charcoal overflow-hidden w-full border-t border-draugr-900"
          >
            <div className="w-full max-w-7xl mx-auto px-4 py-3">
              <motion.nav 
                className="flex flex-col space-y-3"
                variants={{
                  hidden: { opacity: 0 },
                  show: {
                    opacity: 1,
                    transition: {
                      staggerChildren: 0.1
                    }
                  }
                }}
                initial="hidden"
                animate="show"
              >
                <MobileNavLink href="#" label="خانه" />
                <MobileNavLink href="#" label="محصولات" />
                <MobileNavLink href="#" label="دسته‌بندی‌ها" />
                <MobileNavLink href="#" label="درباره ما" />
                <motion.button 
                  whileHover={{ scale: 1.02, backgroundColor: "#660000" }}
                  whileTap={{ scale: 0.98 }}
                  className="sm:hidden bg-gradient-to-r from-draugr-900 to-draugr-700 text-white px-4 py-2 rounded-md font-medium border border-draugr-600 text-sm self-start mt-2"
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    show: { opacity: 1, y: 0 }
                  }}
                >
                  ورود
                </motion.button>
              </motion.nav>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

// Desktop nav link component with enhanced hover effect
const NavLink = ({ href, label }) => (
  <motion.a 
    href={href} 
    className="hover:text-draugr-500 ml-8 relative group"
    whileHover={{ y: -2 }}
  >
    {label}
    <motion.span 
      className="absolute -bottom-1 left-0 w-0 h-0.5 bg-draugr-500 transition-all duration-300 group-hover:w-full"
      whileHover={{ width: "100%" }}
    ></motion.span>
  </motion.a>
);

// Mobile nav link with animation
const MobileNavLink = ({ href, label }) => (
  <motion.a 
    href={href} 
    className="py-2 hover:text-draugr-500 transform transition-all duration-300"
    variants={{
      hidden: { opacity: 0, x: -20 },
      show: { opacity: 1, x: 0 }
    }}
    whileHover={{ x: 5, color: "#ff0000" }}
  >
    {label}
  </motion.a>
);

export default Header; 