import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { useOutletContext, Link } from 'react-router-dom';

import ProductList from '../product/ProductList';
import { products } from '../../utils/mockData';
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
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
  exit: {
    opacity: 0,
    transition: {
      staggerChildren: 0.05,
      staggerDirection: -1,
      duration: 0.2,
    },
  }
};

const letterVariants = {
  hidden: {
    opacity: 0,
    y: 30,
    rotateX: 70,
    filter: "blur(8px)",
  },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    rotateX: 0,
    filter: "blur(0px)",
    transition: {
      type: "spring",
      damping: 10,
      stiffness: 100,
      delay: i * 0.05,
    },
  }),
  exit: (i) => ({
    opacity: 0,
    y: -15,
    filter: "blur(8px)",
    transition: {
      duration: 0.2,
      delay: i * 0.02,
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
            duration: 1 + particle.velocity * 5,
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
  const [showIntro, setShowIntro] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [contentLoaded, setContentLoaded] = useState(false);
  
  // Handle initial loading - much faster now
  useEffect(() => {
    // Hide loader almost immediately
    const handleLoad = () => {
      // Ensure we start at the top of the page
      window.scrollTo(0, 0);
      
      // Very short timeout to ensure smoother transition
      setTimeout(() => {
        setIsLoading(false);
      }, 100);
    };

    // Check if the page is already loaded
    if (document.readyState === 'complete') {
      handleLoad();
    } else {
      window.addEventListener('load', handleLoad);
      return () => window.removeEventListener('load', handleLoad);
    }
  }, []);
  
  // Preload content in background while showing intro
  useEffect(() => {
    if (!isLoading && showIntro) {
      // Start loading content immediately in background
      const preloadTimer = setTimeout(() => {
        setContentLoaded(true);
      }, 500);
      
      return () => clearTimeout(preloadTimer);
    }
  }, [isLoading, showIntro]);
  
  // Handle intro completion - reduced to 2 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      // Force scroll to top before showing main content
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'auto'
      });
      
      // Set scroll behavior to auto for immediate scroll
      document.documentElement.style.scrollBehavior = 'auto';
      
      // Multiple scroll approaches for better cross-browser compatibility
      window.scrollTo(0, 0);
      document.body.scrollTop = 0;
      document.documentElement.scrollTop = 0;
      
      // Now transition to main content
      setShowIntro(false);
      
      // Reset scroll behavior after a short delay
      setTimeout(() => {
        document.documentElement.style.scrollBehavior = 'smooth';
      }, 50);
      
    }, 2000);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Add effect to ensure we're at the top when transitioning from intro to main content
  useEffect(() => {
    if (!showIntro) {
      // Force scroll to top immediately when main content appears
      window.scrollTo(0, 0);
      document.body.scrollTop = 0;
      document.documentElement.scrollTop = 0;
      
      // Prevent default scrollRestoration behavior
      if ('scrollRestoration' in history) {
        history.scrollRestoration = 'manual';
      }
    }
  }, [showIntro]);
  
  // Parallax effect
  const { scrollY } = useScroll();
  const backgroundY = useTransform(scrollY, [0, 500], [0, 100]);
  const textY = useTransform(scrollY, [0, 500], [0, -50]);
  const opacityHero = useTransform(scrollY, [0, 300], [1, 0.3]);

  // Default background in case the import fails
  const fallbackBg = "https://images.unsplash.com/photo-1508614589041-895b88991e3e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1920&q=80";

  return (
    <>
      {/* Initial loading overlay - faster disappearing */}
      <AnimatePresence>
        {isLoading && (
          <motion.div
            key="loader"
            className="fixed inset-0 z-[100] bg-black flex items-center justify-center"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <motion.div
              animate={{ 
                opacity: [0.5, 1, 0.5],
                scale: [0.9, 1.1, 0.9]
              }}
              transition={{ 
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut" 
              }}
              className="w-12 h-12 rounded-full border-t-2 border-r-2 border-draugr-500"
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Preload content in background (hidden) */}
      {contentLoaded && showIntro && (
        <div className="hidden">
          <img src={heroBackground} alt="preload hero" />
          <img src={mainBackground} alt="preload main" />
        </div>
      )}

      <AnimatePresence mode="wait">
        {showIntro ? (
          <motion.div
            key="intro"
            className="fixed inset-0 flex justify-center items-center z-50 bg-midnight"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Background pulse effect */}
            <motion.div
              className="absolute inset-0 bg-gradient-radial from-vampire-dark to-midnight opacity-40"
              animate={{ 
                scale: [1, 1.1, 1],
                opacity: [0.3, 0.4, 0.3]
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                repeatType: "reverse",
                ease: "easeInOut"
              }}
            />
            
            <Particles />
            
            {/* Vignette effect */}
            <div className="absolute inset-0 bg-radial-vignette pointer-events-none" />
            
            {/* Glitch overlay - subtle */}
            <motion.div 
              className="absolute inset-0 bg-noise opacity-8 mix-blend-overlay pointer-events-none"
              animate={{ opacity: [0.05, 0.08, 0.05] }}
              transition={{ duration: 1.5, repeat: Infinity }}
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
                <div key={index} className="relative mx-1 md:mx-3">
                  <motion.span
                    custom={index}
                    variants={letterVariants}
                    className="inline-block text-6xl md:text-9xl font-bold text-draugr-500 relative"
                    style={{ 
                      textShadow: '0 0 20px rgba(239,35,60,0.8), 0 0 30px rgba(239,35,60,0.4)',
                      transform: 'perspective(500px)'
                    }}
                  >
                    {letter}
                  </motion.span>
                </div>
              ))}
            </motion.div>
          </motion.div>
        ) : (
          <motion.div
            key="main-content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            onAnimationStart={() => {
              // Force scroll to top when animation starts
              window.scrollTo(0, 0);
              document.body.scrollTop = 0;
              document.documentElement.scrollTop = 0;
            }}
          >
            {/* Hero Section with Parallax */}
            <motion.section
              ref={heroRef}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.1 }}
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
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: 0.2 }}
                      className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6 text-shadow-horror"
                    >
                      <span className="text-draugr-500 font-bold text-shadow-horror">
                        اقلام خارق‌العاده را
                      </span> برای ماجراجویی خود کشف کنید
                    </motion.h1>
                    <motion.p
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: 0.3 }}
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
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
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
                <motion.div
                  initial={{ y: 30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                  className="mb-8 text-center"
                >
                  <h2 className="text-3xl md:text-4xl font-bold text-white text-shadow-horror mb-4">
                    <span className="relative inline-block">
                      محصولات ویژه
                      <motion.span 
                        className="absolute -bottom-2 left-0 right-0 h-0.5 bg-draugr-500"
                        initial={{ width: 0, left: '50%', right: '50%' }}
                        animate={{ width: '100%', left: 0, right: 0 }}
                        transition={{ delay: 0.3, duration: 0.5 }}
                      ></motion.span>
                    </span>
                  </h2>
                  <p className="text-gray-400 max-w-2xl mx-auto">محصولات برتر و منحصر به فرد ما را کشف کنید، هر کدام با ویژگی‌های خاص طراحی شده‌اند.</p>
                </motion.div>
                
                <ProductList 
                  products={products} 
                  onAddToCart={addToCart} 
                  title="" 
                />
                
                <div className="text-center mt-12">
                  <Link to="/shop">
                    <motion.button
                      whileHover={{ 
                        scale: 1.05, 
                        boxShadow: '0 0 20px rgba(255, 0, 0, 0.7)',
                      }}
                      whileTap={{ scale: 0.95 }}
                      className="bg-charcoal text-white font-medium px-8 py-3 rounded-md border border-draugr-700 shadow-horror"
                    >
                      مشاهده همه محصولات
                    </motion.button>
                  </Link>
                </div>
              </div>
            </motion.section>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default HomePage; 