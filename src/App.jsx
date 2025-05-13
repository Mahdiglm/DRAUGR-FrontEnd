import { useState, useEffect, useRef } from 'react'
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import './App.css'

// Components
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import ProductList from './components/product/ProductList';
import Cart from './components/cart/Cart';

// Data
import { products } from './utils/mockData';

// Assets
import heroBackground from './assets/Background-Hero.jpg';

function App() {
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const [message, setMessage] = useState('');
  const heroRef = useRef(null);
  
  // Parallax effect
  const { scrollY } = useScroll();
  const backgroundY = useTransform(scrollY, [0, 500], [0, 100]);
  const textY = useTransform(scrollY, [0, 500], [0, -50]);
  const opacityHero = useTransform(scrollY, [0, 300], [1, 0.3]);

  const addToCart = (product) => {
    setCartItems([...cartItems, product]);
    showTemporaryMessage(`${product.name} به سبد خرید اضافه شد`);
  };

  const removeFromCart = (productId) => {
    const product = cartItems.find(item => item.id === productId);
    setCartItems(cartItems.filter(item => item.id !== productId));
    if (product) {
      showTemporaryMessage(`${product.name} از سبد خرید حذف شد`);
    }
  };

  const toggleCart = () => {
    setIsCartOpen(!isCartOpen);
  };
  
  const showTemporaryMessage = (msg) => {
    setMessage(msg);
    setShowMessage(true);
    setTimeout(() => {
      setShowMessage(false);
    }, 3000);
  };
  
  // Apply theme class to body for consistency
  useEffect(() => {
    // Ensure only default theme class is applied
    document.body.classList.add('theme-draugr');
    
    // Clean up on unmount
    return () => {
      document.body.classList.remove('theme-draugr');
    };
  }, []);

  // Audio effect on page load
  useEffect(() => {
    const playSpookySound = () => {
      const audio = new Audio();
      audio.src = "https://www.soundjay.com/human/sounds/heartbeat-01.mp3"; // Heartbeat sound URL
      audio.volume = 0.2;
      audio.play().catch(e => console.log("Auto-play prevented:", e));
      
      // Event listener for user interaction to play sound
      const handleInteraction = () => {
        audio.play().catch(e => console.log("Play prevented:", e));
        document.removeEventListener('click', handleInteraction);
      };
      
      document.addEventListener('click', handleInteraction);
      
      return () => {
        audio.pause();
        audio.src = "";
        document.removeEventListener('click', handleInteraction);
      };
    };
    
    const cleanup = playSpookySound();
    return cleanup;
  }, []);

  return (
    <div className="w-full font-vazirmatn bg-midnight dark">
      <Header cartItems={cartItems} onCartClick={toggleCart} />
      
      <Cart 
        items={cartItems} 
        removeItem={removeFromCart} 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
      />

      {/* Floating Message */}
      <AnimatePresence>
        {showMessage && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-20 right-1/2 transform translate-x-1/2 bg-draugr-800 text-white px-6 py-3 rounded-md z-50 shadow-horror"
          >
            {message}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Section with Parallax */}
      <motion.section
        ref={heroRef}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="py-12 sm:py-16 md:py-20 w-full relative overflow-hidden"
        style={{ 
          minHeight: '80vh', 
          display: 'flex', 
          alignItems: 'center',
          backgroundImage: `url(${heroBackground})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        {/* Dark overlay for better text readability */}
        <div className="absolute inset-0 bg-black opacity-50"></div>

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
      >
        {/* Dark overlay with subtle texture */}
        <div className="absolute inset-0 bg-blood-texture opacity-15"></div>
        
        {/* Glowing border at top */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-draugr-800 to-transparent opacity-70"></div>
        
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
        
        {/* Glowing border at bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-draugr-800 to-transparent opacity-70"></div>
      </motion.section>
      
      <Footer />
      </div>
  )
}

export default App
