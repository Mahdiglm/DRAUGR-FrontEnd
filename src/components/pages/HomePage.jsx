import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useOutletContext } from 'react-router-dom';

import ProductList from '../product/ProductList';
import { products } from '../../utils/mockData';
// Try with relative path to asset folder
import heroBackground from '../../assets/Background-Hero.jpg';
import mainBackground from '../../assets/BackGround-Main.jpg';

const HomePage = () => {
  const { addToCart } = useOutletContext();
  const heroRef = useRef(null);
  
  // Parallax effect
  const { scrollY } = useScroll();
  const backgroundY = useTransform(scrollY, [0, 500], [0, 100]);
  const textY = useTransform(scrollY, [0, 500], [0, -50]);
  const opacityHero = useTransform(scrollY, [0, 300], [1, 0.3]);

  // Default background in case the import fails
  const fallbackBg = "https://images.unsplash.com/photo-1508614589041-895b88991e3e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1920&q=80";

  return (
    <>
      {/* Hero Section with Parallax */}
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
                transition={{ duration: 0.5, delay: 0.4 }}
                className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6 text-shadow-horror"
              >
                <span className="text-draugr-500 font-bold text-shadow-horror">
                  اقلام خارق‌العاده را
                </span> برای ماجراجویی خود کشف کنید
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                className="text-base sm:text-lg md:text-xl mb-6 sm:mb-8 text-gray-200 font-medium"
                style={{ textShadow: '0 1px 2px rgba(0, 0, 0, 0.8)' }}
              >
                مجموعه‌ی ما از آثار افسانه‌ای، سلاح‌ها و تجهیزات را کاوش کنید.
              </motion.p>
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
            </motion.div>
          </div>
        </div>
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
              <span className="relative inline-block">
                محصولات ویژه
                <motion.span 
                  className="absolute -bottom-2 left-0 right-0 h-0.5 bg-draugr-500"
                  initial={{ width: 0, left: '50%', right: '50%' }}
                  animate={{ width: '100%', left: 0, right: 0 }}
                  transition={{ delay: 0.5, duration: 0.8 }}
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
        </div>
      </motion.section>
    </>
  );
};

export default HomePage; 