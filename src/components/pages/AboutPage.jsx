import React, { useRef, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

// Load the skull 3D model
const SkullModel = ({ position, index }) => {
  const skullRef = useRef();
  // Use the correct path to the model - trying multiple path formats for compatibility
  const { scene } = useGLTF('./src/assets/skull.glb');
  
  // Clone the scene for reuse
  const model = scene.clone();
  
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
      const scale = 1 + Math.sin(time + index) * 0.05;
      skullRef.current.scale.set(scale, scale, scale);
    }
  });

  // Apply red emissive material to the skull
  React.useEffect(() => {
    model.traverse((obj) => {
      if (obj.isMesh) {
        obj.material = new THREE.MeshStandardMaterial({
          color: "#ffffff",
          emissive: "#ff0000",
          emissiveIntensity: 2,
          roughness: 0.3,
          metalness: 0.7
        });
        
        // Enable shadows
        obj.castShadow = true;
        obj.receiveShadow = true;
      }
    });
  }, [model]);
  
  return (
    <primitive 
      ref={skullRef} 
      object={model} 
      position={position}
      scale={[2, 2, 2]} // Make it much larger to ensure visibility
    />
  );
};

// Simple fallback skull
const FallbackSkull = ({ position, index }) => {
  const skullRef = useRef();
  
  useFrame(({ clock, mouse }) => {
    const time = clock.getElapsedTime();
    
    if (skullRef.current) {
      skullRef.current.position.x = position[0] + mouse.x * 2;
      skullRef.current.position.y = position[1] + mouse.y * 2;
      skullRef.current.rotation.y = Math.sin(time * 0.5) * 0.5;
    }
  });
  
  return (
    <mesh ref={skullRef} position={position}>
      <boxGeometry args={[1, 1.2, 1]} />
      <meshStandardMaterial 
        color="#ff0000" 
        emissive="#ff0000"
        emissiveIntensity={2}
      />
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
  // Create skull positions - closer to the camera
  const skullPositions = [
    [-2, 0, 0],
    [0, 1, 0],
    [2, -1, 0]
  ];
  
  // Add error logging for model loading
  const onError = (e) => {
    console.error("Error loading 3D model:", e);
  };
  
  return (
    <div style={{ width: '100%', height: '100vh', background: 'black' }}>
      <Canvas 
        camera={{ position: [0, 0, 5], fov: 60 }}
        shadows
        onCreated={({ gl }) => {
          gl.setClearColor(new THREE.Color('#000000'));
        }}
      >
        {/* Lighting */}
        <ambientLight intensity={1} />
        <directionalLight 
          position={[5, 5, 5]} 
          intensity={2} 
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
        />
        <pointLight position={[-5, -5, 5]} intensity={2} color="#ff3333" />
        
        {/* Debug controls */}
        <OrbitControls enableZoom={false} />
        
        {/* Skulls with error handling */}
        <Suspense fallback={null}>
          {skullPositions.map((position, index) => (
            <SkullModel 
              key={index} 
              position={position} 
              index={index} 
              onError={onError}
            />
          ))}
        </Suspense>
        
        {/* Neon line */}
        <NeonLine />
      </Canvas>
    </div>
  );
};

// Try multiple potential paths for the model
try {
  useGLTF.preload('./src/assets/skull.glb');
} catch (e) {
  console.error("Failed to preload skull model:", e);
}

export default AboutPage; 