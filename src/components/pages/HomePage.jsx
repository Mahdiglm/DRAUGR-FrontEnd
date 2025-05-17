import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { useOutletContext, Link } from 'react-router-dom';

import ProductList from '../product/ProductList';
import FeaturedProductSlider from '../product/FeaturedProductSlider';
import { products } from '../../utils/mockData';
import { safeBlur, safeFilterTransition } from '../../utils/animationHelpers';
// Try with relative path to asset folder
import heroBackground from '../../assets/Background-Hero.jpg';
import mainBackground from '../../assets/BackGround-Main.jpg';

// Letter animation styles and setup
const letterWrapperVariants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05, // Faster stagger
      delayChildren: 0.05, // Less delay
    },
  },
  exit: {
    x: 100, // Move to right when exiting
    opacity: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15,
      mass: 1,
      duration: 0.5
    },
  }
};

const letterVariants = {
  hidden: {
    opacity: 0,
    y: 30,
    rotateX: 70,
    filter: safeBlur(8), // Using our safe blur helper
  },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    rotateX: 0,
    filter: safeBlur(0), // Using our safe blur helper
    transition: {
      type: "spring",
      damping: 10,
      stiffness: 100,
      delay: i * 0.03, // Even faster per-letter delay
      filter: safeFilterTransition({ duration: 0.3 }) // Use safe filter transition
    },
  }),
  exit: (i) => ({
    opacity: 0,
    x: 50 + (i * 20), // Staggered movement to right
    filter: safeBlur(8), // Using our safe blur helper
    transition: {
      duration: 0.4, 
      delay: i * 0.03, // Staggered exit
      filter: safeFilterTransition() // Use safe filter transition
    },
  }),
};

// Particles system for the intro
const Particles = () => {
  // Generate fewer particles for performance
  const particles = Array.from({ length: 50 }).map((_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 2 + 1,
    velocity: Math.random() * 0.2 + 0.1,
  }));

  return (
    <div className="absolute inset-0 overflow-hidden z-0">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute w-1 h-1 bg-draugr-500 rounded-full opacity-70"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
          }}
          animate={{
            y: [0, window.innerHeight * particle.velocity],
            opacity: [0.7, 0],
          }}
          transition={{
            duration: 1 + particle.velocity * 5, // Faster animation
            repeat: Infinity,
            delay: Math.random(),
            ease: "linear",
          }}
        />
      ))}
    </div>
  );
};

const HomePage = () => {
  const { addToCart } = useOutletContext();
  const heroRef = useRef(null);
  const [showIntro, setShowIntro] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  // For testing - reset intro animation
  const resetIntroAnimation = () => {
    localStorage.removeItem('hasSeenDraugrIntro');
    window.location.reload();
  };
  
  // Check if user has already seen the intro
  useEffect(() => {
    const hasSeenIntro = localStorage.getItem('hasSeenDraugrIntro');
    
    if (hasSeenIntro) {
      // Skip intro if user has already seen it
      setShowIntro(false);
      setIsLoading(false);
    } else {
      // Show intro for first-time visitors
      setShowIntro(true);
    }
  }, []);
  
  // Handle initial loading - immediate load
  useEffect(() => {
    // Ensure we start at the top of the page immediately
    window.scrollTo(0, 0);
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
    
    // Set scroll restoration to manual 
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }
    
    // Hide loader immediately
    setIsLoading(false);
  }, []);
  
  // Handle intro completion - reduced to 1 second
  useEffect(() => {
    if (!showIntro) return; // Skip if intro not shown
    
    const timer = setTimeout(() => {
      // Start exit animation
      setIsExiting(true);
      
      // Wait for exit animation to complete before removing intro
      setTimeout(() => {
        // Immediately scroll to top before showing main content
        window.scrollTo(0, 0);
        document.body.scrollTop = 0;
        document.documentElement.scrollTop = 0;
        
        // Now transition to main content
        setShowIntro(false);
        
        // Set flag in localStorage that user has seen the intro
        localStorage.setItem('hasSeenDraugrIntro', 'true');
      }, 600); // Time for exit animation to complete
      
    }, 1000); // Reduced to 1 second
    
    return () => clearTimeout(timer);
  }, [showIntro]);
  
  // Parallax effect
  const { scrollY } = useScroll();
  const backgroundY = useTransform(scrollY, [0, 500], [0, 100]);
  const textY = useTransform(scrollY, [0, 500], [0, -50]);
  const opacityHero = useTransform(scrollY, [0, 300], [1, 0.3]);

  // Default background in case the import fails
  const fallbackBg = "https://images.unsplash.com/photo-1508614589041-895b88991e3e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1920&q=80";

  // Preload all images immediately
  useEffect(() => {
    const preloadImages = [heroBackground, mainBackground];
    preloadImages.forEach((image) => {
      const img = new Image();
      img.src = image;
    });
  }, []);

  // Dynamic background variants for the intro
  const bgVariants = {
    initial: { 
      opacity: 0 
    },
    visible: { 
      opacity: 0.4
    },
    exit: { 
      opacity: 0, 
      scale: 1.2,
      transition: { 
        duration: 0.8, 
        ease: "easeOut" 
      }
    }
  };

  // Vignette variants
  const vignetteVariants = {
    initial: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { 
      opacity: 0, 
      scale: 1.3,
      transition: { 
        duration: 0.8, 
        ease: "easeOut" 
      }
    }
  };

  return (
    <>
      {/* Initial loading overlay - fast & minimal */}
      <AnimatePresence>
        {isLoading && (
          <motion.div
            key="loader"
            className="fixed inset-0 z-[100] bg-black flex items-center justify-center"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.1 }}
          >
            <motion.div
              animate={{ 
                opacity: [0.5, 1, 0.5],
                scale: [0.9, 1.1, 0.9]
              }}
              transition={{ 
                duration: 1, 
                repeat: Infinity,
                ease: "easeInOut" 
              }}
              className="w-12 h-12 rounded-full border-t-2 border-r-2 border-draugr-500"
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Intro Animation */}
      <AnimatePresence>
        {showIntro && (
          <motion.div
            key="intro"
            className="fixed inset-0 flex justify-center items-center z-50 bg-midnight overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ 
              opacity: 0,
              transition: { 
                duration: 0.8,
                when: "afterChildren" 
              }
            }}
          >
            {/* Background pulse effect */}
            <motion.div
              className="absolute inset-0 bg-gradient-radial from-vampire-dark to-midnight"
              variants={bgVariants}
              initial="initial"
              animate={{
                scale: [1, 1.1, 1],
                opacity: [0.3, 0.4, 0.3]
              }}
              exit="exit"
              transition={{ 
                duration: 2,
                repeat: Infinity,
                repeatType: "reverse",
                ease: "easeInOut"
              }}
            />
            
            {/* Particles will fade out as part of parent container */}
            <Particles />
            
            {/* Vignette effect */}
            <motion.div 
              className="absolute inset-0 bg-radial-vignette pointer-events-none"
              variants={vignetteVariants}
              initial="initial"
              animate="visible"
              exit="exit"
            />
            
            {/* Glitch overlay - subtle */}
            <motion.div 
              className="absolute inset-0 bg-noise opacity-8 mix-blend-overlay pointer-events-none"
              animate={{ opacity: [0.05, 0.08, 0.05] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              exit={{ 
                opacity: 0, 
                transition: { duration: 0.5 } 
              }}
            />
            
            {/* Brand name animation - Explicitly set LTR direction */}
            <motion.div
              className="relative flex items-center justify-center h-40"
              variants={letterWrapperVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              style={{ direction: "ltr" }}
            >
              {"DRAUGR".split('').map((letter, index) => (
                <motion.div 
                  key={index} 
                  className="relative mx-1 md:mx-3"
                  custom={index}
                  variants={letterVariants}
                >
                  <span
                    className="inline-block text-6xl md:text-9xl font-bold text-draugr-500 relative"
                    style={{ 
                      textShadow: '0 0 20px rgba(239,35,60,0.8), 0 0 30px rgba(239,35,60,0.4)',
                      transform: 'perspective(500px)'
                    }}
                  >
                    {letter}
                  </span>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content - always rendered */}
      <motion.div 
        style={{ 
          opacity: showIntro ? 0 : 1,
        }}
        animate={{ 
          opacity: showIntro ? 0 : 1,
          y: showIntro ? 20 : 0,
          scale: showIntro ? 0.98 : 1,
        }}
        transition={{ 
          duration: 0.6,
          ease: "easeOut"
        }}
      >
        {/* FOR TESTING ONLY - Remove in production */}
        <div className="fixed bottom-4 right-4 z-50">
          <button 
            onClick={resetIntroAnimation}
            className="bg-black bg-opacity-50 text-white text-xs px-3 py-1 rounded-md"
          >
            Reset Intro (Test Only)
          </button>
        </div>
        
        {/* Hero Section with Parallax */}
        <motion.section
          ref={heroRef}
          className="py-12 sm:py-16 md:py-20 w-full relative overflow-hidden"
          style={{ 
            minHeight: '93.4vh', 
            display: 'flex', 
            alignItems: 'center',
            backgroundImage: `url(${heroBackground || fallbackBg})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
          }}
        >
          {/* Dark overlay for better text readability */}
          <div className="absolute inset-0 bg-black opacity-50"></div>

          {/* Bottom gradient overlay for smooth transition */}
          <div 
            className="absolute bottom-0 left-0 right-0 h-32 z-10" 
            style={{
              background: 'linear-gradient(to bottom, transparent, rgba(0, 0, 0, 0.95))',
              pointerEvents: 'none'
            }}
          ></div>

          <div className="w-full flex justify-center items-center">
            <div className="max-w-7xl mx-auto px-4 relative z-10 text-center">
              <motion.div
                className="max-w-3xl mx-auto"
                style={{ y: textY, opacity: opacityHero }}
              >
                <motion.h1 
                  className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6 text-shadow-horror"
                >
                  <span className="text-draugr-500 font-bold text-shadow-horror">
                    اقلام خارق‌العاده را
                  </span> برای ماجراجویی خود کشف کنید
                </motion.h1>
                <motion.p
                  className="text-base sm:text-lg md:text-xl mb-6 sm:mb-8 text-gray-200 font-medium"
                  style={{ textShadow: '0 1px 2px rgba(0, 0, 0, 0.8)' }}
                >
                  مجموعه‌ی ما از آثار افسانه‌ای، سلاح‌ها و تجهیزات را کاوش کنید.
                </motion.p>
                <Link to="/shop">
                  <motion.button
                    whileHover={{ 
                      scale: 1.05, 
                      boxShadow: '0 0 20px rgba(255, 0, 0, 0.7)',
                      textShadow: '0 0 10px rgba(255, 255, 255, 0.9)'
                    }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-gradient-to-r from-draugr-800 to-draugr-600 text-white font-medium text-sm sm:text-base px-6 sm:px-8 py-2 sm:py-3 rounded-md border border-draugr-500"
                  >
                    فروشگاه
                  </motion.button>
                </Link>
              </motion.div>
            </div>
          </div>
        </motion.section>

        {/* Featured Products */}
        <motion.section 
          className="py-12 sm:py-16 md:py-20 bg-gradient-to-b from-charcoal to-midnight w-full relative overflow-hidden"
          style={{
            backgroundImage: `url(${mainBackground})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
          }}
        >
          {/* Dark overlay for better readability */}
          <div className="absolute inset-0 bg-black bg-opacity-70 z-0"></div>
          
          {/* Top gradient overlay for smooth transition from hero section */}
          <div 
            className="absolute top-0 left-0 right-0 h-32 z-0" 
            style={{
              background: 'linear-gradient(to top, transparent, rgba(0, 0, 0, 0.95))',
              pointerEvents: 'none'
            }}
          ></div>
          
          {/* Bottom gradient overlay for smooth transition to footer */}
          <div 
            className="absolute bottom-0 left-0 right-0 h-32 z-0" 
            style={{
              background: 'linear-gradient(to bottom, transparent, rgba(0, 0, 0, 0.95))',
              pointerEvents: 'none'
            }}
          ></div>
          
          {/* Subtle fog animations in background */}
          <div className="absolute inset-0 z-[1] opacity-20">
            <motion.div 
              className="absolute inset-0"
              animate={{ 
                backgroundPosition: ['0% 0%', '100% 100%']
              }}
              transition={{ 
                duration: 60, 
                ease: "linear", 
                repeat: Infinity,
                repeatType: "reverse" 
              }}
              style={{
                backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 2000 2000\' fill=\'none\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.65\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\' opacity=\'0.4\'/%3E%3C/svg%3E")',
                backgroundSize: '200% 200%'
              }}
            />
          </div>
          
          {/* Content container with enhanced styling */}
          <div className="relative z-10 container mx-auto px-4">
            <div className="mb-8 text-center">
              <h2 className="text-3xl md:text-4xl font-bold text-white text-shadow-horror mb-4">
                <span className="relative inline-block">
                  محصولات ویژه
                  <motion.span 
                    className="absolute -bottom-2 left-0 right-0 h-0.5 bg-draugr-500"
                    style={{ width: '100%' }}
                  ></motion.span>
                </span>
              </h2>
              <p className="text-gray-400 max-w-2xl mx-auto">محصولات برتر و منحصر به فرد ما را کشف کنید، هر کدام با ویژگی‌های خاص طراحی شده‌اند.</p>
            </div>
            
            <FeaturedProductSlider 
              products={products} 
              onAddToCart={addToCart} 
            />
            
            <div className="text-center mt-12">
              <Link to="/shop">
                <motion.div 
                  className="inline-block relative"
                  whileHover="hover"
                  initial="rest"
                  animate="rest"
                >
                  {/* Main button */}
                  <motion.button
                    className="bg-black text-red-100 font-bold py-3 px-10 relative z-10
                              border border-red-900/50 rounded
                              flex items-center justify-center gap-3"
                    variants={{
                      rest: { scale: 1 },
                      hover: { scale: 1.03 }
                    }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {/* Left chevron */}
                    <motion.svg 
                      width="16" 
                      height="16" 
                      viewBox="0 0 24 24" 
                      fill="none" 
                      xmlns="http://www.w3.org/2000/svg"
                      variants={{
                        rest: { x: 0, opacity: 0.7 },
                        hover: { x: -5, opacity: 1 }
                      }}
                      transition={{ type: "spring", stiffness: 400, damping: 10 }}
                      className="text-red-500"
                    >
                      <path d="M15 6L9 12L15 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </motion.svg>

                    <span>مشاهده همه محصولات</span>

                    {/* Right chevron */}
                    <motion.svg 
                      width="16" 
                      height="16" 
                      viewBox="0 0 24 24" 
                      fill="none" 
                      xmlns="http://www.w3.org/2000/svg"
                      variants={{
                        rest: { x: 0, opacity: 0.7 },
                        hover: { x: 5, opacity: 1 }
                      }}
                      transition={{ type: "spring", stiffness: 400, damping: 10 }}
                      className="text-red-500"
                    >
                      <path d="M9 6L15 12L9 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </motion.svg>
                  </motion.button>

                  {/* Background animated glow/frame effect */}
                  <motion.div 
                    className="absolute inset-0 -z-10 bg-gradient-to-r from-red-900/0 via-red-700/50 to-red-900/0 rounded-lg blur-md"
                    variants={{
                      rest: { opacity: 0, scale: 0.95 },
                      hover: { opacity: 1, scale: 1.05 }
                    }}
                  ></motion.div>

                  {/* Corner accents (Norse-inspired) */}
                  <motion.div 
                    className="absolute -top-1 -left-1 w-3 h-3 border-t-2 border-l-2 border-red-600"
                    variants={{
                      rest: { opacity: 0.4 },
                      hover: { opacity: 1 }
                    }}
                  ></motion.div>
                  <motion.div 
                    className="absolute -top-1 -right-1 w-3 h-3 border-t-2 border-r-2 border-red-600"
                    variants={{
                      rest: { opacity: 0.4 },
                      hover: { opacity: 1 }
                    }}
                  ></motion.div>
                  <motion.div 
                    className="absolute -bottom-1 -left-1 w-3 h-3 border-b-2 border-l-2 border-red-600"
                    variants={{
                      rest: { opacity: 0.4 },
                      hover: { opacity: 1 }
                    }}
                  ></motion.div>
                  <motion.div 
                    className="absolute -bottom-1 -right-1 w-3 h-3 border-b-2 border-r-2 border-red-600"
                    variants={{
                      rest: { opacity: 0.4 },
                      hover: { opacity: 1 }
                    }}
                  ></motion.div>
                </motion.div>
              </Link>
            </div>
          </div>
        </motion.section>
      </motion.div>
    </>
  );
};

export default HomePage; 