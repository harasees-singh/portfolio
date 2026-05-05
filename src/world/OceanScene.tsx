import { Canvas, useFrame } from '@react-three/fiber';
import { useScroll } from 'framer-motion';
import { useMemo, useRef } from 'react';
import * as THREE from 'three';

/**
 * Marine-snow particle field that drifts upward as the camera "descends".
 * Sparse light orbs become visible in the deeper zones (bioluminescence).
 */
function MarineSnow({ count = 1400 }: { count?: number }) {
  const pointsRef = useRef<THREE.Points>(null);

  const { positions, sizes, phases } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    const phases = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      positions[i * 3 + 0] = (Math.random() - 0.5) * 60;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 40;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 40 - 8;
      sizes[i] = 0.03 + Math.random() * 0.08;
      phases[i] = Math.random() * Math.PI * 2;
    }
    return { positions, sizes, phases };
  }, [count]);

  useFrame((state) => {
    const points = pointsRef.current;
    if (!points) return;
    const t = state.clock.getElapsedTime();
    const arr = points.geometry.attributes.position.array as Float32Array;
    for (let i = 0; i < count; i++) {
      const idx = i * 3;
      // gentle drift downward & sway
      arr[idx + 0] += Math.sin(t * 0.2 + phases[i]) * 0.0025;
      arr[idx + 1] -= 0.01 + (sizes[i] - 0.03) * 0.05;
      if (arr[idx + 1] < -22) {
        arr[idx + 1] = 22;
        arr[idx + 0] = (Math.random() - 0.5) * 60;
      }
    }
    points.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={pointsRef} frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
          count={count}
        />
        <bufferAttribute
          attach="attributes-size"
          args={[sizes, 1]}
          count={count}
        />
      </bufferGeometry>
      <pointsMaterial
        color={new THREE.Color('#cfeaff')}
        size={0.07}
        transparent
        opacity={0.7}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

/**
 * Bioluminescent point sprites that fade in as the user descends.
 */
function Biolum({ count = 80 }: { count?: number }) {
  const ref = useRef<THREE.Points>(null);

  const { positions, phases } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const phases = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      positions[i * 3 + 0] = (Math.random() - 0.5) * 50;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 35;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 30 - 12;
      phases[i] = Math.random() * Math.PI * 2;
    }
    return { positions, phases };
  }, [count]);

  useFrame((state) => {
    const points = ref.current;
    if (!points) return;
    const t = state.clock.getElapsedTime();
    const mat = points.material as THREE.PointsMaterial;
    // global twinkle
    mat.opacity = 0.55 + Math.sin(t * 0.6) * 0.15;
    points.rotation.z = Math.sin(t * 0.05) * 0.05;
    const arr = points.geometry.attributes.position.array as Float32Array;
    for (let i = 0; i < count; i++) {
      const idx = i * 3;
      arr[idx + 1] += Math.sin(t * 0.3 + phases[i]) * 0.002;
    }
    points.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={ref} frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
          count={count}
        />
      </bufferGeometry>
      <pointsMaterial
        color={new THREE.Color('#7dd3fc')}
        size={0.18}
        transparent
        opacity={0.6}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

/**
 * God rays — thin elongated planes near the top that fade with descent.
 */
function GodRays() {
  const group = useRef<THREE.Group>(null);
  const { scrollYProgress } = useScroll();

  useFrame((state) => {
    const g = group.current;
    if (!g) return;
    const p = scrollYProgress.get();
    // fade out by 30% scroll
    const fade = Math.max(0, 1 - p * 3.4);
    g.children.forEach((child, i) => {
      const mesh = child as THREE.Mesh;
      const mat = mesh.material as THREE.MeshBasicMaterial;
      mat.opacity = fade * (0.08 + Math.sin(state.clock.elapsedTime * 0.3 + i) * 0.04);
    });
  });

  const rays = useMemo(() => {
    const arr: { x: number; rot: number; w: number; h: number }[] = [];
    for (let i = 0; i < 7; i++) {
      arr.push({
        x: -18 + i * 6 + Math.random() * 2,
        rot: -0.05 + Math.random() * 0.1,
        w: 1.5 + Math.random() * 1.5,
        h: 30,
      });
    }
    return arr;
  }, []);

  return (
    <group ref={group} position={[0, 8, -8]}>
      {rays.map((r, i) => (
        <mesh key={i} position={[r.x, 0, 0]} rotation={[0, 0, r.rot]}>
          <planeGeometry args={[r.w, r.h]} />
          <meshBasicMaterial
            color="#8ed5ff"
            transparent
            opacity={0.08}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      ))}
    </group>
  );
}

/**
 * Camera that descends as the user scrolls — gives the world parallax depth.
 */
function DescentCamera() {
  const { scrollYProgress } = useScroll();

  useFrame((state) => {
    const p = scrollYProgress.get();
    // slow vertical descent and a tiny sway
    const targetY = -p * 14;
    const targetZ = 6 - p * 2;
    state.camera.position.x = Math.sin(state.clock.elapsedTime * 0.1) * 0.4;
    state.camera.position.y += (targetY - state.camera.position.y) * 0.05;
    state.camera.position.z += (targetZ - state.camera.position.z) * 0.05;
    state.camera.lookAt(0, state.camera.position.y - 1, -10);
  });

  return null;
}

/**
 * Fog density grows with depth — this is what makes the abyss feel infinite
 * and seamlessly blends with the CSS gradient layers above the canvas.
 */
function DepthFog() {
  const { scrollYProgress } = useScroll();
  const fogRef = useRef<THREE.Fog | null>(null);

  useFrame((state) => {
    const p = scrollYProgress.get();
    if (!state.scene.fog) {
      state.scene.fog = new THREE.Fog('#03101a', 8, 28);
      fogRef.current = state.scene.fog as THREE.Fog;
    }
    const fog = state.scene.fog as THREE.Fog;
    // pull the far plane in as we descend → tighter visibility, deeper feel
    fog.far = 28 - p * 14;
    fog.near = 5 - p * 3;
    // shift colour from twilight blue → near-black
    const c = new THREE.Color('#0e2a3a').lerp(new THREE.Color('#02080f'), p);
    fog.color.copy(c);
    state.scene.background = fog.color;
  });

  return null;
}

export function OceanScene() {
  return (
    <Canvas
      className="bg-stack__canvas"
      camera={{ position: [0, 0, 6], fov: 60, near: 0.1, far: 60 }}
      dpr={[1, 1.75]}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
    >
      <DepthFog />
      <DescentCamera />
      <ambientLight intensity={0.35} color="#7dd3fc" />
      <directionalLight position={[2, 10, 4]} intensity={0.6} color="#cfe8ff" />
      <GodRays />
      <MarineSnow />
      <Biolum />
    </Canvas>
  );
}
