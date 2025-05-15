import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ProductCard from './ProductCard';

const FeaturedProductSlider = ({ products, onAddToCart }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef(null);
  const sliderContainerRef = useRef(null);

  // Check viewport size
  useEffect(() => {
    const checkViewport = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkViewport();
    window.addEventListener('resize', checkViewport);
    return () => window.removeEventListener('resize', checkViewport);
  }, []);

  // Get products to display (2 at a time, or 1 on mobile)
  const getDisplayedProducts = () => {
    if (!products?.length) return [];
    
    const itemsPerView = isMobile ? 1 : 2;
    const startIdx = activeIndex * itemsPerView;
    return products.slice(startIdx, startIdx + itemsPerView);
  };

  // Calculate total number of slider pages
  const getTotalPages = () => {
    if (!products?.length) return 0;
    const itemsPerView = isMobile ? 1 : 2;
    return Math.ceil(products.length / itemsPerView);
  };

  // Auto-advance timer
  useEffect(() => {
    if (isPaused || isZoomed) {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      return;
    }

    timerRef.current = setInterval(() => {
      const totalPages = getTotalPages();
      if (totalPages <= 1) return;

      if (!isZoomed) {
        setIsZoomed(true);
        
        // After zoom effect, move to next slide
        setTimeout(() => {
          setIsZoomed(false);
          setActiveIndex((prev) => (prev + 1) % totalPages);
        }, 1500); // Stay zoomed for 1.5s before changing slides
      }
    }, 5000);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [isPaused, isZoomed, products, isMobile]);

  // Handle slider navigation
  const goToSlide = (index) => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    
    setIsZoomed(false);
    setActiveIndex(index);
  };
  
  const goToNextSlide = () => {
    const totalPages = getTotalPages();
    if (totalPages <= 1) return;
    goToSlide((activeIndex + 1) % totalPages);
  };
  
  const goToPrevSlide = () => {
    const totalPages = getTotalPages();
    if (totalPages <= 1) return;
    goToSlide(activeIndex === 0 ? totalPages - 1 : activeIndex - 1);
  };

  // Event handlers for pausing auto-advance
  const handleMouseEnter = () => setIsPaused(true);
  const handleMouseLeave = () => setIsPaused(false);
  const handleTouchStart = () => setIsPaused(true);
  const handleTouchEnd = () => setIsPaused(false);

  // Skip rendering if no products
  if (!products || products.length === 0) {
    return <div className="text-center py-8">محصولی برای نمایش وجود ندارد</div>;
  }

  // Get current products to display
  const displayedProducts = getDisplayedProducts();
  const totalPages = getTotalPages();

  return (
    <div 
      ref={sliderContainerRef}
      className="relative mt-8 mb-12"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Section Title */}
      <div className="mb-6 px-4">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-gray-100 relative inline-block">
          محصولات ویژه
          <motion.span 
            className="absolute bottom-0 left-0 h-[2px] bg-draugr-500"
            initial={{ width: 0 }}
            animate={{ width: '100%' }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          />
        </h2>
      </div>

      {/* Main Slider Container */}
      <div className="overflow-hidden relative">
        {/* Products Display Area */}
        <div className="px-4 py-2 relative min-h-[480px]">
          <AnimatePresence mode="wait">
            <motion.div 
              key={`page-${activeIndex}`}
              className={`grid ${isMobile ? 'grid-cols-1' : 'grid-cols-2'} gap-6`}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -40 }}
              transition={{ duration: 0.4 }}
            >
              {displayedProducts.map((product, idx) => (
                <motion.div 
                  key={product.id}
                  className="relative"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ 
                    opacity: 1, 
                    scale: isZoomed ? 1.05 : 1,
                    transition: {
                      duration: 0.6,
                      scale: {
                        duration: isZoomed ? 1.2 : 0.6,
                        ease: isZoomed ? 'easeOut' : 'easeInOut'
                      },
                      delay: idx * 0.15
                    }
                  }}
                  whileHover={{ scale: 1.03 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                >
                  {/* Card with glow effect */}
                  <div className="relative group transition-all duration-500">
                    {/* Subtle glow effect beneath card */}
                    <motion.div
                      className="absolute inset-0 -z-10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      animate={{
                        boxShadow: isZoomed 
                          ? '0 0 30px 5px rgba(198, 40, 40, 0.15)' 
                          : '0 0 0px 0px rgba(198, 40, 40, 0)'
                      }}
                      transition={{ duration: 1.2 }}
                    />
                    
                    {/* Product Card Component */}
                    <div className={`transition-transform duration-700 ${isZoomed ? 'scale-105' : 'scale-100'}`}>
                      <ProductCard 
                        product={product} 
                        onAddToCart={onAddToCart} 
                        isHighlighted={true}
                      />
                    </div>
                    
                    {/* Rune symbol overlay that appears on zoom */}
                    <motion.div 
                      className="absolute inset-0 pointer-events-none flex items-center justify-center"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: isZoomed ? 0.03 : 0 }}
                      transition={{ duration: 0.8 }}
                    >
                      <svg 
                        viewBox="0 0 100 100" 
                        className="w-full h-full text-draugr-600 fill-current"
                      >
                        <path d="M50,10 L60,30 L80,40 L60,50 L80,60 L60,70 L50,90 L40,70 L20,60 L40,50 L20,40 L40,30 Z" />
                      </svg>
                    </motion.div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation Controls */}
        <div className="absolute w-full flex justify-between items-center top-1/2 transform -translate-y-1/2 px-2 z-10">
          {/* Prev Button */}
          <motion.button
            onClick={goToPrevSlide}
            className="w-10 h-10 rounded-full flex items-center justify-center bg-gray-100 bg-opacity-80 dark:bg-gray-800 dark:bg-opacity-60 text-gray-700 dark:text-gray-200 focus:outline-none"
            whileHover={{ scale: 1.1, backgroundColor: 'rgba(255,255,255,0.9)' }}
            whileTap={{ scale: 0.95 }}
            aria-label="Previous product"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </motion.button>
          
          {/* Next Button */}
          <motion.button
            onClick={goToNextSlide}
            className="w-10 h-10 rounded-full flex items-center justify-center bg-gray-100 bg-opacity-80 dark:bg-gray-800 dark:bg-opacity-60 text-gray-700 dark:text-gray-200 focus:outline-none"
            whileHover={{ scale: 1.1, backgroundColor: 'rgba(255,255,255,0.9)' }}
            whileTap={{ scale: 0.95 }}
            aria-label="Next product"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </motion.button>
        </div>
      </div>

      {/* Pagination Indicators */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-6 space-x-2 rtl:space-x-reverse">
          {Array.from({ length: totalPages }).map((_, idx) => (
            <motion.button
              key={`page-indicator-${idx}`}
              className={`w-7 h-1.5 rounded-full ${activeIndex === idx ? 'bg-draugr-500' : 'bg-gray-300 dark:bg-gray-600'}`}
              onClick={() => goToSlide(idx)}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
              animate={{ 
                width: activeIndex === idx ? 28 : 20,
                opacity: activeIndex === idx ? 1 : 0.6
              }}
              transition={{ duration: 0.3 }}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      )}

      {/* Progress Indicator */}
      {totalPages > 1 && (
        <div className="w-full mt-2 px-4">
          <div className="h-0.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-draugr-500"
              initial={{ width: 0 }}
              animate={{ 
                width: `${((activeIndex + 1) / totalPages) * 100}%`,
              }}
              transition={{ duration: 0.4 }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default FeaturedProductSlider; 