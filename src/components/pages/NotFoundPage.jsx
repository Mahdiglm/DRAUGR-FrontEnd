import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';

const NotFoundPage = () => {
  const [glitchText, setGlitchText] = useState('۴۰۴');
  const [bloodDrops, setBloodDrops] = useState([]);
  const navigate = useNavigate();

  // Glitch effect for 404 text
  useEffect(() => {
    const glitchTexts = ['۴۰۴', '٤٠٤', '404', '۴۰۴', '４０４'];
    const interval = setInterval(() => {
      setGlitchText(glitchTexts[Math.floor(Math.random() * glitchTexts.length)]);
    }, 150);

    const timeout = setTimeout(() => {
      clearInterval(interval);
      setGlitchText('۴۰۴');
    }, 2000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, []);

  // Create blood drops animation
  useEffect(() => {
    const createBloodDrop = () => {
      const newDrop = {
        id: Math.random(),
        left: Math.random() * 100,
        animationDuration: 2 + Math.random() * 3,
        delay: Math.random() * 2
      };
      setBloodDrops(prev => [...prev.slice(-10), newDrop]);
    };

    const interval = setInterval(createBloodDrop, 800);
    return () => clearInterval(interval);
  }, []);

  // Floating runes animation
  const floatingRunes = ['ᚱ', 'ᚢ', 'ᚾ', 'ᚦ', 'ᚨ', 'ᚻ', 'ᛁ', 'ᛃ'];

  return (
    <>
      <Helmet>
        <title>صفحه پیدا نشد | فروشگاه Draugr</title>
        <meta name="description" content="صفحه مورد نظر شما پیدا نشد" />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black relative overflow-hidden flex items-center justify-center">
        {/* Background decorative elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(139,0,0,0.3),transparent_70%)]"></div>
        </div>

        {/* Floating runes */}
        <div className="absolute inset-0 pointer-events-none">
          {floatingRunes.map((rune, index) => (
            <motion.div
              key={index}
              className="absolute text-red-900/20 text-4xl font-bold"
              style={{
                left: `${10 + (index * 12)}%`,
                top: `${20 + (index % 3) * 25}%`
              }}
              animate={{
                y: [-20, 20, -20],
                rotate: [-5, 5, -5],
                opacity: [0.1, 0.3, 0.1]
              }}
              transition={{
                duration: 4 + (index * 0.5),
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              {rune}
            </motion.div>
          ))}
        </div>

        {/* Blood drops */}
        <AnimatePresence>
          {bloodDrops.map(drop => (
            <motion.div
              key={drop.id}
              className="absolute w-1 bg-gradient-to-b from-red-600 via-red-700 to-red-900 rounded-full pointer-events-none"
              style={{
                left: `${drop.left}%`,
                top: '-20px'
              }}
              initial={{ height: 0, opacity: 0 }}
              animate={{ 
                height: ['0px', '30px', '30px'],
                y: ['0px', '100vh'],
                opacity: [0, 0.8, 0]
              }}
              transition={{
                duration: drop.animationDuration,
                delay: drop.delay,
                ease: "easeIn"
              }}
              exit={{ opacity: 0 }}
            />
          ))}
        </AnimatePresence>

        {/* Main content */}
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          {/* 404 Text with glitch effect */}
          <motion.div
            className="mb-8"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", duration: 0.8 }}
          >
            <h1 
              className="text-8xl md:text-9xl font-bold text-transparent bg-clip-text bg-gradient-to-b from-red-500 via-red-600 to-red-800 mb-4"
              style={{
                textShadow: '0 0 20px rgba(220, 38, 38, 0.5), 0 0 40px rgba(220, 38, 38, 0.3)',
                filter: 'drop-shadow(0 0 10px rgba(220, 38, 38, 0.7))'
              }}
            >
              {glitchText}
            </h1>
            
            {/* Skull decoration */}
            <motion.div
              className="flex justify-center mb-6"
              animate={{ rotate: [0, 2, -2, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
            >
              <div className="text-6xl opacity-60">💀</div>
            </motion.div>
          </motion.div>

          {/* Error message */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="mb-8"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              صفحه در تاریکی گم شده
            </h2>
            <p className="text-lg text-gray-300 mb-2 leading-relaxed">
              صفحه‌ای که به دنبال آن می‌گردید در اعماق تاریک سایت گم شده است
            </p>
            <p className="text-base text-gray-400">
              شاید توسط ارواح شیطانی ربوده شده یا در بعدی دیگر فرار کرده باشد
            </p>
          </motion.div>

          {/* Action buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            {/* Home button */}
            <Link to="/">
              <motion.button
                whileHover={{ 
                  scale: 1.05,
                  boxShadow: "0 0 25px rgba(220, 38, 38, 0.6)"
                }}
                whileTap={{ scale: 0.95 }}
                className="group relative overflow-hidden bg-gradient-to-r from-red-600 to-red-700 text-white px-8 py-4 rounded-lg font-semibold text-lg border border-red-500 transition-all duration-300"
              >
                {/* Button glow effect */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-red-500 to-red-600 opacity-0 group-hover:opacity-20 transition-opacity duration-300"
                  whileHover={{ opacity: 0.2 }}
                />
                
                {/* Button text */}
                <span className="relative z-10 flex items-center gap-2">
                  🏠 بازگشت به خانه
                </span>
              </motion.button>
            </Link>

            {/* Back button */}
            <motion.button
              onClick={() => navigate(-1)}
              whileHover={{ 
                scale: 1.05,
                borderColor: "rgb(220, 38, 38)"
              }}
              whileTap={{ scale: 0.95 }}
              className="group bg-transparent border-2 border-gray-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:border-red-500 hover:text-red-400 transition-all duration-300"
            >
              <span className="flex items-center gap-2">
                ⬅️ صفحه قبل
              </span>
            </motion.button>
          </motion.div>

          {/* Additional horror elements */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 1 }}
            className="mt-12 text-center"
          >
            <div className="inline-flex items-center gap-4 text-gray-500 text-sm">
              <div className="w-8 h-[1px] bg-gradient-to-r from-transparent to-red-900/50"></div>
              <span>در تاریکی گم نشوید</span>
              <div className="w-8 h-[1px] bg-gradient-to-l from-transparent to-red-900/50"></div>
            </div>
          </motion.div>

          {/* Creepy eyes watching */}
          <motion.div
            className="absolute top-10 left-10 text-red-600/30 text-2xl"
            animate={{
              opacity: [0.3, 0.7, 0.3],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            👁️
          </motion.div>
          
          <motion.div
            className="absolute top-20 right-16 text-red-600/30 text-2xl"
            animate={{
              opacity: [0.7, 0.3, 0.7],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1
            }}
          >
            👁️
          </motion.div>
        </div>

        {/* Bottom fog effect */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/90 to-transparent pointer-events-none"></div>
        
        {/* Corner decorative elements */}
        <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-red-900/20 to-transparent pointer-events-none"></div>
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-red-900/20 to-transparent pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-red-900/20 to-transparent pointer-events-none"></div>
        <div className="absolute bottom-0 right-0 w-32 h-32 bg-gradient-to-tl from-red-900/20 to-transparent pointer-events-none"></div>
      </div>
    </>
  );
};

export default NotFoundPage; 