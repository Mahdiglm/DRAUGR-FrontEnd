import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';

// Special offer data - can be expanded or connected to an API
const SPECIAL_OFFERS = [
  {
    id: 1,
    text: "تخفیف ۵۰٪ روی محصولات خون‌آشامی - فقط امروز!",
    link: "/special-offers",
    color: "bg-gradient-to-r from-draugr-900 to-draugr-700"
  },
  {
    id: 2,
    text: "فقط تا نیمه‌شب: ست‌های ویژه هالووین با ۳۰٪ تخفیف",
    link: "/special-offers",
    color: "bg-gradient-to-r from-black to-draugr-950"
  },
  {
    id: 3,
    text: "آخرین موجودی ویجا بوردهای اصل - تا اتمام موجودی",
    link: "/special-offers",
    color: "bg-gradient-to-r from-draugr-950 to-black"
  }
];

const SpecialOffersBanner = () => {
  const [currentOfferIndex, setCurrentOfferIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [isDismissed, setIsDismissed] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  
  // Auto rotate between offers
  useEffect(() => {
    if (isDismissed || isHovered) return;
    
    const interval = setInterval(() => {
      setIsVisible(false);
      
      // Wait for exit animation, then change the offer
      setTimeout(() => {
        setCurrentOfferIndex((prevIndex) => (prevIndex + 1) % SPECIAL_OFFERS.length);
        setIsVisible(true);
      }, 500);
    }, 5000);
    
    return () => clearInterval(interval);
  }, [isDismissed, isHovered]);
  
  // Handle dismiss
  const handleDismiss = () => {
    setIsVisible(false);
    
    // Wait for exit animation, then fully hide
    setTimeout(() => {
      setIsDismissed(true);
    }, 300);
  };
  
  if (isDismissed) return null;
  
  const currentOffer = SPECIAL_OFFERS[currentOfferIndex];
  
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div 
          className={`relative w-full py-2 text-white ${currentOffer.color}`}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Blood drip elements on both sides */}
          <div className="absolute -bottom-4 left-[10%] w-0.5 h-4 bg-draugr-500 rounded-b-full opacity-70"></div>
          <div className="absolute -bottom-6 left-[30%] w-0.5 h-6 bg-draugr-500 rounded-b-full opacity-50"></div>
          <div className="absolute -bottom-5 left-[50%] w-0.5 h-5 bg-draugr-500 rounded-b-full opacity-60"></div>
          <div className="absolute -bottom-7 left-[70%] w-0.5 h-7 bg-draugr-500 rounded-b-full opacity-80"></div>
          <div className="absolute -bottom-3 left-[90%] w-0.5 h-3 bg-draugr-500 rounded-b-full opacity-40"></div>
          
          {/* Content */}
          <div className="container mx-auto px-4 flex items-center justify-between">
            <div className="w-8">
              {/* Left spacer */}
            </div>
            
            <Link 
              to={currentOffer.link}
              className="flex-1 text-center font-medium hover:text-draugr-300 transition-colors"
            >
              <motion.span 
                className="inline-block"
                initial={{ opacity: 0.8 }}
                animate={{ opacity: 1 }}
                whileHover={{ scale: 1.03 }}
              >
                {/* Pulsing bullet point */}
                <span className="inline-block h-2 w-2 bg-draugr-500 rounded-full mr-2 animate-pulse"></span>
                
                {currentOffer.text}
                
                {/* Call to action */}
                <span className="mr-2 text-draugr-300 font-bold hover:underline">
                  مشاهده
                </span>
              </motion.span>
            </Link>
            
            {/* Close button */}
            <motion.button
              onClick={handleDismiss}
              className="text-white/80 hover:text-white w-8 h-8 flex items-center justify-center rounded-full hover:bg-black/20 transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              aria-label="بستن"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </motion.button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SpecialOffersBanner; 