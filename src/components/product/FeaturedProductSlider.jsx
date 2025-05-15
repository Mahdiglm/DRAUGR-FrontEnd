import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useAnimation, useMotionValue, useTransform, useSpring } from 'framer-motion';
import ProductCard from './ProductCard';

const FeaturedProductSlider = ({ products, onAddToCart }) => {
  // States for tracking current view and interaction
  const [currentIndex, setCurrentIndex] = useState(0);
  const [viewMode, setViewMode] = useState('showcase'); // 'showcase', 'grid', 'focus'
  const [hoveringProduct, setHoveringProduct] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  // Refs and animation controls
  const containerRef = useRef(null);
  const showcaseRef = useRef(null);
  const controls = useAnimation();
  
  // Interactive motion values
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateX = useTransform(mouseY, [-300, 300], [10, -10]);
  const rotateY = useTransform(mouseX, [-300, 300], [-10, 10]);
  
  // Spring physics for smoother animations
  const springConfig = { damping: 20, stiffness: 200 };
  const scaleSpring = useSpring(1, springConfig);
  
  // Handle mouse position for 3D effect
  const handleMouseMove = (e) => {
    if (!containerRef.current || viewMode !== 'showcase') return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    mouseX.set(e.clientX - centerX);
    mouseY.set(e.clientY - centerY);
  };
  
  // Media query for responsive design
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      
      // Switch to grid view on mobile automatically
      if (window.innerWidth < 768 && viewMode === 'showcase') {
        setViewMode('grid');
      }
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    // Simulate loading state
    const loadingTimer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    
    return () => {
      window.removeEventListener('resize', checkMobile);
      clearTimeout(loadingTimer);
    };
  }, [viewMode]);
  
  // Pre-load images
  useEffect(() => {
    if (!products || products.length === 0) return;
    
    const preloadImages = () => {
      products.forEach((product) => {
        const img = new Image();
        img.src = product.image;
      });
    };
    
    preloadImages();
  }, [products]);
  
  // Handle product navigation
  const goToProduct = (index) => {
    setCurrentIndex(index);
  };
  
  const nextProduct = () => {
    if (!products || products.length === 0) return;
    setCurrentIndex((prev) => (prev + 1) % products.length);
  };
  
  const prevProduct = () => {
    if (!products || products.length === 0) return;
    setCurrentIndex((prev) => (prev === 0 ? products.length - 1 : prev - 1));
  };
  
  // Toggle between view modes
  const toggleViewMode = (mode) => {
    setViewMode(mode);
    
    // Reset position when changing modes
    if (mode === 'showcase') {
      setCurrentIndex(0);
    }
  };
  
  // Handle product hover
  const handleProductHover = (product) => {
    if (viewMode !== 'grid') return;
    setHoveringProduct(product);
    scaleSpring.set(1.05);
  };
  
  const handleProductLeave = () => {
    setHoveringProduct(null);
    scaleSpring.set(1);
  };
  
  if (!products || products.length === 0) {
    return (
      <div className="flex justify-center items-center h-[500px] text-gray-400">
        <span className="text-xl">محصولی برای نمایش وجود ندارد</span>
      </div>
    );
  }
  
  // Variants for animations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        duration: 0.8,
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        type: "spring",
        stiffness: 150,
        damping: 20
      }
    }
  };
  
  const showcaseVariants = {
    initial: { scale: 0.9, opacity: 0, rotateY: -15 },
    animate: { 
      scale: 1, 
      opacity: 1, 
      rotateY: 0,
      transition: { 
        type: "spring",
        stiffness: 150,
        damping: 20,
        delay: 0.2
      }
    },
    exit: { 
      scale: 0.9,
      opacity: 0,
      rotateY: 15,
      transition: {
        duration: 0.5
      }
    }
  };
  
  // Loading animation component
  const LoadingAnimation = () => (
    <div className="absolute inset-0 flex justify-center items-center z-10">
      <div className="relative w-20 h-20">
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute inset-0 border-2 border-draugr-500 rounded-full"
            initial={{ scale: 0, opacity: 0.8 }}
            animate={{ 
              scale: [0, 1.2, 1.5],
              opacity: [0.8, 0.4, 0]
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              delay: i * 0.3,
              ease: "easeOut"
            }}
          />
        ))}
        <motion.div 
          className="absolute inset-0 flex justify-center items-center text-draugr-500"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 2a8 8 0 100 16 8 8 0 000-16zm-1 13.5v-1a1 1 0 112 0v1a1 1 0 11-2 0zm2-3a1 1 0 01-1 1h-.5a1 1 0 01-.5-.5c0-.1-.1-.2-.2-.3 0-.1-.1-.1-.1-.2 0 0 0-.1-.1-.1L9 12c-.3-.3-.5-.6-.5-1 0-.5.2-.9.5-1.2l1.2-1.2c.1-.1.2-.3.3-.4.1-.2.2-.3.2-.5 0-.4-.3-.8-.7-.8-.2 0-.4.1-.5.2-.1.1-.2.3-.3.4-.2.3-.6.5-1 .2-.4-.2-.5-.6-.3-1 .5-.9 1.5-1.5 2.6-1.5 1.7 0 3 1.3 3 3 0 .6-.2 1.2-.6 1.7-.4.4-.8.9-1.3 1.3-.2.2-.3.3-.3.4 0 .1-.1.2-.1.3 0 .2.2.4.4.4h.5a1 1 0 011 1z" clipRule="evenodd" />
          </svg>
        </motion.div>
      </div>
    </div>
  );
  
  return (
    <motion.div 
      ref={containerRef}
      className="relative min-h-[600px] md:min-h-[700px] w-full py-8 md:py-12 px-4 overflow-hidden"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      onMouseMove={handleMouseMove}
    >
      {/* Dark atmospheric background with particles */}
      <div className="absolute inset-0 -z-20 bg-gradient-to-b from-gray-900 via-gray-800 to-black overflow-hidden">
        {/* Animated particles */}
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-gray-200 rounded-full opacity-30"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, Math.random() * -100 - 50],
              opacity: [0.3, 0],
              scale: [1, Math.random() * 2]
            }}
            transition={{
              duration: 5 + Math.random() * 10,
              repeat: Infinity,
              delay: Math.random() * 5,
              ease: "easeOut"
            }}
          />
        ))}
        
        {/* Radial gradient overlay */}
        <div className="absolute inset-0 bg-radial-gradient from-draugr-800/20 via-transparent to-transparent" />
      </div>
      
      {/* Cinematic overlay filter */}
      <div className="absolute inset-0 -z-10 mix-blend-overlay bg-gradient-to-tr from-draugr-900/10 to-gray-900/30" />
      
      {/* Loading animation */}
      <AnimatePresence>
        {isLoading && <LoadingAnimation />}
      </AnimatePresence>
      
      {/* Header with title and view toggles */}
      <motion.div 
        className="relative z-10 mb-8 md:mb-12 flex flex-col md:flex-row justify-between items-center gap-4"
        variants={itemVariants}
      >
        <h2 className="text-3xl md:text-4xl font-bold text-white">
          <span className="text-draugr-500">محصولات</span> ویژه
        </h2>
        
        {/* View mode toggles */}
        <div className="flex items-center gap-3 bg-gray-800/70 backdrop-blur-sm p-2 rounded-full">
          <motion.button
            onClick={() => toggleViewMode('showcase')}
            className={`p-2 rounded-full ${viewMode === 'showcase' 
              ? 'bg-draugr-500 text-white' 
              : 'text-gray-300 hover:bg-gray-700'}`}
            whileTap={{ scale: 0.9 }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
            </svg>
          </motion.button>
          
          <motion.button
            onClick={() => toggleViewMode('grid')}
            className={`p-2 rounded-full ${viewMode === 'grid' 
              ? 'bg-draugr-500 text-white' 
              : 'text-gray-300 hover:bg-gray-700'}`}
            whileTap={{ scale: 0.9 }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
          </motion.button>
          
          <motion.button
            onClick={() => toggleViewMode('focus')}
            className={`p-2 rounded-full ${viewMode === 'focus' 
              ? 'bg-draugr-500 text-white' 
              : 'text-gray-300 hover:bg-gray-700'}`}
            whileTap={{ scale: 0.9 }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M5 8a1 1 0 011-1h1V6a1 1 0 012 0v1h1a1 1 0 110 2H9v1a1 1 0 11-2 0V9H6a1 1 0 01-1-1z" />
              <path fillRule="evenodd" d="M2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8zm6-4a4 4 0 100 8 4 4 0 000-8z" clipRule="evenodd" />
            </svg>
          </motion.button>
        </div>
      </motion.div>
      
      {/* Main content container */}
      <motion.div 
        className="relative w-full h-full"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* 3D Showcase View */}
        {viewMode === 'showcase' && (
          <div 
            ref={showcaseRef}
            className="relative perspective-1000 h-[400px] md:h-[500px] w-full overflow-visible"
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={`showcase-${currentIndex}`}
                className="absolute inset-0 flex items-center justify-center"
                variants={showcaseVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                style={{
                  rotateX: rotateX,
                  rotateY: rotateY,
                  transformStyle: 'preserve-3d'
                }}
              >
                <div className="relative w-full max-w-2xl mx-auto">
                  {/* Main product display */}
                  <motion.div 
                    className="relative z-20 transform-gpu"
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ 
                      y: 0, 
                      opacity: 1,
                      transition: { delay: 0.2, duration: 0.6 }
                    }}
                  >
                    <div className="bg-gradient-to-b from-gray-800/80 to-black/90 backdrop-blur-sm p-6 rounded-xl border border-gray-700/50 shadow-xl">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Product image */}
                        <div className="md:col-span-1 relative overflow-hidden rounded-lg">
                          <motion.div
                            className="w-full h-64 md:h-80 relative"
                            initial={{ scale: 1.1 }}
                            animate={{ scale: 1 }}
                            transition={{ duration: 0.6 }}
                          >
                            <div className="w-full h-full flex items-center justify-center">
                              <ProductCard 
                                product={products[currentIndex]} 
                                onAddToCart={onAddToCart} 
                                isHighlighted={true}
                              />
                            </div>
                          </motion.div>
                        </div>
                        
                        {/* Product details */}
                        <div className="md:col-span-2 flex flex-col justify-between">
                          <div>
                            <motion.h3 
                              className="text-2xl md:text-3xl font-bold text-white mb-2"
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.4 }}
                            >
                              {products[currentIndex].name}
                            </motion.h3>
                            
                            <motion.div 
                              className="flex items-center mb-4"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ delay: 0.5 }}
                            >
                              {/* Star rating display */}
                              <div className="flex text-yellow-500">
                                {[...Array(5)].map((_, i) => (
                                  <svg 
                                    key={i} 
                                    xmlns="http://www.w3.org/2000/svg" 
                                    className={`h-5 w-5 ${i < (products[currentIndex].rating || 4) ? 'text-yellow-500' : 'text-gray-500'}`} 
                                    viewBox="0 0 20 20" 
                                    fill="currentColor"
                                  >
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                  </svg>
                                ))}
                              </div>
                              
                              <span className="text-gray-400 mr-2 text-sm">
                                ({products[currentIndex].reviewCount || Math.floor(Math.random() * 50) + 10} نظر)
                              </span>
                            </motion.div>
                            
                            <motion.p 
                              className="text-gray-300 mb-4"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ delay: 0.6 }}
                            >
                              {products[currentIndex].description || 'توضیحات محصول در اینجا نمایش داده می‌شود. این محصول با کیفیت بالا و طراحی منحصر به فرد ارائه می‌شود.'}
                            </motion.p>
                            
                            {/* Product features */}
                            <motion.ul 
                              className="text-gray-400 mb-4 list-disc list-inside"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ delay: 0.7 }}
                            >
                              <li>کیفیت برتر</li>
                              <li>طراحی منحصر به فرد</li>
                              <li>گارانتی اصالت کالا</li>
                            </motion.ul>
                          </div>
                          
                          <motion.div 
                            className="flex flex-wrap items-center gap-4 mt-4"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.8 }}
                          >
                            <span className="text-2xl font-bold text-draugr-500">
                              {products[currentIndex].price?.toLocaleString('fa-IR') || '۱,۲۰۰,۰۰۰'} تومان
                            </span>
                            
                            <motion.button
                              className="px-6 py-2 bg-draugr-500 text-white rounded-lg shadow-lg hover:bg-draugr-600 transition-colors duration-300"
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => onAddToCart?.(products[currentIndex])}
                            >
                              افزودن به سبد خرید
                            </motion.button>
                          </motion.div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                  
                  {/* Product navigation controls */}
                  <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 flex justify-between px-4 z-30">
                    <motion.button
                      className="bg-gray-900/80 text-white p-3 rounded-full shadow-xl backdrop-blur-sm border border-gray-700/50"
                      whileHover={{ scale: 1.1, backgroundColor: 'rgba(30, 30, 30, 0.9)' }}
                      whileTap={{ scale: 0.9 }}
                      onClick={prevProduct}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                    </motion.button>
                    
                    <motion.button
                      className="bg-gray-900/80 text-white p-3 rounded-full shadow-xl backdrop-blur-sm border border-gray-700/50"
                      whileHover={{ scale: 1.1, backgroundColor: 'rgba(30, 30, 30, 0.9)' }}
                      whileTap={{ scale: 0.9 }}
                      onClick={nextProduct}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
            
            {/* Progress indicator */}
            <div className="absolute bottom-4 left-0 right-0 flex justify-center">
              <div className="flex gap-2">
                {products.map((_, index) => (
                  <motion.button
                    key={index}
                    className={`w-2 h-2 rounded-full ${index === currentIndex ? 'bg-draugr-500' : 'bg-gray-600'}`}
                    whileHover={{ scale: 1.5 }}
                    whileTap={{ scale: 0.8 }}
                    onClick={() => goToProduct(index)}
                  />
                ))}
              </div>
            </div>
          </div>
        )}
        
        {/* Grid View */}
        {viewMode === 'grid' && (
          <motion.div 
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {products.map((product, index) => (
              <motion.div
                key={product.id || index}
                className="relative"
                variants={itemVariants}
                onHoverStart={() => handleProductHover(product)}
                onHoverEnd={handleProductLeave}
                whileHover={{ 
                  scale: 1.05,
                  zIndex: 10,
                  transition: { duration: 0.2 }
                }}
              >
                <div className="bg-gradient-to-b from-gray-800/80 to-black/90 backdrop-blur-sm p-4 rounded-xl border border-gray-700/50 shadow-xl h-full">
                  <ProductCard product={product} onAddToCart={onAddToCart} isHighlighted={hoveringProduct === product} />
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
        
        {/* Focus View */}
        {viewMode === 'focus' && (
          <div className="relative h-[500px] w-full">
            <AnimatePresence mode="wait">
              <motion.div
                key={`focus-${currentIndex}`}
                className="absolute inset-0 flex items-center justify-center"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ 
                  opacity: 1, 
                  scale: 1,
                  transition: {
                    duration: 0.5,
                    ease: "easeOut"
                  }
                }}
                exit={{ 
                  opacity: 0,
                  scale: 0.8,
                  transition: {
                    duration: 0.3
                  }
                }}
              >
                <div className="bg-gradient-to-b from-gray-800/90 to-black/95 backdrop-blur-lg p-6 rounded-xl border border-gray-700/50 shadow-2xl max-w-3xl w-full">
                  <div className="flex flex-col md:flex-row gap-8">
                    <div className="w-full md:w-1/2 relative">
                      <motion.div
                        className="relative overflow-hidden rounded-lg shadow-2xl"
                        initial={{ x: -50, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                      >
                        <ProductCard product={products[currentIndex]} onAddToCart={null} isHighlighted={true} />
                        
                        {/* Image effect overlay */}
                        <motion.div 
                          className="absolute inset-0 bg-gradient-to-t from-draugr-900/30 to-transparent pointer-events-none"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.5 }}
                        />
                      </motion.div>
                    </div>
                    
                    <div className="w-full md:w-1/2">
                      <motion.h3 
                        className="text-2xl font-bold text-white mb-3"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                      >
                        {products[currentIndex].name}
                      </motion.h3>
                      
                      <motion.div 
                        className="mb-4"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                      >
                        <span className="text-2xl font-bold text-draugr-500">
                          {products[currentIndex].price?.toLocaleString('fa-IR') || '۱,۲۰۰,۰۰۰'} تومان
                        </span>
                      </motion.div>
                      
                      <motion.p 
                        className="text-gray-300 mb-6"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                      >
                        {products[currentIndex].description || 'توضیحات کامل محصول با جزئیات در اینجا نمایش داده می‌شود. این محصول با کیفیت بالا و طراحی منحصر به فرد ارائه می‌شود.'}
                      </motion.p>
                      
                      <motion.div 
                        className="flex flex-wrap gap-3 mb-6"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.6 }}
                      >
                        <span className="px-3 py-1 bg-gray-700 text-gray-200 rounded-full text-sm">جدید</span>
                        <span className="px-3 py-1 bg-draugr-600 text-white rounded-full text-sm">پرفروش</span>
                        <span className="px-3 py-1 bg-gray-700 text-gray-200 rounded-full text-sm">موجود</span>
                      </motion.div>
                      
                      <motion.div 
                        className="flex gap-3"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.7 }}
                      >
                        <motion.button
                          className="px-6 py-3 bg-draugr-500 text-white rounded-lg shadow-lg hover:bg-draugr-600 transition-colors duration-300 w-full"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => onAddToCart?.(products[currentIndex])}
                        >
                          افزودن به سبد خرید
                        </motion.button>
                      </motion.div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
            
            {/* Side navigation for Focus view */}
            <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 flex justify-between px-4 z-30 pointer-events-none">
              <motion.button
                className="bg-gray-900/80 text-white p-3 rounded-full shadow-xl backdrop-blur-sm border border-gray-700/50 pointer-events-auto"
                whileHover={{ scale: 1.1, backgroundColor: 'rgba(30, 30, 30, 0.9)' }}
                whileTap={{ scale: 0.9 }}
                onClick={prevProduct}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </motion.button>
              
              <motion.button
                className="bg-gray-900/80 text-white p-3 rounded-full shadow-xl backdrop-blur-sm border border-gray-700/50 pointer-events-auto"
                whileHover={{ scale: 1.1, backgroundColor: 'rgba(30, 30, 30, 0.9)' }}
                whileTap={{ scale: 0.9 }}
                onClick={nextProduct}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </motion.button>
            </div>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default FeaturedProductSlider; 