import React from 'react';
import { motion } from 'framer-motion';

// Example symbols (you can replace these with actual SVG paths or characters)
const SYMBOLS = [
  '룬', // Example Rune (Placeholder)
  '💀', // Skull
  '✧', // Sparkle/Ritual Mark
  '⊕', // Alternate Ritual Mark
  ' চক্র ', // Chakra/Wheel (Placeholder for more complex symbol)
];

const RitualSymbol = ({ index, totalSymbols }) => {
  const symbol = SYMBOLS[index % SYMBOLS.length];
  const size = Math.random() * 30 + 20; // Random size between 20px and 50px
  const duration = Math.random() * 20 + 30; // Random rotation duration (30-50s)
  const initialRotation = Math.random() * 360;
  const randomX = Math.random() * 100; // vw
  const randomY = Math.random() * 100; // vh

  return (
    <motion.div
      className="absolute text-bloodRed pointer-events-none"
      style={{
        left: `${randomX}vw`,
        top: `${randomY}vh`,
        fontSize: `${size}px`,
        opacity: 0.05, // Very low opacity
      }}
      initial={{ rotate: initialRotation, scale: 0.8 }}
      animate={{
        rotate: initialRotation + 360,
        scale: [0.8, 0.9, 0.8], // Subtle pulse
        opacity: [0.03, 0.07, 0.03], // Subtle glow/pulse opacity
      }}
      transition={{
        rotate: {
          duration: duration,
          repeat: Infinity,
          ease: "linear",
        },
        scale: {
          duration: 5, // Pulse duration
          repeat: Infinity,
          ease: "easeInOut",
        },
        opacity: {
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
        }
      }}
    >
      {symbol}
    </motion.div>
  );
};

export default RitualSymbol; 