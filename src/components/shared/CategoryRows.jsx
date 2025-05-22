/**
 * CategoryRows Component
 * 
 * Creates a horizontally scrolling category section with items that have
 * interactive proximity-based hover effects.
 */

import React, { useRef, useEffect, useState } from 'react';
import { motion, useAnimationControls } from 'framer-motion';
import { categories } from '../../utils/mockData';
import { getOptimizedAnimationSettings } from '../../utils/animationHelpers';

const CategoryRows = () => {
  const scrollRef = useRef(null);
  const containerRef = useRef(null);
  const [containerWidth, setContainerWidth] = useState(0);
  const [itemWidth, setItemWidth] = useState(0);
  const controls = useAnimationControls();
  
  // Duplicate categories multiple times to ensure we have enough for seamless scrolling
  const extendedCategories = [...categories, ...categories, ...categories, ...categories];
  
  // Control animation speed based on device performance
  const scrollSpeed = getOptimizedAnimationSettings(
    { duration: 30 }, // Default settings for high-performance devices
    { duration: 40 }  // Optimized settings for low-performance devices
  );

  // Setup scroll animation
  useEffect(() => {
    if (!containerRef.current || !scrollRef.current) return;
    
    // Get container dimensions
    const container = containerRef.current;
    const scrollContainer = scrollRef.current;
    
    // Function to measure container and item widths
    const measureWidths = () => {
      if (!container || !scrollContainer) return;
      
      setContainerWidth(container.offsetWidth);
      
      // Get the first category item if available
      const firstItem = scrollContainer.querySelector('[data-category-item]');
      if (firstItem) {
        // Include margins in width calculation
        const computedStyle = window.getComputedStyle(firstItem);
        const marginLeft = parseFloat(computedStyle.marginLeft);
        const marginRight = parseFloat(computedStyle.marginRight);
        setItemWidth(firstItem.offsetWidth + marginLeft + marginRight);
      }
    };
    
    // Initial measurement
    measureWidths();
    
    // Measure on resize
    window.addEventListener('resize', measureWidths);
    
    // Start scroll animation
    if (itemWidth > 0) {
      startScrollAnimation();
    }
    
    return () => {
      window.removeEventListener('resize', measureWidths);
    };
  }, [itemWidth]);
  
  // Start seamless scroll animation when dimensions are known
  useEffect(() => {
    if (itemWidth > 0) {
      startScrollAnimation();
    }
  }, [itemWidth]);
  
  // Function to start the seamless scroll animation
  const startScrollAnimation = () => {
    if (!scrollRef.current || itemWidth === 0) return;
    
    // Calculate how far to scroll (one item width)
    const scrollDistance = -itemWidth;
    
    const scroll = async () => {
      // Reset scroll position when we've moved all items
      const firstChild = scrollRef.current.firstChild;
      if (!firstChild) return;
      
      // Animate scroll by one item width
      await controls.start({
        x: scrollDistance,
        transition: {
          duration: scrollSpeed.duration / categories.length,
          ease: "linear"
        }
      });
      
      // Move the first item to the end
      firstChild.style.transform = 'none';
      scrollRef.current.appendChild(firstChild);
      
      // Reset position without animation
      await controls.set({ x: 0 });
      
      // Continue scrolling
      requestAnimationFrame(scroll);
    };
    
    scroll();
  };

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!containerRef.current) return;
      
      // Slightly adjust scroll speed based on mouse position
      const container = containerRef.current;
      const { left, width } = container.getBoundingClientRect();
      const mouseXRelative = (e.clientX - left) / width;
      
      // When mouse is on the right side, scroll slightly faster
      // When on the left, scroll slightly slower
      const speedFactor = 1 + (mouseXRelative - 0.5) * 0.3;
      
      // Update animation playback rate
      const scrollAnimations = container.getAnimations();
      scrollAnimations.forEach(animation => {
        animation.playbackRate = speedFactor;
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="py-8 sm:py-12 md:py-16 w-full relative overflow-hidden">
      <div className="container mx-auto px-4 mb-8">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-gray-100 mb-2">
          دسته‌بندی‌ها
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          مجموعه‌ای از محصولات منحصر به فرد در دسته‌بندی‌های مختلف
        </p>
      </div>
      
      <div 
        ref={containerRef}
        className="relative w-full overflow-hidden"
        style={{ 
          maskImage: 'linear-gradient(to right, transparent, black 5%, black 95%, transparent)',
          WebkitMaskImage: 'linear-gradient(to right, transparent, black 5%, black 95%, transparent)'
        }}
      >
        <motion.div
          ref={scrollRef}
          className="flex"
          animate={controls}
        >
          {extendedCategories.map((category, index) => (
            <CategoryItem 
              key={`${category.id}-${index}`} 
              category={category} 
              data-category-item="true"
            />
          ))}
        </motion.div>
      </div>
    </div>
  );
};

const CategoryItem = ({ category, ...props }) => {
  const itemRef = useRef(null);
  const [glowing, setGlowing] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  
  const handleMouseMove = (e) => {
    if (!itemRef.current) return;
    
    const rect = itemRef.current.getBoundingClientRect();
    
    // Calculate normalized position (0 to 1) within the element
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    
    // Set mouse position for gradient effect
    setMousePosition({ x, y });
    
    // Determine if mouse is close enough to trigger glow
    // Add padding to detect mouse slightly outside the element too
    const padding = 30; // px
    const isInProximity = 
      e.clientX >= rect.left - padding &&
      e.clientX <= rect.right + padding &&
      e.clientY >= rect.top - padding &&
      e.clientY <= rect.bottom + padding;
    
    setGlowing(isInProximity);
  };

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);
  
  // Calculate the gradient position based on mouse position
  const gradientPosition = {
    background: glowing 
      ? `radial-gradient(circle at ${mousePosition.x * 100}% ${mousePosition.y * 100}%, rgba(129, 140, 248, 0.8) 0%, rgba(129, 140, 248, 0) 60%)`
      : 'none'
  };

  return (
    <motion.div
      ref={itemRef}
      className="relative flex-shrink-0 mx-4 w-56 h-40 overflow-hidden rounded-xl cursor-pointer"
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
      {...props}
    >
      {/* Background card */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900 dark:from-gray-900 dark:to-black rounded-xl" />
      
      {/* Content */}
      <div className="relative z-10 h-full flex flex-col justify-center items-center p-4">
        <span className="text-xl font-bold text-white mb-2">{category.name}</span>
        <div className="text-indigo-300 text-sm">مشاهده محصولات</div>
      </div>
      
      {/* Glow effect wrapper */}
      <div 
        className="absolute inset-0 rounded-xl transition-opacity duration-300"
        style={{
          ...gradientPosition,
          opacity: glowing ? 1 : 0,
          pointerEvents: 'none'
        }}
      />
      
      {/* Border glow */}
      <div 
        className="absolute inset-0 rounded-xl pointer-events-none"
        style={{
          boxShadow: glowing ? '0 0 15px rgba(129, 140, 248, 0.5)' : 'none',
          transition: 'box-shadow 0.3s ease-out'
        }}
      />
    </motion.div>
  );
};

export default CategoryRows; 