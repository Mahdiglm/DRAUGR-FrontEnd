import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ProductCard from './ProductCard';

const FeaturedProductSlider = ({ products, onAddToCart }) => {
  const [activeGroup, setActiveGroup] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const timerRef = useRef(null);
  const componentMounted = useRef(true);
  
  // Check if we're on mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Setup visibility detection to handle tab switching
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        setIsVisible(false);
        if (timerRef.current) {
          clearTimeout(timerRef.current);
          timerRef.current = null;
        }
      } else {
        setIsVisible(true);
        // Reset to first group when becoming visible again
        setActiveGroup(0);
      }
    };

    // Handle visibility changes (tab switching)
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    // Handle focus/blur events for more reliability
    window.addEventListener('blur', () => setIsVisible(false));
    window.addEventListener('focus', () => {
      setIsVisible(true);
      setActiveGroup(0);
    });
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', () => setIsVisible(false));
      window.removeEventListener('focus', () => setIsVisible(true));
      
      // Clean up the timer when component unmounts
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      componentMounted.current = false;
    };
  }, []);

  // Ensure we have exactly 4 products
  const firstFourProducts = products && products.length ? products.slice(0, 4) : [];
  
  // If we have less than 4 products, duplicate them to reach 4
  const displayProducts = [...firstFourProducts];
  while (displayProducts.length < 4) {
    displayProducts.push(displayProducts[displayProducts.length % firstFourProducts.length]);
  }

  // Create product groups: [0,1] and [2,3]
  const productGroups = [
    [displayProducts[0], displayProducts[1]],
    [displayProducts[2], displayProducts[3]]
  ];

  // Auto-rotation logic - improved with visibility check
  useEffect(() => {
    // Only rotate when component is visible and not being hovered
    if (isHovering || !isVisible) return;
    
    timerRef.current = setTimeout(() => {
      if (componentMounted.current) {
        setActiveGroup((prev) => (prev === 0 ? 1 : 0));
      }
    }, 5000);
    
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [activeGroup, isHovering, isVisible]);

  // Pause rotation on hover
  const handleMouseEnter = () => setIsHovering(true);
  const handleMouseLeave = () => setIsHovering(false);

  if (!products || products.length === 0) {
    return <div className="text-center py-8">محصولی برای نمایش وجود ندارد</div>;
  }

  const getCardPositionVariants = (isForeground, position) => {
    // For mobile view, simplify the animation
    if (isMobile) {
      return {
        foreground: {
          opacity: 1,
          scale: 1,
          filter: "blur(0px)",
          y: 0,
          zIndex: 20,
          transition: {
            type: "spring", 
            stiffness: 300,
            damping: 25,
            mass: 1.2,
            duration: 0.5  // Faster transition
          }
        },
        background: {
          opacity: 0.4,  // Improved opacity
          scale: 0.95,   // Less scaling for better visibility
          filter: "blur(1px)", // Reduced blur 
          y: 20,         // Less vertical offset
          zIndex: 10,
          transition: {
            duration: 0.5  // Faster transition
          }
        }
      };
    }

    // Desktop: position cards on left/right based on their index
    return {
      foreground: {
        x: position === 'left' ? '-5%' : '5%',
        opacity: 1,
        scale: 1,
        filter: "blur(0px)",
        rotateY: 0,
        zIndex: 20,
        transition: {
          type: "spring",
          stiffness: 300,
          damping: 25,
          mass: 1,      // Lower mass for faster animations
          duration: 0.5  // Faster transition
        }
      },
      background: {
        x: position === 'left' ? '-40%' : '40%',  // Less extreme positions
        opacity: 0.5,                            // Improved opacity
        scale: 0.9,                              // Less scaling down
        filter: "blur(1px)",                      // Reduced blur
        rotateY: position === 'left' ? 5 : -5,    // Less rotation
        zIndex: 10,
        transition: {
          duration: 0.5                           // Faster transition
        }
      }
    };
  };

  return (
    <div 
      className="relative w-full py-12 md:py-20 overflow-visible"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Slider container with subtle background */}
      <div className="relative flex flex-col md:flex-row justify-center items-center min-h-[580px] md:min-h-[520px] w-full overflow-visible pt-12">
        {/* Ambient background and shadows */}
        <div className="absolute inset-0 z-[1] opacity-20">
          <motion.div 
            className="absolute inset-0"
            animate={{ 
              backgroundPosition: ['0% 0%', '100% 100%']
            }}
            transition={{ 
              duration: 60, 
              ease: "linear", 
              repeat: Infinity,
              repeatType: "reverse" 
            }}
            style={{
              backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 2000 2000\' fill=\'none\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.65\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\' opacity=\'0.4\'/%3E%3C/svg%3E")',
              backgroundSize: '200% 200%'
            }}
          />
        </div>
        
        {/* Mobile view is stacked */}
        {isMobile && (
          <div className="w-full px-4 pt-4 overflow-visible">
            {productGroups.map((group, groupIndex) => (
              <div key={`group-${groupIndex}`} className="flex flex-col gap-6 w-full">
                {group.map((product, productIndex) => (
                  <motion.div
                    key={`product-${product.id}-${productIndex}`}
                    className="w-full max-w-xs mx-auto overflow-visible"
                    variants={getCardPositionVariants(true, productIndex === 0 ? 'left' : 'right')}
                    initial="background"
                    animate={activeGroup === groupIndex ? "foreground" : "background"}
                  >
                    <div className="relative rounded-xl overflow-hidden transition-all">
                      <ProductCard product={product} onAddToCart={onAddToCart} isHighlighted={activeGroup === groupIndex} />
                    </div>
                  </motion.div>
                ))}
              </div>
            ))}
          </div>
        )}

        {/* Desktop view with foreground/background layout */}
        {!isMobile && (
          <div className="w-full max-w-6xl flex justify-center items-center relative mx-auto overflow-visible">
            {productGroups.map((group, groupIndex) => (
              <React.Fragment key={`group-${groupIndex}`}>
                {group.map((product, productIndex) => {
                  const position = productIndex === 0 ? 'left' : 'right';
                  
                  return (
                    <motion.div
                      key={`product-${product.id}-${productIndex}`}
                      className={`absolute md:w-1/3 lg:w-[30%] transform ${position === 'left' ? 'left-[10%] md:left-[18%]' : 'right-[10%] md:right-[18%]'} overflow-visible`}
                      variants={getCardPositionVariants(activeGroup === groupIndex, position)}
                      initial={isVisible ? "background" : false}
                      animate={activeGroup === groupIndex ? "foreground" : "background"}
                    >
                      <div className="relative rounded-xl overflow-hidden transition-all">
                        <ProductCard 
                          product={product} 
                          onAddToCart={activeGroup === groupIndex ? onAddToCart : null} 
                          isHighlighted={activeGroup === groupIndex}
                        />
                      </div>
                    </motion.div>
                  );
                })}
              </React.Fragment>
            ))}
          </div>
        )}

        {/* Elegant pagination indicators */}
        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-3 z-30">
          {[0, 1].map((groupIndex) => (
            <motion.button
              key={`pagination-${groupIndex}`}
              className="w-8 h-2 mx-1 rounded-full bg-gray-300 dark:bg-gray-600 focus:outline-none"
              animate={{
                backgroundColor: activeGroup === groupIndex ? "#333333" : "#d1d5db",
                opacity: activeGroup === groupIndex ? 1 : 0.5,
                scale: activeGroup === groupIndex ? 1.1 : 1
              }}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                if (timerRef.current) {
                  clearTimeout(timerRef.current);
                }
                setActiveGroup(groupIndex);
              }}
            />
          ))}
        </div>
        
        {/* Manual navigation buttons (subtle) */}
        <motion.button 
          className="absolute left-2 md:left-6 top-1/2 transform -translate-y-1/2 w-10 h-10 rounded-full bg-white/70 dark:bg-gray-800/70 flex items-center justify-center 
                    backdrop-blur-sm z-30 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 shadow-md"
          whileHover={{ scale: 1.1, backgroundColor: "rgba(255, 255, 255, 0.9)" }}
          whileTap={{ scale: 0.95 }}
          initial={{ opacity: 0.7 }}
          animate={{ opacity: 0.7 }}
          onClick={() => {
            if (timerRef.current) {
              clearTimeout(timerRef.current);
            }
            setActiveGroup(activeGroup === 0 ? 1 : 0);
          }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
          </svg>
        </motion.button>
        <motion.button 
          className="absolute right-2 md:right-6 top-1/2 transform -translate-y-1/2 w-10 h-10 rounded-full bg-white/70 dark:bg-gray-800/70 flex items-center justify-center 
                    backdrop-blur-sm z-30 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 shadow-md"
          whileHover={{ scale: 1.1, backgroundColor: "rgba(255, 255, 255, 0.9)" }}
          whileTap={{ scale: 0.95 }}
          initial={{ opacity: 0.7 }}
          animate={{ opacity: 0.7 }}
          onClick={() => {
            if (timerRef.current) {
              clearTimeout(timerRef.current);
            }
            setActiveGroup(activeGroup === 0 ? 1 : 0);
          }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
          </svg>
        </motion.button>
      </div>
    </div>
  );
};

export default FeaturedProductSlider; 