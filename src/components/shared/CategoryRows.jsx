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
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  
  const handleMouseMove = (e) => {
    if (!itemRef.current) return;
    
    const rect = itemRef.current.getBoundingClientRect();
    
    // Calculate normalized position (0 to 1) within the element
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    
    // Set mouse position for gradient effect
    setMousePosition({ x, y });
    
    // Determine if mouse is close enough to trigger glow
    // Add padding to detect mouse slightly outside the element too
    const padding = 30; // px
    const isInProximity = 
      e.clientX >= rect.left - padding &&
      e.clientX <= rect.right + padding &&
      e.clientY >= rect.top - padding &&
      e.clientY <= rect.bottom + padding;
    
    setGlowing(isInProximity);
  };

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);
  
  // Calculate the gradient position based on mouse position
  const gradientPosition = {
    background: glowing 
      ? `radial-gradient(circle at ${mousePosition.x * 100}% ${mousePosition.y * 100}%, rgba(220, 38, 38, 0.6) 0%, rgba(127, 29, 29, 0.0) 70%)`
      : 'none'
  };

  return (
    <div
      ref={itemRef}
      className="absolute mx-4 h-40 overflow-hidden rounded-lg cursor-pointer select-none"
      style={{
        ...style,
        zIndex: glowing ? 10 : 1, // Ensure the hovered item appears above others
      }}
      {...props}
    >
      {/* Card background with borders */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#1c0b0f] to-black rounded-lg overflow-hidden" />
      
      {/* Content */}
      <div className="relative z-10 h-full flex flex-col justify-center items-center p-4">
        <span className="text-xl font-bold text-white mb-2">{category.name}</span>
        <div 
          className="text-[#d64356] text-sm mt-1 flex items-center border border-red-900/40 px-3 py-1 rounded-full"
          style={{
            background: "rgba(127, 29, 29, 0.2)",
            boxShadow: glowing ? "0 0 10px rgba(220, 38, 38, 0.2)" : "none",
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
        className="absolute inset-0 opacity-10 mix-blend-overlay pointer-events-none"
        style={{
          backgroundImage: "url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIiB4PSIwIiB5PSIwIj48ZmVUdXJidWxlbmNlIGJhc2VGcmVxdWVuY3k9Ii43NSIgc3RpdGNoVGlsZXM9InN0aXRjaCIgdHlwZT0iZnJhY3RhbE5vaXNlIi8+PGZlQ29sb3JNYXRyaXggdHlwZT0ic2F0dXJhdGUiIHZhbHVlcz0iMCIvPjwvZmlsdGVyPjxwYXRoIGQ9Ik0wIDBoMzAwdjMwMEgweiIgZmlsdGVyPSJ1cmwoI2EpIiBvcGFjaXR5PSIuMDUiLz48L3N2Zz4=')",
          backgroundSize: "cover"
        }}
      />
      
      {/* Cyberpunk corner accents - these are placed at each corner */}
      <div className="absolute top-0 left-0 w-4 h-4 pointer-events-none" style={{ opacity: glowing ? 1 : 0.3, transition: 'opacity 0.3s ease' }}>
        <div className="absolute top-0 left-0 w-3 h-[2px] bg-red-600" style={{ boxShadow: glowing ? '0 0 8px #dc2626, 0 0 4px #dc2626' : 'none', transition: 'box-shadow 0.3s ease' }}></div>
        <div className="absolute top-0 left-0 h-3 w-[2px] bg-red-600" style={{ boxShadow: glowing ? '0 0 8px #dc2626, 0 0 4px #dc2626' : 'none', transition: 'box-shadow 0.3s ease' }}></div>
      </div>
      
      <div className="absolute top-0 right-0 w-4 h-4 pointer-events-none" style={{ opacity: glowing ? 1 : 0.3, transition: 'opacity 0.3s ease' }}>
        <div className="absolute top-0 right-0 w-3 h-[2px] bg-red-600" style={{ boxShadow: glowing ? '0 0 8px #dc2626, 0 0 4px #dc2626' : 'none', transition: 'box-shadow 0.3s ease' }}></div>
        <div className="absolute top-0 right-0 h-3 w-[2px] bg-red-600" style={{ boxShadow: glowing ? '0 0 8px #dc2626, 0 0 4px #dc2626' : 'none', transition: 'box-shadow 0.3s ease' }}></div>
      </div>
      
      <div className="absolute bottom-0 left-0 w-4 h-4 pointer-events-none" style={{ opacity: glowing ? 1 : 0.3, transition: 'opacity 0.3s ease' }}>
        <div className="absolute bottom-0 left-0 w-3 h-[2px] bg-red-600" style={{ boxShadow: glowing ? '0 0 8px #dc2626, 0 0 4px #dc2626' : 'none', transition: 'box-shadow 0.3s ease' }}></div>
        <div className="absolute bottom-0 left-0 h-3 w-[2px] bg-red-600" style={{ boxShadow: glowing ? '0 0 8px #dc2626, 0 0 4px #dc2626' : 'none', transition: 'box-shadow 0.3s ease' }}></div>
      </div>
      
      <div className="absolute bottom-0 right-0 w-4 h-4 pointer-events-none" style={{ opacity: glowing ? 1 : 0.3, transition: 'opacity 0.3s ease' }}>
        <div className="absolute bottom-0 right-0 w-3 h-[2px] bg-red-600" style={{ boxShadow: glowing ? '0 0 8px #dc2626, 0 0 4px #dc2626' : 'none', transition: 'box-shadow 0.3s ease' }}></div>
        <div className="absolute bottom-0 right-0 h-3 w-[2px] bg-red-600" style={{ boxShadow: glowing ? '0 0 8px #dc2626, 0 0 4px #dc2626' : 'none', transition: 'box-shadow 0.3s ease' }}></div>
      </div>
      
      {/* Cyberpunk edge lighting effect */}
      <div 
        className="absolute inset-0 rounded-lg pointer-events-none" 
        style={{
          background: 'none',
          borderRadius: '0.5rem',
          border: glowing ? '1px solid rgba(220, 38, 38, 0.5)' : '1px solid rgba(96, 17, 26, 0.2)',
          boxShadow: glowing 
            ? '0 0 15px rgba(220, 38, 38, 0.4), inset 0 0 8px rgba(220, 38, 38, 0.2)' 
            : 'none',
          transition: 'all 0.3s ease-out',
          opacity: 1
        }}
      />
      
      {/* Cyberpunk glitch effect (subtle) */}
      <div 
        className="absolute inset-0 rounded-lg overflow-hidden pointer-events-none"
        style={{
          opacity: glowing ? 0.05 : 0,
          transition: 'opacity 0.3s ease',
          backgroundColor: 'transparent'
        }}
      >
        <div className="absolute inset-0 animate-pulse" style={{
          backgroundImage: 'linear-gradient(to bottom, transparent, rgba(220, 38, 38, 0.2), transparent)',
          backgroundSize: '100% 10px',
          backgroundRepeat: 'repeat',
          mixBlendMode: 'overlay',
          animation: 'scanline 6s linear infinite'
        }}></div>
      </div>
      
      {/* Edge accent - horizontal scattered segments */}
      <div className="absolute top-[10px] inset-x-0 flex justify-between px-1 pointer-events-none" style={{ opacity: glowing ? 1 : 0.3, transition: 'opacity 0.3s ease' }}>
        <div className="w-[7px] h-[2px] bg-red-600" style={{ boxShadow: glowing ? '0 0 5px #dc2626' : 'none', transition: 'box-shadow 0.3s ease' }}></div>
        <div className="w-[15px] h-[2px] bg-red-600" style={{ boxShadow: glowing ? '0 0 5px #dc2626' : 'none', transition: 'box-shadow 0.3s ease' }}></div>
        <div className="w-[5px] h-[2px] bg-red-600" style={{ boxShadow: glowing ? '0 0 5px #dc2626' : 'none', transition: 'box-shadow 0.3s ease' }}></div>
        <div className="w-[12px] h-[2px] bg-red-600" style={{ boxShadow: glowing ? '0 0 5px #dc2626' : 'none', transition: 'box-shadow 0.3s ease' }}></div>
      </div>
      
      <div className="absolute bottom-[10px] inset-x-0 flex justify-between px-1 pointer-events-none" style={{ opacity: glowing ? 1 : 0.3, transition: 'opacity 0.3s ease' }}>
        <div className="w-[12px] h-[2px] bg-red-600" style={{ boxShadow: glowing ? '0 0 5px #dc2626' : 'none', transition: 'box-shadow 0.3s ease' }}></div>
        <div className="w-[5px] h-[2px] bg-red-600" style={{ boxShadow: glowing ? '0 0 5px #dc2626' : 'none', transition: 'box-shadow 0.3s ease' }}></div>
        <div className="w-[15px] h-[2px] bg-red-600" style={{ boxShadow: glowing ? '0 0 5px #dc2626' : 'none', transition: 'box-shadow 0.3s ease' }}></div>
        <div className="w-[7px] h-[2px] bg-red-600" style={{ boxShadow: glowing ? '0 0 5px #dc2626' : 'none', transition: 'box-shadow 0.3s ease' }}></div>
      </div>
      
      {/* Keyline animation */}
      <style jsx="true">{`
        @keyframes scanline {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100%); }
        }
      `}</style>
    </div>
  );
};

export default CategoryRows; 