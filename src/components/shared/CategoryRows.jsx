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
              allItems={categoryItems}
              itemId={item.id}
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

const CategoryItem = ({ category, style, cardWidth, allItems, itemId, ...props }) => {
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
  const circuitLineWidth = 1; // Width of circuit lines
  
  // Track mouse position and handle proximity detection
  const handleMouseMove = useCallback((e) => {
    if (!itemRef.current) return;
    
    const rect = itemRef.current.getBoundingClientRect();
    
    // Calculate mouse position relative to card
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // For proximity detection, also consider points outside the card
    // Check if mouse is near any edge of the card
    const distToLeft = Math.abs(x);
    const distToRight = Math.abs(x - rect.width);
    const distToTop = Math.abs(y);
    const distToBottom = Math.abs(y - rect.height);
    
    // Find the closest edge and its distance
    const edges = [
      { edge: 'left', dist: distToLeft },
      { edge: 'right', dist: distToRight },
      { edge: 'top', dist: distToTop },
      { edge: 'bottom', dist: distToBottom }
    ];
    
    // Sort by distance (closest first)
    edges.sort((a, b) => a.dist - b.dist);
    
    // Calculate total distance from closest point on perimeter
    // This is used to determine if we're close enough to show the effect
    // For corners, we need to check if we're near both edges
    let perimeterDistance;
    let closestEdge;
    
    // Check if we're near a corner (close to two perpendicular edges)
    // corners are special cases
    if ((distToLeft <= proximityThreshold && distToTop <= proximityThreshold) ||
        (distToLeft <= proximityThreshold && distToBottom <= proximityThreshold) ||
        (distToRight <= proximityThreshold && distToTop <= proximityThreshold) ||
        (distToRight <= proximityThreshold && distToBottom <= proximityThreshold)) {
      
      // We're near a corner, calculate diagonal distance
      // Find which corner we're closest to
      let cornerX = x < rect.width / 2 ? 0 : rect.width;
      let cornerY = y < rect.height / 2 ? 0 : rect.height;
      
      // Diagonal distance to corner
      perimeterDistance = Math.sqrt(
        Math.pow(x - cornerX, 2) + Math.pow(y - cornerY, 2)
      );
      
      // For corners, we'll use the compass directions
      if (x < rect.width / 2 && y < rect.height / 2) {
        closestEdge = 'topLeft';
      } else if (x >= rect.width / 2 && y < rect.height / 2) {
        closestEdge = 'topRight';
      } else if (x < rect.width / 2 && y >= rect.height / 2) {
        closestEdge = 'bottomLeft';
      } else {
        closestEdge = 'bottomRight';
      }
    } else {
      // We're closest to a single edge
      closestEdge = edges[0].edge;
      perimeterDistance = edges[0].dist;
    }
    
    // Update mouse position state regardless of proximity
    setMousePos({ x, y });
    
    // Only consider "near" if within threshold
    const near = perimeterDistance < proximityThreshold; 
    
    if (near) {
      // Calculate intensity based on proximity (1 when at edge, 0 when beyond threshold)
      const intensity = Math.max(0, 1 - (perimeterDistance / proximityThreshold));
      
      // Calculate position along edge (as a percentage)
      const position = getPositionAlongEdge(closestEdge, x, y, rect.width, rect.height);
      
      setIsNear(true);
      setProximityData({
        edge: closestEdge,
        distance: perimeterDistance,
        intensity,
        position,
        mouseX: x,
        mouseY: y
      });
    } else if (isNear) {
      // Only reset if we were previously near
      setIsNear(false);
    }
  }, [isNear, proximityThreshold]);
  
  // Add global mouse move listener only for this specific item
  useEffect(() => {
    const handleGlobalMouseMove = (e) => {
      // Only process if this is the nearest item to avoid 
      // multiple items reacting to the same mouse position
      if (itemRef.current) {
        const rect = itemRef.current.getBoundingClientRect();
        
        // Calculate distance from mouse to the center of this item
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const distanceToCenter = Math.sqrt(
          Math.pow(e.clientX - centerX, 2) + 
          Math.pow(e.clientY - centerY, 2)
        );
        
        // Calculate how close the mouse is to any edge of this item
        const closeToLeft = Math.abs(e.clientX - rect.left);
        const closeToRight = Math.abs(e.clientX - rect.right);
        const closeToTop = Math.abs(e.clientY - rect.top);
        const closeToBottom = Math.abs(e.clientY - rect.bottom);
        
        // The closest distance to any edge
        const closestEdgeDist = Math.min(closeToLeft, closeToRight, closeToTop, closeToBottom);
        
        // Only process mouse events for this item if:
        // 1. The mouse is within the proximity threshold of this item's edge, OR
        // 2. The mouse is inside this item
        const isInside = (
          e.clientX >= rect.left && 
          e.clientX <= rect.right && 
          e.clientY >= rect.top && 
          e.clientY <= rect.bottom
        );
        
        if (closestEdgeDist < proximityThreshold || isInside) {
          handleMouseMove(e);
        } else if (isNear) {
          // If the mouse moved away, turn off the effect
          setIsNear(false);
        }
      }
    };
    
    window.addEventListener('mousemove', handleGlobalMouseMove);
    
    return () => {
      window.removeEventListener('mousemove', handleGlobalMouseMove);
    };
  }, [handleMouseMove, isNear, proximityThreshold]);
  
  // Calculate the relative position along an edge (0 to 1)
  const getPositionAlongEdge = (edge, x, y, width, height) => {
    switch (edge) {
      case 'top': return x / width;
      case 'right': return y / height;
      case 'bottom': return 1 - (x / width); // Reverse direction for consistency
      case 'left': return 1 - (y / height); // Reverse direction for consistency
      case 'topLeft': return Math.min(x / width, y / height);
      case 'topRight': return Math.min(1 - (x / width), y / height);
      case 'bottomLeft': return Math.min(x / width, 1 - (y / height));
      case 'bottomRight': return Math.min(1 - (x / width), 1 - (y / height));
      default: return 0;
    }
  };
  
  // Generate circuit path data for connections to edge
  const getCircuitPathData = () => {
    const { edge, intensity, position, mouseX, mouseY } = proximityData;
    
    // No path if not hovering or missing data
    if (!isNear || !edge || !mouseX || !mouseY) return null;
    
    let pathData = null;
    const lineLength = 10 + intensity * 15; // Dynamic line length based on intensity
    
    // Generate path data based on edge and mouse position
    switch (edge) {
      case 'top':
        pathData = {
          path: `M${mouseX},0 v${lineLength}`,
          dashArray: "3,2"
        };
        break;
      case 'right': 
        pathData = {
          path: `M${cardWidth},${mouseY} h-${lineLength}`,
          dashArray: "3,2"
        };
        break;
      case 'bottom':
        pathData = {
          path: `M${mouseX},160 v-${lineLength}`,
          dashArray: "3,2"
        };
        break;
      case 'left':
        pathData = {
          path: `M0,${mouseY} h${lineLength}`,
          dashArray: "3,2"
        };
        break;
      case 'topLeft':
        pathData = {
          path: `M0,0 l${lineLength},${lineLength}`,
          dashArray: "3,2"
        };
        break;
      case 'topRight':
        pathData = {
          path: `M${cardWidth},0 l-${lineLength},${lineLength}`,
          dashArray: "3,2"
        };
        break;
      case 'bottomLeft':
        pathData = {
          path: `M0,160 l${lineLength},-${lineLength}`,
          dashArray: "3,2"
        };
        break;
      case 'bottomRight':
        pathData = {
          path: `M${cardWidth},160 l-${lineLength},-${lineLength}`,
          dashArray: "3,2"
        };
        break;
      default:
        return null;
    }
    
    return pathData;
  };
  
  // Generate the glowing border effect
  const renderBorderEffect = () => {
    if (!isNear) return null;
    
    const { edge, intensity } = proximityData;
    
    // For corner edges, we need a different approach
    if (edge === 'topLeft' || edge === 'topRight' || edge === 'bottomLeft' || edge === 'bottomRight') {
      return renderCornerEffect(edge, intensity);
    }
    
    // Base glow color
    const glowColor = '#ff0066';
    
    // For edges, we'll render a line along the edge
    const edgeStyle = {
      position: 'absolute',
      backgroundColor: 'transparent',
      borderColor: glowColor,
      opacity: intensity,
      boxShadow: `0 0 ${6 * intensity}px ${glowColor}`,
      filter: `drop-shadow(0 0 ${4 * intensity}px ${glowColor})`,
    };
    
    // Position the glow effect on the appropriate edge
    switch (edge) {
      case 'top':
        return (
          <div
            className="absolute inset-x-0 top-0 pointer-events-none"
            style={{
              ...edgeStyle,
              height: `${borderWidth}px`,
              background: `linear-gradient(90deg, rgba(255, 0, 102, 0) 0%, rgba(255, 0, 102, ${intensity}) 25%, rgba(255, 0, 102, ${intensity}) 75%, rgba(255, 0, 102, 0) 100%)`,
            }}
          />
        );
      case 'right':
        return (
          <div
            className="absolute inset-y-0 right-0 pointer-events-none"
            style={{
              ...edgeStyle,
              width: `${borderWidth}px`,
              background: `linear-gradient(180deg, rgba(255, 0, 102, 0) 0%, rgba(255, 0, 102, ${intensity}) 25%, rgba(255, 0, 102, ${intensity}) 75%, rgba(255, 0, 102, 0) 100%)`,
            }}
          />
        );
      case 'bottom':
        return (
          <div
            className="absolute inset-x-0 bottom-0 pointer-events-none"
            style={{
              ...edgeStyle,
              height: `${borderWidth}px`,
              background: `linear-gradient(90deg, rgba(255, 0, 102, 0) 0%, rgba(255, 0, 102, ${intensity}) 25%, rgba(255, 0, 102, ${intensity}) 75%, rgba(255, 0, 102, 0) 100%)`,
            }}
          />
        );
      case 'left':
        return (
          <div
            className="absolute inset-y-0 left-0 pointer-events-none"
            style={{
              ...edgeStyle,
              width: `${borderWidth}px`,
              background: `linear-gradient(180deg, rgba(255, 0, 102, 0) 0%, rgba(255, 0, 102, ${intensity}) 25%, rgba(255, 0, 102, ${intensity}) 75%, rgba(255, 0, 102, 0) 100%)`,
            }}
          />
        );
      default:
        return null;
    }
  };
  
  // Render a special corner effect
  const renderCornerEffect = (corner, intensity) => {
    const glowColor = '#ff0066';
    
    const cornerSize = 40; // Size of the corner effect in pixels
    const cornerStyle = {
      position: 'absolute',
      background: 'transparent',
      opacity: intensity,
      pointerEvents: 'none',
    };
    
    // For corners, we apply the effect to two edges
    switch (corner) {
      case 'topLeft':
        return (
          <div style={cornerStyle} className="top-0 left-0 w-10 h-10">
            <div 
              className="absolute top-0 left-0 h-0.5 w-10" 
              style={{
                background: `linear-gradient(to right, rgba(255, 0, 102, ${intensity}), rgba(255, 0, 102, 0))`,
                boxShadow: `0 0 ${5 * intensity}px ${glowColor}`,
                filter: `drop-shadow(0 0 ${3 * intensity}px ${glowColor})`,
              }}
            />
            <div 
              className="absolute top-0 left-0 w-0.5 h-10" 
              style={{
                background: `linear-gradient(to bottom, rgba(255, 0, 102, ${intensity}), rgba(255, 0, 102, 0))`,
                boxShadow: `0 0 ${5 * intensity}px ${glowColor}`,
                filter: `drop-shadow(0 0 ${3 * intensity}px ${glowColor})`,
              }}
            />
          </div>
        );
      
      case 'topRight':
        return (
          <div style={cornerStyle} className="top-0 right-0 w-10 h-10">
            <div 
              className="absolute top-0 right-0 h-0.5 w-10" 
              style={{
                background: `linear-gradient(to left, rgba(255, 0, 102, ${intensity}), rgba(255, 0, 102, 0))`,
                boxShadow: `0 0 ${5 * intensity}px ${glowColor}`,
                filter: `drop-shadow(0 0 ${3 * intensity}px ${glowColor})`,
              }}
            />
            <div 
              className="absolute top-0 right-0 w-0.5 h-10" 
              style={{
                background: `linear-gradient(to bottom, rgba(255, 0, 102, ${intensity}), rgba(255, 0, 102, 0))`,
                boxShadow: `0 0 ${5 * intensity}px ${glowColor}`,
                filter: `drop-shadow(0 0 ${3 * intensity}px ${glowColor})`,
              }}
            />
          </div>
        );
      
      case 'bottomLeft':
        return (
          <div style={cornerStyle} className="bottom-0 left-0 w-10 h-10">
            <div 
              className="absolute bottom-0 left-0 h-0.5 w-10" 
              style={{
                background: `linear-gradient(to right, rgba(255, 0, 102, ${intensity}), rgba(255, 0, 102, 0))`,
                boxShadow: `0 0 ${5 * intensity}px ${glowColor}`,
                filter: `drop-shadow(0 0 ${3 * intensity}px ${glowColor})`,
              }}
            />
            <div 
              className="absolute bottom-0 left-0 w-0.5 h-10" 
              style={{
                background: `linear-gradient(to top, rgba(255, 0, 102, ${intensity}), rgba(255, 0, 102, 0))`,
                boxShadow: `0 0 ${5 * intensity}px ${glowColor}`,
                filter: `drop-shadow(0 0 ${3 * intensity}px ${glowColor})`,
              }}
            />
          </div>
        );
      
      case 'bottomRight':
        return (
          <div style={cornerStyle} className="bottom-0 right-0 w-10 h-10">
            <div 
              className="absolute bottom-0 right-0 h-0.5 w-10" 
              style={{
                background: `linear-gradient(to left, rgba(255, 0, 102, ${intensity}), rgba(255, 0, 102, 0))`,
                boxShadow: `0 0 ${5 * intensity}px ${glowColor}`,
                filter: `drop-shadow(0 0 ${3 * intensity}px ${glowColor})`,
              }}
            />
            <div 
              className="absolute bottom-0 right-0 w-0.5 h-10" 
              style={{
                background: `linear-gradient(to top, rgba(255, 0, 102, ${intensity}), rgba(255, 0, 102, 0))`,
                boxShadow: `0 0 ${5 * intensity}px ${glowColor}`,
                filter: `drop-shadow(0 0 ${3 * intensity}px ${glowColor})`,
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
          from { stroke-dashoffset: 15; }
          to { stroke-dashoffset: 0; }
        }
        
        @keyframes circuitGlow {
          0% { filter: drop-shadow(0 0 2px #ff0066); }
          50% { filter: drop-shadow(0 0 4px #ff0066); }
          100% { filter: drop-shadow(0 0 2px #ff0066); }
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
      
      {/* Edge circuit segments and connection between edge and circuit lines */}
      {isNear && (
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none z-10"
          viewBox={`0 0 ${cardWidth} 160`}
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Connection line from edge to circuit */}
          {(() => {
            const circuitPathData = getCircuitPathData();
            
            if (circuitPathData) {
              return (
                <path
                  d={circuitPathData.path}
                  stroke="#ff0066"
                  strokeWidth={circuitLineWidth}
                  fill="none"
                  strokeDasharray={circuitPathData.dashArray}
                  style={{
                    opacity: proximityData.intensity * 0.9,
                    filter: 'drop-shadow(0 0 3px #ff0066)',
                    animation: 'dashOffset 1.5s linear infinite, circuitGlow 2s ease-in-out infinite',
                  }}
                />
              );
            }
            return null;
          })()}
          
          {/* Inner circuit node at connection end */}
          {isNear && proximityData.mouseX && proximityData.mouseY && (
            <circle
              cx={(() => {
                const { edge, mouseX } = proximityData;
                if (edge === 'left') return 10;
                if (edge === 'right') return cardWidth - 10;
                if (edge === 'topLeft' || edge === 'bottomLeft') return 10;
                if (edge === 'topRight' || edge === 'bottomRight') return cardWidth - 10;
                return mouseX;
              })()}
              cy={(() => {
                const { edge, mouseY } = proximityData;
                if (edge === 'top') return 10;
                if (edge === 'bottom') return 150;
                if (edge === 'topLeft' || edge === 'topRight') return 10;
                if (edge === 'bottomLeft' || edge === 'bottomRight') return 150;
                return mouseY;
              })()}
              r="2"
              fill="#ff0066"
              style={{
                filter: 'drop-shadow(0 0 3px #ff0066)',
                opacity: proximityData.intensity * 0.9,
                animation: 'neonPulse 1.5s infinite',
              }}
            />
          )}
          
          {/* Additional circuit decoration based on edge */}
          {(() => {
            const { edge, intensity } = proximityData;
            
            // Add edge-specific circuit decorations
            switch(edge) {
              case 'topLeft':
                return (
                  <path
                    d={`M5,5 h12 v12`}
                    stroke="#ff0066"
                    strokeWidth="1"
                    fill="none"
                    strokeDasharray="3,2"
                    style={{
                      opacity: intensity * 0.7,
                      filter: 'drop-shadow(0 0 3px #ff0066)',
                      animation: 'dashOffset 2s linear infinite',
                    }}
                  />
                );
              case 'topRight':
                return (
                  <path
                    d={`M${cardWidth - 5},5 h-12 v12`}
                    stroke="#ff0066"
                    strokeWidth="1"
                    fill="none"
                    strokeDasharray="3,2"
                    style={{
                      opacity: intensity * 0.7,
                      filter: 'drop-shadow(0 0 3px #ff0066)',
                      animation: 'dashOffset 2s linear infinite',
                    }}
                  />
                );
              case 'bottomLeft':
                return (
                  <path
                    d={`M5,155 h12 v-12`}
                    stroke="#ff0066"
                    strokeWidth="1"
                    fill="none"
                    strokeDasharray="3,2"
                    style={{
                      opacity: intensity * 0.7,
                      filter: 'drop-shadow(0 0 3px #ff0066)',
                      animation: 'dashOffset 2s linear infinite',
                    }}
                  />
                );
              case 'bottomRight':
                return (
                  <path
                    d={`M${cardWidth - 5},155 h-12 v-12`}
                    stroke="#ff0066"
                    strokeWidth="1"
                    fill="none"
                    strokeDasharray="3,2"
                    style={{
                      opacity: intensity * 0.7,
                      filter: 'drop-shadow(0 0 3px #ff0066)',
                      animation: 'dashOffset 2s linear infinite',
                    }}
                  />
                );
              default:
                return null;
            }
          })()}
        </svg>
      )}
    </div>
  );
};

export default CategoryRows; 