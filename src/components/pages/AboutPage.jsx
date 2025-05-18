// AboutPage.jsx - Enhanced with 3D skulls and cyberpunk effects
import React, { useRef, useState, useEffect, Suspense } from 'react';
import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, useGLTF, Environment, Float } from '@react-three/drei';
import { EffectComposer, Bloom, Noise, Glitch } from '@react-three/postprocessing';
import { GlitchMode } from 'postprocessing';
import * as THREE from 'three';

// Import team member images
import teamMember1 from '../../assets/Team-Member-1.jpg';
import teamMember2 from '../../assets/Team-Member-2.jpg';

// Fallback images
const fallbackTeam = "https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60";
const fallbackTeam3 = "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60";

// Preload 3D model
useGLTF.preload('/models/gltf/Skull.glb');

// Skull model component
const Skull = ({ position, rotation, scale, mousePosition }) => {
  const skullRef = useRef();
  const { nodes, materials } = useGLTF('/models/gltf/Skull.glb');
  
  // Follow mouse with slight delay
  useFrame(() => {
    if (skullRef.current && mousePosition.current) {
      skullRef.current.rotation.y = THREE.MathUtils.lerp(
        skullRef.current.rotation.y,
        (mousePosition.current.x * Math.PI) / 5,
        0.05
      );
      skullRef.current.rotation.x = THREE.MathUtils.lerp(
        skullRef.current.rotation.x,
        (mousePosition.current.y * Math.PI) / 10,
        0.05
      );
    }
  });
  
  return (
    <mesh
      ref={skullRef}
      position={position}
      rotation={rotation}
      scale={scale}
      geometry={nodes.Skull.geometry}
    >
      <meshPhysicalMaterial 
        color="#8a0303"
        metalness={0.7}
        roughness={0.2}
        emissive="#ff0000"
        emissiveIntensity={0.2}
        envMapIntensity={1.5}
      />
    </mesh>
  );
};

// Enhanced Neon Line component
const NeonLine = ({ startPosition, endPosition, color, thickness = 1, pulsateSpeed = 2 }) => {
  const lineRef = useRef();
  
  useFrame(({ clock }) => {
    if (lineRef.current) {
      const time = clock.getElapsedTime();
      // Create pulsating effect
      lineRef.current.material.opacity = THREE.MathUtils.lerp(
        lineRef.current.material.opacity,
        Math.sin(time * pulsateSpeed) * 0.3 + 0.7,
        0.1
      );
      lineRef.current.material.emissiveIntensity = THREE.MathUtils.lerp(
        lineRef.current.material.emissiveIntensity,
        Math.sin(time * pulsateSpeed) * 0.7 + 1.8,
        0.1
      );
    }
  });
  
  // Create line vertices with additional segments for a more cyberpunk look
  const points = [];
  const segments = 2; // Add randomness to line path
  
  // Start point
  points.push(...startPosition);
  
  // Add midpoints for zigzag effect
  for (let i = 1; i < segments; i++) {
    const t = i / segments;
    const midX = THREE.MathUtils.lerp(startPosition[0], endPosition[0], t);
    const midY = THREE.MathUtils.lerp(startPosition[1], endPosition[1], t);
    const midZ = THREE.MathUtils.lerp(startPosition[2], endPosition[2], t);
    
    // Add some randomness to make it look more electric/cyberpunk
    const jitter = (Math.random() - 0.5) * 2;
    points.push(midX + jitter, midY, midZ);
  }
  
  // End point
  points.push(...endPosition);
  
  return (
    <mesh ref={lineRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          array={new Float32Array(points)}
          count={points.length / 3}
          itemSize={3}
        />
      </bufferGeometry>
      <lineBasicMaterial 
        color={color} 
        linewidth={thickness} 
        opacity={0.8} 
        transparent={true} 
        emissive={color} 
        emissiveIntensity={1.8} 
      />
    </mesh>
  );
};

// Background scene component
const BackgroundScene = () => {
  const mousePosition = useRef({ x: 0, y: 0 });
  const { viewport } = useThree();
  
  useEffect(() => {
    const updateMousePosition = (e) => {
      // Normalize mouse position between -1 and 1
      mousePosition.current = {
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: -(e.clientY / window.innerHeight) * 2 + 1,
      };
    };
    
    window.addEventListener('mousemove', updateMousePosition);
    
    return () => {
      window.removeEventListener('mousemove', updateMousePosition);
    };
  }, []);
  
  // Generate skulls
  const skulls = [];
  for (let i = 0; i < 7; i++) {
    const x = (Math.random() - 0.5) * 10;
    const y = (Math.random() - 0.5) * 5;
    const z = Math.random() * -10 - 5;
    const scale = Math.random() * 0.3 + 0.2; // Smaller skulls
    
    skulls.push(
      <Float key={`skull-${i}`} speed={1.5} rotationIntensity={0.8} floatIntensity={0.5}>
        <Skull
          position={[x, y, z]}
          rotation={[0, Math.random() * Math.PI, 0]}
          scale={scale}
          mousePosition={mousePosition}
        />
      </Float>
    );
  }
  
  // Generate neon lines
  const lines = [];
  const neonColors = [
    '#ff2a6d', '#05d9e8', '#d1f7ff', '#ff0055', 
    '#39ff14', '#00ffff', '#ff00ff', '#ff3131'
  ];
  
  for (let i = 0; i < 25; i++) {
    const x = (Math.random() - 0.5) * 20;
    const startY = 10;
    const endY = -10;
    const z = Math.random() * -15 - 5;
    const color = neonColors[Math.floor(Math.random() * neonColors.length)];
    const thickness = Math.random() * 2 + 1;
    const pulsateSpeed = Math.random() * 2 + 1;
    
    lines.push(
      <NeonLine
        key={`line-${i}`}
        startPosition={[x, startY, z]}
        endPosition={[x, endY, z]}
        color={color}
        thickness={thickness}
        pulsateSpeed={pulsateSpeed}
      />
    );
  }
  
  return (
    <>
      <ambientLight intensity={0.2} />
      <pointLight position={[5, 5, 5]} intensity={0.8} color="#ff0000" />
      <pointLight position={[-5, -5, 5]} intensity={0.5} color="#0000ff" />
      <pointLight position={[0, 3, 3]} intensity={0.3} color="#ff00ff" />
      {skulls}
      {lines}
      <fog attach="fog" args={['#000', 5, 30]} />
    </>
  );
};

const BackgroundSceneWrapper = () => {
  return (
    <div className="fixed inset-0 -z-10">
      <Canvas camera={{ position: [0, 0, 10], fov: 50 }}>
        <Suspense fallback={null}>
          <BackgroundScene />
          <Environment preset="night" />
          
          {/* Post-processing effects */}
          <EffectComposer>
            {/* Bloom effect for glowing neon */}
            <Bloom 
              luminanceThreshold={0.2} 
              luminanceSmoothing={0.9} 
              intensity={1.5} 
            />
            {/* Subtle noise for a digital/cyberpunk feel */}
            <Noise opacity={0.05} />
            {/* Occasional glitch effect */}
            <Glitch 
              delay={[5, 10]} // Random delay between glitches
              duration={[0.1, 0.3]} // Random duration
              strength={0.03} // Subtle glitch effect
              mode={GlitchMode.CONSTANT_MILD}
            />
          </EffectComposer>
        </Suspense>
      </Canvas>
      <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/40 to-black/90 z-10" />
    </div>
  );
};

const AboutPage = () => {
  const [scrollY, setScrollY] = useState(0);
  const aboutRef = useRef(null);
  const missionRef = useRef(null);
  const valuesRef = useRef(null);
  const teamRef = useRef(null);
  const { scrollYProgress } = useScroll();
  
  const missionInView = useInView(missionRef, { once: false, amount: 0.3 });
  const valuesInView = useInView(valuesRef, { once: false, amount: 0.3 });
  const teamInView = useInView(teamRef, { once: false, amount: 0.3 });
  
  // Parallax effect
  const y = useTransform(scrollYProgress, [0, 1], [0, 300]);
  const opacity = useTransform(scrollYProgress, [0, 0.3], [1, 0.3]);
  
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    
    window.addEventListener("scroll", handleScroll);
    
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Interactive timeline data
  const historyMilestones = [
    {
      year: "2013",
      title: "آغاز سفر",
      description: "فروشگاه دراگر با یک فروشگاه کوچک و عرضه محصولات دست‌ساز کار خود را آغاز کرد."
    },
    {
      year: "2015",
      title: "گسترش محصولات",
      description: "با توسعه کاتالوگ محصولات، فروشگاه دراگر محصولات منحصر به فرد و کمیاب را به مجموعه خود اضافه کرد."
    },
    {
      year: "2018",
      title: "تأسیس فروشگاه آنلاین",
      description: "با راه‌اندازی وب‌سایت، محصولات منحصر به فرد ما در دسترس مشتریان سراسر کشور قرار گرفت."
    },
    {
      year: "2021",
      title: "برند جهانی",
      description: "دراگر به یک برند شناخته شده در عرصه محصولات خاص و منحصر به فرد تبدیل شد."
    },
    {
      year: "2023",
      title: "امروز",
      description: "ما به ارائه محصولات با کیفیت و خدمات برتر به مشتریان خود افتخار می‌کنیم."
    }
  ];

  // Interactive value cards
  const valueCards = [
    {
      icon: "🔥",
      title: "کیفیت برتر",
      description: "ما فقط محصولات با کیفیت بالا و منحصر به فرد را ارائه می‌دهیم."
    },
    {
      icon: "🛡️",
      title: "اصالت",
      description: "تمام محصولات ما اصیل و منحصر به فرد هستند."
    },
    {
      icon: "🌙",
      title: "نوآوری",
      description: "ما همیشه به دنبال راه‌های جدید برای بهبود محصولات و خدمات خود هستیم."
    },
    {
      icon: "⚔️",
      title: "تعهد",
      description: "ما متعهد به ارائه بهترین خدمات به مشتریان خود هستیم."
    }
  ];

  // Team members data
  const teamMembers = [
    {
      image: teamMember1 || fallbackTeam,
      name: "علی رضایی",
      role: "بنیانگذار و مدیرعامل",
      bio: "علی بیش از ۱۰ سال تجربه در صنعت محصولات فرهنگی را دارد و با چشم‌انداز خاص خود دراگر را تأسیس کرد."
    },
    {
      image: teamMember2 || fallbackTeam,
      name: "سارا محمدی",
      role: "مدیر محصول",
      bio: "سارا مسئول انتخاب و تهیه محصولات منحصر به فرد برای مجموعه دراگر است."
    },
    {
      image: fallbackTeam3, // Use the fallback image directly
      name: "مهدی احمدی",
      role: "مدیر خلاقیت",
      bio: "مهدی با تخصص در طراحی، مسئول خلق تجربه‌های بصری منحصر به فرد برای برند دراگر است."
    }
  ];

  const [activeMilestone, setActiveMilestone] = useState(0);
  const [activeTeamMember, setActiveTeamMember] = useState(null);

  return (
    <div className="bg-midnight text-white min-h-screen" ref={aboutRef}>
      {/* 3D Background with skulls and neon lines */}
      <BackgroundSceneWrapper />
      
      {/* Hero Section */}
      <motion.section 
        className="relative h-[70vh] md:h-[80vh] flex items-center justify-center overflow-hidden"
      >
        <div className="container mx-auto px-4 z-10 relative">
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-4 text-draugr-500 text-shadow-horror">درباره دراگر</h1>
            <p className="text-xl md:text-2xl max-w-3xl mx-auto text-white">داستان ما، افراد ما، و چیزهایی که برای ما مهم است.</p>
            
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 1 }}
              className="mt-8"
            >
              <button 
                onClick={() => {
                  window.scrollTo({
                    top: missionRef.current.offsetTop - 100,
                    behavior: 'smooth'
                  });
                }}
                className="bg-draugr-800 text-white px-8 py-3 rounded-md hover:bg-draugr-700 transition duration-300 font-medium"
              >
                داستان ما را بخوانید
              </button>
            </motion.div>
          </motion.div>
        </div>
        
        {/* Animated scroll indicator */}
        <motion.div 
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          animate={{ 
            y: [0, 10, 0],
            opacity: [0.4, 1, 0.4]
          }}
          transition={{ 
            repeat: Infinity, 
            duration: 2
          }}
        >
          <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </motion.div>
      </motion.section>
      
      {/* Mission Section */}
      <section 
        ref={missionRef} 
        className="py-16 md:py-24 relative"
      >
        <div className="container mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={missionInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto text-center"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-8 text-draugr-400">مأموریت ما</h2>
            <p className="text-xl leading-relaxed mb-8 text-gray-300">
              در دراگر، هدف ما ارائه محصولات منحصر به فرد و با کیفیت به مشتریانی است که به دنبال چیزی متفاوت هستند. ما باور داریم که هر فرد باید به اشیاء خاصی دسترسی داشته باشد که روح و شخصیت او را منعکس می‌کند.
            </p>
            <p className="text-xl leading-relaxed text-gray-300">
              محصولات ما با دقت انتخاب شده‌اند تا نیازهای خاص مشتریان‌مان را برآورده کنند. ما به پایداری، اصالت و کیفیت متعهد هستیم و همیشه به دنبال بهبود تجربه خرید مشتریان‌مان هستیم.
            </p>
          </motion.div>
        </div>
        
        {/* Interactive Timeline */}
        <div className="mt-20 md:mt-32 max-w-5xl mx-auto px-4">
          <motion.h3 
            initial={{ opacity: 0 }}
            animate={missionInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-2xl md:text-3xl font-bold mb-12 text-center text-draugr-400"
          >
            داستان ما
          </motion.h3>
          
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gradient-to-b from-draugr-900 to-draugr-600"></div>
            
            {historyMilestones.map((milestone, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                animate={missionInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.2 + index * 0.2 }}
                className={`relative flex items-center mb-16 ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}
                onMouseEnter={() => setActiveMilestone(index)}
              >
                <div className={`w-1/2 ${index % 2 === 0 ? 'pr-8 text-right' : 'pl-8 text-left'}`}>
                  <h4 className="text-xl md:text-2xl font-bold text-draugr-500 mb-2">{milestone.title}</h4>
                  <p className="text-gray-300">{milestone.description}</p>
                </div>
                
                <div className="absolute left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
                  <motion.div 
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold ${activeMilestone === index ? 'bg-draugr-500' : 'bg-gray-700'}`}
                    animate={{ 
                      scale: activeMilestone === index ? [1, 1.2, 1] : 1,
                      boxShadow: activeMilestone === index ? "0 0 15px rgba(220, 38, 38, 0.7)" : "none"
                    }}
                    transition={{ duration: 0.5 }}
                  >
                    {milestone.year}
                  </motion.div>
                </div>
                
                <div className="w-1/2"></div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Values Section */}
      <section 
        ref={valuesRef}
        className="py-16 md:py-24 bg-gradient-to-b from-vampire-dark to-black relative"
      >
        <div className="container mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={valuesInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-draugr-400">ارزش‌های ما</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              آنچه به ما انگیزه می‌دهد و ما را هدایت می‌کند
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {valueCards.map((card, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={valuesInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.1 + index * 0.1 }}
                whileHover={{ 
                  y: -10, 
                  boxShadow: "0 10px 25px rgba(0, 0, 0, 0.3), 0 0 10px rgba(220, 38, 38, 0.3)" 
                }}
                className="bg-gradient-to-b from-gray-900 to-black p-8 rounded-lg border border-draugr-900/20 shadow-lg hover:border-draugr-700/50 transition-all duration-300"
              >
                <div className="text-4xl mb-4">{card.icon}</div>
                <h3 className="text-xl font-bold mb-3 text-draugr-400">{card.title}</h3>
                <p className="text-gray-400">{card.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Team Section */}
      <section 
        ref={teamRef}
        className="py-16 md:py-24 bg-gradient-to-b from-black to-midnight relative"
      >
        <div className="container mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={teamInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-draugr-400">تیم ما</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              با افرادی آشنا شوید که دراگر را ممکن می‌سازند
            </p>
          </motion.div>
          
          <div className="flex flex-wrap justify-center gap-8">
            {teamMembers.map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={teamInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.5, delay: 0.2 + index * 0.2 }}
                whileHover={{ y: -10 }}
                className="w-full md:w-[300px] group perspective"
                onMouseEnter={() => setActiveTeamMember(index)}
                onMouseLeave={() => setActiveTeamMember(null)}
              >
                <motion.div 
                  className="relative preserve-3d transition-all duration-500 h-[400px]"
                  animate={{ 
                    rotateY: activeTeamMember === index ? 180 : 0
                  }}
                  transition={{ duration: 0.7 }}
                >
                  {/* Front Face */}
                  <div className="absolute inset-0 backface-hidden rounded-lg overflow-hidden">
                    <div className="h-full bg-gradient-to-b from-gray-900 to-black rounded-lg border border-draugr-900/20 overflow-hidden">
                      <div 
                        className="h-[250px] bg-cover bg-center"
                        style={{ backgroundImage: `url(${member.image})` }}
                      ></div>
                      <div className="p-5 text-center">
                        <h3 className="text-xl font-bold mb-1 text-draugr-400">{member.name}</h3>
                        <p className="text-gray-300 mb-3">{member.role}</p>
                        <button 
                          className="text-sm text-draugr-500 flex items-center mx-auto"
                          onClick={() => setActiveTeamMember(index)}
                        >
                          <span>بیشتر بدانید</span>
                          <svg className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  {/* Back Face */}
                  <div className="absolute inset-0 backface-hidden rounded-lg overflow-hidden rotate-y-180">
                    <div className="h-full bg-gradient-to-b from-draugr-900/30 to-black rounded-lg border border-draugr-900/40 p-6 flex flex-col justify-center">
                      <h3 className="text-xl font-bold mb-2 text-draugr-400">{member.name}</h3>
                      <p className="text-gray-300 mb-4">{member.role}</p>
                      <p className="text-gray-400 mb-6">{member.bio}</p>
                      <div className="flex justify-center space-x-3 rtl:space-x-reverse">
                        <a href="#" className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center text-draugr-400 hover:bg-draugr-900 transition-colors">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
                          </svg>
                        </a>
                        <a href="#" className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center text-draugr-400 hover:bg-draugr-900 transition-colors">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                          </svg>
                        </a>
                        <a href="#" className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center text-draugr-400 hover:bg-draugr-900 transition-colors">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                          </svg>
                        </a>
                      </div>
                      <button 
                        className="mt-6 text-sm text-draugr-500 flex items-center mx-auto"
                        onClick={() => setActiveTeamMember(null)}
                      >
                        <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        <span>برگشت</span>
                      </button>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Contact CTA Section */}
      <section className="py-16 md:py-24 bg-gradient-to-b from-midnight to-black relative">
        <div className="container mx-auto px-4 text-center">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-draugr-400">با ما در ارتباط باشید</h2>
            <p className="text-xl text-gray-300 mb-10">
              ما مشتاق شنیدن نظرات شما هستیم. اگر سؤالی دارید یا به دنبال همکاری هستید، با ما تماس بگیرید.
            </p>
            <motion.div 
              className="flex flex-wrap justify-center gap-4"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <Link 
                to="/contact" 
                className="bg-draugr-800 hover:bg-draugr-700 text-white px-8 py-3 rounded-md transition duration-300 font-medium"
              >
                تماس با ما
              </Link>
              <Link 
                to="/shop" 
                className="bg-gray-800 hover:bg-gray-700 text-white px-8 py-3 rounded-md transition duration-300 font-medium"
              >
                مشاهده محصولات
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>
      
      {/* CSS for 3D card effect */}
      <style jsx>{`
        .perspective {
          perspective: 1000px;
        }
        
        .preserve-3d {
          transform-style: preserve-3d;
        }
        
        .backface-hidden {
          backface-visibility: hidden;
        }
        
        .rotate-y-180 {
          transform: rotateY(180deg);
        }
        
        .text-shadow-horror {
          text-shadow: 0 0 10px rgba(239, 35, 60, 0.7), 0 0 20px rgba(239, 35, 60, 0.4);
        }
      `}</style>
    </div>
  );
};

export default AboutPage; 