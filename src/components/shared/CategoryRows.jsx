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

  // Constants for layout
  const CARD_WIDTH = 224; // 56px * 4 (actual width)
  const CARD_MARGIN = 32;  // 16px on each side (mx-4)
  const CARD_TOTAL_WIDTH = CARD_WIDTH + CARD_MARGIN; // Total width including margins
  
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
            />
          ))}
        </div>
      </div>
    </div>
  );
};

const CategoryItem = ({ category, style, ...props }) => {
  const itemRef = useRef(null);
  const [glowing, setGlowing] = useState(false);
  const [glowIntensity, setGlowIntensity] = useState(0); // 0 to 1 scale for glow intensity
  const [mousePosition, setMousePosition] = useState({ x: 0.5, y: 0.5 });
  
  // Animation frame for smoother glow effect
  const animationFrameRef = useRef(null);
  
  const handleMouseMove = (e) => {
    if (!itemRef.current) return;
    
    const rect = itemRef.current.getBoundingClientRect();
    
    // Calculate normalized position (0 to 1) within the element
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    
    // Set mouse position for gradient effect
    setMousePosition({ x, y });
    
    // Calculate distance from pointer to nearest edge
    // This creates a more responsive effect as the pointer gets closer to any edge
    const distToLeft = x;
    const distToRight = 1 - x;
    const distToTop = y;
    const distToBottom = 1 - y;
    const minDistToEdge = Math.min(distToLeft, distToRight, distToTop, distToBottom);
    
    // Calculate proximity scale (1 when mouse is at the edge, 0 when far away)
    // The 0.35 value controls how far from the edge the effect starts
    const proximityScale = Math.max(0, Math.min(1, 1 - (minDistToEdge / 0.35)));
    
    // Check if mouse is within proximity range or completely outside the element
    const padding = 40; // px - how far outside the element we still detect
    const isInProximity = 
      e.clientX >= rect.left - padding &&
      e.clientX <= rect.right + padding &&
      e.clientY >= rect.top - padding &&
      e.clientY <= rect.bottom + padding;
    
    if (isInProximity) {
      // Smoothly interpolate to the target glowIntensity for more natural effect
      animationFrameRef.current = requestAnimationFrame(() => {
        setGlowIntensity(current => {
          return current + (proximityScale - current) * 0.2; // Smooth transition to target value
        });
      });
      setGlowing(true);
    } else if (glowing) {
      // Fade out when mouse leaves proximity
      animationFrameRef.current = requestAnimationFrame(() => {
        setGlowIntensity(current => {
          const newValue = current * 0.8; // Fade out
          if (newValue < 0.01) {
            setGlowing(false);
            return 0;
          }
          return newValue;
        });
      });
    }
  };

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [glowing]);
  
  // Determine which edge is closest to the mouse position for the neon trace effect
  const getClosestEdge = () => {
    const { x, y } = mousePosition;
    const distToLeft = x;
    const distToRight = 1 - x;
    const distToTop = y;
    const distToBottom = 1 - y;
    
    const minDist = Math.min(distToLeft, distToRight, distToTop, distToBottom);
    
    if (minDist === distToLeft) return 'left';
    if (minDist === distToRight) return 'right';
    if (minDist === distToTop) return 'top';
    return 'bottom';
  };
  
  // Calculate the cyberpunk glow effect along the edges
  const closestEdge = getClosestEdge();
  const neonColor = 'rgba(232, 30, 54, 1)'; // Vibrant red neon color
  const neonColorTransparent = 'rgba(232, 30, 54, 0)';

  // Create CSS variables for animation and glow effect
  const intensity = glowIntensity; 
  const glowSpread = Math.max(1, Math.floor(intensity * 7)); // Spread increases with intensity
  const glowBlur = Math.max(3, Math.floor(intensity * 12)); // Blur increases with intensity

  // Dynamic CSS for the animated border effect
  const borderStyle = {
    '--glow-intensity': intensity,
    '--glow-color': neonColor,
    '--glow-color-transparent': neonColorTransparent,
    '--border-animation-pos': `${(mousePosition.x * 100)}% ${(mousePosition.y * 100)}%`, 
  };

  return (
    <div
      ref={itemRef}
      className="absolute mx-4 h-40 overflow-visible cursor-pointer select-none"
      style={{
        ...style,
        zIndex: glowing ? 10 : 1, // Ensure the hovered item appears above others
      }}
      {...props}
    >
      {/* Cyberpunk border animation styles */}
      <style jsx="true">{`
        @keyframes borderPulse {
          0% { opacity: 0.7; }
          50% { opacity: 1; }
          100% { opacity: 0.7; }
        }
        
        @keyframes neonFlicker {
          0% { opacity: 1; }
          80% { opacity: 1; }
          83% { opacity: 0.8; }
          86% { opacity: 1; }
          90% { opacity: 1; }
          93% { opacity: 0.6; }
          96% { opacity: 1; }
          100% { opacity: 1; }
        }
        
        @keyframes neonFlow {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>
      
      {/* Card background */}
      <div 
        className="absolute inset-0 bg-gradient-to-b from-[#1c0b0f] to-black rounded-lg overflow-hidden"
        style={{
          boxShadow: "0 5px 15px rgba(0, 0, 0, 0.3)",
          transform: glowing ? 'translateY(-2px)' : 'none',
          transition: 'transform 0.2s ease-out',
        }}
      />
      
      {/* Neon border container - actual neon effect happens here */}
      <div 
        className="absolute inset-0 rounded-lg overflow-hidden pointer-events-none"
        style={{
          ...borderStyle,
          filter: `drop-shadow(0 0 ${glowBlur}px var(--glow-color))`,
          transition: 'filter 0.2s ease-out',
          opacity: intensity,
        }}
      >
        {/* Top border with circuit pattern */}
        <div 
          className="absolute top-0 left-0 right-0 h-[2px] z-20"
          style={{
            background: `linear-gradient(90deg, var(--glow-color-transparent) 0%, 
                                        var(--glow-color) 20%, var(--glow-color) 80%, 
                                        var(--glow-color-transparent) 100%)`,
            opacity: closestEdge === 'top' ? 1 : 0.5 * intensity,
            backgroundSize: '200% 100%',
            animation: 'neonFlow 3s ease infinite',
          }}
        ></div>

        {/* Right border with circuit pattern */}
        <div 
          className="absolute top-0 bottom-0 right-0 w-[2px] z-20"
          style={{
            background: `linear-gradient(180deg, var(--glow-color-transparent) 0%, 
                                        var(--glow-color) 20%, var(--glow-color) 80%, 
                                        var(--glow-color-transparent) 100%)`,
            opacity: closestEdge === 'right' ? 1 : 0.5 * intensity,
            backgroundSize: '100% 200%',
            animation: 'neonFlow 3s ease infinite',
            animationDelay: '0.1s',
          }}
        ></div>
        
        {/* Bottom border with circuit pattern */}
        <div 
          className="absolute bottom-0 left-0 right-0 h-[2px] z-20"
          style={{
            background: `linear-gradient(90deg, var(--glow-color-transparent) 0%, 
                                        var(--glow-color) 20%, var(--glow-color) 80%, 
                                        var(--glow-color-transparent) 100%)`,
            opacity: closestEdge === 'bottom' ? 1 : 0.5 * intensity,
            backgroundSize: '200% 100%',
            animation: 'neonFlow 3s ease infinite',
            animationDelay: '0.2s',
          }}
        ></div>
        
        {/* Left border with circuit pattern */}
        <div 
          className="absolute top-0 bottom-0 left-0 w-[2px] z-20"
          style={{
            background: `linear-gradient(180deg, var(--glow-color-transparent) 0%, 
                                        var(--glow-color) 20%, var(--glow-color) 80%, 
                                        var(--glow-color-transparent) 100%)`,
            opacity: closestEdge === 'left' ? 1 : 0.5 * intensity,
            backgroundSize: '100% 200%',
            animation: 'neonFlow 3s ease infinite',
            animationDelay: '0.3s',
          }}
        ></div>
        
        {/* Corner accents - top left */}
        <div 
          className="absolute top-0 left-0 w-3 h-3 z-20"
          style={{
            borderTop: `2px solid ${neonColor}`,
            borderLeft: `2px solid ${neonColor}`,
            borderRadius: '2px 0 0 0',
            opacity: (closestEdge === 'top' || closestEdge === 'left') ? 1 : 0.7 * intensity,
            animation: 'borderPulse 2s infinite',
          }}
        ></div>
        
        {/* Corner accents - top right */}
        <div 
          className="absolute top-0 right-0 w-3 h-3 z-20"
          style={{
            borderTop: `2px solid ${neonColor}`,
            borderRight: `2px solid ${neonColor}`,
            borderRadius: '0 2px 0 0',
            opacity: (closestEdge === 'top' || closestEdge === 'right') ? 1 : 0.7 * intensity,
            animation: 'borderPulse 2s infinite',
            animationDelay: '0.5s',
          }}
        ></div>
        
        {/* Corner accents - bottom right */}
        <div 
          className="absolute bottom-0 right-0 w-3 h-3 z-20"
          style={{
            borderBottom: `2px solid ${neonColor}`,
            borderRight: `2px solid ${neonColor}`,
            borderRadius: '0 0 2px 0',
            opacity: (closestEdge === 'bottom' || closestEdge === 'right') ? 1 : 0.7 * intensity,
            animation: 'borderPulse 2s infinite',
            animationDelay: '1s',
          }}
        ></div>
        
        {/* Corner accents - bottom left */}
        <div 
          className="absolute bottom-0 left-0 w-3 h-3 z-20"
          style={{
            borderBottom: `2px solid ${neonColor}`,
            borderLeft: `2px solid ${neonColor}`,
            borderRadius: '0 0 0 2px',
            opacity: (closestEdge === 'bottom' || closestEdge === 'left') ? 1 : 0.7 * intensity,
            animation: 'borderPulse 2s infinite',
            animationDelay: '1.5s',
          }}
        ></div>
      </div>
      
      {/* Content */}
      <div className="relative z-10 h-full flex flex-col justify-center items-center p-4">
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