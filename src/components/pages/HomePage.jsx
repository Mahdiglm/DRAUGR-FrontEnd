import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { useOutletContext, Link } from 'react-router-dom';

import ProductList from '../product/ProductList';
import FeaturedProductSlider from '../product/FeaturedProductSlider';
import CategoryGrid from '../shared/CategoryGrid';
import productService from '../../services/productService';
import { safeBlur, safeFilterTransition, isLowPerformanceDevice, getOptimizedAnimationSettings } from '../../utils/animationHelpers';
// Try with relative path to asset folder
import heroBackground from '../../assets/Background-Hero.jpg';
import mainBackground from '../../assets/BackGround-Main.jpg';

const HomePage = () => {
  const { addToCart } = useOutletContext();
  const heroRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLowPerformance, setIsLowPerformance] = useState(false);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);
  
  // Check device performance on mount
  useEffect(() => {
    setIsLowPerformance(isLowPerformanceDevice());
  }, []);
  
  // Fetch products from API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // Get all products
        const productsData = await productService.getProducts();
        
        // Handle both regular API response and mock data formats
        const products = Array.isArray(productsData) 
          ? productsData 
          : (productsData.products || []);
        
        setProducts(products);
        
        // For featured products, we'll just use the first 5 for now
        // In a real app, you might have a featured flag in the database
        setFeaturedProducts(products.slice(0, 5));
      } catch (err) {
        console.error('Error fetching products:', err);
        setError('خطا در دریافت محصولات');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProducts();
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
  }, []);
  
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

      {/* Main Content */}
      <div>
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

        {/* Featured Products Section */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 py-6">
          <h2 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 text-center text-white">
            محصولات <span className="text-draugr-500">ویژه</span>
          </h2>
          
          {error ? (
            <div className="text-center py-8">
              <p className="text-red-400">{error}</p>
            </div>
          ) : isLoading ? (
            <div className="text-center py-12">
              <div className="w-10 h-10 border-t-2 border-r-2 border-draugr-500 rounded-full animate-spin mx-auto"></div>
            </div>
          ) : (
            <FeaturedProductSlider products={featuredProducts} onAddToCart={addToCart} />
          )}
        </div>

        {/* Product Categories Grid */}
        <motion.section className="py-12 bg-gradient-to-b from-midnight to-charcoal">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-2xl sm:text-3xl font-bold mb-8 text-center text-white">
              دسته‌بندی‌های <span className="text-draugr-500">محبوب</span>
            </h2>
            <CategoryGrid />
          </div>
        </motion.section>

        {/* Featured Products List */}
        <motion.section className="py-12 bg-gradient-to-b from-charcoal to-midnight">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-center text-white">
              محصولات <span className="text-draugr-500">جدید</span>
            </h2>
            
            {error ? (
              <div className="text-center py-8">
                <p className="text-red-400">{error}</p>
              </div>
            ) : isLoading ? (
              <div className="text-center py-12">
                <div className="w-10 h-10 border-t-2 border-r-2 border-draugr-500 rounded-full animate-spin mx-auto"></div>
              </div>
            ) : (
              <ProductList products={products} onAddToCart={addToCart} />
            )}
          </div>
        </motion.section>
      </div>
    </>
  );
};

export default HomePage;
