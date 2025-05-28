/**
 * CategoryRows Component
 * 
 * Creates a dynamic orbital category system with gravitational interactions,
 * where items float in multiple orbital rings and respond to user interaction.
 */

import React, { useRef, useEffect, useState, useCallback, memo } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { categories, additionalCategories } from '../../utils/mockData';
import { getOptimizedAnimationSettings } from '../../utils/animationHelpers';
import CategoryItem from './CategoryItem'; // Moved to separate component
import TransitionOverlay from './TransitionOverlay'; // Import new component

// Constants for layout
const CARD_WIDTH = 180; // Adjusted for orbital layout
const CARD_HEIGHT = 120; // Height for cards
const ORBITAL_LAYERS = 3; // Number of orbital rings
const MAX_ITEMS_PER_ORBIT = [8, 12, 16]; // Items per orbit (inner to outer)
const ORBIT_RADII = [150, 270, 390]; // Radii of orbits in pixels
const ORBIT_SPEEDS = [0.0005, 0.0003, 0.0002]; // Angular speeds (inner is faster)
const GRAVITY_STRENGTH = 0.2; // Strength of mouse gravity
const REPULSION_RADIUS = 80; // Distance for repulsion effect

// Mobile constants
const MOBILE_CARD_WIDTH = 120;
const MOBILE_CARD_HEIGHT = 80;
const MOBILE_ORBIT_RADII = [120, 200, 280];
const MOBILE_MAX_ITEMS_PER_ORBIT = [6, 9, 12];

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

// Generate a random position on an orbit
const getPositionOnOrbit = (angle, radius) => ({
  x: radius * Math.cos(angle),
  y: radius * Math.sin(angle)
});

const CategoryRows = memo(({ direction = "rtl", categoryItems: propCategories = null, title = "دسته‌بندی‌ها", subtitle = "مجموعه‌ای از محصولات منحصر به فرد در دسته‌بندی‌های مختلف" }) => {
  const containerRef = useRef(null);
  const centerRef = useRef({ x: 0, y: 0 });
  const [orbitalItems, setOrbitalItems] = useState([]);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isMouseInContainer, setIsMouseInContainer] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [selectedItemRect, setSelectedItemRect] = useState(null);
  const [animationPhase, setAnimationPhase] = useState(0);
  const isMobileDevice = useMobileDetection();
  const animationRef = useRef(null);
  const lastTimestampRef = useRef(0);
  const wasVisibleRef = useRef(true);
  const nextIdRef = useRef(1);
  const navigate = useNavigate();
  
  // Determine which categories to use
  const categoriesData = propCategories || (direction === "rtl" ? categories : additionalCategories);
  
  // Refs to store state for navigation
  const navigatingCategoryRef = useRef(null);
  const isActiveTransitionRef = useRef(false);
  const transitionInitiatedRef = useRef(false);
  const transitionStartTimeRef = useRef(0);
  const navigationInProgressRef = useRef(false);
  
  // Get appropriate dimensions based on device
  const getCardDimensions = useCallback(() => {
    return {
      cardWidth: isMobileDevice ? MOBILE_CARD_WIDTH : CARD_WIDTH,
      cardHeight: isMobileDevice ? MOBILE_CARD_HEIGHT : CARD_HEIGHT,
      orbitRadii: isMobileDevice ? MOBILE_ORBIT_RADII : ORBIT_RADII,
      maxItemsPerOrbit: isMobileDevice ? MOBILE_MAX_ITEMS_PER_ORBIT : MAX_ITEMS_PER_ORBIT
    };
  }, [isMobileDevice]);
  
  // Create orbital animation with gravitational effects
  const animate = useCallback((timestamp) => {
    if (document.hidden || isActiveTransitionRef.current) {
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
    
    // If too much time has passed, limit delta
    const maxDelta = 100; // ms - prevents huge jumps after tab switch
    const rawDelta = timestamp - lastTimestampRef.current;
    const deltaTime = Math.min(rawDelta, maxDelta);
    
    lastTimestampRef.current = timestamp;
    
    // Get the center coordinates of the container
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      centerRef.current = {
        x: rect.width / 2,
        y: rect.height / 2
      };
    }
    
    // Update orbital items positions
    setOrbitalItems(prevItems => {
      return prevItems.map(item => {
        // Calculate new orbital position
        let newAngle = item.angle + (ORBIT_SPEEDS[item.orbitIndex] * deltaTime);
        
        // Keep angle between 0 and 2π
        if (newAngle > Math.PI * 2) {
          newAngle -= Math.PI * 2;
        }
        
        // Base orbital position
        const orbitPosition = getPositionOnOrbit(
          newAngle,
          getCardDimensions().orbitRadii[item.orbitIndex]
        );
        
        // Apply gravitational effect if mouse is in container
        let gravitationalOffset = { x: 0, y: 0 };
        
        if (isMouseInContainer) {
          // Calculate distance between mouse and item
          const dx = mousePos.x - (centerRef.current.x + orbitPosition.x);
          const dy = mousePos.y - (centerRef.current.y + orbitPosition.y);
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          // Apply gravitational effect
          if (distance > 0) {
            // Direction unit vector
            const unitX = dx / distance;
            const unitY = dy / distance;
            
            let gravityFactor;
            if (distance < REPULSION_RADIUS) {
              // Repulsion when mouse is too close
              gravityFactor = -GRAVITY_STRENGTH * (REPULSION_RADIUS - distance) / REPULSION_RADIUS;
            } else {
              // Attraction when mouse is at a distance
              gravityFactor = GRAVITY_STRENGTH * Math.min(1, 800 / (distance * distance));
            }
            
            gravitationalOffset = {
              x: unitX * gravityFactor * 40,
              y: unitY * gravityFactor * 40
            };
          }
        }
        
        // Calculate final position with gravitational effects
        return {
          ...item,
          angle: newAngle,
          orbitPosition,
          position: {
            x: orbitPosition.x + gravitationalOffset.x,
            y: orbitPosition.y + gravitationalOffset.y
          }
        };
      });
    });
    
    animationRef.current = requestAnimationFrame(animate);
  }, [isMouseInContainer, mousePos, getCardDimensions]);
  
  // Initialize orbital items
  const initializeOrbitalItems = useCallback(() => {
    if (!containerRef.current) return;
    
    const { maxItemsPerOrbit } = getCardDimensions();
    const allItems = [];
    
    // Create items for each orbital layer
    for (let orbitIndex = 0; orbitIndex < ORBITAL_LAYERS; orbitIndex++) {
      const itemCount = maxItemsPerOrbit[orbitIndex];
      const angleIncrement = (Math.PI * 2) / itemCount;
      
      for (let i = 0; i < itemCount; i++) {
        // Distribute categories evenly
        const categoryIndex = nextIdRef.current % categoriesData.length;
        const angle = i * angleIncrement;
        
        // Calculate position on orbit
        const orbitPosition = getPositionOnOrbit(
          angle,
          getCardDimensions().orbitRadii[orbitIndex]
        );
        
        // Add item with orbital data
        allItems.push({
          id: nextIdRef.current++,
          category: categoriesData[categoryIndex],
          orbitIndex,
          angle,
          orbitPosition,
          position: { ...orbitPosition }, // Initial position is the orbital position
          // For visuals and hover effects
          mobileHighlight: isMobileDevice ? (Math.random() < 0.15) : false,
          mobileHighlightEdge: ['top', 'right', 'bottom', 'left'][Math.floor(Math.random() * 4)],
          mobileHighlightIntensity: Math.random() * 0.7 + 0.3,
          mobileHighlightPosition: Math.random()
        });
      }
    }
    
    setOrbitalItems(allItems);
  }, [categoriesData, getCardDimensions, isMobileDevice]);
  
  // Start and manage the animation
  useEffect(() => {
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
  }, [animate, selectedCategory]);
  
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
          
          // If no items are showing, reinitialize
          if (orbitalItems.length === 0) {
            initializeOrbitalItems();
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
  }, [animate, orbitalItems, initializeOrbitalItems, selectedCategory]);
  
  useEffect(() => {
    // Initial setup
    initializeOrbitalItems();
    
    // Set up resize handler with debounce
    let resizeTimer;
    const handleResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(initializeOrbitalItems, 100);
    };
    
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(resizeTimer);
    };
  }, [initializeOrbitalItems]);
  
  // Handle mouse movement for gravitational effects
  useEffect(() => {
    if (!containerRef.current) return;
    
    const handleMouseMove = (e) => {
      const rect = containerRef.current.getBoundingClientRect();
      setMousePos({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });
    };
    
    const handleMouseEnter = () => {
      setIsMouseInContainer(true);
    };
    
    const handleMouseLeave = () => {
      setIsMouseInContainer(false);
    };
    
    const container = containerRef.current;
    container.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('mouseenter', handleMouseEnter);
    container.addEventListener('mouseleave', handleMouseLeave);
    
    return () => {
      container.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('mouseenter', handleMouseEnter);
      container.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);
  
  // Get current card dimensions
  const { cardWidth, cardHeight } = getCardDimensions();
  
  // Reset all transition states
  const resetAllTransitionStates = useCallback(() => {
    setIsTransitioning(false);
    setSelectedCategory(null);
    navigatingCategoryRef.current = null;
    setAnimationPhase(0);
    setSelectedItemRect(null);
    navigationInProgressRef.current = false;
    transitionInitiatedRef.current = false;
    isActiveTransitionRef.current = false;
    debugLog("All transition states reset including isActiveTransitionRef");
  }, []);
  
  // Handle category selection
  const handleCategorySelect = useCallback((category, itemElement) => {
    try {
      const now = Date.now();
      const timeSinceLastTransition = now - transitionStartTimeRef.current;
      const MIN_TRANSITION_INTERVAL = 2500;

      if (navigationInProgressRef.current || 
          (transitionInitiatedRef.current && timeSinceLastTransition < MIN_TRANSITION_INTERVAL) || 
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
      
      if (isTransitioning || animationPhase !== 0) {
         debugLog("Resetting existing animation state before new selection");
         resetAllTransitionStates();
      }
      
      transitionInitiatedRef.current = true;
      isActiveTransitionRef.current = true;
      transitionStartTimeRef.current = now;
      
      debugLog("Category selected", { category: category.slug });
      
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
      
      if (itemElement && itemElement.current) {
        const rect = itemElement.current.getBoundingClientRect();
        setSelectedItemRect(rect);
      }
      
      setSelectedCategory(category);
      navigatingCategoryRef.current = category;
      setIsTransitioning(true); 
      setAnimationPhase(1);
      
      // Navigate after animation completes
      setTimeout(() => {
        navigationInProgressRef.current = true;
        navigate(`/shop/${category.slug}`);
      }, 800);
    } catch (e) {
      debugLog("Error in handleCategorySelect", e);
      resetAllTransitionStates();
    }
  }, [navigate, resetAllTransitionStates, isTransitioning, animationPhase]);
  
  // Handle transition completion
  const handleTransitionComplete = useCallback(() => {
    debugLog("Transition animation completed");
    resetAllTransitionStates();
  }, [resetAllTransitionStates]);
  
  return (
    <>
      <div className="relative w-full my-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-2">{title}</h2>
            <p className="text-gray-600">{subtitle}</p>
          </div>
        </div>
        
        {/* Orbital Container - using a square aspect ratio */}
        <div 
          ref={containerRef}
          className="relative w-full aspect-square max-h-[700px] max-w-[1000px] mx-auto overflow-hidden"
          style={{ direction: 'ltr' }} // Force LTR for positioning
        >
          {/* Central "sun" element */}
          <motion.div 
            className="absolute rounded-full bg-gradient-to-br from-amber-400 via-orange-500 to-pink-500 z-10"
            style={{ 
              top: '50%', 
              left: '50%', 
              width: isMobileDevice ? '40px' : '60px',
              height: isMobileDevice ? '40px' : '60px',
              marginTop: isMobileDevice ? '-20px' : '-30px',
              marginLeft: isMobileDevice ? '-20px' : '-30px',
              boxShadow: '0 0 40px rgba(255, 140, 0, 0.6)'
            }}
            animate={{
              scale: [1, 1.1, 1],
              boxShadow: [
                '0 0 40px rgba(255, 140, 0, 0.6)',
                '0 0 60px rgba(255, 140, 0, 0.8)',
                '0 0 40px rgba(255, 140, 0, 0.6)'
              ]
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          
          {/* Render orbital paths */}
          {ORBIT_RADII.map((radius, index) => (
            <div 
              key={`orbit-${index}`}
              className="absolute rounded-full border border-gray-200 opacity-20"
              style={{
                top: '50%',
                left: '50%',
                width: isMobileDevice ? MOBILE_ORBIT_RADII[index] * 2 : radius * 2,
                height: isMobileDevice ? MOBILE_ORBIT_RADII[index] * 2 : radius * 2,
                marginTop: isMobileDevice ? -MOBILE_ORBIT_RADII[index] : -radius,
                marginLeft: isMobileDevice ? -MOBILE_ORBIT_RADII[index] : -radius
              }}
            />
          ))}
          
          {/* Render orbital items */}
          {orbitalItems.map((item) => {
            const xPos = centerRef.current.x + item.position.x;
            const yPos = centerRef.current.y + item.position.y;
            
            // Calculate a distance-based z-index to preserve proper layering
            // Outer orbits should be behind inner orbits
            const zIndex = 100 - Math.floor(item.orbitIndex * 10);
            
            return (
              <motion.div
                key={item.id}
                className="absolute"
                style={{
                  top: 0,
                  left: 0,
                  transform: `translate(${xPos - cardWidth/2}px, ${yPos - cardHeight/2}px)`,
                  zIndex
                }}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ 
                  opacity: 1, 
                  scale: 1,
                  rotate: [0, Math.random() * 3 - 1.5]
                }}
                transition={{
                  duration: 0.8,
                  ease: "easeOut",
                  rotate: {
                    duration: 4,
                    repeat: Infinity,
                    repeatType: "reverse",
                    ease: "easeInOut"
                  }
                }}
              >
                <CategoryItem 
                  category={item.category}
                  cardWidth={cardWidth}
                  cardHeight={cardHeight}
                  isMobile={isMobileDevice}
                  mobileHighlight={item.mobileHighlight}
                  mobileHighlightEdge={item.mobileHighlightEdge}
                  mobileHighlightIntensity={item.mobileHighlightIntensity}
                  mobileHighlightPosition={item.mobileHighlightPosition}
                  onCategorySelect={handleCategorySelect}
                  isSelected={selectedCategory?.slug === item.category.slug}
                  isTransitioning={isTransitioning}
                  animationPhase={animationPhase}
                />
              </motion.div>
            );
          })}
        </div>
      </div>
      
      {/* Transition overlay for category selection */}
      {isTransitioning && (
        <TransitionOverlay 
          initialRect={selectedItemRect}
          category={selectedCategory}
          onTransitionComplete={handleTransitionComplete}
          animationPhase={animationPhase}
          setAnimationPhase={setAnimationPhase}
        />
      )}
    </>
  );
});

export default CategoryRows;