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
  const [categoryItemsState, setCategoryItemsState] = useState([]); // Renamed to avoid conflict
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
  
  // Ref to store the category being navigated to, to stabilize handleTransitionComplete
  const navigatingCategoryRef = useRef(null);
  const isActiveTransitionRef = useRef(false); // Ref to track active transition for scrolling animation
  
  // New state for managing the transition overlay
  const [transitionTriggerData, setTransitionTriggerData] = useState({
    category: null,
    cardRect: null,
    isActive: false,
  });
  
  // Ref to control scrolling animation pause
  const pauseScrollingRef = useRef(false);
  
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
    // Use pauseScrollingRef to control animation loop
    if (document.hidden || pauseScrollingRef.current) {
      if (pauseScrollingRef.current && animationRef.current) {
        // If scrolling is paused, ensure we cancel the frame
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
        debugLog("Scroll animation PAUSED due to active transition.");
      } else if (document.hidden && !animationRef.current) {
        // If tab is hidden and animation not running, try to request a frame for when it becomes visible
        animationRef.current = requestAnimationFrame(animate);
      }
      return;
    }
    
    if (!animationRef.current && !pauseScrollingRef.current && !document.hidden){
        // If animation isn't scheduled but should be running
        animationRef.current = requestAnimationFrame(animate);
        return; // Exit and let the new frame handle it
    }

    if (!lastTimestampRef.current) {
      lastTimestampRef.current = timestamp;
      animationRef.current = requestAnimationFrame(animate); // Ensure next frame is scheduled
      return;
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
    setCategoryItemsState(prevItems => {
      // Safety check - if we somehow lost all items, refill
      if (prevItems.length === 0) {
        const containerWidth = containerRef.current?.offsetWidth || 1000;
        const itemsNeeded = Math.ceil(containerWidth / exactTotalWidth) + 4;
        
        const initialItems = [];
        for (let i = 0; i < itemsNeeded; i++) {
          const categoryIndex = i % categoriesData.length;
          const category = categoriesData[categoryIndex];
          initialItems.push({
            id: nextIdRef.current++,
            category: category,
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
      
      const moveAmount = speed * deltaTime / 16 * performanceMultiplier;
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
    
    // Schedule next frame if not paused
    if (!pauseScrollingRef.current) {
      animationRef.current = requestAnimationFrame(animate);
    } else {
      animationRef.current = null; // Ensure it's cleared if paused
    }
  }, [speed, direction, categoriesData, isMobileDevice, getCardDimensions]);
  
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
    if (categoryItemsState.length > 0 && wasVisibleRef.current) {
      return; // Don't refill if there are already items and the tab was visible
    }
    
    // Otherwise create fresh items
    const initialItems = [];
    
    for (let i = 0; i < itemsNeeded; i++) {
      const categoryIndex = i % categoriesData.length;
      const category = categoriesData[categoryIndex];
      initialItems.push({
        id: nextIdRef.current++,
        category: category,
        positionX: i * exactTotalWidth,
        // For mobile, initialize highlight states less frequently
        mobileHighlight: isMobileDevice ? (Math.random() < 0.15) : false, // Reduced from 0.3
        mobileHighlightEdge: ['top', 'right', 'bottom', 'left'][Math.floor(Math.random() * 4)],
        mobileHighlightIntensity: Math.random() * 0.7 + 0.3,
        mobileHighlightPosition: Math.random()
      });
    }
    
    setCategoryItemsState(initialItems);
    itemsStateRef.current = initialItems;

    // Start animation loop
    if (!pauseScrollingRef.current) {
        animationRef.current = requestAnimationFrame(animate);
    }
  }, [categoryItemsState, categoriesData, isMobileDevice, getCardDimensions]);
  
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
          if (categoryItemsState.length === 0) {
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
  }, [animate, categoryItemsState, fillBelt, selectedCategory]);
  
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
    if (e.key === 'Enter' || e.key === ' ') {
      const focusedItem = document.activeElement;
      if (focusedItem && focusedItem.dataset.categoryId) {
        const categoryId = focusedItem.dataset.categoryId;
        const category = categoriesData.find(cat => cat.id.toString() === categoryId);
        if (category) {
          const cardEl = focusedItem; // The focused item is the card element
          handleCategorySelect(category, cardEl);
        }
      }
    }
  };

  // Preload flag ref to prevent multiple preloads
  const preloadAttemptedRef = useRef(false);
  const navigationInProgressRef = useRef(false);
  const transitionInitiatedRef = useRef(false);
  const transitionStartTimeRef = useRef(0);

  const resetAllTransitionStates = useCallback(() => {
    setIsTransitioning(false);
    setSelectedCategory(null);
    navigatingCategoryRef.current = null;
    setAnimationPhase(0);
    setSelectedItemRect(null);
    navigationInProgressRef.current = false;
    transitionInitiatedRef.current = false;
    isActiveTransitionRef.current = false; // Reset the ref here
    debugLog("All transition states reset including isActiveTransitionRef");
  }, []);

  const handleCategorySelect = useCallback((category, cardElement) => {
    if (!cardElement) {
      debugLog("Error: Card element not provided for selection.", { category });
      return;
    }
    const rect = cardElement.getBoundingClientRect();
    debugLog("Category selected, preparing for transition:", { slug: category.slug, rect });
    
    // Pause scrolling animation by setting the ref
    pauseScrollingRef.current = true;
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }
    
    setTransitionTriggerData({
      category: category,
      cardRect: { // Pass a plain object for cardRect
        top: rect.top,
        left: rect.left,
        width: rect.width,
        height: rect.height,
      },
      isActive: true,
    });
  }, []);
  
  const safetyTimeoutRef = useRef(null);

  const handleTransitionComplete = useCallback(() => {
    try {
      if (navigationInProgressRef.current) {
        debugLog("Navigation already in progress, ignoring duplicate call to handleTransitionComplete");
        return;
      }
      
      const categoryToNavigate = navigatingCategoryRef.current;

      if (!categoryToNavigate) {
        console.error("[CategoryRows] No category found for navigation in handleTransitionComplete. Resetting.");
        resetAllTransitionStates();
        navigationInProgressRef.current = false;
        if (!animationRef.current && !isActiveTransitionRef.current) { // Check ref
             debugLog("Restarting scroll (no categoryToNavigate)");
             lastTimestampRef.current = 0;
             animationRef.current = requestAnimationFrame(animate);
        }
        return;
      }
      
      navigationInProgressRef.current = true;
      debugLog("Transition complete, navigating to shop page", { 
        category: categoryToNavigate.slug
      });
      
      if (safetyTimeoutRef.current) {
        clearTimeout(safetyTimeoutRef.current);
        safetyTimeoutRef.current = null;
      }
      
      navigate(`/shop?category=${categoryToNavigate.slug}`);
      
      setTimeout(() => {
        try {
          debugLog("Resetting animation state after navigation (handleTransitionComplete)");
          resetAllTransitionStates(); 

          if (!transitionInitiatedRef.current && !isTransitioning && !isActiveTransitionRef.current && !animationRef.current) { // check ref
            debugLog("Restarting continuous animation (handleTransitionComplete)");
            lastTimestampRef.current = 0; 
            animationRef.current = requestAnimationFrame(animate);
          }
          
          setTimeout(() => {
            navigationInProgressRef.current = false;
          }, 800);
        } catch (error) {
          console.error("Error resetting animation state in handleTransitionComplete timeout:", error);
          resetAllTransitionStates(); 
        }
      }, 100);
    } catch (error) {
      console.error("Error in handleTransitionComplete:", error);
      resetAllTransitionStates(); 
    }
  }, [navigate, animate, resetAllTransitionStates]);

  useEffect(() => {
    if (isTransitioning && selectedCategory && animationPhase === 2 && !preloadAttemptedRef.current) {
      preloadAttemptedRef.current = true;
      debugLog("Preloading shop data", { category: selectedCategory.slug });
    }
    if (!isTransitioning) {
      preloadAttemptedRef.current = false;
    }
  }, [isTransitioning, selectedCategory, animationPhase]);

  useEffect(() => {
    if (isTransitioning && selectedCategory && !navigationInProgressRef.current) {
      if (safetyTimeoutRef.current) { 
        clearTimeout(safetyTimeoutRef.current);
      }
      debugLog("Setting safety timeout for transition in CategoryRows", { phase: animationPhase });
      safetyTimeoutRef.current = setTimeout(() => {
        if (isTransitioning && !navigationInProgressRef.current && selectedCategory) { 
          debugLog("⚠️ Safety timeout triggered in CategoryRows - transition may be stuck", { 
            phase: animationPhase,
            category: selectedCategory.slug
          });
          
          if (animationRef.current) {
            cancelAnimationFrame(animationRef.current);
            animationRef.current = null;
          }
           handleTransitionComplete(); 

        }
      }, 3000); 
    } else if ((!isTransitioning || navigationInProgressRef.current) && safetyTimeoutRef.current) {
      debugLog("Clearing safety timeout in CategoryRows", {isTransitioning, navInProgress: navigationInProgressRef.current});
      clearTimeout(safetyTimeoutRef.current);
      safetyTimeoutRef.current = null;
    }

    return () => {
      if (safetyTimeoutRef.current) {
        clearTimeout(safetyTimeoutRef.current);
        safetyTimeoutRef.current = null;
      }
    };
  }, [isTransitioning, selectedCategory, animationPhase, handleTransitionComplete, resetAllTransitionStates]);

  useEffect(() => {
    // Update pauseScrollingRef when transitionTriggerData.isActive changes
    pauseScrollingRef.current = transitionTriggerData.isActive;
    if (!transitionTriggerData.isActive && !animationRef.current) {
      // If transition ended and animation isn't running, restart it
      debugLog("Transition ended, attempting to restart scroll animation.");
      lastTimestampRef.current = 0; // Reset timestamp to avoid jump
      animationRef.current = requestAnimationFrame(animate);
    }
  }, [transitionTriggerData.isActive]);

  // Memoized CategoryItems for performance
  const memoizedCategoryItems = React.useMemo(() => {
    const { cardWidth, rowHeight, cardSpacing } = getCardDimensions();
    return categoryItemsState.map((item, index) => ( // Use renamed state
      <CategoryItem
        key={item.id}
        category={item.category}
        cardWidth={cardWidth}
        rowHeight={rowHeight}
        cardSpacing={cardSpacing}
        direction={direction}
        isMobile={isMobileDevice}
        onCategorySelect={(category, cardEl) => handleCategorySelect(category, cardEl)} // Pass handler
        // Determine if this item is the one selected OR if another is selected
        isSelectedForTransition={transitionTriggerData.isActive && transitionTriggerData.category?.id === item.category.id}
        isAnotherItemSelected={transitionTriggerData.isActive && transitionTriggerData.category?.id !== item.category.id}
      />
    ));
  }, [categoryItemsState, getCardDimensions, direction, isMobileDevice, handleCategorySelect, transitionTriggerData]); // Added dependencies

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
          {memoizedCategoryItems}
        </div>
      </div>
      
      <TransitionOverlay
        isActive={transitionTriggerData.isActive}
        selectedCategoryData={transitionTriggerData.isActive ? { category: transitionTriggerData.category, cardRect: transitionTriggerData.cardRect } : null}
        onTransitionEnd={handleTransitionComplete}
        // Optionally pass theme color if needed by overlay early on
        // shopPageThemeColor={transitionTriggerData.category?.themeColor}
      />
    </div>
  );
});

// Add display name for debugging
CategoryRows.displayName = 'CategoryRows';

export default CategoryRows;