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
    intensity: 0,
    position: 0,
  });
  
  // Settings
  const proximityThreshold = 60; // How close the mouse needs to be to activate border effect
  const borderWidth = 2; // Width of the border in pixels
  
  // Item-specific mouse tracking (not global)
  const handleMouseMove = (e) => {
    if (!itemRef.current) return;
    
    const rect = itemRef.current.getBoundingClientRect();
    
    // Calculate mouse position relative to item
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Update mouse position state
    setMousePos({ x, y });
    
    // Check if we're inside the item or very close to its border
    const isWithinOrVeryClose = 
      x >= -proximityThreshold && x <= rect.width + proximityThreshold &&
      y >= -proximityThreshold && y <= rect.height + proximityThreshold;
      
    // Only proceed if we're within range
    if (!isWithinOrVeryClose) {
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
  
  // Handle mouse leave
  const handleMouseLeave = () => {
    // Only reset if we were previously near
    if (isNear) setIsNear(false);
  };
  
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
  
  // Create a unified border effect with continuous glow
  const renderBorderEffect = () => {
    if (!isNear) return null;
    
    const { edge, intensity } = proximityData;
    
    // Base glow color
    const glowColor = '#ff0066';
    
    // Create a continuous border with varying opacity around the entire perimeter
    return (
      <div className="absolute inset-0 pointer-events-none rounded-lg overflow-hidden">
        {/* Unified border with variable opacity based on proximity to different sections */}
        <div 
          className="absolute inset-0 rounded-lg overflow-hidden"
          style={{
            boxShadow: `0 0 ${5 * intensity}px ${glowColor}`,
            border: `${borderWidth}px solid ${glowColor}`,
            opacity: intensity * 0.8,
          }}
        />
        
        {/* Enhanced glow for the section closest to the cursor */}
        {renderEnhancedGlowSection()}
      </div>
    );
  };
  
  // Render enhanced glow for the specific section closest to the cursor
  const renderEnhancedGlowSection = () => {
    const { edge, intensity, position } = proximityData;
    const glowColor = '#ff0066';
    
    // Style for the specific segment with enhanced glow
    const enhancedGlowStyle = {
      position: 'absolute',
      opacity: intensity,
      boxShadow: `0 0 ${8 * intensity}px ${glowColor}`,
      backgroundColor: glowColor,
      filter: `drop-shadow(0 0 ${5 * intensity}px ${glowColor})`,
    };
    
    // Default segment length (as percentage of edge)
    const segmentLength = 30 + (1 - intensity) * 50; // Wider when further away
    
    // The segment should be centered at the closest position along the edge
    const halfSegment = segmentLength / 2;
    const startPercent = Math.max(0, position * 100 - halfSegment);
    const endPercent = Math.min(100, position * 100 + halfSegment);
    
    switch (edge) {
      case 'top':
        return (
          <div 
            className="absolute top-0"
            style={{
              ...enhancedGlowStyle,
              left: `${startPercent}%`,
              width: `${endPercent - startPercent}%`,
              height: `${borderWidth}px`,
            }}
          />
        );
      
      case 'right':
        return (
          <div 
            className="absolute right-0"
            style={{
              ...enhancedGlowStyle,
              top: `${startPercent}%`,
              height: `${endPercent - startPercent}%`,
              width: `${borderWidth}px`,
            }}
          />
        );
      
      case 'bottom':
        return (
          <div 
            className="absolute bottom-0"
            style={{
              ...enhancedGlowStyle,
              right: `${startPercent}%`,
              width: `${endPercent - startPercent}%`,
              height: `${borderWidth}px`,
            }}
          />
        );
      
      case 'left':
        return (
          <div 
            className="absolute left-0"
            style={{
              ...enhancedGlowStyle,
              bottom: `${startPercent}%`,
              height: `${endPercent - startPercent}%`,
              width: `${borderWidth}px`,
            }}
          />
        );
      
      case 'topLeft':
        return (
          <div className="absolute top-0 left-0">
            {/* Top edge enhanced glow */}
            <div 
              style={{
                ...enhancedGlowStyle,
                width: `${20}%`,
                height: `${borderWidth}px`,
              }}
            />
            {/* Left edge enhanced glow */}
            <div 
              style={{
                ...enhancedGlowStyle,
                width: `${borderWidth}px`,
                height: `${20}%`,
              }}
            />
          </div>
        );
      
      case 'topRight':
        return (
          <div className="absolute top-0 right-0">
            {/* Top edge enhanced glow */}
            <div 
              style={{
                ...enhancedGlowStyle,
                width: `${20}%`,
                height: `${borderWidth}px`,
                right: 0,
              }}
            />
            {/* Right edge enhanced glow */}
            <div 
              style={{
                ...enhancedGlowStyle,
                width: `${borderWidth}px`,
                height: `${20}%`,
                right: 0,
              }}
            />
          </div>
        );
      
      case 'bottomLeft':
        return (
          <div className="absolute bottom-0 left-0">
            {/* Bottom edge enhanced glow */}
            <div 
              style={{
                ...enhancedGlowStyle,
                width: `${20}%`,
                height: `${borderWidth}px`,
                bottom: 0,
              }}
            />
            {/* Left edge enhanced glow */}
            <div 
              style={{
                ...enhancedGlowStyle,
                width: `${borderWidth}px`,
                height: `${20}%`,
                bottom: 0,
              }}
            />
          </div>
        );
      
      case 'bottomRight':
        return (
          <div className="absolute bottom-0 right-0">
            {/* Bottom edge enhanced glow */}
            <div 
              style={{
                ...enhancedGlowStyle,
                width: `${20}%`,
                height: `${borderWidth}px`,
                bottom: 0,
                right: 0,
              }}
            />
            {/* Right edge enhanced glow */}
            <div 
              style={{
                ...enhancedGlowStyle,
                width: `${borderWidth}px`,
                height: `${20}%`,
                bottom: 0,
                right: 0,
              }}
            />
          </div>
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
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
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
      
      {/* Base border outline - always visible */}
      <div 
        className="absolute inset-0 rounded-lg pointer-events-none"
        style={{
          border: '1px solid rgba(100, 20, 30, 0.4)',
        }}
      />
      
      {/* Render the proximity-based border effect */}
      {renderBorderEffect()}
      
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
      
      {/* Circuit trace decorations - subtle electronic patterns when borders are active */}
      {isNear && (
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none z-10"
          viewBox={`0 0 ${cardWidth} 160`}
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Circuit lines vary based on which edge is active */}
          {proximityData.edge === 'top' && (
            <path
              d={`M${proximityData.position * cardWidth},${borderWidth} v6 h${proximityData.intensity * 15}`}
              stroke="#ff0066"
              strokeWidth="1"
              fill="none"
              strokeDasharray="4,3"
              style={{
                opacity: proximityData.intensity * 0.7,
                filter: `drop-shadow(0 0 2px #ff0066)`,
                animation: 'dashOffset 2s linear infinite',
              }}
            />
          )}
          
          {proximityData.edge === 'right' && (
            <path
              d={`M${cardWidth - borderWidth},${proximityData.position * 160} h-6 v${proximityData.intensity * 15}`}
              stroke="#ff0066"
              strokeWidth="1"
              fill="none"
              strokeDasharray="4,3"
              style={{
                opacity: proximityData.intensity * 0.7,
                filter: `drop-shadow(0 0 2px #ff0066)`,
                animation: 'dashOffset 2s linear infinite',
              }}
            />
          )}
          
          {proximityData.edge === 'bottom' && (
            <path
              d={`M${(1-proximityData.position) * cardWidth},${160 - borderWidth} v-6 h-${proximityData.intensity * 15}`}
              stroke="#ff0066"
              strokeWidth="1"
              fill="none"
              strokeDasharray="4,3"
              style={{
                opacity: proximityData.intensity * 0.7,
                filter: `drop-shadow(0 0 2px #ff0066)`,
                animation: 'dashOffset 2s linear infinite',
              }}
            />
          )}
          
          {proximityData.edge === 'left' && (
            <path
              d={`M${borderWidth},${(1-proximityData.position) * 160} h6 v-${proximityData.intensity * 15}`}
              stroke="#ff0066"
              strokeWidth="1"
              fill="none" 
              strokeDasharray="4,3"
              style={{
                opacity: proximityData.intensity * 0.7,
                filter: `drop-shadow(0 0 2px #ff0066)`,
                animation: 'dashOffset 2s linear infinite',
              }}
            />
          )}
          
          {/* Corner circuit patterns */}
          {proximityData.edge === 'topLeft' && (
            <path
              d={`M${borderWidth + 1},${borderWidth + 1} l4,4 l4,-2 l6,6`}
              stroke="#ff0066"
              strokeWidth="1" 
              fill="none"
              strokeDasharray="3,2"
              style={{
                opacity: proximityData.intensity * 0.7,
                filter: `drop-shadow(0 0 2px #ff0066)`,
                animation: 'dashOffset 1.8s linear infinite',
              }}
            />
          )}
          
          {proximityData.edge === 'topRight' && (
            <path
              d={`M${cardWidth - borderWidth - 1},${borderWidth + 1} l-4,4 l-4,-2 l-6,6`}
              stroke="#ff0066"
              strokeWidth="1"
              fill="none"
              strokeDasharray="3,2"
              style={{
                opacity: proximityData.intensity * 0.7,
                filter: `drop-shadow(0 0 2px #ff0066)`,
                animation: 'dashOffset 1.8s linear infinite',
              }}
            />
          )}
          
          {proximityData.edge === 'bottomLeft' && (
            <path
              d={`M${borderWidth + 1},${160 - borderWidth - 1} l4,-4 l4,2 l6,-6`}
              stroke="#ff0066"
              strokeWidth="1"
              fill="none"
              strokeDasharray="3,2"
              style={{
                opacity: proximityData.intensity * 0.7,
                filter: `drop-shadow(0 0 2px #ff0066)`,
                animation: 'dashOffset 1.8s linear infinite',
              }}
            />
          )}
          
          {proximityData.edge === 'bottomRight' && (
            <path
              d={`M${cardWidth - borderWidth - 1},${160 - borderWidth - 1} l-4,-4 l-4,2 l-6,-6`}
              stroke="#ff0066"
              strokeWidth="1"
              fill="none"
              strokeDasharray="3,2"
              style={{
                opacity: proximityData.intensity * 0.7,
                filter: `drop-shadow(0 0 2px #ff0066)`,
                animation: 'dashOffset 1.8s linear infinite',
              }}
            />
          )}
        </svg>
      )}
    </div>
  );
};

export default CategoryRows; 