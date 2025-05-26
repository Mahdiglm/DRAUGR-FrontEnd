/**
 * CategoryRows Component
 * 
 * Creates a horizontally scrolling category section with dynamically generated items
 * and interactive proximity-based hover effects.
 */

import React, { useRef, useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { categories, additionalCategories } from '../../utils/mockData';
import { getOptimizedAnimationSettings } from '../../utils/animationHelpers';

// Constants for layout - moved to global scope for reuse
const CARD_WIDTH = 224; // 56px * 4 (actual width)
const CARD_MARGIN = 32;  // 16px on each side (mx-4)
const CARD_TOTAL_WIDTH = CARD_WIDTH + CARD_MARGIN; // Total width including margins

// Mobile detection helper
const isMobile = () => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth < 768;
};

const CategoryRows = ({ direction = "rtl", categoryItems: propCategories = null, title = "دسته‌بندی‌ها", subtitle = "مجموعه‌ای از محصولات منحصر به فرد در دسته‌بندی‌های مختلف" }) => {
  const containerRef = useRef(null);
  const beltRef = useRef(null);
  const [categoryItems, setCategoryItems] = useState([]);
  const [speed, setSpeed] = useState(1); // pixels per frame
  const [isMobileDevice, setIsMobileDevice] = useState(false);
  const animationRef = useRef(null);
  const lastTimestampRef = useRef(0);
  const wasVisibleRef = useRef(true);
  const itemsStateRef = useRef([]); // Reference to keep track of items state for visibility changes
  
  // Track the next ID for new items
  const nextIdRef = useRef(1);
  
  // Determine which categories to use
  const categoriesData = propCategories || (direction === "rtl" ? categories : additionalCategories);
  
  // Control animation speed based on device performance
  const defaultSpeed = getOptimizedAnimationSettings(
    { speed: 0.5 },     // Default settings for high-performance devices
    { speed: 0.3 }      // Reduced speed for low-performance devices
  ).speed;

  // Check for mobile device on component mount
  useEffect(() => {
    setIsMobileDevice(isMobile());
    const handleResize = () => {
      setIsMobileDevice(isMobile());
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  // Create animation frame handler - defined first to avoid reference errors
  const animate = useCallback((timestamp) => {
    // Skip animation if tab is not visible
    if (document.hidden) {
      animationRef.current = requestAnimationFrame(animate);
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
    
    // Move each item based on direction
    setCategoryItems(prevItems => {
      // Safety check - if we somehow lost all items, refill
      if (prevItems.length === 0) {
        const containerWidth = containerRef.current?.offsetWidth || 1000;
        const itemsNeeded = Math.ceil(containerWidth / CARD_TOTAL_WIDTH) + 4;
        
        const initialItems = [];
        for (let i = 0; i < itemsNeeded; i++) {
          const categoryIndex = i % categoriesData.length;
          initialItems.push({
            id: nextIdRef.current++,
            category: categoriesData[categoryIndex],
            positionX: i * CARD_TOTAL_WIDTH,
            // For mobile, initialize random highlight state
            mobileHighlight: isMobileDevice ? (Math.random() < 0.2) : false,
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
      
      // Move all items according to direction
      const movedItems = prevItems.map(item => {
        // For mobile devices, occasionally update random highlight state
        let updatedItem = { ...item };
        
        if (isMobileDevice && Math.random() < 0.005) {
          // Randomly update mobile highlight states
          updatedItem.mobileHighlight = Math.random() < 0.3;
          updatedItem.mobileHighlightEdge = ['top', 'right', 'bottom', 'left'][Math.floor(Math.random() * 4)];
          updatedItem.mobileHighlightIntensity = Math.random() * 0.7 + 0.3;
          updatedItem.mobileHighlightPosition = Math.random();
        }
        
        return {
          ...updatedItem,
          positionX: item.positionX + (moveAmount * moveDirection)
        };
      });
      
      // Check if we need to add a new item or remove old ones
      if (!containerRef.current) return movedItems;
      
      const containerWidth = containerRef.current.offsetWidth;
      
      // Find relevant edge items based on direction
      let edgeItem, removeCondition, newItemPosition;
      
      if (direction === "rtl") {
        // Right to left scrolling (default)
        // Find the rightmost item
        edgeItem = movedItems.reduce(
          (max, item) => item.positionX > max.positionX ? item : max, 
          { positionX: -Infinity }
        );
        
        // Add new item at the right if needed
        removeCondition = item => item.positionX > -CARD_TOTAL_WIDTH;
        newItemPosition = edgeItem.positionX + CARD_TOTAL_WIDTH;
      } else {
        // Left to right scrolling (opposite direction)
        // Find the leftmost item
        edgeItem = movedItems.reduce(
          (min, item) => item.positionX < min.positionX ? item : min, 
          { positionX: Infinity }
        );
        
        // Add new item at the left if needed
        removeCondition = item => item.positionX < containerWidth + CARD_TOTAL_WIDTH;
        newItemPosition = edgeItem.positionX - CARD_TOTAL_WIDTH;
      }
      
      const newItems = [...movedItems];
      
      // If the edge item has moved in enough, add a new item at the appropriate end
      const needNewItem = direction === "rtl" 
        ? edgeItem.positionX < containerWidth + CARD_MARGIN
        : edgeItem.positionX > -CARD_MARGIN;
        
      if (needNewItem) {
        // Determine the category index
        const categoryIndex = nextIdRef.current % categoriesData.length;
        
        // Add a new item
        newItems.push({
          id: nextIdRef.current++,
          category: categoriesData[categoryIndex],
          positionX: newItemPosition,
          // For mobile, initialize random highlight state
          mobileHighlight: isMobileDevice ? (Math.random() < 0.2) : false,
          mobileHighlightEdge: ['top', 'right', 'bottom', 'left'][Math.floor(Math.random() * 4)],
          mobileHighlightIntensity: Math.random() * 0.7 + 0.3,
          mobileHighlightPosition: Math.random()
        });
      }
      
      // Remove items that have moved completely off the visible area
      const filteredItems = newItems.filter(removeCondition);
      
      // Update our ref to the current state for recovering after tab switches
      itemsStateRef.current = filteredItems;
      
      return filteredItems;
    });
    
    animationRef.current = requestAnimationFrame(animate);
  }, [speed, direction, categoriesData, isMobileDevice]);
  
  // Initialize category items - this will run on mount and when tab visibility changes
  const fillBelt = useCallback(() => {
    if (!containerRef.current) return;
    
    // Calculate how many items we need to fill the container width plus buffer
    const containerWidth = containerRef.current.offsetWidth;
    const itemsNeeded = Math.ceil(containerWidth / CARD_TOTAL_WIDTH) + 4; // +4 for buffer
    
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
        positionX: i * CARD_TOTAL_WIDTH,
        // For mobile, initialize random highlight state
        mobileHighlight: isMobileDevice ? (Math.random() < 0.2) : false,
        mobileHighlightEdge: ['top', 'right', 'bottom', 'left'][Math.floor(Math.random() * 4)],
        mobileHighlightIntensity: Math.random() * 0.7 + 0.3,
        mobileHighlightPosition: Math.random()
      });
    }
    
    setCategoryItems(initialItems);
    itemsStateRef.current = initialItems;
  }, [categoryItems, categoriesData, isMobileDevice]);
  
  // Start and manage the animation
  useEffect(() => {
    // Use slower speed on mobile
    setSpeed(isMobileDevice ? defaultSpeed * 0.8 : defaultSpeed);
    
    // Start animation
    animationRef.current = requestAnimationFrame(animate);
    
    // Clean up animation
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [animate, defaultSpeed, isMobileDevice]);
  
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
          if (!animationRef.current) {
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
  }, [animate, categoryItems, fillBelt]);
  
  useEffect(() => {
    // Initial setup
    fillBelt();
    
    // Set up resize handler
    window.addEventListener('resize', fillBelt);
    return () => window.removeEventListener('resize', fillBelt);
  }, [fillBelt]);
  
  // Handle mouse movement to adjust speed - only for desktop
  useEffect(() => {
    if (isMobileDevice) return; // Skip for mobile devices
    
    const handleMouseMove = (e) => {
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

  return (
    <div className="py-2 sm:py-3 md:py-4 w-screen min-w-full max-w-none relative overflow-hidden mx-0 px-0"
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
    >
      {(title.trim() || subtitle.trim()) && (
        <div className="w-full mb-6">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-100 mb-2 pl-4">
            {title}
          </h2>
          <p className="text-gray-400 pl-4">
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
      >
        <div 
          ref={beltRef}
          className="relative h-48 w-screen"
          style={{
            width: '100vw',
            maxWidth: '100vw'
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
                width: `${CARD_WIDTH}px`
              }}
              cardWidth={CARD_WIDTH}
              isMobile={isMobileDevice}
              mobileHighlight={item.mobileHighlight}
              mobileHighlightEdge={item.mobileHighlightEdge}
              mobileHighlightIntensity={item.mobileHighlightIntensity}
              mobileHighlightPosition={item.mobileHighlightPosition}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

// Generate a point on a circuit path based on the given parameters
const generateCircuitPoint = (angle, radius, centerX, centerY, variation = 0) => {
  // Add some randomness for more organic circuit paths
  const adjustedRadius = radius * (1 + variation * (Math.random() * 0.4 - 0.2));
  const adjustedAngle = angle + variation * (Math.random() * 0.2 - 0.1);
  
  return {
    x: centerX + adjustedRadius * Math.cos(adjustedAngle),
    y: centerY + adjustedRadius * Math.sin(adjustedAngle)
  };
};

// Generate SVG path for circuit trace
const generateCircuitPath = (startX, startY, endX, endY) => {
  // Calculate midpoint with some variation
  const midX = (startX + endX) / 2 + (Math.random() * 10 - 5);
  const midY = (startY + endY) / 2 + (Math.random() * 10 - 5);
  
  // Circuit paths with corners rather than curves
  if (Math.random() > 0.5) {
    return `M${startX},${startY} L${midX},${startY} L${midX},${endY} L${endX},${endY}`;
  } else {
    return `M${startX},${startY} L${startX},${midY} L${endX},${midY} L${endX},${endY}`;
  }
};

const CategoryItem = ({ 
  category, 
  style, 
  cardWidth, 
  isMobile, 
  mobileHighlight,
  mobileHighlightEdge,
  mobileHighlightIntensity,
  mobileHighlightPosition,
  ...props 
}) => {
  const itemRef = useRef(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isNear, setIsNear] = useState(false);
  const [proximityData, setProximityData] = useState({
    edge: null,
    distance: 100,
    intensity: 0,
    position: 0,
  });
  
  // Settings
  const proximityThreshold = 60; // How close the mouse needs to be to activate border effect
  const borderWidth = 2; // Width of the border in pixels
  
  // Track global mouse position to detect proximity only on non-mobile devices
  useEffect(() => {
    if (isMobile) {
      // For mobile, we'll use the pre-calculated random values
      if (mobileHighlight) {
        setIsNear(true);
        setProximityData({
          edge: mobileHighlightEdge,
          distance: 10, // Close distance to ensure visibility
          intensity: mobileHighlightIntensity,
          position: mobileHighlightPosition
        });
      } else {
        setIsNear(false);
      }
      return; // Skip the rest for mobile
    }
    
    const handleGlobalMouseMove = (e) => {
      if (!itemRef.current) return;
      
      const rect = itemRef.current.getBoundingClientRect();
      
      // Calculate mouse position relative to item
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      // Update mouse position state
      setMousePos({ x, y });
      
      // Check if we're close to the item (even outside its borders)
      const isNearItem = 
        x >= -proximityThreshold && x <= rect.width + proximityThreshold &&
        y >= -proximityThreshold && y <= rect.height + proximityThreshold;
      
      // Only proceed if we're near the item
      if (!isNearItem) {
        if (isNear) setIsNear(false); // Reset if we were previously near
        return;
      }
      
      // Calculate distances to each edge
      const distToLeft = Math.abs(x);
      const distToRight = Math.abs(x - rect.width);
      const distToTop = Math.abs(y);
      const distToBottom = Math.abs(y - rect.height);
      
      // Find closest edge and its distance
      let closestEdge;
      let minDistance;
      
      // Check if we're inside the item
      const isInside = x >= 0 && x <= rect.width && y >= 0 && y <= rect.height;
      
      if (isInside) {
        // When inside, check distance to each edge
        const edges = [
          { edge: 'left', dist: distToLeft },
          { edge: 'right', dist: distToRight },
          { edge: 'top', dist: distToTop },
          { edge: 'bottom', dist: distToBottom }
        ];
        
        // Sort by distance
        edges.sort((a, b) => a.dist - b.dist);
        closestEdge = edges[0].edge;
        minDistance = edges[0].dist;
      } else {
        // When outside, calculate distance to closest point on border
        // Determine which quadrant we're in
        if (x < 0 && y < 0) {
          // Top-left corner
          closestEdge = 'topLeft';
          minDistance = Math.sqrt(distToLeft * distToLeft + distToTop * distToTop);
        } else if (x > rect.width && y < 0) {
          // Top-right corner
          closestEdge = 'topRight';
          minDistance = Math.sqrt(distToRight * distToRight + distToTop * distToTop);
        } else if (x < 0 && y > rect.height) {
          // Bottom-left corner
          closestEdge = 'bottomLeft';
          minDistance = Math.sqrt(distToLeft * distToLeft + distToBottom * distToBottom);
        } else if (x > rect.width && y > rect.height) {
          // Bottom-right corner
          closestEdge = 'bottomRight';
          minDistance = Math.sqrt(distToRight * distToRight + distToBottom * distToBottom);
        } else if (x < 0) {
          // Left edge
          closestEdge = 'left';
          minDistance = distToLeft;
        } else if (x > rect.width) {
          // Right edge
          closestEdge = 'right';
          minDistance = distToRight;
        } else if (y < 0) {
          // Top edge
          closestEdge = 'top';
          minDistance = distToTop;
        } else {
          // Bottom edge
          closestEdge = 'bottom';
          minDistance = distToBottom;
        }
      }
      
      // Calculate intensity based on proximity (1 when at edge, 0 when beyond threshold)
      const intensity = Math.max(0, 1 - (minDistance / proximityThreshold));
      
      // Only consider "near" if within threshold
      const near = minDistance < proximityThreshold;
      
      if (near) {
        setIsNear(true);
        setProximityData({
          edge: closestEdge,
          distance: minDistance,
          intensity,
          position: getPositionAlongEdge(closestEdge, x, y, rect.width, rect.height)
        });
      } else if (isNear) {
        setIsNear(false);
      }
    };
    
    // Add global mouse move listener
    window.addEventListener('mousemove', handleGlobalMouseMove);
    
    return () => {
      window.removeEventListener('mousemove', handleGlobalMouseMove);
    };
  }, [isNear, proximityThreshold, isMobile, mobileHighlight, mobileHighlightEdge, mobileHighlightIntensity, mobileHighlightPosition]);
  
  // Calculate the relative position along an edge (0 to 1)
  const getPositionAlongEdge = (edge, x, y, width, height) => {
    switch (edge) {
      case 'top': return x / width;
      case 'right': return y / height;
      case 'bottom': return 1 - (x / width); // Reverse direction for consistency
      case 'left': return 1 - (y / height); // Reverse direction for consistency
      case 'topLeft': return Math.min(x / width, y / height) * 0.5;
      case 'topRight': return Math.min(1 - (x / width), y / height) * 0.5;
      case 'bottomLeft': return Math.min(x / width, 1 - (y / height)) * 0.5;
      case 'bottomRight': return Math.min(1 - (x / width), 1 - (y / height)) * 0.5;
      default: return 0;
    }
  };
  
  // Render just the border segments that are close to the cursor
  const renderBorderSegments = () => {
    if (!isNear) return null;
    
    const { edge, intensity, position } = proximityData;
    const glowColor = '#ff0066';
    
    // Calculate the length of the segment to highlight (as percentage of edge)
    // The segment is shorter when closer to the edge for more precise effect
    const segmentLength = 20 + (1 - intensity) * 50; // Between 20% and 70% of edge
    
    // Position the segment centered on the cursor's closest point
    const halfSegment = segmentLength / 2;
    const startPercent = Math.max(0, position * 100 - halfSegment);
    const endPercent = Math.min(100, position * 100 + halfSegment);
    
    // Base style for border segments
    const segmentStyle = {
      position: 'absolute',
      backgroundColor: glowColor,
      boxShadow: `0 0 ${6 * intensity}px ${glowColor}`,
      filter: `drop-shadow(0 0 ${4 * intensity}px ${glowColor})`,
      opacity: intensity,
      pointerEvents: 'none',
    };
    
    // For corners, we need to handle both connecting edges
    if (edge.includes('Left') || edge.includes('Right') || edge.includes('Top') || edge.includes('Bottom')) {
      return renderCornerSegments(edge, intensity);
    }
    
    // Render the appropriate segment based on which edge is closest
    switch (edge) {
      case 'top':
        return (
          <div 
            className="absolute top-0 rounded-t-lg overflow-hidden"
            style={{
              ...segmentStyle,
              height: `${borderWidth}px`,
              left: `${startPercent}%`,
              width: `${endPercent - startPercent}%`,
            }}
          />
        );
      
      case 'right':
        return (
          <div 
            className="absolute right-0 rounded-r-lg overflow-hidden"
            style={{
              ...segmentStyle,
              width: `${borderWidth}px`,
              top: `${startPercent}%`,
              height: `${endPercent - startPercent}%`,
            }}
          />
        );
      
      case 'bottom':
        return (
          <div 
            className="absolute bottom-0 rounded-b-lg overflow-hidden"
            style={{
              ...segmentStyle,
              height: `${borderWidth}px`,
              right: `${startPercent}%`,
              width: `${endPercent - startPercent}%`,
            }}
          />
        );
      
      case 'left':
        return (
          <div 
            className="absolute left-0 rounded-l-lg overflow-hidden"
            style={{
              ...segmentStyle,
              width: `${borderWidth}px`,
              bottom: `${startPercent}%`,
              height: `${endPercent - startPercent}%`,
            }}
          />
        );
      
      default:
        return null;
    }
  };
  
  // Handle corner segments with two connecting edges
  const renderCornerSegments = (corner, intensity) => {
    const glowColor = '#ff0066';
    const cornerSize = Math.min(40, 30 + intensity * 20); // Corner size varies with intensity
    
    // Base style for corner segments
    const segmentStyle = {
      position: 'absolute',
      backgroundColor: glowColor,
      boxShadow: `0 0 ${6 * intensity}px ${glowColor}`,
      filter: `drop-shadow(0 0 ${4 * intensity}px ${glowColor})`,
      opacity: intensity,
      pointerEvents: 'none',
    };
    
    switch (corner) {
      case 'topLeft':
        return (
          <>
            {/* Top segment */}
            <div 
              style={{
                ...segmentStyle,
                top: 0,
                left: 0,
                height: `${borderWidth}px`,
                width: `${cornerSize}px`,
                borderTopLeftRadius: '8px',
              }}
            />
            {/* Left segment */}
            <div 
              style={{
                ...segmentStyle,
                top: 0,
                left: 0,
                width: `${borderWidth}px`,
                height: `${cornerSize}px`,
                borderTopLeftRadius: '8px',
              }}
            />
          </>
        );
      
      case 'topRight':
        return (
          <>
            {/* Top segment */}
            <div 
              style={{
                ...segmentStyle,
                top: 0,
                right: 0,
                height: `${borderWidth}px`,
                width: `${cornerSize}px`,
                borderTopRightRadius: '8px',
              }}
            />
            {/* Right segment */}
            <div 
              style={{
                ...segmentStyle,
                top: 0,
                right: 0,
                width: `${borderWidth}px`,
                height: `${cornerSize}px`,
                borderTopRightRadius: '8px',
              }}
            />
          </>
        );
      
      case 'bottomLeft':
        return (
          <>
            {/* Bottom segment */}
            <div 
              style={{
                ...segmentStyle,
                bottom: 0,
                left: 0,
                height: `${borderWidth}px`,
                width: `${cornerSize}px`,
                borderBottomLeftRadius: '8px',
              }}
            />
            {/* Left segment */}
            <div 
              style={{
                ...segmentStyle,
                bottom: 0,
                left: 0,
                width: `${borderWidth}px`,
                height: `${cornerSize}px`,
                borderBottomLeftRadius: '8px',
              }}
            />
          </>
        );
      
      case 'bottomRight':
        return (
          <>
            {/* Bottom segment */}
            <div 
              style={{
                ...segmentStyle,
                bottom: 0,
                right: 0,
                height: `${borderWidth}px`,
                width: `${cornerSize}px`,
                borderBottomRightRadius: '8px',
              }}
            />
            {/* Right segment */}
            <div 
              style={{
                ...segmentStyle,
                bottom: 0,
                right: 0,
                width: `${borderWidth}px`,
                height: `${cornerSize}px`,
                borderBottomRightRadius: '8px',
              }}
            />
          </>
        );
      
      default:
        return null;
    }
  };
  
  // Render flowing circuit trace effect
  const renderCircuitTrace = () => {
    if (!isNear) return null;
    
    const { edge, intensity, position } = proximityData;
    
    // Use simpler paths for mobile (less intensive)
    const simplifiedForMobile = isMobile;
    
    return (
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none z-10"
        viewBox={`0 0 ${cardWidth} 160`}
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Circuit lines vary based on which edge is active */}
        {edge === 'top' && (
          <path
            d={simplifiedForMobile 
              ? `M${position * cardWidth},${borderWidth} v6` 
              : `M${position * cardWidth},${borderWidth} v6 h${intensity * 15}`}
            stroke="#ff0066"
            strokeWidth="1"
            fill="none"
            strokeDasharray={simplifiedForMobile ? "3,3" : "4,3"}
            style={{
              opacity: intensity * 0.7,
              filter: `drop-shadow(0 0 2px #ff0066)`,
              animation: 'dashOffset 2s linear infinite',
            }}
          />
        )}
        
        {edge === 'right' && (
          <path
            d={simplifiedForMobile 
              ? `M${cardWidth - borderWidth},${position * 160} h-6` 
              : `M${cardWidth - borderWidth},${position * 160} h-6 v${intensity * 15}`}
            stroke="#ff0066"
            strokeWidth="1"
            fill="none"
            strokeDasharray={simplifiedForMobile ? "3,3" : "4,3"}
            style={{
              opacity: intensity * 0.7,
              filter: `drop-shadow(0 0 2px #ff0066)`,
              animation: 'dashOffset 2s linear infinite',
            }}
          />
        )}
        
        {edge === 'bottom' && (
          <path
            d={simplifiedForMobile 
              ? `M${(1-position) * cardWidth},${160 - borderWidth} v-6` 
              : `M${(1-position) * cardWidth},${160 - borderWidth} v-6 h-${intensity * 15}`}
            stroke="#ff0066"
            strokeWidth="1"
            fill="none"
            strokeDasharray={simplifiedForMobile ? "3,3" : "4,3"}
            style={{
              opacity: intensity * 0.7,
              filter: `drop-shadow(0 0 2px #ff0066)`,
              animation: 'dashOffset 2s linear infinite',
            }}
          />
        )}
        
        {edge === 'left' && (
          <path
            d={simplifiedForMobile 
              ? `M${borderWidth},${(1-position) * 160} h6` 
              : `M${borderWidth},${(1-position) * 160} h6 v-${intensity * 15}`}
            stroke="#ff0066"
            strokeWidth="1"
            fill="none" 
            strokeDasharray={simplifiedForMobile ? "3,3" : "4,3"}
            style={{
              opacity: intensity * 0.7,
              filter: `drop-shadow(0 0 2px #ff0066)`,
              animation: 'dashOffset 2s linear infinite',
            }}
          />
        )}
        
        {/* Corner circuit patterns - simplified for mobile */}
        {!simplifiedForMobile && edge === 'topLeft' && (
          <path
            d={`M${borderWidth + 1},${borderWidth + 1} l4,4 l4,-2 l6,6`}
            stroke="#ff0066"
            strokeWidth="1" 
            fill="none"
            strokeDasharray="3,2"
            style={{
              opacity: intensity * 0.7,
              filter: `drop-shadow(0 0 2px #ff0066)`,
              animation: 'dashOffset 1.8s linear infinite',
            }}
          />
        )}
        
        {!simplifiedForMobile && edge === 'topRight' && (
          <path
            d={`M${cardWidth - borderWidth - 1},${borderWidth + 1} l-4,4 l-4,-2 l-6,6`}
            stroke="#ff0066"
            strokeWidth="1"
            fill="none"
            strokeDasharray="3,2"
            style={{
              opacity: intensity * 0.7,
              filter: `drop-shadow(0 0 2px #ff0066)`,
              animation: 'dashOffset 1.8s linear infinite',
            }}
          />
        )}
        
        {!simplifiedForMobile && edge === 'bottomLeft' && (
          <path
            d={`M${borderWidth + 1},${160 - borderWidth - 1} l4,-4 l4,2 l6,-6`}
            stroke="#ff0066"
            strokeWidth="1"
            fill="none"
            strokeDasharray="3,2"
            style={{
              opacity: intensity * 0.7,
              filter: `drop-shadow(0 0 2px #ff0066)`,
              animation: 'dashOffset 1.8s linear infinite',
            }}
          />
        )}
        
        {!simplifiedForMobile && edge === 'bottomRight' && (
          <path
            d={`M${cardWidth - borderWidth - 1},${160 - borderWidth - 1} l-4,-4 l-4,2 l-6,-6`}
            stroke="#ff0066"
            strokeWidth="1"
            fill="none"
            strokeDasharray="3,2"
            style={{
              opacity: intensity * 0.7,
              filter: `drop-shadow(0 0 2px #ff0066)`,
              animation: 'dashOffset 1.8s linear infinite',
            }}
          />
        )}
        
        {/* Simplified corner patterns for mobile */}
        {simplifiedForMobile && (edge === 'topLeft' || edge === 'topRight' || edge === 'bottomLeft' || edge === 'bottomRight') && (
          <path
            d={
              edge === 'topLeft' ? `M${borderWidth + 1},${borderWidth + 1} l4,4` :
              edge === 'topRight' ? `M${cardWidth - borderWidth - 1},${borderWidth + 1} l-4,4` :
              edge === 'bottomLeft' ? `M${borderWidth + 1},${160 - borderWidth - 1} l4,-4` :
              `M${cardWidth - borderWidth - 1},${160 - borderWidth - 1} l-4,-4`
            }
            stroke="#ff0066"
            strokeWidth="1"
            fill="none"
            strokeDasharray="3,2"
            style={{
              opacity: intensity * 0.7,
              filter: `drop-shadow(0 0 2px #ff0066)`,
              animation: 'dashOffset 1.8s linear infinite',
            }}
          />
        )}
      </svg>
    );
  };

  return (
    <div
      ref={itemRef}
      className="absolute mx-4 h-40 overflow-visible cursor-pointer select-none"
      style={{
        ...style,
      }}
      {...props}
    >
      {/* Animation styles */}
      <style jsx="true">{`
        @keyframes neonPulse {
          0% { opacity: 0.8; }
          50% { opacity: 1; }
          100% { opacity: 0.8; }
        }
        
        @keyframes dashOffset {
          from { stroke-dashoffset: 30; }
          to { stroke-dashoffset: 0; }
        }
      `}</style>
      
      {/* Card background */}
      <div 
        className="absolute inset-0 bg-gradient-to-b from-[#1c0b0f] to-black rounded-lg overflow-hidden"
        style={{
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
        }}
      />
      
      {/* Base border outline - always visible */}
      <div 
        className="absolute inset-0 rounded-lg pointer-events-none"
        style={{
          border: '1px solid rgba(100, 20, 30, 0.4)',
        }}
      />
      
      {/* Render just the border segments near the cursor */}
      {renderBorderSegments()}
      
      {/* Render flowing circuit traces */}
      {renderCircuitTrace()}
      
      {/* Content */}
      <div className="relative z-5 h-full flex flex-col justify-center items-center p-4">
        <span className="text-xl font-bold text-white mb-2">{category.name}</span>
        <div 
          className="text-[#d64356] text-sm mt-1 flex items-center border border-red-900/40 px-3 py-1 rounded-full"
          style={{
            background: "rgba(127, 29, 29, 0.2)",
            transition: "all 0.3s ease"
          }}
        >
          <span className="mr-1">مشاهده محصولات</span>
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-4 w-4 mr-1" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M14 5l7 7m0 0l-7 7m7-7H3" 
            />
          </svg>
        </div>
      </div>
      
      {/* Noise texture overlay */}
      <div 
        className="absolute inset-0 opacity-10 mix-blend-overlay pointer-events-none rounded-lg"
        style={{
          backgroundImage: "url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIiB4PSIwIiB5PSIwIj48ZmVUdXJidWxlbmNlIGJhc2VGcmVxdWVuY3k9Ii43NSIgc3RpdGNoVGlsZXM9InN0aXRjaCIgdHlwZT0iZnJhY3RhbE5vaXNlIi8+PGZlQ29sb3JNYXRyaXggdHlwZT0ic2F0dXJhdGUiIHZhbHVlcz0iMCIvPjwvZmlsdGVyPjxwYXRoIGQ9Ik0wIDBoMzAwdjMwMEgweiIgZmlsdGVyPSJ1cmwoI2EpIiBvcGFjaXR5PSIuMDUiLz48L3N2Zz4=')",
          backgroundSize: "cover"
        }}
      />
    </div>
  );
};

export default CategoryRows;
