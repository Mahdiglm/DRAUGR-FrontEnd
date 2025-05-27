import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * TransitionOverlay - Complete redesign with finite state machine approach
 * 
 * This component handles the cinematic transition animation between category selection
 * and shop page navigation. Uses a state machine approach for more robust animation control.
 */

const debugLog = (message, data = {}) => {
  if (process.env.NODE_ENV === 'development') {
    console.log(`[TransitionOverlayV2] ${message}`, data);
  }
};

const VisualPhase = {
  IDLE: 'idle',
  SELECTED_CARD_RESPONSE: 'selected_card_response', // Phase 1
  MORPHING_TO_HERO: 'morphing_to_hero',         // Phase 2
  PAGE_CONTENT_REVEAL: 'page_content_reveal',     // Phase 3
  FINALIZING: 'finalizing',                   // Cleanup and call onTransitionEnd
};

const TransitionOverlay = ({
  isActive,             // Boolean: Is the transition process active?
  selectedCategoryData, // { category: object, cardRect: DOMRect }
  onTransitionEnd,      // Callback when visual transition finishes, before navigation
  shopPageThemeColor,   // Optional: theme color for phase 2/3
}) => {
  const [visualPhase, setVisualPhase] = useState(VisualPhase.IDLE);
  const [internalSelectedCategory, setInternalSelectedCategory] = useState(null);
  const [internalCardRect, setInternalCardRect] = useState(null);

  const overlayRef = useRef(null);

  useEffect(() => {
    if (isActive && selectedCategoryData) {
      debugLog('Activation: TransitionOverlay received active state and data.', { category: selectedCategoryData.category.slug });
      setInternalSelectedCategory(selectedCategoryData.category);
      setInternalCardRect(selectedCategoryData.cardRect);
      setVisualPhase(VisualPhase.SELECTED_CARD_RESPONSE);
    } else if (!isActive && visualPhase !== VisualPhase.IDLE) {
      // If CategoryRows deactivates us prematurely or after completion
      debugLog('Deactivation: TransitionOverlay received inactive state. Resetting.', { currentPhase: visualPhase });
      // Potentially add a quick fade out for the overlay if it's caught mid-transition
      setVisualPhase(VisualPhase.IDLE);
      setInternalSelectedCategory(null);
      setInternalCardRect(null);
    }
  }, [isActive, selectedCategoryData, visualPhase]);

  const handlePhaseCompletion = (nextPhase) => {
    debugLog(`Phase completed, moving to: ${nextPhase}`);
    setVisualPhase(nextPhase);
  };

  // useEffect to handle the finalization step (calling onTransitionEnd)
  useEffect(() => {
    if (visualPhase === VisualPhase.FINALIZING) {
      debugLog('Finalization Logic: Visual transition visually complete. Calling onTransitionEnd.');
      if (onTransitionEnd) {
        onTransitionEnd();
      }
      // After onTransitionEnd, CategoryRows should set isActive to false,
      // which will then trigger the cleanup in the first useEffect.
      // To be safe, we can also schedule a reset here if isActive doesn't change quickly.
      const resetTimeout = setTimeout(() => {
        if (isActive) { // Only reset if still active, indicating CategoryRows hasn't reset us
            debugLog('Finalization Logic: Forcing reset of TransitionOverlay state post-onTransitionEnd.');
            setVisualPhase(VisualPhase.IDLE);
            setInternalSelectedCategory(null);
            setInternalCardRect(null);
        }
      }, 500); // Give some time for CategoryRows to react and set isActive=false

      return () => clearTimeout(resetTimeout);
    }
  }, [visualPhase, onTransitionEnd, isActive]);
  
  // Ensure data is ready before trying to render animations
  if (!isActive || !internalSelectedCategory || !internalCardRect || visualPhase === VisualPhase.IDLE) {
    return null;
  }

  const { category } = internalSelectedCategory;
  const { cardRect } = internalCardRect;


  // --- Backdrop Variants ---
  const backdropVariants = {
    initial: { opacity: 0 },
    selected_card_response: { 
      opacity: 0.7, 
      backgroundColor: 'rgba(0,0,0,0.7)',
      transition: { duration: 0.3 } 
    },
    morphing_to_hero: { 
      opacity: 0.9,
      // Example: backgroundColor: shopPageThemeColor ? shopPageThemeColor : 'rgba(10,0,0,0.9)',
      backgroundColor: `rgba(20, 5, 10, 0.95)`, // Darker, thematic
      transition: { duration: 0.5 }
    },
    page_content_reveal: { 
      opacity: 1, 
      backgroundColor: `rgba(0,0,0,1)`, // Full black for page reveal
      transition: { duration: 0.4 }
    },
    exit: { opacity: 0, transition: { duration: 0.3, delay: 0.2 } } // Delay exit to allow content to fade
  };

  // --- Morphing Element (Card Clone -> Hero -> Full Page) Variants ---
  const morphElementVariants = {
    initial: { // Starts at the selected card's position
      x: cardRect.left,
      y: cardRect.top,
      width: cardRect.width,
      height: cardRect.height,
      scale: 1,
      opacity: 1,
      borderRadius: '0.5rem', // Match card's border radius
      boxShadow: '0 0 0px rgba(0,0,0,0)',
      backgroundColor: category.themeColor || '#330011', // Initial card color
    },
    selected_card_response: { // Phase 1
      scale: 1.9,
      boxShadow: `0 0 30px 10px ${category.themeColor || 'rgba(255,50,50,0.5)'}`,
      transition: { type: 'spring', stiffness: 260, damping: 20, duration: 0.3 }
    },
    morphing_to_hero: { // Phase 2
      x: window.innerWidth * 0.1, // Example: 10% from left
      y: window.innerHeight * 0.1, // Example: 10% from top
      width: window.innerWidth * 0.8, // Example: 80% width
      height: window.innerHeight * 0.4, // Example: 40% height for hero
      scale: 1, // Reset scale if it was used for initial pop
      borderRadius: '0.25rem',
      boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
      // backgroundColor: shopPageThemeColor || '#220011', // Transition to new theme
      backgroundColor: category.themeColor ? tinycolor(category.themeColor).darken(10).toString() : '#220011',
      transition: { duration: 0.5, ease: [0.65, 0, 0.35, 1] } // Cubic bezier for premium feel
    },
    page_content_reveal: { // Phase 3
      x: 0,
      y: 0,
      width: '100vw',
      height: '100vh',
      borderRadius: '0rem',
      backgroundColor: '#000000', // Full black or page background
      boxShadow: '0 0 0px rgba(0,0,0,0)',
      transition: { duration: 0.4, ease: [0.65, 0, 0.35, 1] }
    },
  };
  
  // --- Content Variants (Title, Description within Morphing Element) ---
  const heroTitleVariants = {
    initial: { opacity: 0, y: 10, scale: 0.8 }, // Starts smaller, slightly offset
    selected_card_response: { opacity: 1, y: 0, scale: 1, transition: { delay: 0.1, duration: 0.2 } }, // Quickly show original title
    morphing_to_hero: { 
      opacity: 1, 
      y: 0,
      scale: 1.5, // Larger hero title
      transition: { delay: 0.2, duration: 0.4 } 
    },
    page_content_reveal: { opacity: 0, transition: {duration: 0.2} } // Fade out as page takes over
  };

  const heroDescriptionVariants = {
    initial: { opacity: 0, y: 20 },
    selected_card_response: { opacity: 0 }, // Hidden initially
    morphing_to_hero: { opacity: 1, y: 0, transition: { delay: 0.35, duration: 0.4 } },
    page_content_reveal: { opacity: 0, transition: {duration: 0.2} }
  };

  // --- Mock Page Elements Variants ---
  const mockFiltersSidebarVariants = {
    initial: { x: '-100%', opacity: 0 },
    page_content_reveal: { x: '0%', opacity: 1, transition: { delay: 0.2, duration: 0.4, ease: 'easeOut' } },
  };
  const mockProductGridVariants = {
    initial: { y: '100%', opacity: 0 },
    page_content_reveal: { y: '0%', opacity: 1, transition: { delay: 0.3, duration: 0.5, ease: 'easeOut' } },
  };
   const mockHeaderVariants = {
    initial: { y: '-100%', opacity: 0 },
    page_content_reveal: { y: '0%', opacity: 1, transition: { delay: 0.1, duration: 0.4, ease: 'easeOut' } },
  };


  return (
    <AnimatePresence>
      {isActive && visualPhase !== VisualPhase.IDLE && internalSelectedCategory && internalCardRect && (
        <motion.div
          ref={overlayRef}
          className="fixed inset-0 z-[1000] pointer-events-none" // High z-index
          key="transition-overlay-main"
        >
          {/* 1. Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black"
            variants={backdropVariants}
            initial="initial"
            animate={visualPhase} // Drive by current visualPhase state
            exit="exit"
            onAnimationComplete={() => {
              if (visualPhase === VisualPhase.PAGE_CONTENT_REVEAL) {
                handlePhaseCompletion(VisualPhase.FINALIZING);
              }
            }}
          />

          {/* 2. Morphing Element */}
          <motion.div
            className="absolute overflow-hidden flex flex-col items-center justify-center"
            style={{ 
              // Will be controlled by variants: x, y, width, height, backgroundColor, borderRadius, boxShadow
            }}
            variants={morphElementVariants}
            initial="initial"
            animate={visualPhase}
            onAnimationComplete={() => {
              if (visualPhase === VisualPhase.SELECTED_CARD_RESPONSE) {
                handlePhaseCompletion(VisualPhase.MORPHING_TO_HERO);
              } else if (visualPhase === VisualPhase.MORPHING_TO_HERO) {
                handlePhaseCompletion(VisualPhase.PAGE_CONTENT_REVEAL);
              }
              // Note: PAGE_CONTENT_REVEAL completion is handled by backdrop to ensure it's the last visual step
            }}
          >
            {/* Content inside the morphing element */}
            <motion.h1
              className="text-white font-bold text-center"
              style={{
                fontSize: 'clamp(1rem, 5vw, 2.5rem)', // Responsive font size
                padding: '10px',
                // Other styles will be implicitly handled if needed or can be added
              }}
              variants={heroTitleVariants}
              initial="initial"
              animate={visualPhase}
            >
              {internalSelectedCategory.name}
            </motion.h1>
            {(visualPhase === VisualPhase.MORPHING_TO_HERO || visualPhase === VisualPhase.PAGE_CONTENT_REVEAL) && (
              <motion.p
                className="text-gray-300 text-center"
                style={{
                  fontSize: 'clamp(0.8rem, 2.5vw, 1.1rem)',
                  padding: '0 20px',
                  maxWidth: '80%',
                }}
                variants={heroDescriptionVariants}
                initial="initial"
                animate={visualPhase} // Animate will pick up from current visualPhase
              >
                {/* Replace with actual description or dynamic content */}
                Discover our exclusive collection of {internalSelectedCategory.name}.
              </motion.p>
            )}
          </motion.div>

          {/* 3. Mock Page Elements (only visible during PAGE_CONTENT_REVEAL) */}
          {visualPhase === VisualPhase.PAGE_CONTENT_REVEAL && (
            <>
              <motion.div 
                className="absolute top-0 left-0 w-full h-16 bg-gray-800/80 backdrop-blur-sm shadow-lg" // Mock Header
                variants={mockHeaderVariants}
                initial="initial"
                animate="page_content_reveal"
              />
              <motion.div 
                className="absolute top-16 left-0 w-64 h-[calc(100%-4rem)] bg-gray-700/70 backdrop-blur-sm shadow-md" // Mock Sidebar
                variants={mockFiltersSidebarVariants}
                initial="initial"
                animate="page_content_reveal"
              />
              <motion.div 
                className="absolute top-16 left-64 w-[calc(100%-16rem)] h-[calc(100%-4rem)] bg-gray-900/50 p-4 overflow-y-auto" // Mock Product Grid Area
                variants={mockProductGridVariants}
                initial="initial"
                animate="page_content_reveal"
              >
                {/* Example grid items */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {Array.from({ length: 8 }).map((_, i) => (
                    <div key={i} className="h-48 bg-gray-600/50 rounded-md animate-pulse"></div>
                  ))}
                </div>
              </motion.div>
            </>
          )}
           {/* Finalizing phase is handled by useEffect, no direct render needed here */}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Effect to handle finalization logic when visualPhase changes
// Need to call outside the main return for hooks
// const TransitionOverlayWithHooks = (props) => {
//   const { visualPhase, onTransitionEnd, isActive } = props; // Assuming visualPhase is lifted or passed if needed here
//                                                        // For this example, let's assume visualPhase from above is accessible or managed.
//                                                        // This part of the example needs refinement based on how visualPhase state is truly managed.
//                                                        // The example above keeps visualPhase internal.
//                                                        // So, the finalization call needs to be in an effect inside the main component.

//   // This effect is illustrative; the actual call to onTransitionEnd is handled by
//   // onAnimationComplete of the backdrop or a useEffect watching visualPhase inside the main component.
//   // For now, the onAnimationComplete of the backdrop in the main component is preferred.

//   // The direct call to onTransitionEnd will be handled by the main component's logic now.
//   // This separate component is not strictly necessary with the current structure.
//   return <TransitionOverlay {...props} />;
// };


export default TransitionOverlay; // Export the main component directly


// Helper for tinycolor if you decide to use it (install separately: npm install tinycolor2)
// import tinycolor from 'tinycolor2'; 
// This would be used as: category.themeColor ? tinycolor(category.themeColor).darken(10).toString() : '#220011'
// For now, I've put a placeholder, but if you want dynamic color changes, tinycolor is good. 