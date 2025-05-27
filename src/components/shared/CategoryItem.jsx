import React, { useRef, useEffect, useState, memo, useCallback } from 'react';
import { motion } from 'framer-motion'; // Ensure motion is imported

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
  style, // Keep this for direct style application from CategoryRows if any
  cardWidth,
  cardHeight,
  isMobile = false, 
  mobileHighlight = false,
  mobileHighlightEdge = 'top',
  mobileHighlightIntensity = 0.5,
  mobileHighlightPosition = 0.5,
  onCategorySelect,         // New: Callback from CategoryRows
  isSelectedForTransition,  // New: True if this item is selected for the main transition
  isAnotherItemSelected,    // New: True if another item is selected for the main transition
  ...props 
}) => {
  const cardElementRef = useRef(null); // Renamed from itemRef for clarity
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
  const borderWidth = 2; // Keep for border calculations if any

  // Callback to handle selection with element reference
  const handleSelectWithRef = useCallback(() => {
    // Always call onCategorySelect if provided. CategoryRows will handle logic 
    // about whether a transition is already in progress.
    if (onCategorySelect) {
      onCategorySelect(category, cardElementRef.current); // Pass the DOM element
    }
  }, [category, onCategorySelect]); // cardElementRef is stable

  // Mobile-specific effect: Update refs, but DO NOT call setForceUpdate here.
  useEffect(() => {
    if (isMobile) {
      animatedValuesRef.current = {
        intensity: mobileHighlight ? mobileHighlightIntensity : 0,
        position: mobileHighlight ? mobileHighlightPosition : 0.5,
        edge: mobileHighlight ? mobileHighlightEdge : null,
        velocityBoost: 0, // Reset velocity boost on mobile
      };
      // No setForceUpdate here
    }
    // When isMobile becomes false, the desktop useEffect will handle re-initializing the animation state.
  }, [isMobile, mobileHighlight, mobileHighlightEdge, mobileHighlightIntensity, mobileHighlightPosition]);

  // Main hover animation effect for non-mobile devices
  useEffect(() => {
    // If this card is part of any transition, or on mobile, disable hover effects.
    if (isMobile || isSelectedForTransition || isAnotherItemSelected) {
      if (animationFrameIdRef.current) {
        cancelAnimationFrame(animationFrameIdRef.current);
        animationFrameIdRef.current = null;
        // Reset hover animations state when disabled
        animatedValuesRef.current = { intensity: 0, position: 0.5, edge: null, velocityBoost: 0 };
        // Potentially force an update if immediate visual reset of hover is needed
        // setForceUpdate(val => val + 1); 
      }
      return;
    }

    const processHoverState = () => {
      if (!cardElementRef.current || document.hidden) {
        animationFrameIdRef.current = requestAnimationFrame(processHoverState);
        return;
      }

      const { x: mouseX, y: mouseY } = lastMousePosRef.current;
      const rect = cardElementRef.current.getBoundingClientRect();
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
  }, [isMobile, proximityThreshold, cardWidth, cardHeight]); // Added cardWidth, cardHeight
  
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
    if (intensity < MIN_INTENSITY_FOR_RENDER) return null;
    
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
    if (intensity < MIN_INTENSITY_FOR_RENDER) return null;
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

  // Determine dynamic styles/animations based on transition state
  let motionProps = {};
  if (isSelectedForTransition) {
    motionProps = {
      animate: { 
        opacity: 0, 
        scale: 0.7, 
        filter: 'blur(0px)', // Ensure no blur if it was previously blurred
        transition: { duration: 0.1, ease: "easeOut" } 
      },
      style: { ...style, pointerEvents: 'none' }, // Add pointerEvents none here
    };
  } else if (isAnotherItemSelected) {
    motionProps = {
      animate: { 
        opacity: 0.5, 
        scale: 0.90, 
        filter: 'blur(3px) brightness(0.7)', 
        transition: { duration: 0.3, ease: "easeInOut" } 
      },
      style: { ...style, pointerEvents: 'none' }, // Add pointerEvents none here
    };
  } else {
    // Default state or when no transition is active
    motionProps = {
      animate: { opacity: 1, scale: 1, filter: 'blur(0px) brightness(1)' }, // Ensure reset to default
      style: style, // Apply base style from props
    };
  }

  return (
    <motion.div
      ref={cardElementRef} // Attach ref here
      className={`relative rounded-lg overflow-hidden cursor-pointer shadow-lg group transform transition-all duration-300 ease-out hover:shadow-draugr-glow focus:outline-none focus:ring-2 focus:ring-draugr-red focus:ring-opacity-75`}
      style={motionProps.style} // Apply merged style
      onClick={handleSelectWithRef}
      onKeyPress={(e) => e.key === 'Enter' && handleSelectWithRef()}
      tabIndex={0} // Make it focusable
      aria-label={`Category: ${category.name}`}
      role="button"
      // Apply animation variants or direct animate prop
      initial={{ opacity: 1, scale: 1, filter: 'blur(0px) brightness(1)' }} // Start with default appearance
      animate={motionProps.animate} // Controlled by transition state
      whileHover={!isMobile && !isSelectedForTransition && !isAnotherItemSelected ? { scale: 1.05, y: -5 } : {}} // Standard hover if not in transition
      // Remove old transition related props if they were for motion variants here
      {...props} // Spread other props like style from CategoryRows
    >
      {/* Visual content: Image, Title, etc. */}
      <div 
        className="absolute inset-0 bg-cover bg-center transition-transform duration-500 ease-in-out group-hover:scale-110"
        style={{ backgroundImage: `url(${category.image_url || 'https://via.placeholder.com/300x200/1a0000/4a0000?Text=Draugr+Realm'})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
      
      {/* Conditional rendering for hover effects if not in transition */}
      {!isMobile && !isSelectedForTransition && !isAnotherItemSelected && (
        <>
          {renderBorderSegments()}
          {renderCircuitTrace()}
        </>
      )}
      
      <div className="relative z-10 p-4 flex flex-col justify-end h-full">
        <h3 
          className="text-lg md:text-xl font-semibold text-white mb-1 shadow-text"
          style={{ color: category.themeColor || '#FFC0CB' }}
        >
          {category.name}
        </h3>
        <p className="text-xs md:text-sm text-gray-300 shadow-text">
          {category.short_description || "Explore the unknown"}
        </p>
      </div>
      
      {/* Debugging information - remove for production */}
      {/* 
      {(isSelectedForTransition || isAnotherItemSelected) && (
        <div className="absolute top-0 left-0 bg-yellow-300 text-black p-1 text-xs z-20">
          {isSelectedForTransition ? "SELECTED FOR TRANSITION" : "ANOTHER SELECTED"}
        </div>
      )}
      */}
    </motion.div>
  );
});

CategoryItem.displayName = 'CategoryItem';
export default CategoryItem; 