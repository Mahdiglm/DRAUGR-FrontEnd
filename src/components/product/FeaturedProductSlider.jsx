import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ProductCard from './ProductCard';

const FeaturedProductSlider = ({ products, onAddToCart }) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [pages, setPages] = useState([]);
  const timerRef = useRef(null);
  const productsPerPage = 2;

  // Prepare pages
  useEffect(() => {
    if (!products || products.length === 0) return;
    
    const totalPages = Math.ceil(products.length / productsPerPage);
    const pagesArray = [];
    
    for (let i = 0; i < totalPages; i++) {
      const start = i * productsPerPage;
      const pageProducts = products.slice(start, start + productsPerPage);
      pagesArray.push(pageProducts);
    }
    
    setPages(pagesArray);
  }, [products]);

  // Auto-scroll logic
  useEffect(() => {
    if (pages.length <= 1) return;
    
    const autoScroll = () => {
      setCurrentPage((prevPage) => (prevPage + 1) % pages.length);
    };
    
    timerRef.current = setInterval(autoScroll, 5000);
    
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [pages]);

  // Manual navigation
  const goToPage = (pageIndex) => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    setCurrentPage(pageIndex);
    timerRef.current = setInterval(() => {
      setCurrentPage((prevPage) => (prevPage + 1) % pages.length);
    }, 5000);
  };

  if (!products || products.length === 0 || pages.length === 0) {
    return <div className="text-center py-8">محصولی برای نمایش وجود ندارد</div>;
  }

  return (
    <div className="relative w-full overflow-hidden py-12">
      {/* Main Slider */}
      <div className="relative h-auto md:h-[480px] w-full overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPage}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.7, ease: "easeInOut" }}
            className="w-full h-full flex flex-col md:flex-row gap-6 justify-center items-center"
          >
            {pages[currentPage].map((product) => (
              <motion.div
                key={product.id}
                className="w-full md:w-1/2 lg:w-2/5 xl:w-1/3 max-w-sm"
                whileHover={{ scale: 1.05, zIndex: 10 }}
                initial={{ scale: 0.9, filter: 'blur(0px)' }}
                animate={{ 
                  scale: 1, 
                  filter: 'blur(0px)',
                  transition: { 
                    duration: 1, 
                    ease: "easeOut" 
                  } 
                }}
              >
                <ProductCard product={product} onAddToCart={onAddToCart} isHighlighted={true} />
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Background Products (Blurred) */}
      <div className="absolute inset-0 -z-10 flex flex-wrap justify-center items-center opacity-30">
        {products.map((product, index) => {
          // Skip products currently in focus
          const currentProducts = pages[currentPage] || [];
          const isActive = currentProducts.some(p => p.id === product.id);
          
          if (isActive) return null;
          
          return (
            <motion.div
              key={`bg-${product.id}`}
              className="w-1/4 lg:w-1/5 p-2 transform"
              initial={{ filter: 'blur(4px)', scale: 0.7, opacity: 0.6 }}
              animate={{ 
                filter: 'blur(4px)', 
                scale: 0.7, 
                opacity: 0.6,
                x: (index % 5 - 2) * 10,
                y: (Math.floor(index / 5) - 1) * 10,
                rotate: (index % 2 === 0 ? 1 : -1) * (index % 5) * 2,
              }}
              transition={{ duration: 2 }}
            >
              <div className="opacity-60 grayscale">
                <ProductCard product={product} onAddToCart={null} isDisabled={true} />
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Pagination Controls */}
      {pages.length > 1 && (
        <div className="flex justify-center space-x-2 mt-6">
          {pages.map((_, index) => (
            <motion.button
              key={index}
              onClick={() => goToPage(index)}
              className={`w-3 h-3 rounded-full transition duration-300 ${
                currentPage === index ? 'bg-draugr-500 scale-125' : 'bg-gray-400'
              }`}
              whileHover={{ scale: 1.5 }}
              whileTap={{ scale: 0.9 }}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default FeaturedProductSlider; 