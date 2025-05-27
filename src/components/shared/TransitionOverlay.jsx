import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Debug helper function
const debugLog = (message, obj = {}) => {
  if (process.env.NODE_ENV === 'development') {
    console.log(`[TransitionOverlay] ${message}`, obj);
  }
};

// Enhanced easing functions for more premium animations
const elasticOut = [0.16, 1.14, 0.3, 1]; // Springy, bouncy effect
const smoothInOut = [0.65, 0, 0.35, 1]; // Smooth acceleration and deceleration
const sharpIn = [0.75, 0, 0.85, 0]; // Quick start, controlled end

// TransitionOverlay handles the cinematic animation sequence when transitioning
// from a category selection to the shop page
const TransitionOverlay = ({ 
  isActive, 
  selectedCategory, 
  selectedCardRect,
  onTransitionComplete,
  phase,
  setPhase
}) => {
  const [progress, setProgress] = useState(0);
  const hasCompletedRef = useRef(false);
  const animationTimeoutRef = useRef(null);
  const animationRef = useRef(null);
  // Store selected category in a ref to prevent re-renders
  const selectedCategoryRef = useRef(selectedCategory);
  
  // Enhanced particles state
  const [particlesGenerated, setParticlesGenerated] = useState(false);
  const numParticles = 30; // Increased number of particles
  
  // Update the ref when selectedCategory changes
  useEffect(() => {
    selectedCategoryRef.current = selectedCategory;
  }, [selectedCategory]);
  
  // Reset completion flag when component becomes inactive
  useEffect(() => {
    // Only log if there's a genuine change in state
    if (!isActive && hasCompletedRef.current) {
      hasCompletedRef.current = false;
      setProgress(0);
      setParticlesGenerated(false);
      debugLog("Overlay deactivated, state reset");
    } else if (isActive && selectedCategory && !hasCompletedRef.current) {
      debugLog("Overlay activated", { category: selectedCategory.slug });
    }
    
    // Safety timeout - force completion after 3 seconds if animation gets stuck
    if (isActive && !hasCompletedRef.current) {
      if (!animationTimeoutRef.current) {
        debugLog("Setting safety timeout");
        animationTimeoutRef.current = setTimeout(() => {
          if (isActive && !hasCompletedRef.current) {
            debugLog("⚠️ Animation safety timeout triggered - animation may be stuck");
            hasCompletedRef.current = true;
            onTransitionComplete && onTransitionComplete();
          }
        }, 3000);
      }
    } else if (!isActive && animationTimeoutRef.current) {
      // Clear the timeout if component becomes inactive
      clearTimeout(animationTimeoutRef.current);
      animationTimeoutRef.current = null;
    }
    
    return () => {
      if (animationTimeoutRef.current) {
        clearTimeout(animationTimeoutRef.current);
        animationTimeoutRef.current = null;
      }
    };
  }, [isActive, selectedCategory, onTransitionComplete]);
  
  // Generate particles once when entering Phase 1
  useEffect(() => {
    if (isActive && phase === 1 && !particlesGenerated) {
      setParticlesGenerated(true);
    }
  }, [isActive, phase, particlesGenerated]);
  
  // Track animation progress for coordinated effects with memoized function
  useEffect(() => {
    if (!isActive || hasCompletedRef.current) {
      return;
    }
    
    let startTime = null;
    const totalDuration = 1200; // Total animation duration in ms
    
    const animateProgress = (timestamp) => {
      try {
        if (!startTime) startTime = timestamp;
        const elapsedTime = timestamp - startTime;
        const newProgress = Math.min(elapsedTime / totalDuration, 1);
        
        // Apply easing for more natural progress feelings
        // This creates more dramatic pauses between phases
        let easedProgress = newProgress;
        if (newProgress < 0.3) {
          // Phase 1 - Dramatic quick start
          easedProgress = Math.pow(newProgress / 0.3, 1.2) * 0.3;
        } else if (newProgress < 0.7) {
          // Phase 2 - Slow in the middle
          easedProgress = 0.3 + (Math.pow((newProgress - 0.3) / 0.4, 0.8) * 0.4);
        } else {
          // Phase 3 - Dramatic finish
          easedProgress = 0.7 + (Math.pow((newProgress - 0.7) / 0.3, 1.5) * 0.3);
        }
        
        setProgress(easedProgress);
        
        // Update animation phase based on progress
        if (newProgress < 0.25 && phase !== 1) {
          setPhase(1); // Phase 1: Selection Response
          debugLog("Entering Phase 1", { progress: newProgress });
        } else if (newProgress >= 0.25 && newProgress < 0.7 && phase !== 2) {
          setPhase(2); // Phase 2: Morphing Transition
          debugLog("Entering Phase 2", { progress: newProgress });
        } else if (newProgress >= 0.7 && phase !== 3) {
          setPhase(3); // Phase 3: Page Transition
          debugLog("Entering Phase 3", { progress: newProgress });
        }
        
        // Continue animation until complete
        if (newProgress < 1) {
          animationRef.current = requestAnimationFrame(animateProgress);
        } else if (!hasCompletedRef.current) {
          // Animation complete - ensure we only call this once
          debugLog("Animation complete, calling onTransitionComplete");
          hasCompletedRef.current = true;
          
          try {
            // Use the stored reference to avoid stale closure issues
            onTransitionComplete && onTransitionComplete();
          } catch (error) {
            console.error("Error in onTransitionComplete callback:", error);
          }
        }
      } catch (error) {
        console.error("Error in animation frame:", error);
        
        // Attempt recovery by completing the transition
        if (!hasCompletedRef.current) {
          debugLog("⚠️ Recovering from animation error");
          hasCompletedRef.current = true;
          onTransitionComplete && onTransitionComplete();
        }
      }
    };
    
    try {
      // Cancel any existing animation frame before starting a new one
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      animationRef.current = requestAnimationFrame(animateProgress);
    } catch (error) {
      console.error("Failed to start animation:", error);
    }
    
    return () => {
      if (animationRef.current) {
        try {
          cancelAnimationFrame(animationRef.current);
          animationRef.current = null;
        } catch (error) {
          console.error("Error canceling animation frame:", error);
        }
      }
    };
  }, [isActive, onTransitionComplete, phase, setPhase]);
  
  // Early exit if not active
  if (!isActive || !selectedCategory) return null;

  return (
    <AnimatePresence>
      {isActive && (
        <motion.div 
          className="fixed inset-0 z-50 overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Background blur/darken effect with enhanced gradient */}
          <motion.div 
            className="absolute inset-0 bg-gradient-to-b from-black/90 to-black"
            initial={{ opacity: 0 }}
            animate={{ 
              opacity: progress < 0.7 ? progress * 0.85 : 0.85 - ((progress - 0.7) * 0.85 / 0.3)
            }}
            style={{
              backdropFilter: `blur(${progress < 0.7 ? progress * 20 : (20 - ((progress - 0.7) * 20 / 0.3))}px)`,
              background: `linear-gradient(to bottom, rgba(0,0,0,${progress * 0.9}), rgba(${selectedCategory?.themeColor?.replace('#', '').match(/.{2}/g).map(hex => parseInt(hex, 16)).join(',') || '30,0,10'},${progress * 0.4}))`
            }}
          />
          
          {/* Enhanced Particle effects - larger particles, more varied speeds and paths */}
          <div className="absolute inset-0 pointer-events-none">
            {particlesGenerated && (
              Array.from({ length: numParticles }).map((_, i) => {
                const size = Math.random() * 15 + 5; // Larger particles
                const delay = Math.random() * 0.4;
                const duration = 0.8 + Math.random() * 1.5;
                const xOffset = (Math.random() - 0.5) * 300;
                const yOffset = (Math.random() - 0.5) * 300;
                const opacityMax = Math.random() * 0.5 + 0.4;
                
                return (
                  <motion.div
                    key={i}
                    className={`absolute rounded-full ${i % 3 === 0 ? 'bg-draugr-500' : i % 3 === 1 ? 'bg-draugr-400' : 'bg-red-500'}`}
                    initial={{
                      opacity: 0,
                      x: selectedCardRect?.left + selectedCardRect?.width / 2 || '50%',
                      y: selectedCardRect?.top + selectedCardRect?.height / 2 || '50%',
                      scale: 0
                    }}
                    animate={{
                      opacity: [0, opacityMax, 0],
                      x: `calc(${selectedCardRect?.left + selectedCardRect?.width / 2 || '50%'}px + ${xOffset}px)`,
                      y: `calc(${selectedCardRect?.top + selectedCardRect?.height / 2 || '50%'}px + ${yOffset}px)`,
                      scale: [0, Math.random() * 0.7 + 0.5, 0]
                    }}
                    transition={{
                      duration: duration,
                      delay: delay,
                      ease: "easeOut"
                    }}
                    style={{
                      width: `${size}px`,
                      height: `${size}px`,
                      boxShadow: `0 0 ${size * 0.7}px rgba(255,0,80,0.8)`,
                      filter: `blur(${Math.random() * 2}px)`
                    }}
                  />
                );
              })
            )}
          </div>
          
          {/* Energy lines emanating from selection point - new effect */}
          {selectedCardRect && phase >= 1 && (
            <div className="absolute inset-0 pointer-events-none">
              {[...Array(6)].map((_, i) => {
                const angle = (Math.PI * 2 / 6) * i;
                const length = Math.min(window.innerWidth, window.innerHeight) * 0.4;
                const centerX = selectedCardRect.left + selectedCardRect.width / 2;
                const centerY = selectedCardRect.top + selectedCardRect.height / 2;
                const endX = centerX + Math.cos(angle) * length;
                const endY = centerY + Math.sin(angle) * length;
                
                return (
                  <motion.div
                    key={`line-${i}`}
                    className="absolute bg-draugr-500/60"
                    style={{
                      height: '1.5px',
                      transformOrigin: '0 0',
                      left: centerX,
                      top: centerY,
                      transform: `rotate(${angle}rad)`,
                      boxShadow: '0 0 8px rgba(255,0,80,0.8)',
                      filter: 'blur(0.5px)'
                    }}
                    initial={{ width: 0, opacity: 0 }}
                    animate={{ 
                      width: phase === 1 ? length : 0,
                      opacity: phase === 1 ? [0, 0.8, 0] : 0
                    }}
                    transition={{
                      duration: 1,
                      delay: i * 0.1,
                      ease: "easeOut",
                      opacity: { duration: 1, times: [0, 0.3, 1] }
                    }}
                  />
                );
              })}
            </div>
          )}
          
          {/* Morphing card that transitions from selected category to hero section */}
          {selectedCardRect && (
            <motion.div
              className="absolute rounded-lg overflow-hidden flex flex-col"
              initial={{
                top: selectedCardRect.top,
                left: selectedCardRect.left,
                width: selectedCardRect.width,
                height: selectedCardRect.height,
                borderRadius: '0.5rem',
              }}
              animate={{
                top: phase < 2 ? selectedCardRect.top : '0px',
                left: phase < 3 ? [selectedCardRect.left, window.innerWidth / 2 - selectedCardRect.width * 1.5] : '0px',
                width: phase < 3 ? [selectedCardRect.width, selectedCardRect.width * 3] : '100%',
                height: phase < 3 ? [selectedCardRect.height, selectedCardRect.height * 1.5] : '100%',
                borderRadius: phase < 3 ? '0.5rem' : '0rem',
              }}
              transition={{
                duration: phase === 1 ? 0.5 : 0.8,
                ease: phase === 1 ? elasticOut : smoothInOut,
                times: [0, 1]
              }}
            >
              {/* Card background with enhanced gradient animation */}
              <motion.div
                className="absolute inset-0 z-0"
                initial={{
                  background: 'linear-gradient(to bottom, #1c0b0f, #000000)'
                }}
                animate={{
                  background: [
                    'linear-gradient(to bottom, #1c0b0f, #000000)',
                    `linear-gradient(to bottom, ${selectedCategory?.themeColor || '#420011'}, #000000)`,
                    phase >= 3 ? `linear-gradient(45deg, ${selectedCategory?.themeColor || '#420011'}, #000000, #100205)` : ''
                  ]
                }}
                transition={{ duration: 1.2, times: [0, 0.5, 1] }}
              />

              {/* Abstract geometric shapes in background - new effect */}
              {phase >= 2 && (
                <>
                  <motion.div
                    className="absolute z-1 opacity-50"
                    style={{
                      background: `radial-gradient(circle at 30% 30%, ${selectedCategory?.themeColor || '#420011'}50, transparent 60%)`,
                      width: '60%',
                      height: '60%',
                      top: '10%',
                      right: '5%',
                      filter: 'blur(40px)'
                    }}
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 0.5, scale: 1 }}
                    transition={{ duration: 0.8, delay: 0.1 }}
                  />
                  <motion.div
                    className="absolute z-1 opacity-30"
                    style={{
                      background: `radial-gradient(circle at 70% 70%, #000000, ${selectedCategory?.themeColor || '#420011'}40 80%)`,
                      width: '70%',
                      height: '70%',
                      bottom: '0%',
                      left: '0%',
                      filter: 'blur(60px)'
                    }}
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 0.3, scale: 1 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                  />
                </>
              )}

              {/* Light beams sweeping across - new effect */}
              {phase >= 2 && (
                <motion.div
                  className="absolute inset-0 overflow-hidden z-1 opacity-30 pointer-events-none"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.3 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  <motion.div
                    className="absolute h-[300%] w-[50px] bg-gradient-to-b from-transparent via-white to-transparent"
                    style={{ 
                      top: '-100%',
                      transform: 'rotate(30deg)', 
                      filter: 'blur(20px)'
                    }}
                    animate={{ 
                      left: ['-10%', '110%']
                    }}
                    transition={{
                      duration: 3,
                      delay: 0.5,
                      ease: "easeInOut",
                      times: [0, 1]
                    }}
                  />
                </motion.div>
              )}

              {/* Category content with enhanced typography effects */}
              <div className="relative z-10 flex flex-col justify-center items-center flex-1 p-6">
                {/* Category title with more dramatic animation */}
                <motion.h1
                  className="font-bold text-white text-center"
                  initial={{ fontSize: '1.25rem', y: 0, letterSpacing: 'normal', textShadow: 'none' }}
                  animate={{
                    fontSize: phase < 2 ? ['1.25rem', '1.5rem'] : phase < 3 ? ['1.5rem', '2.5rem'] : ['2.5rem', '3rem'],
                    y: phase < 2 ? 0 : phase < 3 ? -20 : -40,
                    letterSpacing: phase < 2 ? 'normal' : '0.05em',
                    textShadow: phase < 2 ? 'none' : `0 0 10px ${selectedCategory?.themeColor || 'rgba(255,0,80,0.5)'}`
                  }}
                  transition={{ 
                    duration: phase === 1 ? 0.3 : 0.6, 
                    ease: phase === 1 ? elasticOut : "easeOut",
                    textShadow: { delay: 0.1 }
                  }}
                >
                  {selectedCategory?.name}
                </motion.h1>
                
                {phase >= 2 && (
                  <motion.div
                    className="mt-4 text-gray-200 text-center w-full max-w-xl"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.2 }}
                  >
                    <motion.p 
                      className="mb-4"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: [0, 1] }}
                      transition={{ duration: 0.6, times: [0, 1] }}
                    >
                      مجموعه منحصر به فرد محصولات {selectedCategory?.name} ما را کشف کنید
                    </motion.p>
                    
                    {/* Enhanced loading indicator */}
                    {phase >= 3 && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.3 }}
                      >
                        <div className="flex justify-center">
                          <div className="relative w-64 h-1.5 bg-gray-800/80 rounded-full overflow-hidden">
                            {/* Animated glow effect */}
                            <motion.div 
                              className="absolute top-0 bottom-0 w-full"
                              animate={{ x: ['-100%', '100%'] }}
                              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                              style={{ 
                                background: `linear-gradient(90deg, transparent, ${selectedCategory?.themeColor || 'rgba(255,0,80,0.5)'}, transparent)`,
                                filter: 'blur(5px)'
                              }}
                            />
                            <motion.div
                              className="absolute top-0 left-0 h-full bg-draugr-500"
                              initial={{ width: 0 }}
                              animate={{ width: '100%' }}
                              transition={{ duration: 2.5, ease: "easeInOut" }}
                              style={{ boxShadow: '0 0 10px rgba(255,0,80,0.8)' }}
                            />
                          </div>
                        </div>
                        <motion.p 
                          className="mt-2 text-gray-400 text-sm"
                          animate={{ opacity: [0.6, 1, 0.6] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        >
                          درحال بارگذاری محصولات...
                        </motion.p>
                      </motion.div>
                    )}
                  </motion.div>
                )}
              </div>
              
              {/* Animated Shop Elements (Phase 3) with enhanced effects */}
              {phase >= 3 && (
                <>
                  {/* Filter sidebar sliding in from left */}
                  <motion.div
                    className="absolute top-40 left-8 w-64 h-96 bg-black/60 backdrop-blur-lg rounded-lg border border-draugr-900/40 shadow-xl"
                    initial={{ opacity: 0, x: -100 }}
                    animate={{ opacity: 0.7, x: 0 }}
                    transition={{ 
                      duration: 0.7, 
                      delay: 0.2, 
                      type: 'spring',
                      stiffness: 100,
                      damping: 15
                    }}
                  >
                    {/* Mock filter content with motion */}
                    <motion.div 
                      className="h-10 w-3/4 mx-auto mt-4 bg-gray-700/30 rounded-md"
                      initial={{ width: '50%', opacity: 0 }}
                      animate={{ width: '75%', opacity: 0.7 }}
                      transition={{ delay: 0.5, duration: 0.5 }}
                    />
                    <motion.div 
                      className="h-4 w-1/2 mx-auto mt-4 bg-gray-700/30 rounded-sm"
                      initial={{ width: '30%', opacity: 0 }}
                      animate={{ width: '50%', opacity: 0.7 }}
                      transition={{ delay: 0.6, duration: 0.5 }}
                    />
                    <motion.div 
                      className="h-24 w-5/6 mx-auto mt-4 bg-gray-700/20 rounded-md"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 24, opacity: 0.5 }}
                      transition={{ delay: 0.7, duration: 0.5 }}
                    />
                  </motion.div>
                  
                  {/* Product grid sliding up from bottom with stagger effect */}
                  <div className="absolute right-8 left-80 bottom-8 top-40">
                    <div className="grid grid-cols-4 gap-4 w-full h-full">
                      {Array.from({ length: 8 }).map((_, i) => (
                        <motion.div
                          key={i}
                          className="rounded-md bg-gray-900/60 shadow-xl overflow-hidden"
                          initial={{ opacity: 0, y: 50 }}
                          animate={{ opacity: 0.7, y: 0 }}
                          transition={{ 
                            duration: 0.5, 
                            delay: 0.3 + (i * 0.07),
                            type: 'spring',
                            stiffness: 100,
                            damping: 15
                          }}
                        >
                          {/* Mock product thumbnail */}
                          <motion.div 
                            className="h-2/3 w-full bg-gradient-to-br from-gray-800/70 to-draugr-900/40"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 0.8 }}
                            transition={{ duration: 0.3, delay: 0.4 + (i * 0.1) }}
                          />
                          {/* Mock product title */}
                          <motion.div 
                            className="h-4 w-3/4 mx-auto mt-3 bg-gray-700/40 rounded"
                            initial={{ width: '40%', opacity: 0 }}
                            animate={{ width: '75%', opacity: 0.6 }}
                            transition={{ duration: 0.4, delay: 0.5 + (i * 0.1) }}
                          />
                          {/* Mock product price */}
                          <motion.div 
                            className="h-3 w-1/2 mx-auto mt-2 bg-draugr-800/40 rounded"
                            initial={{ width: '20%', opacity: 0 }}
                            animate={{ width: '50%', opacity: 0.7 }}
                            transition={{ duration: 0.3, delay: 0.6 + (i * 0.1) }}
                          />
                        </motion.div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Search bar dropping down from top with enhanced animation */}
                  <motion.div
                    className="absolute top-24 right-8 left-80 h-12 bg-black/60 backdrop-blur-lg rounded-lg border border-draugr-900/40 shadow-xl overflow-hidden"
                    initial={{ opacity: 0, y: -30, height: 0 }}
                    animate={{ opacity: 0.85, y: 0, height: 48 }}
                    transition={{ 
                      opacity: { duration: 0.4, delay: 0.4 },
                      y: { duration: 0.5, delay: 0.4, type: 'spring', stiffness: 200, damping: 15 },
                      height: { duration: 0.4, delay: 0.4 }
                    }}
                  >
                    {/* Search icon and input mock */}
                    <div className="flex items-center h-full px-4">
                      <motion.div 
                        className="h-5 w-5 rounded-full bg-gray-600/60"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.3, delay: 0.6 }}
                      />
                      <motion.div 
                        className="h-4 ml-3 bg-gray-700/40 rounded flex-grow"
                        initial={{ width: 0, opacity: 0 }}
                        animate={{ width: '100%', opacity: 0.7 }}
                        transition={{ duration: 0.5, delay: 0.7 }}
                      />
                    </div>
                  </motion.div>
                </>
              )}
            </motion.div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default TransitionOverlay; 