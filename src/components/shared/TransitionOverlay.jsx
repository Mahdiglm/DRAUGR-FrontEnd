import React, { useEffect, useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * TransitionOverlay - Complete redesign with finite state machine approach
 * 
 * This component handles the cinematic transition animation between category selection
 * and shop page navigation. Uses a state machine approach for more robust animation control.
 */

// State machine states for transition animation
const TransitionState = {
  IDLE: 'idle',
  SELECTION_RESPONSE: 'selection_response', // Phase 1
  MORPHING_TRANSITION: 'morphing_transition', // Phase 2
  PAGE_TRANSITION: 'page_transition', // Phase 3
  COMPLETING: 'completing',
  COMPLETED: 'completed',
  ERROR: 'error'
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
  // Use a proper state machine for animation
  const [transitionState, setTransitionState] = useState(TransitionState.IDLE);
  const [progress, setProgress] = useState(0);
  
  // Refs for managing animation state
  const hasCompletedRef = useRef(false);
  const animationFrameRef = useRef(null);
  const timeoutRef = useRef(null);
  const startTimeRef = useRef(null);
  const isActivatedRef = useRef(false);
  
  // Store category in ref to prevent rerenders
  const categoryRef = useRef(selectedCategory);
  
  // When category changes, update the ref
  useEffect(() => {
    categoryRef.current = selectedCategory;
  }, [selectedCategory]);
  
  // Clean up function to ensure we release all resources
  const cleanupAnimation = useCallback(() => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);
  
  // Transition completion handler
  const completeTransition = useCallback(() => {
    if (hasCompletedRef.current) return;
    
    debugLog("Animation completing");
    setTransitionState(TransitionState.COMPLETING);
    hasCompletedRef.current = true;
    
    // Safety delay before triggering completion callback
    setTimeout(() => {
      debugLog("Executing completion callback");
      try {
        onTransitionComplete && onTransitionComplete();
        setTransitionState(TransitionState.COMPLETED);
      } catch (error) {
        console.error("Error in completion callback:", error);
        setTransitionState(TransitionState.ERROR);
      }
    }, 50);
  }, [onTransitionComplete]);
  
  // Set up a stall detector timeout
  const setStallDetector = useCallback((currentState) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    // Timeout duration based on state
    let timeout = 2000; // default timeout
    
    if (currentState === TransitionState.PAGE_TRANSITION) {
      timeout = 1500; // shorter timeout for final phase
    }
    
    timeoutRef.current = setTimeout(() => {
      debugLog(`⚠️ Animation stalled in state ${currentState} - forcing completion`);
      completeTransition();
    }, timeout);
  }, [completeTransition]);
  
  // Animation step function with error boundaries
  const animationStep = useCallback((timestamp) => {
    try {
      if (!isActivatedRef.current || hasCompletedRef.current) {
        return;
      }
      
      if (!startTimeRef.current) {
        startTimeRef.current = timestamp;
        setStallDetector(TransitionState.SELECTION_RESPONSE);
      }
      
      const totalDuration = 1600; // slightly longer total duration
      const elapsed = timestamp - startTimeRef.current;
      const rawProgress = Math.min(elapsed / totalDuration, 1);
      
      // Update progress state
      setProgress(rawProgress);
      
      // State machine transitions based on progress
      if (rawProgress < 0.2 && transitionState !== TransitionState.SELECTION_RESPONSE) {
        debugLog("Transitioning to SELECTION_RESPONSE state");
        setTransitionState(TransitionState.SELECTION_RESPONSE);
        setPhase(1);
        setStallDetector(TransitionState.SELECTION_RESPONSE);
      } else if (rawProgress >= 0.2 && rawProgress < 0.65 && transitionState !== TransitionState.MORPHING_TRANSITION) {
        debugLog("Transitioning to MORPHING_TRANSITION state");
        setTransitionState(TransitionState.MORPHING_TRANSITION);
        setPhase(2);
        setStallDetector(TransitionState.MORPHING_TRANSITION);
      } else if (rawProgress >= 0.65 && transitionState !== TransitionState.PAGE_TRANSITION && !hasCompletedRef.current) {
        debugLog("Transitioning to PAGE_TRANSITION state");
        setTransitionState(TransitionState.PAGE_TRANSITION);
        setPhase(3);
        setStallDetector(TransitionState.PAGE_TRANSITION);
      }
      
      // Check for completion
      if (rawProgress >= 0.95 && !hasCompletedRef.current) {
        debugLog("Animation reached completion threshold");
        completeTransition();
        return;
      }
      
      // Continue animation if not complete
      if (!hasCompletedRef.current) {
        animationFrameRef.current = requestAnimationFrame(animationStep);
      }
    } catch (error) {
      console.error("Error in animation step:", error);
      setTransitionState(TransitionState.ERROR);
      completeTransition();
    }
  }, [completeTransition, setPhase, setStallDetector, transitionState]);
  
  // Start/stop animation based on active state
  useEffect(() => {
    if (isActive && !isActivatedRef.current && selectedCategory) {
      // Start animation
      debugLog("Starting transition animation", { category: selectedCategory.slug, state: "initializing" });
      isActivatedRef.current = true;
      hasCompletedRef.current = false;
      startTimeRef.current = null;
      setProgress(0);
      setTransitionState(TransitionState.SELECTION_RESPONSE);
      setPhase(1);
      
      // Start the animation loop
      animationFrameRef.current = requestAnimationFrame(animationStep);
      
      // Set global safety timeout (longest possible duration)
      timeoutRef.current = setTimeout(() => {
        debugLog("⚠️ Global safety timeout triggered");
        completeTransition();
      }, 3500); // 3.5 seconds max
    } else if (!isActive && isActivatedRef.current) {
      // Reset state when deactivated
      debugLog("Deactivating transition animation");
      isActivatedRef.current = false;
      cleanupAnimation();
      setTransitionState(TransitionState.IDLE);
      setProgress(0);
    }
    
    return cleanupAnimation;
  }, [isActive, selectedCategory, animationStep, cleanupAnimation, completeTransition, setPhase]);
  
  // If there's no active transition or no category, don't render anything
  if (!isActive || !selectedCategory || transitionState === TransitionState.IDLE) {
    return null;
  }

  return (
    <AnimatePresence mode="wait">
      {isActive && (
        <motion.div 
          className="fixed inset-0 z-50 overflow-hidden transition-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Animated background that gets darker with progress */}
          <motion.div 
            className="absolute inset-0 bg-black transition-bg"
            initial={{ opacity: 0 }}
            animate={{ 
              opacity: transitionState === TransitionState.PAGE_TRANSITION ? 
                0.85 : progress * 0.75
            }}
          />
          
          {/* Animated fog/mist effect for horror theme */}
          <div className="absolute inset-0 pointer-events-none mist-container">
            {Array.from({ length: 3 }).map((_, i) => (
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
          
          {/* Particle effect - blood motes floating in the air */}
          <div className="absolute inset-0 pointer-events-none">
            {Array.from({ length: 25 }).map((_, i) => (
              <motion.div
                key={`particle-${i}`}
                className="absolute rounded-full bg-draugr-500"
                initial={{
                  opacity: 0,
                  x: selectedCardRect ? (selectedCardRect.left + selectedCardRect.width / 2) : '50%',
                  y: selectedCardRect ? (selectedCardRect.top + selectedCardRect.height / 2) : '50%',
                  scale: 0
                }}
                animate={{
                  opacity: [0, 0.7 + Math.random() * 0.3, 0],
                  x: `calc(${selectedCardRect ? (selectedCardRect.left + selectedCardRect.width / 2) : '50%'}px + ${(Math.random() - 0.5) * 320}px)`,
                  y: `calc(${selectedCardRect ? (selectedCardRect.top + selectedCardRect.height / 2) : '50%'}px + ${(Math.random() - 0.5) * 320 - 50}px)`,
                  scale: [0, Math.random() * 0.5 + 0.3]
                }}
                transition={{
                  duration: 3 + Math.random() * 2,
                  delay: Math.random() * 0.5,
                  ease: "easeOut",
                  repeat: Infinity,
                  repeatType: "loop",
                  repeatDelay: Math.random() * 3
                }}
                style={{
                  width: `${Math.random() * 6 + 3}px`,
                  height: `${Math.random() * 6 + 3}px`,
                  filter: `blur(${Math.random() * 2}px) drop-shadow(0 0 2px #ff0000)`
                }}
              />
            ))}
          </div>
          
          {/* Morphing card that transitions from selected category to hero section */}
          {selectedCardRect && (
            <motion.div
              className="absolute rounded-lg overflow-hidden flex flex-col morphing-container"
              initial={{
                top: selectedCardRect.top,
                left: selectedCardRect.left,
                width: selectedCardRect.width,
                height: selectedCardRect.height,
                borderRadius: '0.5rem',
                boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)'
              }}
              animate={{
                top: transitionState === TransitionState.SELECTION_RESPONSE ? 
                  selectedCardRect.top : '0px',
                left: transitionState === TransitionState.PAGE_TRANSITION ? 
                  '0px' : transitionState === TransitionState.MORPHING_TRANSITION ?
                  window.innerWidth / 2 - selectedCardRect.width * 1.5 : 
                  selectedCardRect.left,
                width: transitionState === TransitionState.PAGE_TRANSITION ? 
                  '100%' : transitionState === TransitionState.MORPHING_TRANSITION ? 
                  selectedCardRect.width * 3 : selectedCardRect.width,
                height: transitionState === TransitionState.PAGE_TRANSITION ? 
                  '100%' : transitionState === TransitionState.MORPHING_TRANSITION ?
                  selectedCardRect.height * 1.5 : selectedCardRect.height,
                borderRadius: transitionState === TransitionState.PAGE_TRANSITION ? 
                  '0rem' : '0.5rem',
                boxShadow: transitionState === TransitionState.SELECTION_RESPONSE ? 
                  '0 10px 40px rgba(139, 0, 0, 0.6), 0 0 20px rgba(255, 0, 0, 0.4)' : 
                  '0 0 0 rgba(0, 0, 0, 0)',
              }}
              transition={{
                duration: 0.8,
                ease: [0.16, 1, 0.3, 1], // Custom cubic-bezier for elastic feel
                times: [0, 1]
              }}
            >
              {/* Card background with gradient animation */}
              <motion.div
                className="absolute inset-0 z-0"
                initial={{ opacity: 1 }}
                animate={{ opacity: 1 }}
                style={{
                  background: `linear-gradient(to bottom, ${selectedCategory?.themeColor || '#420011'}, #000000)`
                }}
              >
                {/* Animated blood/smoke texture overlay */}
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

              {/* Category content area */}
              <div className="relative z-10 flex flex-col justify-center items-center flex-1 p-6">
                <motion.div 
                  className="relative z-10 w-full max-w-4xl mx-auto text-center"
                  initial={{ opacity: 1, y: 0 }}
                  animate={{ 
                    opacity: 1, 
                    y: transitionState === TransitionState.PAGE_TRANSITION ? -40 : 0
                  }}
                  transition={{ duration: 0.5 }}
                >
                  {/* Category title with animated size */}
                  <motion.h1
                    className="font-bold text-white relative z-10 inline-block"
                    initial={{ fontSize: '1.25rem' }}
                    animate={{
                      fontSize: transitionState === TransitionState.SELECTION_RESPONSE ? 
                        '1.25rem' : transitionState === TransitionState.MORPHING_TRANSITION ? 
                        '2.5rem' : '3.5rem'
                    }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                  >
                    {selectedCategory?.name}
                    
                    {/* Animated title glow */}
                    <motion.div
                      className="absolute inset-0 -z-10 blur-md"
                      style={{ 
                        background: selectedCategory?.themeColor || '#420011',
                        opacity: 0 
                      }}
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
                  
                  {/* Subtitle description */}
                  {transitionState !== TransitionState.SELECTION_RESPONSE && (
                    <motion.div
                      className="mt-4 text-gray-200 text-center"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: 0.2 }}
                    >
                      <p className="mb-4">مجموعه منحصر به فرد محصولات {selectedCategory?.name} ما را کشف کنید</p>
                      
                      {/* Loading state in final phase */}
                      {transitionState === TransitionState.PAGE_TRANSITION && (
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.4, delay: 0.2 }}
                        >
                          <div className="flex justify-center">
                            <div className="relative w-64 h-1 bg-gray-700 rounded-full overflow-hidden">
                              <motion.div
                                className="absolute top-0 left-0 h-full"
                                style={{ 
                                  background: `linear-gradient(to right, ${selectedCategory?.themeColor || '#420011'}, #990000)`
                                }}
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
              
              {/* Page content elements that fade in during final phase */}
              {transitionState === TransitionState.PAGE_TRANSITION && (
                <div className="absolute inset-0 flex flex-col items-stretch">
                  {/* Dark header bar */}
                  <motion.div
                    className="w-full bg-black/80 backdrop-blur-md border-b border-[#2f0000]/30 h-16"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 0.9, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                  />
                  
                  <div className="flex flex-1 overflow-hidden">
                    {/* Left sidebar */}
                    <motion.div
                      className="w-64 bg-black/40 backdrop-blur-md border-r border-[#2f0000]/20"
                      initial={{ opacity: 0, x: -100 }}
                      animate={{ opacity: 0.9, x: 0 }}
                      transition={{ duration: 0.5, delay: 0.3 }}
                    />
                    
                    {/* Main content area with product grid */}
                    <motion.div
                      className="flex-1 bg-black/20 p-6"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.5, delay: 0.4 }}
                    >
                      <div className="grid grid-cols-4 gap-4">
                        {Array.from({ length: 8 }).map((_, i) => (
                          <motion.div
                            key={i}
                            className="rounded-md bg-black/30 backdrop-blur-sm border border-[#2f0000]/20 h-64"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.4 + (i * 0.05) }}
                          />
                        ))}
                      </div>
                    </motion.div>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </motion.div>
      )}
      
      {/* CSS for global transition effects */}
      <style jsx="true">{`
        .transition-overlay {
          perspective: 1000px;
          transform-style: preserve-3d;
        }
        
        @keyframes mistAnimation {
          0% { opacity: 0; transform: translateY(0) scale(1); }
          50% { opacity: 0.3; transform: translateY(-20px) scale(1.1); }
          100% { opacity: 0; transform: translateY(-40px) scale(1); }
        }
        
        .mist-container {
          z-index: 10;
          overflow: hidden;
        }
        
        .morphing-container {
          box-shadow: 0 0 30px rgba(255, 0, 0, 0.15);
        }
      `}</style>
    </AnimatePresence>
  );
};

export default TransitionOverlay; 