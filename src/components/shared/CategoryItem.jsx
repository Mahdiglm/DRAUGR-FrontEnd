import React, { useRef, useEffect, useState, memo } from 'react';
import { throttle } from '../../utils/animationHelpers';

/**
 * CategoryItem Component
 * 
 * Displays individual category cards with interactive hover effects
 * Optimized for both mobile and desktop devices
 */

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

const CategoryItem = memo(({ 
  category, 
  style, 
  cardWidth, 
  isMobile = false, 
  mobileHighlight = false,
  mobileHighlightEdge = 'top',
  mobileHighlightIntensity = 0.5,
  mobileHighlightPosition = 0.5,
  ...props 
}) => {
  const itemRef = useRef(null);
  const [isNear, setIsNear] = useState(false);
  const [proximityData, setProximityData] = useState({
    edge: null,
    distance: 100,
    intensity: 0,
    position: 0,
  });
  const [animationPhase, setAnimationPhase] = useState(0);
  const lastMousePosRef = useRef({ x: 0, y: 0 });
  const proximityDataRef = useRef(proximityData);
  const isNearRef = useRef(isNear);
  const animationFrameIdRef = useRef(null);
  const circuitOffsetRef = useRef(0);
  
  // Settings
  const proximityThreshold = 60; // How close the mouse needs to be to activate border effect
  const borderWidth = 2; // Width of the border in pixels
  
  // Update refs when state changes
  useEffect(() => {
    proximityDataRef.current = proximityData;
    isNearRef.current = isNear;
  }, [proximityData, isNear]);
  
  // Separate effect for mobile devices
  useEffect(() => {
    if (isMobile) {
      // For mobile, use the pre-calculated random values
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
    }
    
    // Clean up function to handle component unmounting
    return () => {
      if (animationFrameIdRef.current) {
        cancelAnimationFrame(animationFrameIdRef.current);
      }
    };
  }, [isMobile, mobileHighlight, mobileHighlightEdge, mobileHighlightIntensity, mobileHighlightPosition]);
  
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
  
  // Compute hover state based on mouse position
  const computeHoverState = useRef((mouseX, mouseY) => {
    if (!itemRef.current) return null;
    
    const rect = itemRef.current.getBoundingClientRect();
    
    // Calculate mouse position relative to item's current position
    const relativeX = mouseX - rect.left;
    const relativeY = mouseY - rect.top;
    
    // Check if we're close to the item (even outside its borders)
    const isNearItem = 
      relativeX >= -proximityThreshold && relativeX <= rect.width + proximityThreshold &&
      relativeY >= -proximityThreshold && relativeY <= rect.height + proximityThreshold;
    
    // Only proceed if we're near the item
    if (!isNearItem) {
      return { isNear: false };
    }
    
    // Calculate distances to each edge
    const distToLeft = Math.abs(relativeX);
    const distToRight = Math.abs(relativeX - rect.width);
    const distToTop = Math.abs(relativeY);
    const distToBottom = Math.abs(relativeY - rect.height);
    
    // Find closest edge and its distance
    let closestEdge;
    let minDistance;
    
    // Check if we're inside the item
    const isInside = relativeX >= 0 && relativeX <= rect.width && relativeY >= 0 && relativeY <= rect.height;
    
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
      if (relativeX < 0 && relativeY < 0) {
        // Top-left corner
        closestEdge = 'topLeft';
        minDistance = Math.sqrt(distToLeft * distToLeft + distToTop * distToTop);
      } else if (relativeX > rect.width && relativeY < 0) {
        // Top-right corner
        closestEdge = 'topRight';
        minDistance = Math.sqrt(distToRight * distToRight + distToTop * distToTop);
      } else if (relativeX < 0 && relativeY > rect.height) {
        // Bottom-left corner
        closestEdge = 'bottomLeft';
        minDistance = Math.sqrt(distToLeft * distToLeft + distToBottom * distToBottom);
      } else if (relativeX > rect.width && relativeY > rect.height) {
        // Bottom-right corner
        closestEdge = 'bottomRight';
        minDistance = Math.sqrt(distToRight * distToRight + distToBottom * distToBottom);
      } else if (relativeX < 0) {
        // Left edge
        closestEdge = 'left';
        minDistance = distToLeft;
      } else if (relativeX > rect.width) {
        // Right edge
        closestEdge = 'right';
        minDistance = distToRight;
      } else if (relativeY < 0) {
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
      return {
        isNear: true,
        proximityData: {
          edge: closestEdge,
          distance: minDistance,
          intensity,
          position: getPositionAlongEdge(closestEdge, relativeX, relativeY, rect.width, rect.height)
        }
      };
    }
    
    return { isNear: false };
  }).current;
  
  // Separate mouse tracking from animation rendering
  useEffect(() => {
    if (isMobile) return; // Skip for mobile
    
    // Function to update state based on computed hover state
    const updateHoverState = () => {
      const result = computeHoverState(lastMousePosRef.current.x, lastMousePosRef.current.y);
      
      if (!result) return;
      
      const { isNear: newIsNear, proximityData: newProximityData } = result;
      
      if (newIsNear) {
        // Only update if there's a significant change
        if (!isNearRef.current || 
            (proximityDataRef.current.edge !== newProximityData.edge) ||
            Math.abs(proximityDataRef.current.intensity - newProximityData.intensity) > 0.05) {
          setIsNear(true);
          setProximityData(newProximityData);
        }
      } else if (isNearRef.current) {
        setIsNear(false);
      }
    };
    
    // Throttled mouse move handler
    const handleMouseMove = throttle((e) => {
      lastMousePosRef.current = { x: e.clientX, y: e.clientY };
      updateHoverState();
    }, 16);
    
    // Add global mouse move listener
    window.addEventListener('mousemove', handleMouseMove);
    
    // Initial check on mount
    updateHoverState();
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [isMobile, computeHoverState]);
  
  // Separate animation loop to ensure continuous animation
  useEffect(() => {
    if (isMobile && !mobileHighlight) return; // Skip animation loop for mobile when not highlighted
    
    // Animation loop for continuous effects
    let animationStartTime = performance.now();
    const runAnimationLoop = (timestamp) => {
      // Update animation phase (0-1) for continuous effects
      const elapsed = timestamp - animationStartTime;
      const newPhase = (elapsed % 2000) / 2000; // 2 second cycle
      setAnimationPhase(newPhase);
      
      // Update circuit animation offset
      circuitOffsetRef.current = (circuitOffsetRef.current + 0.5) % 30;
      
      // Continue the loop
      animationFrameIdRef.current = requestAnimationFrame(runAnimationLoop);
    };
    
    // Start animation loop
    animationFrameIdRef.current = requestAnimationFrame(runAnimationLoop);
    
    return () => {
      if (animationFrameIdRef.current) {
        cancelAnimationFrame(animationFrameIdRef.current);
      }
    };
  }, [isMobile, mobileHighlight]);
  
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
    
    // Use the continuously updated animation offset for continuous animation
    const dashOffset = circuitOffsetRef.current;
    
    return (
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none z-10"
        viewBox={`0 0 ${cardWidth} ${isMobile ? '120' : '160'}`}
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        {/* Circuit lines vary based on which edge is active */}
        {edge === 'top' && (
          <path
            d={simplifiedForMobile 
              ? `M${position * cardWidth},${borderWidth} v3` 
              : `M${position * cardWidth},${borderWidth} v6 h${intensity * 15}`}
            stroke="#ff0066"
            strokeWidth="1"
            fill="none"
            strokeDasharray={simplifiedForMobile ? "3,3" : "4,3"}
            style={{
              opacity: intensity * 0.7,
              filter: `drop-shadow(0 0 2px #ff0066)`,
              strokeDashoffset: dashOffset,
            }}
          />
        )}
        
        {edge === 'right' && (
          <path
            d={simplifiedForMobile 
              ? `M${cardWidth - borderWidth},${position * (isMobile ? 120 : 160)} h-3` 
              : `M${cardWidth - borderWidth},${position * 160} h-6 v${intensity * 15}`}
            stroke="#ff0066"
            strokeWidth="1"
            fill="none"
            strokeDasharray={simplifiedForMobile ? "3,3" : "4,3"}
            style={{
              opacity: intensity * 0.7,
              filter: `drop-shadow(0 0 2px #ff0066)`,
              strokeDashoffset: dashOffset,
            }}
          />
        )}
        
        {edge === 'bottom' && (
          <path
            d={simplifiedForMobile 
              ? `M${(1-position) * cardWidth},${(isMobile ? 120 : 160) - borderWidth} v-3` 
              : `M${(1-position) * cardWidth},${160 - borderWidth} v-6 h-${intensity * 15}`}
            stroke="#ff0066"
            strokeWidth="1"
            fill="none"
            strokeDasharray={simplifiedForMobile ? "3,3" : "4,3"}
            style={{
              opacity: intensity * 0.7,
              filter: `drop-shadow(0 0 2px #ff0066)`,
              strokeDashoffset: dashOffset,
            }}
          />
        )}
        
        {edge === 'left' && (
          <path
            d={simplifiedForMobile 
              ? `M${borderWidth},${(1-position) * (isMobile ? 120 : 160)} h3` 
              : `M${borderWidth},${(1-position) * 160} h6 v-${intensity * 15}`}
            stroke="#ff0066"
            strokeWidth="1"
            fill="none" 
            strokeDasharray={simplifiedForMobile ? "3,3" : "4,3"}
            style={{
              opacity: intensity * 0.7,
              filter: `drop-shadow(0 0 2px #ff0066)`,
              strokeDashoffset: dashOffset,
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
              strokeDashoffset: dashOffset * 0.9,
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
              strokeDashoffset: dashOffset * 0.9,
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
              strokeDashoffset: dashOffset * 0.9,
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
              strokeDashoffset: dashOffset * 0.9,
            }}
          />
        )}
        
        {/* Simplified corner patterns for mobile */}
        {simplifiedForMobile && (edge === 'topLeft' || edge === 'topRight' || edge === 'bottomLeft' || edge === 'bottomRight') && (
          <path
            d={
              edge === 'topLeft' ? `M${borderWidth + 1},${borderWidth + 1} l2,2` :
              edge === 'topRight' ? `M${cardWidth - borderWidth - 1},${borderWidth + 1} l-2,2` :
              edge === 'bottomLeft' ? `M${borderWidth + 1},${(isMobile ? 120 : 160) - borderWidth - 1} l2,-2` :
              `M${cardWidth - borderWidth - 1},${(isMobile ? 120 : 160) - borderWidth - 1} l-2,-2`
            }
            stroke="#ff0066"
            strokeWidth="1"
            fill="none"
            strokeDasharray="2,2"
            style={{
              opacity: intensity * 0.7,
              filter: `drop-shadow(0 0 2px #ff0066)`,
              strokeDashoffset: dashOffset * 0.9,
            }}
          />
        )}
      </svg>
    );
  };

  return (
    <div
      ref={itemRef}
      className="absolute overflow-visible cursor-pointer select-none"
      style={{
        ...style,
      }}
      role="link"
      tabIndex="0"
      aria-label={`دسته‌بندی ${category.name}`}
      onKeyDown={(e) => {
        // Trigger click on Enter or Space
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          // Simulate click - would navigate to category page in a real app
          console.log(`Category clicked: ${category.name}`);
        }
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
      `}</style>
      
      {/* Card background */}
      <div 
        className="absolute inset-0 bg-gradient-to-b from-[#1c0b0f] to-black rounded-lg overflow-hidden"
        style={{
          boxShadow: isMobile ? "0 2px 6px rgba(0, 0, 0, 0.3)" : "0 4px 12px rgba(0, 0, 0, 0.3)",
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
      <div className={`relative z-5 h-full flex flex-col justify-center items-center ${isMobile ? 'p-2' : 'p-4'}`}>
        <span className={`${isMobile ? 'text-lg' : 'text-xl'} font-bold text-white mb-1 md:mb-2`}>{category.name}</span>
        <div 
          className={`text-[#d64356] ${isMobile ? 'text-[10px]' : 'text-sm'} mt-1 flex items-center border border-red-900/40 ${isMobile ? 'px-1.5 py-0.5' : 'px-2 py-1 md:px-3 md:py-1'} rounded-full`}
          style={{
            background: "rgba(127, 29, 29, 0.2)",
            transition: "all 0.3s ease"
          }}
        >
          <span className="mr-1">مشاهده محصولات</span>
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className={`${isMobile ? 'h-2.5 w-2.5' : 'h-4 w-4'} mr-1`}
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
            aria-hidden="true"
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
        aria-hidden="true"
      />

      {/* Focus state indicator for keyboard navigation */}
      <div className="absolute inset-0 rounded-lg pointer-events-none opacity-0 focus-within:opacity-100" 
           style={{
             boxShadow: "0 0 0 2px rgba(255, 0, 102, 0.4)",
             transition: "opacity 0.2s ease"
           }} />
    </div>
  );
});

// Add display name for debugging
CategoryItem.displayName = 'CategoryItem';

export default CategoryItem; 