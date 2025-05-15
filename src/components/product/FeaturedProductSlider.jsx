import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';
import ProductCard from './ProductCard';

const FeaturedProductSlider = ({ products, onAddToCart }) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [pages, setPages] = useState([]);
  const [isMobile, setIsMobile] = useState(false);
  const [touchStart, setTouchStart] = useState(0);
  const timerRef = useRef(null);
  const sliderRef = useRef(null);
  const controls = useAnimation();
  
  // Desktop: 2 products per page, Mobile: 1 product per page
  const getProductsPerPage = () => isMobile ? 1 : 2;

  // Check if we're on mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile(); // Initial check
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
  }, [products, isMobile]);

  // Auto-scroll logic
  useEffect(() => {
    if (pages.length <= 1) return;
    
    const autoScroll = () => {
      setCurrentPage((prevPage) => (prevPage + 1) % pages.length);
    };
    
    timerRef.current = setInterval(autoScroll, 5000);
    
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [pages]);

  // Manual navigation
  const goToPage = (pageIndex) => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    setCurrentPage(pageIndex);
    timerRef.current = setInterval(() => {
      setCurrentPage((prevPage) => (prevPage + 1) % pages.length);
    }, 5000);
  };

  // Handle swipe for mobile touch events
  const handleTouchStart = (e) => {
    setTouchStart(e.touches[0].clientX);
  };

  const handleTouchEnd = (e) => {
    const touchEnd = e.changedTouches[0].clientX;
    const touchDiff = touchStart - touchEnd;
    
    // If the swipe is significant enough (more than 50px)
    if (Math.abs(touchDiff) > 50) {
      if (touchDiff > 0) {
        // Swipe left - go to next slide
        setCurrentPage((prevPage) => (prevPage + 1) % pages.length);
      } else {
        // Swipe right - go to previous slide
        setCurrentPage((prevPage) => (prevPage === 0 ? pages.length - 1 : prevPage - 1));
      }
      
      // Reset timer when user manually navigates
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = setInterval(() => {
          setCurrentPage((prevPage) => (prevPage + 1) % pages.length);
        }, 5000);
      }
    }
  };

  if (!products || products.length === 0 || pages.length === 0) {
    return <div className="text-center py-8">محصولی برای نمایش وجود ندارد</div>;
  }

  return (
    <div className="relative w-full overflow-hidden py-6 md:py-12">
      {/* Main Slider with touch events for mobile */}
      <div 
        ref={sliderRef}
        className="relative min-h-[500px] sm:min-h-[520px] md:min-h-[480px] w-full overflow-hidden"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPage}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.7, ease: "easeInOut" }}
            className={`w-full h-full flex ${isMobile ? 'flex-col items-center justify-center' : 'flex-row justify-center items-center gap-6'}`}
          >
            {pages[currentPage].map((product) => (
              <motion.div
                key={product.id}
                className={`${isMobile ? 'w-full max-w-xs mx-auto' : 'w-full md:w-1/2 lg:w-2/5 xl:w-1/3 max-w-sm'}`}
                whileHover={{ scale: 1.05, zIndex: 10 }}
                initial={{ scale: 0.9, filter: 'blur(0px)' }}
                animate={{ 
                  scale: 1, 
                  filter: 'blur(0px)',
                  transition: { 
                    duration: 1, 
                    ease: "easeOut" 
                  } 
                }}
              >
                <ProductCard product={product} onAddToCart={onAddToCart} isHighlighted={true} />
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Mobile Carousel Indicators - Clearer and more touch-friendly */}
      {isMobile && pages.length > 1 && (
        <div className="flex justify-center items-center mt-4 mb-2">
          {pages.map((_, index) => (
            <motion.button
              key={index}
              onClick={() => goToPage(index)}
              className={`w-8 h-2 mx-1 rounded-full transition-all duration-300 ${
                currentPage === index ? 'bg-draugr-500 scale-110' : 'bg-gray-600'
              }`}
              whileTap={{ scale: 0.9 }}
            />
          ))}
        </div>
      )}

      {/* Swipe Hint Animation for Mobile - Visual feedback to encourage swiping */}
      {isMobile && (
        <motion.div 
          className="text-center text-gray-400 text-xs mt-1 mb-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.7 }}
          transition={{ delay: 2 }}
        >
          ← برای مشاهده بیشتر به چپ و راست بکشید →
        </motion.div>
      )}

      {/* Desktop-only Background Products (Blurred) */}
      {!isMobile && (
        <div className="absolute inset-0 -z-10 flex flex-wrap justify-center items-center opacity-30">
          {products.map((product, index) => {
            // Skip products currently in focus
            const currentProducts = pages[currentPage] || [];
            const isActive = currentProducts.some(p => p.id === product.id);
            
            if (isActive) return null; // Skip displaying currently active products
            
            // Determine if this item should be on the left or right side
            const isRightSide = index % 2 === 0;
            
            // Calculate the x-position values for side placement
            const xPosition = isRightSide ? 150 : -150; // Even more to the sides

            // Determine if this product will be active in the next page
            const nextPageIndex = (currentPage + 1) % pages.length;
            const nextPageProducts = pages[nextPageIndex] || [];
            const willBeActive = nextPageProducts.some(p => p.id === product.id);
            
            return (
              <motion.div
                key={`bg-${product.id}`}
                className="w-1/3 lg:w-1/4 p-2 transform"
                initial={{ 
                  filter: 'blur(3px)', 
                  scale: 0.85, 
                  opacity: 0.7,
                  x: isRightSide ? 100 : -100,
                }}
                animate={{ 
                  filter: willBeActive ? 'blur(2px)' : 'blur(3px)', 
                  scale: willBeActive ? 0.9 : 0.85, 
                  opacity: willBeActive ? 0.8 : 0.7,
                  x: xPosition,
                  y: (Math.floor(index / 2) - 1) * 30,
                  rotate: (isRightSide ? 1 : -1) * (index % 3) * 2,
                  transition: {
                    duration: willBeActive ? 1.5 : 2,
                    ease: willBeActive ? "anticipate" : "easeInOut"
                  }
                }}
                transition={{ 
                  duration: 2,
                  ease: "easeInOut"
                }}
              >
                <div className={`opacity-70 ${willBeActive ? 'grayscale-[50%]' : 'grayscale-[70%]'} transition-all duration-1000`}>
                  <ProductCard product={product} onAddToCart={null} isDisabled={true} />
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Desktop Pagination Controls - Larger, easier to click */}
      {!isMobile && pages.length > 1 && (
        <div className="flex justify-center space-x-3 mt-6">
          {pages.map((_, index) => (
            <motion.button
              key={index}
              onClick={() => goToPage(index)}
              className={`w-3 h-3 rounded-full mx-4 transition duration-300 ${
                currentPage === index ? 'bg-draugr-500 scale-125' : 'bg-gray-400'
              }`}
              whileHover={{ scale: 1.5 }}
              whileTap={{ scale: 0.9 }}
            />
          ))}
        </div>
      )}

      {/* Mobile Navigation Arrows - Large touch targets for easy navigation */}
      {isMobile && pages.length > 1 && (
        <>
          <motion.button 
            onClick={() => goToPage(currentPage === 0 ? pages.length - 1 : currentPage - 1)}
            className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 p-2 rounded-r-md z-20"
            whileTap={{ scale: 0.9 }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </motion.button>
          
          <motion.button 
            onClick={() => goToPage((currentPage + 1) % pages.length)}
            className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 p-2 rounded-l-md z-20"
            whileTap={{ scale: 0.9 }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </motion.button>
        </>
      )}
    </div>
  );
};

export default FeaturedProductSlider; 