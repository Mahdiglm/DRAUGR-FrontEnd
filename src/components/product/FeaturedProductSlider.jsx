import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ProductCard from './ProductCard';
import { safeBlur, safeFilterTransition } from '../../utils/animationHelpers';

const FeaturedProductSlider = ({ products, onAddToCart }) => {
  const [activeGroup, setActiveGroup] = useState(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const timerRef = useRef(null);
  const componentMounted = useRef(true);
  // Total number of groups for desktop
  const totalGroups = 4;
  // Total number of items for mobile
  const totalItemsMobile = 8;
  
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
  
  const displayProducts = [...firstEightProducts];
  while (displayProducts.length < 8) {
    displayProducts.push(displayProducts[displayProducts.length % firstEightProducts.length]);
  }

  // Create product groups for desktop: [0,1], [2,3], [4,5], and [6,7]
  const productGroupsDesktop = [
    [displayProducts[0], displayProducts[1]],
    [displayProducts[2], displayProducts[3]],
    [displayProducts[4], displayProducts[5]],
    [displayProducts[6], displayProducts[7]]
  ];

  // Auto-rotation logic
  useEffect(() => {
    if (isHovering || !isVisible) return;
    
    timerRef.current = setTimeout(() => {
      if (componentMounted.current) {
        if (isMobile) {
          setActiveIndex((prev) => (prev + 1) % totalItemsMobile);
        } else {
          setActiveGroup((prev) => (prev + 1) % totalGroups);
        }
      }
    }, 5000);
    
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [isMobile, activeGroup, activeIndex, isHovering, isVisible]);

  // Pause rotation on hover
  const handleMouseEnter = () => setIsHovering(true);
  const handleMouseLeave = () => setIsHovering(false);

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
    <div 
      className="relative w-full py-12 md:py-16 overflow-hidden"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Slider container with subtle background */}
      <div className="relative flex flex-col md:flex-row justify-center items-center min-h-[600px] md:min-h-[550px] w-full overflow-visible pt-8">
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
          <div className="w-full px-2 pt-4 overflow-hidden relative min-h-[450px]">
            <AnimatePresence initial={false} custom={activeIndex}>
              <motion.div
                key={activeIndex}
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
                        />
                      </div>
                    </motion.div>
                  );
                })}
              </React.Fragment>
            ))}
          </div>
        )}

        {/* Pagination indicators */}
        <div className="absolute bottom-[-16px] md:bottom-[-20px] left-0 right-0 mx-auto w-fit flex justify-center items-center space-x-1 md:space-x-2 z-30">
          {/* Mobile: space-x-1 (4px). Desktop: md:space-x-2 (8px) */}
          {isMobile ? (
            Array.from({ length: totalItemsMobile }).map((_, itemIndex) => (
              <motion.button
                key={`mobile-pagination-${itemIndex}`}
                className="w-1.5 h-1.5 rounded-full focus:outline-none" // Tiny dots for mobile, no individual margin
                animate={{
                  backgroundColor: activeIndex === itemIndex ? "#ff0000" : "#4b5563", // Draugr red and darker gray for better contrast
                  scale: activeIndex === itemIndex ? 1.5 : 1, // Active dot is larger
                }}
                whileHover={{ scale: activeIndex === itemIndex ? 1.7 : 1.5 }} // Slightly larger hover for all
                whileTap={{ scale: 0.9 }}
                onClick={() => {
                  if (timerRef.current) clearTimeout(timerRef.current);
                  setActiveIndex(itemIndex);
                }}
              />
            ))
          ) : (
            Array.from({ length: totalGroups }).map((_, groupIndex) => (
              <motion.button
                key={`desktop-pagination-${groupIndex}`}
                className="h-1.5 rounded-full bg-gray-300 dark:bg-gray-600 focus:outline-none" // No individual mx, base width set by animation
                animate={{
                  backgroundColor: activeGroup === groupIndex ? "#ff0000" : "#333333",
                  opacity: activeGroup === groupIndex ? 1 : 0.5,
                  width: activeGroup === groupIndex ? '1.25rem' : '0.75rem' // 20px (w-5) active, 12px (w-3) inactive
                }}
                whileHover={{ 
                  width: activeGroup === groupIndex ? '1.375rem' : '0.875rem', // Slightly wider on hover
                  opacity: 1 
                }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  if (timerRef.current) clearTimeout(timerRef.current);
                  setActiveGroup(groupIndex);
                }}
              />
            ))
          )}
        </div>
        
        {/* Manual navigation buttons */}
        <motion.button 
          className="absolute left-1 md:left-6 top-1/2 transform -translate-y-1/2 w-8 h-8 md:w-10 md:h-10 rounded-full bg-charcoal/70 flex items-center justify-center 
                    backdrop-blur-sm z-30 text-gray-300 border border-gray-700 shadow-md"
          whileHover={{ scale: 1.1, backgroundColor: "rgba(31, 31, 31, 0.9)" }}
          whileTap={{ scale: 0.95 }}
          initial={{ opacity: 0.7 }}
          animate={{ opacity: 0.7 }}
          onClick={() => {
            if (timerRef.current) clearTimeout(timerRef.current);
            if (isMobile) {
              setActiveIndex((prev) => (prev - 1 + totalItemsMobile) % totalItemsMobile);
            } else {
              setActiveGroup((prev) => (prev - 1 + totalGroups) % totalGroups);
            }
          }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
          </svg>
        </motion.button>
        <motion.button 
          className="absolute right-1 md:right-6 top-1/2 transform -translate-y-1/2 w-8 h-8 md:w-10 md:h-10 rounded-full bg-charcoal/70 flex items-center justify-center 
                    backdrop-blur-sm z-30 text-gray-300 border border-gray-700 shadow-md"
          whileHover={{ scale: 1.1, backgroundColor: "rgba(31, 31, 31, 0.9)" }}
          whileTap={{ scale: 0.95 }}
          initial={{ opacity: 0.7 }}
          animate={{ opacity: 0.7 }}
          onClick={() => {
            if (timerRef.current) clearTimeout(timerRef.current);
            if (isMobile) {
              setActiveIndex((prev) => (prev + 1) % totalItemsMobile);
            } else {
              setActiveGroup((prev) => (prev + 1) % totalGroups);
            }
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