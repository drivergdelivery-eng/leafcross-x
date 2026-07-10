"use client";

import { Float, OrbitControls, useTexture } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { Suspense, useRef } from "react";
import type { Mesh } from "three";

function NugCluster() {
  const texture = useTexture("/assets/extracted/nug-transparent.png");
  const group = useRef<Mesh>(null);

  useFrame((_, delta) => {
    if (group.current) {
      group.current.rotation.y += delta * 0.36;
      group.current.rotation.x = Math.sin(Date.now() * 0.0006) * 0.12;
    }
  });

  return (
    <Float speed={1.2} rotationIntensity={0.2} floatIntensity={0.7}>
      <mesh ref={group} castShadow receiveShadow scale={[1.35, 1.05, 1.35]}>
        <dodecahedronGeometry args={[1.65, 3]} />
        <meshStandardMaterial
          map={texture}
          color="#6f7f45"
          roughness={0.82}
          metalness={0.02}
          bumpMap={texture}
          bumpScale={0.05}
        />
      </mesh>
    </Float>
  );
}

export function NugScene() {
  return (
    <div className="nugScene">
      <Canvas
        camera={{ position: [0, 0.2, 5], fov: 36 }}
        shadows
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={1.3} />
        <directionalLight position={[3, 4, 4]} intensity={2.4} castShadow />
        <pointLight position={[-3, -2, 2]} intensity={0.8} color="#d2b568" />
        <Suspense fallback={null}>
          <NugCluster />
        </Suspense>
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          autoRotate
          autoRotateSpeed={0.45}
        />
      </Canvas>
    </div>
  );
}
