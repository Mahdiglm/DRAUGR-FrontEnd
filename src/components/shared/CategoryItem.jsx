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
const SPRING_FACTOR = 0.15; // Controls smoothness/responsiveness of the spring animation
const MIN_INTENSITY_FOR_RENDER = 0.01; // Minimum intensity to render effects

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
  const lastMousePosRef = useRef({ x: 0, y: 0 });
  const animationFrameIdRef = useRef(null);
  
  // Refs for animated values, updated in rAF, read during render
  const animatedValuesRef = useRef({
    intensity: 0,
    position: 0.5, // Default to center
    edge: null,
  });

  // State to trigger re-renders from the animation loop
  const [, setForceUpdate] = useState(0);

  // Settings
  const proximityThreshold = 60;
  const borderWidth = 2;

  // Effect for mobile devices (sets animated values directly)
  useEffect(() => {
    if (isMobile) {
      if (mobileHighlight) {
        animatedValuesRef.current = {
          intensity: mobileHighlightIntensity,
          position: mobileHighlightPosition,
          edge: mobileHighlightEdge,
        };
      } else {
        animatedValuesRef.current = { intensity: 0, position: 0.5, edge: null };
      }
      setForceUpdate(val => val + 1); // Trigger re-render to apply mobile state
    }
  }, [isMobile, mobileHighlight, mobileHighlightEdge, mobileHighlightIntensity, mobileHighlightPosition]);

  // Main hover animation effect for non-mobile devices
  useEffect(() => {
    if (isMobile) {
      // If it becomes mobile, ensure any existing desktop animation is cancelled
      if (animationFrameIdRef.current) {
        cancelAnimationFrame(animationFrameIdRef.current);
        animationFrameIdRef.current = null;
        // Optionally reset desktop animation values if needed
        // animatedValuesRef.current = { intensity: 0, position: 0.5, edge: null };
        // setForceUpdate(val => val + 1);
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

      let targetIntensity = 0;
      let targetPosition = 0.5; // Default to center if not near

      if (minDistance < proximityThreshold) {
        const rawProximityFactor = 1 - (minDistance / proximityThreshold);
        const t = Math.max(0, Math.min(1, rawProximityFactor));
        targetIntensity = easeOutCubic(t);
        targetPosition = getPositionAlongEdge(closestEdge, relativeX, relativeY, rect.width, rect.height);
      } else {
        // When not near, target intensity is 0, but keep current edge until intensity is low
        // targetPosition remains where it was or defaults, to avoid snapping.
        targetPosition = animatedValuesRef.current.position; // Or 0.5
      }
      
      const currentAV = animatedValuesRef.current;
      const nextIntensity = currentAV.intensity + (targetIntensity - currentAV.intensity) * SPRING_FACTOR;
      const nextPosition = currentAV.position + (targetPosition - currentAV.position) * SPRING_FACTOR;
      
      currentAV.intensity = nextIntensity;
      currentAV.position = nextPosition;
      currentAV.edge = (targetIntensity > MIN_INTENSITY_FOR_RENDER || currentAV.intensity > MIN_INTENSITY_FOR_RENDER) ? closestEdge : null;

      // Force re-render if the animation is active
      const intensityChanged = Math.abs(targetIntensity - currentAV.intensity) > 0.001;
      const positionChanged = Math.abs(targetPosition - currentAV.position) > 0.001;
      const stillVisible = currentAV.intensity > MIN_INTENSITY_FOR_RENDER;
      const wasVisible = targetIntensity > 0; // If target was to be visible

      if (intensityChanged || positionChanged || (stillVisible && !wasVisible) || (wasVisible && currentAV.intensity <= MIN_INTENSITY_FOR_RENDER) ) {
        setForceUpdate(val => val + 1);
      }
      
      animationFrameIdRef.current = requestAnimationFrame(processHoverState);
    };

    const handleGlobalMouseMove = (e) => {
      lastMousePosRef.current = { x: e.clientX, y: e.clientY };
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
  }, [isMobile, proximityThreshold]); // Dependencies that restart the effect
  
  const getPositionAlongEdge = (edge, x, y, width, height) => {
    switch (edge) {
      case 'top': return x / width;
      case 'right': return y / height;
      case 'bottom': return 1 - (x / width);
      case 'left': return 1 - (y / height);
      case 'topLeft': return Math.min(x / width, y / height) * 0.5;
      case 'topRight': return Math.min(1 - (x / width), y / height) * 0.5;
      case 'bottomLeft': return Math.min(x / width, 1 - (y / height)) * 0.5;
      case 'bottomRight': return Math.min(1 - (x / width), 1 - (y / height)) * 0.5;
      default: return 0.5; // Default to center
    }
  };

  const renderBorderSegments = () => {
    const { intensity, position, edge } = animatedValuesRef.current;
    if (intensity < MIN_INTENSITY_FOR_RENDER) return null;
    
    const glowColor = '#ff0066';
    const segmentLength = 20 + (1 - intensity) * 50;
    const halfSegment = segmentLength / 2;
    const startPercent = Math.max(0, position * 100 - halfSegment);
    const endPercent = Math.min(100, position * 100 + halfSegment);
    const segmentStyle = {
      position: 'absolute', backgroundColor: glowColor,
      boxShadow: `0 0 ${6 * intensity}px ${glowColor}`,
      filter: `drop-shadow(0 0 ${4 * intensity}px ${glowColor})`,
      opacity: intensity, pointerEvents: 'none',
    };

    if (edge && (edge.includes('Left') || edge.includes('Right') || edge.includes('Top') || edge.includes('Bottom'))) {
      return renderCornerSegments(edge, intensity, segmentStyle);
    }

    switch (edge) {
      case 'top': return <div className="absolute top-0 rounded-t-lg overflow-hidden" style={{ ...segmentStyle, height: `${borderWidth}px`, left: `${startPercent}%`, width: `${endPercent - startPercent}%` }} />;
      case 'right': return <div className="absolute right-0 rounded-r-lg overflow-hidden" style={{ ...segmentStyle, width: `${borderWidth}px`, top: `${startPercent}%`, height: `${endPercent - startPercent}%` }} />;
      case 'bottom': return <div className="absolute bottom-0 rounded-b-lg overflow-hidden" style={{ ...segmentStyle, height: `${borderWidth}px`, right: `${startPercent}%`, width: `${endPercent - startPercent}%` }} />;
      case 'left': return <div className="absolute left-0 rounded-l-lg overflow-hidden" style={{ ...segmentStyle, width: `${borderWidth}px`, bottom: `${startPercent}%`, height: `${endPercent - startPercent}%` }} />;
      default: return null;
    }
  };

  const renderCornerSegments = (corner, intensity, baseSegmentStyle) => {
    const cornerSize = Math.min(40, 30 + intensity * 20);
    const segmentStyle = { ...baseSegmentStyle, borderRadius: 'inherit' }; // Inherit from parent for rounded corners
    
    // Simplified return for brevity, ensure radii like '8px' or specific classes are applied as needed
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
    const simplifiedForMobile = isMobile; // isMobile is from props

    // Ensure cardHeight is correctly determined (e.g., from props or calculated based on isMobile)
    const cardHeight = isMobile ? 120 : 160;

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
              ? `M${position * cardWidth},${borderWidth} v3` 
              : `M${position * cardWidth},${borderWidth} v6 h${intensity * 15}`}
            stroke="#ff0066" strokeWidth="1" fill="none"
            strokeDasharray={simplifiedForMobile ? "3,3" : "4,3"}
            style={{ opacity: intensity * 0.7, filter: `drop-shadow(0 0 2px #ff0066)`, animation: 'dashOffset 2s linear infinite', animationPlayState: 'running' }}
          />
        )}
        {edge === 'right' && (
          <path
            d={simplifiedForMobile 
              ? `M${cardWidth - borderWidth},${position * cardHeight} h-3` 
              : `M${cardWidth - borderWidth},${position * cardHeight} h-6 v${intensity * 15}`}
            stroke="#ff0066" strokeWidth="1" fill="none"
            strokeDasharray={simplifiedForMobile ? "3,3" : "4,3"}
            style={{ opacity: intensity * 0.7, filter: `drop-shadow(0 0 2px #ff0066)`, animation: 'dashOffset 2s linear infinite', animationPlayState: 'running' }}
          />
        )}
        {edge === 'bottom' && (
          <path
            d={simplifiedForMobile 
              ? `M${(1-position) * cardWidth},${cardHeight - borderWidth} v-3` 
              : `M${(1-position) * cardWidth},${cardHeight - borderWidth} v-6 h-${intensity * 15}`}
            stroke="#ff0066" strokeWidth="1" fill="none"
            strokeDasharray={simplifiedForMobile ? "3,3" : "4,3"}
            style={{ opacity: intensity * 0.7, filter: `drop-shadow(0 0 2px #ff0066)`, animation: 'dashOffset 2s linear infinite', animationPlayState: 'running' }}
          />
        )}
        {edge === 'left' && (
          <path
            d={simplifiedForMobile 
              ? `M${borderWidth},${(1-position) * cardHeight} h3` 
              : `M${borderWidth},${(1-position) * cardHeight} h6 v-${intensity * 15}`}
            stroke="#ff0066" strokeWidth="1" fill="none" 
            strokeDasharray={simplifiedForMobile ? "3,3" : "4,3"}
            style={{ opacity: intensity * 0.7, filter: `drop-shadow(0 0 2px #ff0066)`, animation: 'dashOffset 2s linear infinite', animationPlayState: 'running' }}
          />
        )}
        {!simplifiedForMobile && edge === 'topLeft' && <path d={`M${borderWidth + 1},${borderWidth + 1} l4,4 l4,-2 l6,6`} stroke="#ff0066" strokeWidth="1" fill="none" strokeDasharray="3,2" style={{ opacity: intensity * 0.7, filter: `drop-shadow(0 0 2px #ff0066)`, animation: 'dashOffset 1.8s linear infinite'}} />}
        {!simplifiedForMobile && edge === 'topRight' && <path d={`M${cardWidth - borderWidth - 1},${borderWidth + 1} l-4,4 l-4,-2 l-6,6`} stroke="#ff0066" strokeWidth="1" fill="none" strokeDasharray="3,2" style={{ opacity: intensity * 0.7, filter: `drop-shadow(0 0 2px #ff0066)`, animation: 'dashOffset 1.8s linear infinite'}} />}
        {!simplifiedForMobile && edge === 'bottomLeft' && <path d={`M${borderWidth + 1},${cardHeight - borderWidth - 1} l4,-4 l4,2 l6,-6`} stroke="#ff0066" strokeWidth="1" fill="none" strokeDasharray="3,2" style={{ opacity: intensity * 0.7, filter: `drop-shadow(0 0 2px #ff0066)`, animation: 'dashOffset 1.8s linear infinite'}} />}
        {!simplifiedForMobile && edge === 'bottomRight' && <path d={`M${cardWidth - borderWidth - 1},${cardHeight - borderWidth - 1} l-4,-4 l-4,2 l-6,-6`} stroke="#ff0066" strokeWidth="1" fill="none" strokeDasharray="3,2" style={{ opacity: intensity * 0.7, filter: `drop-shadow(0 0 2px #ff0066)`, animation: 'dashOffset 1.8s linear infinite'}} />}
        {simplifiedForMobile && (edge === 'topLeft' || edge === 'topRight' || edge === 'bottomLeft' || edge === 'bottomRight') && (
          <path
            d={
              edge === 'topLeft' ? `M${borderWidth + 1},${borderWidth + 1} l2,2` :
              edge === 'topRight' ? `M${cardWidth - borderWidth - 1},${borderWidth + 1} l-2,2` :
              edge === 'bottomLeft' ? `M${borderWidth + 1},${cardHeight - borderWidth - 1} l2,-2` :
              `M${cardWidth - borderWidth - 1},${cardHeight - borderWidth - 1} l-2,-2`
            }
            stroke="#ff0066" strokeWidth="1" fill="none" strokeDasharray="2,2"
            style={{ opacity: intensity * 0.7, filter: `drop-shadow(0 0 2px #ff0066)`, animation: 'dashOffset 1.8s linear infinite' }}
          />
        )}
      </svg>
    );
  };

  return (
    <div
      ref={itemRef}
      className="absolute overflow-visible cursor-pointer select-none"
      style={style} // Ensure style prop is passed through
      role="link"
      tabIndex="0"
      aria-label={`دسته‌بندی ${category.name}`}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          console.log(`Category clicked: ${category.name}`);
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