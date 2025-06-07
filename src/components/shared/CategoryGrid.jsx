import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import CategoryItem from './CategoryItem';
import { categories, additionalCategories, thirdRowCategories, fourthRowCategories } from '../../utils/mockData';

/**
 * CategoryGrid Component
 * 
 * Displays categories in a fixed 7x4 grid layout
 * No animation or scrolling - each item has a fixed position
 */

// Layout constants
const CARD_WIDTH = 280;
const CARD_HEIGHT = 140;
const CARD_GAP = 24;

// Mobile constants
const MOBILE_CARD_WIDTH = 160;
const MOBILE_CARD_HEIGHT = 100;
const MOBILE_CARD_GAP = 16;

// Mobile detection hook
const useMobileDetection = () => {
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 768px)');
    
    const handleMediaChange = (e) => {
      setIsMobile(e.matches);
    };
    
    setIsMobile(mediaQuery.matches);
    
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleMediaChange);
    } else {
      mediaQuery.addListener(handleMediaChange);
    }
    
    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener('change', handleMediaChange);
      } else {
        mediaQuery.removeListener(handleMediaChange);
      }
    };
  }, []);
  
  return isMobile;
};

const CategoryGrid = ({ title = "دسته‌بندی‌ها", subtitle = "مجموعه‌ای از محصولات منحصر به فرد در دسته‌بندی‌های مختلف" }) => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [animationPhase, setAnimationPhase] = useState(0);
  const isMobileDevice = useMobileDetection();
  const navigate = useNavigate();

  // Get card dimensions based on device
  const cardWidth = isMobileDevice ? MOBILE_CARD_WIDTH : CARD_WIDTH;
  const cardHeight = isMobileDevice ? MOBILE_CARD_HEIGHT : CARD_HEIGHT;
  const cardGap = isMobileDevice ? MOBILE_CARD_GAP : CARD_GAP;

  // Prepare all categories for the grid (7x4 = 28 positions total)
  const gridCategories = [];
  
  // Combine all category arrays and ensure we have exactly 28 items
  const allCategories = [...categories, ...additionalCategories, ...thirdRowCategories, ...fourthRowCategories];
  
  // If we have more than 28 categories, trim the array
  const trimmedCategories = allCategories.slice(0, 28);
  
  // If we have less than 28 categories, add more with new IDs
  if (trimmedCategories.length < 28) {
    const extraNeeded = 28 - trimmedCategories.length;
    for (let i = 0; i < extraNeeded; i++) {
      const sourceCategory = allCategories[i % allCategories.length];
      const newCategory = {
        ...sourceCategory,
        id: 100 + i,
        name: `${sourceCategory.name} ${i+1}`,
        slug: `${sourceCategory.slug}-${i+1}`
      };
      trimmedCategories.push(newCategory);
    }
  }
  
  // Create grid items
  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 7; col++) {
      const index = row * 7 + col;
      const category = trimmedCategories[index];
      
      // Add to grid with position data
      gridCategories.push({
        id: category.id,
        category,
        row,
        col
      });
    }
  }
  
  // Handle category selection with enhanced transition
  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    setIsTransitioning(true);
    setAnimationPhase(1);
    
    // Add a smooth page transition effect
    document.body.style.transition = 'opacity 0.5s ease-out';
    document.body.style.opacity = '0.8';
    
    // Navigate after a short delay to allow animation
    setTimeout(() => {
      navigate(`/category/${category.slug}`);
      
      // Reset state and body opacity after navigation
      setTimeout(() => {
        document.body.style.opacity = '1';
        setIsTransitioning(false);
        setSelectedCategory(null);
        setAnimationPhase(0);
      }, 600);
    }, 400);
  };

  return (
    <div 
      className="py-6 sm:py-8 md:py-10 relative overflow-hidden"
      role="region"
      aria-label="دسته‌بندی محصولات"
    >
      {/* Section header with title & subtitle */}
      {(title.trim() || subtitle.trim()) && (
        <div className="w-full mb-8 md:mb-10 px-4">
          <motion.div
            className="text-center mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {title && (
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-2 text-white">
                {title}
              </h2>
            )}
            {subtitle && (
              <p className="text-gray-400 max-w-2xl mx-auto">
                {subtitle}
              </p>
            )}
          </motion.div>
        </div>
      )}
      
      {/* Grid container - updated to fill full width */}
      <div className="relative w-full px-2">
        <div 
          className="relative grid-container w-full"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(7, 1fr)',
            gridTemplateRows: `repeat(4, ${cardHeight}px)`,
            gap: `${cardGap}px`,
            width: '100%'
          }}
        >
          {gridCategories.map((item) => (
            <CategoryItem 
              key={item.id} 
              category={item.category}
              style={{
                position: 'relative',
                width: '100%',
                height: `${cardHeight}px`,
                gridRow: item.row + 1,
                gridColumn: item.col + 1,
                zIndex: selectedCategory && selectedCategory.id === item.category.id ? 50 : 10
              }}
              cardWidth={cardWidth}
              cardHeight={cardHeight}
              isMobile={isMobileDevice}
              mobileHighlight={Math.random() < 0.15}
              mobileHighlightEdge={['top', 'right', 'bottom', 'left'][Math.floor(Math.random() * 4)]}
              mobileHighlightIntensity={Math.random() * 0.7 + 0.3}
              mobileHighlightPosition={Math.random()}
              onCategorySelect={handleCategorySelect}
              isSelected={selectedCategory && selectedCategory.id === item.category.id}
              isTransitioning={isTransitioning}
              animationPhase={animationPhase}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategoryGrid; 