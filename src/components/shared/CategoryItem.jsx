import React, { useRef, useEffect, useState, memo, useCallback } from 'react';

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
      if (!itemRef.current || document.hidden) {
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

  return (
    <div
      ref={itemRef}
      className="absolute overflow-visible cursor-pointer select-none"
      style={{
        ...style,
        transform: `${style.transform || ''} ${isSelected ? 'scale(1.1)' : 'scale(1)'}`, // Apply scale if selected
        transition: 'transform 0.3s ease-out', // Smooth transition for scaling
        zIndex: isSelected ? 100 : style.zIndex || 'auto' // Ensure selected card is on top
      }}
      role="link"
      tabIndex="0"
      aria-label={`دسته‌بندی ${category.name}`}
      onClick={() => onCategorySelect && onCategorySelect(category)} // Call handler on click
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          // Potentially trigger navigation or action here
          console.log(`Category clicked: ${category.name}`);
          if (onCategorySelect) {
            onCategorySelect(category);
          }
        }
      }}
      {...props}
    >
      <style jsx="true">{`
        @keyframes neonPulse { 0% { opacity: 0.8; } 50% { opacity: 1; } 100% { opacity: 0.8; } }
        @keyframes dashOffset { from { stroke-dashoffset: 30; } to { stroke-dashoffset: 0; } }
      `}</style>
      
      <div 
        className="absolute inset-0 bg-gradient-to-b from-[#1c0b0f] to-black rounded-lg overflow-hidden"
        style={{ boxShadow: isMobile ? "0 2px 6px rgba(0,0,0,0.3)" : "0 4px 12px rgba(0,0,0,0.3)" }}
      />
      
      <div 
        className="absolute inset-0 rounded-lg pointer-events-none"
        style={{ border: '1px solid rgba(100, 20, 30, 0.4)' }}
      />
      
      {renderBorderSegments()}
      {renderCircuitTrace()}
      
      <div className={`relative z-5 h-full flex flex-col justify-center items-center ${isMobile ? 'p-2' : 'p-4'}`}>
        <span className={`${isMobile ? 'text-lg' : 'text-xl'} font-bold text-white mb-1 md:mb-2`}>{category.name}</span>
        <div 
          className={`text-[#d64356] ${isMobile ? 'text-[10px]' : 'text-sm'} mt-1 flex items-center border border-red-900/40 ${isMobile ? 'px-1.5 py-0.5' : 'px-2 py-1 md:px-3 md:py-1'} rounded-full`}
          style={{ background: "rgba(127,29,29,0.2)", transition: "all 0.3s ease" }}
        >
          <span className="mr-1">مشاهده محصولات</span>
          <svg xmlns="http://www.w3.org/2000/svg" className={`${isMobile ? 'h-2.5 w-2.5' : 'h-4 w-4'} mr-1`} fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </div>
      </div>
      
      <div 
        className="absolute inset-0 opacity-10 mix-blend-overlay pointer-events-none rounded-lg"
        style={{ backgroundImage: "url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIiB4PSIwIiB5PSIwIj48ZmVUdXJidWxlbmNlIGJhc2VGcmVxdWVuY3k9Ii43NSIgc3RpdGNoVGlsZXM9InN0aXRjaCIgdHlwZT0iZnJhY3RhbE5vaXNlIi8+PGZlQ29sb3JNYXRyaXggdHlwZT0ic2F0dXJhdGUiIHZhbHVlcz0iMCIvPjwvZmlsdGVyPjxwYXRoIGQ9Ik0wIDBoMzAwdjMwMEgweiIgZmlsdGVyPSJ1cmwoI2EpIiBvcGFjaXR5PSIuMDUiLz48L3N2Zz4=')", backgroundSize: "cover" }}
        aria-hidden="true"
      />

      <div className="absolute inset-0 rounded-lg pointer-events-none opacity-0 focus-within:opacity-100" 
           style={{ boxShadow: "0 0 0 2px rgba(255,0,102,0.4)", transition: "opacity 0.2s ease" }} />
    </div>
  );
});

CategoryItem.displayName = 'CategoryItem';
export default CategoryItem; 