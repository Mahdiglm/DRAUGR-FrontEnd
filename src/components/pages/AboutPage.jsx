import React, { useRef, useEffect, useState } from 'react';
import { motion, useScroll, useTransform, useSpring, useInView } from 'framer-motion';
import { Link } from 'react-router-dom';
import { getAssetUrl } from '../../utils/assetUtils';

// Import skull image
const skullImg = getAssetUrl('skull.jpg');

// Section component with fade-in and parallax effects
const StorySection = ({ children, className, overlayOpacity = 0.7, dark = true }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <motion.section
      ref={ref}
      className={`relative min-h-screen w-full flex items-center justify-center overflow-hidden ${className}`}
    >
      {/* Dark overlay with the same style as top section */}
      <div className="absolute inset-0 bg-black bg-opacity-60" />
      
      {/* Content wrapper */}
      <motion.div 
        className="container mx-auto px-4 py-16 z-10 relative"
        variants={{
          hidden: { opacity: 0, y: 50 },
          visible: { opacity: 1, y: 0 },
        }}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        {children}
      </motion.div>
    </motion.section>
  );
};

// Text reveal animation component
const RevealText = ({ children, delay = 0, className = "" }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });
  
  return (
    <motion.div
      ref={ref}
      className={`overflow-hidden ${className}`}
      variants={{
        hidden: { opacity: 0 },
        visible: { opacity: 1 },
      }}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      transition={{ duration: 0.5, delay }}
    >
      <motion.div
        variants={{
          hidden: { y: 100 },
          visible: { y: 0 },
        }}
        transition={{ duration: 0.7, ease: "easeOut" }}
      >
        {children}
      </motion.div>
    </motion.div>
  );
};

// Floating runes effect
const FloatingRunes = ({ count = 25 }) => {
  // Norse-inspired rune characters
  const runes = ['ᚠ', 'ᚢ', 'ᚦ', 'ᚨ', 'ᚱ', 'ᚲ', 'ᚷ', 'ᚹ', 'ᚺ', 'ᚾ', 'ᛁ', 'ᛃ', 'ᛇ', 'ᛈ', 'ᛉ', 'ᛊ', 'ᛏ', 'ᛒ', 'ᛖ', 'ᛗ', 'ᛚ', 'ᛜ', 'ᛞ', 'ᛟ'];
  
  // Detect if we're on mobile
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    // Check on initial load
    checkMobile();
    
    // Add event listener for resize
    window.addEventListener('resize', checkMobile);
    
    // Cleanup
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  // PART 1: Create runes that are already in each section at page load
  const immediateRunes = Array.from({ length: 4 }).map((_, sectionIndex) => {
    return Array.from({ length: Math.ceil(count / 4) }).map((_, i) => {
      // Distribute across the current section
      const x = Math.random() * 100; // Random horizontal position
      
      // Position vertically within current section (0-25%, 25-50%, etc.)
      const sectionStart = sectionIndex * 25;
      const y = sectionStart + Math.random() * 25;
      
      // Animation properties
      const rune = runes[Math.floor(Math.random() * runes.length)];
      // Similar size for both mobile and desktop, but slightly larger on mobile
      const size = isMobile ? (Math.random() * 3 + 1.5) : (Math.random() * 2.5 + 1.2);
      // Higher opacity for both
      const opacity = isMobile ? (Math.random() * 0.4 + 0.15) : (Math.random() * 0.35 + 0.1);
      const rotateStart = Math.random() * 360;
      const rotateEnd = rotateStart + Math.random() * 360;
      
      // Animation speeds
      const initialDelay = Math.random() * 2; // Very short initial delay
      const duration = isMobile ? (Math.random() * 15 + 25) : (Math.random() * 12 + 20); // Slightly slower on mobile
      const horizontalDrift = (Math.random() - 0.5) * (isMobile ? 10 : 15); // Similar drift
      
      return {
        id: `immediate-${sectionIndex}-${i}`,
        x,
        y,
        rune,
        size,
        opacity,
        rotateStart,
        rotateEnd,
        initialDelay,
        duration,
        horizontalDrift
      };
    });
  }).flat();
  
  // PART 2: Create continuous stream of runes from below the viewport
  const streamRunes = Array.from({ length: 5 }).map((_, sectionIndex) => {
    return Array.from({ length: Math.ceil(count / 5) }).map((_, i) => {
      // Distribute horizontally across the page
      const x = Math.random() * 100;
      
      // Vertical starting position - below the viewport with variance
      const sectionOffset = sectionIndex * 100;
      const y = 100 + sectionOffset + Math.random() * 50;
      
      // Create animation properties
      const rune = runes[Math.floor(Math.random() * runes.length)];
      // Similar size for both mobile and desktop, but slightly larger on mobile
      const size = isMobile ? (Math.random() * 3 + 1.5) : (Math.random() * 2.5 + 1.2);
      // Higher opacity for both
      const opacity = isMobile ? (Math.random() * 0.4 + 0.15) : (Math.random() * 0.35 + 0.1);
      const rotateStart = Math.random() * 360;
      const rotateEnd = rotateStart + Math.random() * 360;
      
      // Animation speeds
      const initialDelay = Math.random() * (isMobile ? 10 : 12); // Similar delay
      const duration = isMobile ? (Math.random() * 20 + 30) : (Math.random() * 18 + 25); // Similar speed
      const horizontalDrift = (Math.random() - 0.5) * (isMobile ? 15 : 20); // Similar drift
      
      return {
        id: `stream-${sectionIndex}-${i}`,
        x,
        y,
        rune,
        size,
        opacity,
        rotateStart,
        rotateEnd,
        initialDelay,
        duration,
        horizontalDrift
      };
    });
  }).flat();
  
  // Combine both sets of runes
  const allRunes = [...immediateRunes, ...streamRunes];

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden">
      {allRunes.map((runeConfig) => (
        <motion.div
          key={runeConfig.id}
          className="absolute text-draugr-500 font-bold"
          style={{ 
            left: `${runeConfig.x}%`,
            top: `${runeConfig.y}%`,
            fontSize: `${runeConfig.size}rem`,
            opacity: runeConfig.opacity,
            zIndex: 0,
            // Add text shadow for better visibility on all backgrounds, slightly less intense on desktop
            textShadow: isMobile ? 
              '0 0 8px rgba(0, 0, 0, 0.7)' : 
              '0 0 6px rgba(0, 0, 0, 0.5)',
          }}
          animate={{ 
            y: '-150vh', // Move upward beyond the top of the page
            x: runeConfig.horizontalDrift,
            rotate: [runeConfig.rotateStart, runeConfig.rotateEnd]
          }}
          transition={{ 
            duration: runeConfig.duration,
            delay: runeConfig.initialDelay,
            repeat: Infinity,
            ease: "linear"
          }}
        >
          {runeConfig.rune}
        </motion.div>
      ))}
    </div>
  );
};

// 2D Skull SVG component
const SkullSVG = () => {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <motion.svg
        width="100%"
        height="100%"
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ 
          opacity: 1, 
          scale: 1,
          rotateY: [0, 10, 0, -10, 0],
        }}
        transition={{ 
          opacity: { duration: 1 },
          scale: { duration: 1 },
          rotateY: { 
            repeat: Infinity, 
            duration: 8, 
            ease: "easeInOut" 
          }
        }}
      >
        {/* Simple skull shape */}
        <motion.path
          d="M50 10 C30 10, 15 30, 15 50 C15 65, 25 75, 35 80 L35 90 L65 90 L65 80 C75 75, 85 65, 85 50 C85 30, 70 10, 50 10 Z"
          stroke="#ff0000"
          strokeWidth="1"
          animate={{ 
            fill: ['#330000', '#660000', '#330000'],
            filter: ['drop-shadow(0 0 2px #ff0000)', 'drop-shadow(0 0 8px #ff0000)', 'drop-shadow(0 0 2px #ff0000)'],
          }}
          transition={{ 
            duration: 4,
            repeat: Infinity, 
            ease: "easeInOut" 
          }}
        />
        
        {/* Left eye */}
        <motion.circle 
          cx="35" 
          cy="45" 
          r="8" 
          animate={{ 
            fill: ['#000000', '#330000', '#000000'],
          }}
          transition={{ 
            duration: 3,
            repeat: Infinity, 
            ease: "easeInOut",
            repeatDelay: 1
          }}
        />
        
        {/* Right eye */}
        <motion.circle 
          cx="65" 
          cy="45" 
          r="8" 
          animate={{ 
            fill: ['#000000', '#330000', '#000000'],
          }}
          transition={{ 
            duration: 3,
            repeat: Infinity, 
            ease: "easeInOut",
            repeatDelay: 1
          }}
        />
        
        {/* Nose */}
        <motion.path 
          d="M50 50 L45 65 L55 65 Z" 
          animate={{ 
            fill: ['#330000', '#660000', '#330000'],
          }}
          transition={{ 
            duration: 3,
            repeat: Infinity, 
            ease: "easeInOut" 
          }}
        />
        
        {/* Teeth */}
        <motion.path 
          d="M40 70 L40 75 L45 75 L45 70 M47.5 70 L47.5 75 L52.5 75 L52.5 70 M55 70 L55 75 L60 75 L60 70" 
          stroke="#ffffff"
          strokeWidth="1"
          fill="#ffffff"
          animate={{ 
            opacity: [0.8, 1, 0.8],
          }}
          transition={{ 
            duration: 4,
            repeat: Infinity, 
            ease: "easeInOut" 
          }}
        />
      </motion.svg>
    </div>
  );
};

const AboutPage = () => {
  // For main scroll progress
  const scrollRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: scrollRef });
  
  // Smooth progress for various effects
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });
  
  // Track browser performance
  const [isLowPerformance, setIsLowPerformance] = useState(false);
  
  // Check device capabilities on mount
  useEffect(() => {
    // Better mobile detection with screen size check
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth < 768;
    const isOldBrowser = !window.IntersectionObserver || !window.requestAnimationFrame;
    setIsLowPerformance(isMobile && isOldBrowser); // Only set low performance if both mobile AND old browser
  }, []);

  return (
    <div ref={scrollRef} className="bg-midnight font-vazirmatn relative">
      {/* Blood overlay indicator for scroll progress */}
      <motion.div 
        className="fixed top-0 left-0 right-0 h-1 bg-draugr-500 origin-left z-50"
        style={{ scaleX: smoothProgress }}
      />
      
      {/* Global background with runes - positioned to cover all content sections */}
      {/* Always render, but adjust count based on performance */}
      <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none" style={{ zIndex: 1 }}>
        <FloatingRunes count={isLowPerformance ? 15 : 40} />
      </div>
      
      {/* Hero section */}
      <section className="w-full h-screen relative flex items-center justify-center overflow-hidden">
        {/* Background with consistent style */}
        <div className="absolute inset-0 bg-black bg-opacity-60"></div>

        {/* Title with animation */}
        <div className="container mx-auto px-4 text-center z-10 relative">
          <motion.h1 
            className="text-7xl md:text-8xl font-extrabold mb-6 text-white"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
          >
            <span className="text-draugr-500 text-shadow-horror">DRAUGR</span>
          </motion.h1>
          
          <motion.p
            className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto mb-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1 }}
          >
            داستان اصیل تولد یک افسانه
          </motion.p>
        </div>
      </section>

      {/* Origin story */}
      <StorySection overlayOpacity={0.8}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="text-right">
            <RevealText>
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-draugr-500">افسانه‌های باستانی</h2>
            </RevealText>
            <RevealText delay={0.2}>
              <p className="text-lg text-gray-300 mb-6 leading-relaxed">
                در روزگاران کهن، در سرزمین‌های یخزده اسکاندیناوی، افسانه‌های مردگان متحرک شکل گرفت. اجساد جنگجویانی که نه به دنیای مردگان رفتند و نه در دنیای زندگان جایی داشتند.
              </p>
            </RevealText>
            <RevealText delay={0.3}>
              <p className="text-lg text-gray-300 mb-6 leading-relaxed">
                <span className="text-draugr-400 font-semibold">دراگر</span> - موجوداتی با چشمان آبی درخشان که در شب‌های تاریک از قبرهای خود برمی‌خاستند. آنها محافظان گنجینه‌های باستانی و رازهایی بودند که بشر نباید به آنها دست می‌یافت.
              </p>
            </RevealText>
          </div>
          
          <div className="h-[400px] md:h-[500px] relative bg-transparent rounded-lg overflow-hidden">
            {/* Skull image */}
            <img 
              src={skullImg} 
              alt="Skull" 
              className="w-auto h-auto max-w-[70%] max-h-[70%] object-contain absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-transparent"
              style={{ backgroundColor: 'transparent' }}
            />
          </div>
        </div>
      </StorySection>
      
      {/* The curse & transition period */}
      <StorySection overlayOpacity={0.75}>
        <RevealText>
          <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center text-draugr-500">نفرین باستانی</h2>
        </RevealText>
        
        <div className="max-w-4xl mx-auto">
          <RevealText delay={0.2}>
            <p className="text-lg text-gray-300 mb-6 leading-relaxed text-center">
              افسانه‌ها می‌گویند که نفرین <span className="text-draugr-400 font-semibold">دراگر</span> با آنهایی که اشیاء مقدس را از آرامگاه‌های باستانی خارج کنند، خواهد بود. اما برخی باور داشتند که این اشیاء قدرتمند، دارای خصوصیات جادویی هستند که می‌توانند مرز بین زندگی و مرگ را از بین ببرند.
            </p>
          </RevealText>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-10">
            {['دوران باستان', 'قرون وسطی', 'دوران مدرن'].map((era, index) => (
              <motion.div 
                key={index}
                className="bg-black bg-opacity-40 border border-draugr-900 rounded-lg p-6 text-center"
                whileHover={{ y: -5, scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300, damping: 15 }}
              >
                <RevealText delay={0.3 + index * 0.1}>
                  <h3 className="text-xl font-bold mb-3 text-draugr-400">{era}</h3>
                  <p className="text-gray-400">
                    {index === 0 && "اشیاء دراگر در معابد مخفی و آرامگاه‌های پادشاهان نگهداری می‌شدند."}
                    {index === 1 && "جستجوگران شجاع به دنبال این گنجینه‌ها بودند، بیشترشان هرگز بازنگشتند."}
                    {index === 2 && "افسانه‌ها به واقعیت تبدیل شدند. اشیاء باستانی به دست کسانی که درک عمیقی از قدرت آنها داشتند، افتاد."}
                  </p>
                </RevealText>
              </motion.div>
            ))}
          </div>
          
          <RevealText delay={0.6}>
            <p className="text-lg text-gray-300 leading-relaxed text-center">
              سالیان طولانی، این اشیاء فراموش شدند. تا اینکه گروهی از باستان‌شناسان و متخصصان فرهنگ نوردیک، مجموعه‌ای از آنها را کشف کردند و تصمیم گرفتند تا قدرت آنها را با جهان به اشتراک بگذارند.
            </p>
          </RevealText>
        </div>
      </StorySection>
      
      {/* Birth of the shop */}
      <StorySection overlayOpacity={0.6}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <RevealText>
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-draugr-500">تولد فروشگاه DRAUGR</h2>
            </RevealText>
            
            <RevealText delay={0.2}>
              <p className="text-lg text-gray-300 mb-6 leading-relaxed">
                در سال ۲۰۲۲، گروهی از علاقه‌مندان به فرهنگ نوردیک و اساطیر اسکاندیناوی، تصمیم گرفتند تا مجموعه‌ای از آثار الهام‌گرفته از افسانه‌های دراگر را به دوستداران این فرهنگ عرضه کنند.
              </p>
            </RevealText>
            
            <RevealText delay={0.3}>
              <p className="text-lg text-gray-300 mb-6 leading-relaxed">
                فروشگاه <span className="text-draugr-400 font-semibold">DRAUGR</span> با هدف عرضه محصولات منحصربه‌فرد و دست‌ساز با کیفیت بالا، افتتاح شد. هر محصول، داستانی از افسانه‌های نوردیک را با خود به همراه دارد.
              </p>
            </RevealText>
            
            <RevealText delay={0.4}>
              <p className="text-lg text-gray-300 leading-relaxed">
                امروز، ما افتخار می‌کنیم که بخشی از این میراث غنی را با شما به اشتراک می‌گذاریم. هر محصول با احترام به تاریخ و افسانه‌های نوردیک، طراحی و تولید شده است.
              </p>
            </RevealText>
          </div>
          
          <div className="space-y-6">
            {/* Timeline visualization */}
            <div className="relative pt-2 pb-10">
              {/* Timeline line */}
              <div className="absolute right-4 top-0 bottom-0 w-0.5 bg-gradient-to-b from-draugr-900 via-draugr-500 to-draugr-900"></div>
              
              {/* Timeline points */}
              {[
                { year: "۲۰۲۲", text: "کشف مجموعه آثار باستانی در شمال نروژ" },
                { year: "۲۰۲۳", text: "تأسیس فروشگاه DRAUGR و عرضه اولین محصولات" },
                { year: "۲۰۲۴", text: "گسترش مجموعه و اضافه شدن محصولات جدید" },
              ].map((item, index) => (
                <RevealText key={index} delay={0.2 + index * 0.15}>
                  <div className="flex items-start mb-8 relative">
                    {/* Timeline node */}
                    <div className="absolute right-4 w-3 h-3 bg-draugr-500 rounded-full transform translate-x-1/2 mt-1.5 shadow-glow"></div>
                    
                    {/* Year */}
                    <div className="w-16 text-right ml-3 mr-10 mt-0.5">
                      <span className="font-bold text-draugr-500">{item.year}</span>
                    </div>
                    
                    {/* Content */}
                    <div className="bg-black bg-opacity-40 p-4 rounded-lg border-r border-draugr-800 flex-1">
                      <p className="text-gray-300">{item.text}</p>
                    </div>
                  </div>
                </RevealText>
              ))}
            </div>
          </div>
        </div>
      </StorySection>
      
      {/* Our philosophy */}
      <StorySection className="">
        <RevealText>
          <h2 className="text-3xl md:text-4xl font-bold mb-10 text-center text-draugr-500">فلسفه ما</h2>
        </RevealText>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {[
            {
              title: "کیفیت بی‌نظیر",
              description: "هر محصول با دقت و توجه به جزئیات ساخته می‌شود تا کیفیتی ماندگار داشته باشد.",
              icon: (
                <svg className="w-12 h-12 text-draugr-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              ),
            },
            {
              title: "طراحی اصیل",
              description: "الهام گرفته از افسانه‌های نوردیک و فرهنگ غنی اسکاندیناوی با طرح‌های منحصربه‌فرد.",
              icon: (
                <svg className="w-12 h-12 text-draugr-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              ),
            },
            {
              title: "تجربه ماندگار",
              description: "هر محصول تنها یک کالا نیست، بلکه دروازه‌ای به دنیای افسانه‌های کهن است.",
              icon: (
                <svg className="w-12 h-12 text-draugr-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              ),
            },
          ].map((item, index) => (
            <RevealText key={index} delay={0.2 + index * 0.1}>
              <motion.div 
                className="bg-black bg-opacity-30 p-6 rounded-lg text-center hover:bg-opacity-50 transition-all duration-300"
                whileHover={{ y: -5, scale: 1.03 }}
                transition={{ type: "spring", stiffness: 300, damping: 15 }}
              >
                <div className="flex justify-center">
                  {item.icon}
                </div>
                <h3 className="text-xl font-bold mb-3 text-draugr-400">{item.title}</h3>
                <p className="text-gray-300">{item.description}</p>
              </motion.div>
            </RevealText>
          ))}
        </div>
        
        <RevealText delay={0.6}>
          <div className="text-center mt-16">
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              در <span className="text-draugr-400 font-semibold">DRAUGR</span>، ما تنها محصول نمی‌فروشیم، بلکه قسمتی از افسانه را با شما به اشتراک می‌گذاریم.
            </p>
          </div>
        </RevealText>
      </StorySection>
      
      {/* Join us section */}
      <section className="w-full h-screen relative flex items-center justify-center overflow-hidden">
        {/* Background with consistent style */}
        <div className="absolute inset-0 bg-black bg-opacity-60"></div>
        
        {/* Content container */}
        <div className="container mx-auto px-4 text-center relative z-10">
          <RevealText>
            <h2 className="text-3xl md:text-4xl font-bold mb-8 text-draugr-500">به افسانه بپیوندید</h2>
          </RevealText>
          
          <RevealText delay={0.2}>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-10">
              تجربه منحصربه‌فرد محصولات DRAUGR را امتحان کنید و وارد دنیای افسانه‌های نوردیک شوید.
            </p>
          </RevealText>
          
          <RevealText delay={0.4}>
            <motion.a
              href="/shop"
              className="inline-block bg-draugr-800 hover:bg-draugr-700 text-white font-bold py-4 px-8 rounded-lg shadow-horror transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              اکتشاف محصولات
            </motion.a>
          </RevealText>
        </div>
      </section>
    </div>
  );
};

export default AboutPage; 