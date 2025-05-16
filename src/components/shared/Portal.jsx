import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export default function Portal() {
  const portalRef = useRef()

  useFrame(() => {
    if (portalRef.current) {
      portalRef.current.rotation.x += 0.005
      portalRef.current.rotation.y += 0.01
    }
  })

  return (
    <mesh ref={portalRef}>
      <torusGeometry args={[1.5, 0.4, 16, 100]} />
      <meshStandardMaterial 
        color={new THREE.Color('#8800ff')}
        emissive={new THREE.Color('#330066')}
        metalness={0.8}
        roughness={0.3}
      />
    </mesh>
  )
} 