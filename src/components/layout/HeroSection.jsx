import { Canvas } from '@react-three/fiber'
import { OrbitControls, Stars } from '@react-three/drei'
import { motion } from 'framer-motion'
import Portal from '../shared/Portal' // Corrected import path
import { Link } from 'react-router-dom';

export default function HeroSection() {
  return (
    <div className="relative w-full h-screen bg-black overflow-hidden">
      <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
        <ambientLight intensity={0.4} />
        <pointLight position={[10, 10, 10]} />
        <Stars />
        <Portal />
        <OrbitControls enableZoom={false} />
      </Canvas>

      {/* Overlay UI */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center z-10 text-white px-4">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-4xl md:text-6xl font-bold mb-4 text-shadow-horror"
        >
          <span className="text-purple-500">شکاف</span> باز است
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="text-lg md:text-xl max-w-xl mb-6 text-gray-300"
        >
          دنیایی متفاوت از دنیای خود را کاوش کنید.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1 }}
        >
          <Link to="/shop">
            <motion.button
              whileHover={{ 
                scale: 1.1,
                boxShadow: '0 0 25px rgba(139, 92, 246, 0.7), 0 0 10px rgba(139, 92, 246, 0.5)',
                textShadow: '0 0 8px rgba(255, 255, 255, 0.8)'
              }}
              whileTap={{ scale: 0.95 }}
              className="bg-purple-700 hover:bg-purple-600 text-white font-semibold px-8 py-3 rounded-xl shadow-xl transition-all duration-300 ease-in-out"
            >
              ورود به شکاف
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </div>
  )
} 