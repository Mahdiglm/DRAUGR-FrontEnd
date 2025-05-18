import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';

// Load the skull 3D model
const SkullModel = ({ position, index }) => {
  const skullRef = useRef();
  // Load the GLB model
  const { scene } = useGLTF('/src/assets/skull.glb');
  
  // Clone the scene for reuse
  const skullScene = scene.clone();
  
  // Animation
  useFrame(({ clock, mouse }) => {
    const time = clock.getElapsedTime();
    
    if (skullRef.current) {
      // Follow mouse
      skullRef.current.position.x = position[0] + mouse.x * 2;
      skullRef.current.position.y = position[1] + mouse.y * 2;
      
      // Rotation animation
      skullRef.current.rotation.y = Math.sin(time * 0.5 + index) * 0.5 + time * 0.1;
      
      // Pulse size
      const scale = 0.5 + Math.sin(time + index) * 0.05;
      skullRef.current.scale.set(scale, scale, scale);
    }
  });

  // Apply red emissive material to the skull
  skullScene.traverse((obj) => {
    if (obj.isMesh) {
      obj.material = new THREE.MeshStandardMaterial({
        color: "#ffffff",
        emissive: "#ff0000",
        emissiveIntensity: 1.5,
        roughness: 0.3,
        metalness: 0.7
      });
    }
  });
  
  return (
    <primitive 
      ref={skullRef} 
      object={skullScene} 
      position={position}
      scale={[0.5, 0.5, 0.5]}
    />
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
  // Create skull positions
  const skullPositions = [
    [-2, 0, 0],
    [0, 2, -1],
    [2, -1, -2]
  ];
  
  return (
    <div style={{ width: '100%', height: '100vh', background: 'black' }}>
      <Canvas camera={{ position: [0, 0, 5], fov: 60 }}>
        {/* Lighting */}
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={2} />
        <pointLight position={[-10, -10, 5]} intensity={1} color="#ff3333" />
        
        {/* Skulls */}
        {skullPositions.map((position, index) => (
          <SkullModel key={index} position={position} index={index} />
        ))}
        
        {/* Neon line */}
        <NeonLine />
      </Canvas>
    </div>
  );
};

// Preload the skull model
useGLTF.preload('/src/assets/skull.glb');

export default AboutPage; 