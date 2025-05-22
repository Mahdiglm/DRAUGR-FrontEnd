/**
 * CategoryRows Component
 * 
 * Creates a horizontally scrolling category section with dynamically generated items
 * and interactive proximity-based hover effects.
 */

import React, { useRef, useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { categories } from '../../utils/mockData';
import { getOptimizedAnimationSettings } from '../../utils/animationHelpers';

// Constants for layout - moved to global scope for reuse
const CARD_WIDTH = 224; // 56px * 4 (actual width)
const CARD_MARGIN = 32;  // 16px on each side (mx-4)
const CARD_TOTAL_WIDTH = CARD_WIDTH + CARD_MARGIN; // Total width including margins

const CategoryRows = () => {
  const containerRef = useRef(null);
  const beltRef = useRef(null);
  const [categoryItems, setCategoryItems] = useState([]);
  const [speed, setSpeed] = useState(1); // pixels per frame
  const animationRef = useRef(null);
  const lastTimestampRef = useRef(0);
  const wasVisibleRef = useRef(true);
  const itemsStateRef = useRef([]); // Reference to keep track of items state for visibility changes
  
  // Track the next ID for new items
  const nextIdRef = useRef(1);
  
  // Control animation speed based on device performance
  const defaultSpeed = getOptimizedAnimationSettings(
    { speed: 1 },     // Default settings for high-performance devices
    { speed: 0.75 }   // Optimized settings for low-performance devices
  ).speed;
  
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
    
    // Move each item to the left by speed * deltaTime
    setCategoryItems(prevItems => {
      // Safety check - if we somehow lost all items, refill
      if (prevItems.length === 0) {
        const containerWidth = containerRef.current?.offsetWidth || 1000;
        const itemsNeeded = Math.ceil(containerWidth / CARD_TOTAL_WIDTH) + 4;
        
        const initialItems = [];
        for (let i = 0; i < itemsNeeded; i++) {
          const categoryIndex = i % categories.length;
          initialItems.push({
            id: nextIdRef.current++,
            category: categories[categoryIndex],
            positionX: i * CARD_TOTAL_WIDTH
          });
        }
        
        itemsStateRef.current = initialItems;
        return initialItems;
      }
      
      const moveAmount = speed * deltaTime / 16; // normalize to ~60fps
      
      // Move all items to the left
      const movedItems = prevItems.map(item => ({
        ...item,
        positionX: item.positionX - moveAmount
      }));
      
      // Check if we need to add a new item at the right or remove from the left
      if (!containerRef.current) return movedItems;
      
      const containerWidth = containerRef.current.offsetWidth;
      
      // If rightmost item has moved in enough, add a new item
      const rightmostItem = movedItems.reduce(
        (max, item) => item.positionX > max.positionX ? item : max, 
        { positionX: -Infinity }
      );
      
      const newItems = [...movedItems];
      
      // If the rightmost item has moved in and there's room, add a new item
      if (rightmostItem.positionX < containerWidth + CARD_MARGIN) {
        // Determine the category index
        const categoryIndex = nextIdRef.current % categories.length;
        
        // Add a new item at the right end
        newItems.push({
          id: nextIdRef.current++,
          category: categories[categoryIndex],
          positionX: rightmostItem.positionX + CARD_TOTAL_WIDTH
        });
      }
      
      // Remove items that have moved completely off the left edge
      const filteredItems = newItems.filter(item => item.positionX > -CARD_TOTAL_WIDTH);
      
      // Update our ref to the current state for recovering after tab switches
      itemsStateRef.current = filteredItems;
      
      return filteredItems;
    });
    
    animationRef.current = requestAnimationFrame(animate);
  }, [speed]);
  
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
      const categoryIndex = i % categories.length;
      initialItems.push({
        id: nextIdRef.current++,
        category: categories[categoryIndex],
        positionX: i * CARD_TOTAL_WIDTH
      });
    }
    
    setCategoryItems(initialItems);
    itemsStateRef.current = initialItems;
  }, [categoryItems, CARD_TOTAL_WIDTH]);
  
  // Start and manage the animation
  useEffect(() => {
    setSpeed(defaultSpeed);
    
    // Start animation
    animationRef.current = requestAnimationFrame(animate);
    
    // Clean up animation
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [animate, defaultSpeed]);
  
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
  
  // Handle mouse movement to adjust speed
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!containerRef.current) return;
      
      // Adjust speed based on mouse position
      const container = containerRef.current;
      const { left, width } = container.getBoundingClientRect();
      const mouseXRelative = (e.clientX - left) / width;
      
      // When mouse is on the right side, scroll slightly faster
      // When on the left, scroll slightly slower
      const speedFactor = 1 + (mouseXRelative - 0.5) * 0.3;
      
      // Smoothly interpolate current speed
      setSpeed(currentSpeed => {
        const targetSpeed = defaultSpeed * speedFactor;
        // Smooth interpolation
        return currentSpeed + (targetSpeed - currentSpeed) * 0.05;
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [defaultSpeed]);

  return (
    <div className="py-8 sm:py-12 md:py-16 w-full relative overflow-hidden">
      <div className="container mx-auto px-4 mb-8">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-100 mb-2">
          دسته‌بندی‌ها
        </h2>
        <p className="text-gray-400">
          مجموعه‌ای از محصولات منحصر به فرد در دسته‌بندی‌های مختلف
        </p>
      </div>
      
      <div 
        ref={containerRef}
        className="relative w-full overflow-hidden"
        style={{ 
          maskImage: 'linear-gradient(to right, transparent, black 5%, black 95%, transparent)',
          WebkitMaskImage: 'linear-gradient(to right, transparent, black 5%, black 95%, transparent)'
        }}
      >
        <div 
          ref={beltRef}
          className="relative h-48"
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

const CategoryItem = ({ category, style, cardWidth, ...props }) => {
  const itemRef = useRef(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isNear, setIsNear] = useState(false);
  const [proximityData, setProximityData] = useState({
    edge: null,
    distance: 100,
    intensity: 0
  });
  
  // Settings
  const proximityThreshold = 60; // How close the mouse needs to be to activate border effect
  const borderWidth = 2; // Width of the border in pixels
  
  // Handle mouse movement
  const handleMouseMove = (e) => {
    if (!itemRef.current) return;
    
    const rect = itemRef.current.getBoundingClientRect();
    
    // Calculate mouse position relative to card
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Update mouse position state
    setMousePos({ x, y });
    
    // Calculate distances to each edge
    const distToLeft = x;
    const distToRight = rect.width - x;
    const distToTop = y;
    const distToBottom = rect.height - y;
    
    // Find the closest edge
    const distances = [
      { edge: 'left', dist: distToLeft },
      { edge: 'right', dist: distToRight },
      { edge: 'top', dist: distToTop },
      { edge: 'bottom', dist: distToBottom }
    ];
    
    // Sort by distance (closest first)
    distances.sort((a, b) => a.dist - b.dist);
    
    // The closest edge
    const closestEdge = distances[0];
    
    // Calculate intensity based on proximity (1 when at edge, 0 when beyond threshold)
    const intensity = Math.max(0, 1 - (closestEdge.dist / proximityThreshold));
    
    // Only consider "near" if within threshold
    const near = closestEdge.dist < proximityThreshold;
    
    setIsNear(near);
    
    if (near) {
      setProximityData({
        edge: closestEdge.edge,
        distance: closestEdge.dist,
        intensity,
        // Add normalized position (0-1) along the edge
        position: getPositionAlongEdge(closestEdge.edge, x, y, rect.width, rect.height)
      });
    }
  };
  
  // Calculate the relative position along an edge (0 to 1)
  const getPositionAlongEdge = (edge, x, y, width, height) => {
    switch (edge) {
      case 'top': return x / width;
      case 'right': return y / height;
      case 'bottom': return 1 - (x / width); // Reverse direction for consistency
      case 'left': return 1 - (y / height); // Reverse direction for consistency
      default: return 0;
    }
  };
  
  // Effect for mouse movement
  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);
  
  // Generate the glowing border effect
  const renderBorderEffect = () => {
    if (!isNear || !proximityData.edge) return null;
    
    const { edge, intensity, position } = proximityData;
    
    // Base glow color
    const glowColor = '#ff0066';
    
    // Calculate the spread of the glow effect along the edge
    const spread = 0.2 + intensity * 0.4; // Between 20% and 60% of the edge
    
    // The glow should be centered at the position along the edge
    const start = Math.max(0, position - spread / 2);
    const end = Math.min(1, position + spread / 2);
    
    // Style for the glowing segment
    const glowSegmentStyle = {
      position: 'absolute',
      backgroundColor: 'transparent',
      opacity: intensity,
    };
    
    // Border gradient - creates a focal point at the cursor position
    const createGradient = (direction) => {
      // Create a 3-stop gradient that's transparent at edges and glowing in middle
      return `linear-gradient(${direction}, 
                rgba(255, 0, 102, 0) 0%, 
                rgba(255, 0, 102, ${intensity}) ${(start * 100)}%, 
                rgba(255, 0, 102, ${intensity * 1.5}) ${(position * 100)}%, 
                rgba(255, 0, 102, ${intensity}) ${(end * 100)}%, 
                rgba(255, 0, 102, 0) 100%)`;
    };
    
    // Glow effect specific to each edge
    switch (edge) {
      case 'top':
        return (
          <div 
            className="absolute inset-x-0 top-0 pointer-events-none"
            style={{
              ...glowSegmentStyle,
              height: `${borderWidth}px`,
              backgroundImage: createGradient('to right'),
              boxShadow: `0 0 ${6 * intensity}px ${glowColor}`,
              filter: `drop-shadow(0 0 ${4 * intensity}px ${glowColor})`,
            }}
          />
        );
      
      case 'right':
        return (
          <div 
            className="absolute inset-y-0 right-0 pointer-events-none"
            style={{
              ...glowSegmentStyle,
              width: `${borderWidth}px`,
              backgroundImage: createGradient('to bottom'),
              boxShadow: `0 0 ${6 * intensity}px ${glowColor}`,
              filter: `drop-shadow(0 0 ${4 * intensity}px ${glowColor})`,
            }}
          />
        );
      
      case 'bottom':
        return (
          <div 
            className="absolute inset-x-0 bottom-0 pointer-events-none"
            style={{
              ...glowSegmentStyle,
              height: `${borderWidth}px`,
              backgroundImage: createGradient('to left'),
              boxShadow: `0 0 ${6 * intensity}px ${glowColor}`,
              filter: `drop-shadow(0 0 ${4 * intensity}px ${glowColor})`,
            }}
          />
        );
      
      case 'left':
        return (
          <div 
            className="absolute inset-y-0 left-0 pointer-events-none"
            style={{
              ...glowSegmentStyle,
              width: `${borderWidth}px`,
              backgroundImage: createGradient('to top'),
              boxShadow: `0 0 ${6 * intensity}px ${glowColor}`,
              filter: `drop-shadow(0 0 ${4 * intensity}px ${glowColor})`,
            }}
          />
        );
      
      default:
        return null;
    }
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
      {/* Cyberpunk cyber-trace animation styles */}
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
      
      {/* Thin border outline - always visible */}
      <div 
        className="absolute inset-0 rounded-lg pointer-events-none"
        style={{
          border: '1px solid rgba(100, 20, 30, 0.4)',
        }}
      />
      
      {/* Render the proximity-based border effect */}
      {renderBorderEffect()}
      
      {/* Interactive circuit node at cursor position when near edge */}
      {isNear && proximityData.distance < 20 && (
        <div
          className="absolute pointer-events-none"
          style={{
            width: '6px',
            height: '6px',
            borderRadius: '50%',
            backgroundColor: '#ff0066',
            left: `${mousePos.x - 3}px`,
            top: `${mousePos.y - 3}px`,
            boxShadow: `0 0 8px #ff0066`,
            opacity: proximityData.intensity,
            animation: 'neonPulse 1.5s ease-in-out infinite',
          }}
        />
      )}
      
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
      
      {/* Edge circuit segments */}
      {isNear && (
        <>
          {/* Add a few decorative circuit segments near the active edge */}
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none z-10"
            viewBox={`0 0 ${cardWidth} 160`}
            xmlns="http://www.w3.org/2000/svg"
          >
            {proximityData.edge === 'top' && (
              <path
                d={`M${proximityData.position * cardWidth},1 v5 h${proximityData.intensity * 15}`}
                stroke="#ff0066"
                strokeWidth="1"
                fill="none"
                strokeDasharray="4,2"
                style={{
                  opacity: proximityData.intensity * 0.8,
                  filter: `drop-shadow(0 0 3px #ff0066)`,
                  animation: 'dashOffset 1.5s linear infinite',
                }}
              />
            )}
            
            {proximityData.edge === 'right' && (
              <path
                d={`M${cardWidth - 1},${proximityData.position * 160} h-5 v${proximityData.intensity * 15}`}
                stroke="#ff0066"
                strokeWidth="1"
                fill="none"
                strokeDasharray="4,2"
                style={{
                  opacity: proximityData.intensity * 0.8,
                  filter: `drop-shadow(0 0 3px #ff0066)`,
                  animation: 'dashOffset 1.5s linear infinite',
                }}
              />
            )}
            
            {proximityData.edge === 'bottom' && (
              <path
                d={`M${(1-proximityData.position) * cardWidth},159 v-5 h-${proximityData.intensity * 15}`}
                stroke="#ff0066"
                strokeWidth="1"
                fill="none"
                strokeDasharray="4,2"
                style={{
                  opacity: proximityData.intensity * 0.8,
                  filter: `drop-shadow(0 0 3px #ff0066)`,
                  animation: 'dashOffset 1.5s linear infinite',
                }}
              />
            )}
            
            {proximityData.edge === 'left' && (
              <path
                d={`M1,${(1-proximityData.position) * 160} h5 v-${proximityData.intensity * 15}`}
                stroke="#ff0066"
                strokeWidth="1"
                fill="none"
                strokeDasharray="4,2"
                style={{
                  opacity: proximityData.intensity * 0.8,
                  filter: `drop-shadow(0 0 3px #ff0066)`,
                  animation: 'dashOffset 1.5s linear infinite',
                }}
              />
            )}
          </svg>
        </>
      )}
    </div>
  );
};

export default CategoryRows; 