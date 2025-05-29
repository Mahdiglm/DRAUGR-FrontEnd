import React, { useRef, useEffect, useState, memo, useCallback } from 'react';
import { motion } from 'framer-motion';

/**
 * CategoryItem Component
 * 
 * Refined category cards with elegant hover effects, dynamic responsiveness,
 * and enhanced cursor velocity-based animations
 */

// Enhanced animation constants for more dramatic effects
const easeOutCubic = t => 1 - Math.pow(1 - t, 3);
const easeOutElastic = (t) => t === 0 ? 0 : t === 1 ? 1 : Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * ((2 * Math.PI) / 3)) + 1;
const SPRING_FACTOR = 0.12;
const MIN_INTENSITY_FOR_RENDER = 0.02;
const VELOCITY_SENSITIVITY = 0.006; // Increased sensitivity
const VELOCITY_BOOST_DECAY = 0.92;
const MAX_VELOCITY_BOOST = 0.6; // Increased maximum boost
const HIGH_VELOCITY_THRESHOLD = 0.8; // Threshold for high-velocity effects
const EFFECT_DURATION = 600; // Duration for special effects in ms

const CategoryItem = memo(({ 
  category, 
  style, 
  cardWidth,
  cardHeight,
  isMobile = false, 
  mobileHighlight = false,
  mobileHighlightEdge = 'top',
  mobileHighlightIntensity = 0.5,
  mobileHighlightPosition = 0.5,
  onCategorySelect,
  isSelected,
  isTransitioning,
  animationPhase,
  ...props 
}) => {
  const itemRef = useRef(null);
  const lastMousePosRef = useRef({ x: 0, y: 0, time: Date.now() });
  const animationFrameIdRef = useRef(null);
  
  // Enhanced animated values with additional effect states
  const animatedValuesRef = useRef({
    intensity: 0,
    position: 0.5,
    edge: null,
    velocityBoost: 0,
    pulseEffect: false,
    glowEffect: false,
    randomEffectSeed: Math.random(), // Seed for randomizing effects
    effectStartTime: 0,
    highVelocityDetected: false
  });

  const [, setForceUpdate] = useState(0);
  // Add state for high-velocity effects
  const [velocityEffects, setVelocityEffects] = useState({
    active: false,
    type: null,
    intensity: 0,
    startTime: 0
  });

  const proximityThreshold = 60;
  const borderWidth = 2;

  // Callback to handle selection with element reference
  const handleSelectWithRef = useCallback(() => {
    if (onCategorySelect && !isTransitioning) {
      onCategorySelect(category, itemRef);
    }
  }, [category, onCategorySelect, isTransitioning]);

  // Mobile-specific effect
  useEffect(() => {
    if (isMobile) {
      animatedValuesRef.current = {
        intensity: mobileHighlight ? mobileHighlightIntensity : 0,
        position: mobileHighlight ? mobileHighlightPosition : 0.5,
        edge: mobileHighlight ? mobileHighlightEdge : null,
        velocityBoost: 0,
        pulseEffect: false,
        glowEffect: false,
        randomEffectSeed: Math.random(),
        effectStartTime: 0,
        highVelocityDetected: false
      };
    }
  }, [isMobile, mobileHighlight, mobileHighlightEdge, mobileHighlightIntensity, mobileHighlightPosition]);

  // Enhanced hover animation effect for non-mobile devices
  useEffect(() => {
    if (isMobile) {
      if (animationFrameIdRef.current) {
        cancelAnimationFrame(animationFrameIdRef.current);
        animationFrameIdRef.current = null;
        animatedValuesRef.current = { 
          intensity: 0, 
          position: 0.5, 
          edge: null, 
          velocityBoost: 0,
          pulseEffect: false,
          glowEffect: false,
          randomEffectSeed: Math.random(),
          effectStartTime: 0,
          highVelocityDetected: false
        };
        setForceUpdate(val => val + 1);
        setVelocityEffects({
          active: false,
          type: null,
          intensity: 0,
          startTime: 0
        });
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
      
      // Check for high velocity conditions
      const now = Date.now();
      const isHighVelocity = currentVelocityBoost > HIGH_VELOCITY_THRESHOLD;
      
      // Handle high velocity effects
      if (isHighVelocity && !currentAV.highVelocityDetected) {
        // Trigger high-velocity effects
        currentAV.highVelocityDetected = true;
        currentAV.effectStartTime = now;
        currentAV.pulseEffect = Math.random() > 0.5;
        currentAV.glowEffect = Math.random() > 0.3;
        currentAV.randomEffectSeed = Math.random();
        
        // Trigger state update for high-velocity effects
        const effectTypes = ['pulse', 'glow', 'scale', 'shake', 'ripple'];
        const selectedEffect = effectTypes[Math.floor(Math.random() * effectTypes.length)];
        
        setVelocityEffects({
          active: true,
          type: selectedEffect,
          intensity: Math.min(1, currentVelocityBoost / MAX_VELOCITY_BOOST),
          startTime: now
        });
      } 
      
      // Reset high velocity flag when effect is complete
      if (currentAV.highVelocityDetected && now - currentAV.effectStartTime > EFFECT_DURATION) {
        currentAV.highVelocityDetected = false;
      }
      
      // Apply velocity boost decay
      currentAV.velocityBoost *= VELOCITY_BOOST_DECAY;

      const nextIntensity = currentAV.intensity + (targetIntensityWithBoost - currentAV.intensity) * SPRING_FACTOR;
      const nextPosition = currentAV.position + (targetPosition - currentAV.position) * SPRING_FACTOR;
      
      currentAV.intensity = Math.max(0, Math.min(1 + MAX_VELOCITY_BOOST, nextIntensity));
      currentAV.position = nextPosition;
      currentAV.edge = (targetBaseIntensity > MIN_INTENSITY_FOR_RENDER || currentAV.intensity > MIN_INTENSITY_FOR_RENDER) ? closestEdge : null;

      const intensityChanged = Math.abs(targetIntensityWithBoost - currentAV.intensity) > 0.001 || Math.abs(currentAV.velocityBoost) > 0.001;
      const positionChanged = Math.abs(targetPosition - currentAV.position) > 0.001;
      const stillVisible = currentAV.intensity > MIN_INTENSITY_FOR_RENDER;
      const wasTargetingVisible = targetBaseIntensity > 0;
      const effectsActive = currentAV.highVelocityDetected;

      if (intensityChanged || positionChanged || stillVisible || wasTargetingVisible || effectsActive) {
        setForceUpdate(val => val + 1);
      }
      
      animationFrameIdRef.current = requestAnimationFrame(processHoverState);
    };

    // Enhanced mouse movement detection with improved velocity calculation
    const handleGlobalMouseMove = (e) => {
      const now = Date.now();
      const prevPos = lastMousePosRef.current;
      const timeDiff = now - prevPos.time;
      
      if (timeDiff > 1) {
        const distMoved = Math.sqrt((e.clientX - prevPos.x)**2 + (e.clientY - prevPos.y)**2);
        
        // Enhanced velocity calculation with exponential scaling for faster movements
        const speed = distMoved / timeDiff;
        const speedScaled = Math.pow(speed, 1.5) * 0.02; // Exponential scaling for more dramatic effect
        
        const newBoost = Math.min(MAX_VELOCITY_BOOST, speedScaled * VELOCITY_SENSITIVITY * (1 + Math.random() * 0.3));
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
  }, [isMobile, proximityThreshold, cardWidth, cardHeight]);
  
  const getPositionAlongEdge = (edge, x, y, width, height) => {
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

  // Enhanced border segments with velocity-based effects
  const renderBorderSegments = () => {
    const { intensity, position, edge, velocityBoost, pulseEffect, glowEffect, randomEffectSeed } = animatedValuesRef.current;
    if (intensity < MIN_INTENSITY_FOR_RENDER) return null;
    
    // Base colors
    const baseColor = '#ef4444';
    const highVelocityColor = velocityBoost > HIGH_VELOCITY_THRESHOLD ? 
      `hsl(${330 + Math.floor(randomEffectSeed * 30)}, 100%, ${50 + Math.floor(velocityBoost * 20)}%)` : 
      baseColor;
    
    // Dynamic effects based on velocity
    const visualScale = Math.min(intensity * (1 + velocityBoost * 2), 1.5);
    const pulseFactor = pulseEffect && velocityBoost > 0.3 ? 
      (1 + 0.3 * Math.sin(Date.now() / 100)) : 
      1;
    
    const baseSegmentLength = 15 * pulseFactor;
    const dynamicSegmentLength = 30 * (1 - visualScale * 0.8);
    
    const segmentLength = baseSegmentLength + dynamicSegmentLength;
    const halfSegment = segmentLength / 2;
    
    const startPercent = Math.max(0, position * 100 - halfSegment);
    const endPercent = Math.min(100, position * 100 + halfSegment);
    
    // Enhanced segment styling with glow effects
    const segmentStyle = {
      position: 'absolute',
      backgroundColor: highVelocityColor,
      boxShadow: glowEffect && velocityBoost > 0.4 ? 
        `0 0 ${8 * visualScale}px ${highVelocityColor}70, 0 0 ${15 * visualScale}px ${highVelocityColor}40` :
        `0 0 ${4 * visualScale}px ${highVelocityColor}40, 0 0 ${8 * visualScale}px ${highVelocityColor}20`,
      filter: `blur(${0.5 * visualScale * pulseFactor}px)`,
      opacity: Math.min(0.9, intensity * 0.9 * pulseFactor),
      pointerEvents: 'none',
      borderRadius: '2px'
    };

    if (edge && (edge.includes('Left') || edge.includes('Right') || edge.includes('Top') || edge.includes('Bottom'))) {
      return renderCornerSegments(edge, visualScale, segmentStyle, pulseFactor);
    }

    switch (edge) {
      case 'top': return <div className="absolute top-0" style={{ ...segmentStyle, height: '2px', left: `${startPercent}%`, width: `${endPercent - startPercent}%` }} />;
      case 'right': return <div className="absolute right-0" style={{ ...segmentStyle, width: '2px', top: `${startPercent}%`, height: `${endPercent - startPercent}%` }} />;
      case 'bottom': return <div className="absolute bottom-0" style={{ ...segmentStyle, height: '2px', right: `${startPercent}%`, width: `${endPercent - startPercent}%` }} />;
      case 'left': return <div className="absolute left-0" style={{ ...segmentStyle, width: '2px', bottom: `${startPercent}%`, height: `${endPercent - startPercent}%` }} />;
      default: return null;
    }
  };

  // Enhanced corner segments with velocity-based effects
  const renderCornerSegments = (corner, visualScale, baseSegmentStyle, pulseFactor = 1) => {
    const cornerSize = Math.min(25, 15 + 10 * visualScale * pulseFactor);
    const segmentStyle = { ...baseSegmentStyle };
    
    switch (corner) {
        case 'topLeft': return <><div style={{ ...segmentStyle, top: 0, left: 0, height: '2px', width: `${cornerSize}px`, borderTopLeftRadius: '4px' }} /><div style={{ ...segmentStyle, top: 0, left: 0, width: '2px', height: `${cornerSize}px`, borderTopLeftRadius: '4px' }} /></>;
        case 'topRight': return <><div style={{ ...segmentStyle, top: 0, right: 0, height: '2px', width: `${cornerSize}px`, borderTopRightRadius: '4px' }} /><div style={{ ...segmentStyle, top: 0, right: 0, width: '2px', height: `${cornerSize}px`, borderTopRightRadius: '4px' }} /></>;
        case 'bottomLeft': return <><div style={{ ...segmentStyle, bottom: 0, left: 0, height: '2px', width: `${cornerSize}px`, borderBottomLeftRadius: '4px' }} /><div style={{ ...segmentStyle, bottom: 0, left: 0, width: '2px', height: `${cornerSize}px`, borderBottomLeftRadius: '4px' }} /></>;
        case 'bottomRight': return <><div style={{ ...segmentStyle, bottom: 0, right: 0, height: '2px', width: `${cornerSize}px`, borderBottomRightRadius: '4px' }} /><div style={{ ...segmentStyle, bottom: 0, right: 0, width: '2px', height: `${cornerSize}px`, borderBottomRightRadius: '4px' }} /></>;
        default: return null;
    }
  };

  // Enhanced accent lines with velocity-based effects
  const renderAccentLines = () => {
    const { intensity, position, edge, velocityBoost, randomEffectSeed } = animatedValuesRef.current;
    if (intensity < MIN_INTENSITY_FOR_RENDER) return null;
    
    const visualScale = Math.min(intensity * (1 + velocityBoost * 1.5), 1.5);
    const opacity = intensity * (0.4 + velocityBoost * 0.3);
    
    // Dynamic line length based on velocity
    const lineLength = 8 + (visualScale * 6) + (velocityBoost > HIGH_VELOCITY_THRESHOLD ? 8 : 0);
    
    // Color based on velocity
    const lineColor = velocityBoost > HIGH_VELOCITY_THRESHOLD ? 
      `hsl(${330 + Math.floor(randomEffectSeed * 30)}, 100%, ${50 + Math.floor(velocityBoost * 20)}%)` : 
      "#ef4444";

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
            strokeWidth={velocityBoost > HIGH_VELOCITY_THRESHOLD ? "1.5" : "1"}
            opacity={opacity}
            style={{ filter: `drop-shadow(0 0 ${2 + velocityBoost * 3}px ${lineColor}70)` }}
          />
        )}
        {edge === 'right' && (
          <line
            x1={cardWidth - 2}
            y1={position * cardHeight}
            x2={cardWidth - 2 - lineLength}
            y2={position * cardHeight}
            stroke={lineColor}
            strokeWidth={velocityBoost > HIGH_VELOCITY_THRESHOLD ? "1.5" : "1"}
            opacity={opacity}
            style={{ filter: `drop-shadow(0 0 ${2 + velocityBoost * 3}px ${lineColor}70)` }}
          />
        )}
        {edge === 'bottom' && (
          <line
            x1={(1-position) * cardWidth}
            y1={cardHeight - 2}
            x2={(1-position) * cardWidth}
            y2={cardHeight - 2 - lineLength}
            stroke={lineColor}
            strokeWidth={velocityBoost > HIGH_VELOCITY_THRESHOLD ? "1.5" : "1"}
            opacity={opacity}
            style={{ filter: `drop-shadow(0 0 ${2 + velocityBoost * 3}px ${lineColor}70)` }}
          />
        )}
        {edge === 'left' && (
          <line
            x1={2}
            y1={(1-position) * cardHeight}
            x2={2 + lineLength}
            y2={(1-position) * cardHeight}
            stroke={lineColor}
            strokeWidth={velocityBoost > HIGH_VELOCITY_THRESHOLD ? "1.5" : "1"}
            opacity={opacity}
            style={{ filter: `drop-shadow(0 0 ${2 + velocityBoost * 3}px ${lineColor}70)` }}
          />
        )}
      </svg>
    );
  };

  // Render velocity-based special effects
  const renderVelocityEffects = () => {
    if (!velocityEffects.active) return null;
    
    const elapsed = Date.now() - velocityEffects.startTime;
    const progress = Math.min(1, elapsed / EFFECT_DURATION);
    
    // Auto-deactivate effect when done
    if (progress >= 1 && velocityEffects.active) {
      setTimeout(() => {
        setVelocityEffects({
          active: false,
          type: null,
          intensity: 0,
          startTime: 0
        });
      }, 50);
    }
    
    const intensity = velocityEffects.intensity;
    
    switch (velocityEffects.type) {
      case 'ripple':
        return (
          <div className="absolute inset-0 z-20 pointer-events-none overflow-hidden">
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
              <circle 
                cx="50" 
                cy="50" 
                r={10 + 40 * progress} 
                fill="none" 
                stroke={`rgba(239, 68, 68, ${0.7 * (1 - progress)})`} 
                strokeWidth={2 * intensity} 
              />
            </svg>
          </div>
        );
      case 'glow':
        return (
          <div 
            className="absolute inset-0 z-20 pointer-events-none rounded-xl"
            style={{
              boxShadow: `0 0 ${15 * intensity * (1 - progress)}px rgba(239, 68, 68, ${0.8 * (1 - progress)})`,
              transition: 'box-shadow 0.1s ease-out'
            }}
          />
        );
      case 'pulse':
        return (
          <div 
            className="absolute inset-0 z-20 pointer-events-none rounded-xl"
            style={{
              border: `2px solid rgba(239, 68, 68, ${0.8 * (1 - progress)})`,
              transform: `scale(${1 + 0.1 * intensity * (1 - Math.pow(progress - 0.5, 2) * 4)})`,
              transition: 'transform 0.1s ease-out, border 0.1s ease-out'
            }}
          />
        );
      default:
        return null;
    }
  };

  // Get dynamic hover animation properties based on velocity
  const getHoverAnimationProps = () => {
    const { velocityBoost } = animatedValuesRef.current;
    const isHighVelocity = velocityBoost > HIGH_VELOCITY_THRESHOLD;
    
    // Default animations
    const defaultAnimation = { 
      y: -2,
      transition: { duration: 0.2, ease: "easeOut" }
    };
    
    // Enhanced animations for high velocity
    if (isHighVelocity) {
      return {
        y: -4,
        scale: 1.03,
        transition: { 
          duration: 0.3,
          ease: [0.16, 1, 0.3, 1],
          y: { duration: 0.25, ease: easeOutElastic }
        }
      };
    }
    
    return defaultAnimation;
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
      whileHover={getHoverAnimationProps()}
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
      {renderVelocityEffects()}
      
      {/* Content area with refined typography */}
      <div className={`relative z-10 h-full flex flex-col justify-center items-center ${isMobile ? 'p-3' : 'p-6'}`}>
        <motion.h3 
          className={`${isMobile ? 'text-lg' : 'text-xl md:text-2xl'} font-medium text-white mb-2 md:mb-3 text-center leading-tight`}
          style={{
            background: 'linear-gradient(135deg, #ffffff 0%, #f0f0f0 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}
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
    </motion.div>
  );
});

CategoryItem.displayName = 'CategoryItem';
export default CategoryItem;