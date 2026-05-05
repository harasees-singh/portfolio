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
  const { scrollY, scrollYProgress } = useScroll();

  // The video PHYSICALLY moves up out of frame so the user feels they are
  // sinking beneath the surface. Tying this to scrollY (in pixels) instead of
  // scrollYProgress means the surface recedes at nearly content speed — so
  // the page no longer feels like it's moving faster than the ocean. The 0.9
  // factor adds a tiny bit of parallax (background slightly slower than fg).
  const videoY = useTransform(scrollY, (y) => `${-y * 0.9}px`);

  // Because the video now moves at near-content speed, it leaves the viewport
  // after roughly one viewport-height of scroll. Fade it out across the tail
  // end of that range so the cleanup is invisible.
  const videoOpacity = useTransform(scrollYProgress, [0, 0.18, 0.26], [1, 1, 0]);

  // Subtle pull toward the camera (water gets denser, light gets compressed).
  const videoScale = useTransform(scrollYProgress, [0, 0.25], [1.02, 1.08]);

  // As we go deeper, water absorbs warm light → desaturate + shift toward cyan.
  const videoHue = useTransform(scrollYProgress, [0, 0.25], [-12, -28]);
  const videoSat = useTransform(scrollYProgress, [0, 0.25], [0.78, 0.55]);
  const videoBright = useTransform(scrollYProgress, [0, 0.25], [0.92, 0.72]);
  const videoFilter = useTransform(
    [videoHue, videoSat, videoBright] as MotionValue<number>[],
    ([h, s, b]) => `saturate(${s}) contrast(1) brightness(${b}) hue-rotate(${h}deg)`
  );

  // 3D ocean is visible underneath FROM THE START so the descent reveals it
  // rather than fading to it. It eases up to full strength as the surface clears.
  const canvasOpacity = useTransform(scrollYProgress, [0, 0.18, 0.5], [0.25, 0.7, 1]);

  // depth gradient grows stronger as user descends, but stays subtle
  const gradientOpacity = useTransform(scrollYProgress, [0, 0.4, 1], [0.3, 0.7, 1]);

  const videoRef = useRef<HTMLVideoElement>(null);

  // Pause the video once it has fully scrolled past — saves battery / GPU.
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    return scrollYProgress.on('change', (p) => {
      if (p > 0.3 && !v.paused) v.pause();
      else if (p <= 0.3 && v.paused) void v.play().catch(() => {});
    });
  }, [scrollY, scrollYProgress]);

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
