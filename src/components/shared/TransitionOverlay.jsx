import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

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
  
  // Reset completion flag when component becomes inactive
  useEffect(() => {
    if (!isActive) {
      hasCompletedRef.current = false;
      setProgress(0);
    }
  }, [isActive]);
  
  // Track animation progress for coordinated effects
  useEffect(() => {
    if (!isActive) {
      return;
    }
    
    let animationFrame;
    let startTime = null;
    const totalDuration = 1200; // Total animation duration in ms
    
    const animateProgress = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const elapsedTime = timestamp - startTime;
      const newProgress = Math.min(elapsedTime / totalDuration, 1);
      setProgress(newProgress);
      
      // Update animation phase based on progress
      if (newProgress < 0.25 && phase !== 1) {
        setPhase(1); // Phase 1: Selection Response
      } else if (newProgress >= 0.25 && newProgress < 0.7 && phase !== 2) {
        setPhase(2); // Phase 2: Morphing Transition
      } else if (newProgress >= 0.7 && phase !== 3) {
        setPhase(3); // Phase 3: Page Transition
      }
      
      // Continue animation until complete
      if (newProgress < 1) {
        animationFrame = requestAnimationFrame(animateProgress);
      } else if (!hasCompletedRef.current) {
        // Animation complete - ensure we only call this once
        hasCompletedRef.current = true;
        onTransitionComplete && onTransitionComplete();
      }
    };
    
    animationFrame = requestAnimationFrame(animateProgress);
    
    return () => {
      if (animationFrame) cancelAnimationFrame(animationFrame);
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
          {/* Background blur/darken effect */}
          <motion.div 
            className="absolute inset-0 bg-black"
            initial={{ opacity: 0 }}
            animate={{ 
              opacity: progress < 0.7 ? progress * 0.8 : 0.8 - ((progress - 0.7) * 0.8 / 0.3)
            }}
            style={{
              backdropFilter: `blur(${progress < 0.7 ? progress * 15 : (15 - ((progress - 0.7) * 15 / 0.3))}px)`
            }}
          />
          
          {/* Particle effects */}
          <div className="absolute inset-0 pointer-events-none">
            {phase >= 1 && (
              Array.from({ length: 20 }).map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute rounded-full bg-draugr-500"
                  initial={{
                    opacity: 0,
                    x: selectedCardRect?.left + selectedCardRect?.width / 2 || '50%',
                    y: selectedCardRect?.top + selectedCardRect?.height / 2 || '50%',
                    scale: 0
                  }}
                  animate={{
                    opacity: [0, 0.8, 0],
                    x: `calc(${selectedCardRect?.left + selectedCardRect?.width / 2 || '50%'}px + ${(Math.random() - 0.5) * 200}px)`,
                    y: `calc(${selectedCardRect?.top + selectedCardRect?.height / 2 || '50%'}px + ${(Math.random() - 0.5) * 200}px)`,
                    scale: [0, Math.random() * 0.5 + 0.5]
                  }}
                  transition={{
                    duration: 1 + Math.random() * 0.5,
                    delay: Math.random() * 0.3,
                    ease: "easeOut"
                  }}
                  style={{
                    width: `${Math.random() * 10 + 5}px`,
                    height: `${Math.random() * 10 + 5}px`,
                  }}
                />
              ))
            )}
          </div>
          
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
                duration: 0.8,
                ease: [0.16, 1, 0.3, 1], // Custom cubic-bezier for elastic feel
                times: [0, 1]
              }}
            >
              {/* Card background with gradient animation */}
              <motion.div
                className="absolute inset-0 z-0"
                initial={{
                  background: 'linear-gradient(to bottom, #1c0b0f, #000000)'
                }}
                animate={{
                  background: [
                    'linear-gradient(to bottom, #1c0b0f, #000000)',
                    `linear-gradient(to bottom, ${selectedCategory?.themeColor || '#420011'}, #000000)`
                  ]
                }}
                transition={{ duration: 1, times: [0, 1] }}
              />

              {/* Category content */}
              <div className="relative z-10 flex flex-col justify-center items-center flex-1 p-6">
                <motion.h1
                  className="font-bold text-white text-center"
                  initial={{ fontSize: '1.25rem', y: 0 }}
                  animate={{
                    fontSize: phase < 2 ? '1.25rem' : phase < 3 ? '2.5rem' : '3rem',
                    y: phase < 2 ? 0 : phase < 3 ? -20 : -40
                  }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
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
                    <p className="mb-4">مجموعه منحصر به فرد محصولات {selectedCategory?.name} ما را کشف کنید</p>
                    
                    {phase >= 3 && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.2 }}
                      >
                        <div className="flex justify-center">
                          <div className="relative w-64 h-1 bg-gray-700 rounded-full overflow-hidden">
                            <motion.div
                              className="absolute top-0 left-0 h-full bg-draugr-500"
                              initial={{ width: 0 }}
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
              </div>
              
              {/* Animated Shop Elements (Phase 3) */}
              {phase >= 3 && (
                <>
                  {/* Filter sidebar sliding in from left */}
                  <motion.div
                    className="absolute top-40 left-8 w-64 h-96 bg-black/60 backdrop-blur-lg rounded-lg border border-draugr-900/40 shadow-xl"
                    initial={{ opacity: 0, x: -100 }}
                    animate={{ opacity: 0.7, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                  />
                  
                  {/* Product grid sliding up from bottom */}
                  <div className="absolute right-8 left-80 bottom-8 top-40">
                    <div className="grid grid-cols-4 gap-4 w-full h-full">
                      {Array.from({ length: 8 }).map((_, i) => (
                        <motion.div
                          key={i}
                          className="rounded-md bg-gray-900/60 shadow-xl"
                          initial={{ opacity: 0, y: 50 }}
                          animate={{ opacity: 0.7, y: 0 }}
                          transition={{ duration: 0.5, delay: 0.2 + (i * 0.05) }}
                        />
                      ))}
                    </div>
                  </div>
                  
                  {/* Search bar dropping down from top */}
                  <motion.div
                    className="absolute top-24 right-8 left-80 h-12 bg-black/60 backdrop-blur-lg rounded-lg border border-draugr-900/40 shadow-xl"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 0.7, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                  />
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