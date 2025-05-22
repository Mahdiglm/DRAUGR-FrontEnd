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
  const [mousePos, setMousePos] = useState({ x: -100, y: -100 });
  const [isHovering, setIsHovering] = useState(false);
  const [circuitNodes, setCircuitNodes] = useState([]);
  const [circuitPaths, setCircuitPaths] = useState([]);
  const circuitPathsRef = useRef([]);
  const animationFrameRef = useRef(null);
  
  // Settings for circuit effect
  const proximityThreshold = 80; // How close the mouse needs to be to activate (px)
  const nodeCount = 12; // Number of potential circuit nodes
  const maxActivePaths = 6; // Maximum number of active circuit paths
  
  // Generate circuit nodes on mount - these are potential connection points
  useEffect(() => {
    const nodes = [];
    // Generate nodes along the perimeter
    const nodeRadius = Math.min(cardWidth, 160) / 2; // Half of card width
    const centerX = cardWidth / 2;
    const centerY = 80; // Half of card height (160px)
    
    // Create nodes in a circle around the center
    for (let i = 0; i < nodeCount; i++) {
      const angle = (i / nodeCount) * Math.PI * 2;
      nodes.push({
        id: i,
        x: centerX + nodeRadius * Math.cos(angle),
        y: centerY + nodeRadius * Math.sin(angle),
        active: false
      });
    }
    
    // Add some interior nodes
    for (let i = 0; i < 5; i++) {
      nodes.push({
        id: nodeCount + i,
        x: centerX + (Math.random() - 0.5) * nodeRadius * 1.5, 
        y: centerY + (Math.random() - 0.5) * nodeRadius * 1.5,
        active: false
      });
    }
    
    setCircuitNodes(nodes);
  }, [cardWidth]);

  // Handle mouse movement
  const handleMouseMove = (e) => {
    if (!itemRef.current) return;
    
    const rect = itemRef.current.getBoundingClientRect();
    
    // Calculate mouse position relative to card
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Update mouse position state
    setMousePos({ x, y });
    
    // Check if mouse is close enough to the item to be "hovering"
    const padding = proximityThreshold; // The proximity detection range
    const isClose = 
      e.clientX >= rect.left - padding &&
      e.clientX <= rect.right + padding &&
      e.clientY >= rect.top - padding &&
      e.clientY <= rect.bottom + padding;
    
    setIsHovering(isClose);
  };
  
  // Update circuit paths based on mouse position
  useEffect(() => {
    if (!isHovering || circuitNodes.length === 0) return;
    
    // Find which nodes are closest to the mouse
    const nodesWithDistance = circuitNodes.map(node => ({
      ...node,
      distance: Math.sqrt(
        Math.pow(node.x - mousePos.x, 2) + 
        Math.pow(node.y - mousePos.y, 2)
      )
    }));
    
    // Sort by distance to mouse
    const sortedNodes = [...nodesWithDistance].sort((a, b) => a.distance - b.distance);
    
    // Get the closest node to the mouse
    const closestNode = sortedNodes[0];
    
    // Only proceed if mouse is close enough to the closest node
    if (closestNode && closestNode.distance <= proximityThreshold) {
      // Find other close nodes to connect to
      const otherCloseNodes = sortedNodes.slice(1, maxActivePaths + 1);
      
      // Generate paths between closest node and other nodes
      const newPaths = otherCloseNodes.map((node, index) => {
        // Create a unique ID for this path
        const pathId = `path_${closestNode.id}_${node.id}`;
        
        // Generate a circuit path between the nodes
        const path = generateCircuitPath(
          closestNode.x, 
          closestNode.y, 
          node.x, 
          node.y
        );
        
        // Calculate intensity based on distance (closer = more intense)
        const intensity = Math.max(0, 1 - (node.distance / proximityThreshold));
        
        // Animation timing offset
        const animationDelay = index * 0.1;
        
        return {
          id: pathId,
          path,
          intensity,
          timestamp: Date.now(),
          animationDelay,
          originNode: closestNode.id,
          targetNode: node.id
        };
      });
      
      // Update the circuit paths
      circuitPathsRef.current = [
        // Keep recent paths that are still relevant (younger than 1.5 seconds)
        ...circuitPathsRef.current
          .filter(path => Date.now() - path.timestamp < 1500),
        ...newPaths
      ];
      
      // Update the state (but not too frequently)
      const updateAnimation = () => {
        setCircuitPaths([...circuitPathsRef.current]);
      };
      
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      
      animationFrameRef.current = requestAnimationFrame(updateAnimation);
    }
  }, [mousePos, isHovering, circuitNodes]);
  
  // Cleanup
  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);
  
  // Calculate SVG viewBox based on card dimensions
  const svgViewBox = `0 0 ${cardWidth} 160`; // 160 is card height

  return (
    <div
      ref={itemRef}
      className="absolute mx-4 h-40 overflow-visible cursor-pointer select-none"
      style={{
        ...style,
        zIndex: isHovering ? 10 : 1,
      }}
      {...props}
    >
      {/* Cyberpunk circuit animations */}
      <style jsx="true">{`
        @keyframes fadeIn {
          from { opacity: 0; stroke-dashoffset: 20; }
          to { opacity: 1; stroke-dashoffset: 0; }
        }
        
        @keyframes fadeOut {
          from { opacity: 1; }
          to { opacity: 0; }
        }
        
        @keyframes pulse {
          0% { r: 2; opacity: 0.7; }
          50% { r: 3; opacity: 1; }
          100% { r: 2; opacity: 0.7; }
        }
        
        @keyframes nodeGlow {
          0% { filter: drop-shadow(0 0 2px #ff0066); }
          50% { filter: drop-shadow(0 0 4px #ff0066); }
          100% { filter: drop-shadow(0 0 2px #ff0066); }
        }
      `}</style>
      
      {/* Card background */}
      <div 
        className="absolute inset-0 bg-gradient-to-b from-[#1c0b0f] to-black rounded-lg overflow-hidden"
        style={{
          boxShadow: "0 5px 15px rgba(0, 0, 0, 0.3)",
          transition: 'transform 0.2s ease-out',
        }}
      />
      
      {/* SVG overlay for circuit animations */}
      <svg 
        className="absolute inset-0 w-full h-full pointer-events-none z-10"
        viewBox={svgViewBox}
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="circuitGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ff0066" stopOpacity="1" />
            <stop offset="100%" stopColor="#ff3300" stopOpacity="0.8" />
          </linearGradient>
        </defs>
        
        {/* Circuit paths */}
        {circuitPaths.map((pathData) => {
          const pathAge = Date.now() - pathData.timestamp;
          const isNew = pathAge < 300;
          const isOld = pathAge > 1000;
          
          // Animation for paths
          const animationName = isNew ? 'fadeIn' : isOld ? 'fadeOut' : '';
          const animationDuration = isNew ? '0.3s' : isOld ? '0.5s' : '';
          
          return (
            <g key={pathData.id} style={{ opacity: isOld ? 0.5 : 1 }}>
              {/* Main path */}
              <path
                d={pathData.path}
                fill="none"
                stroke="url(#circuitGradient)"
                strokeWidth={1.5}
                strokeDasharray="5,3"
                style={{
                  animation: animationName ? `${animationName} ${animationDuration} ease-out forwards` : '',
                  animationDelay: `${pathData.animationDelay}s`,
                  opacity: pathData.intensity,
                  filter: `drop-shadow(0 0 ${3 + pathData.intensity * 2}px #ff0066)`,
                }}
              />
              
              {/* Glow overlay for more intense effect */}
              <path
                d={pathData.path}
                fill="none"
                stroke="#ff0066"
                strokeWidth={0.5}
                strokeOpacity={0.8}
                style={{
                  animation: animationName ? `${animationName} ${animationDuration} ease-out forwards` : '',
                  animationDelay: `${pathData.animationDelay + 0.1}s`,
                  opacity: pathData.intensity * 0.7,
                  filter: 'blur(2px)',
                }}
              />
            </g>
          );
        })}
        
        {/* Highlight node near cursor */}
        {isHovering && (
          <circle
            cx={mousePos.x}
            cy={mousePos.y}
            r={3}
            fill="#ff0066"
            style={{
              filter: 'drop-shadow(0 0 5px #ff0066)',
              opacity: 0.8,
              animation: 'pulse 1.5s infinite',
            }}
          />
        )}
      </svg>
      
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