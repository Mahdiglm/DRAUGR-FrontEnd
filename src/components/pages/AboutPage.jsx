import React, { useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';

const AboutPage = () => {
  const containerRef = useRef(null);
  const headingRef = useRef(null);
  const missionRef = useRef(null);
  const teamRef = useRef(null);
  const isHeadingInView = useInView(headingRef, { once: false, margin: "-100px 0px" });
  const isMissionInView = useInView(missionRef, { once: false, margin: "-100px 0px" });
  const isTeamInView = useInView(teamRef, { once: false, margin: "-100px 0px" });
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });
  
  const leftLineProgress = useTransform(scrollYProgress, [0, 1], [0, 100]);
  const rightLineProgress = useTransform(scrollYProgress, [0, 1], [0, 100]);
  
  const teamMembers = [
    {
      id: 1,
      name: "ساره احمدی",
      role: "طراح تجربه کاربری",
      bio: "متخصص در طراحی تجارب کاربری ترسناک و غوطه‌ور",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60"
    },
    {
      id: 2,
      name: "علی رضوی",
      role: "مدیر محصول",
      bio: "استراتژیست محصول با علاقه به داستان‌های ترسناک و افسانه‌ای",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60"
    },
    {
      id: 3,
      name: "مریم محمدی",
      role: "توسعه‌دهنده فرانت‌اند",
      bio: "متخصص در ایجاد تجربیات تعاملی و انیمیشن‌های منحصر به فرد",
      image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60"
    }
  ];

  return (
    <div 
      ref={containerRef}
      className="min-h-screen bg-gradient-to-b from-midnight to-vampire-dark text-white py-20 relative overflow-hidden"
    >
      {/* Animated neon lines */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        {/* Left neon line - zigzag pattern */}
        <svg className="absolute h-full w-full" preserveAspectRatio="none">
          <motion.path
            d="M-10,0 Q30,150 5,300 Q-20,450 30,600 Q60,750 5,900 Q-20,1050 30,1200 Q60,1350 5,1500"
            stroke="url(#leftLineGradient)"
            strokeWidth="2"
            fill="none"
            initial={{ pathLength: 0 }}
            style={{ 
              pathLength: leftLineProgress,
              filter: "drop-shadow(0 0 8px #ef233c) drop-shadow(0 0 12px #ef233c)",
              opacity: 0.8,
              strokeDasharray: "5 5"
            }}
          />
          <defs>
            <linearGradient id="leftLineGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#ef233c" stopOpacity="0.2" />
              <stop offset="50%" stopColor="#ef233c" stopOpacity="1" />
              <stop offset="100%" stopColor="#ef233c" stopOpacity="0.2" />
            </linearGradient>
          </defs>
        </svg>
        
        {/* Right neon line - curved pattern */}
        <svg className="absolute h-full w-full" preserveAspectRatio="none">
          <motion.path
            d="M110,0 C120,300 90,450 110,600 C130,750 80,900 110,1200 C120,1350 110,1500 120,1800"
            stroke="url(#rightLineGradient)"
            strokeWidth="2"
            fill="none"
            initial={{ pathLength: 0 }}
            style={{ 
              pathLength: rightLineProgress,
              filter: "drop-shadow(0 0 8px #ef233c) drop-shadow(0 0 12px #ef233c)",
              opacity: 0.8,
              strokeDasharray: "10 5"
            }}
          />
          <defs>
            <linearGradient id="rightLineGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#ef233c" stopOpacity="0.2" />
              <stop offset="50%" stopColor="#ef233c" stopOpacity="1" />
              <stop offset="100%" stopColor="#ef233c" stopOpacity="0.2" />
            </linearGradient>
          </defs>
        </svg>
        
        {/* Background noise texture */}
        <div 
          className="absolute inset-0 bg-center bg-cover opacity-10"
          style={{ 
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 2000 2000' fill='none'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.4'/%3E%3C/svg%3E")`,
            backgroundSize: '200px 200px',
          }}
        ></div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        {/* Hero Section */}
        <section ref={headingRef} className="mb-20 text-center">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={isHeadingInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.6 }}
            className="relative inline-block"
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              <span className="text-white">درباره</span>
              <span className="text-draugr-500 mx-3">دراگر</span>
            </h1>
            <div className="absolute -bottom-2 left-0 right-0 h-0.5 bg-gradient-to-r from-draugr-900/0 via-draugr-500 to-draugr-900/0"></div>
          </motion.div>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={isHeadingInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl text-gray-300 max-w-3xl mx-auto mt-8"
          >
            ما در دراگر با الهام از افسانه‌های اسکاندیناوی، محصولاتی منحصر به فرد و با کیفیت برای علاقه‌مندان به دنیای تاریک و اسرارآمیز ارائه می‌دهیم.
          </motion.p>
        </section>

        {/* Mission & Vision Section */}
        <section ref={missionRef} className="mb-20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              animate={isMissionInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }}
              transition={{ duration: 0.7 }}
              className="backdrop-blur-sm bg-gradient-to-b from-black/40 to-vampire-dark/40 p-8 rounded-xl border border-draugr-900/40 relative"
            >
              <div className="absolute top-0 right-0 w-10 h-10 border-t-2 border-r-2 border-draugr-500/40 rounded-tr-xl" />
              <div className="absolute bottom-0 left-0 w-10 h-10 border-b-2 border-l-2 border-draugr-500/40 rounded-bl-xl" />
              
              <h2 className="text-2xl font-bold mb-6 flex items-center">
                <span className="w-8 h-8 bg-draugr-900 rounded flex items-center justify-center mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-draugr-500" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                    <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                  </svg>
                </span>
                ماموریت ما
              </h2>
              <p className="text-gray-300 leading-relaxed">
                ماموریت ما ارائه محصولات منحصر به فرد و با کیفیت برای افرادی است که به دنبال تجربه‌ای متفاوت و اصیل هستند. ما تلاش می‌کنیم تا با الهام از داستان‌های اسطوره‌ای اسکاندیناوی، محصولاتی خلق کنیم که هویت و فرهنگ را به زندگی روزمره بیاورند.
              </p>
              
              <div className="mt-8 h-0.5 bg-gradient-to-r from-draugr-900/0 via-draugr-900/50 to-draugr-900/0"></div>
              
              <div className="mt-6 flex items-center">
                <span className="text-draugr-500 text-3xl font-bold">+۵</span>
                <span className="mr-3 text-gray-400">سال تجربه</span>
              </div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              animate={isMissionInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 30 }}
              transition={{ duration: 0.7 }}
              className="backdrop-blur-sm bg-gradient-to-b from-black/40 to-vampire-dark/40 p-8 rounded-xl border border-draugr-900/40 relative"
            >
              <div className="absolute top-0 right-0 w-10 h-10 border-t-2 border-r-2 border-draugr-500/40 rounded-tr-xl" />
              <div className="absolute bottom-0 left-0 w-10 h-10 border-b-2 border-l-2 border-draugr-500/40 rounded-bl-xl" />
              
              <h2 className="text-2xl font-bold mb-6 flex items-center">
                <span className="w-8 h-8 bg-draugr-900 rounded flex items-center justify-center mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-draugr-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </span>
                چشم‌انداز ما
              </h2>
              <p className="text-gray-300 leading-relaxed">
                چشم‌انداز ما ایجاد یک برند جهانی است که داستان‌های اسطوره‌ای را با طراحی مدرن و معاصر ترکیب می‌کند. ما می‌خواهیم محصولاتی ارائه دهیم که نه تنها کاربردی هستند، بلکه به خریداران ما این امکان را می‌دهند تا بخشی از فرهنگ غنی اسکاندیناوی را در زندگی خود داشته باشند.
              </p>
              
              <div className="mt-8 h-0.5 bg-gradient-to-r from-draugr-900/0 via-draugr-900/50 to-draugr-900/0"></div>
              
              <div className="mt-6 flex items-center">
                <span className="text-draugr-500 text-3xl font-bold">+۱۰۰۰</span>
                <span className="mr-3 text-gray-400">مشتری راضی</span>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Team Section */}
        <section ref={teamRef} className="mb-20">
          <motion.h2 
            initial={{ opacity: 0 }}
            animate={isTeamInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="text-3xl font-bold mb-12 text-center"
          >
            <span className="relative">
              تیم ما
              <span className="absolute -bottom-2 left-0 right-0 h-0.5 bg-gradient-to-r from-draugr-900/0 via-draugr-500 to-draugr-900/0"></span>
            </span>
          </motion.h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <motion.div 
                key={member.id}
                initial={{ opacity: 0, y: 30 }}
                animate={isTeamInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="group"
              >
                <div className="relative overflow-hidden rounded-xl bg-gradient-to-b from-black/60 to-vampire-dark/60 backdrop-blur-sm border border-gray-800 p-1">
                  {/* Glow Effect */}
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-draugr-900/0 via-draugr-500/40 to-draugr-900/0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  
                  <div className="relative rounded-lg overflow-hidden">
                    <div className="aspect-w-1 aspect-h-1">
                      <img 
                        src={member.image} 
                        alt={member.name}
                        className="w-full h-full object-cover transition-all duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-70"></div>
                    </div>
                    
                    <div className="absolute bottom-0 left-0 right-0 p-6">
                      <h3 className="text-xl font-bold text-white">{member.name}</h3>
                      <p className="text-draugr-400 mb-2">{member.role}</p>
                      <p className="text-gray-400 text-sm">{member.bio}</p>
                      
                      <motion.div 
                        initial={{ width: 0 }}
                        whileInView={{ width: '100%' }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="h-0.5 bg-gradient-to-r from-draugr-900/0 via-draugr-500/60 to-draugr-900/0 mt-4"
                      />
                      
                      <div className="flex mt-4 space-x-3 rtl:space-x-reverse">
                        <a href="#" className="w-8 h-8 rounded-full bg-draugr-900/80 flex items-center justify-center text-white hover:bg-draugr-800 transition-colors">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-twitter" viewBox="0 0 16 16">
                            <path d="M5.026 15c6.038 0 9.341-5.003 9.341-9.334 0-.14 0-.282-.006-.422A6.685 6.685 0 0 0 16 3.542a6.658 6.658 0 0 1-1.889.518 3.301 3.301 0 0 0 1.447-1.817 6.533 6.533 0 0 1-2.087.793A3.286 3.286 0 0 0 7.875 6.03a9.325 9.325 0 0 1-6.767-3.429 3.289 3.289 0 0 0 1.018 4.382A3.323 3.323 0 0 1 .64 6.575v.045a3.288 3.288 0 0 0 2.632 3.218 3.203 3.203 0 0 1-.865.115 3.23 3.23 0 0 1-.614-.057 3.283 3.283 0 0 0 3.067 2.277A6.588 6.588 0 0 1 .78 13.58a6.32 6.32 0 0 1-.78-.045A9.344 9.344 0 0 0 5.026 15z"/>
                          </svg>
                        </a>
                        <a href="#" className="w-8 h-8 rounded-full bg-draugr-900/80 flex items-center justify-center text-white hover:bg-draugr-800 transition-colors">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-linkedin" viewBox="0 0 16 16">
                            <path d="M0 1.146C0 .513.526 0 1.175 0h13.65C15.474 0 16 .513 16 1.146v13.708c0 .633-.526 1.146-1.175 1.146H1.175C.526 16 0 15.487 0 14.854V1.146zm4.943 12.248V6.169H2.542v7.225h2.401zm-1.2-8.212c.837 0 1.358-.554 1.358-1.248-.015-.709-.52-1.248-1.342-1.248-.822 0-1.359.54-1.359 1.248 0 .694.521 1.248 1.327 1.248h.016zm4.908 8.212V9.359c0-.216.016-.432.08-.586.173-.431.568-.878 1.232-.878.869 0 1.216.662 1.216 1.634v3.865h2.401V9.25c0-2.22-1.184-3.252-2.764-3.252-1.274 0-1.845.7-2.165 1.193v.025h-.016a5.54 5.54 0 0 1 .016-.025V6.169h-2.4c.03.678 0 7.225 0 7.225h2.4z"/>
                          </svg>
                        </a>
                        <a href="#" className="w-8 h-8 rounded-full bg-draugr-900/80 flex items-center justify-center text-white hover:bg-draugr-800 transition-colors">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-instagram" viewBox="0 0 16 16">
                            <path d="M8 0C5.829 0 5.556.01 4.703.048 3.85.088 3.269.222 2.76.42a3.917 3.917 0 0 0-1.417.923A3.927 3.927 0 0 0 .42 2.76C.222 3.268.087 3.85.048 4.7.01 5.555 0 5.827 0 8.001c0 2.172.01 2.444.048 3.297.04.852.174 1.433.372 1.942.205.526.478.972.923 1.417.444.445.89.719 1.416.923.51.198 1.09.333 1.942.372C5.555 15.99 5.827 16 8 16s2.444-.01 3.298-.048c.851-.04 1.434-.174 1.943-.372a3.916 3.916 0 0 0 1.416-.923c.445-.445.718-.891.923-1.417.197-.509.332-1.09.372-1.942C15.99 10.445 16 10.173 16 8s-.01-2.445-.048-3.299c-.04-.851-.175-1.433-.372-1.941a3.926 3.926 0 0 0-.923-1.417A3.911 3.911 0 0 0 13.24.42c-.51-.198-1.092-.333-1.943-.372C10.443.01 10.172 0 7.998 0h.003zm-.717 1.442h.718c2.136 0 2.389.007 3.232.046.78.035 1.204.166 1.486.275.373.145.64.319.92.599.28.28.453.546.598.92.11.281.24.705.275 1.485.039.843.047 1.096.047 3.231s-.008 2.389-.047 3.232c-.035.78-.166 1.203-.275 1.485a2.47 2.47 0 0 1-.599.919c-.28.28-.546.453-.92.598-.28.11-.704.24-1.485.276-.843.038-1.096.047-3.232.047s-2.39-.009-3.233-.047c-.78-.036-1.203-.166-1.485-.276a2.478 2.478 0 0 1-.92-.598 2.48 2.48 0 0 1-.6-.92c-.109-.281-.24-.705-.275-1.485-.038-.843-.046-1.096-.046-3.233 0-2.136.008-2.388.046-3.231.036-.78.166-1.204.276-1.486.145-.373.319-.64.599-.92.28-.28.546-.453.92-.598.282-.11.705-.24 1.485-.276.738-.034 1.024-.044 2.515-.045v.002zm4.988 1.328a.96.96 0 1 0 0 1.92.96.96 0 0 0 0-1.92zm-4.27 1.122a4.109 4.109 0 1 0 0 8.217 4.109 4.109 0 0 0 0-8.217zm0 1.441a2.667 2.667 0 1 1 0 5.334 2.667 2.667 0 0 1 0-5.334z"/>
                          </svg>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
        
        {/* Join Us CTA */}
        <section className="text-center max-w-4xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true, margin: "-100px 0px" }}
            className="backdrop-blur-sm bg-gradient-to-b from-black/40 to-vampire-dark/40 p-10 rounded-2xl border border-draugr-900/40 relative overflow-hidden"
          >
            {/* Corner accents */}
            <div className="absolute top-0 right-0 w-16 h-16 border-t-2 border-r-2 border-draugr-500/40 rounded-tr-2xl" />
            <div className="absolute bottom-0 left-0 w-16 h-16 border-b-2 border-l-2 border-draugr-500/40 rounded-bl-2xl" />
            
            <h2 className="text-3xl font-bold mb-6">با ما همراه شوید</h2>
            <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
              به دنیای اسرارآمیز دراگر بپیوندید و از آخرین محصولات و تخفیف‌های ویژه ما باخبر شوید. ما به دنبال گسترش خانواده دراگر هستیم.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <motion.button 
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="px-8 py-3.5 bg-gradient-to-r from-draugr-800 to-draugr-600 hover:from-draugr-700 hover:to-draugr-500 text-white font-medium rounded-lg relative overflow-hidden group"
              >
                <span className="relative z-10">عضویت در خبرنامه</span>
                <span className="absolute inset-0 w-full bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full animate-shimmer"></span>
              </motion.button>
              
              <motion.button 
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="px-8 py-3.5 bg-black/50 border border-draugr-900/60 hover:border-draugr-500/60 text-white font-medium rounded-lg"
              >
                ارتباط با ما
              </motion.button>
            </div>
          </motion.div>
        </section>
      </div>
    </div>
  );
};

export default AboutPage; 