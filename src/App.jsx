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

function App() {
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const [message, setMessage] = useState('');
  const [floatingEmojis, setFloatingEmojis] = useState([]);
  const heroRef = useRef(null);
  
  // Parallax effect
  const { scrollY } = useScroll();
  const backgroundY = useTransform(scrollY, [0, 500], [0, 100]);
  const textY = useTransform(scrollY, [0, 500], [0, -50]);
  const opacityHero = useTransform(scrollY, [0, 300], [1, 0.3]);

  // Horror-themed emojis
  const horrorEmojis = [
    '🩸', '💀', '👻', '🧟', '🧛', '🧙‍♀️', '🔮', '⚰️', '🪦', '🗡️', 
    '🔪', '🪓', '🧪', '🕸️', '🕷️', '🦇', '🐺', '🌑', '⚡', '🔥',
    '🧠', '👁️', '💔', '📜', '🪄', '🧿', '🧹', '🪦', '🏺', '⛓️',
    '🐍', '🦉', '🧣', '🏮', '📿'
  ];
  
  // Generate random emoji configurations on component mount
  useEffect(() => {
    const generateRandomEmojis = () => {
      // Generate between 12-18 random emojis (increased count)
      const count = 12 + Math.floor(Math.random() * 7);
      const emojis = [];
      
      for (let i = 0; i < count; i++) {
        // Random emoji
        const emojiIndex = Math.floor(Math.random() * horrorEmojis.length);
        
        // Create grid-like positioning to ensure better distribution
        // Divide screen into sections and place one emoji in each section
        const gridX = Math.floor(i / 3) % 4; // 4 columns
        const gridY = i % 3; // 3 rows
        
        // Add randomness within each grid section
        const leftPos = (gridX * 25) + (Math.random() * 15);
        const topPos = (gridY * 33) + (Math.random() * 20);
        
        // Ensure z-index varies for layered effect
        const zIndex = 5 + Math.floor(Math.random() * 10);
        
        // Random position with better distribution
        const position = {
          left: `${leftPos}%`,
          top: `${topPos}%`,
          right: null,
          bottom: null,
        };
        
        // Random size (smaller range for less intrusive emojis)
        const size = 20 + Math.floor(Math.random() * 60);
        // Random duration
        const duration = 15 + Math.random() * 25;
        // Random opacity (more subtle)
        const opacity = 0.15 + Math.random() * 0.5;
        
        emojis.push({
          emoji: horrorEmojis[emojiIndex],
          position,
          size,
          duration,
          opacity,
          zIndex
        });
      }
      
      setFloatingEmojis(emojis);
    };
    
    generateRandomEmojis();
  }, []);

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

  // Remove blood drips animation
  useEffect(() => {
    // Add fog effect only
    const addFogEffect = () => {
      const fogContainer = document.createElement('div');
      fogContainer.className = 'fog-container fixed inset-0 pointer-events-none overflow-hidden';
      fogContainer.style.zIndex = '5';
      document.body.appendChild(fogContainer);
      
      for (let i = 0; i < 6; i++) {
        const fog = document.createElement('div');
        fog.className = 'fog absolute';
        fog.style.opacity = '0.03';
        fog.style.background = 'white';
        fog.style.borderRadius = '50%';
        fog.style.filter = 'blur(60px)';
        fog.style.transform = 'scale(1)';
        
        // Random size and position
        const size = 100 + Math.random() * 400;
        const posX = Math.random() * 100;
        const posY = Math.random() * 100;
        const delay = Math.random() * 5;
        const duration = 15 + Math.random() * 30;
        
        fog.style.width = `${size}px`;
        fog.style.height = `${size}px`;
        fog.style.left = `${posX}%`;
        fog.style.top = `${posY}%`;
        fog.style.animation = `fog ${duration}s ease-in-out ${delay}s infinite alternate`;
        
        fogContainer.appendChild(fog);
      }
      
      // Add CSS animation
      const style = document.createElement('style');
      style.innerHTML = `
        @keyframes fog {
          0% { transform: translateX(-10px) scale(1); opacity: 0.02; }
          50% { opacity: 0.04; }
          100% { transform: translateX(10px) scale(1.1); opacity: 0.02; }
        }
      `;
      document.head.appendChild(style);
      
      return () => {
        if (document.body.contains(fogContainer)) {
          document.body.removeChild(fogContainer);
        }
        if (document.head.contains(style)) {
          document.head.removeChild(style);
        }
      };
    };
    
    const cleanupFogEffect = addFogEffect();
    
    return () => {
      cleanupFogEffect();
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
        className="bg-horror-gradient py-12 sm:py-16 md:py-20 w-full relative overflow-hidden"
        style={{ minHeight: '80vh', display: 'flex', alignItems: 'center' }}
      >
        <motion.div 
          className="absolute inset-0 bg-blood-texture opacity-20"
          style={{ y: backgroundY }}
        />

        {/* Floating emojis contained within the hero section */}
        {floatingEmojis.map((item, index) => (
          <FloatingElement
            key={index}
            size={item.size}
            duration={item.duration}
            left={item.position.left}
            right={item.position.right}
            top={item.position.top}
            bottom={item.position.bottom}
            fallback={item.emoji}
            opacity={item.opacity}
            zIndex={item.zIndex}
          />
        ))}

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
                className="text-base sm:text-lg md:text-xl mb-6 sm:mb-8 text-fog"
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
      <section className="py-8 sm:py-12 md:py-16 bg-charcoal w-full relative">
        <div className="absolute inset-0 bg-blood-texture opacity-10"></div>
        <div className="relative z-10">
          <ProductList 
            products={products} 
            onAddToCart={addToCart} 
            title="محصولات ویژه" 
          />
        </div>
      </section>
      
      <Footer />
    </div>
  )
}

// Floating element component for visual interest
const FloatingElement = ({ size, duration, left, right, top, bottom, image, alt, fallback, opacity = 0.6, zIndex = 10 }) => {
  // Get shadow color for the default theme
  const getShadowColor = () => {
    return '0 0 15px rgba(255, 0, 0, 0.5)';
  };

  return (
    <motion.div
      className="absolute pointer-events-none"
      style={{
        left: left || 'auto',
        right: right || 'auto',
        top: top || 'auto',
        bottom: bottom || 'auto',
        width: size,
        height: size,
        opacity: opacity,
        filter: `drop-shadow(${getShadowColor()})`,
        zIndex: zIndex,
        position: 'absolute', // Reinforce absolute positioning
        userSelect: 'none', // Prevent any text selection
        touchAction: 'none', // Prevent touch events
      }}
      animate={{
        y: [0, 10, -5, 10, 0],
        rotate: [0, 5, -3, 5, 0],
        scale: [1, 1.05, 0.95, 1.05, 1],
      }}
      transition={{
        duration,
        repeat: Infinity,
        repeatType: "reverse",
        ease: "easeInOut",
        delay: Math.random() * 5, 
      }}
    >
      {image ? (
        <img 
          src={image} 
          alt={alt} 
          className="w-full h-full object-contain pointer-events-none"
          onError={(e) => {
            e.target.outerHTML = `<div class="w-full h-full flex items-center justify-center text-3xl pointer-events-none">${fallback}</div>`;
          }}
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center text-3xl pointer-events-none">
          {fallback}
        </div>
      )}
    </motion.div>
  );
};

export default App
