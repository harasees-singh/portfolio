import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { ScrollControls, Scroll, Preload } from '@react-three/drei';
import { Scene } from './Scene';
import { Overlay, Nav, Boot, ScrollPublisher } from './Overlay';

/**
 * The Mariner's Ledger.
 *
 * A single fullscreen Canvas with three "pages" of scroll. The 3D scene
 * (camera path, fog, ocean, wreck, chest) descends as the user scrolls.
 * The HTML overlay (sections, footer) rides the same scroll via
 * drei's `<Scroll html>`.
 *
 * Nav is rendered OUTSIDE the canvas so position:fixed works (drei's
 * Scroll html wrapper has a transform which would otherwise capture it).
 */

export function Ledger() {
  return (
    <>
      <div className="ledger-app">
        <Canvas
          dpr={[1, 1.75]}
          camera={{ position: [0, 3.5, 9], fov: 55, near: 0.1, far: 200 }}
          gl={{ antialias: true, powerPreference: 'high-performance' }}
        >
          <Suspense fallback={null}>
            <ScrollControls pages={5} damping={0.18} maxSpeed={1.2}>
              <ScrollPublisher />
              <Scene />
              <Scroll html style={{ width: '100%' }}>
                <Overlay />
              </Scroll>
            </ScrollControls>
            <Preload all />
          </Suspense>
        </Canvas>
      </div>
      <Nav />
      <Boot />
    </>
  );
}
