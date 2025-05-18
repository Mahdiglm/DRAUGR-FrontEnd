import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// Simple 3D skull component
const Skull = ({ position, index }) => {
  const skullRef = useRef();
  
  // Animation
  useFrame(({ clock, mouse }) => {
    const time = clock.getElapsedTime();
    
    if (skullRef.current) {
      // Follow mouse
      skullRef.current.position.x = position[0] + mouse.x * 2;
      skullRef.current.position.y = position[1] + mouse.y * 2;
      
      // Rotation animation
      skullRef.current.rotation.y = Math.sin(time * 0.5 + index) * 0.5;
      
      // Pulse size
      const scale = 1 + Math.sin(time + index) * 0.1;
      skullRef.current.scale.set(scale, scale, scale);
    }
  });
  
  return (
    <mesh ref={skullRef} position={position}>
      {/* Skull body */}
      <boxGeometry args={[1, 1.2, 1]} />
      <meshStandardMaterial 
        color="#ff0000" 
        emissive="#ff0000"
        emissiveIntensity={2}
        roughness={0.3} 
        metalness={0.7}
      />
      
      {/* Eyes */}
      <group position={[0, 0.2, 0.51]}>
        <mesh position={[0.25, 0, 0]}>
          <boxGeometry args={[0.2, 0.2, 0.1]} />
          <meshBasicMaterial color="black" />
        </mesh>
        <mesh position={[-0.25, 0, 0]}>
          <boxGeometry args={[0.2, 0.2, 0.1]} />
          <meshBasicMaterial color="black" />
        </mesh>
      </group>
    </mesh>
  );
};

// Neon line component
const NeonLine = () => {
  const lineRef = useRef();
  
  useFrame(({ clock }) => {
    const time = clock.getElapsedTime();
    if (lineRef.current && lineRef.current.material) {
      lineRef.current.material.emissiveIntensity = 1 + Math.sin(time) * 0.5;
    }
  });
  
  return (
    <mesh ref={lineRef} position={[0, 0, -2]}>
      <boxGeometry args={[10, 0.1, 0.1]} />
      <meshStandardMaterial 
        color="#ff0000" 
        emissive="#ff0000"
        emissiveIntensity={2}
      />
    </mesh>
  );
};

// Main component
const AboutPage = () => {
  // Create 3 skull positions
  const skullPositions = [
    [-2, 0, 0],
    [0, 2, -1],
    [2, -1, -2]
  ];
  
  return (
    <div style={{ width: '100%', height: '100vh', background: 'black' }}>
      <Canvas camera={{ position: [0, 0, 5], fov: 60 }}>
        {/* Simple lighting */}
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        
        {/* Skulls */}
        {skullPositions.map((position, index) => (
          <Skull key={index} position={position} index={index} />
        ))}
        
        {/* Neon line */}
        <NeonLine />
      </Canvas>
    </div>
  );
};

export default AboutPage; 