import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * TransitionOverlay - Complete redesign with finite state machine approach
 * 
 * This component handles the cinematic transition animation between category selection
 * and shop page navigation. Uses a state machine approach for more robust animation control.
 */

// Define animation phase durations
const PHASE_DURATIONS = {
  SELECTION_RESPONSE: 300,   // 0-300ms
  MORPHING_TRANSITION: 500,  // 300-800ms
  PAGE_TRANSITION: 400,      // 800-1200ms
  OUTRO: 600,               // Added outro phase duration
};

// Horror theme color palette
const HORROR_THEME = {
  PRIMARY: '#800000',       // Deep blood red
  SECONDARY: '#3a0000',     // Dark crimson
  ACCENT: '#ff0000',        // Bright red for highlights/effects
  SHADOW: '#200000',        // Dark shadow color
  GLOW: 'rgba(255, 0, 0, 0.6)', // Red glow
  TEXT_MAIN: '#ffffff',     // White text
  TEXT_SECONDARY: '#aaaaaa' // Gray text
};

// Debug helper function
const debugLog = (message, obj = {}) => {
  if (process.env.NODE_ENV === 'development') {
    console.log(`[TransitionOverlay] ${message}`, obj);
  }
};

const TransitionOverlay = ({ 
  isActive, 
  selectedCategory, 
  selectedCardRect,
  onTransitionComplete,
  phase,
  setPhase
}) => {
  // Current animation phase (1, 2, 3, 4=outro)
  const [currentPhase, setCurrentPhase] = useState(0);
  
  // Animation progress within current phase (0-1)
  const [phaseProgress, setPhaseProgress] = useState(0);
  
  // Is the outro phase playing
  const [isOutroActive, setIsOutroActive] = useState(false);
  
  // Animation control refs
  const animationRef = useRef(null);
  const timeoutRef = useRef(null);
  const phaseStartTimeRef = useRef(null);
  const totalStartTimeRef = useRef(null);
  const outroTimeoutRef = useRef(null);
  
  // State tracking refs
  const activeAnimationIdRef = useRef(null);
  const categoryRef = useRef(null);
  const hasCompletedRef = useRef(false);
  const notifiedCompletionRef = useRef(false);
  const pageChangedRef = useRef(false);
  
  // Safety timeout duration (ms)
  const SAFETY_TIMEOUT = 3000;

  /**
   * Clean up all animation timers and frames
   */
  const cleanupAnimationResources = () => {
    debugLog("Cleaning up animation resources");
    
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }
    
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    
    if (outroTimeoutRef.current) {
      clearTimeout(outroTimeoutRef.current);
      outroTimeoutRef.current = null;
    }
    
    phaseStartTimeRef.current = null;
  };

  /**
   * Complete the transition and notify parent component
   */
  const completeTransition = () => {
    if (hasCompletedRef.current) return;
    
    debugLog("Animation completed, triggering page change and starting outro");
    hasCompletedRef.current = true;
    
    // First notify parent to change the page BEFORE starting the outro
    // This ensures the shop page is visible behind the outro animation
    if (!pageChangedRef.current && typeof onTransitionComplete === 'function') {
      pageChangedRef.current = true;
      onTransitionComplete();
    }
    
    // AFTER page change, start the outro animation as an overlay effect
    setIsOutroActive(true);
    setCurrentPhase(4); // Phase 4 = outro
    
    // Set up outro timeout to clean up when animation is truly done
    if (outroTimeoutRef.current) {
      clearTimeout(outroTimeoutRef.current);
    }
    
    outroTimeoutRef.current = setTimeout(() => {
      debugLog("Outro animation completed, cleaning up");
      cleanupAnimationResources();
    }, PHASE_DURATIONS.OUTRO);
  };

  /**
   * Set up a safety timeout that forces completion if animation stalls
   */
  const setupSafetyTimeout = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    timeoutRef.current = setTimeout(() => {
      debugLog("⚠️ Safety timeout triggered - forcing animation completion");
      completeTransition();
    }, SAFETY_TIMEOUT);
  };

  /**
   * Animation loop that drives the multi-phase transition
   */
  const animationStep = (timestamp) => {
    // If animation is no longer active, stop the loop
    if (!isActive || hasCompletedRef.current || !categoryRef.current) {
      return;
    }
    
    // Initialize start time on first frame
    if (!totalStartTimeRef.current) {
      totalStartTimeRef.current = timestamp;
      phaseStartTimeRef.current = timestamp;
    }
    
    // Calculate elapsed time
    const totalElapsed = timestamp - totalStartTimeRef.current;
    const phaseElapsed = timestamp - phaseStartTimeRef.current;
    
    // Determine which phase we should be in based on total elapsed time
    let newPhase = 1;
    let phaseTime = 0;
    
    if (totalElapsed < PHASE_DURATIONS.SELECTION_RESPONSE) {
      // Phase 1
      newPhase = 1;
      phaseTime = totalElapsed / PHASE_DURATIONS.SELECTION_RESPONSE;
    } else if (totalElapsed < PHASE_DURATIONS.SELECTION_RESPONSE + PHASE_DURATIONS.MORPHING_TRANSITION) {
      // Phase 2
      newPhase = 2;
      phaseTime = (totalElapsed - PHASE_DURATIONS.SELECTION_RESPONSE) / PHASE_DURATIONS.MORPHING_TRANSITION;
    } else if (totalElapsed < PHASE_DURATIONS.SELECTION_RESPONSE + PHASE_DURATIONS.MORPHING_TRANSITION + PHASE_DURATIONS.PAGE_TRANSITION) {
      // Phase 3
      newPhase = 3;
      phaseTime = (totalElapsed - PHASE_DURATIONS.SELECTION_RESPONSE - PHASE_DURATIONS.MORPHING_TRANSITION) / PHASE_DURATIONS.PAGE_TRANSITION;
    } else {
      // Animation complete
      newPhase = 3;
      phaseTime = 1;
      completeTransition();
      return;
    }
    
    // Update phase if needed
    if (newPhase !== currentPhase) {
      debugLog(`Transitioning to Phase ${newPhase}`);
      setCurrentPhase(newPhase);
      
      // Also update parent component's phase state if available
      if (typeof setPhase === 'function') {
        setPhase(newPhase);
      }
      
      // Reset phase timer
      phaseStartTimeRef.current = timestamp;
    }
    
    // Update progress within current phase
    setPhaseProgress(Math.min(phaseTime, 1));
    
    // Continue animation loop
    animationRef.current = requestAnimationFrame(animationStep);
  };

  /**
   * Start a new animation sequence
   */
  const startAnimation = () => {
    if (!selectedCategory || !isActive) return;
    
    debugLog("Starting new animation", { categoryId: selectedCategory.id });
    
    // Generate unique animation ID
    const animationId = `${selectedCategory.id}-${Date.now()}`;
    activeAnimationIdRef.current = animationId;
    
    // Reset state
    hasCompletedRef.current = false;
    notifiedCompletionRef.current = false;
    pageChangedRef.current = false;
    totalStartTimeRef.current = null;
    phaseStartTimeRef.current = null;
    categoryRef.current = selectedCategory;
    setIsOutroActive(false);
    
    // Initialize to phase 1
    setCurrentPhase(1);
    setPhaseProgress(0);
    
    // Set parent component phase if available
    if (typeof setPhase === 'function') {
      setPhase(1);
    }
    
    // Clean up any existing animation
    cleanupAnimationResources();
    
    // Start new animation loop
    animationRef.current = requestAnimationFrame(animationStep);
    
    // Set up safety timeout
    setupSafetyTimeout();
  };

  // Handle activation/deactivation and category changes
  useEffect(() => {
    const newCategorySelected = selectedCategory && 
      (!categoryRef.current || categoryRef.current.id !== selectedCategory.id);
    
    // Start animation when activated or category changes
    if (isActive && selectedCategory && (newCategorySelected || !activeAnimationIdRef.current)) {
      startAnimation();
    } 
    // Handle deactivation
    else if (!isActive && activeAnimationIdRef.current) {
      debugLog("Deactivating animation");
      cleanupAnimationResources();
      activeAnimationIdRef.current = null;
      categoryRef.current = null;
      hasCompletedRef.current = true;
      notifiedCompletionRef.current = true;
      pageChangedRef.current = false;
      setCurrentPhase(0);
      setPhaseProgress(0);
      setIsOutroActive(false);
    }
    
    // Cleanup on unmount or when dependencies change
    return () => {
      cleanupAnimationResources();
    };
  }, [isActive, selectedCategory]);

  // Don't render anything if not active
  if (!isActive || !categoryRef.current || !selectedCardRect) {
    return null;
  }

  // Generate unique ID for animation elements
  const transitionId = categoryRef.current?.slug || 'transition';

  return (
    <AnimatePresence mode="wait">
      <motion.div 
        key={`overlay-${transitionId}`}
        className="fixed inset-0 z-[9999] overflow-hidden transition-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ 
          opacity: 0, 
          filter: "contrast(1.2) brightness(5)",
          transition: { 
            duration: 0.6, 
            ease: [0.16, 1, 0.3, 1] 
          } 
        }}
      >
        {/* Full-screen background overlay */}
        <motion.div 
          className="absolute inset-0 bg-black transition-bg"
          initial={{ opacity: 0 }}
          animate={{ 
            opacity: isOutroActive ? 0.8 : 
                    currentPhase === 1 ? 0.5 : 
                    currentPhase === 2 ? 0.7 : 0.85
          }}
          transition={{ duration: 0.4 }}
        />
        
        {/* Atmospheric mist effects */}
        <div className="absolute inset-0 pointer-events-none">
          {[0, 1, 2].map(i => (
            <motion.div
              key={`mist-${i}`}
              className="absolute inset-0"
              style={{
                backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'100%25\' height=\'100%25\'%3E%3Cdefs%3E%3CradialGradient id=\'a\' cx=\'50%25\' cy=\'50%25\' r=\'50%25\' gradientUnits=\'userSpaceOnUse\'%3E%3Cstop offset=\'0\' stop-color=\'%23330000\' stop-opacity=\'.3\'/%3E%3Cstop offset=\'1\' stop-color=\'%23330000\' stop-opacity=\'0\'/%3E%3C/radialGradient%3E%3C/defs%3E%3Crect width=\'100%25\' height=\'100%25\' fill=\'url(%23a)\'/%3E%3C/svg%3E")',
                backgroundSize: 'cover',
                opacity: 0
              }}
              animate={{ 
                opacity: [0, 0.4, 0],
                scale: [1, 1.2, 1],
                rotate: [(i - 1) * 10, (i - 1) * 10 + 5]
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                repeatType: 'reverse',
                delay: i * 2,
                ease: 'easeInOut'
              }}
            />
          ))}
        </div>
        
        {/* Particle effects */}
        <div className="absolute inset-0 pointer-events-none">
          {Array.from({ length: isOutroActive ? 40 : 20 }).map((_, i) => {
            const startX = isOutroActive ? window.innerWidth / 2 : selectedCardRect.left + selectedCardRect.width / 2;
            const startY = isOutroActive ? window.innerHeight / 2 : selectedCardRect.top + selectedCardRect.height / 2;
            const randomAngle = Math.random() * Math.PI * 2;
            const randomDistance = isOutroActive ? Math.random() * 800 + 100 : Math.random() * 300 + 50;
            const randomSize = Math.random() * 6 + (isOutroActive ? 4 : 2);
            
            return (
              <motion.div
                key={`particle-${i}${isOutroActive ? '-outro' : ''}`}
                className="absolute rounded-full"
                style={{
                  width: `${randomSize}px`,
                  height: `${randomSize}px`,
                  background: i % 2 === 0 ? HORROR_THEME.ACCENT : HORROR_THEME.PRIMARY,
                  filter: `blur(${Math.random() * 2}px) drop-shadow(0 0 3px ${HORROR_THEME.GLOW})`
                }}
                initial={{
                  opacity: 0,
                  x: startX,
                  y: startY,
                  scale: 0
                }}
                animate={isOutroActive ? {
                  opacity: [0, 0.9, 0],
                  x: startX + Math.cos(randomAngle) * randomDistance,
                  y: startY + Math.sin(randomAngle) * randomDistance,
                  scale: [0, Math.random() * 1.2 + 0.3, 0]
                } : {
                  opacity: [0, 0.7, 0],
                  x: startX + Math.cos(randomAngle) * randomDistance,
                  y: startY + Math.sin(randomAngle) * randomDistance,
                  scale: [0, Math.random() * 0.8 + 0.2, 0]
                }}
                transition={{
                  duration: isOutroActive ? 1.5 + Math.random() * 1 : 2 + Math.random() * 2,
                  ease: isOutroActive ? "easeOut" : "easeOut",
                  delay: isOutroActive ? Math.random() * 0.3 : Math.random() * 0.5
                }}
              />
            );
          })}
        </div>

        {/* Blood splatter effects */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20" style={{ mixBlendMode: 'multiply' }}>
          <defs>
            <filter id="turbulence" x="0" y="0" width="100%" height="100%">
              <feTurbulence type="fractalNoise" baseFrequency="0.01" numOctaves="3" seed="3" />
              <feDisplacementMap in="SourceGraphic" scale="30" />
            </filter>
          </defs>
          <motion.rect 
            width="100%" 
            height="100%" 
            fill={HORROR_THEME.PRIMARY} 
            filter="url(#turbulence)"
            initial={{ opacity: 0 }}
            animate={{ opacity: isOutroActive ? [0.3, 0.6, 0] : [0.1, 0.2, 0.1] }}
            transition={{ duration: isOutroActive ? 1 : 8, repeat: isOutroActive ? 0 : Infinity, repeatType: 'mirror' }}
          />
        </svg>

        {/* Outro flash effect */}
        {isOutroActive && (
          <motion.div 
            className="absolute inset-0 bg-white/60 mix-blend-overlay" 
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0] }}
            transition={{ duration: 0.6, times: [0, 0.1, 1], ease: "easeOut" }}
          />
        )}

        {/* Only render morphing card animation if not in outro phase or if in early stages of outro */}
        {(!isOutroActive || (isOutroActive && outroTimeoutRef.current)) && (
          <motion.div
            className="absolute rounded-lg overflow-hidden flex flex-col"
            style={{
              boxShadow: currentPhase === 1 ? 
                `0 10px 40px ${HORROR_THEME.SHADOW}, 0 0 20px ${HORROR_THEME.GLOW}` : 
                '0 0 0 rgba(0, 0, 0, 0)'
            }}
            initial={{
              top: selectedCardRect.top,
              left: selectedCardRect.left,
              width: selectedCardRect.width,
              height: selectedCardRect.height,
              borderRadius: '0.5rem'
            }}
            animate={isOutroActive ? {
              opacity: 0,
              scale: 1.1,
              filter: "blur(8px) brightness(1.5)",
              transition: { duration: 0.5, ease: "easeIn" }
            } : {
              // Phase 1: Scale up the selected card
              top: currentPhase === 1 ? 
                selectedCardRect.top - (selectedCardRect.height * 0.5 * phaseProgress) : 
                currentPhase === 2 ? 
                window.innerHeight * 0.1 : 
                0,
              
              left: currentPhase === 1 ? 
                selectedCardRect.left - (selectedCardRect.width * 0.5 * phaseProgress) : 
                currentPhase === 2 ? 
                window.innerWidth * 0.5 - (selectedCardRect.width * 1.5) : 
                0,
              
              width: currentPhase === 1 ? 
                selectedCardRect.width * (1 + phaseProgress) : 
                currentPhase === 2 ? 
                selectedCardRect.width * 3 : 
                '100%',
              
              height: currentPhase === 1 ? 
                selectedCardRect.height * (1 + phaseProgress) : 
                currentPhase === 2 ? 
                selectedCardRect.height * 1.5 : 
                '100%',
              
              borderRadius: currentPhase === 3 ? '0rem' : '0.5rem',
              opacity: 1,
              scale: 1,
              filter: "blur(0px) brightness(1)"
            }}
            transition={{
              duration: 0.4,
              ease: [0.16, 1, 0.3, 1]
            }}
          >
            {/* Card background */}
            <motion.div
              className="absolute inset-0 z-0"
              style={{
                background: `linear-gradient(to bottom, ${HORROR_THEME.PRIMARY}, #000000)`
              }}
            >
              <motion.div
                className="absolute inset-0 pointer-events-none"
                style={{
                  backgroundImage: "url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIiB4PSIwIiB5PSIwIj48ZmVUdXJidWxlbmNlIGJhc2VGcmVxdWVuY3k9Ii4wMSIgc3RpdGNoVGlsZXM9InN0aXRjaCIgdHlwZT0iZnJhY3RhbE5vaXNlIiBudW1PY3RhdmVzPSI0IiBzZWVkPSI1MDIiLz48ZmVDb2xvck1hdHJpeCB0eXBlPSJzYXR1cmF0ZSIgdmFsdWVzPSIwIi8+PC9maWx0ZXI+PHBhdGggZD0iTTAgMGgzMDB2MzAwSDB6IiBmaWx0ZXI9InVybCgjYSkiIG9wYWNpdHk9Ii4wOCIvPjwvc3ZnPg==')",
                  backgroundSize: 'cover',
                  mixBlendMode: 'soft-light',
                  opacity: 0.2
                }}
                animate={{
                  opacity: [0.2, 0.25, 0.2],
                  scale: [1, 1.05, 1],
                }}
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  repeatType: 'mirror',
                  ease: 'easeInOut'
                }}
              />
              
              {/* Vignette effect */}
              <div 
                className="absolute inset-0" 
                style={{
                  background: 'radial-gradient(circle, transparent 30%, rgba(0, 0, 0, 0.8) 100%)',
                  mixBlendMode: 'multiply'
                }}
              />
            </motion.div>

            {/* Card content container */}
            <div className="relative z-10 flex flex-col justify-center items-center flex-1 p-6">
              <motion.div 
                className="relative z-10 w-full max-w-4xl mx-auto text-center"
                animate={{ 
                  y: currentPhase === 3 ? -40 : 0
                }}
                transition={{ duration: 0.5 }}
              >
                {/* Category title with animation */}
                <motion.h1
                  className="font-bold text-white relative z-10 inline-block"
                  initial={{ fontSize: '1.25rem' }}
                  animate={{
                    fontSize: currentPhase === 1 ? 
                      `${1.25 + (1.25 * phaseProgress)}rem` : 
                      currentPhase === 2 ? 
                      `${2.5 + phaseProgress}rem` : 
                      '3.5rem'
                  }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                >
                  {categoryRef.current.name}
                  
                  {/* Title glow effect */}
                  <motion.div
                    className="absolute inset-0 -z-10 blur-md"
                    style={{ background: HORROR_THEME.ACCENT }}
                    animate={{ 
                      opacity: [0, 0.6, 0],
                      scale: [1, 1.1, 1]
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  />
                </motion.h1>
                
                {/* Category description - appears in Phase 2 */}
                {currentPhase >= 2 && (
                  <motion.div
                    className="mt-4 text-gray-200 text-center"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.1 }}
                  >
                    <p className="mb-4">مجموعه منحصر به فرد محصولات {categoryRef.current.name} ما را کشف کنید</p>
                    
                    {/* Loading indicator - appears in Phase 3 */}
                    {currentPhase === 3 && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4 }}
                      >
                        <div className="flex justify-center">
                          <div className="relative w-64 h-1 bg-gray-800 rounded-full overflow-hidden">
                            <motion.div
                              className="absolute top-0 left-0 h-full"
                              style={{ background: `linear-gradient(to right, ${HORROR_THEME.SECONDARY}, ${HORROR_THEME.ACCENT})` }}
                              initial={{ width: '0%' }}
                              animate={{ width: '100%' }}
                              transition={{ duration: 0.6, ease: "easeInOut" }}
                            />
                          </div>
                        </div>
                        <p className="mt-2 text-gray-400 text-sm">درحال بارگذاری محصولات...</p>
                      </motion.div>
                    )}
                  </motion.div>
                )}
              </motion.div>
            </div>
            
            {/* Phase 3 UI elements */}
            {currentPhase === 3 && !isOutroActive && (
              <div className="absolute inset-0 flex flex-col items-stretch">
                {/* Header */}
                <motion.div
                  className="w-full backdrop-blur-md border-b h-16"
                  style={{ 
                    backgroundColor: 'rgba(10, 0, 0, 0.8)',
                    borderColor: HORROR_THEME.SECONDARY
                  }}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 0.9, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                />
                
                {/* Main content area */}
                <div className="flex flex-1 overflow-hidden">
                  {/* Sidebar */}
                  <motion.div
                    className="w-64 backdrop-blur-md border-r"
                    style={{ 
                      backgroundColor: 'rgba(10, 0, 0, 0.6)',
                      borderColor: HORROR_THEME.SECONDARY
                    }}
                    initial={{ opacity: 0, x: -100 }}
                    animate={{ opacity: 0.9, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                  />
                  
                  {/* Product grid */}
                  <motion.div
                    className="flex-1 bg-black/20 p-6"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                  >
                    <div className="grid grid-cols-4 gap-4">
                      {/* Product items */}
                      {Array.from({ length: 8 }).map((_, i) => (
                        <motion.div
                          key={`product-${i}`}
                          className="rounded-md backdrop-blur-sm h-64"
                          style={{ 
                            backgroundColor: 'rgba(15, 0, 0, 0.6)',
                            borderWidth: '1px',
                            borderStyle: 'solid',
                            borderColor: HORROR_THEME.SECONDARY,
                            boxShadow: `0 4px 12px ${HORROR_THEME.SHADOW}`
                          }}
                          initial={{ opacity: 0, y: 30 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.4, delay: 0.3 + (i * 0.05) }}
                        />
                      ))}
                    </div>
                  </motion.div>
                </div>
              </div>
            )}
          </motion.div>
        )}

        {/* Outro reveal effect */}
        {isOutroActive && (
          <>
            <motion.div 
              className="absolute inset-0"
              style={{ 
                background: `radial-gradient(circle at center, transparent 0%, #000 100%)`,
              }}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: [0, 1.8] }}
              transition={{ duration: 0.6, ease: "easeInOut" }}
            />
            
            {/* Horizontal slash reveals */}
            <motion.div 
              className="absolute left-0 right-0 bg-white" 
              style={{ height: '2px', top: '30%' }}
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{ 
                scaleX: [0, 1, 1],
                opacity: [0, 0.8, 0]
              }}
              transition={{ 
                duration: 0.6,
                times: [0, 0.3, 1], 
                ease: "easeInOut" 
              }}
            />
            
            <motion.div 
              className="absolute left-0 right-0 bg-white" 
              style={{ height: '2px', top: '70%' }}
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{ 
                scaleX: [0, 1, 1],
                opacity: [0, 0.8, 0]
              }}
              transition={{ 
                duration: 0.6,
                delay: 0.1,
                times: [0, 0.3, 1], 
                ease: "easeInOut" 
              }}
            />
            
            {/* Final flash out */}
            <motion.div 
              className="absolute inset-0 bg-white mix-blend-overlay" 
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0.8, 0] }}
              transition={{ 
                duration: 0.35, 
                delay: 0.3,
                times: [0, 0.2, 1], 
                ease: "easeOut" 
              }}
            />
          </>
        )}
      </motion.div>

      <style jsx="true">{`
        .transition-overlay {
          perspective: 1000px;
          transform-style: preserve-3d;
        }
      `}</style>
    </AnimatePresence>
  );
};

export default TransitionOverlay; 