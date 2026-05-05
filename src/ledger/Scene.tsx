import { useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Sparkles, useScroll, Float } from '@react-three/drei';
import * as THREE from 'three';

/**
 * The 3D scene. Three "stations" stacked vertically:
 *   y =   2..8  : Above water (Shore) — sky, sun, distant ship silhouette
 *   y = -10..0  : Mid water (Deep)    — ghostly wreck silhouettes drifting
 *   y = -28..-18: Sea floor (Hoard)   — glowing treasure chest with halo
 *
 * The camera descends along this stack as the user scrolls. Fog color
 * + density also shift to sell the depth.
 */

const STATIONS = {
  shore: new THREE.Vector3(0,  3.5,  9),
  mid:   new THREE.Vector3(0, -8,    7),
  hoard: new THREE.Vector3(0, -22,   8),
};
const LOOK = {
  shore: new THREE.Vector3(0, 1.5, -10),
  mid:   new THREE.Vector3(0, -10, -2),
  hoard: new THREE.Vector3(0, -24, 0),
};

const SHORE_FOG  = new THREE.Color('#cfe7e5');
const DEEP_FOG   = new THREE.Color('#1d4e4c');
const HOARD_FOG  = new THREE.Color('#0a1f1f');

const SHORE_BG   = new THREE.Color('#dff1ee');
const DEEP_BG    = new THREE.Color('#1d4e4c');
const HOARD_BG   = new THREE.Color('#06181a');

export function Scene() {
  const scroll = useScroll();
  const { camera, scene } = useThree();
  const lookTarget = useRef(new THREE.Vector3());
  const tmpPos     = useRef(new THREE.Vector3());

  // Set up scene fog + background once.
  useMemo(() => {
    scene.fog = new THREE.Fog(SHORE_FOG.clone(), 12, 60);
    scene.background = SHORE_BG.clone();
  }, [scene]);

  useFrame(() => {
    const o = scroll.offset; // 0..1
    const t = THREE.MathUtils.clamp(o, 0, 1);

    // --- camera path: shore (0..0.3) → mid (0.3..0.65) → hoard (0.65..1) ---
    if (t < 0.3) {
      const k = t / 0.3;
      tmpPos.current.lerpVectors(STATIONS.shore, STATIONS.mid, smooth(k));
      lookTarget.current.lerpVectors(LOOK.shore, LOOK.mid, smooth(k));
    } else if (t < 0.65) {
      // Hold roughly at mid station with a gentle drift further down.
      const k = (t - 0.3) / 0.35;
      tmpPos.current.copy(STATIONS.mid).addScaledVector(
        new THREE.Vector3(0, -3, 0), smooth(k)
      );
      lookTarget.current.copy(LOOK.mid).addScaledVector(
        new THREE.Vector3(0, -3, 0), smooth(k)
      );
    } else {
      const k = (t - 0.65) / 0.35;
      tmpPos.current.lerpVectors(STATIONS.mid, STATIONS.hoard, smooth(k));
      lookTarget.current.lerpVectors(LOOK.mid, LOOK.hoard, smooth(k));
    }
    camera.position.copy(tmpPos.current);
    camera.lookAt(lookTarget.current);

    // --- fog + background blend (split same as camera) ---
    const fog = scene.fog as THREE.Fog;
    if (t < 0.3) {
      const k = t / 0.3;
      fog.color.copy(SHORE_FOG).lerp(DEEP_FOG, k);
      (scene.background as THREE.Color).copy(SHORE_BG).lerp(DEEP_BG, k);
      fog.near = THREE.MathUtils.lerp(12, 4, k);
      fog.far  = THREE.MathUtils.lerp(60, 30, k);
    } else if (t < 0.65) {
      // Stay in deep colors, slight darken.
      const k = (t - 0.3) / 0.35;
      const blend = THREE.MathUtils.lerp(0, 0.3, k);
      fog.color.copy(DEEP_FOG).lerp(HOARD_FOG, blend);
      (scene.background as THREE.Color).copy(DEEP_BG).lerp(HOARD_BG, blend);
      fog.near = 4;
      fog.far  = THREE.MathUtils.lerp(30, 26, k);
    } else {
      const k = (t - 0.65) / 0.35;
      const blend = THREE.MathUtils.lerp(0.3, 1, k);
      fog.color.copy(DEEP_FOG).lerp(HOARD_FOG, blend);
      (scene.background as THREE.Color).copy(DEEP_BG).lerp(HOARD_BG, blend);
      fog.near = THREE.MathUtils.lerp(4, 2, k);
      fog.far  = THREE.MathUtils.lerp(26, 22, k);
    }
  });

  return (
    <>
      {/* ---- Lighting ---- */}
      {/* Ambient warm sun above */}
      <ambientLight intensity={0.55} color="#dff1ee" />
      {/* Key sun light from upper-front */}
      <directionalLight
        position={[8, 18, 6]}
        intensity={1.4}
        color="#f4fffd"
        castShadow={false}
      />
      {/* Cool rim from the deep below */}
      <pointLight position={[0, -20, 0]} intensity={28} color="#9fd0cd" distance={40} decay={1.6} />
      {/* Treasure glow */}
      <pointLight position={[0, -22, 0]} intensity={18} color="#c0ecdc" distance={18} decay={1.4} />

      {/* ---- World ---- */}
      <Sky />
      <DistantShip />
      <Ocean />
      <UnderWaterDust />
      <Wrecks />
      <SeaFloor />
      <Chest />
    </>
  );
}

/* =========================================================
   Tiny ease helper
   ========================================================= */

function smooth(x: number) {
  // smootherstep
  return x * x * x * (x * (x * 6 - 15) + 10);
}

/* =========================================================
   Sky — large sphere with soft gradient, only visible at top
   ========================================================= */

function Sky() {
  // Smaller sphere placed high above the surface so the camera leaves it
  // entirely once it dives below water. Fog-enabled material naturally
  // fades it as the deep fog grows.
  return (
    <mesh position={[0, 60, -10]} renderOrder={-1}>
      <sphereGeometry args={[55, 32, 32]} />
      <meshBasicMaterial color="#e8f6f4" side={THREE.BackSide} fog />
    </mesh>
  );
}

/* =========================================================
   DistantShip — silhouette of an 18th-century ship far on the horizon
   ========================================================= */

function DistantShip() {
  const ref = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (!ref.current) return;
    ref.current.position.y = 0.6 + Math.sin(state.clock.elapsedTime * 0.4) * 0.12;
    ref.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.35) * 0.025;
  });
  return (
    <group ref={ref} position={[-9, 0.6, -22]}>
      {/* Hull */}
      <mesh>
        <boxGeometry args={[3.2, 0.55, 0.8]} />
        <meshStandardMaterial color="#7c8c8a" roughness={1} fog opacity={0.55} transparent />
      </mesh>
      {/* Mast */}
      <mesh position={[0, 1.4, 0]}>
        <cylinderGeometry args={[0.05, 0.05, 2.6, 6]} />
        <meshStandardMaterial color="#6a7a78" roughness={1} fog opacity={0.5} transparent />
      </mesh>
      {/* Sail */}
      <mesh position={[0, 1.5, 0]}>
        <boxGeometry args={[1.4, 1.0, 0.04]} />
        <meshStandardMaterial color="#dde7e5" roughness={1} fog opacity={0.45} transparent />
      </mesh>
    </group>
  );
}

/* =========================================================
   Ocean — animated plane with vertex sine waves
   ========================================================= */

function Ocean() {
  const meshRef = useRef<THREE.Mesh>(null);
  const geom = useMemo(() => new THREE.PlaneGeometry(120, 120, 80, 80), []);
  const original = useMemo(() => geom.attributes.position.array.slice(), [geom]);

  useFrame((state) => {
    const time = state.clock.elapsedTime;
    const pos = geom.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const x = (original as Float32Array)[i * 3];
      const y = (original as Float32Array)[i * 3 + 1];
      const wave =
        Math.sin(x * 0.3 + time * 0.9) * 0.18 +
        Math.cos(y * 0.42 + time * 0.7) * 0.14 +
        Math.sin((x + y) * 0.18 + time * 0.5) * 0.1;
      pos.setZ(i, wave);
    }
    pos.needsUpdate = true;
    geom.computeVertexNormals();
  });

  return (
    <mesh ref={meshRef} geometry={geom} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
      <meshStandardMaterial
        color="#9fd0cd"
        roughness={0.25}
        metalness={0.4}
        transparent
        opacity={0.92}
      />
    </mesh>
  );
}

/* =========================================================
   UnderWaterDust — drifting particles (drei Sparkles) at depth
   ========================================================= */

function UnderWaterDust() {
  return (
    <>
      <Sparkles
        count={140}
        scale={[40, 18, 30] as unknown as number}
        size={3}
        speed={0.35}
        opacity={0.7}
        color="#c0ecdc"
        position={[0, -8, -2]}
      />
      <Sparkles
        count={90}
        scale={[24, 10, 18] as unknown as number}
        size={2}
        speed={0.25}
        opacity={0.6}
        color="#a5d0c0"
        position={[0, -22, 0]}
      />
    </>
  );
}

/* =========================================================
   Wrecks — ghostly silhouettes of sunken ships drifting in mid-depth
   ========================================================= */

function Wrecks() {
  return (
    <>
      <Float speed={0.6} rotationIntensity={0.2} floatIntensity={0.6}>
        <WreckSilhouette position={[7, -7, -8]} scale={1.2} />
      </Float>
      <Float speed={0.5} rotationIntensity={0.15} floatIntensity={0.4}>
        <WreckSilhouette position={[-9, -12, -3]} scale={0.9} rotation={[0, 0.6, 0]} />
      </Float>
      <Float speed={0.4} rotationIntensity={0.1} floatIntensity={0.5}>
        <WreckSilhouette position={[5, -16, 2]} scale={0.7} rotation={[0, -0.4, 0]} />
      </Float>
    </>
  );
}

function WreckSilhouette({
  position,
  scale = 1,
  rotation = [0, 0, 0],
}: {
  position: [number, number, number];
  scale?: number;
  rotation?: [number, number, number];
}) {
  return (
    <group position={position} scale={scale} rotation={rotation}>
      {/* Hull (curved-ish) */}
      <mesh rotation={[0, 0, Math.PI * 0.04]}>
        <cylinderGeometry args={[1.1, 1.6, 5.2, 12, 1, true]} />
        <meshStandardMaterial
          color="#1c3a39"
          roughness={1}
          opacity={0.45}
          transparent
          side={THREE.DoubleSide}
          fog
        />
      </mesh>
      {/* Broken mast */}
      <mesh position={[0.2, 2, 0]} rotation={[0, 0, 0.4]}>
        <cylinderGeometry args={[0.08, 0.1, 3.2, 6]} />
        <meshStandardMaterial color="#163230" roughness={1} opacity={0.5} transparent fog />
      </mesh>
      {/* Tattered sail */}
      <mesh position={[0.4, 2.4, 0]} rotation={[0, 0, 0.2]}>
        <planeGeometry args={[1.6, 1.2]} />
        <meshStandardMaterial
          color="#3e6659"
          roughness={1}
          opacity={0.32}
          transparent
          side={THREE.DoubleSide}
          fog
        />
      </mesh>
    </group>
  );
}

/* =========================================================
   SeaFloor — large dark plane
   ========================================================= */

function SeaFloor() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -25, 0]}>
      <planeGeometry args={[80, 80, 1, 1]} />
      <meshStandardMaterial color="#0a1f1f" roughness={1} />
    </mesh>
  );
}

/* =========================================================
   Chest — open treasure chest with halo glow on the seafloor
   ========================================================= */

function Chest() {
  const groupRef = useRef<THREE.Group>(null);
  const glowRef  = useRef<THREE.Mesh>(null);
  const innerRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (groupRef.current) {
      groupRef.current.position.y = -24 + Math.sin(t * 0.7) * 0.08;
      groupRef.current.rotation.y = Math.sin(t * 0.2) * 0.05;
    }
    if (glowRef.current) {
      const m = glowRef.current.material as THREE.MeshBasicMaterial;
      m.opacity = 0.5 + Math.sin(t * 1.2) * 0.12;
    }
    if (innerRef.current) {
      const m = innerRef.current.material as THREE.MeshBasicMaterial;
      m.opacity = 0.85 + Math.sin(t * 1.6 + 1) * 0.08;
    }
  });

  return (
    <group ref={groupRef} position={[0, -24, 0]}>
      {/* Outer halo on the floor */}
      <mesh ref={glowRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.05, 0]}>
        <circleGeometry args={[7, 48]} />
        <meshBasicMaterial color="#9fd0cd" transparent opacity={0.5} fog={false} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.06, 0]}>
        <circleGeometry args={[3.6, 48]} />
        <meshBasicMaterial color="#c0ecdc" transparent opacity={0.7} fog={false} />
      </mesh>

      {/* Base box (dark wood) */}
      <mesh position={[0, 0.55, 0]}>
        <boxGeometry args={[3.4, 1.2, 2.1]} />
        <meshStandardMaterial color="#1a2a29" roughness={0.85} metalness={0.25} />
      </mesh>
      {/* Lid (slightly open, tilted back) */}
      <group position={[0, 1.15, -1.05]} rotation={[-Math.PI * 0.34, 0, 0]}>
        <mesh position={[0, 0, 0.55]}>
          <boxGeometry args={[3.4, 0.5, 1.2]} />
          <meshStandardMaterial color="#243b3a" roughness={0.78} metalness={0.32} />
        </mesh>
      </group>
      {/* Inner glow inside the chest */}
      <mesh ref={innerRef} position={[0, 1.08, 0.18]} rotation={[-Math.PI * 0.18, 0, 0]}>
        <planeGeometry args={[2.8, 1.5]} />
        <meshBasicMaterial color="#dffaf0" transparent opacity={0.9} fog={false} />
      </mesh>
      {/* Brass corner trim */}
      {[-1.5, 1.5].map((x) => (
        <mesh key={x} position={[x, 0.55, 0]}>
          <boxGeometry args={[0.18, 1.28, 2.18]} />
          <meshStandardMaterial color="#9fd0cd" metalness={0.7} roughness={0.4} />
        </mesh>
      ))}
      {/* Light from inside the chest */}
      <pointLight position={[0, 1.0, 0]} intensity={6} color="#dffaf0" distance={6} decay={1.4} />
    </group>
  );
}
