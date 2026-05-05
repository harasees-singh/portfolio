import { motion, useScroll, useTransform, type MotionValue } from 'framer-motion';
import { useEffect, useRef } from 'react';
import { OceanScene } from '../world/OceanScene';

/**
 * Stacked background that blends the supplied deep-sea video into a
 * scroll-driven 3D ocean. Layers (back → front):
 *   1. R3F <Canvas> — the abyss that lives BELOW the water surface
 *   2. <video> — physically translates UP the viewport with scroll, like a
 *                receding water surface as the camera sinks below it
 *   3. caustic horizon line — anchored to the video's bottom edge
 *   4. depth gradient (CSS) — strengthens as user descends
 *   5. radial vignette
 *   6. marine-snow CSS pattern (cheap parallax overlay)
 */
export function BackgroundStack() {
  const { scrollYProgress } = useScroll();

  // The video PHYSICALLY moves up out of frame so the user feels they are
  // sinking beneath the surface. By scroll=85% it is fully out of view.
  const videoY = useTransform(scrollYProgress, [0, 1], ['0%', '-105%']);

  // It stays opaque while in view; the small final fade just hides the very
  // last pixels in case the translate doesn't quite clear the viewport.
  const videoOpacity = useTransform(scrollYProgress, [0, 0.78, 0.92], [1, 1, 0]);

  // Subtle pull toward the camera (water gets denser, light gets compressed).
  const videoScale = useTransform(scrollYProgress, [0, 1], [1.02, 1.12]);

  // As we go deeper, water absorbs warm light → desaturate + shift toward cyan.
  const videoHue = useTransform(scrollYProgress, [0, 1], [-6, -32]);
  const videoSat = useTransform(scrollYProgress, [0, 1], [1.05, 0.55]);
  const videoBright = useTransform(scrollYProgress, [0, 0.6], [1, 0.75]);
  const videoFilter = useTransform(
    [videoHue, videoSat, videoBright] as MotionValue<number>[],
    ([h, s, b]) => `saturate(${s}) contrast(1.05) brightness(${b}) hue-rotate(${h}deg)`
  );

  // 3D ocean is visible underneath FROM THE START so the descent reveals it
  // rather than fading to it. We start it dim so the surface video reads as the
  // dominant layer at the top, then ease it up as we sink past the surface.
  const canvasOpacity = useTransform(scrollYProgress, [0, 0.3, 0.7], [0.25, 0.7, 1]);

  // depth gradient grows stronger as user descends, but stays subtle
  const gradientOpacity = useTransform(scrollYProgress, [0, 0.5, 1], [0.3, 0.7, 1]);

  const videoRef = useRef<HTMLVideoElement>(null);

  // Pause the video once it has fully scrolled past — saves battery / GPU.
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    return scrollYProgress.on('change', (p) => {
      if (p > 0.92 && !v.paused) v.pause();
      else if (p <= 0.92 && v.paused) void v.play().catch(() => {});
    });
  }, [scrollYProgress]);

  return (
    <div className="bg-stack" aria-hidden="true">
      {/* Layer 1: 3D ocean lives BEHIND the video so the descent reveals it */}
      <motion.div
        className="bg-stack__canvas-wrap"
        style={{ opacity: canvasOpacity, position: 'absolute', inset: 0 }}
      >
        <OceanScene />
      </motion.div>

      {/* Layer 2: the receding water surface */}
      <motion.div
        className="bg-stack__surface"
        style={{ y: videoY, opacity: videoOpacity }}
      >
        <motion.video
          ref={videoRef}
          className="bg-stack__video"
          src="/its_deep_sea.mp4"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          style={{ scale: videoScale, filter: videoFilter }}
        />
        {/* Caustic horizon line that travels with the surface */}
        <div className="bg-stack__caustic" aria-hidden />
      </motion.div>

      <motion.div className="bg-stack__gradient" style={{ opacity: gradientOpacity }} />
      <div className="bg-stack__vignette" />
      <div className="bg-stack__snow" />
    </div>
  );
}
