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
  // Current animation phase (1, 2, 3)
  const [currentPhase, setCurrentPhase] = useState(0);
  
  // Animation progress within current phase (0-1)
  const [phaseProgress, setPhaseProgress] = useState(0);
  
  // Animation control refs
  const animationRef = useRef(null);
  const timeoutRef = useRef(null);
  const phaseStartTimeRef = useRef(null);
  const totalStartTimeRef = useRef(null);
  
  // State tracking refs
  const activeAnimationIdRef = useRef(null);
  const categoryRef = useRef(null);
  const hasCompletedRef = useRef(false);
  
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
    
    phaseStartTimeRef.current = null;
  };

  /**
   * Complete the transition and notify parent component
   */
  const completeTransition = () => {
    if (hasCompletedRef.current) return;
    
    debugLog("Animation completed");
    hasCompletedRef.current = true;
    cleanupAnimationResources();
    
    // Small delay before calling onTransitionComplete
    setTimeout(() => {
      if (typeof onTransitionComplete === 'function') {
        onTransitionComplete();
      }
    }, 50);
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
    totalStartTimeRef.current = null;
    phaseStartTimeRef.current = null;
    categoryRef.current = selectedCategory;
    
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
      setCurrentPhase(0);
      setPhaseProgress(0);
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
  const themeColor = categoryRef.current?.themeColor || '#420011';

  return (
    <AnimatePresence>
      <motion.div 
        key={`overlay-${transitionId}`}
        className="fixed inset-0 z-50 overflow-hidden transition-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        {/* Full-screen background overlay */}
        <motion.div 
          className="absolute inset-0 bg-black transition-bg"
          initial={{ opacity: 0 }}
          animate={{ 
            opacity: currentPhase === 1 ? 0.4 : 
                    currentPhase === 2 ? 0.65 : 0.85
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
          {Array.from({ length: 20 }).map((_, i) => {
            const startX = selectedCardRect.left + selectedCardRect.width / 2;
            const startY = selectedCardRect.top + selectedCardRect.height / 2;
            const randomAngle = Math.random() * Math.PI * 2;
            const randomDistance = Math.random() * 300 + 50;
            const randomSize = Math.random() * 6 + 2;
            
            return (
              <motion.div
                key={`particle-${i}`}
                className="absolute rounded-full bg-draugr-500"
                style={{
                  width: `${randomSize}px`,
                  height: `${randomSize}px`,
                  filter: `blur(${Math.random() * 2}px) drop-shadow(0 0 2px #ff0000)`
                }}
                initial={{
                  opacity: 0,
                  x: startX,
                  y: startY,
                  scale: 0
                }}
                animate={{
                  opacity: [0, 0.7, 0],
                  x: startX + Math.cos(randomAngle) * randomDistance,
                  y: startY + Math.sin(randomAngle) * randomDistance,
                  scale: [0, Math.random() * 0.8 + 0.2, 0]
                }}
                transition={{
                  duration: 2 + Math.random() * 2,
                  ease: "easeOut",
                  delay: Math.random() * 0.5
                }}
              />
            );
          })}
        </div>

        {/* Morphing card animation */}
        <motion.div
          className="absolute rounded-lg overflow-hidden flex flex-col"
          style={{
            boxShadow: currentPhase === 1 ? 
              '0 10px 40px rgba(139, 0, 0, 0.6), 0 0 20px rgba(255, 0, 0, 0.4)' : 
              '0 0 0 rgba(0, 0, 0, 0)'
          }}
          initial={{
            top: selectedCardRect.top,
            left: selectedCardRect.left,
            width: selectedCardRect.width,
            height: selectedCardRect.height,
            borderRadius: '0.5rem'
          }}
          animate={{
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
              background: `linear-gradient(to bottom, ${themeColor}, #000000)`
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
                  style={{ background: themeColor }}
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
                        <div className="relative w-64 h-1 bg-gray-700 rounded-full overflow-hidden">
                          <motion.div
                            className="absolute top-0 left-0 h-full"
                            style={{ background: `linear-gradient(to right, ${themeColor}, #990000)` }}
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
          {currentPhase === 3 && (
            <div className="absolute inset-0 flex flex-col items-stretch">
              {/* Header */}
              <motion.div
                className="w-full bg-black/80 backdrop-blur-md border-b border-[#2f0000]/30 h-16"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 0.9, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              />
              
              {/* Main content area */}
              <div className="flex flex-1 overflow-hidden">
                {/* Sidebar */}
                <motion.div
                  className="w-64 bg-black/40 backdrop-blur-md border-r border-[#2f0000]/20"
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
                        className="rounded-md bg-black/30 backdrop-blur-sm border border-[#2f0000]/20 h-64"
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