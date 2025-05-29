import React, { useRef, useEffect, useState, memo, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  calculateVelocity,
  getRandomEffectParams,
  generateEffectStyles,
  generateParticles,
  cleanupParticles,
  updateParticles,
  EFFECT_TYPES
} from '../../utils/hoverEffects';

/**
 * CategoryItem Component
 * 
 * Refined category cards with elegant hover effects and minimal design
 * Optimized for sophisticated user interactions with dynamic velocity-based effects
 */

// Refined animation constants for smoother interactions
const easeOutCubic = t => 1 - Math.pow(1 - t, 3);
const SPRING_FACTOR = 0.12; // Slightly slower for more elegant feel
const MIN_INTENSITY_FOR_RENDER = 0.02;
const VELOCITY_SENSITIVITY = 0.003; // Reduced for subtler effects
const VELOCITY_BOOST_DECAY = 0.92;
const MAX_VELOCITY_BOOST = 0.3; // Reduced for more restrained effects

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
  animationPhase, // New prop for animation phase
  ...props 
}) => {
  const itemRef = useRef(null);
  const lastMousePosRef = useRef({ x: 0, y: 0, time: Date.now() });
  const animationFrameIdRef = useRef(null);
  const particlesRef = useRef([]);
  const lastParticleTimeRef = useRef(0);
  
  const animatedValuesRef = useRef({
    intensity: 0,
    position: 0.5,
    edge: null,
    velocityBoost: 0, // For tracking the boost from mouse speed
  });

  // State for velocity-based dynamic effects
  const [velocityData, setVelocityData] = useState({ 
    speed: 0, 
    direction: { x: 0, y: 0 },
    speedTier: 'SLOW'
  });
  
  // State for dynamic hover effects
  const [hoverEffects, setHoverEffects] = useState({
    isHovering: false,
    effectParams: null,
    elementRect: null
  });
  
  // State for particles system
  const [particles, setParticles] = useState([]);
  
  // State for forcing render updates
  const [, setForceUpdate] = useState(0);

  const proximityThreshold = 60;
  const borderWidth = 2;

  // Callback to handle selection with element reference
  const handleSelectWithRef = useCallback(() => {
    if (onCategorySelect && !isTransitioning) {
      onCategorySelect(category, itemRef);
    }
  }, [category, onCategorySelect, isTransitioning]);

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

      // Check if we are now hovering or just left
      const nowHovering = isInside;
      
      // Update hover state for effects if changed
      if (nowHovering !== hoverEffects.isHovering) {
        setHoverEffects(prev => ({
          ...prev,
          isHovering: nowHovering,
          elementRect: rect,
          effectParams: nowHovering ? 
            getRandomEffectParams(velocityData.speedTier) : 
            null
        }));
        
        // If we're now hovering and moving fast, generate particles
        if (nowHovering && 
            (velocityData.speedTier === 'FAST' || velocityData.speedTier === 'EXTREME') &&
            Date.now() - lastParticleTimeRef.current > 100) { // Rate limit particle generation
          
          const newParticles = generateParticles(
            getRandomEffectParams(velocityData.speedTier), 
            velocityData
          );
          
          // Set initial positions relative to cursor in element
          const particlesWithPositions = newParticles.map(p => ({
            ...p,
            x: relativeX,
            y: relativeY
          }));
          
          setParticles(current => [...current, ...particlesWithPositions]);
          lastParticleTimeRef.current = Date.now();
        }
      }

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
        const currentPos = { x: e.clientX, y: e.clientY };
        const velocity = calculateVelocity(currentPos, prevPos);
        
        // Update last position with the new one
        lastMousePosRef.current = { ...currentPos, time: now };
        
        // Store velocity data for effects
        setVelocityData(velocity);
        
        // Calculate velocity boost for standard hover effect
        const newBoost = Math.min(MAX_VELOCITY_BOOST, velocity.speed * VELOCITY_SENSITIVITY * 5);
        animatedValuesRef.current.velocityBoost = Math.max(animatedValuesRef.current.velocityBoost, newBoost);
      }
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
  }, [isMobile, proximityThreshold, cardWidth, cardHeight, hoverEffects.isHovering, velocityData.speedTier]);
  
  // Particle animation system
  useEffect(() => {
    if (isMobile || particles.length === 0) return;
    
    let lastTimestamp = 0;
    const animateParticles = (timestamp) => {
      if (!lastTimestamp) lastTimestamp = timestamp;
      const deltaTime = timestamp - lastTimestamp;
      lastTimestamp = timestamp;
      
      // Update particle positions
      const updatedParticles = updateParticles(particles, deltaTime);
      
      // Clean up expired particles
      const activeParticles = cleanupParticles(updatedParticles);
      
      setParticles(activeParticles);
      
      if (activeParticles.length > 0) {
        particlesRef.current = requestAnimationFrame(animateParticles);
      }
    };
    
    particlesRef.current = requestAnimationFrame(animateParticles);
    
    return () => {
      if (particlesRef.current) {
        cancelAnimationFrame(particlesRef.current);
      }
    };
  }, [isMobile, particles]);
  
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
    
    const glowColor = '#ef4444'; // Refined red color
    const visualScale = Math.min(intensity, 1); // Cap at 1 for more restrained effect
    const baseSegmentLength = 15; // Smaller base length
    const dynamicSegmentLength = 30 * (1 - visualScale); // Reduced dynamic range
    
    const segmentLength = baseSegmentLength + dynamicSegmentLength;
    const halfSegment = segmentLength / 2;
    
    const startPercent = Math.max(0, position * 100 - halfSegment);
    const endPercent = Math.min(100, position * 100 + halfSegment);
    
    // Apply velocity-based enhancements
    const boostFactor = velocityData.speedTier === 'SLOW' ? 1 :
                       velocityData.speedTier === 'MEDIUM' ? 1.2 :
                       velocityData.speedTier === 'FAST' ? 1.5 : 2;
    
    // Select glow color based on speed
    const dynamicGlowColor = velocityData.speedTier === 'SLOW' ? glowColor :
                            velocityData.speedTier === 'MEDIUM' ? '#ff6b6b' :
                            velocityData.speedTier === 'FAST' ? '#ff3333' : '#ff0000';
    
    const segmentStyle = {
      position: 'absolute',
      backgroundColor: dynamicGlowColor,
      boxShadow: `0 0 ${4 * visualScale * boostFactor}px ${dynamicGlowColor}40, 0 0 ${8 * visualScale * boostFactor}px ${dynamicGlowColor}20`,
      filter: `blur(${0.5 * visualScale * boostFactor}px)`,
      opacity: Math.min(0.8, intensity * 0.8), // More subtle opacity
      pointerEvents: 'none',
      borderRadius: '2px'
    };

    if (edge && (edge.includes('Left') || edge.includes('Right') || edge.includes('Top') || edge.includes('Bottom'))) {
      return renderCornerSegments(edge, visualScale, segmentStyle, boostFactor);
    }

    switch (edge) {
      case 'top': return <div className="absolute top-0" style={{ ...segmentStyle, height: '2px', left: `${startPercent}%`, width: `${endPercent - startPercent}%` }} />;
      case 'right': return <div className="absolute right-0" style={{ ...segmentStyle, width: '2px', top: `${startPercent}%`, height: `${endPercent - startPercent}%` }} />;
      case 'bottom': return <div className="absolute bottom-0" style={{ ...segmentStyle, height: '2px', right: `${startPercent}%`, width: `${endPercent - startPercent}%` }} />;
      case 'left': return <div className="absolute left-0" style={{ ...segmentStyle, width: '2px', bottom: `${startPercent}%`, height: `${endPercent - startPercent}%` }} />;
      default: return null;
    }
  };

  const renderCornerSegments = (corner, visualScale, baseSegmentStyle, boostFactor = 1) => {
    const cornerSize = Math.min(20, 12 + 8 * visualScale * boostFactor); // Smaller, more refined corners
    const segmentStyle = { ...baseSegmentStyle };
    
    switch (corner) {
        case 'topLeft': return <><div style={{ ...segmentStyle, top: 0, left: 0, height: '2px', width: `${cornerSize}px`, borderTopLeftRadius: '4px' }} /><div style={{ ...segmentStyle, top: 0, left: 0, width: '2px', height: `${cornerSize}px`, borderTopLeftRadius: '4px' }} /></>;
        case 'topRight': return <><div style={{ ...segmentStyle, top: 0, right: 0, height: '2px', width: `${cornerSize}px`, borderTopRightRadius: '4px' }} /><div style={{ ...segmentStyle, top: 0, right: 0, width: '2px', height: `${cornerSize}px`, borderTopRightRadius: '4px' }} /></>;
        case 'bottomLeft': return <><div style={{ ...segmentStyle, bottom: 0, left: 0, height: '2px', width: `${cornerSize}px`, borderBottomLeftRadius: '4px' }} /><div style={{ ...segmentStyle, bottom: 0, left: 0, width: '2px', height: `${cornerSize}px`, borderBottomLeftRadius: '4px' }} /></>;
        case 'bottomRight': return <><div style={{ ...segmentStyle, bottom: 0, right: 0, height: '2px', width: `${cornerSize}px`, borderBottomRightRadius: '4px' }} /><div style={{ ...segmentStyle, bottom: 0, right: 0, width: '2px', height: `${cornerSize}px`, borderBottomRightRadius: '4px' }} /></>;
        default: return null;
    }
  };

  const renderAccentLines = () => {
    const { intensity, position, edge } = animatedValuesRef.current;
    if (intensity < MIN_INTENSITY_FOR_RENDER) return null;
    
    const visualScale = Math.min(intensity, 1);
    const opacity = intensity * 0.4; // More subtle accent lines
    
    // Dynamic line attributes based on velocity
    const boostFactor = velocityData.speedTier === 'SLOW' ? 1 :
                       velocityData.speedTier === 'MEDIUM' ? 1.3 :
                       velocityData.speedTier === 'FAST' ? 1.7 : 2.2;
                       
    const lineLength = (8 + (visualScale * 6)) * boostFactor; // Shorter, more refined lines
    
    // Dynamic color based on velocity
    const lineColor = velocityData.speedTier === 'SLOW' ? "#ef4444" :
                     velocityData.speedTier === 'MEDIUM' ? "#ff5555" :
                     velocityData.speedTier === 'FAST' ? "#ff3333" : "#ff0000";

    return (
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none z-10"
        viewBox={`0 0 ${cardWidth} ${cardHeight}`} 
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        {edge === 'top' && (
          <line
            x1={position * cardWidth}
            y1={2}
            x2={position * cardWidth}
            y2={2 + lineLength}
            stroke={lineColor}
            strokeWidth={velocityData.speedTier === 'EXTREME' ? "1.5" : "1"}
            opacity={opacity}
            style={{ filter: `drop-shadow(0 0 ${boostFactor * 2}px ${lineColor}40)` }}
          />
        )}
        {edge === 'right' && (
          <line
            x1={cardWidth - 2}
            y1={position * cardHeight}
            x2={cardWidth - 2 - lineLength}
            y2={position * cardHeight}
            stroke={lineColor}
            strokeWidth={velocityData.speedTier === 'EXTREME' ? "1.5" : "1"}
            opacity={opacity}
            style={{ filter: `drop-shadow(0 0 ${boostFactor * 2}px ${lineColor}40)` }}
          />
        )}
        {edge === 'bottom' && (
          <line
            x1={(1-position) * cardWidth}
            y1={cardHeight - 2}
            x2={(1-position) * cardWidth}
            y2={cardHeight - 2 - lineLength}
            stroke={lineColor}
            strokeWidth={velocityData.speedTier === 'EXTREME' ? "1.5" : "1"}
            opacity={opacity}
            style={{ filter: `drop-shadow(0 0 ${boostFactor * 2}px ${lineColor}40)` }}
          />
        )}
        {edge === 'left' && (
          <line
            x1={2}
            y1={(1-position) * cardHeight}
            x2={2 + lineLength}
            y2={(1-position) * cardHeight}
            stroke={lineColor}
            strokeWidth={velocityData.speedTier === 'EXTREME' ? "1.5" : "1"}
            opacity={opacity}
            style={{ filter: `drop-shadow(0 0 ${boostFactor * 2}px ${lineColor}40)` }}
          />
        )}
      </svg>
    );
  };
  
  // Generate dynamic styles based on hover state and velocity
  const getDynamicStyles = () => {
    if (!hoverEffects.isHovering || !hoverEffects.effectParams) return {};
    
    const { effectParams } = hoverEffects;
    const styles = {};
    
    // Apply scale effect
    if (effectParams.enabledEffects.includes(EFFECT_TYPES.SCALE)) {
      const scaleStyles = generateEffectStyles(effectParams, EFFECT_TYPES.SCALE);
      Object.assign(styles, scaleStyles);
    }
    
    // Apply glow effect
    if (effectParams.enabledEffects.includes(EFFECT_TYPES.GLOW)) {
      const glowStyles = generateEffectStyles(effectParams, EFFECT_TYPES.GLOW);
      Object.assign(styles, glowStyles);
    }
    
    // Apply color shift effect
    if (effectParams.enabledEffects.includes(EFFECT_TYPES.COLOR_SHIFT)) {
      const colorStyles = generateEffectStyles(effectParams, EFFECT_TYPES.COLOR_SHIFT);
      Object.assign(styles, colorStyles);
    }
    
    // Apply distortion effects for extreme speeds
    if (effectParams.enabledEffects.includes(EFFECT_TYPES.DISTORTION)) {
      const distortionStyles = generateEffectStyles(effectParams, EFFECT_TYPES.DISTORTION);
      Object.assign(styles, distortionStyles);
    }
    
    return styles;
  };
  
  // Render particles
  const renderParticles = () => {
    if (particles.length === 0) return null;
    
    return (
      <div className="absolute inset-0 overflow-visible pointer-events-none z-20">
        {particles.map(particle => (
          <div
            key={particle.id}
            className="absolute rounded-full"
            style={{
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              backgroundColor: particle.color,
              left: `${particle.x}px`,
              top: `${particle.y}px`,
              opacity: 1 - ((Date.now() - particle.createdAt) / particle.lifetime),
              transform: `translate(-50%, -50%)`,
              boxShadow: `0 0 ${particle.size * 2}px ${particle.color}`,
              transition: 'none'
            }}
          />
        ))}
      </div>
    );
  };
  
  // Dynamic text effect for category name based on velocity
  const getCategoryNameStyle = () => {
    if (!hoverEffects.isHovering || !hoverEffects.effectParams) {
      return {
        background: 'linear-gradient(135deg, #ffffff 0%, #f0f0f0 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text'
      };
    }
    
    const { effectParams } = hoverEffects;
    
    if (effectParams.speedTier === 'EXTREME' && 
        effectParams.enabledEffects.includes(EFFECT_TYPES.TEXT_EFFECT)) {
      // Wild text effect for extreme speeds
      return {
        background: `linear-gradient(45deg, ${effectParams.colorPalette.join(', ')})`,
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
        textShadow: `0 0 5px ${effectParams.color}80`,
        animation: 'textGlitch 0.3s infinite',
        letterSpacing: '0.05em'
      };
    } else if (effectParams.speedTier === 'FAST' && 
              effectParams.enabledEffects.includes(EFFECT_TYPES.TEXT_EFFECT)) {
      // Enhanced text effect for fast speeds
      return {
        background: `linear-gradient(135deg, #ffffff 0%, ${effectParams.color} 100%)`,
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
        textShadow: `0 0 3px ${effectParams.color}50`
      };
    } else if (effectParams.speedTier === 'MEDIUM') {
      // Subtle enhancement for medium speeds
      return {
        background: 'linear-gradient(135deg, #ffffff 0%, #e0e0e0 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
        textShadow: '0 0 1px rgba(255,255,255,0.5)'
      };
    } else {
      // Default style for slow speeds
      return {
        background: 'linear-gradient(135deg, #ffffff 0%, #f0f0f0 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text'
      };
    }
  };

  return (
    <motion.div
      ref={itemRef}
      className={`overflow-visible cursor-pointer select-none ${
        isSelected && !isTransitioning ? 'z-50' : ''
      }`}
      style={{
        ...style,
        width: '100%',
        height: '100%',
        zIndex: isSelected ? 100 : style.zIndex || 'auto',
        pointerEvents: isTransitioning ? 'none' : 'auto',
        visibility: isSelected && isTransitioning && animationPhase >= 2 ? 'hidden' : 'visible',
        ...getDynamicStyles()
      }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ 
        opacity: isSelected && isTransitioning && animationPhase >= 2 ? 0 : 1,
        y: 0,
        scale: isSelected && !isTransitioning ? 1.05 : 
               isSelected && isTransitioning && animationPhase === 1 ? 1.08 : 
               isSelected && isTransitioning && animationPhase >= 2 ? 0.01 : 1
      }}
      transition={{ 
        duration: 0.6, 
        ease: [0.16, 1, 0.3, 1],
        scale: { duration: 0.4 }
      }}
      whileHover={{ 
        y: -2,
        transition: { duration: 0.2, ease: "easeOut" }
      }}
      role="link"
      tabIndex="0"
      aria-label={`دسته‌بندی ${category.name}`}
      onClick={handleSelectWithRef}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleSelectWithRef();
        }
      }}
      {...props}
    >
      {/* Blur overlay for non-selected cards during transition */}
      {isTransitioning && !isSelected && animationPhase === 1 && (
        <motion.div 
          className="absolute inset-0 bg-black/50 backdrop-blur-sm z-10 rounded-xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        />
      )}

      {/* Main card background with refined gradient */}
      <motion.div 
        className={`absolute inset-0 rounded-xl overflow-hidden backdrop-blur-sm ${
          isSelected && isTransitioning && animationPhase === 1 ? 'ring-2 ring-red-500/40' : ''
        }`}
        style={{ 
          background: 'linear-gradient(135deg, rgba(15, 15, 17, 0.95) 0%, rgba(25, 25, 28, 0.9) 50%, rgba(12, 12, 14, 0.95) 100%)',
          border: '1px solid rgba(60, 60, 65, 0.3)',
          boxShadow: isSelected && isTransitioning ? 
            "0 20px 40px rgba(0,0,0,0.6), 0 0 20px rgba(239, 68, 68, 0.2)" : 
            isMobile ? "0 4px 12px rgba(0,0,0,0.2)" : "0 8px 24px rgba(0,0,0,0.15)"
        }}
        animate={{
          boxShadow: isSelected && isTransitioning ?
            "0 20px 40px rgba(0,0,0,0.6), 0 0 20px rgba(239, 68, 68, 0.2)" :
            isMobile ? "0 4px 12px rgba(0,0,0,0.2)" : "0 8px 24px rgba(0,0,0,0.15)"
        }}
        transition={{ duration: 0.3 }}
      />
      
      {/* Subtle inner border */}
      <div 
        className="absolute inset-[1px] rounded-xl pointer-events-none"
        style={{ 
          background: 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, transparent 50%, rgba(255,255,255,0.02) 100%)',
          border: '1px solid rgba(255,255,255,0.08)'
        }}
      />
      
      {/* Interactive border effects */}
      {renderBorderSegments()}
      {renderAccentLines()}
      
      {/* Render particles */}
      {renderParticles()}
      
      {/* Content area with refined typography */}
      <div className={`relative z-10 h-full flex flex-col justify-center items-center ${isMobile ? 'p-3' : 'p-6'}`}>
        <motion.h3 
          className={`${isMobile ? 'text-lg' : 'text-xl md:text-2xl'} font-medium text-white mb-2 md:mb-3 text-center leading-tight`}
          style={getCategoryNameStyle()}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          {category.name}
        </motion.h3>
        
        <motion.div 
          className={`inline-flex items-center gap-2 text-red-400/90 ${isMobile ? 'text-xs' : 'text-sm'} font-light border border-red-500/20 ${isMobile ? 'px-3 py-1.5' : 'px-4 py-2'} rounded-full backdrop-blur-sm`}
          style={{ 
            background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, rgba(239, 68, 68, 0.05) 100%)',
            transition: 'all 0.3s ease'
          }}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          whileHover={{
            background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.15) 0%, rgba(239, 68, 68, 0.08) 100%)',
            borderColor: 'rgba(239, 68, 68, 0.3)'
          }}
        >
          <span>مشاهده محصولات</span>
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className={`${isMobile ? 'h-3 w-3' : 'h-4 w-4'} transition-transform duration-200 group-hover:translate-x-0.5`} 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor" 
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </motion.div>
      </div>
      
      {/* Subtle texture overlay */}
      <div 
        className="absolute inset-0 opacity-[0.03] mix-blend-overlay pointer-events-none rounded-xl"
        style={{ 
          backgroundImage: "url('data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E')",
          backgroundSize: '200px 200px'
        }}
        aria-hidden="true"
      />

      {/* Focus indicator */}
      <div 
        className="absolute inset-0 rounded-xl pointer-events-none opacity-0 focus-within:opacity-100" 
        style={{ 
          boxShadow: "0 0 0 2px rgba(239, 68, 68, 0.4)", 
          transition: "opacity 0.2s ease" 
        }} 
      />
      
      {/* Add CSS for text glitch animation */}
      <style jsx>{`
        @keyframes textGlitch {
          0% { transform: translate(0); }
          20% { transform: translate(-2px, 2px); }
          40% { transform: translate(2px, -2px); }
          60% { transform: translate(-2px, -2px); }
          80% { transform: translate(2px, 2px); }
          100% { transform: translate(0); }
        }
      `}</style>
    </motion.div>
  );
});

CategoryItem.displayName = 'CategoryItem';
export default CategoryItem;