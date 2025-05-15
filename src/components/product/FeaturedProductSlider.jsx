import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ProductCard from './ProductCard';

const FeaturedProductSlider = ({ products, onAddToCart }) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [pages, setPages] = useState([]);
  const [isMobile, setIsMobile] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const timerRef = useRef(null);
  const sliderRef = useRef(null);

  // Always show 2 items on desktop, 1 on mobile
  const getProductsPerPage = () => isMobile ? 1 : 2;

  // Check device type
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Prepare pages based on screen size
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
    
    // Reset current page if needed
    if (currentPage >= pagesArray.length) {
      setCurrentPage(0);
    }
  }, [products, isMobile, currentPage]);

  // Auto-slide functionality
  useEffect(() => {
    if (pages.length <= 1 || isHovering) return;
    
    const autoScroll = () => {
      setCurrentPage((prevPage) => (prevPage + 1) % pages.length);
    };
    
    timerRef.current = setInterval(autoScroll, 5000);
    
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [pages, isHovering]);

  // Pause auto-scroll on hover
  const handleMouseEnter = () => setIsHovering(true);
  const handleMouseLeave = () => setIsHovering(false);

  // Navigation
  const goToPage = (pageIndex) => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    setCurrentPage(pageIndex);
    
    if (!isHovering) {
      timerRef.current = setInterval(() => {
        setCurrentPage((prevPage) => (prevPage + 1) % pages.length);
      }, 5000);
    }
  };

  // Empty state
  if (!products || products.length === 0 || pages.length === 0) {
    return <div className="text-center py-8 text-gray-500">محصولی برای نمایش وجود ندارد</div>;
  }

  return (
    <div 
      className="relative w-full my-10"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Title - Simple and elegant */}
      <h2 className="text-2xl font-medium text-gray-800 dark:text-gray-100 mb-8 text-center">
        <span className="border-b border-draugr-500 pb-1">محصولات ویژه</span>
      </h2>
      
      {/* Main slider container */}
      <div 
        ref={sliderRef}
        className="overflow-hidden"
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={currentPage}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="flex justify-center items-stretch gap-6 px-4"
          >
            {pages[currentPage].map((product) => (
              <motion.div
                key={product.id}
                className="w-full md:w-1/3 max-w-sm mx-auto"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ 
                  scale: 1, 
                  opacity: 1,
                  transition: { 
                    duration: 0.8,
                    ease: [0.25, 0.1, 0.25, 1]
                  }
                }}
                exit={{ 
                  scale: 0.95, 
                  opacity: 0,
                  transition: {
                    duration: 0.5
                  }
                }}
              >
                <div className="h-full">
                  <ProductCard product={product} onAddToCart={onAddToCart} isHighlighted={true} />
                </div>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
      
      {/* Simple dot indicators */}
      {pages.length > 1 && (
        <div className="flex justify-center space-x-1 mt-8">
          {pages.map((_, index) => (
            <button
              key={index}
              onClick={() => goToPage(index)}
              aria-label={`Go to slide ${index + 1}`}
              className={`w-2 h-2 rounded-full mx-1 transition-all duration-300 ${
                currentPage === index 
                  ? 'bg-draugr-500 scale-125' 
                  : 'bg-gray-300 dark:bg-gray-600'
              }`}
            />
          ))}
        </div>
      )}
      
      {/* Subtle navigation arrows */}
      {pages.length > 1 && !isMobile && (
        <>
          <button 
            onClick={() => goToPage(currentPage === 0 ? pages.length - 1 : currentPage - 1)}
            className="absolute left-0 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center 
                     text-gray-400 hover:text-draugr-500 transition-colors duration-300
                     opacity-60 hover:opacity-100 focus:outline-none"
            aria-label="Previous slide"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          
          <button 
            onClick={() => goToPage((currentPage + 1) % pages.length)}
            className="absolute right-0 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center 
                     text-gray-400 hover:text-draugr-500 transition-colors duration-300
                     opacity-60 hover:opacity-100 focus:outline-none"
            aria-label="Next slide"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </>
      )}
      
      {/* Mobile swipe indicator - Subtle hint */}
      {isMobile && pages.length > 1 && (
        <div className="flex justify-center items-center mt-4 opacity-60">
          <svg className="w-4 h-4 text-gray-400 mx-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16l-4-4m0 0l4-4m-4 4h18" />
          </svg>
          <svg className="w-4 h-4 text-gray-400 mx-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </div>
      )}
      
      {/* Minimal progress bar */}
      {pages.length > 1 && (
        <div className="w-1/3 mx-auto mt-6 h-px bg-gray-200 dark:bg-gray-700 overflow-hidden rounded-full">
          <motion.div 
            className="h-full bg-draugr-500"
            initial={{ width: 0 }}
            animate={{ 
              width: `${((currentPage + 1) / pages.length) * 100}%`,
              transition: { duration: 0.3, ease: "easeInOut" }
            }}
          />
        </div>
      )}
    </div>
  );
};

export default FeaturedProductSlider; 