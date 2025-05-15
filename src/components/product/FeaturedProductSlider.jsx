import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ProductCard from './ProductCard';

const FeaturedProductSlider = ({ products, onAddToCart }) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [pages, setPages] = useState([]);
  const [isMobile, setIsMobile] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const timerRef = useRef(null);
  const sliderRef = useRef(null);
  
  // Always show 2 items on desktop, 1 on mobile
  const getProductsPerPage = () => isMobile ? 1 : 2;

  // Check screen size
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Prepare pages
  useEffect(() => {
    if (!products || products.length === 0) return;
    
    const productsPerPage = getProductsPerPage();
    const totalPages = Math.ceil(products.length / productsPerPage);
    const pagesArray = [];
    
    for (let i = 0; i < totalPages; i++) {
      const start = i * productsPerPage;
      const pageProducts = products.slice(start, start + productsPerPage);
      pagesArray.push(pageProducts);
    }
    
    setPages(pagesArray);
    
    if (currentPage >= pagesArray.length) {
      setCurrentPage(0);
    }
  }, [products, isMobile, currentPage]);

  // Handle auto rotation
  useEffect(() => {
    if (pages.length <= 1 || isTransitioning) return;
    
    const nextSlide = () => {
      setIsTransitioning(true);
      setCurrentPage(prev => (prev + 1) % pages.length);
      
      // Reset transitioning state after animation completes
      setTimeout(() => {
        setIsTransitioning(false);
      }, 600);
    };
    
    timerRef.current = setInterval(nextSlide, 5000);
    
    return () => {
      clearInterval(timerRef.current);
    };
  }, [pages.length, isTransitioning]);

  // Manual navigation
  const goToPage = (pageIndex) => {
    if (isTransitioning || pageIndex === currentPage) return;
    
    setIsTransitioning(true);
    clearInterval(timerRef.current);
    setCurrentPage(pageIndex);
    
    setTimeout(() => {
      setIsTransitioning(false);
    }, 600);
  };

  // Handle swipe for mobile
  const handleSwipe = (direction) => {
    if (isTransitioning) return;
    
    setIsTransitioning(true);
    
    if (direction === "left") {
      setCurrentPage(prev => (prev + 1) % pages.length);
    } else {
      setCurrentPage(prev => (prev === 0 ? pages.length - 1 : prev - 1));
    }
    
    setTimeout(() => {
      setIsTransitioning(false);
    }, 600);
  };

  if (!products || products.length === 0 || pages.length === 0) {
    return <div className="text-center py-8">محصولی برای نمایش وجود ندارد</div>;
  }

  return (
    <div className="relative w-full py-8 md:py-12 overflow-hidden">
      <div className="relative overflow-hidden">
        {/* Subtle section title */}
        <h2 className="text-xl md:text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-6 border-b border-gray-200 dark:border-gray-800 pb-2">
          محصولات ویژه
        </h2>
        
        {/* Main slider container */}
        <div 
          ref={sliderRef}
          className="relative min-h-[400px] md:min-h-[450px] mb-8"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={currentPage}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col md:flex-row justify-center md:justify-between items-center gap-6 md:gap-4"
            >
              {pages[currentPage].map((product, index) => (
                <motion.div
                  key={`product-${product.id}`}
                  className={`w-full ${isMobile ? 'max-w-xs' : 'md:max-w-[48%]'}`}
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ 
                    scale: 1, 
                    opacity: 1,
                    transition: { 
                      delay: index * 0.2,
                      duration: 0.5, 
                      ease: [0.19, 1.0, 0.22, 1.0] // Custom easing for smooth zoom
                    } 
                  }}
                  exit={{ 
                    scale: 0.9, 
                    opacity: 0,
                    transition: { 
                      duration: 0.3, 
                      ease: "easeOut" 
                    } 
                  }}
                  transition={{ 
                    type: "spring", 
                    stiffness: 300, 
                    damping: 25 
                  }}
                  drag={isMobile ? "x" : false}
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={0.2}
                  onDragEnd={(e, { offset, velocity }) => {
                    if (Math.abs(offset.x) > 50) {
                      const direction = offset.x < 0 ? "left" : "right";
                      handleSwipe(direction);
                    }
                  }}
                >
                  <div className="group relative transform transition-all duration-500 hover:translate-y-[-4px]">
                    <ProductCard product={product} onAddToCart={onAddToCart} isHighlighted={true} />
                    
                    {/* Subtle hover glow effect */}
                    <motion.div 
                      className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                      initial={false}
                      style={{
                        boxShadow: "0 0 20px 5px rgba(var(--color-draugr-500), 0.15)",
                        zIndex: -1
                      }}
                    />
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
        
        {/* Navigation dots */}
        {pages.length > 1 && (
          <div className="flex justify-center items-center space-x-1 mb-2">
            {pages.map((_, index) => (
              <button
                key={`dot-${index}`}
                onClick={() => goToPage(index)}
                disabled={isTransitioning}
                className={`w-2 h-2 rounded-full mx-1 transition-all duration-300 focus:outline-none ${
                  currentPage === index 
                    ? 'bg-draugr-500 w-4' 
                    : 'bg-gray-300 dark:bg-gray-700 hover:bg-gray-400 dark:hover:bg-gray-600'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        )}
        
        {/* Navigation arrows - Only show on desktop or tablets */}
        {pages.length > 1 && !isMobile && (
          <>
            <button
              onClick={() => goToPage(currentPage === 0 ? pages.length - 1 : currentPage - 1)}
              disabled={isTransitioning}
              className="absolute left-0 top-1/2 transform -translate-y-1/2 w-8 h-8 flex items-center justify-center 
                         bg-white/70 dark:bg-gray-800/70 rounded-full shadow-sm z-10
                         text-gray-700 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-800
                         focus:outline-none transition-all duration-300 hover:scale-110"
              aria-label="Previous slide"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            
            <button
              onClick={() => goToPage((currentPage + 1) % pages.length)}
              disabled={isTransitioning}
              className="absolute right-0 top-1/2 transform -translate-y-1/2 w-8 h-8 flex items-center justify-center 
                         bg-white/70 dark:bg-gray-800/70 rounded-full shadow-sm z-10
                         text-gray-700 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-800
                         focus:outline-none transition-all duration-300 hover:scale-110"
              aria-label="Next slide"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </>
        )}
        
        {/* Mobile swipe instructions - only show briefly on first render */}
        {isMobile && (
          <motion.div 
            className="text-center text-xs text-gray-400 dark:text-gray-500 mt-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5, duration: 0.5 }}
          >
            برای مشاهده محصولات بیشتر، انگشت خود را روی تصویر بکشید
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default FeaturedProductSlider; 