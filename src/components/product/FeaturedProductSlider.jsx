import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ProductCard from './ProductCard';
import { safeBlur, safeFilterTransition } from '../../utils/animationHelpers';

const FeaturedProductSlider = ({ products, onAddToCart }) => {
  const [activeGroup, setActiveGroup] = useState(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  
  // References
  const intervalRef = useRef(null);
  const resumeTimerRef = useRef(null);
  const componentMounted = useRef(true);
  
  // Total number of groups for desktop - REDUCED FROM 4 TO 3
  const totalGroups = 3;
  // Total number of items for mobile - REDUCED FROM 8 TO 6
  const totalItemsMobile = 6;
  
  // Check if we're on mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  // Function to advance the slider
  const nextSlide = () => {
    if (!componentMounted.current) return;
    
    if (isMobile) {
      setActiveIndex(prev => (prev + 1) % totalItemsMobile);
    } else {
      setActiveGroup(prev => (prev + 1) % totalGroups);
    }
  };

  // Clear all timers to prevent memory leaks
  const clearAllTimers = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    
    if (resumeTimerRef.current) {
      clearTimeout(resumeTimerRef.current);
      resumeTimerRef.current = null;
    }
  };

  // Auto-rotation
  useEffect(() => {
    // Don't start interval if paused
    if (isPaused || !componentMounted.current) {
      clearAllTimers();
      return;
    }
    
    // Clear any existing interval before setting a new one
    clearAllTimers();
    
    // Start interval
    intervalRef.current = setInterval(() => {
      nextSlide();
    }, 3000);
    
    // Cleanup function
    return () => {
      clearAllTimers();
    };
  }, [isPaused, isMobile, componentMounted.current]);

  // Ensure auto-rotation starts on initial render and cleanup properly on unmount
  useEffect(() => {
    componentMounted.current = true;
    
    // Force initial start with a small delay
    const initialTimer = setTimeout(() => {
      if (componentMounted.current) {
        nextSlide();
      }
    }, 1000);
    
    // Force cleanup on unmount
    return () => {
      componentMounted.current = false;
      clearTimeout(initialTimer);
      clearAllTimers();
    };
  }, []);

  // Handle user interaction
  const handleUserInteraction = (action) => {
    if (!componentMounted.current) return;
    
    // Clear any existing resume timer
    if (resumeTimerRef.current) {
      clearTimeout(resumeTimerRef.current);
      resumeTimerRef.current = null;
    }
    
    // Pause rotation
    setIsPaused(true);
    
    // Execute the requested action
    action();
    
    // Set timer to resume auto-rotation after delay
    resumeTimerRef.current = setTimeout(() => {
      if (componentMounted.current) {
        setIsPaused(false);
      }
    }, 3000);
  };

  // Ensure we have exactly 6 products (reduced from 8)
  const firstSixProducts = products && products.length ? products.slice(0, 6) : [];
  
  const displayProducts = [...firstSixProducts];
  while (displayProducts.length < 6) {
    displayProducts.push(displayProducts[displayProducts.length % firstSixProducts.length]);
  }

  // Create product groups for desktop: [0,1], [2,3], and [4,5] - REDUCED by one group
  const productGroupsDesktop = [
    [displayProducts[0], displayProducts[1]],
    [displayProducts[2], displayProducts[3]],
    [displayProducts[4], displayProducts[5]]
  ];

  if (!products || products.length === 0) {
    return <div className="text-center py-8">محصولی برای نمایش وجود ندارد</div>;
  }

  // Function to determine the visual state of each group for desktop
  const getGroupStateDesktop = (groupIndex) => {
    // Current active group is in foreground
    if (activeGroup === groupIndex) return "foreground";
    
    // Calculate relative positions for other groups
    const distance = (groupIndex - activeGroup + totalGroups) % totalGroups;
    
    // Next group in sequence
    if (distance === 1) return "background1";
    
    // Group after next
    if (distance === 2) return "background2";
    
    // Furthest group (before returning to active)
    return "background3";
  };

  const getCardPositionVariants = (groupStateOrActive, positionOrIsMobile) => {
    // For mobile view, show one item at a time
    if (positionOrIsMobile === true && isMobile) { // Ensuring this is the mobile specific call
      return {
        center: {
          opacity: 1,
          scale: 0.85, // Smaller scale for mobile items
          y: 0,
          x: '0%',
          zIndex: 20,
          transition: {
            type: "spring", 
            stiffness: 250,
            damping: 30,
            duration: 0.4,
            filter: safeFilterTransition()
          }
        },
        exit: {
          opacity: 0,
          scale: 0.7,
          x: activeIndex % 2 === 0 ? '-100%' : '100%', // Exit to left or right
          transition: {
            duration: 0.3,
            filter: safeFilterTransition()
          }
        }
      };
    }

    // Desktop: position cards in a staggered layout (existing logic)
    // Ensure groupStateOrActive is the groupState for desktop
    const groupState = groupStateOrActive;
    const position = positionOrIsMobile;

    if (position === 'left') {
      return {
        foreground: {
          x: '20%', // PERFECTLY BALANCED - DO NOT CHANGE HORIZONTAL POSITION
          opacity: 1,
          scale: 1,
          filter: safeBlur(0),
          rotateY: 0,
          zIndex: 40,
          transition: {
            type: "spring",
            stiffness: 300,
            damping: 25,
            mass: 1,
            duration: 0.5,
            filter: safeFilterTransition()
          }
        },
        background1: {
          x: '-20%', // PERFECTLY BALANCED - DO NOT CHANGE HORIZONTAL POSITION
          opacity: 1,
          scale: 0.9,
          filter: safeBlur(1),
          rotateY: 5,
          zIndex: 30,
          transition: {
            duration: 0.5,
            filter: safeFilterTransition()
          }
        },
        background2: {
          x: '-55%', // PERFECTLY BALANCED - DO NOT CHANGE HORIZONTAL POSITION
          opacity: 1,
          scale: 0.8,
          filter: safeBlur(2),
          rotateY: 10,
          zIndex: 20,
          transition: {
            duration: 0.5,
            filter: safeFilterTransition()
          }
        },
        background3: {
          x: '-80%', // PERFECTLY BALANCED - DO NOT CHANGE HORIZONTAL POSITION
          opacity: 1,
          scale: 0.7,
          filter: safeBlur(3),
          rotateY: 15,
          zIndex: 10,
          transition: {
            duration: 0.5,
            filter: safeFilterTransition()
          }
        }
      };
    } else {
      return {
        foreground: {
          x: '-20%', // PERFECTLY BALANCED - DO NOT CHANGE HORIZONTAL POSITION
          opacity: 1,
          scale: 1,
          filter: safeBlur(0),
          rotateY: 0,
          zIndex: 40,
          transition: {
            type: "spring",
            stiffness: 300,
            damping: 25,
            mass: 1,
            duration: 0.5,
            filter: safeFilterTransition()
          }
        },
        background1: {
          x: '20%', // PERFECTLY BALANCED - DO NOT CHANGE HORIZONTAL POSITION
          opacity: 1,
          scale: 0.9,
          filter: safeBlur(1),
          rotateY: -5,
          zIndex: 30,
          transition: {
            duration: 0.5,
            filter: safeFilterTransition()
          }
        },
        background2: {
          x: '55%', // PERFECTLY BALANCED - DO NOT CHANGE HORIZONTAL POSITION
          opacity: 1,
          scale: 0.8,
          filter: safeBlur(2),
          rotateY: -10,
          zIndex: 20,
          transition: {
            duration: 0.5,
            filter: safeFilterTransition()
          }
        },
        background3: {
          x: '80%', // PERFECTLY BALANCED - DO NOT CHANGE HORIZONTAL POSITION
          opacity: 1,
          scale: 0.7,
          filter: safeBlur(3),
          rotateY: -15,
          zIndex: 10,
          transition: {
            duration: 0.5,
            filter: safeFilterTransition()
          }
        }
      };
    }
  };

  return (
    <div className="relative w-full py-6 md:py-8 overflow-hidden">
      {/* Slider container with subtle background */}
      <div className="relative flex flex-col md:flex-row justify-center items-center min-h-[450px] md:min-h-[550px] w-full overflow-visible pt-4">
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
        
        {/* Mobile view: Single item slider */}
        {isMobile && (
          <div className="w-full px-2 pt-4 overflow-hidden relative min-h-[380px]">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={`mobile-slide-${activeIndex}`}
                custom={activeIndex}
                variants={getCardPositionVariants(null, true)} // Pass true for isMobile
                initial="exit"
                animate="center"
                exit="exit"
                className="absolute w-full h-full flex justify-center items-center"
                style={{ width: 'calc(100% - 16px)', left: '8px' }} // Centering with padding
              >
                <div className="w-full max-w-[280px]"> {/* Max width for mobile card */}
                  <ProductCard 
                    product={displayProducts[activeIndex]} 
                    onAddToCart={onAddToCart} 
                    isHighlighted={true} 
                    inSlider={true}
                  />
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        )}

        {/* Desktop view with staggered layout */}
        {!isMobile && (
          <div className="w-full max-w-6xl flex justify-center items-center relative mx-auto overflow-visible">
            {productGroupsDesktop.map((group, groupIndex) => (
              <React.Fragment key={`desktop-group-${groupIndex}`}>
                {group.map((product, productIndex) => {
                  const position = productIndex === 0 ? 'left' : 'right';
                  const groupState = getGroupStateDesktop(groupIndex);
                  
                  return (
                    <motion.div
                      key={`desktop-product-${product.id}-${groupIndex}-${productIndex}`}
                      className={`absolute md:w-1/3 lg:w-[30%] transform ${position === 'left' ? 'left-[10%]' : 'right-[10%]'} overflow-visible -mt-6`}
                      variants={getCardPositionVariants(groupState, position)}
                      initial="background3"
                      animate={groupState}
                      transition={{ duration: 0.5 }}
                    >
                      <div className="relative rounded-xl overflow-hidden transition-all">
                        <ProductCard 
                          product={product} 
                          onAddToCart={groupState === "foreground" ? onAddToCart : null} 
                          isHighlighted={groupState === "foreground"}
                          isDisabled={groupState !== "foreground"}
                          inSlider={true}
                        />
                      </div>
                    </motion.div>
                  );
                })}
              </React.Fragment>
            ))}
          </div>
        )}

        {/* Pagination indicators - Update for 6 items / 3 groups */}
        <div className="absolute bottom-[-24px] md:bottom-[-28px] left-0 right-0 mx-auto z-30">
          {isMobile ? (
            // Mobile pagination with improved styling
            <motion.div 
              className="inline-flex items-center justify-center h-7 bg-black/50 px-4 py-1.5 rounded-full backdrop-blur-md border border-gray-800/30 shadow-lg"
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              {Array.from({ length: totalItemsMobile }).map((_, itemIndex) => (
                <motion.div
                  key={`mobile-pagination-${itemIndex}`}
                  className="mx-1.5 cursor-pointer"
                  initial={{ scale: 1 }}
                  animate={{ 
                    scale: activeIndex === itemIndex ? 1 : 1,
                  }}
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handleUserInteraction(() => setActiveIndex(itemIndex))}
                >
                  <motion.div
                    className="rounded-full"
                    animate={{ 
                      width: activeIndex === itemIndex ? '14px' : '6px',
                      height: activeIndex === itemIndex ? '6px' : '6px',
                      backgroundColor: activeIndex === itemIndex ? "#ff3c3c" : "#9a9a9a",
                      boxShadow: activeIndex === itemIndex ? "0 0 8px rgba(255, 60, 60, 0.6)" : "none"
                    }}
                    transition={{ 
                      duration: 0.3, 
                      ease: "easeInOut",
                      layout: true
                    }}
                    layoutId={`mobile-indicator-${itemIndex}`}
                  />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            // Desktop pagination with container and improved styling
            <motion.div 
              className="inline-flex items-center justify-center h-7 bg-black/40 px-5 py-1.5 rounded-full backdrop-blur-md border border-gray-800/20 shadow-lg"
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              {Array.from({ length: totalGroups }).map((_, groupIndex) => (
                <motion.button
                  key={`desktop-pagination-${groupIndex}`}
                  className="mx-2 focus:outline-none"
                  whileHover={{ scale: 1.15 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handleUserInteraction(() => setActiveGroup(groupIndex))}
                >
                  <motion.div
                    className="rounded-full"
                    animate={{
                      width: activeGroup === groupIndex ? '24px' : '10px',
                      height: activeGroup === groupIndex ? '6px' : '6px',
                      backgroundColor: activeGroup === groupIndex ? "#ff3c3c" : "#6a6a6a",
                      opacity: activeGroup === groupIndex ? 1 : 0.6,
                      boxShadow: activeGroup === groupIndex ? "0 0 10px rgba(255, 60, 60, 0.5)" : "none"
                    }}
                    transition={{ 
                      duration: 0.4, 
                      ease: [0.25, 0.1, 0.25, 1.0],
                      layout: true 
                    }}
                    layoutId={`desktop-indicator-${groupIndex}`}
                  />
                </motion.button>
              ))}
            </motion.div>
          )}
        </div>
        
        {/* Manual navigation buttons */}
        <motion.button 
          className="absolute left-0 md:left-2 lg:left-4 top-1/2 transform -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 rounded-full 
                    bg-gradient-to-br from-gray-900/90 to-black/80 flex items-center justify-center
                    backdrop-blur-md z-30 text-gray-200 border border-gray-700/50 shadow-[0_0_15px_rgba(0,0,0,0.4)]
                    hover:border-draugr-500/40 group"
          initial={{ opacity: 0.7, scale: 0.95 }}
          animate={{ opacity: 0.85, scale: 1 }}
          whileHover={{ 
            opacity: 1,
            scale: 1.05,
            boxShadow: "0 0 18px rgba(0,0,0,0.5)",
            transition: { duration: 0.2, ease: "easeOut" }
          }}
          whileTap={{ 
            scale: 0.95,
            transition: { type: "spring", stiffness: 400, damping: 17 }
          }}
          onClick={() => handleUserInteraction(() => {
            if (isMobile) {
              setActiveIndex((prev) => (prev - 1 + totalItemsMobile) % totalItemsMobile);
            } else {
              setActiveGroup((prev) => (prev - 1 + totalGroups) % totalGroups);
            }
          })}
        >
          <motion.div className="relative w-full h-full flex items-center justify-center">
            <motion.span 
              className="absolute inset-0 rounded-full bg-draugr-500/0 group-hover:bg-draugr-500/10"
              initial={{ opacity: 0 }}
              whileHover={{ opacity: 1 }}
              transition={{ duration: 0.2 }}
            />
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 md:h-6 md:w-6 relative z-10 group-hover:text-draugr-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
            </svg>
          </motion.div>
        </motion.button>
        <motion.button 
          className="absolute right-0 md:right-2 lg:right-4 top-1/2 transform -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 rounded-full 
                    bg-gradient-to-br from-gray-900/90 to-black/80 flex items-center justify-center
                    backdrop-blur-md z-30 text-gray-200 border border-gray-700/50 shadow-[0_0_15px_rgba(0,0,0,0.4)]
                    hover:border-draugr-500/40 group"
          initial={{ opacity: 0.7, scale: 0.95 }}
          animate={{ opacity: 0.85, scale: 1 }}
          whileHover={{ 
            opacity: 1,
            scale: 1.05,
            boxShadow: "0 0 18px rgba(0,0,0,0.5)",
            transition: { duration: 0.2, ease: "easeOut" }
          }}
          whileTap={{ 
            scale: 0.95,
            transition: { type: "spring", stiffness: 400, damping: 17 }
          }}
          onClick={() => handleUserInteraction(() => {
            if (isMobile) {
              setActiveIndex((prev) => (prev + 1) % totalItemsMobile);
            } else {
              setActiveGroup((prev) => (prev + 1) % totalGroups);
            }
          })}
        >
          <motion.div className="relative w-full h-full flex items-center justify-center">
            <motion.span 
              className="absolute inset-0 rounded-full bg-draugr-500/0 group-hover:bg-draugr-500/10"
              initial={{ opacity: 0 }}
              whileHover={{ opacity: 1 }}
              transition={{ duration: 0.2 }}
            />
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 md:h-6 md:w-6 relative z-10 group-hover:text-draugr-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
            </svg>
          </motion.div>
        </motion.button>
      </div>
    </div>
  );
};

export default FeaturedProductSlider; 