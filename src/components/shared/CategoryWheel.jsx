import React, { useState, useRef, useEffect } from 'react';
import { motion, useAnimationControls, animate, useTime, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import { categories } from '../../utils/mockData';
import { isLowPerformanceDevice } from '../../utils/animationHelpers';

const CategoryWheel = () => {
  const [isLowPerformance, setIsLowPerformance] = useState(false);
  const containerRef = useRef(null);
  
  // Check device performance on mount
  useEffect(() => {
    setIsLowPerformance(isLowPerformanceDevice());
  }, []);
  
  // Category card icons
  const getCategoryIcon = (slug) => {
    switch (slug) {
      case 'weapons':
        return '⚔️';
      case 'armor':
        return '🛡️';
      case 'potions':
        return '🧪';
      case 'magic':
        return '✨';
      case 'accessories':
        return '📿';
      case 'rare_books':
        return '📚';
      default:
        return '🔍';
    }
  };

  return (
    <div className="py-12 relative" ref={containerRef}>
      <div className="text-center mb-12">
        <h2 className="text-2xl md:text-3xl font-bold text-white text-shadow-horror">دسته‌بندی‌ها</h2>
        <div className="h-1 w-24 bg-gradient-to-r from-draugr-900/40 via-draugr-500 to-draugr-900/40 mx-auto mt-2 rounded-full"></div>
      </div>
      
      {/* Outer wrapper with perspective 3D effect */}
      <div className="mx-auto relative w-full max-w-2xl" style={{ perspective: '1000px' }}>
        {/* Wheel container with better vertical spacing */}
        <div className="relative h-[320px] mx-auto select-none flex items-center justify-center">
          {/* Center point glow effect */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full bg-draugr-900/10 filter blur-md z-0">
            <motion.div 
              className="absolute inset-0 rounded-full bg-draugr-500/20"
              animate={{ 
                scale: [1, 1.3, 1],
                opacity: [0.3, 0.6, 0.3]
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          </div>
          
          {/* Circular path indicator */}
          <motion.div 
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[280px] h-[160px] border border-draugr-500/10 rounded-full opacity-30"
            style={{ transform: "rotateX(60deg)" }}
            animate={{ 
              borderColor: ['rgba(153, 0, 0, 0.1)', 'rgba(255, 0, 0, 0.2)', 'rgba(153, 0, 0, 0.1)']
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          
          {/* Background particles */}
          <BackgroundParticles isLowPerformance={isLowPerformance} />
          
          {/* Actual rotating categories */}
          <RotatingCategories 
            categories={categories} 
            isLowPerformance={isLowPerformance}
            getCategoryIcon={getCategoryIcon} 
          />
        </div>
      </div>
    </div>
  );
};

// Background particle effect
const BackgroundParticles = ({ isLowPerformance }) => {
  // Skip particles on low performance devices
  if (isLowPerformance) return null;
  
  // Generate fewer particles for better performance
  const particles = Array.from({ length: 12 }).map((_, i) => ({
    id: i,
    size: Math.random() * 2 + 1,
    duration: Math.random() * 15 + 10,
    delay: Math.random() * 5
  }));
  
  return (
    <div className="absolute inset-0 overflow-hidden z-0">
      {particles.map(particle => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full bg-draugr-500/20"
          style={{
            width: particle.size,
            height: particle.size,
            left: '50%',
            top: '50%',
          }}
          initial={{ 
            x: 0, 
            y: 0,
            scale: 0,
            opacity: 0
          }}
          animate={{
            x: [0, Math.sin(particle.id) * 130, 0],
            y: [0, Math.cos(particle.id) * 70, 0],
            scale: [0, 1, 0],
            opacity: [0, 0.8, 0]
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            delay: particle.delay,
            ease: "easeInOut"
          }}
        />
      ))}
    </div>
  );
};

// Separated rotating mechanism into its own component
const RotatingCategories = ({ categories, isLowPerformance, getCategoryIcon }) => {
  // Use Framer Motion's time utility for continuous animation
  const time = useTime();
  // Transform time to rotation (slower or faster based on performance)
  const rotation = useTransform(
    time,
    (value) => value / (isLowPerformance ? 20000 : 15000) * Math.PI * 2
  );
  
  return (
    <motion.div
      className="relative w-full h-full"
      style={{ 
        transformStyle: "preserve-3d",
        transform: "rotateX(20deg)"
      }}
    >
      {categories.map((category, index) => (
        <CategoryItem 
          key={category.id}
          category={category}
          index={index}
          totalItems={categories.length}
          rotation={rotation}
          getCategoryIcon={getCategoryIcon}
          isLowPerformance={isLowPerformance}
        />
      ))}
    </motion.div>
  );
};

const CategoryItem = ({ category, index, totalItems, rotation, getCategoryIcon, isLowPerformance }) => {
  // Calculate position on ellipse with larger dimensions
  const ellipseA = 140; // horizontal radius - slightly larger
  const ellipseB = 80;  // vertical radius - slightly larger
  
  // Calculate the position dynamically based on rotation
  const angle = useTransform(
    rotation,
    (r) => ((index / totalItems) * 2 * Math.PI) + r
  );
  
  // Create reactive values for x, y, and scale
  const x = useTransform(
    angle,
    (a) => ellipseA * Math.cos(a)
  );
  
  const y = useTransform(
    angle,
    (a) => ellipseB * Math.sin(a)
  );
  
  // Enhanced 3D effect with z-axis
  const z = useTransform(
    y,
    [-ellipseB, ellipseB],
    [40, -40]
  );
  
  // Larger scale difference for more dramatic effect
  const scale = useTransform(
    y,
    [-ellipseB, 0, ellipseB],
    [1.2, 0.95, 0.7]
  );
  
  const brightness = useTransform(
    y,
    [-ellipseB, ellipseB],
    [1.1, 0.6] // Enhanced contrast
  );
  
  const zIndex = useTransform(
    y,
    [-ellipseB, ellipseB],
    [100, 1]
  );
  
  // Rotation effect as items move around the ellipse
  const rotateY = useTransform(
    x,
    [-ellipseA, 0, ellipseA],
    [15, 0, -15] // Slight rotation for 3D effect
  );
  
  // Determine if this item is at the front (bottom of ellipse)
  const isFront = useTransform(
    y,
    (yValue) => yValue < -ellipseB * 0.75
  );
  
  // Hover state for interaction
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <motion.div
      style={{
        position: 'absolute',
        left: '50%',
        top: '50%',
        x,
        y,
        z,
        rotateY,
        scale,
        zIndex,
        filter: useTransform(brightness, (b) => `brightness(${b})`),
        transformStyle: "preserve-3d"
      }}
      className="absolute origin-center cursor-pointer"
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      whileHover={{ scale: useTransform(scale, s => s * 1.1) }}
    >
      <Link 
        to={`/shop?category=${category.slug}`}
        className="flex flex-col items-center justify-center h-24 w-24 md:h-28 md:w-28 rounded-2xl backdrop-blur-md bg-gradient-to-br from-gray-900/70 to-black/70 shadow-md relative overflow-hidden"
      >
        {/* Glowing border */}
        <motion.div
          style={{
            borderColor: useTransform(isFront, (front) => 
              front ? 'rgba(255, 0, 0, 0.4)' : 'rgba(75, 75, 75, 0.3)'
            ),
            borderWidth: useTransform(isFront, (front) => front ? '2px' : '1px'),
            boxShadow: useTransform(isFront, (front) => 
              front ? '0 0 15px rgba(255, 0, 0, 0.3), inset 0 0 5px rgba(255, 0, 0, 0.2)' : 'none'
            ),
            background: useTransform(isFront, (front) => 
              front ? 'linear-gradient(135deg, rgba(153, 0, 0, 0.8), rgba(102, 0, 0, 0.8))' : 'none'
            ),
          }}
          className="absolute inset-0 rounded-2xl"
        />
        
        {/* Animated highlight effect on hover */}
        {!isLowPerformance && (
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0"
            animate={isHovered ? {
              opacity: [0, 0.15, 0],
              left: ['-100%', '100%', '100%']
            } : {}}
            transition={isHovered ? {
              duration: 1,
              ease: "easeOut",
              times: [0, 0.5, 0.5001]
            } : {}}
          />
        )}
        
        {/* Icon with subtle floating animation */}
        <motion.div 
          className="text-3xl mb-1 relative z-10"
          animate={
            isHovered && !isLowPerformance ? 
            { y: [0, -4, 0], scale: [1, 1.1, 1] } : 
            {}
          }
          transition={
            isHovered && !isLowPerformance ?
            { duration: 1, ease: "easeInOut", repeat: Infinity } :
            {}
          }
        >
          {getCategoryIcon(category.slug)}
        </motion.div>
        
        {/* Category name with glow effect */}
        <motion.span 
          className="text-sm md:text-base font-medium relative z-10"
          style={{
            color: useTransform(isFront, (front) => 
              front ? 'rgba(255, 255, 255, 1)' : 'rgba(210, 210, 210, 0.8)'
            ),
            textShadow: useTransform(isFront, (front) => 
              front ? '0 0 8px rgba(255, 50, 50, 0.4)' : 'none'
            )
          }}
        >
          {category.name}
        </motion.span>
        
        {/* Top accent corner */}
        <motion.div
          className="absolute top-0 right-0 w-4 h-4 border-t border-r rounded-tr"
          style={{
            borderColor: useTransform(isFront, (front) => 
              front ? 'rgba(255, 0, 0, 0.6)' : 'rgba(75, 75, 75, 0.2)'
            ),
            opacity: useTransform(isFront, (front) => front ? 1 : 0.5)
          }}
        />
        
        {/* Bottom accent corner */}
        <motion.div
          className="absolute bottom-0 left-0 w-4 h-4 border-b border-l rounded-bl"
          style={{
            borderColor: useTransform(isFront, (front) => 
              front ? 'rgba(255, 0, 0, 0.6)' : 'rgba(75, 75, 75, 0.2)'
            ),
            opacity: useTransform(isFront, (front) => front ? 1 : 0.5)
          }}
        />
      </Link>
    </motion.div>
  );
};

export default CategoryWheel; 