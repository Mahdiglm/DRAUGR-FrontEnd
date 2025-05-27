/**
 * CategoryRows Component
 * 
 * Creates a horizontally scrolling category section with dynamically generated items
 * and interactive proximity-based hover effects.
 */

import React, { useRef, useEffect, useState, useCallback, memo } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { categories, additionalCategories } from '../../utils/mockData';
import { getOptimizedAnimationSettings } from '../../utils/animationHelpers';
import CategoryItem from './CategoryItem'; // Moved to separate component
import TransitionOverlay from './TransitionOverlay'; // Import new component

// Constants for layout - moved to global scope for reuse
const CARD_WIDTH = 224; // 56px * 4 (actual width)
const CARD_MARGIN = 0;  // No margin - we'll handle spacing with absolute positioning
const CARD_TOTAL_WIDTH = CARD_WIDTH + CARD_MARGIN; // Total width including margins

// Mobile constants (smaller sizes)
const MOBILE_CARD_WIDTH = 160; // Smaller width for mobile
const MOBILE_CARD_MARGIN = 0; // No margin - we'll handle spacing with absolute positioning
const MOBILE_CARD_TOTAL_WIDTH = MOBILE_CARD_WIDTH + MOBILE_CARD_MARGIN;
const MOBILE_ROW_HEIGHT = 80; // Decreased height for mobile rows (was 100)

// Consistent spacing between cards
const CARD_SPACING = 32; // Fixed spacing between cards for desktop
const MOBILE_CARD_SPACING = 8; // Fixed spacing between cards for mobile

// Debug helper function
const debugLog = (message, obj = {}) => {
  if (process.env.NODE_ENV === 'development') {
    console.log(`[CategoryRows] ${message}`, obj);
  }
};

// Better mobile detection using window.matchMedia
const useMobileDetection = () => {
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    // Use media query for more reliable detection
    const mediaQuery = window.matchMedia('(max-width: 768px)');
    
    const handleMediaChange = (e) => {
      setIsMobile(e.matches);
    };
    
    // Set initial value
    setIsMobile(mediaQuery.matches);
    
    // Add listener for changes
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleMediaChange);
    } else {
      // Fallback for older browsers
      mediaQuery.addListener(handleMediaChange);
    }
    
    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener('change', handleMediaChange);
      } else {
        // Fallback for older browsers
        mediaQuery.removeListener(handleMediaChange);
      }
    };
  }, []);
  
  return isMobile;
};

const CategoryRows = memo(({ direction = "rtl", categoryItems: propCategories = null, title = "دسته‌بندی‌ها", subtitle = "مجموعه‌ای از محصولات منحصر به فرد در دسته‌بندی‌های مختلف" }) => {
  const containerRef = useRef(null);
  const beltRef = useRef(null);
  const [categoryItems, setCategoryItems] = useState([]);
  const [speed, setSpeed] = useState(1); // pixels per frame
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isTransitioning, setIsTransitioning] = useState(false); // Animation state
  const [selectedItemRect, setSelectedItemRect] = useState(null); // For animation positioning
  const [animationPhase, setAnimationPhase] = useState(0); // Controls animation phases
  const isMobileDevice = useMobileDetection();
  const animationRef = useRef(null);
  const lastTimestampRef = useRef(0);
  const wasVisibleRef = useRef(true);
  const itemsStateRef = useRef([]); // Reference to keep track of items state for visibility changes
  const navigate = useNavigate();
  
  // Track the next ID for new items
  const nextIdRef = useRef(1);
  
  // Determine which categories to use
  const categoriesData = propCategories || (direction === "rtl" ? categories : additionalCategories);
  
  // Reduce animation speed on low-performance devices
  const defaultSpeed = getOptimizedAnimationSettings(
    { speed: 0.8 },     // Default settings for high-performance devices
    { speed: 0.5 }      // Reduced speed for low-performance devices
  ).speed;
  
  // Get the appropriate card dimensions based on device
  const getCardDimensions = useCallback(() => {
    return {
      cardWidth: isMobileDevice ? MOBILE_CARD_WIDTH : CARD_WIDTH,
      cardMargin: isMobileDevice ? MOBILE_CARD_MARGIN : CARD_MARGIN,
      cardTotalWidth: isMobileDevice ? MOBILE_CARD_WIDTH + MOBILE_CARD_SPACING : CARD_WIDTH + CARD_SPACING,
      rowHeight: isMobileDevice ? MOBILE_ROW_HEIGHT : 120, // Decreased height for desktop (was 160)
      cardSpacing: isMobileDevice ? MOBILE_CARD_SPACING : CARD_SPACING
    };
  }, [isMobileDevice]);
  
  // Create animation frame handler with performance optimizations
  const animate = useCallback((timestamp) => {
    // Skip animation if tab is not visible or a category is selected
    if (document.hidden || selectedCategory) {
      if (selectedCategory && animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      } else if (document.hidden) {
        animationRef.current = requestAnimationFrame(animate);
      }
      return;
    }
    
    if (!lastTimestampRef.current) {
      lastTimestampRef.current = timestamp;
    }
    
    // If too much time has passed (e.g., after tab switch), limit delta
    const maxDelta = 100; // ms - prevents huge jumps after tab switch
    const rawDelta = timestamp - lastTimestampRef.current;
    const deltaTime = Math.min(rawDelta, maxDelta);
    
    lastTimestampRef.current = timestamp;
    
    // Reduce animation work on mobile devices
    const performanceMultiplier = isMobileDevice ? 0.7 : 1;
    
    // Get the appropriate card dimensions
    const { cardWidth, cardSpacing } = getCardDimensions();
    const exactTotalWidth = cardWidth + cardSpacing;
    
    // Move each item based on direction
    setCategoryItems(prevItems => {
      // Safety check - if we somehow lost all items, refill
      if (prevItems.length === 0) {
        const containerWidth = containerRef.current?.offsetWidth || 1000;
        const itemsNeeded = Math.ceil(containerWidth / exactTotalWidth) + 4;
        
        const initialItems = [];
        for (let i = 0; i < itemsNeeded; i++) {
          const categoryIndex = i % categoriesData.length;
          initialItems.push({
            id: nextIdRef.current++,
            category: categoriesData[categoryIndex],
            positionX: i * exactTotalWidth,
            // For mobile, initialize highlight states less frequently
            mobileHighlight: isMobileDevice ? (Math.random() < 0.15) : false,
            mobileHighlightEdge: ['top', 'right', 'bottom', 'left'][Math.floor(Math.random() * 4)],
            mobileHighlightIntensity: Math.random() * 0.7 + 0.3,
            mobileHighlightPosition: Math.random()
          });
        }
        
        itemsStateRef.current = initialItems;
        return initialItems;
      }
      
      const moveAmount = speed * deltaTime / 16 * performanceMultiplier; // normalize to ~60fps and apply performance factor
      const moveDirection = direction === "rtl" ? -1 : 1; // Negative = right to left, Positive = left to right
      
      // Bundle updates by calculating all positions at once
      // This reduces GC pressure and improves performance
      let updatedItems = prevItems.map((item) => {
        // For mobile, reduce random updates to improve performance
        let updatedItem = { ...item };
        
        // Only update highlight ~1/100 of the time (0.01) and only on mobile
        if (isMobileDevice && Math.random() < 0.005) { // Reduced from 0.01 to 0.005
          updatedItem = {
            ...updatedItem,
            mobileHighlight: Math.random() < 0.15, // Reduced from 0.3
            mobileHighlightEdge: ['top', 'right', 'bottom', 'left'][Math.floor(Math.random() * 4)],
            mobileHighlightIntensity: Math.random() * 0.7 + 0.3,
            mobileHighlightPosition: Math.random()
          };
        }
        
        return {
          ...updatedItem,
          positionX: item.positionX + (moveAmount * moveDirection)
        };
      });
      
      // Safety check for ref
      if (!containerRef.current) {
        return updatedItems;
      }
      
      const containerWidth = containerRef.current.offsetWidth;
      
      // Find relevant edge items based on direction
      let edgeItem, removeCondition, newItemPosition;
      
      if (direction === "rtl") {
        // Right to left scrolling (default)
        // Find the rightmost item
        edgeItem = updatedItems.reduce(
          (max, item) => item.positionX > max.positionX ? item : max, 
          { positionX: -Infinity }
        );
        
        // Add new item at the right if needed
        removeCondition = item => item.positionX > -exactTotalWidth;
        newItemPosition = edgeItem.positionX + exactTotalWidth;
      } else {
        // Left to right scrolling (opposite direction)
        // Find the leftmost item
        edgeItem = updatedItems.reduce(
          (min, item) => item.positionX < min.positionX ? item : min, 
          { positionX: Infinity }
        );
        
        // Add new item at the left if needed
        removeCondition = item => item.positionX < containerWidth + exactTotalWidth;
        newItemPosition = edgeItem.positionX - exactTotalWidth;
      }
      
      // If the edge item has moved in enough, add a new item at the appropriate end
      const needNewItem = direction === "rtl" 
        ? edgeItem.positionX < containerWidth + (exactTotalWidth/2)
        : edgeItem.positionX > -(exactTotalWidth/2);
        
      if (needNewItem) {
        // Determine the category index
        const categoryIndex = nextIdRef.current % categoriesData.length;
        
        // Add a new item
        updatedItems.push({
          id: nextIdRef.current++,
          category: categoriesData[categoryIndex],
          positionX: newItemPosition,
          // For mobile, initialize highlight states less frequently
          mobileHighlight: isMobileDevice ? (Math.random() < 0.15) : false,
          mobileHighlightEdge: ['top', 'right', 'bottom', 'left'][Math.floor(Math.random() * 4)],
          mobileHighlightIntensity: Math.random() * 0.7 + 0.3,
          mobileHighlightPosition: Math.random()
        });
      }
      
      // Remove items that have moved completely off the visible area
      const filteredItems = updatedItems.filter(removeCondition);
      
      // Update our ref to the current state for recovering after tab switches
      itemsStateRef.current = filteredItems;
      
      return filteredItems;
    });
    
    animationRef.current = requestAnimationFrame(animate);
  }, [speed, direction, categoriesData, isMobileDevice, getCardDimensions, selectedCategory]);
  
  // Initialize category items
  const fillBelt = useCallback(() => {
    if (!containerRef.current) return;
    
    // Get the appropriate card dimensions
    const { cardWidth, cardSpacing } = getCardDimensions();
    const exactTotalWidth = cardWidth + cardSpacing;
    
    // Calculate how many items we need to fill the container width plus buffer
    const containerWidth = containerRef.current.offsetWidth;
    const itemsNeeded = Math.ceil(containerWidth / exactTotalWidth) + 4; // +4 for buffer
    
    // If we already have items, maintain their current positions
    if (categoryItems.length > 0 && wasVisibleRef.current) {
      return; // Don't refill if there are already items and the tab was visible
    }
    
    // Otherwise create fresh items
    const initialItems = [];
    
    for (let i = 0; i < itemsNeeded; i++) {
      const categoryIndex = i % categoriesData.length;
      initialItems.push({
        id: nextIdRef.current++,
        category: categoriesData[categoryIndex],
        positionX: i * exactTotalWidth,
        // For mobile, initialize highlight states less frequently
        mobileHighlight: isMobileDevice ? (Math.random() < 0.15) : false, // Reduced from 0.3
        mobileHighlightEdge: ['top', 'right', 'bottom', 'left'][Math.floor(Math.random() * 4)],
        mobileHighlightIntensity: Math.random() * 0.7 + 0.3,
        mobileHighlightPosition: Math.random()
      });
    }
    
    setCategoryItems(initialItems);
    itemsStateRef.current = initialItems;
  }, [categoryItems, categoriesData, isMobileDevice, getCardDimensions]);
  
  // Start and manage the animation
  useEffect(() => {
    // Use slower speed on mobile
    setSpeed(isMobileDevice ? defaultSpeed * 0.8 : defaultSpeed);
    
    // Start animation only if no category is selected
    if (!selectedCategory) {
      animationRef.current = requestAnimationFrame(animate);
    }
    
    // Clean up animation
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [animate, defaultSpeed, isMobileDevice, selectedCategory]);
  
  // Handle tab visibility changes
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        // Tab becomes hidden
        wasVisibleRef.current = false;
        
        // Stop animation when tab is hidden
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current);
          animationRef.current = null;
        }
      } else {
        // Tab becomes visible again
        if (!wasVisibleRef.current) {
          // Tab was previously hidden, now visible again
          lastTimestampRef.current = 0; // Reset timestamp to avoid huge jumps
          
          // If no items are showing or positions are wrong, refill the belt
          if (categoryItems.length === 0) {
            fillBelt();
          }
          
          // Restart animation
          if (!animationRef.current && !selectedCategory) {
            animationRef.current = requestAnimationFrame(animate);
          }
        }
        wasVisibleRef.current = true;
      }
    };
    
    // Listen for visibility changes
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [animate, categoryItems, fillBelt, selectedCategory]);
  
  useEffect(() => {
    // Initial setup
    fillBelt();
    
    // Set up resize handler with debounce to prevent excessive re-renders
    let resizeTimer;
    const handleResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(fillBelt, 100);
    };
    
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(resizeTimer);
    };
  }, [fillBelt]);
  
  // Handle mouse movement to adjust speed - only for desktop with throttling
  useEffect(() => {
    if (isMobileDevice) return; // Skip for mobile devices
    
    let lastMouseMoveTime = 0;
    const throttleInterval = 100; // Only process every 100ms
    
    const handleMouseMove = (e) => {
      const now = Date.now();
      if (now - lastMouseMoveTime < throttleInterval) return;
      lastMouseMoveTime = now;
      
      if (!containerRef.current) return;
      
      // Adjust speed based on mouse position
      const container = containerRef.current;
      const { left, width } = container.getBoundingClientRect();
      const mouseXRelative = (e.clientX - left) / width;
      
      // When mouse is on the right side, scroll slightly faster
      // When on the left, scroll slightly slower
      // Invert the effect for RTL direction
      const speedFactor = direction === "rtl"
        ? 1 + (mouseXRelative - 0.5) * 0.3 // RTL: faster on right 
        : 1 - (mouseXRelative - 0.5) * 0.3; // LTR: faster on left
      
      // Smoothly interpolate current speed
      setSpeed(currentSpeed => {
        const targetSpeed = defaultSpeed * speedFactor;
        // Smooth interpolation
        return currentSpeed + (targetSpeed - currentSpeed) * 0.05;
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [defaultSpeed, direction, isMobileDevice]);
  
  // Get current card dimensions
  const { cardWidth, rowHeight } = getCardDimensions();

  // Handle keyboard navigation
  const handleKeyDown = (e) => {
    // Adjust speed with arrow keys
    if (e.key === 'ArrowLeft') {
      setSpeed(currentSpeed => currentSpeed * 0.8);
    } else if (e.key === 'ArrowRight') {
      setSpeed(currentSpeed => currentSpeed * 1.2);
    }
  };

  // Enhanced category selection handler
  const handleCategorySelect = useCallback((category, itemElement) => {
    try {
      // Prevent activation if navigation is already in progress
      if (navigationInProgressRef.current || isTransitioning) {
        debugLog("Ignoring category selection - navigation or animation already in progress");
        return;
      }
      
      debugLog("Category selected", { category: category.slug });
      
      // Stop animation
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
        debugLog("Animation stopped for transition");
      }
      
      // Capture element's current position for animation
      if (itemElement && itemElement.current) {
        const rect = itemElement.current.getBoundingClientRect();
        setSelectedItemRect(rect);
        debugLog("Captured card position", { 
          x: rect.left, 
          y: rect.top, 
          width: rect.width, 
          height: rect.height 
        });
      } else {
        debugLog("⚠️ Failed to capture card position");
      }
      
      // Set selected category and start transition
      setSelectedCategory(category);
      setIsTransitioning(true);
      setAnimationPhase(1); // Start with phase 1
      
      debugLog("Transition initiated");
    } catch (error) {
      console.error("Error in handleCategorySelect:", error);
    }
  }, [isTransitioning]);
  
  // Safety timeout ref to prevent getting stuck
  const safetyTimeoutRef = useRef(null);
  
  // Preload flag ref to prevent multiple preloads
  const preloadAttemptedRef = useRef(false);
  const navigationInProgressRef = useRef(false);

  // Handle transition completion
  const handleTransitionComplete = useCallback(() => {
    try {
      // Prevent multiple calls
      if (navigationInProgressRef.current) {
        debugLog("Navigation already in progress, ignoring duplicate call");
        return;
      }
      
      navigationInProgressRef.current = true;
      debugLog("Transition complete, navigating to shop page", { 
        category: selectedCategory?.slug
      });
      
      // Navigate to shop page with category slug
      navigate(`/shop?category=${selectedCategory.slug}`);
      
      // Reset animation states after a short delay
      setTimeout(() => {
        try {
          debugLog("Resetting animation state after navigation");
          setIsTransitioning(false);
          setSelectedCategory(null);
          setAnimationPhase(0);
          setSelectedItemRect(null);
          
          // Restart animation after navigation completes
          if (!animationRef.current) {
            debugLog("Restarting continuous animation");
            animationRef.current = requestAnimationFrame(animate);
          }
          
          // Reset navigation flag after a longer delay to prevent immediate reactivation
          setTimeout(() => {
            navigationInProgressRef.current = false;
          }, 500);
        } catch (error) {
          console.error("Error resetting animation state:", error);
        }
      }, 100);
      
      // Clear any existing safety timeout
      if (safetyTimeoutRef.current) {
        clearTimeout(safetyTimeoutRef.current);
        safetyTimeoutRef.current = null;
      }
    } catch (error) {
      console.error("Error in handleTransitionComplete:", error);
      
      // Force reset if there's an error
      setIsTransitioning(false);
      setSelectedCategory(null);
      setAnimationPhase(0);
      setSelectedItemRect(null);
      navigationInProgressRef.current = false;
    }
  }, [navigate, selectedCategory, animate]);

  // Preload shop page data during transition
  useEffect(() => {
    if (isTransitioning && selectedCategory && animationPhase >= 2 && !preloadAttemptedRef.current) {
      preloadAttemptedRef.current = true;
      // This is where you could prefetch data for the shop page
      // e.g., fetch(`/api/products?category=${selectedCategory.slug}`)
    }
    
    // Reset the preload flag when transitioning ends
    if (!isTransitioning) {
      preloadAttemptedRef.current = false;
    }
  }, [isTransitioning, selectedCategory, animationPhase]);

  // Safety timeout to prevent animation from getting stuck indefinitely
  useEffect(() => {
    // Only set the safety timeout if we're transitioning, haven't completed navigation,
    // and don't already have a timeout set
    if (isTransitioning && selectedCategory && !navigationInProgressRef.current && !safetyTimeoutRef.current) {
      debugLog("Setting safety timeout for transition");
      safetyTimeoutRef.current = setTimeout(() => {
        if (isTransitioning && !navigationInProgressRef.current) {
          debugLog("⚠️ Safety timeout triggered - transition may be stuck", { 
            phase: animationPhase,
            category: selectedCategory.slug
          });
          
          // Force completion of transition
          handleTransitionComplete();
        }
      }, 5000); // 5 second safety timeout
    }

    // Clear timeout if we're no longer transitioning or navigation is in progress
    if ((!isTransitioning || navigationInProgressRef.current) && safetyTimeoutRef.current) {
      debugLog("Clearing safety timeout - no longer needed");
      clearTimeout(safetyTimeoutRef.current);
      safetyTimeoutRef.current = null;
    }

    return () => {
      if (safetyTimeoutRef.current) {
        clearTimeout(safetyTimeoutRef.current);
        safetyTimeoutRef.current = null;
      }
    };
  }, [isTransitioning, selectedCategory, animationPhase, handleTransitionComplete, navigationInProgressRef]);

  return (
    <div 
      className={`py-2 sm:py-3 md:py-4 w-screen min-w-full max-w-none relative overflow-hidden mx-0 px-0 ${isMobileDevice ? 'category-row-mobile' : ''}`}
      style={{
        width: '100vw',
        maxWidth: '100vw',
        paddingLeft: '0',
        paddingRight: '0',
        position: 'relative',
        left: '50%',
        right: '50%',
        marginLeft: '-50vw',
        marginRight: '-50vw'
      }}
      role="region"
      aria-label="دسته‌بندی محصولات"
      tabIndex="0"
      onKeyDown={handleKeyDown}
    >
      {(title.trim() || subtitle.trim()) && (
        <div className="w-full mb-3 md:mb-6">
          <h2 className={`${isMobileDevice ? 'text-xl' : 'text-2xl md:text-3xl'} font-bold text-gray-100 mb-1 md:mb-2 pl-4`}>
            {title}
          </h2>
          <p className={`text-gray-400 pl-4 ${isMobileDevice ? 'text-xs' : 'text-sm'}`}>
            {subtitle}
          </p>
        </div>
      )}
      
      <div 
        ref={containerRef}
        className="relative w-screen overflow-hidden mx-0 px-0"
        style={{ 
          maskImage: 'linear-gradient(to right, black 100%, black 100%)',
          WebkitMaskImage: 'linear-gradient(to right, black 100%, black 100%)',
          width: '100vw',
          maxWidth: '100vw',
          marginRight: '0',
          paddingRight: '0'
        }}
        aria-live="polite"
      >
        <div 
          ref={beltRef}
          className="relative w-screen"
          style={{
            width: '100vw',
            maxWidth: '100vw',
            height: `${rowHeight}px`
          }}
        >
          {categoryItems.map(item => (
            <CategoryItem 
              key={item.id} 
              category={item.category}
              style={{
                position: 'absolute',
                left: 0,
                transform: `translateX(${item.positionX}px)`,
                width: `${cardWidth}px`,
                height: `${rowHeight}px`
              }}
              cardWidth={cardWidth}
              cardHeight={rowHeight}
              isMobile={isMobileDevice}
              mobileHighlight={item.mobileHighlight}
              mobileHighlightEdge={item.mobileHighlightEdge}
              mobileHighlightIntensity={item.mobileHighlightIntensity}
              mobileHighlightPosition={item.mobileHighlightPosition}
              onCategorySelect={handleCategorySelect}
              isSelected={selectedCategory && selectedCategory.id === item.category.id}
              isTransitioning={isTransitioning}
              animationPhase={animationPhase}
            />
          ))}
        </div>
      </div>
      
      {/* Add the TransitionOverlay for animated page transitions */}
      <TransitionOverlay
        isActive={isTransitioning}
        selectedCategory={selectedCategory}
        selectedCardRect={selectedItemRect}
        onTransitionComplete={handleTransitionComplete}
        phase={animationPhase}
        setPhase={setAnimationPhase}
      />
    </div>
  );
});

// Add display name for debugging
CategoryRows.displayName = 'CategoryRows';

export default CategoryRows;