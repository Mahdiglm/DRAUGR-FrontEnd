import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ProductCard from './ProductCard';

const FeaturedProductSlider = ({ products, onAddToCart }) => {
  const [activePair, setActivePair] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const timerRef = useRef(null);
  const [isHovering, setIsHovering] = useState(false);
  
  // Check if we're on mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile(); // Initial check
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Only show 4 products max
  const displayProducts = products?.length > 4 ? products.slice(0, 4) : products;
  
  // Define product pairs (2 products per pair)
  const pairs = displayProducts && displayProducts.length >= 2 
    ? [
        [displayProducts[0], displayProducts[1]],
        [displayProducts[2] || displayProducts[0], displayProducts[3] || displayProducts[1]]
      ]
    : [];

  // Auto transition between pairs
  useEffect(() => {
    if (pairs.length <= 1 || isHovering) return;
    
    const autoRotate = () => {
      setActivePair(prev => (prev === 0 ? 1 : 0));
    };
    
    timerRef.current = setInterval(autoRotate, 5000);
    
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [pairs.length, isHovering]);

  // Pause auto-scroll on hover
  const handleMouseEnter = () => setIsHovering(true);
  const handleMouseLeave = () => setIsHovering(false);
  
  // Toggle between pairs manually
  const togglePair = () => {
    setActivePair(prev => (prev === 0 ? 1 : 0));
    
    // Reset timer
    if (timerRef.current) {
      clearInterval(timerRef.current);
      
      if (!isHovering) {
        timerRef.current = setInterval(() => {
          setActivePair(prev => (prev === 0 ? 1 : 0));
        }, 5000);
      }
    }
  };

  if (!products || products.length === 0 || pairs.length === 0) {
    return <div className="text-center py-8">محصولی برای نمایش وجود ندارد</div>;
  }

  // Get the active and inactive pairs
  const activePairProducts = pairs[activePair];
  const inactivePairProducts = pairs[activePair === 0 ? 1 : 0];

  return (
    <div 
      className="relative w-full py-8 md:py-16 overflow-hidden"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Section Header */}
      <div className="relative z-10 mb-8 flex items-center justify-between">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-gray-100 
                      border-b-2 border-draugr-500 inline-block pb-1">
          محصولات ویژه
        </h2>
        
        {/* Manual Navigation Control */}
        <motion.button
          onClick={togglePair}
          className="px-4 py-2 text-sm bg-transparent border border-gray-300 dark:border-gray-700 
                   text-gray-700 dark:text-gray-300 rounded-full hover:border-draugr-500 
                   hover:text-draugr-500 dark:hover:text-draugr-400 transition-all duration-300"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.98 }}
        >
          مشاهده بیشتر
        </motion.button>
      </div>

      {/* Main Slider Container */}
      <div className="relative min-h-[450px] md:min-h-[500px] w-full">
        {/* Subtle Background Gradient */}
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-transparent via-gray-50/30 dark:via-gray-900/30 to-transparent rounded-xl"></div>
        
        {/* Progress Dots */}
        <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 z-30 flex space-x-2">
          <motion.div 
            className={`w-2 h-2 rounded-full bg-draugr-500 transition-all duration-300`}
            animate={{ 
              scale: activePair === 0 ? 1.2 : 0.8,
              opacity: activePair === 0 ? 1 : 0.5
            }}
          />
          <motion.div 
            className={`w-2 h-2 rounded-full bg-draugr-500 transition-all duration-300`}
            animate={{ 
              scale: activePair === 1 ? 1.2 : 0.8,
              opacity: activePair === 1 ? 1 : 0.5
            }}
          />
        </div>
        
        {/* Inactive (Background) Products - Blurred and Dimmed */}
        <div className="absolute inset-0 flex justify-center items-center">
          {inactivePairProducts.map((product, index) => (
            <motion.div
              key={`inactive-${product.id}`}
              className={`absolute ${isMobile ? 'w-3/4' : 'w-1/3'} max-w-sm px-2 z-0
                        ${index === 0 ? '-translate-x-8 md:-translate-x-12' : 'translate-x-8 md:translate-x-12'}`}
              initial={false}
              animate={{
                filter: 'blur(3px)',
                opacity: 0.6,
                scale: 0.85,
                y: 20,
                transition: { duration: 0.8, ease: 'easeInOut' }
              }}
            >
              <div className="grayscale-[30%]">
                <ProductCard product={product} onAddToCart={null} isHighlighted={false} />
              </div>
            </motion.div>
          ))}
        </div>
        
        {/* Active (Foreground) Products - Sharp and Prominent */}
        <div className="absolute inset-0 flex justify-center items-center">
          {activePairProducts.map((product, index) => (
            <motion.div
              key={`active-${product.id}`}
              className={`relative ${isMobile ? 'w-4/5' : 'w-2/5'} max-w-sm px-3 z-10
                        ${index === 0 ? '-translate-x-6 md:-translate-x-8' : 'translate-x-6 md:translate-x-8'}`}
              initial={{ 
                opacity: 0, 
                scale: 0.9, 
                y: 15 
              }}
              animate={{ 
                opacity: 1, 
                scale: 1, 
                y: 0,
                filter: 'blur(0px)',
                transition: { 
                  duration: 0.8, 
                  ease: 'easeOut',
                  scale: {
                    type: 'spring',
                    stiffness: 300,
                    damping: 20
                  }
                }
              }}
            >
              <div className="transform transition-all duration-500 hover:-translate-y-2">
                <ProductCard 
                  product={product} 
                  onAddToCart={onAddToCart} 
                  isHighlighted={true} 
                />
                
                {/* Elegant Spotlight Effect */}
                <motion.div 
                  className="absolute inset-0 rounded-xl bg-white dark:bg-draugr-900 -z-10"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.03 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.8 }}
                />
                
                {/* Subtle Radial Gradient for Depth */}
                <div className="absolute inset-0 -z-20 bg-radial-gradient rounded-xl opacity-40"></div>
              </div>
            </motion.div>
          ))}
        </div>
        
        {/* Mobile Navigation Hint */}
        {isMobile && (
          <motion.div 
            className="absolute bottom-10 left-1/2 transform -translate-x-1/2 text-xs text-gray-500
                      flex items-center space-x-1"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.7 }}
            transition={{ delay: 2, duration: 1 }}
          >
            <span>برای تغییر ضربه بزنید</span>
          </motion.div>
        )}
      </div>
      
      {/* Custom Mobile Touch Area */}
      {isMobile && (
        <motion.button 
          className="absolute inset-0 z-20 w-full h-full cursor-pointer bg-transparent"
          onClick={togglePair}
          whileTap={{ scale: 0.98 }}
        />
      )}
      
      {/* Progress Bar */}
      <div className="w-full mt-6 h-0.5 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
        <motion.div 
          className="h-full bg-draugr-500"
          initial={{ width: 0 }}
          animate={{
            width: activePair === 0 ? '50%' : '100%',
            transition: { duration: 5, ease: "linear" }
          }}
          key={activePair} // Reset animation when active pair changes
        />
      </div>
    </div>
  );
};

export default FeaturedProductSlider; 