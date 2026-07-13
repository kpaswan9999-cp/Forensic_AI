"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { Sphere, Line } from "@react-three/drei";
import * as THREE from "three";

export default function HeroGlobe() {
  const groupRef = useRef<THREE.Group>(null);
  const particlesRef = useRef<THREE.Points>(null);
  const coreRef = useRef<THREE.Mesh>(null);
  const wireframeRef = useRef<THREE.Mesh>(null);

  // Generate coordinates for a dense particle sphere
  const { positions, colors } = useMemo(() => {
    const count = 1200;
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const color = new THREE.Color();
    const radius = 2.4;

    for (let i = 0; i < count; i++) {
      const theta = i * 2.39996; // Golden angle
      const y = 1 - (i / (count - 1)) * 2;
      const r = Math.sqrt(1 - y * y) * radius;
      
      const x = Math.cos(theta) * r;
      const z = Math.sin(theta) * r;

      pos[i * 3] = x;
      pos[i * 3 + 1] = y * radius;
      pos[i * 3 + 2] = z;

      // Color scheme matching Corporate Hyper-Blue (#3B82F6), Indigo (#6366F1), and Silver/White
      const ratio = i / count;
      if (ratio < 0.4) {
        color.set("#3B82F6");
      } else if (ratio < 0.7) {
        color.set("#6366F1");
      } else {
        color.set("#F8FAFC");
      }

      col[i * 3] = color.r;
      col[i * 3 + 1] = color.g;
      col[i * 3 + 2] = color.b;
    }
    return { positions: pos, colors: col };
  }, []);

  // Set up orbital nodes matching the new corporate colors
  const satellites = useMemo(() => {
    return [
      { id: 1, name: "Reuters", color: "#3B82F6", radius: 3.4, speed: 0.15, offset: 0 },
      { id: 2, name: "AP News", color: "#6366F1", radius: 3.8, speed: -0.12, offset: Math.PI / 3 },
      { id: 3, name: "X (Twitter)", color: "#94A3B8", radius: 3.2, speed: 0.22, offset: (2 * Math.PI) / 3 },
      { id: 4, name: "Reddit", color: "#F8FAFC", radius: 3.6, speed: -0.18, offset: Math.PI },
    ];
  }, []);

  const satRefs = useRef<THREE.Mesh[]>([]);

  useFrame((state, delta) => {
    const elapsed = state.clock.getElapsedTime();

    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.12;
      groupRef.current.rotation.x = THREE.MathUtils.lerp(
        groupRef.current.rotation.x,
        -state.pointer.y * 0.4,
        0.05
      );
      groupRef.current.rotation.z = THREE.MathUtils.lerp(
        groupRef.current.rotation.z,
        state.pointer.x * 0.4,
        0.05
      );
    }

    if (particlesRef.current) {
      particlesRef.current.rotation.y -= delta * 0.05;
    }

    if (wireframeRef.current) {
      wireframeRef.current.rotation.y += delta * 0.08;
    }

    if (coreRef.current) {
      const pulse = 1 + Math.sin(elapsed * 2) * 0.03;
      coreRef.current.scale.set(pulse, pulse, pulse);
    }

    satellites.forEach((sat, index) => {
      const mesh = satRefs.current[index];
      if (mesh) {
        const angle = elapsed * sat.speed + sat.offset;
        mesh.position.x = Math.cos(angle) * sat.radius;
        mesh.position.z = Math.sin(angle) * sat.radius;
        mesh.position.y = Math.sin(angle * 1.5) * 0.8;
      }
    });
  });

  return (
    <group ref={groupRef}>
      {/* Dynamic 3D latitude/longitude wireframe lines mapping the earth */}
      <mesh ref={wireframeRef}>
        <sphereGeometry args={[2.39, 32, 16]} />
        <meshBasicMaterial
          color="#3B82F6"
          wireframe
          transparent
          opacity={0.15}
        />
      </mesh>

      {/* Outer 3D Grid rings */}
      <Line
        points={Array.from({ length: 64 }, (_, i) => {
          const angle = (i / 64) * Math.PI * 2;
          return [Math.cos(angle) * 3.4, 0, Math.sin(angle) * 3.4];
        })}
        color="#3B82F6"
        opacity={0.12}
        transparent
        lineWidth={1.2}
      />
      <Line
        points={Array.from({ length: 64 }, (_, i) => {
          const angle = (i / 64) * Math.PI * 2;
          return [0, Math.cos(angle) * 3.8, Math.sin(angle) * 3.8];
        })}
        color="#6366F1"
        opacity={0.1}
        transparent
        lineWidth={1.2}
      />

      {/* Inner core */}
      <mesh ref={coreRef}>
        <sphereGeometry args={[2.0, 32, 32]} />
        <meshBasicMaterial
          color="#0B0F19"
          transparent
          opacity={0.9}
        />
      </mesh>

      {/* Particle Network Sphere */}
      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[positions, 3]}
          />
          <bufferAttribute
            attach="attributes-color"
            args={[colors, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.045}
          vertexColors
          transparent
          opacity={0.7}
          sizeAttenuation
        />
      </points>

      {/* Orbiting Satellite Data Nodes */}
      {satellites.map((sat, index) => (
        <group key={sat.id}>
          <mesh
            ref={(el) => {
              if (el) satRefs.current[index] = el;
            }}
          >
            <sphereGeometry args={[0.12, 16, 16]} />
            <meshBasicMaterial color={sat.color} />
          </mesh>
        </group>
      ))}

      {/* Dynamic ambient lights */}
      <pointLight color="#3B82F6" intensity={6} distance={12} position={[4, 4, 4]} />
      <pointLight color="#6366F1" intensity={5} distance={12} position={[-4, -4, 4]} />
    </group>
  );
}
