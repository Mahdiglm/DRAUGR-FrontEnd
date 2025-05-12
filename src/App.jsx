import { useState, useEffect, useRef } from 'react'
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import './App.css'

// Components
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import ProductList from './components/product/ProductList';
import Cart from './components/cart/Cart';
import ThemeSwitcher from './components/layout/ThemeSwitcher';

// Data
import { products } from './utils/mockData';

function App() {
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const [message, setMessage] = useState('');
  const [currentTheme, setCurrentTheme] = useState('draugr');
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
  
  const changeTheme = (themeId) => {
    setCurrentTheme(themeId);
    // You could also save theme preference in localStorage here
    localStorage.setItem('draugr-theme', themeId);
    showTemporaryMessage(`تم ${getThemeName(themeId)} فعال شد`);
  };
  
  // Load saved theme on initial load
  useEffect(() => {
    const savedTheme = localStorage.getItem('draugr-theme');
    if (savedTheme) {
      setCurrentTheme(savedTheme);
    }
  }, []);

  // Apply theme to body element
  useEffect(() => {
    // Remove all theme classes
    document.body.classList.remove('theme-draugr', 'theme-vampire', 'theme-witch', 'theme-werewolf');
    // Add current theme class
    document.body.classList.add(`theme-${currentTheme}`);
  }, [currentTheme]);

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
  }, [currentTheme]);

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
  
  // Get theme-specific gradient for hero section
  const getHeroGradient = () => {
    switch(currentTheme) {
      case 'vampire': return 'bg-vampire-gradient';
      case 'witch': return 'bg-witch-gradient';
      case 'werewolf': return 'bg-werewolf-gradient';
      default: return 'bg-horror-gradient';
    }
  };
  
  // Helper function to get theme name for messages
  const getThemeName = (themeId) => {
    switch(themeId) {
      case 'vampire': return 'خون آشام';
      case 'witch': return 'جادوگر';
      case 'werewolf': return 'گرگینه';
      default: return 'دراگور';
    }
  };

  return (
    <div className={`min-h-screen w-full font-vazirmatn bg-${currentTheme === 'draugr' ? 'midnight' : `${currentTheme}-dark`} dark`}>
      <Header cartItems={cartItems} onCartClick={toggleCart} currentTheme={currentTheme} />
      
      <Cart 
        items={cartItems} 
        removeItem={removeFromCart} 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
        currentTheme={currentTheme}
      />

      {/* Theme Switcher */}
      <ThemeSwitcher currentTheme={currentTheme} onThemeChange={changeTheme} />

      {/* Floating Message */}
      <AnimatePresence>
        {showMessage && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`fixed top-20 right-1/2 transform translate-x-1/2 
                      bg-${currentTheme === 'draugr' ? 'draugr-800' : `${currentTheme}-primary`} 
                      text-white px-6 py-3 rounded-md z-50 shadow-${currentTheme}`}
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
        className={`${getHeroGradient()} py-12 sm:py-16 md:py-20 w-full relative overflow-hidden`}
        style={{ minHeight: '80vh', display: 'flex', alignItems: 'center' }}
      >
        <motion.div 
          className="absolute inset-0 bg-blood-texture opacity-20"
          style={{ y: backgroundY }}
        />
        <div className="w-full max-w-7xl mx-auto px-4 relative z-10">
          <motion.div 
            className="max-w-3xl"
            style={{ y: textY, opacity: opacityHero }}
          >
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className={`text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6 text-shadow-${currentTheme}`}
            >
              <span className={`text-${currentTheme === 'draugr' ? 'draugr-500' : `${currentTheme}-accent`} font-bold text-shadow-${currentTheme}`}>
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
                boxShadow: `0 0 20px ${currentTheme === 'draugr' ? 'rgba(255, 0, 0, 0.7)' : `var(--${currentTheme}-accent-shadow)`}`,
                textShadow: '0 0 10px rgba(255, 255, 255, 0.9)'
              }}
              whileTap={{ scale: 0.95 }}
              className={`bg-gradient-to-r from-${currentTheme === 'draugr' ? 'draugr-800' : `${currentTheme}-primary`} 
                        to-${currentTheme === 'draugr' ? 'draugr-600' : `${currentTheme}-secondary`} 
                        text-white font-medium text-sm sm:text-base px-6 sm:px-8 py-2 sm:py-3 rounded-md 
                        border border-${currentTheme === 'draugr' ? 'draugr-500' : `${currentTheme}-accent`}`}
            >
              فروشگاه
            </motion.button>
          </motion.div>
        </div>
        
        {/* Floating elements */}
        <FloatingElement
          size={60}
          duration={20}
          right="15%"
          top="25%"
          image="/images/blood-drop.png"
          alt="Blood drop"
          fallback="🩸"
          theme={currentTheme}
        />
        <FloatingElement
          size={90}
          duration={15}
          left="10%"
          bottom="20%"
          image="/images/skull.png"
          alt="Skull"
          fallback="💀" 
          theme={currentTheme}
        />
      </motion.section>

      {/* Featured Products */}
      <section className={`py-8 sm:py-12 md:py-16 bg-${currentTheme === 'draugr' ? 'charcoal' : `${currentTheme}-dark`} w-full relative`}>
        <div className="absolute inset-0 bg-blood-texture opacity-10"></div>
        <div className="relative z-10">
          <ProductList 
            products={products} 
            onAddToCart={addToCart} 
            title="محصولات ویژه" 
            currentTheme={currentTheme}
          />
        </div>
      </section>
      
      <Footer currentTheme={currentTheme} />
    </div>
  )
}

// Floating element component for visual interest
const FloatingElement = ({ size, duration, left, right, top, bottom, image, alt, fallback, theme }) => {
  // Get theme-specific shadow color
  const getShadowColor = () => {
    switch(theme) {
      case 'vampire': return '0 0 15px rgba(176, 46, 12, 0.5)';
      case 'witch': return '0 0 15px rgba(84, 123, 115, 0.5)';
      case 'werewolf': return '0 0 15px rgba(179, 163, 56, 0.5)';
      default: return '0 0 15px rgba(255, 0, 0, 0.5)';
    }
  };

  return (
    <motion.div
      className="absolute z-10 pointer-events-none opacity-60"
      style={{
        left: left || 'auto',
        right: right || 'auto',
        top: top || 'auto',
        bottom: bottom || 'auto',
        width: size,
        height: size,
        filter: `drop-shadow(${getShadowColor()})`,
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
      }}
    >
      {image ? (
        <img 
          src={image} 
          alt={alt} 
          className="w-full h-full object-contain"
          onError={(e) => {
            e.target.outerHTML = `<div class="w-full h-full flex items-center justify-center text-3xl">${fallback}</div>`;
          }}
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center text-3xl">
          {fallback}
        </div>
      )}
    </motion.div>
  );
};

export default App
