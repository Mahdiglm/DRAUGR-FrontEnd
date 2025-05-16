import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { useOutletContext, Link } from 'react-router-dom';

import ProductList from '../product/ProductList';
import FeaturedProductSlider from '../product/FeaturedProductSlider';
import HeroSection from '../layout/HeroSection';
import { products } from '../../utils/mockData';
import { safeBlur, safeFilterTransition } from '../../utils/animationHelpers';
// Try with relative path to asset folder
// import heroBackground from '../../assets/Background-Hero.jpg';
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
  // const heroRef = useRef(null);
  const [showIntro, setShowIntro] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  // For testing - reset intro animation
  const resetIntroAnimation = () => {
    localStorage.removeItem('hasSeenDraugrIntro');
    window.location.reload();
  };
  
  useEffect(() => {
    const hasSeenIntro = localStorage.getItem('hasSeenDraugrIntro');
    if (hasSeenIntro) {
      setShowIntro(false);
      setIsLoading(false);
    } else {
      setShowIntro(true);
    }
  }, []);
  
  useEffect(() => {
    window.scrollTo(0, 0);
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }
    setIsLoading(false);
  }, []);
  
  useEffect(() => {
    if (!showIntro) return;
    const timer = setTimeout(() => {
      setIsExiting(true);
      setTimeout(() => {
        window.scrollTo(0, 0);
        document.body.scrollTop = 0;
        document.documentElement.scrollTop = 0;
        setShowIntro(false);
        localStorage.setItem('hasSeenDraugrIntro', 'true');
      }, 600);
    }, 1000);
    return () => clearTimeout(timer);
  }, [showIntro]);
  
  // Parallax effect - remove if not used elsewhere
  // const { scrollY } = useScroll();
  // const backgroundY = useTransform(scrollY, [0, 500], [0, 100]);
  // const textY = useTransform(scrollY, [0, 500], [0, -50]);
  // const opacityHero = useTransform(scrollY, [0, 300], [1, 0.3]);

  // Default background in case the import fails - remove if not used
  // const fallbackBg = "https://images.unsplash.com/photo-1508614589041-895b88991e3e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1920&q=80";

  // Preload all images immediately
  useEffect(() => {
    // const preloadImages = [heroBackground, mainBackground];
    const preloadImages = [mainBackground];
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
        style={{ opacity: showIntro ? 0 : 1 }}
        animate={{ opacity: showIntro ? 0 : 1, y: showIntro ? 20 : 0, scale: showIntro ? 0.98 : 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
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
        
        {/* New Hero Section */}
        <HeroSection />

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
    </>
  );
};

export default HomePage; 