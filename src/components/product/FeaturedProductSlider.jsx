import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ProductCard from './ProductCard';
import { safeBlur, safeFilterTransition } from '../../utils/animationHelpers';

const FeaturedProductSlider = ({ products, onAddToCart }) => {
  const [activeGroup, setActiveGroup] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const timerRef = useRef(null);
  const componentMounted = useRef(true);
  // Total number of groups
  const totalGroups = 4;
  
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

  // Ensure we have exactly 8 products
  const firstEightProducts = products && products.length ? products.slice(0, 8) : [];
  
  // If we have less than 8 products, duplicate them to reach 8
  const displayProducts = [...firstEightProducts];
  while (displayProducts.length < 8) {
    displayProducts.push(displayProducts[displayProducts.length % firstEightProducts.length]);
  }

  // Create product groups: [0,1], [2,3], [4,5], and [6,7]
  const productGroups = [
    [displayProducts[0], displayProducts[1]],
    [displayProducts[2], displayProducts[3]],
    [displayProducts[4], displayProducts[5]],
    [displayProducts[6], displayProducts[7]]
  ];

  // Auto-rotation logic - continuous cycle through all groups
  useEffect(() => {
    // Only rotate when component is visible and not being hovered
    if (isHovering || !isVisible) return;
    
    timerRef.current = setTimeout(() => {
      if (componentMounted.current) {
        // Cycle through all groups (0, 1, 2, 3, 0, 1, ...)
        setActiveGroup((prev) => (prev + 1) % totalGroups);
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
          filter: safeBlur(0), // Using our safe blur helper
          y: 0,
          zIndex: 20,
          transition: {
            type: "spring", 
            stiffness: 300,
            damping: 25,
            mass: 1.2,
            duration: 0.5,  // Faster transition
            filter: safeFilterTransition()
          }
        },
        background: {
          opacity: 0.4,  // Improved opacity
          scale: 0.95,   // Less scaling for better visibility
          filter: safeBlur(1), // Using our safe blur helper
          y: 20,         // Less vertical offset
          zIndex: 10,
          transition: {
            duration: 0.5,  // Faster transition
            filter: safeFilterTransition()
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
        filter: safeBlur(0), // Using our safe blur helper
        rotateY: 0,
        zIndex: 20,
        transition: {
          type: "spring",
          stiffness: 300,
          damping: 25,
          mass: 1,      // Lower mass for faster animations
          duration: 0.5,  // Faster transition
          filter: safeFilterTransition()
        }
      },
      background: {
        x: position === 'left' ? '-40%' : '40%',  // Less extreme positions
        opacity: 0.5,                            // Improved opacity
        scale: 0.9,                              // Less scaling down
        filter: safeBlur(1), // Using our safe blur helper
        rotateY: position === 'left' ? 5 : -5,    // Less rotation
        zIndex: 10,
        transition: {
          duration: 0.5,  // Faster transition
          filter: safeFilterTransition()
        }
      }
    };
  };

  // Function to determine the visual state of each group
  const getGroupState = (groupIndex) => {
    // Current active group is in foreground
    if (activeGroup === groupIndex) return "foreground";
    
    // Next group (or first if we're at the end) is in background
    const nextGroupIndex = (activeGroup + 1) % totalGroups;
    if (nextGroupIndex === groupIndex) return "background";
    
    // Other groups are hidden
    return "hidden";
  };

  return (
    <div 
      className="relative w-full py-16 md:py-24 overflow-visible"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Slider container with subtle background */}
      <div className="relative flex flex-col md:flex-row justify-center items-center min-h-[600px] md:min-h-[550px] w-full overflow-visible pt-16">
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
          <div className="w-full px-4 pt-8 overflow-visible">
            {productGroups.map((group, groupIndex) => (
              <AnimatePresence key={`group-${groupIndex}`}>
                {getGroupState(groupIndex) !== "hidden" && (
                  <div className="flex flex-col gap-8 w-full mb-8">
                    {group.map((product, productIndex) => (
                      <motion.div
                        key={`product-${product.id}-${productIndex}`}
                        className="w-full max-w-xs mx-auto overflow-visible mt-4"
                        variants={getCardPositionVariants(true, productIndex === 0 ? 'left' : 'right')}
                        initial="background"
                        animate={getGroupState(groupIndex) === "foreground" ? "foreground" : "background"}
                        exit={{ opacity: 0, y: 50, transition: { duration: 0.3 } }}
                      >
                        <div className="relative rounded-xl overflow-hidden transition-all">
                          <ProductCard 
                            product={product} 
                            onAddToCart={getGroupState(groupIndex) === "foreground" ? onAddToCart : null} 
                            isHighlighted={getGroupState(groupIndex) === "foreground"} 
                          />
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </AnimatePresence>
            ))}
          </div>
        )}

        {/* Desktop view with foreground/background layout */}
        {!isMobile && (
          <div className="w-full max-w-6xl flex justify-center items-center relative mx-auto overflow-visible">
            {productGroups.map((group, groupIndex) => (
              <AnimatePresence key={`group-${groupIndex}`}>
                {getGroupState(groupIndex) !== "hidden" && (
                  <React.Fragment>
                    {group.map((product, productIndex) => {
                      const position = productIndex === 0 ? 'left' : 'right';
                      
                      return (
                        <motion.div
                          key={`product-${product.id}-${productIndex}`}
                          className={`absolute md:w-1/3 lg:w-[30%] transform ${position === 'left' ? 'left-[10%] md:left-[18%]' : 'right-[10%] md:right-[18%]'} overflow-visible mt-10`}
                          variants={getCardPositionVariants(getGroupState(groupIndex) === "foreground", position)}
                          initial={isVisible ? "background" : false}
                          animate={getGroupState(groupIndex)}
                          exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.3 } }}
                        >
                          <div className="relative rounded-xl overflow-hidden transition-all">
                            <ProductCard 
                              product={product} 
                              onAddToCart={getGroupState(groupIndex) === "foreground" ? onAddToCart : null} 
                              isHighlighted={getGroupState(groupIndex) === "foreground"}
                            />
                          </div>
                        </motion.div>
                      );
                    })}
                  </React.Fragment>
                )}
              </AnimatePresence>
            ))}
          </div>
        )}

        {/* Elegant pagination indicators - updated for 4 groups */}
        <div className="absolute bottom-[-24px] left-0 right-0 mx-auto w-fit flex justify-center items-center space-x-3 z-30">
          {Array.from({ length: totalGroups }).map((_, groupIndex) => (
            <motion.button
              key={`pagination-${groupIndex}`}
              className="w-6 h-2 mx-1 rounded-full bg-gray-300 dark:bg-gray-600 focus:outline-none"
              animate={{
                backgroundColor: activeGroup === groupIndex ? "#ff0000" : "#333333",
                opacity: activeGroup === groupIndex ? 1 : 0.5,
                scale: activeGroup === groupIndex ? 1.1 : 1,
                width: activeGroup === groupIndex ? 24 : 16
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
        
        {/* Manual navigation buttons */}
        <motion.button 
          className="absolute left-2 md:left-6 top-1/2 transform -translate-y-1/2 w-10 h-10 rounded-full bg-charcoal/70 flex items-center justify-center 
                    backdrop-blur-sm z-30 text-gray-300 border border-gray-700 shadow-md"
          whileHover={{ scale: 1.1, backgroundColor: "rgba(31, 31, 31, 0.9)" }}
          whileTap={{ scale: 0.95 }}
          initial={{ opacity: 0.7 }}
          animate={{ opacity: 0.7 }}
          onClick={() => {
            if (timerRef.current) {
              clearTimeout(timerRef.current);
            }
            // Go to previous group (or last if at first)
            setActiveGroup((prev) => (prev - 1 + totalGroups) % totalGroups);
          }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
          </svg>
        </motion.button>
        <motion.button 
          className="absolute right-2 md:right-6 top-1/2 transform -translate-y-1/2 w-10 h-10 rounded-full bg-charcoal/70 flex items-center justify-center 
                    backdrop-blur-sm z-30 text-gray-300 border border-gray-700 shadow-md"
          whileHover={{ scale: 1.1, backgroundColor: "rgba(31, 31, 31, 0.9)" }}
          whileTap={{ scale: 0.95 }}
          initial={{ opacity: 0.7 }}
          animate={{ opacity: 0.7 }}
          onClick={() => {
            if (timerRef.current) {
              clearTimeout(timerRef.current);
            }
            // Go to next group
            setActiveGroup((prev) => (prev + 1) % totalGroups);
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