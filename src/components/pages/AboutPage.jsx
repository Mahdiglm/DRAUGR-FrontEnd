import React, { useState, useEffect, useRef, Suspense } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { 
  OrbitControls, 
  Sphere,
  Box,
  useHelper,
  SpotLight,
  SpotLightShadow
} from '@react-three/drei';
import * as THREE from 'three';

// Simple skull component - easily visible and follows cursor
const NeonSkull = ({ position, cursorPoint, index, count }) => {
  const groupRef = useRef();
  const skullRef = useRef();
  const glowRef = useRef();
  
  // Define the base position for this skull
  const baseX = position[0];
  const baseY = position[1];
  const baseZ = position[2];
  
  // Set different speeds for different skulls
  const speed = 0.05 - (index * 0.005);
  
  // Use frame to animate the skull
  useFrame(({ clock }) => {
    const time = clock.getElapsedTime();
    
    // Get cursor position (normalized from -1 to 1)
    const targetX = baseX + (cursorPoint.x * 0.6);
    const targetY = baseY + (cursorPoint.y * 0.6);
    
    // Add subtle floating animation
    const floatX = baseX + Math.sin(time * 0.5 + index * 1.5) * 0.3;
    const floatY = baseY + Math.cos(time * 0.5 + index * 1.5) * 0.2;
    
    // Combine cursor following with floating animation
    if (groupRef.current) {
      groupRef.current.position.x = THREE.MathUtils.lerp(groupRef.current.position.x, targetX + floatX - baseX, speed);
      groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, targetY + floatY - baseY, speed);
    
      // Rotation effect - skull always faces the camera but with some playful movement
      groupRef.current.rotation.y = Math.sin(time * 0.2 + index) * 0.5;
      groupRef.current.rotation.x = Math.cos(time * 0.3 + index) * 0.2;
      
      // Pulse the glow intensity
      if (glowRef.current && glowRef.current.material) {
        glowRef.current.material.opacity = 0.3 + Math.sin(time * 2 + index) * 0.1;
      }
      
      // Pulse the skull color intensity
      if (skullRef.current && skullRef.current.material) {
        skullRef.current.material.emissiveIntensity = 0.8 + Math.sin(time + index) * 0.3;
      }
    }
  });
  
  return (
    <group ref={groupRef} position={[baseX, baseY, baseZ]}>
      {/* Main skull body - a simple box for now */}
      <mesh ref={skullRef} castShadow>
        <boxGeometry args={[0.8, 1, 0.7]} />
        <meshStandardMaterial 
          color="#ff0000" 
          emissive="#ff0000"
          emissiveIntensity={1}
          roughness={0.3} 
          metalness={0.7}
        />
      </mesh>
      
      {/* Eye sockets */}
      <mesh position={[0.2, 0.2, 0.36]} rotation={[0, 0, 0]}>
        <boxGeometry args={[0.2, 0.15, 0.1]} />
        <meshStandardMaterial color="black" roughness={1} />
      </mesh>
      
      <mesh position={[-0.2, 0.2, 0.36]} rotation={[0, 0, 0]}>
        <boxGeometry args={[0.2, 0.15, 0.1]} />
        <meshStandardMaterial color="black" roughness={1} />
      </mesh>
      
      {/* Nose cavity */}
      <mesh position={[0, -0.05, 0.36]} rotation={[0, 0, 0]}>
        <boxGeometry args={[0.2, 0.2, 0.1]} />
        <meshStandardMaterial color="black" roughness={1} />
      </mesh>
      
      {/* Teeth row */}
      <mesh position={[0, -0.3, 0.36]} rotation={[0, 0, 0]}>
        <boxGeometry args={[0.5, 0.1, 0.1]} />
        <meshStandardMaterial color="white" roughness={0.3} />
      </mesh>
      
      {/* Outer glow effect */}
      <mesh ref={glowRef}>
        <sphereGeometry args={[0.7, 16, 16]} />
        <meshBasicMaterial 
          color="#ff3333" 
          transparent={true}
          opacity={0.3}
          side={THREE.BackSide}
        />
      </mesh>
    </group>
  );
};

// Neon line component
const NeonLine = ({ start, end, thickness = 0.05, color = "#ff0000" }) => {
  const ref = useRef();
  
  useFrame(({ clock }) => {
    if (ref.current && ref.current.material) {
      const time = clock.getElapsedTime();
      // Pulse effect
      ref.current.material.emissiveIntensity = 1 + Math.sin(time * 2) * 0.3;
    }
  });
  
  // Calculate the midpoint and length
  const midX = (start[0] + end[0]) / 2;
  const midY = (start[1] + end[1]) / 2;
  const midZ = (start[2] + end[2]) / 2;
  
  // Calculate the length using distance formula
  const length = Math.sqrt(
    Math.pow(end[0] - start[0], 2) +
    Math.pow(end[1] - start[1], 2) +
    Math.pow(end[2] - start[2], 2)
  );
  
  // Calculate rotation to point from start to end
  const direction = new THREE.Vector3(
    end[0] - start[0],
    end[1] - start[1],
    end[2] - start[2]
  ).normalize();
  
  // Create a quaternion for rotation
  const quaternion = new THREE.Quaternion();
  quaternion.setFromUnitVectors(
    new THREE.Vector3(0, 0, 1), // Default cylinder orientation
    direction
  );
  
  // Convert quaternion to Euler angles
  const euler = new THREE.Euler();
  euler.setFromQuaternion(quaternion);
  
  return (
    <mesh 
      ref={ref}
      position={[midX, midY, midZ]} 
      rotation={[euler.x, euler.y, euler.z]}
    >
      <cylinderGeometry args={[thickness, thickness, length, 8]} />
      <meshStandardMaterial 
        color={color} 
        emissive={color}
        emissiveIntensity={1}
        roughness={0.2}
        metalness={0.8}
      />
    </mesh>
  );
};

// The main scene with all 3D elements
const AboutScene = () => {
  const { mouse } = useThree();
  const cursorPoint = useRef({ x: 0, y: 0 });
  
  // Update cursor position
  useFrame(() => {
    cursorPoint.current = { x: mouse.x, y: mouse.y };
  });
  
  // Create multiple skulls in a scattered pattern
  const skullCount = 6; // Reduced for better performance
  const skulls = Array.from({ length: skullCount }).map((_, i) => {
    const angle = (i / skullCount) * Math.PI * 2;
    const radius = 3;
    const x = Math.cos(angle) * radius;
    const y = Math.sin(angle) * radius;
    const z = -3;
    return { position: [x, y, z], index: i };
  });
  
  // Define start and end points for the neon line
  const lineStart = [-4, -2, -3];
  const lineEnd = [4, 2, -3];
  
  return (
    <>
      {/* Red ambient light */}
      <ambientLight intensity={0.5} color="#ffcccc" />
      
      {/* Key spotlight for dramatic lighting */}
      <spotLight 
        position={[0, 5, 10]} 
        angle={0.3} 
        penumbra={0.6} 
        intensity={2} 
        color="#ff3333" 
      />
      
      {/* Fill lights for better visibility */}
      <pointLight position={[-5, 0, 5]} intensity={0.5} color="#ff8080" />
      <pointLight position={[5, 0, 5]} intensity={0.5} color="#ff8080" />
      
      {/* Skulls that follow cursor */}
      {skulls.map((skull, i) => (
        <NeonSkull 
          key={i} 
          position={skull.position} 
          cursorPoint={cursorPoint.current} 
          index={skull.index}
          count={skullCount}
        />
      ))}
      
      {/* Main neon line from start to end */}
      <NeonLine start={lineStart} end={lineEnd} thickness={0.05} />
      
      {/* Optional camera controls - disabled for now as they can cause issues */}
      <OrbitControls 
        enableZoom={false} 
        enablePan={false} 
        enableRotate={false} 
      />
    </>
  );
};

// Interactive bio component
const BioPanelSection = ({ icon, title, content, delay = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.5,
        delay: delay,
        ease: [0, 0.71, 0.2, 1.01]
      }}
      className="flex flex-col bg-gradient-to-br from-black to-draugr-900/40 rounded-lg p-5 backdrop-blur-sm 
                 border border-draugr-800/50 shadow-horror transition-all hover:shadow-[0_0_15px_rgba(255,0,0,0.5)]"
    >
      <div className="flex items-center mb-3">
        <div className="w-8 h-8 rounded-full bg-draugr-900 flex items-center justify-center mr-3 text-draugr-500">
          {icon}
        </div>
        <h3 className="text-xl font-semibold text-draugr-500">{title}</h3>
      </div>
      <div className="text-gray-300 text-sm">{content}</div>
    </motion.div>
  );
};

// Main About Page component
const AboutPage = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const canvasRef = useRef(null);
  
  // Track mouse movement for additional effects
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({
        x: e.clientX,
        y: e.clientY
      });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);
  
  // Convert mousePosition to a form usable by Framer Motion
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  // Smoothing the motion values
  const smoothMouseX = useSpring(mouseX, { damping: 50, stiffness: 400 });
  const smoothMouseY = useSpring(mouseY, { damping: 50, stiffness: 400 });
  
  // Update motion values when mouse position changes
  useEffect(() => {
    mouseX.set(mousePosition.x);
    mouseY.set(mousePosition.y);
  }, [mousePosition, mouseX, mouseY]);

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-black">
      {/* Background 3D scene */}
      <div className="fixed inset-0 w-full h-full -z-10">
        <Canvas
          ref={canvasRef}
          shadows
          camera={{ position: [0, 0, 10], fov: 60 }}
          gl={{ antialias: true }}
          style={{ background: 'black' }}
        >
          <AboutScene />
        </Canvas>
      </div>
      
      {/* Cursor glow effect */}
      <motion.div 
        className="fixed w-28 h-28 rounded-full pointer-events-none z-50 mix-blend-screen"
        style={{
          background: 'radial-gradient(circle, rgba(255,0,0,0.8) 0%, rgba(255,0,0,0) 70%)',
          x: smoothMouseX,
          y: smoothMouseY,
          translateX: '-50%',
          translateY: '-50%'
        }}
      />
      
      {/* Vignette effect */}
      <div className="fixed inset-0 pointer-events-none" 
        style={{
          background: 'radial-gradient(circle at center, transparent 20%, #000 100%)',
          zIndex: 0
        }} 
      />
      
      {/* Content container */}
      <div className="container mx-auto px-4 py-16 relative z-10">
        <div className="max-w-4xl mx-auto">
          {/* Main heading with neon glow */}
          <motion.h1 
            className="text-4xl md:text-6xl font-bold mb-8 text-draugr-500 text-shadow-horror text-center"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            درباره فروشگاه دراوگر
          </motion.h1>
          
          {/* Introduction text */}
          <motion.div 
            className="mb-12 text-center text-gray-300"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <p className="text-xl mb-4">دنیای وحشت و تاریکی در انتظار شماست</p>
            <p className="mb-8">فروشگاه دراوگر جایی برای کسانی است که از تاریکی نمی‌ترسند، بلکه آن را در آغوش می‌کشند. ما مجموعه‌ای از محصولات منحصر به فرد با الهام از افسانه‌های ترسناک اسکاندیناوی را ارائه می‌دهیم.</p>
          </motion.div>
          
          {/* Bio panels */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            <BioPanelSection 
              icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clipRule="evenodd" />
              </svg>}
              title="تاریخچه ما"
              content="فروشگاه دراوگر در سال ۱۴۰۲ با هدف ارائه محصولاتی آغاز به کار کرد که از افسانه‌های نورس و موجودات ترسناک اسکاندیناوی الهام گرفته شده‌اند. دراوگر، موجودات مردگان زنده‌ای هستند که در افسانه‌های نورس، به عنوان نگهبانان گنج‌های خود، حتی پس از مرگ، به زندگی ادامه می‌دهند."
              delay={0.3}
            />
            
            <BioPanelSection 
              icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zm7-10a1 1 0 01.707.293l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 8l-3.293-3.293A1 1 0 0112 4z" clipRule="evenodd" />
              </svg>}
              title="محصولات منحصر به فرد"
              content="ما محصولاتی را طراحی می‌کنیم که روح و جوهره افسانه‌های وحشتناک را به زندگی روزمره شما می‌آورند. از لباس‌های دست‌ساز گرفته تا لوازم تزئینی خانه، هر محصول با دقت و احترام به سنت‌های باستانی طراحی شده است."
              delay={0.4}
            />
            
            <BioPanelSection 
              icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
              </svg>}
              title="تیم ما"
              content="تیم دراوگر متشکل از طراحان، صنعتگران و فناورانی است که عشق به فرهنگ‌های باستانی و دنیای وحشت آنها را گرد هم آورده است. ما با بهره‌گیری از فناوری‌های نوین، محصولاتی خلق می‌کنیم که پل‌ارتباطی بین گذشته و آینده هستند."
              delay={0.5}
            />
            
            <BioPanelSection 
              icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>}
              title="تعهد ما"
              content="ما متعهد هستیم که محصولاتی با کیفیت و اصیل را با الهام از افسانه‌های نورس به مشتریان خود ارائه دهیم. تمام محصولات ما با موادی با کیفیت و با دقت فراوان ساخته می‌شوند تا تجربه‌ای بی‌نظیر را برای شما فراهم کنند."
              delay={0.6}
            />
          </div>
          
          {/* Interactive element - FAQ accordions */}
          <motion.div 
            className="bg-gradient-to-br from-black to-draugr-900/40 rounded-lg p-6 backdrop-blur-sm border border-draugr-800/50 mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.7 }}
          >
            <h2 className="text-2xl font-bold mb-6 text-draugr-500">سوالات متداول</h2>
            <FAQ />
          </motion.div>
          
          {/* Call to action */}
          <motion.div 
            className="text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.9 }}
          >
            <p className="text-lg mb-4 text-gray-300">آیا آماده‌اید تا به دنیای وحشت و افسانه‌های نورس وارد شوید؟</p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gradient-to-r from-draugr-900 to-draugr-700 text-white py-3 px-8 rounded-lg shadow-horror hover:shadow-[0_0_15px_rgba(255,0,0,0.7)] transition-all duration-300"
            >
              فروشگاه را ببینید
            </motion.button>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

// Expandable FAQ component
const FAQ = () => {
  const [activeIndex, setActiveIndex] = useState(null);
  
  const faqs = [
    {
      question: "دراوگر چیست؟",
      answer: "دراوگر (Draugr) موجودی افسانه‌ای در اساطیر اسکاندیناوی است که به عنوان مردگان زنده‌ای توصیف می‌شود که پس از مرگ، به منظور محافظت از گنج‌های خود یا انتقام از دشمنانشان، به زندگی ادامه می‌دهند."
    },
    {
      question: "آیا محصولات شما دست‌ساز هستند؟",
      answer: "بله، بسیاری از محصولات ما توسط صنعتگران ماهر به صورت دست‌ساز تولید می‌شوند. ما به کیفیت و اصالت محصولات خود افتخار می‌کنیم و تلاش می‌کنیم تا روح واقعی افسانه‌های اسکاندیناوی را در آنها منعکس کنیم."
    },
    {
      question: "آیا به خارج از ایران هم ارسال دارید؟",
      answer: "بله، ما به بسیاری از کشورها ارسال داریم. هزینه و زمان ارسال بسته به مقصد متفاوت است. برای اطلاعات بیشتر می‌توانید با پشتیبانی ما تماس بگیرید."
    },
    {
      question: "محصولات شما برای چه رده سنی مناسب است؟",
      answer: "محصولات ما عمدتاً برای بزرگسالان و نوجوانان علاقه‌مند به فرهنگ‌های باستانی، اساطیر نورس و ژانر وحشت طراحی شده‌اند. برخی از محصولات ما ممکن است برای کودکان مناسب نباشند."
    }
  ];
  
  return (
    <div className="space-y-4">
      {faqs.map((faq, index) => (
        <div key={index} className="border-b border-draugr-900 pb-4">
          <button
            onClick={() => setActiveIndex(activeIndex === index ? null : index)}
            className="flex justify-between items-center w-full text-right"
          >
            <span className="text-white font-semibold">{faq.question}</span>
            <svg
              className={`w-5 h-5 text-draugr-500 transform transition-transform duration-300 ${activeIndex === index ? 'rotate-180' : ''}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>
          
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{
              height: activeIndex === index ? 'auto' : 0,
              opacity: activeIndex === index ? 1 : 0
            }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <p className="pt-4 text-gray-400 text-sm">{faq.answer}</p>
          </motion.div>
        </div>
      ))}
    </div>
  );
};

export default AboutPage; 