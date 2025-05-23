import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { useOutletContext, Link } from 'react-router-dom';

import ProductList from '../product/ProductList';
import FeaturedProductSlider from '../product/FeaturedProductSlider';
import CategoryRows from '../shared/CategoryRows';
import { products, categories, additionalCategories, thirdRowCategories, fourthRowCategories } from '../../utils/mockData';
import { safeBlur, safeFilterTransition, isLowPerformanceDevice, getOptimizedAnimationSettings } from '../../utils/animationHelpers';
// Try with relative path to asset folder
import heroBackground from '../../assets/Background-Hero.jpg';
import mainBackground from '../../assets/BackGround-Main.jpg';

// Letter animation styles and setup - Simplified for better performance
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
    opacity: 0,
    transition: {
      duration: 0.3
    },
  }
};

const letterVariants = {
  hidden: {
    opacity: 0,
    y: 20,
  },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: {
      type: "tween", // Using tween instead of spring for better performance
      duration: 0.4,
      delay: i * 0.03, // Even faster per-letter delay
    },
  }),
  exit: {
    opacity: 0,
    transition: {
      duration: 0.3
    },
  },
};

// Particles system for the intro - Optimized for mobile
const Particles = () => {
  const [particleCount, setParticleCount] = useState(50);
  
  // Dynamically adjust particle count based on device
  useEffect(() => {
    // Use the helper function to detect low-performance devices
    const lowPerformance = isLowPerformanceDevice();
    setParticleCount(lowPerformance ? 10 : 50);
  }, []);
  
  // Generate fewer particles for performance
  const particles = Array.from({ length: particleCount }).map((_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 1.5 + 0.5, // Slightly smaller particles
    velocity: Math.random() * 0.15 + 0.05, // Slightly slower for better performance
  }));

  return (
    <div className="absolute inset-0 overflow-hidden z-0">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full opacity-70"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            background: '#ff0000',
            willChange: 'transform, opacity',
            transform: 'translateZ(0)'
          }}
          animate={{
            y: [0, window.innerHeight * particle.velocity],
            opacity: [0.7, 0],
          }}
          transition={{
            duration: getOptimizedAnimationSettings(
              1 + particle.velocity * 3, // Default duration
              0.8 + particle.velocity * 2 // Optimized duration
            ),
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
  const [isLowPerformance, setIsLowPerformance] = useState(false);
  
  // Check device performance on mount
  useEffect(() => {
    setIsLowPerformance(isLowPerformanceDevice());
  }, []);
  
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
      }, isLowPerformance ? 300 : 400); // Even faster on low-end devices
      
    }, isLowPerformance ? 600 : 800); // Even shorter on low-end devices
    
    return () => clearTimeout(timer);
  }, [showIntro, isLowPerformance]);
  
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
            {isLowPerformance ? (
              // Simplified loader for low-performance devices
              <div className="w-10 h-10 border-t-2 border-r-2 border-draugr-500 rounded-full"></div>
            ) : (
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
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Intro Animation - conditionally simplified for low-performance devices */}
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
                duration: isLowPerformance ? 0.3 : 0.4,
                when: "afterChildren" 
              }
            }}
            style={{
              willChange: 'opacity',
              transform: 'translateZ(0)'
            }}
          >
            {/* Background pulse effect - Simplified or removed for low-performance */}
            {!isLowPerformance && (
              <motion.div
                className="absolute inset-0 bg-gradient-radial from-vampire-dark to-midnight"
                variants={bgVariants}
                initial="initial"
                animate={{ opacity: 0.4 }}
                exit="exit"
                style={{
                  willChange: 'opacity',
                  transform: 'translateZ(0)'
                }}
              />
            )}
            
            {/* Simplified background for low-performance devices */}
            {isLowPerformance && (
              <div 
                className="absolute inset-0 bg-midnight"
                style={{ opacity: 0.9 }}
              />
            )}
            
            {/* Particles shown conditionally based on device performance */}
            {!isLowPerformance && <Particles />}
            
            {/* Vignette effect - conditionally shown */}
            {!isLowPerformance && (
              <motion.div 
                className="absolute inset-0 bg-radial-vignette pointer-events-none"
                variants={vignetteVariants}
                initial="initial"
                animate="visible"
                exit="exit"
                style={{
                  willChange: 'opacity',
                  transform: 'translateZ(0)'
                }}
              />
            )}
            
            {/* Brand name animation - Simplified for performance */}
            <motion.div
              className="relative flex items-center justify-center h-40"
              variants={letterWrapperVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              style={{ direction: "ltr", willChange: 'opacity' }}
            >
              {"DRAUGR".split('').map((letter, index) => (
                <motion.div 
                  key={index} 
                  className="relative mx-1 md:mx-3"
                  custom={index}
                  variants={letterVariants}
                  style={{
                    willChange: 'transform, opacity',
                    transform: 'translateZ(0)'
                  }}
                >
                  <span
                    className="inline-block text-6xl md:text-9xl font-bold text-draugr-500 relative"
                    style={{ 
                      textShadow: isLowPerformance 
                        ? '0 0 5px rgba(239,35,60,0.5)' 
                        : '0 0 15px rgba(239,35,60,0.6)'
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
                  <motion.div className="inline-block relative">
                    <motion.button
                      whileHover={{ 
                        scale: 1.03,
                      }}
                      whileTap={{ scale: 0.97 }}
                      className="group relative overflow-hidden bg-gradient-to-br from-draugr-900 to-draugr-800 
                                text-red-50 font-medium text-sm sm:text-base 
                                px-5 sm:px-6 py-2 sm:py-2.5 rounded-md 
                                border border-red-900/70 shadow-md"
                    >
                      {/* Flare effect */}
                      <motion.span 
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-red-500/10 to-transparent"
                        initial={{ x: '-100%', opacity: 0 }}
                        whileHover={{ 
                          x: '100%', 
                          opacity: 0.5,
                          transition: { 
                            duration: 1.2, 
                            ease: "easeInOut" 
                          }
                        }}
                      />
                      
                      {/* Runic accent line */}
                      <span className="absolute -bottom-0.5 left-0 w-full h-0.5 bg-gradient-to-r from-red-900/70 via-red-600 to-red-900/70 transform origin-left group-hover:scale-x-100 scale-x-0 transition-transform duration-300"></span>
                      
                      {/* Button text with subtle glow */}
                      <span className="relative z-10 inline-flex items-center group-hover:text-white transition-colors duration-300">
                        فروشگاه
                      </span>
                      
                      {/* Extra glow effect on hover */}
                      <motion.div 
                        className="absolute inset-0 pointer-events-none"
                        whileHover={{
                          boxShadow: "inset 0 0 8px rgba(239, 68, 68, 0.4)",
                        }}
                      />
                    </motion.button>
                  </motion.div>
                </Link>
              </motion.div>
            </div>
          </div>
        </motion.section>

        {/* Featured Products */}
        <motion.section 
          className="py-8 sm:py-10 md:py-12 bg-gradient-to-b from-charcoal to-midnight w-full relative overflow-hidden"
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
          
          {/* Subtle fog animations in background - Using will-change for performance */}
          <div className="absolute inset-0 z-[1] opacity-20" style={{ willChange: 'transform' }}>
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
                backgroundSize: '200% 200%',
                willChange: 'background-position'
              }}
            />
          </div>
          
          {/* Content container with enhanced styling */}
          <div className="relative z-10 container mx-auto px-4">
            <div className="mb-4 text-center">
              <h2 className="text-3xl md:text-4xl font-bold text-white text-shadow-horror mb-2">
                <span className="relative inline-block">
                  محصولات ویژه
                  <motion.span 
                    className="absolute -bottom-2 left-0 right-0 h-0.5 bg-draugr-500"
                    style={{ width: '100%' }}
                  ></motion.span>
                </span>
              </h2>
              <p className="text-gray-400 max-w-2xl mx-auto mb-2">محصولات برتر و منحصر به فرد ما را کشف کنید، هر کدام با ویژگی‌های خاص طراحی شده‌اند.</p>
            </div>
            
            {/* Ensure products are available before rendering slider 
                Apply key for proper remounting when props change */}
            {products && products.length > 0 && (
              <FeaturedProductSlider 
                key="featured-product-slider"
                products={products} 
                onAddToCart={addToCart} 
              />
            )}
            
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

        {/* Category Rows Section */}
        <motion.section 
          className="py-6 sm:py-8 md:py-10 w-full relative overflow-hidden"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true, margin: "-100px" }}
        >
          {/* Dynamic background effect */}
          <div className="absolute inset-0 z-0">
            {/* Runes floating in background */}
            <div className="absolute inset-0 opacity-10">
              {Array.from({ length: 15 }).map((_, i) => (
                <motion.div
                  key={`rune-${i}`}
                  className="absolute text-red-600 font-norse opacity-40"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    fontSize: `${Math.random() * 2 + 1.5}rem`,
                    transform: 'translateZ(0)'
                  }}
                  animate={{
                    y: [0, Math.random() * 15 - 7.5],
                    opacity: [0.2, 0.5, 0.2],
                    rotate: Math.random() * 20 - 10,
                  }}
                  transition={{
                    repeat: Infinity,
                    duration: 3 + Math.random() * 5,
                    ease: "easeInOut",
                    repeatType: "reverse"
                  }}
                >
                  {['ᚠ', 'ᚢ', 'ᚦ', 'ᚨ', 'ᚱ', 'ᚲ', 'ᚷ', 'ᚹ', 'ᚺ', 'ᚾ'][Math.floor(Math.random() * 10)]}
                </motion.div>
              ))}
            </div>
            
            {/* Ambient glow effects */}
            <motion.div 
              className="absolute inset-0 bg-gradient-radial from-red-900/10 to-transparent"
              style={{ 
                backgroundSize: '100% 100%',
                backgroundPosition: 'center',
                mixBlendMode: 'overlay'
              }}
              animate={{
                opacity: [0.3, 0.6, 0.3],
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                repeatType: "reverse",
                ease: "easeInOut",
              }}
            />
          </div>
          
          {/* Content container */}
          <div className="relative z-10 container mx-auto px-4">
            {/* Section header with enhanced 3D styling */}
            <motion.div 
              className="mb-8 text-center relative"
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, type: "spring", stiffness: 100 }}
            >
              {/* Background decorative ornament */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-24 -z-10">
                <svg viewBox="0 0 300 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full opacity-20">
                  <path d="M20,50 C20,50 50,20 150,20 C250,20 280,50 280,50 C280,50 250,80 150,80 C50,80 20,50 20,50 Z" stroke="#ef2336" strokeWidth="2" />
                  <path d="M30,50 C30,50 60,30 150,30 C240,30 270,50 270,50 C270,50 240,70 150,70 C60,70 30,50 30,50 Z" stroke="#ef2336" strokeWidth="1" />
                  <path d="M0,50 L20,50 M280,50 L300,50" stroke="#ef2336" strokeWidth="2" />
                  <circle cx="150" cy="50" r="5" fill="#ef2336" fillOpacity="0.5" />
                </svg>
              </div>
              
              <h2 className="text-4xl md:text-5xl font-bold text-white text-shadow-horror mb-4 relative inline-block">
                <motion.span 
                  className="relative inline-block perspective"
                  whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
                  style={{ 
                    textShadow: "0 0 10px rgba(239, 35, 60, 0.5), 0 0 20px rgba(239, 35, 60, 0.3)",
                    perspective: "1000px"
                  }}
                >
                  <motion.span 
                    className="inline-block"
                    animate={{
                      textShadow: [
                        "0 0 4px rgba(239, 35, 60, 0.5), 0 0 10px rgba(239, 35, 60, 0.3)",
                        "0 0 8px rgba(239, 35, 60, 0.7), 0 0 15px rgba(239, 35, 60, 0.5)",
                        "0 0 4px rgba(239, 35, 60, 0.5), 0 0 10px rgba(239, 35, 60, 0.3)"
                      ]
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  >
                    دسته‌بندی‌های محصولات
                  </motion.span>
                  
                  {/* Animated border effect */}
                  <motion.span 
                    className="absolute -bottom-2 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-red-600 to-transparent"
                    animate={{
                      backgroundPosition: ["200% 0", "-100% 0"],
                      opacity: [0.7, 1, 0.7]
                    }}
                    transition={{
                      duration: 5,
                      ease: "easeInOut",
                      repeat: Infinity
                    }}
                    style={{ 
                      width: '100%',
                      backgroundSize: "200% 100%"
                    }}
                  />
                </motion.span>
              </h2>
              
              <motion.p 
                className="text-gray-300 max-w-2xl mx-auto mb-2 text-lg"
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3, duration: 0.5 }}
              >
                <span className="text-red-400">مجموعه‌ای</span> از محصولات منحصر به فرد در دسته‌بندی‌های مختلف
              </motion.p>
              
              {/* Decorative divider */}
              <div className="flex items-center justify-center my-6">
                <div className="h-px w-16 bg-gradient-to-r from-transparent via-red-700 to-transparent"></div>
                <div className="mx-4 text-red-600 opacity-70">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 22L3 17V7L12 2L21 7V17L12 22Z" stroke="currentColor" strokeWidth="1.5" />
                    <path d="M12 22V12M12 12L3 7M12 12L21 7" stroke="currentColor" strokeWidth="1.5" />
                  </svg>
                </div>
                <div className="h-px w-16 bg-gradient-to-r from-red-700 via-red-700 to-transparent"></div>
              </div>
            </motion.div>
            
            {/* Categories wrapper with 3D perspective */}
            <div className="perspective-1000 w-full">
              {/* First row with enhanced effects */}
              <motion.div
                initial={{ opacity: 0, rotateX: 10 }}
                whileInView={{ opacity: 1, rotateX: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                viewport={{ once: true, margin: "-50px" }}
                className="mb-10 transform-gpu relative"
              >
                <CategoryRows 
                  direction="rtl" 
                  title="" 
                  subtitle=""
                  categoryItems={categories}
                />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-midnight opacity-40 pointer-events-none z-10"></div>
              </motion.div>
              
              {/* Second row with staggered animation */}
              <motion.div
                initial={{ opacity: 0, rotateX: -10 }}
                whileInView={{ opacity: 1, rotateX: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                viewport={{ once: true, margin: "-50px" }}
                className="mb-10 transform-gpu relative"
              >
                <CategoryRows 
                  direction="ltr" 
                  title="" 
                  subtitle=""
                  categoryItems={additionalCategories}
                />
                <div className="absolute inset-0 bg-gradient-to-b from-midnight via-transparent to-midnight opacity-40 pointer-events-none z-10"></div>
              </motion.div>
              
              {/* Third row with different animation */}
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                viewport={{ once: true, margin: "-50px" }}
                className="mb-10 transform-gpu relative"
              >
                <CategoryRows 
                  direction="rtl" 
                  title="" 
                  subtitle=""
                  categoryItems={thirdRowCategories}
                />
                <div className="absolute inset-0 bg-gradient-to-b from-midnight via-transparent to-midnight opacity-40 pointer-events-none z-10"></div>
              </motion.div>
              
              {/* Fourth row with fade in animation */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.8 }}
                viewport={{ once: true, margin: "-50px" }}
                className="transform-gpu"
              >
                <CategoryRows 
                  direction="ltr" 
                  title="" 
                  subtitle=""
                  categoryItems={fourthRowCategories}
                />
                <div className="absolute inset-0 bg-gradient-to-b from-midnight via-transparent to-transparent opacity-40 pointer-events-none z-10"></div>
              </motion.div>
            </div>
            
            {/* Bottom decorative element */}
            <motion.div 
              className="w-full max-w-4xl mx-auto mt-10 flex justify-center"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 1, duration: 0.5 }}
            >
              <Link to="/shop">
                <motion.button
                  className="group relative overflow-hidden text-lg font-medium text-white px-10 py-3"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {/* Background & border effects */}
                  <span className="absolute inset-0 bg-gradient-to-br from-red-900/70 to-red-950/90 z-0 rounded-md border border-red-800/50 transform transition-all duration-300 group-hover:shadow-[0_0_15px_rgba(239,35,54,0.5)]"></span>
                  
                  {/* Text with icon */}
                  <span className="relative z-10 flex items-center justify-center space-x-2">
                    <span>مشاهده تمام دسته‌بندی‌ها</span>
                    <svg className="w-5 h-5 mr-1" viewBox="0 0 24 24" fill="none">
                      <path d="M9 6L15 12L9 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </span>
                  
                  {/* Hover glow effect */}
                  <motion.span 
                    className="absolute inset-0 -z-10"
                    initial={{ opacity: 0 }}
                    whileHover={{ opacity: 1 }}
                    transition={{ duration: 0.2 }}
                  >
                    <span className="absolute inset-0 bg-gradient-to-r from-red-600/0 via-red-600/30 to-red-600/0 blur-md"></span>
                  </motion.span>
                  
                  {/* Corner accents */}
                  <span className="absolute top-0 left-0 w-2 h-2 border-t border-l border-red-500 opacity-70 group-hover:opacity-100 transition-opacity"></span>
                  <span className="absolute top-0 right-0 w-2 h-2 border-t border-r border-red-500 opacity-70 group-hover:opacity-100 transition-opacity"></span>
                  <span className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-red-500 opacity-70 group-hover:opacity-100 transition-opacity"></span>
                  <span className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-red-500 opacity-70 group-hover:opacity-100 transition-opacity"></span>
                </motion.button>
              </Link>
            </motion.div>
          </div>
        </motion.section>
      </motion.div>
    </>
  );
};

export default HomePage; 