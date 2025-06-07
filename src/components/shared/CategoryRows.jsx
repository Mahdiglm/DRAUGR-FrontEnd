/**
 * CategoryRows Component
 * 
 * Refined horizontal scrolling category section with elegant design
 * and sophisticated micro-interactions.
 */

import React, { useRef, useEffect, useState, useCallback, memo } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { mockData } from '../../utils/mockData';
import { getOptimizedAnimationSettings } from '../../utils/animationHelpers';
import CategoryItem from './CategoryItem';
import TransitionOverlay from './TransitionOverlay';

// Refined layout constants with improved proportions
const CARD_WIDTH = 280; // Increased for better content display
const CARD_HEIGHT = 140; // Refined aspect ratio
const CARD_MARGIN = 0;
const CARD_TOTAL_WIDTH = CARD_WIDTH + CARD_MARGIN;

// Mobile constants with optimized dimensions
const MOBILE_CARD_WIDTH = 180;
const MOBILE_CARD_HEIGHT = 100;
const MOBILE_CARD_MARGIN = 0;
const MOBILE_CARD_TOTAL_WIDTH = MOBILE_CARD_WIDTH + MOBILE_CARD_MARGIN;

// Refined spacing for visual breathing room
const CARD_SPACING = 24; // Reduced for tighter, more elegant layout
const MOBILE_CARD_SPACING = 16; // Optimized mobile spacing

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
      const categoriesData = propCategories || mockData.categories;
  
  // Reduce animation speed on low-performance devices
  const defaultSpeed = getOptimizedAnimationSettings(
    { speed: 0.8 },     // Default settings for high-performance devices
    { speed: 0.5 }      // Reduced speed for low-performance devices
  ).speed;
  
  // Ref to store the category being navigated to, to stabilize handleTransitionComplete
  const navigatingCategoryRef = useRef(null);
  const isActiveTransitionRef = useRef(false); // Ref to track active transition for scrolling animation
  
  // Get refined card dimensions with improved proportions
  const getCardDimensions = useCallback(() => {
    return {
      cardWidth: isMobileDevice ? MOBILE_CARD_WIDTH : CARD_WIDTH,
      cardHeight: isMobileDevice ? MOBILE_CARD_HEIGHT : CARD_HEIGHT,
      cardMargin: isMobileDevice ? MOBILE_CARD_MARGIN : CARD_MARGIN,
      cardTotalWidth: isMobileDevice ? MOBILE_CARD_WIDTH + MOBILE_CARD_SPACING : CARD_WIDTH + CARD_SPACING,
      rowHeight: isMobileDevice ? MOBILE_CARD_HEIGHT + 20 : CARD_HEIGHT + 40, // Refined heights with proper padding
      cardSpacing: isMobileDevice ? MOBILE_CARD_SPACING : CARD_SPACING
    };
  }, [isMobileDevice]);
  
  // Create animation frame handler with performance optimizations
  const animate = useCallback((timestamp) => {
    if (document.hidden || isActiveTransitionRef.current) { // Use ref here
      if (isActiveTransitionRef.current && animationRef.current) {
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
  const { cardWidth, cardHeight, rowHeight } = getCardDimensions();

  // Handle keyboard navigation with refined speed adjustments
  const handleKeyDown = (e) => {
    if (e.key === 'ArrowLeft') {
      setSpeed(currentSpeed => Math.max(0.2, currentSpeed * 0.85));
    } else if (e.key === 'ArrowRight') {
      setSpeed(currentSpeed => Math.min(2.0, currentSpeed * 1.15));
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

  const handleCategorySelect = useCallback((category, itemElement) => {
    try {
      const now = Date.now();
      const timeSinceLastTransition = now - transitionStartTimeRef.current;
      const MIN_TRANSITION_INTERVAL = 2500; // Increased interval slightly

      if (navigationInProgressRef.current || 
          (transitionInitiatedRef.current && timeSinceLastTransition < MIN_TRANSITION_INTERVAL) || // More robust check
          (isTransitioning && timeSinceLastTransition < MIN_TRANSITION_INTERVAL) 
      ) {
        debugLog("Ignoring category selection due to active/recent transition or navigation", { 
          navInProgress: navigationInProgressRef.current,
          transitionInitiated: transitionInitiatedRef.current,
          isTrans: isTransitioning,
          timeSinceLast: timeSinceLastTransition
        });
        return;
      }
      
      // If a transition is technically ongoing but the MIN_TRANSITION_INTERVAL has passed,
      // allow a reset and new selection.
      if (isTransitioning || animationPhase !== 0) {
         debugLog("Resetting existing (possibly stale) animation state before new selection");
         resetAllTransitionStates();
      }
      
      transitionInitiatedRef.current = true;
      isActiveTransitionRef.current = true; // Set ref here
      transitionStartTimeRef.current = now;
      
      debugLog("Category selected", { category: category.slug });
      
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
        debugLog("Scrolling animation stopped for transition");
      }
      
      if (itemElement && itemElement.current) {
        const rect = itemElement.current.getBoundingClientRect();
        setSelectedItemRect(rect);
      } else {
        debugLog("⚠️ Failed to capture card position");
      }
      
      setSelectedCategory(category);
      navigatingCategoryRef.current = category;
      setIsTransitioning(true); 
      setAnimationPhase(1); 
      
      debugLog("Transition initiated in CategoryRows");
    } catch (error) {
      console.error("Error in handleCategorySelect:", error);
      resetAllTransitionStates();
    }
  }, [resetAllTransitionStates, animationPhase, isTransitioning]);
  
  const safetyTimeoutRef = useRef(null);

  const handleTransitionComplete = useCallback(({ stage, keepAnimationAlive, canceled }) => {
    try {
      if (navigationInProgressRef.current && !canceled) {
        debugLog("Navigation already in progress, ignoring duplicate call to handleTransitionComplete");
        return;
      }
      
      // Handle cancellation (user unselected the category)
      if (canceled) {
        debugLog("Transition was canceled by user, resetting state");
        resetAllTransitionStates();
        
        // Restart the continuous animation
        if (!animationRef.current) {
          debugLog("Restarting continuous animation after cancellation");
          lastTimestampRef.current = 0;
          animationRef.current = requestAnimationFrame(animate);
        }
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
        <div className="w-full mb-8 md:mb-12 px-4">
          <motion.div
            className="text-center mb-6 md:mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Elegant decorative element */}
            <motion.div
              className="inline-flex items-center gap-3 mb-4 md:mb-6"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.2 }}
            >
              <div className="w-8 h-[1px] bg-gradient-to-r from-transparent to-red-500/50"></div>
              <div className="w-1.5 h-1.5 bg-red-500/70 rounded-full animate-pulse"></div>
              <div className="w-8 h-[1px] bg-gradient-to-l from-transparent to-red-500/50"></div>
            </motion.div>
            
            <motion.h2 
              className={`${isMobileDevice ? 'text-2xl' : 'text-3xl md:text-4xl'} font-light text-white mb-3 md:mb-4 tracking-wide`}
              style={{
                background: 'linear-gradient(135deg, #ffffff 0%, #f8f8f8 50%, #e8e8e8 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              {title}
            </motion.h2>
            
            <motion.p 
              className={`text-gray-400/90 max-w-2xl mx-auto leading-relaxed font-light ${isMobileDevice ? 'text-sm' : 'text-base md:text-lg'}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              {subtitle}
            </motion.p>
            
            {/* Subtle underline */}
            <motion.div
              className="mt-4 md:mt-6 w-12 h-[1px] bg-gradient-to-r from-transparent via-red-500/30 to-transparent mx-auto"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 1, delay: 0.7 }}
            ></motion.div>
          </motion.div>
        </div>
      )}
      
      <div 
        ref={containerRef}
        className="relative w-screen overflow-hidden mx-0 px-0"
        style={{ 
          maskImage: direction === "rtl" 
            ? 'linear-gradient(to right, transparent 0%, black 5%, black 95%, transparent 100%)'
            : 'linear-gradient(to left, transparent 0%, black 5%, black 95%, transparent 100%)',
          WebkitMaskImage: direction === "rtl" 
            ? 'linear-gradient(to right, transparent 0%, black 5%, black 95%, transparent 100%)'
            : 'linear-gradient(to left, transparent 0%, black 5%, black 95%, transparent 100%)',
          width: '100vw',
          maxWidth: '100vw',
          marginRight: '0',
          paddingRight: '0'
        }}
        aria-live="polite"
      >
        {/* Left side gradient overlay */}
        <div 
          className="absolute top-0 left-0 h-full w-[150px] z-10 pointer-events-none"
          style={{ 
            background: 'linear-gradient(to right, rgb(0, 0, 0) 0%, rgba(0, 0, 0, 0.95) 40%, rgba(0, 0, 0, 0) 100%)'
          }}
          aria-hidden="true"
        />
        
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
        
        {/* Right side gradient overlay */}
        <div 
          className="absolute top-0 right-0 h-full w-[150px] z-10 pointer-events-none"
          style={{ 
            background: 'linear-gradient(to left, rgb(0, 0, 0) 0%, rgba(0, 0, 0, 0.95) 40%, rgba(0, 0, 0, 0) 100%)'
          }}
          aria-hidden="true"
        />
      </div>
      
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