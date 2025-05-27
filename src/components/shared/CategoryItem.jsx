import React, { useRef, useEffect, useState, memo, useCallback } from 'react';
import { motion } from 'framer-motion'; // Added for potential future use, not strictly needed for current changes

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

const easeOutCubic = t => 1 - Math.pow(1 - t, 3);
const SPRING_FACTOR = 0.15;
const MIN_INTENSITY_FOR_RENDER = 0.01;
const VELOCITY_SENSITIVITY = 0.005; // How much mouse speed affects intensity boost
const VELOCITY_BOOST_DECAY = 0.9;  // How quickly the velocity boost fades
const MAX_VELOCITY_BOOST = 0.5;     // Max *additional* intensity from velocity (so total can be 1.0 + 0.5 = 1.5)

const CategoryItem = memo(({ 
  category, 
  style, 
  cardWidth,
  cardHeight, // New prop
  isMobile = false, 
  mobileHighlight = false,
  mobileHighlightEdge = 'top',
  mobileHighlightIntensity = 0.5,
  mobileHighlightPosition = 0.5,
  onCategorySelect, // Added prop
  isSelected, // Added prop
  isTransitioning, // New prop for animation
  visualPhase, // Renamed from animationPhase for clarity, maps from CategoryRows' currentVisualPhase
  ...props 
}) => {
  const itemRef = useRef(null);
  const lastMousePosRef = useRef({ x: 0, y: 0, time: Date.now() });
  const animationFrameIdRef = useRef(null);
  
  const animatedValuesRef = useRef({
    intensity: 0,
    position: 0.5,
    edge: null,
    velocityBoost: 0, // For tracking the boost from mouse speed
  });

  // Re-add useState for setForceUpdate, needed for desktop animation loop
  const [, setForceUpdate] = useState(0);

  const proximityThreshold = 60;
  const borderWidth = 2;

  // Callback to handle selection with element reference
  const handleSelectWithRef = useCallback(() => {
    if (onCategorySelect && !isTransitioning && itemRef.current) {
      onCategorySelect(itemRef.current);
    }
  }, [onCategorySelect, isTransitioning]);

  // Mobile-specific effect: Update refs, but DO NOT call setForceUpdate here.
  useEffect(() => {
    if (isMobile || (isTransitioning && !isSelected)) {
      animatedValuesRef.current = {
        intensity: mobileHighlight ? mobileHighlightIntensity : 0,
        position: mobileHighlight ? mobileHighlightPosition : 0.5,
        edge: mobileHighlight ? mobileHighlightEdge : null,
        velocityBoost: 0, // Reset velocity boost on mobile
      };
      // No setForceUpdate here
    }
    // When isMobile becomes false, the desktop useEffect will handle re-initializing the animation state.
  }, [isMobile, mobileHighlight, mobileHighlightEdge, mobileHighlightIntensity, mobileHighlightPosition, isTransitioning, isSelected]);

  // Main hover animation effect for non-mobile devices
  useEffect(() => {
    if (isMobile) {
      if (animationFrameIdRef.current) {
        cancelAnimationFrame(animationFrameIdRef.current);
        animationFrameIdRef.current = null;
        animatedValuesRef.current = { intensity: 0, position: 0.5, edge: null, velocityBoost: 0 };
        setForceUpdate(val => val + 1); // Keep for immediate visual reset when switching to mobile
      }
      return;
    }

    const processHoverState = () => {
      if (!itemRef.current || document.hidden || (isTransitioning && !isSelected)) {
        animationFrameIdRef.current = requestAnimationFrame(processHoverState);
        return;
      }

      const { x: mouseX, y: mouseY } = lastMousePosRef.current;
      const rect = itemRef.current.getBoundingClientRect();
      const relativeX = mouseX - rect.left;
      const relativeY = mouseY - rect.top;

      const distToLeft = Math.abs(relativeX);
      const distToRight = Math.abs(relativeX - rect.width);
      const distToTop = Math.abs(relativeY);
      const distToBottom = Math.abs(relativeY - rect.height);

      let closestEdge;
      let minDistance;
      const isInside = relativeX >= 0 && relativeX <= rect.width && relativeY >= 0 && relativeY <= rect.height;

      if (isInside) {
        const edges = [
          { edge: 'left', dist: distToLeft }, { edge: 'right', dist: distToRight },
          { edge: 'top', dist: distToTop }, { edge: 'bottom', dist: distToBottom },
        ];
        edges.sort((a, b) => a.dist - b.dist);
        closestEdge = edges[0].edge;
        minDistance = edges[0].dist;
      } else {
        if (relativeX < 0 && relativeY < 0) { closestEdge = 'topLeft'; minDistance = Math.sqrt(distToLeft ** 2 + distToTop ** 2); }
        else if (relativeX > rect.width && relativeY < 0) { closestEdge = 'topRight'; minDistance = Math.sqrt(distToRight ** 2 + distToTop ** 2); }
        else if (relativeX < 0 && relativeY > rect.height) { closestEdge = 'bottomLeft'; minDistance = Math.sqrt(distToLeft ** 2 + distToBottom ** 2); }
        else if (relativeX > rect.width && relativeY > rect.height) { closestEdge = 'bottomRight'; minDistance = Math.sqrt(distToRight ** 2 + distToBottom ** 2); }
        else if (relativeX < 0) { closestEdge = 'left'; minDistance = distToLeft; }
        else if (relativeX > rect.width) { closestEdge = 'right'; minDistance = distToRight; }
        else if (relativeY < 0) { closestEdge = 'top'; minDistance = distToTop; }
        else { closestEdge = 'bottom'; minDistance = distToBottom; }
      }

      let targetBaseIntensity = 0;
      let targetPosition = 0.5;

      if (minDistance < proximityThreshold) {
        const rawProximityFactor = 1 - (minDistance / proximityThreshold);
        const t = Math.max(0, Math.min(1, rawProximityFactor));
        targetBaseIntensity = easeOutCubic(t);
        targetPosition = getPositionAlongEdge(closestEdge, relativeX, relativeY, rect.width, rect.height);
      } else {
        targetPosition = animatedValuesRef.current.position;
      }
      
      const currentAV = animatedValuesRef.current;
      let currentVelocityBoost = currentAV.velocityBoost;
      const targetIntensityWithBoost = Math.min(1 + MAX_VELOCITY_BOOST, targetBaseIntensity + currentVelocityBoost);
      currentAV.velocityBoost *= VELOCITY_BOOST_DECAY; // Decay boost

      const nextIntensity = currentAV.intensity + (targetIntensityWithBoost - currentAV.intensity) * SPRING_FACTOR;
      const nextPosition = currentAV.position + (targetPosition - currentAV.position) * SPRING_FACTOR;
      
      currentAV.intensity = Math.max(0, Math.min(1 + MAX_VELOCITY_BOOST, nextIntensity)); // Clamp intensity
      currentAV.position = nextPosition;
      currentAV.edge = (targetBaseIntensity > MIN_INTENSITY_FOR_RENDER || currentAV.intensity > MIN_INTENSITY_FOR_RENDER) ? closestEdge : null;

      const intensityChanged = Math.abs(targetIntensityWithBoost - currentAV.intensity) > 0.001 || Math.abs(currentAV.velocityBoost) > 0.001;
      const positionChanged = Math.abs(targetPosition - currentAV.position) > 0.001;
      const stillVisible = currentAV.intensity > MIN_INTENSITY_FOR_RENDER;
      const wasTargetingVisible = targetBaseIntensity > 0;

      if (intensityChanged || positionChanged || (stillVisible && !wasTargetingVisible) || (wasTargetingVisible && !stillVisible) ) {
        setForceUpdate(val => val + 1); // Keep for desktop animation updates
      }
      
      animationFrameIdRef.current = requestAnimationFrame(processHoverState);
    };

    const handleGlobalMouseMove = (e) => {
      const now = Date.now();
      const prevPos = lastMousePosRef.current;
      const timeDiff = now - prevPos.time;
      if (timeDiff > 1) { // Ensure a small amount of time has passed to avoid extreme speeds
        const distMoved = Math.sqrt((e.clientX - prevPos.x)**2 + (e.clientY - prevPos.y)**2);
        const speed = distMoved / timeDiff; 
        
        const newBoost = Math.min(MAX_VELOCITY_BOOST, speed * VELOCITY_SENSITIVITY);
        animatedValuesRef.current.velocityBoost = Math.max(animatedValuesRef.current.velocityBoost, newBoost);
      }
      lastMousePosRef.current = { x: e.clientX, y: e.clientY, time: now };
    };

    window.addEventListener('mousemove', handleGlobalMouseMove);
    animationFrameIdRef.current = requestAnimationFrame(processHoverState);

    return () => {
      window.removeEventListener('mousemove', handleGlobalMouseMove);
      if (animationFrameIdRef.current) {
        cancelAnimationFrame(animationFrameIdRef.current);
        animationFrameIdRef.current = null;
      }
    };
  }, [isMobile, proximityThreshold, cardWidth, cardHeight, isTransitioning, isSelected]); // Added cardWidth, cardHeight
  
  const getPositionAlongEdge = (edge, x, y, width, height) => {
    // Ensure height is not zero to prevent division by zero
    const safeHeight = height === 0 ? 1 : height;
    const safeWidth = width === 0 ? 1 : width;
    switch (edge) {
      case 'top': return x / safeWidth;
      case 'right': return y / safeHeight;
      case 'bottom': return 1 - (x / safeWidth);
      case 'left': return 1 - (y / safeHeight);
      case 'topLeft': return Math.min(x / safeWidth, y / safeHeight) * 0.5;
      case 'topRight': return Math.min(1 - (x / safeWidth), y / safeHeight) * 0.5;
      case 'bottomLeft': return Math.min(x / safeWidth, 1 - (y / safeHeight)) * 0.5;
      case 'bottomRight': return Math.min(1 - (x / safeWidth), 1 - (y / safeHeight)) * 0.5;
      default: return 0.5;
    }
  };

  const renderBorderSegments = () => {
    const { intensity, position, edge } = animatedValuesRef.current;
    if (intensity < MIN_INTENSITY_FOR_RENDER || (isTransitioning && !isSelected)) return null;
    
    const glowColor = '#ff0066';
    // Use raw intensity (can be > 1) for more dramatic scaling of visual elements
    const visualScale = intensity; 
    const baseSegmentLength = 20;
    const dynamicSegmentLength = 50 * (1 - Math.min(1, intensity)); // This part shrinks as intensity goes to 1, and stays 0 if intensity > 1
    const boostSegmentLength = (intensity > 1) ? (intensity - 1) * 60 : 0; // Extra length for intensity > 1

    const segmentLength = baseSegmentLength + dynamicSegmentLength + boostSegmentLength;
    const halfSegment = segmentLength / 2;
    
    const startPercent = Math.max(0, position * 100 - halfSegment);
    const endPercent = Math.min(100, position * 100 + halfSegment);
    
    const segmentStyle = {
      position: 'absolute', backgroundColor: glowColor,
      // boxShadow and filter can also scale with `visualScale`
      boxShadow: `0 0 ${6 * visualScale}px ${glowColor}, 0 0 ${10 * visualScale}px ${glowColor} inset`,
      filter: `drop-shadow(0 0 ${4 * visualScale}px ${glowColor})`,
      opacity: Math.min(1, intensity), // Opacity still capped at 1
      pointerEvents: 'none',
    };

    if (edge && (edge.includes('Left') || edge.includes('Right') || edge.includes('Top') || edge.includes('Bottom'))) {
      return renderCornerSegments(edge, visualScale, segmentStyle); // Pass visualScale
    }

    switch (edge) {
      case 'top': return <div className="absolute top-0 rounded-t-lg overflow-hidden" style={{ ...segmentStyle, height: `${borderWidth}px`, left: `${startPercent}%`, width: `${endPercent - startPercent}%` }} />;
      case 'right': return <div className="absolute right-0 rounded-r-lg overflow-hidden" style={{ ...segmentStyle, width: `${borderWidth}px`, top: `${startPercent}%`, height: `${endPercent - startPercent}%` }} />;
      case 'bottom': return <div className="absolute bottom-0 rounded-b-lg overflow-hidden" style={{ ...segmentStyle, height: `${borderWidth}px`, right: `${startPercent}%`, width: `${endPercent - startPercent}%` }} />;
      case 'left': return <div className="absolute left-0 rounded-l-lg overflow-hidden" style={{ ...segmentStyle, width: `${borderWidth}px`, bottom: `${startPercent}%`, height: `${endPercent - startPercent}%` }} />;
      default: return null;
    }
  };

  const renderCornerSegments = (corner, visualScale, baseSegmentStyle) => { // visualScale from arg
    const baseCornerSize = 25;
    const dynamicCornerSize = 15 * visualScale; // Scale size with visualScale
    const cornerSize = Math.min(60, baseCornerSize + dynamicCornerSize); // Cap max size
    const segmentStyle = { ...baseSegmentStyle }; // NEW: baseSegmentStyle doesn't have borderRadius
    
    switch (corner) {
        case 'topLeft': return <><div style={{ ...segmentStyle, top: 0, left: 0, height: `${borderWidth}px`, width: `${cornerSize}px`, borderTopLeftRadius: '8px' }} /><div style={{ ...segmentStyle, top: 0, left: 0, width: `${borderWidth}px`, height: `${cornerSize}px`, borderTopLeftRadius: '8px' }} /></>;
        case 'topRight': return <><div style={{ ...segmentStyle, top: 0, right: 0, height: `${borderWidth}px`, width: `${cornerSize}px`, borderTopRightRadius: '8px' }} /><div style={{ ...segmentStyle, top: 0, right: 0, width: `${borderWidth}px`, height: `${cornerSize}px`, borderTopRightRadius: '8px' }} /></>;
        case 'bottomLeft': return <><div style={{ ...segmentStyle, bottom: 0, left: 0, height: `${borderWidth}px`, width: `${cornerSize}px`, borderBottomLeftRadius: '8px' }} /><div style={{ ...segmentStyle, bottom: 0, left: 0, width: `${borderWidth}px`, height: `${cornerSize}px`, borderBottomLeftRadius: '8px' }} /></>;
        case 'bottomRight': return <><div style={{ ...segmentStyle, bottom: 0, right: 0, height: `${borderWidth}px`, width: `${cornerSize}px`, borderBottomRightRadius: '8px' }} /><div style={{ ...segmentStyle, bottom: 0, right: 0, width: `${borderWidth}px`, height: `${cornerSize}px`, borderBottomRightRadius: '8px' }} /></>;
        default: return null;
    }
  };

  const renderCircuitTrace = () => {
    const { intensity, position, edge } = animatedValuesRef.current;
    const traceIntensityThreshold = 0.2;
    if (intensity < traceIntensityThreshold || !edge || (isTransitioning && !isSelected)) {
      return null;
    }
    const simplifiedForMobile = isMobile;
    const visualScale = intensity; // Use raw intensity for scaling SVG elements
    const opacity = Math.min(1, intensity); // Opacity capped at 1

    const baseExtension = simplifiedForMobile ? 3 : 6;
    const dynamicExtension = simplifiedForMobile ? 0 : visualScale * 15; // Scale extension with visualScale
    const traceExtension = baseExtension + ( (visualScale > 1 && !simplifiedForMobile) ? (visualScale -1) * 25 : 0); // Further boost for intensity > 1 on desktop

    return (
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none z-10"
        viewBox={`0 0 ${cardWidth} ${cardHeight}`} 
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        {edge === 'top' && (
          <path
            d={simplifiedForMobile 
              ? `M${position * cardWidth},${borderWidth} v${baseExtension}` 
              : `M${position * cardWidth},${borderWidth} v${baseExtension} h${traceExtension}`}
            stroke="#ff0066" strokeWidth="1" fill="none"
            strokeDasharray={simplifiedForMobile ? "3,3" : "4,3"}
            style={{ opacity: opacity * 0.7, filter: `drop-shadow(0 0 ${2 * visualScale}px #ff0066)`, animation: 'dashOffset 2s linear infinite', animationPlayState: 'running' }}
          />
        )}
        {edge === 'right' && (
          <path
            d={simplifiedForMobile 
              ? `M${cardWidth - borderWidth},${position * cardHeight} h-${baseExtension}` 
              : `M${cardWidth - borderWidth},${position * cardHeight} h-${baseExtension} v${traceExtension}`}
            stroke="#ff0066" strokeWidth="1" fill="none"
            strokeDasharray={simplifiedForMobile ? "3,3" : "4,3"}
            style={{ opacity: opacity * 0.7, filter: `drop-shadow(0 0 ${2 * visualScale}px #ff0066)`, animation: 'dashOffset 2s linear infinite', animationPlayState: 'running' }}
          />
        )}
        {edge === 'bottom' && (
          <path
            d={simplifiedForMobile 
              ? `M${(1-position) * cardWidth},${cardHeight - borderWidth} v-${baseExtension}` 
              : `M${(1-position) * cardWidth},${cardHeight - borderWidth} v-${baseExtension} h-${traceExtension}`}
            stroke="#ff0066" strokeWidth="1" fill="none"
            strokeDasharray={simplifiedForMobile ? "3,3" : "4,3"}
            style={{ opacity: opacity * 0.7, filter: `drop-shadow(0 0 ${2 * visualScale}px #ff0066)`, animation: 'dashOffset 2s linear infinite', animationPlayState: 'running' }}
          />
        )}
        {edge === 'left' && (
          <path
            d={simplifiedForMobile 
              ? `M${borderWidth},${(1-position) * cardHeight} h${baseExtension}` 
              : `M${borderWidth},${(1-position) * cardHeight} h${baseExtension} v-${traceExtension}`}
            stroke="#ff0066" strokeWidth="1" fill="none" 
            strokeDasharray={simplifiedForMobile ? "3,3" : "4,3"}
            style={{ opacity: opacity * 0.7, filter: `drop-shadow(0 0 ${2 * visualScale}px #ff0066)`, animation: 'dashOffset 2s linear infinite', animationPlayState: 'running' }}
          />
        )}
        {/* Corner traces can also scale with visualScale */} 
        {!simplifiedForMobile && edge === 'topLeft' && <path d={`M${borderWidth + 1},${borderWidth + 1} l${4*visualScale},${4*visualScale} l${4*visualScale},${-2*visualScale} l${6*visualScale},${6*visualScale}`} stroke="#ff0066" strokeWidth="1" fill="none" strokeDasharray="3,2" style={{ opacity: opacity * 0.7, filter: `drop-shadow(0 0 ${2*visualScale}px #ff0066)`, animation: 'dashOffset 1.8s linear infinite'}} />}
        {!simplifiedForMobile && edge === 'topRight' && <path d={`M${cardWidth - borderWidth - 1},${borderWidth + 1} l${-4*visualScale},${4*visualScale} l${-4*visualScale},${-2*visualScale} l${-6*visualScale},${6*visualScale}`} stroke="#ff0066" strokeWidth="1" fill="none" strokeDasharray="3,2" style={{ opacity: opacity * 0.7, filter: `drop-shadow(0 0 ${2*visualScale}px #ff0066)`, animation: 'dashOffset 1.8s linear infinite'}} />}
        {!simplifiedForMobile && edge === 'bottomLeft' && <path d={`M${borderWidth + 1},${cardHeight - borderWidth - 1} l${4*visualScale},${-4*visualScale} l${4*visualScale},${2*visualScale} l${6*visualScale},${-6*visualScale}`} stroke="#ff0066" strokeWidth="1" fill="none" strokeDasharray="3,2" style={{ opacity: opacity * 0.7, filter: `drop-shadow(0 0 ${2*visualScale}px #ff0066)`, animation: 'dashOffset 1.8s linear infinite'}} />}
        {!simplifiedForMobile && edge === 'bottomRight' && <path d={`M${cardWidth - borderWidth - 1},${cardHeight - borderWidth - 1} l${-4*visualScale},${-4*visualScale} l${-4*visualScale},${2*visualScale} l${-6*visualScale},${-6*visualScale}`} stroke="#ff0066" strokeWidth="1" fill="none" strokeDasharray="3,2" style={{ opacity: opacity * 0.7, filter: `drop-shadow(0 0 ${2*visualScale}px #ff0066)`, animation: 'dashOffset 1.8s linear infinite'}} />}
        {simplifiedForMobile && (edge === 'topLeft' || edge === 'topRight' || edge === 'bottomLeft' || edge === 'bottomRight') && (
          <path
            d={
              edge === 'topLeft' ? `M${borderWidth + 1},${borderWidth + 1} l${2*visualScale},${2*visualScale}` :
              edge === 'topRight' ? `M${cardWidth - borderWidth - 1},${borderWidth + 1} l${-2*visualScale},${2*visualScale}` :
              edge === 'bottomLeft' ? `M${borderWidth + 1},${cardHeight - borderWidth - 1} l${2*visualScale},${-2*visualScale}` :
              `M${cardWidth - borderWidth - 1},${cardHeight - borderWidth - 1} l${-2*visualScale},${-2*visualScale}`
            }
            stroke="#ff0066" strokeWidth="1" fill="none" strokeDasharray="2,2"
            style={{ opacity: opacity * 0.7, filter: `drop-shadow(0 0 2px #ff0066)`, animation: 'dashOffset 1.8s linear infinite' }}
          />
        )}
      </svg>
    );
  };

  return (
    <div
      ref={itemRef}
      className={`category-item relative rounded-lg overflow-hidden cursor-pointer 
                  border-2 border-transparent group transition-all duration-300 ease-out`}
      style={{
        ...style,
        width: `${cardWidth}px`, 
        minWidth: `${cardWidth}px`, // ensure it doesn't shrink
        height: cardHeight ? `${cardHeight}px` : 'auto',
        // Perspective for 3D hover (optional, can be intensive)
        // perspective: '1000px',
        WebkitTapHighlightColor: 'transparent', // Remove tap highlight on mobile
        filter: (isTransitioning && !isSelected) ? 'blur(5px) brightness(0.5)' : 'none',
        transform: (isTransitioning && !isSelected) ? 'scale(0.92)' : 'scale(1)',
        transition: 'filter 0.4s cubic-bezier(0.25, 0.8, 0.25, 1), transform 0.4s cubic-bezier(0.25, 0.8, 0.25, 1), opacity 0.3s ease-out',
        opacity: (isTransitioning && !isSelected && visualPhase > 0) ? 0 : 1, // Fade out non-selected items once transition starts
        pointerEvents: isTransitioning ? 'none' : 'auto', // Disable interactions during transition for all items
      }}
      onClick={handleSelectWithRef}
      onFocus={() => { /* Can add focus effects */ }}
      onBlur={() => { /* Can remove focus effects */ }}
      role="button"
      tabIndex={0} // Make it focusable
      aria-label={`Select category: ${category.name}`}
      {...props}
    >
      {/* Background Image / Video */}
      <div
        className="absolute inset-0 z-10 flex flex-col items-center justify-center text-center p-3 md:p-4 transition-opacity duration-300 ease-in-out"
        style={{
          backgroundColor: 'rgba(0,0,0,0.4)', // Slightly darker overlay for better text contrast
          opacity: (isMobile || animatedValuesRef.current.intensity > 0.1 || isSelected) ? 1 : 0,
          transition: 'opacity 0.3s ease-in-out' // Smooth transition for opacity
        }}
      >
        <h3 className="text-sm md:text-base font-semibold text-white drop-shadow-md">
          {category.name}
        </h3>
        {category.description && (
          <p className="text-xs md:text-sm text-gray-300 mt-1 hidden group-hover:block transition-all duration-300 ease-in-out">
            {category.description}
          </p>
        )}
      </div>

      {/* Render hover effects only on desktop and if not transitioning (or is the selected one) */}
      {!isMobile && (!isTransitioning || isSelected) && (
        <>
          {renderBorderSegments()}
          {renderCircuitTrace()}
        </>
      )}
    </div>
  );
});

CategoryItem.displayName = 'CategoryItem';
export default CategoryItem; 