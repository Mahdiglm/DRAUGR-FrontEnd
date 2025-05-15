import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ProductCard from './ProductCard';

const FeaturedProductSlider = ({ products, onAddToCart }) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [pages, setPages] = useState([]);
  const [isMobile, setIsMobile] = useState(false);
  const [isTouch, setIsTouch] = useState(false);
  const [touchStart, setTouchStart] = useState(0);
  const [direction, setDirection] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [progress, setProgress] = useState(0);
  
  const sliderRef = useRef(null);
  const autoPlayRef = useRef(null);
  const progressRef = useRef(null);
  const progressInterval = useRef(null);

  // Adaptive products per page based on screen size
  const getProductsPerPage = () => {
    if (window.innerWidth < 640) return 1; // Mobile
    if (window.innerWidth < 1024) return 2; // Tablet
    return 3; // Desktop
  };

  // Check device type
  useEffect(() => {
    const checkDevice = () => {
      setIsMobile(window.innerWidth < 768);
      setIsTouch('ontouchstart' in window);
    };
    
    checkDevice();
    window.addEventListener('resize', checkDevice);
    
    return () => window.removeEventListener('resize', checkDevice);
  }, []);

  // Handle mouse movement for parallax effects
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isMobile && sliderRef.current) {
        const { left, top, width, height } = sliderRef.current.getBoundingClientRect();
        const x = (e.clientX - left) / width;
        const y = (e.clientY - top) / height;
        setMousePosition({ x, y });
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [isMobile]);
  
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

  // Progress bar effect
  useEffect(() => {
    if (pages.length <= 1) return;
    
    clearInterval(progressInterval.current);
    setProgress(0);
    
    progressInterval.current = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval.current);
          // Move to next slide
          setCurrentPage(current => (current + 1) % pages.length);
          return 0;
        }
        return prev + 0.5;
      });
    }, 50);
    
    return () => clearInterval(progressInterval.current);
  }, [currentPage, pages.length]);

  // Auto advance slides
  useEffect(() => {
    if (pages.length <= 1 || isDragging) return;
    
    clearTimeout(autoPlayRef.current);
    
    autoPlayRef.current = setTimeout(() => {
      setDirection(1);
      setCurrentPage(prev => (prev + 1) % pages.length);
    }, 10000); // 10 seconds
    
    return () => clearTimeout(autoPlayRef.current);
  }, [currentPage, pages.length, isDragging]);

  const goToPage = (pageIndex) => {
    setDirection(pageIndex > currentPage ? 1 : -1);
    setCurrentPage(pageIndex);
    setProgress(0);
    clearInterval(progressInterval.current);
  };

  // Handle touch/mouse events
  const handleDragStart = (e) => {
    setIsDragging(true);
    setStartX(e.clientX || e.touches[0].clientX);
  };

  const handleDragEnd = (e) => {
    setIsDragging(false);
    const endX = e.clientX || e.changedTouches[0].clientX;
    const threshold = 100; // Minimum distance to trigger slide change
    
    if (startX - endX > threshold) {
      // Swiped left, go to next
      goToPage((currentPage + 1) % pages.length);
    } else if (endX - startX > threshold) {
      // Swiped right, go to previous
      goToPage(currentPage === 0 ? pages.length - 1 : currentPage - 1);
    }
  };

  const handleDragMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
  };

  // Animation variants
  const slideVariants = {
    enter: (direction) => ({
      x: direction > 0 ? '100%' : '-100%',
      opacity: 0,
      filter: 'blur(12px)',
      scale: 0.95,
    }),
    center: {
      x: 0,
      opacity: 1,
      filter: 'blur(0px)',
      scale: 1,
      transition: {
        x: { type: 'spring', stiffness: 300, damping: 30 },
        opacity: { duration: 0.6 },
        filter: { duration: 0.4 },
        scale: { duration: 0.4 }
      }
    },
    exit: (direction) => ({
      x: direction < 0 ? '100%' : '-100%',
      opacity: 0,
      filter: 'blur(8px)',
      scale: 0.95,
      transition: { 
        duration: 0.4 
      }
    })
  };

  // Card animation variants
  const cardVariants = {
    initial: { opacity: 0, y: 30 },
    animate: index => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: index * 0.15,
        duration: 0.6,
        ease: [0.25, 0.1, 0.25, 1.0]
      }
    }),
    hover: {
      y: -12,
      boxShadow: "0 30px 60px rgba(0,0,0,0.2)", 
      transition: { duration: 0.3, ease: "easeOut" }
    }
  };

  if (!products || products.length === 0 || pages.length === 0) {
    return <div className="text-center py-8">محصولی برای نمایش وجود ندارد</div>;
  }

  return (
    <div className="relative w-full mt-8 mb-16 overflow-visible">
      {/* Norse ornamental decorations */}
      <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 w-64 h-10 bg-no-repeat bg-contain bg-center opacity-20 dark:opacity-30 pointer-events-none"
           style={{ backgroundImage: "url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNDAgMzAiPjxwYXRoIGQ9Ik0wLDE1YzAtLDEwLDYwLDEwLDEyMCwwYzYwLDEwLDEyMCwxMCwxMjAsMHMtNjAsLTEwLC0xMjAsMCwwLCwwLC0xMjAsMFoiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI2EwMjcyZiIgc3Ryb2tlLXdpZHRoPSIxLjUiLz48cGF0aCBkPSJNMjAsMTVsMTAsLTEwbDEwLDEwbC0xMCwxMFptNDAtMjB2NDBNMTAwLDE1bDEwLC0xMGwxMCwxMGwtMTAsMTBabTQwLC0yMHY0ME0xODAsMTVsMTAsLTEwbDEwLDEwbC0xMCwxMFoiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI2EwMjcyZiIgc3Ryb2tlLXdpZHRoPSIxLjUiLz48L3N2Zz4=')" }}
      />

      {/* Section Title */}
      <div className="relative text-center mb-10">
        <h2 className="text-3xl md:text-4xl font-bold relative inline-block">
          <span className="relative z-10 px-2 text-gray-900 dark:text-gray-100">محصولات ویژه</span>
          <span className="absolute inset-0 bg-gradient-to-r from-transparent via-draugr-200 dark:via-draugr-900/30 to-transparent -z-10 transform skew-x-12 scale-110"></span>
        </h2>
        <div className="mt-3 w-full max-w-xl mx-auto flex items-center justify-center">
          <div className="h-px bg-gray-200 dark:bg-gray-700 flex-grow mr-3"></div>
          <svg viewBox="0 0 30 30" className="h-5 w-5 text-draugr-500 transform -rotate-45">
            <path d="M15,3L2,15l13,12l13-12L15,3z" fill="currentColor"/>
          </svg>
          <div className="h-px bg-gray-200 dark:bg-gray-700 flex-grow ml-3"></div>
        </div>
      </div>

      {/* Main Slider */}
      <div 
        ref={sliderRef}
        className="relative w-full overflow-hidden rounded-xl min-h-[500px] md:min-h-[450px] shadow-2xl"
        style={{
          background: "linear-gradient(to bottom, rgba(15,15,20,0.02), rgba(15,15,20,0.08))",
          boxShadow: "0 20px 80px -20px rgba(0,0,0,0.2), 0 0 20px rgba(0,0,0,0.05) inset"
        }}
        onTouchStart={handleDragStart}
        onTouchMove={handleDragMove}
        onTouchEnd={handleDragEnd}
        onMouseDown={!isTouch ? handleDragStart : undefined}
        onMouseMove={!isTouch ? handleDragMove : undefined}
        onMouseUp={!isTouch ? handleDragEnd : undefined}
        onMouseLeave={!isTouch && isDragging ? handleDragEnd : undefined}
      >
        {/* Atmospheric background with subtle pattern */}
        <div 
          className="absolute inset-0 opacity-10 dark:opacity-20 pointer-events-none"
          style={{ 
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%23${isMobile ? '333' : '222'}' fill-opacity='0.3' fill-rule='evenodd'/%3E%3C/svg%3E")`,
            backgroundSize: '80px 80px',
            transform: !isMobile ? `translateX(${(mousePosition.x - 0.5) * -20}px) translateY(${(mousePosition.y - 0.5) * -20}px)` : 'none'
          }}
        />
        
        {/* Mist/fog overlay */}
        <div 
          className="absolute inset-0 bg-gradient-to-b from-transparent via-white/5 to-white/10 dark:from-transparent dark:via-gray-900/5 dark:to-gray-900/10 mix-blend-overlay pointer-events-none"
          style={{
            transform: !isMobile ? `translateX(${(mousePosition.x - 0.5) * -10}px) translateY(${(mousePosition.y - 0.5) * -10}px)` : 'none'
          }}
        />

        {/* Slider Content */}
        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.div
            key={currentPage}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            drag={!isMobile && !isTouch ? "x" : false}
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.1}
            onDragEnd={(e, { offset, velocity }) => {
              const swipe = offset.x > 100 ? -1 : offset.x < -100 ? 1 : 0;
              if (swipe !== 0) {
                setDirection(swipe);
                setCurrentPage((prev) => {
                  if (swipe === 1) return (prev + 1) % pages.length;
                  return prev === 0 ? pages.length - 1 : prev - 1;
                });
              }
            }}
            className="w-full h-full relative"
          >
            <div className={`relative w-full h-full flex ${isMobile ? 'flex-col' : 'flex-row'} justify-around items-center gap-4 p-4 md:p-8`}>
              {pages[currentPage].map((product, index) => (
                <motion.div
                  key={product.id}
                  className={`relative ${isMobile ? 'w-full max-w-xs' : 'w-full md:w-1/2 lg:w-1/3 xl:w-1/4'} max-w-sm`}
                  variants={cardVariants}
                  custom={index}
                  initial="initial"
                  animate="animate"
                  whileHover="hover"
                >
                  <div className="relative group">
                    {/* Glow effect for cards on hover */}
                    <div className="absolute inset-0 bg-gradient-to-b from-draugr-500/0 to-draugr-500/0 group-hover:from-draugr-500/5 group-hover:to-draugr-500/20 dark:group-hover:from-draugr-400/5 dark:group-hover:to-draugr-400/10 rounded-xl transition-all duration-500 -z-10 opacity-0 group-hover:opacity-100"></div>
                    
                    {/* Card with subtle hover animation */}
                    <div className="transform transition-all duration-500 group-hover:-translate-y-2">
                      <ProductCard product={product} onAddToCart={onAddToCart} isHighlighted={true} />
                    </div>
                    
                    {/* Runic symbol appears on hover */}
                    <motion.div 
                      className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 text-draugr-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                      initial={{ scale: 0.5 }}
                      animate={{ 
                        scale: [0.5, 1.1, 1],
                        rotate: [0, -5, 0, 5, 0]
                      }}
                      transition={{ duration: 0.5, delay: 0.1 }}
                    >
                      <svg viewBox="0 0 24 24" className="h-6 w-6" stroke="currentColor" fill="none">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 22V2M2 12h20M17 7l-5 5-5-5M7 17l5-5 5 5" />
                      </svg>
                    </motion.div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation Elements */}
        {pages.length > 1 && (
          <>
            {/* Custom runic navigation arrows */}
            <button
              onClick={() => goToPage(currentPage === 0 ? pages.length - 1 : currentPage - 1)}
              className="absolute left-3 md:left-6 top-1/2 transform -translate-y-1/2 bg-white/80 dark:bg-gray-800/80 text-gray-800 dark:text-gray-200 p-3 rounded-full shadow-lg z-20 backdrop-blur-sm border border-gray-200 dark:border-gray-700 hover:bg-white dark:hover:bg-gray-800 transition-all duration-300"
              aria-label="Previous slide"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            
            <button
              onClick={() => goToPage((currentPage + 1) % pages.length)}
              className="absolute right-3 md:right-6 top-1/2 transform -translate-y-1/2 bg-white/80 dark:bg-gray-800/80 text-gray-800 dark:text-gray-200 p-3 rounded-full shadow-lg z-20 backdrop-blur-sm border border-gray-200 dark:border-gray-700 hover:bg-white dark:hover:bg-gray-800 transition-all duration-300"
              aria-label="Next slide"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>

            {/* Custom runic indicators */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex items-center justify-center space-x-2 z-20">
              {pages.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToPage(index)}
                  className={`relative p-1 focus:outline-none group transition-transform duration-300 transform ${currentPage === index ? 'scale-110' : 'scale-100'} hover:scale-110`}
                  aria-label={`Go to slide ${index + 1}`}
                >
                  <svg 
                    className={`w-5 h-5 ${currentPage === index ? 'text-draugr-500' : 'text-gray-400 dark:text-gray-600'} group-hover:text-draugr-400`} 
                    viewBox="0 0 20 20" 
                    fill="currentColor"
                  >
                    <path d="M10,1L1,10l9,9l9-9L10,1z" />
                  </svg>
                  
                  {currentPage === index && (
                    <motion.div 
                      layoutId="activeIndicator"
                      className="absolute inset-0 -z-10 bg-white dark:bg-gray-800 rounded-full opacity-70 shadow-md"
                      transition={{ duration: 0.3 }}
                    />
                  )}
                </button>
              ))}
            </div>
          </>
        )}
      </div>
      
      {/* Progress bar - Norse inspired */}
      {pages.length > 1 && (
        <div className="w-full mt-8 relative h-1 bg-gray-200 dark:bg-gray-800 overflow-hidden rounded-full max-w-3xl mx-auto">
          <motion.div 
            className="absolute top-0 left-0 h-full bg-gradient-to-r from-draugr-700 via-draugr-500 to-draugr-700 rounded-full"
            style={{ width: `${progress}%` }}
          />
          
          {/* Decorative elements */}
          <div className="absolute top-1/2 left-0 transform -translate-y-1/2 w-2 h-2 rounded-full bg-draugr-500"></div>
          <div className="absolute top-1/2 right-0 transform -translate-y-1/2 w-2 h-2 rounded-full bg-draugr-500"></div>
        </div>
      )}
      
      {/* Norse ornamental bottom decorations */}
      <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 rotate-180 w-64 h-10 bg-no-repeat bg-contain bg-center opacity-20 dark:opacity-30 pointer-events-none"
           style={{ backgroundImage: "url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNDAgMzAiPjxwYXRoIGQ9Ik0wLDE1YzAtLDEwLDYwLDEwLDEyMCwwYzYwLDEwLDEyMCwxMCwxMjAsMHMtNjAsLTEwLC0xMjAsMCwwLCwwLC0xMjAsMFoiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI2EwMjcyZiIgc3Ryb2tlLXdpZHRoPSIxLjUiLz48cGF0aCBkPSJNMjAsMTVsMTAsLTEwbDEwLDEwbC0xMCwxMFptNDAtMjB2NDBNMTAwLDE1bDEwLC0xMGwxMCwxMGwtMTAsMTBabTQwLC0yMHY0ME0xODAsMTVsMTAsLTEwbDEwLDEwbC0xMCwxMFoiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI2EwMjcyZiIgc3Ryb2tlLXdpZHRoPSIxLjUiLz48L3N2Zz4=')" }}
      />
    </div>
  );
};

export default FeaturedProductSlider; 