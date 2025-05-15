import React, { useRef, useEffect, useState } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { useOutletContext, Link } from 'react-router-dom';

import ProductList from '../product/ProductList';
import { products } from '../../utils/mockData';
// Try with relative path to asset folder
import heroBackground from '../../assets/Background-Hero.jpg';
import mainBackground from '../../assets/BackGround-Main.jpg';

// Custom particle component for the hero section
const Particle = ({ children }) => {
  const [particles, setParticles] = useState([]);
  
  useEffect(() => {
    // Generate random particles
    const newParticles = Array.from({ length: 50 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 4 + 1,
      duration: Math.random() * 20 + 10,
      delay: Math.random() * 5,
      opacity: Math.random() * 0.5 + 0.1
    }));
    setParticles(newParticles);
  }, []);
  
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map(particle => (
        <motion.div
          key={particle.id}
          className="absolute bg-draugr-500 rounded-full z-0"
          initial={{ 
            x: `${particle.x}%`,
            y: `${particle.y}%`,
            opacity: 0,
            scale: 0
          }}
          animate={{ 
            y: [`${particle.y}%`, `${particle.y - 20}%`, `${particle.y}%`],
            opacity: [0, particle.opacity, 0],
            scale: [0, 1, 0]
          }}
          transition={{ 
            duration: particle.duration,
            delay: particle.delay,
            repeat: Infinity,
            ease: "easeInOut" 
          }}
          style={{
            width: particle.size,
            height: particle.size,
            filter: 'blur(1px)'
          }}
        />
      ))}
      {children}
    </div>
  );
};

const HomePage = () => {
  const { addToCart } = useOutletContext();
  const heroRef = useRef(null);
  const [scrolled, setScrolled] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  
  // Parallax effect
  const { scrollY } = useScroll();
  const backgroundY = useTransform(scrollY, [0, 500], [0, 100]);
  const textY = useTransform(scrollY, [0, 500], [0, -50]);
  const opacityHero = useTransform(scrollY, [0, 300], [1, 0.3]);
  const scale = useTransform(scrollY, [0, 300], [1, 0.95]);

  // Handle mouse movement for 3D effect
  useEffect(() => {
    const handleMouseMove = (e) => {
      const { clientX, clientY } = e;
      const x = (clientX / window.innerWidth) - 0.5;
      const y = (clientY / window.innerHeight) - 0.5;
      setMousePosition({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Handle scroll for effects
  useEffect(() => {
    const handleScroll = () => {
      const position = window.scrollY;
      if (position > 100) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Default background in case the import fails
  const fallbackBg = "https://images.unsplash.com/photo-1508614589041-895b88991e3e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1920&q=80";

  // Dynamic background style with 3D effect
  const heroBackgroundStyle = {
    transform: `perspective(1000px) rotateX(${mousePosition.y * 5}deg) rotateY(${-mousePosition.x * 5}deg) translateZ(0px)`,
    transition: 'transform 0.2s ease-out',
  };

  return (
    <>
      {/* Hero Section with Advanced Effects */}
      <motion.section
        ref={heroRef}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="py-12 sm:py-16 md:py-20 w-full relative overflow-hidden"
        style={{ 
          minHeight: '93.4vh', 
          display: 'flex', 
          alignItems: 'center',
          position: 'relative'
        }}
      >
        {/* Background with parallax and 3D effect */}
        <motion.div 
          className="absolute inset-0 z-0 overflow-hidden"
          style={{ 
            y: backgroundY
          }}
        >
          <motion.div
            className="absolute inset-0 w-[110%] h-[110%] -top-[5%] -left-[5%]"
            style={{
              backgroundImage: `url(${heroBackground || fallbackBg})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              ...heroBackgroundStyle
            }}
          />
          
          {/* Interactive blood veins overlay */}
          <motion.div 
            className="absolute inset-0 opacity-20 z-1"
            style={{
              backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'100%25\' height=\'100%25\'%3E%3Cdefs%3E%3ClinearGradient id=\'a\' x1=\'0%25\' y1=\'0%25\' x2=\'100%25\' y2=\'100%25\'%3E%3Cstop offset=\'0%25\' stop-color=\'%23330000\' stop-opacity=\'0\'/%3E%3Cstop offset=\'50%25\' stop-color=\'%23990000\' stop-opacity=\'.1\'/%3E%3Cstop offset=\'100%25\' stop-color=\'%23330000\' stop-opacity=\'0\'/%3E%3C/linearGradient%3E%3C/defs%3E%3Cfilter id=\'b\'%3E%3CfeTurbulence baseFrequency=\'.05\' numOctaves=\'2\' seed=\'5\'/%3E%3CfeDisplacementMap in=\'SourceGraphic\' scale=\'20\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' fill=\'url(%23a)\' filter=\'url(%23b)\'/%3E%3C/svg%3E")',
              ...heroBackgroundStyle
            }}
            animate={{ 
              backgroundPosition: ['0% 0%', '100% 100%'] 
            }}
            transition={{ 
              duration: 30, 
              ease: "linear", 
              repeat: Infinity, 
              repeatType: "reverse" 
            }}
          />
        </motion.div>

        {/* Particle effects */}
        <Particle>
          {/* Additional floating elements */}
          {[...Array(10)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full bg-draugr-500 opacity-60 z-0"
              style={{
                width: Math.random() * 100 + 50,
                height: Math.random() * 100 + 50,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                filter: 'blur(40px)'
              }}
              animate={{
                x: [0, Math.random() * 50 - 25],
                y: [0, Math.random() * 50 - 25],
                opacity: [0.2, 0.6, 0.2]
              }}
              transition={{
                duration: Math.random() * 10 + 15,
                repeat: Infinity,
                repeatType: "reverse",
                ease: "easeInOut"
              }}
            />
          ))}
        </Particle>

        {/* Dark overlay with animated noise texture */}
        <motion.div 
          className="absolute inset-0 bg-black opacity-50 z-1"
          initial={{ opacity: 0.5 }}
          animate={{ opacity: scrolled ? 0.7 : 0.5 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'a\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.005\' numOctaves=\'2\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23a)\'/%3E%3C/svg%3E")'
            }}
            animate={{ 
              scale: [1, 1.05, 1],
              opacity: [0.1, 0.15, 0.1] 
            }}
            transition={{ 
              duration: 8, 
              ease: "easeInOut", 
              repeat: Infinity 
            }}
          />
        </motion.div>

        {/* Bottom gradient overlay for smooth transition */}
        <div 
          className="absolute bottom-0 left-0 right-0 h-32 z-10" 
          style={{
            background: 'linear-gradient(to bottom, transparent, rgba(0, 0, 0, 0.95))',
            pointerEvents: 'none'
          }}
        ></div>

        {/* Illuminated border effect */}
        <motion.div
          className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-draugr-500 to-transparent z-10"
          animate={{ 
            opacity: [0.2, 0.8, 0.2],
            backgroundPosition: ['0% 0%', '100% 0%']
          }}
          transition={{ 
            duration: 8, 
            ease: "easeInOut", 
            repeat: Infinity 
          }}
        />
        
        <motion.div
          className="absolute inset-y-0 right-0 w-[1px] bg-gradient-to-b from-transparent via-draugr-500 to-transparent z-10"
          animate={{ 
            opacity: [0.2, 0.8, 0.2],
            backgroundPosition: ['0% 0%', '0% 100%']
          }}
          transition={{ 
            duration: 10, 
            ease: "easeInOut", 
            repeat: Infinity,
            delay: 1
          }}
        />
        
        <motion.div
          className="absolute inset-x-0 bottom-0 h-[1px] bg-gradient-to-r from-transparent via-draugr-500 to-transparent z-10"
          animate={{ 
            opacity: [0.2, 0.8, 0.2],
            backgroundPosition: ['100% 0%', '0% 0%']
          }}
          transition={{ 
            duration: 8, 
            ease: "easeInOut", 
            repeat: Infinity,
            delay: 2
          }}
        />
        
        <motion.div
          className="absolute inset-y-0 left-0 w-[1px] bg-gradient-to-b from-transparent via-draugr-500 to-transparent z-10"
          animate={{ 
            opacity: [0.2, 0.8, 0.2],
            backgroundPosition: ['0% 100%', '0% 0%']
          }}
          transition={{ 
            duration: 10, 
            ease: "easeInOut", 
            repeat: Infinity,
            delay: 3
          }}
        />

        <div className="w-full flex justify-center items-center">
          <div className="max-w-7xl mx-auto px-4 relative z-10 text-center">
            <motion.div
              className="max-w-3xl mx-auto py-4 relative"
              style={{ 
                y: textY, 
                opacity: opacityHero,
                scale,
                transform: `perspective(1000px) rotateX(${-mousePosition.y * 2}deg) rotateY(${mousePosition.x * 2}deg)`
              }}
            >
              {/* Glowing backdrop effect */}
              <motion.div
                className="absolute -inset-1 rounded-lg z-0 opacity-70"
                style={{ 
                  background: 'radial-gradient(circle, rgba(239,35,60,0.15) 0%, transparent 70%)',
                  filter: 'blur(20px)'
                }}
                animate={{ 
                  scale: [1, 1.2, 1],
                  opacity: [0.5, 0.7, 0.5]
                }}
                transition={{ 
                  duration: 5, 
                  repeat: Infinity,
                  repeatType: "reverse" 
                }}
              />
              
              {/* Animated text with character-by-character animation */}
              <motion.h1 
                className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6 text-shadow-horror relative"
              >
                {/* Replace character-by-character animation with a word-by-word approach that preserves Persian text */}
                <motion.span 
                  className="relative block text-draugr-500"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ 
                    duration: 0.8, 
                    delay: 0.2,
                    ease: [0.2, 0.65, 0.3, 0.9]
                  }}
                  style={{
                    textShadow: '0 0 8px rgba(239,35,60,0.8)',
                    display: 'inline-block'
                  }}
                >
                  اقلام خارق‌العاده را
                </motion.span>{' '}
                <motion.span
                  className="relative text-white"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ 
                    duration: 0.8, 
                    delay: 0.5,
                    ease: [0.2, 0.65, 0.3, 0.9]
                  }}
                  style={{
                    textShadow: '0 1px 2px rgba(0,0,0,0.8)',
                    display: 'inline-block'
                  }}
                >
                  برای ماجراجویی خود کشف کنید
                </motion.span>
                
                {/* Animated underline - keep this */}
                <motion.span 
                  className="absolute -bottom-2 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-draugr-500 to-transparent"
                  initial={{ width: 0, left: '50%', right: '50%', opacity: 0 }}
                  animate={{ width: '100%', left: 0, right: 0, opacity: 1 }}
                  transition={{ delay: 1.2, duration: 1 }}
                />
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 1.5 }}
                className="text-base sm:text-lg md:text-xl mb-6 sm:mb-8 text-gray-200 font-medium"
                style={{ textShadow: '0 1px 2px rgba(0, 0, 0, 0.8)' }}
              >
                مجموعه‌ی ما از آثار افسانه‌ای، سلاح‌ها و تجهیزات را کاوش کنید.
              </motion.p>

              {/* Enhanced CTA button */}
              <Link to="/shop">
                <motion.button
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 1.7 }}
                  whileHover={{ 
                    scale: 1.05, 
                    boxShadow: '0 0 30px rgba(239,35,60,0.7)',
                  }}
                  whileTap={{ scale: 0.95 }}
                  className="relative bg-gradient-to-r from-draugr-800 to-draugr-600 text-white font-medium text-sm sm:text-base px-8 sm:px-10 py-3 sm:py-4 rounded-md border border-draugr-500 overflow-hidden group"
                >
                  {/* Button glow effect */}
                  <motion.span 
                    className="absolute inset-0 w-full h-full bg-gradient-to-r from-draugr-500/0 via-draugr-500/40 to-draugr-500/0"
                    initial={{ x: '-100%' }}
                    animate={{ x: '200%' }}
                    transition={{ 
                      repeat: Infinity, 
                      duration: 2.5,
                      ease: "linear",
                      repeatDelay: 1
                    }}
                  />
                  <span className="relative z-10 inline-block">
                    فروشگاه
                  </span>
                  <motion.span
                    className="absolute -inset-1 rounded opacity-30 bg-draugr-500 z-0"
                    animate={{ 
                      opacity: [0.2, 0.4, 0.2] 
                    }}
                    transition={{ 
                      duration: 2,
                      repeat: Infinity,
                      repeatType: "reverse" 
                    }}
                    style={{ filter: 'blur(8px)' }}
                  />
                </motion.button>
              </Link>
              
              {/* Floating decorative elements */}
              <motion.div
                className="absolute -right-20 top-1/2 w-16 h-16 opacity-70 hidden md:block"
                animate={{ 
                  y: [0, -20, 0],
                  rotate: [0, 5, 0, -5, 0],
                  opacity: [0.3, 0.7, 0.3]
                }}
                transition={{ 
                  duration: 8,
                  repeat: Infinity,
                  repeatType: "reverse" 
                }}
              >
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full text-draugr-500">
                  <path d="M12 1L15.5 8.5H19.5L14 13L16 21L12 17L8 21L10 13L4.5 8.5H8.5L12 1Z" stroke="currentColor" strokeWidth="2" />
                </svg>
              </motion.div>
              
              <motion.div
                className="absolute -left-16 top-1/4 w-12 h-12 opacity-70 hidden md:block"
                animate={{ 
                  y: [0, 15, 0],
                  rotate: [0, -5, 0, 5, 0],
                  opacity: [0.3, 0.6, 0.3]
                }}
                transition={{ 
                  duration: 6,
                  repeat: Infinity,
                  repeatType: "reverse",
                  delay: 1
                }}
              >
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full text-draugr-500">
                  <path d="M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" />
                  <path d="M12 7V12L15 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </motion.div>
            </motion.div>
          </div>
        </div>
        
        {/* Scroll indicator */}
        <motion.div 
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 flex flex-col items-center"
          initial={{ opacity: 0, y: -10 }}
          animate={{ 
            opacity: [0, 1, 0],
            y: [0, 10, 0]
          }}
          transition={{ 
            duration: 2,
            repeat: Infinity,
            repeatDelay: 0.5
          }}
        >
          <span className="text-white text-sm mb-2 opacity-80">پایین بکشید</span>
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-5 w-5 text-draugr-500"
            viewBox="0 0 20 20" 
            fill="currentColor"
          >
            <path 
              fillRule="evenodd" 
              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" 
              clipRule="evenodd" 
            />
          </svg>
        </motion.div>
      </motion.section>

      {/* Featured Products */}
      <motion.section 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2 }}
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
            transition={{ delay: 0.3, duration: 0.8 }}
            className="mb-8 text-center"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white text-shadow-horror mb-4">
              <motion.span 
                className="relative inline-block"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                محصولات ویژه
                <motion.span 
                  className="absolute -bottom-2 left-0 right-0 h-0.5 bg-draugr-500"
                  initial={{ width: 0, left: '50%', right: '50%', opacity: 0 }}
                  animate={{ width: '100%', left: 0, right: 0, opacity: 1 }}
                  transition={{ delay: 0.5, duration: 0.8 }}
                ></motion.span>
              </motion.span>
            </h2>
            <motion.p 
              className="text-gray-400 max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              محصولات برتر و منحصر به فرد ما را کشف کنید، هر کدام با ویژگی‌های خاص طراحی شده‌اند.
            </motion.p>
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
    </>
  );
};

export default HomePage; 