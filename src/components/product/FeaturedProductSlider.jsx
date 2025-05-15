import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';
import ProductCard from './ProductCard';

const FeaturedProductSlider = ({ products, onAddToCart }) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [pages, setPages] = useState([]);
  const [isMobile, setIsMobile] = useState(false);
  const [touchStart, setTouchStart] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const timerRef = useRef(null);
  const sliderRef = useRef(null);
  const controls = useAnimation();
  
  // Desktop: 3 products per page (changed from 2), Mobile: 1 product per page
  const getProductsPerPage = () => {
    if (window.innerWidth < 768) return 1; // Mobile
    if (window.innerWidth < 1280) return 2; // Tablet/Small desktop
    return 3; // Large desktop
  };

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

  // Manual navigation
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
        
        if (!isHovering) {
          timerRef.current = setInterval(() => {
            setCurrentPage((prevPage) => (prevPage + 1) % pages.length);
          }, 5000);
        }
      }
    }
  };

  const slideVariants = {
    enter: (direction) => ({
      x: direction > 0 ? '100%' : '-100%',
      opacity: 0,
      scale: 0.95,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
        type: "spring",
        stiffness: 300,
        damping: 30
      }
    },
    exit: (direction) => ({
      x: direction < 0 ? '100%' : '-100%',
      opacity: 0,
      scale: 0.95,
      transition: { 
        duration: 0.4 
      }
    })
  };

  if (!products || products.length === 0 || pages.length === 0) {
    return <div className="text-center py-8">محصولی برای نمایش وجود ندارد</div>;
  }

  return (
    <div 
      className="relative w-full overflow-visible py-6 md:py-16 mt-4 md:mt-8"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Glass-effect header bar */}
      <div className="relative z-10 mb-6 flex justify-between items-center">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-gray-100 
                      border-b-2 border-draugr-500 inline-block pb-1">
          محصولات ویژه
        </h2>
        
        {!isMobile && pages.length > 1 && (
          <div className="flex items-center gap-3">
            <motion.button 
              onClick={() => goToPage(currentPage === 0 ? pages.length - 1 : currentPage - 1)}
              className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-draugr-100 dark:hover:bg-draugr-900 
                         text-gray-600 dark:text-gray-300 hover:text-draugr-600 dark:hover:text-draugr-400 focus:outline-none
                         border border-gray-300 dark:border-gray-700 hover:border-draugr-300 dark:hover:border-draugr-700
                         transition-all duration-300"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </motion.button>
            
            <div className="flex space-x-1">
              {pages.map((_, index) => (
                <motion.button
                  key={index}
                  onClick={() => goToPage(index)}
                  className={`w-2.5 h-2.5 rounded-full mx-1 transition-all duration-300 ${
                    currentPage === index 
                      ? 'bg-draugr-500 scale-125' 
                      : 'bg-gray-400 dark:bg-gray-600 hover:bg-draugr-400 dark:hover:bg-draugr-700'
                  }`}
                  whileHover={{ scale: 1.3 }}
                  whileTap={{ scale: 0.9 }}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
            
            <motion.button 
              onClick={() => goToPage((currentPage + 1) % pages.length)}
              className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-draugr-100 dark:hover:bg-draugr-900 
                         text-gray-600 dark:text-gray-300 hover:text-draugr-600 dark:hover:text-draugr-400 focus:outline-none
                         border border-gray-300 dark:border-gray-700 hover:border-draugr-300 dark:hover:border-draugr-700
                         transition-all duration-300"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </motion.button>
          </div>
        )}
      </div>

      {/* Main Slider with touch events */}
      <div 
        ref={sliderRef}
        className="relative min-h-[500px] sm:min-h-[520px] md:min-h-[480px] w-full overflow-visible"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* Slider background with subtle pattern */}
        <div className="absolute inset-0 -z-20 bg-gradient-to-tr from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 rounded-xl opacity-50"></div>
        <div className="absolute inset-0 -z-10 opacity-5 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMyMjIiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRjMC0yLjIgMS44LTQgNC00czQgMS44IDQgNC0xLjggNC00IDQtNC0xLjgtNC00bTAtMTZjMC0yLjIgMS44LTQgNC00czQgMS44IDQgNC0xLjggNC00IDQtNC0xLjgtNC00bTAgMzJjMC0yLjIgMS44LTQgNC00czQgMS44IDQgNC0xLjggNC00IDQtNC0xLjgtNC00TTIwIDM0YzAtMi4yIDEuOC00IDQtNHM0IDEuOCA0IDQtMS44IDQtNCA0LTQtMS44LTQtNG0wLTE2YzAtMi4yIDEuOC00IDQtNHM0IDEuOCA0IDQtMS44IDQtNCA0LTQtMS44LTQtNG0wIDMyYzAtMi4yIDEuOC00IDQtNHM0IDEuOCA0IDQtMS44IDQtNCA0LTQtMS44LTQtNG00IDAiLz48L2c+PC9nPjwvc3ZnPg==')]"></div>
        
        <AnimatePresence initial={false} custom={currentPage}>
          <motion.div
            key={currentPage}
            custom={currentPage}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            className={`w-full h-full flex ${isMobile ? 'flex-col items-center justify-center' : 'flex-row justify-around items-center gap-4'}`}
          >
            {pages[currentPage].map((product, index) => (
              <motion.div
                key={product.id}
                className={`${isMobile ? 'w-full max-w-xs mx-auto my-2' : 'w-full md:w-1/2 lg:w-1/3 xl:w-1/4 max-w-sm px-2'}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ 
                  opacity: 1, 
                  y: 0,
                  transition: { 
                    delay: index * 0.15,
                    duration: 0.5,
                    ease: "easeOut" 
                  }
                }}
                whileHover={{ 
                  scale: 1.05, 
                  zIndex: 10,
                  boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" 
                }}
                transition={{
                  type: "spring",
                  stiffness: 400,
                  damping: 17
                }}
              >
                <div className="relative transform transition-all duration-300 hover:-translate-y-1">
                  <ProductCard product={product} onAddToCart={onAddToCart} isHighlighted={true} />
                  
                  {/* Subtle highlight effect */}
                  <motion.div 
                    className="absolute inset-0 rounded-xl bg-draugr-500 -z-10"
                    initial={{ opacity: 0 }}
                    whileHover={{ opacity: 0.07 }}
                  />
                </div>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Mobile-specific components */}
      {isMobile && (
        <>
          {/* Mobile Carousel Indicators - Clearer and more touch-friendly */}
          {pages.length > 1 && (
            <div className="flex justify-center items-center mt-6 mb-3">
              {pages.map((_, index) => (
                <motion.button
                  key={index}
                  onClick={() => goToPage(index)}
                  className={`w-8 h-2 mx-1 rounded-full transition-all duration-300 ${
                    currentPage === index 
                      ? 'bg-draugr-500 scale-110' 
                      : 'bg-gray-400 dark:bg-gray-600'
                  }`}
                  whileTap={{ scale: 0.9 }}
                />
              ))}
            </div>
          )}

          {/* Swipe Hint Animation for Mobile */}
          <motion.div 
            className="text-center text-gray-400 dark:text-gray-500 text-xs mt-2 mb-4 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.7 }}
            transition={{ delay: 2 }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16l-4-4m0 0l4-4m-4 4h18" />
            </svg>
            <span>برای مشاهده بیشتر به چپ و راست بکشید</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </motion.div>

          {/* Mobile Navigation Arrows - Enhanced design */}
          {pages.length > 1 && (
            <>
              <motion.button 
                onClick={() => goToPage(currentPage === 0 ? pages.length - 1 : currentPage - 1)}
                className="absolute left-1 top-1/2 transform -translate-y-1/2 bg-white dark:bg-gray-800 
                           bg-opacity-80 dark:bg-opacity-80 p-3 rounded-full shadow-lg z-20
                           border border-gray-200 dark:border-gray-700"
                whileHover={{ scale: 1.1, backgroundColor: 'rgba(255, 255, 255, 0.9)' }}
                whileTap={{ scale: 0.9 }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-700 dark:text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </motion.button>
              
              <motion.button 
                onClick={() => goToPage((currentPage + 1) % pages.length)}
                className="absolute right-1 top-1/2 transform -translate-y-1/2 bg-white dark:bg-gray-800 
                           bg-opacity-80 dark:bg-opacity-80 p-3 rounded-full shadow-lg z-20
                           border border-gray-200 dark:border-gray-700"
                whileHover={{ scale: 1.1, backgroundColor: 'rgba(255, 255, 255, 0.9)' }}
                whileTap={{ scale: 0.9 }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-700 dark:text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </motion.button>
            </>
          )}
        </>
      )}

      {/* Progress indicator at the bottom */}
      {pages.length > 1 && (
        <div className="w-full mt-4 bg-gray-200 dark:bg-gray-700 h-1 rounded-full overflow-hidden">
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