import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ProductCard from './ProductCard';

const FeaturedProductSlider = ({ products, onAddToCart }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef(null);
  const containerRef = useRef(null);
  
  // Determine products per view based on screen size
  const getProductsPerView = () => {
    if (window.innerWidth < 640) return 1; // Mobile
    if (window.innerWidth < 1024) return 2; // Tablet
    return 3; // Desktop
  };
  
  // Create page groups
  const createPages = (items) => {
    if (!items || !items.length) return [];
    
    const productsPerView = getProductsPerView();
    const pages = [];
    
    for (let i = 0; i < items.length; i += productsPerView) {
      pages.push(items.slice(i, i + productsPerView));
    }
    
    return pages;
  };
  
  const [pages, setPages] = useState([]);
  
  // Check screen size and update views
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640);
      setPages(createPages(products));
    };
    
    handleResize(); // Initial check
    window.addEventListener('resize', handleResize);
    
    return () => window.removeEventListener('resize', handleResize);
  }, [products]);
  
  // Auto-rotation
  useEffect(() => {
    if (!pages.length || pages.length <= 1 || isPaused) return;
    
    timerRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % pages.length);
    }, 5000);
    
    return () => clearInterval(timerRef.current);
  }, [pages.length, isPaused]);
  
  // Go to specific slide
  const goToSlide = (index) => {
    clearInterval(timerRef.current);
    setCurrentIndex(index);
    
    if (!isPaused) {
      timerRef.current = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % pages.length);
      }, 5000);
    }
  };
  
  // Next/Prev handlers
  const handlePrev = () => {
    const newIndex = currentIndex === 0 ? pages.length - 1 : currentIndex - 1;
    goToSlide(newIndex);
  };
  
  const handleNext = () => {
    const newIndex = (currentIndex + 1) % pages.length;
    goToSlide(newIndex);
  };
  
  // Handle pause/play
  const togglePause = () => {
    setIsPaused(!isPaused);
  };
  
  // Swipe handlers for mobile
  const handleTouchStart = useRef({ x: 0 });
  const handleTouchMove = useRef({ x: 0 });
  
  const onTouchStart = (e) => {
    handleTouchStart.current.x = e.touches[0].clientX;
  };
  
  const onTouchMove = (e) => {
    handleTouchMove.current.x = e.touches[0].clientX;
  };
  
  const onTouchEnd = () => {
    const diff = handleTouchStart.current.x - handleTouchMove.current.x;
    const threshold = 50; // Minimum swipe distance
    
    if (Math.abs(diff) > threshold) {
      if (diff > 0) {
        // Swiped left, go to next
        handleNext();
      } else {
        // Swiped right, go to previous
        handlePrev();
      }
    }
  };
  
  // Render empty state
  if (!products || products.length === 0 || pages.length === 0) {
    return <div className="text-center py-8 text-gray-500">محصولی برای نمایش وجود ندارد</div>;
  }
  
  return (
    <div 
      ref={containerRef}
      className="relative py-8 md:py-12 overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Title with Norse-inspired styling */}
      <div className="mb-8 flex justify-between items-center">
        <h2 className="text-2xl md:text-3xl font-bold relative group overflow-hidden">
          <span className="relative z-10 bg-gradient-to-r from-gray-800 to-draugr-900 bg-clip-text text-transparent dark:from-gray-200 dark:to-draugr-200">
            محصولات ویژه
          </span>
          <motion.span 
            className="absolute bottom-0 left-0 h-0.5 bg-draugr-500 dark:bg-draugr-400" 
            initial={{ width: 0 }}
            animate={{ width: '100%' }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
          />
        </h2>
        
        {/* Controls for desktop */}
        {!isMobile && (
          <div className="flex items-center space-x-2 rtl:space-x-reverse">
            <motion.button
              className="p-2 rounded-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:text-draugr-500 dark:hover:text-draugr-400 transition focus:outline-none"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={handlePrev}
              aria-label="Previous slide"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </motion.button>
            <motion.button
              className="p-2 rounded-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:text-draugr-500 dark:hover:text-draugr-400 transition focus:outline-none"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={togglePause}
              aria-label={isPaused ? "Play slides" : "Pause slides"}
            >
              {isPaused ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              )}
            </motion.button>
            <motion.button
              className="p-2 rounded-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:text-draugr-500 dark:hover:text-draugr-400 transition focus:outline-none"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleNext}
              aria-label="Next slide"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            </motion.button>
          </div>
        )}
      </div>
      
      {/* Main slider container */}
      <div 
        className="relative overflow-hidden rounded-lg mx-auto"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        {/* Subtle pattern background with Norse-inspired design */}
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 opacity-75"></div>
        <div className="absolute inset-0 -z-10 opacity-5 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAzNGMwLTIuMiAxLjgtNCA0LTRzNCAxLjggNCA0LTEuOCA0LTQgNC00LTEuOC00LTRNMjAgMzRjMC0yLjIgMS44LTQgNC00czQgMS44IDQgNC0xLjggNC00IDQtNC0xLjgtNC00TTM2IDE4YzAtMi4yIDEuOC00IDQtNHM0IDEuOCA0IDQtMS44IDQtNCA0LTQtMS44LTQtNCIgc3Ryb2tlPSIjMzMzIiBzdHJva2Utd2lkdGg9IjIiLz48cGF0aCBkPSJNMzAgNDZMMTUgNDYiIHN0cm9rZT0iIzMzMyIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0ic3F1YXJlIi8+PC9nPjwvc3ZnPg==')]"></div>
        
        {/* Slider content */}
        <div className="min-h-[460px] sm:min-h-[500px] p-4 md:p-6">
          <AnimatePresence mode="wait">
            <motion.div 
              key={currentIndex}
              className={`grid ${
                isMobile 
                  ? 'grid-cols-1 gap-4'
                  : pages[currentIndex].length === 1
                    ? 'grid-cols-1 max-w-md mx-auto'
                    : pages[currentIndex].length === 2
                      ? 'grid-cols-2 gap-6 md:gap-8'
                      : 'grid-cols-1 md:grid-cols-3 gap-6 md:gap-8'
              }`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              {pages[currentIndex].map((product, idx) => (
                <motion.div
                  key={product.id}
                  className="relative transform overflow-hidden rounded-xl p-3 bg-white dark:bg-gray-800 shadow-sm hover:shadow-xl transition-all duration-500 flex flex-col justify-between"
                  initial={{ scale: 0.9, opacity: 0, y: 20 }}
                  animate={{ 
                    scale: [0.9, 1.05, 1],
                    opacity: 1,
                    y: 0,
                    transition: { 
                      delay: idx * 0.2,
                      duration: 0.8,
                      times: [0, 0.6, 1],
                      ease: "easeOut" 
                    }
                  }}
                  exit={{ 
                    scale: 0.9,
                    opacity: 0,
                    y: -20,
                    transition: { duration: 0.3, ease: "easeIn" }
                  }}
                  whileHover={{ 
                    y: -8,
                    transition: { 
                      duration: 0.3,
                      ease: "easeOut" 
                    }
                  }}
                >
                  {/* Product aura effect (subtle glow) */}
                  <motion.div 
                    className="absolute inset-0 -z-10 bg-gradient-to-tr from-draugr-50 via-transparent to-transparent dark:from-draugr-900 opacity-0 rounded-xl"
                    initial={{ opacity: 0 }}
                    whileHover={{ opacity: 0.4 }}
                    transition={{ duration: 0.3 }}
                  />
                  
                  {/* Rune symbol decorative element */}
                  <div className="absolute top-3 right-3 opacity-10 dark:opacity-5">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 2L8 22M12 2L16 22M4 9H20M4 17H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  
                  {/* Product card */}
                  <ProductCard product={product} onAddToCart={onAddToCart} isHighlighted={true} />
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
      
      {/* Mobile navigation controls */}
      {isMobile && pages.length > 1 && (
        <div className="flex justify-center items-center space-x-4 rtl:space-x-reverse mt-4">
          <motion.button
            className="p-3 rounded-full bg-white dark:bg-gray-800 shadow-md text-gray-700 dark:text-gray-300 focus:outline-none border border-gray-200 dark:border-gray-700"
            whileTap={{ scale: 0.9 }}
            onClick={handlePrev}
            aria-label="Previous slide"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </motion.button>
          
          {/* Dots indicator for mobile */}
          <div className="flex space-x-2 rtl:space-x-reverse">
            {pages.map((_, idx) => (
              <motion.button
                key={idx}
                className={`w-2.5 h-2.5 rounded-full ${
                  idx === currentIndex 
                    ? 'bg-draugr-500' 
                    : 'bg-gray-300 dark:bg-gray-600'
                }`}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => goToSlide(idx)}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
          
          <motion.button
            className="p-3 rounded-full bg-white dark:bg-gray-800 shadow-md text-gray-700 dark:text-gray-300 focus:outline-none border border-gray-200 dark:border-gray-700"
            whileTap={{ scale: 0.9 }}
            onClick={handleNext}
            aria-label="Next slide"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
          </motion.button>
        </div>
      )}
      
      {/* Progress indicator */}
      {pages.length > 1 && (
        <div className="w-full h-0.5 mt-6 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <motion.div 
            className="h-full bg-draugr-500 dark:bg-draugr-400"
            initial={{ width: '0%' }}
            animate={{ 
              width: `${((currentIndex + 1) / pages.length) * 100}%` 
            }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          />
        </div>
      )}
    </div>
  );
};

export default FeaturedProductSlider; 