import { motion, useMotionValue, useScroll, useTransform, type MotionValue } from 'framer-motion';
import { useEffect, useRef } from 'react';
import { OceanScene } from '../world/OceanScene';

/**
 * Per-zone gradient colour stops the page background interpolates between.
 * Each zone defines a top and bottom colour as RGB triples; the actual
 * background gradient is computed continuously from scroll position so the
 * descent reads as one smooth colour shift instead of discrete steps.
 */
type RGB = [number, number, number];
interface ZoneStop { id: string; top: RGB; bot: RGB; }
const zoneStops: ZoneStop[] = [
  { id: 'surface',     top: [2, 8, 15],     bot: [8, 28, 44]   },  // near-clear, lets video read
  { id: 'sunlit-hero', top: [2, 8, 15],     bot: [8, 28, 44]   },
  { id: 'twilight',    top: [8, 28, 44],    bot: [6, 21, 33]   },  // dim teal mesopelagic
  { id: 'midnight',    top: [6, 21, 33],    bot: [3, 14, 22]   },  // cold navy bathypelagic
  { id: 'exploration', top: [2, 9, 14],     bot: [0, 2, 4]     },  // very deep ink (Abyssal)
  { id: 'logs',        top: [0, 0, 0],      bot: [0, 0, 0]     },  // pitch black (Hadal)
  { id: 'contact',     top: [0, 0, 0],      bot: [0, 0, 0]     },
];

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
export function BackgroundStack({
  staticBackground = false,
  zoneSlug,
  onReady,
}: {
  staticBackground?: boolean;
  /** Optional slug used by the static backdrop to tint each deep-dive page. */
  zoneSlug?: string;
  /**
   * Fired once the background scene is visually ready. On the landing page
   * this means the video has buffered enough to play; on static deep-dive
   * routes it fires immediately. Used by the descent loader to dismiss.
   */
  onReady?: () => void;
} = {}) {
  // Static mode (deep-dive routes): render a quiet abyss-only backdrop with
  // no video, no scroll bindings, and no R3F canvas. The descent narrative
  // doesn't apply on those pages — they need to be calm to read. The fill
  // colour shifts per zone so the descent narrative still reads through the
  // background: bright sunlit shallows down to near-black hadal abyss.
  if (staticBackground) {
    return (
      <StaticBackground zoneSlug={zoneSlug} onReady={onReady} />
    );
  }

  return <BackgroundStackInteractive onReady={onReady} />;
}

/**
 * Static deep-water backdrop used on deep-dive routes. There is no video to
 * wait for, so the ready signal fires on the next frame.
 */
function StaticBackground({
  zoneSlug,
  onReady,
}: {
  zoneSlug?: string;
  onReady?: () => void;
}) {
  useEffect(() => {
    if (!onReady) return;
    const id = window.requestAnimationFrame(() => onReady());
    return () => window.cancelAnimationFrame(id);
  }, [onReady]);

  return (
    <div
      className={`bg-stack bg-stack--static${zoneSlug ? ` bg-stack--zone-${zoneSlug}` : ''}`}
      aria-hidden="true"
    >
      <div className="bg-stack__static-fill" />
      <div className="bg-stack__vignette" />
      <div className="bg-stack__snow" />
    </div>
  );
}

function BackgroundStackInteractive({ onReady }: { onReady?: () => void }) {
  const { scrollY, scrollYProgress } = useScroll();

  // Continuously interpolate the page-background gradient between adjacent
  // zone colour stops based on each section's pixel position. Result: a
  // smooth depth gradient as the user scrolls instead of jolts at zone
  // boundaries.
  const gradientCss = useMotionValue(rgbGradient(zoneStops[0].top, zoneStops[0].bot));
  useEffect(() => {
    const measure = () => {
      const positions = zoneStops.map((s) => {
        const el = document.getElementById(s.id);
        return el ? el.getBoundingClientRect().top + window.scrollY : null;
      });
      // Drop any zones whose section isn't on the page so we never divide by 0.
      const stops = zoneStops
        .map((s, i) => ({ stop: s, top: positions[i] }))
        .filter((p): p is { stop: ZoneStop; top: number } => p.top != null)
        .sort((a, b) => a.top - b.top);

      const update = (y: number) => {
        if (stops.length === 0) return;
        // Anchor each stop to its section header — once the user has scrolled
        // 40% of the viewport into a section, treat that as fully reached.
        const trigger = window.innerHeight * 0.4;
        const anchored = stops.map((s) => Math.max(0, s.top - trigger));

        if (y <= anchored[0]) {
          gradientCss.set(rgbGradient(stops[0].stop.top, stops[0].stop.bot));
          return;
        }
        for (let i = 0; i < anchored.length - 1; i++) {
          if (y >= anchored[i] && y <= anchored[i + 1]) {
            const t = (y - anchored[i]) / (anchored[i + 1] - anchored[i]);
            const top = lerpRGB(stops[i].stop.top, stops[i + 1].stop.top, t);
            const bot = lerpRGB(stops[i].stop.bot, stops[i + 1].stop.bot, t);
            gradientCss.set(rgbGradient(top, bot));
            return;
          }
        }
        const last = stops[stops.length - 1].stop;
        gradientCss.set(rgbGradient(last.top, last.bot));
      };

      update(window.scrollY);
      const unsubscribe = scrollY.on('change', update);
      return unsubscribe;
    };

    let cleanup = measure();
    const onResize = () => {
      cleanup?.();
      cleanup = measure();
    };
    window.addEventListener('resize', onResize);
    return () => {
      cleanup?.();
      window.removeEventListener('resize', onResize);
    };
  }, [gradientCss, scrollY]);

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

  // Depth gradient saturates quickly past the surface so the per-zone tints
  // dominate the look once the user has descended past the video.
  const gradientOpacity = useTransform(scrollYProgress, [0, 0.18, 0.4], [0.4, 0.92, 1]);

  const videoRef = useRef<HTMLVideoElement>(null);
  const readyFiredRef = useRef(false);

  // Notify the loader as soon as the video has buffered enough to play.
  // Falls back to a hard timer so a slow connection (or a browser that
  // never fires the canplay event in time) can still get past the loader.
  useEffect(() => {
    if (!onReady) return;
    const fire = () => {
      if (readyFiredRef.current) return;
      readyFiredRef.current = true;
      onReady();
    };
    const v = videoRef.current;
    if (v && v.readyState >= 3) {
      fire();
      return;
    }
    const onCanPlay = () => fire();
    v?.addEventListener('canplaythrough', onCanPlay);
    v?.addEventListener('canplay', onCanPlay);
    v?.addEventListener('loadeddata', onCanPlay);
    // Safety net — never trap the user behind the loader.
    const timer = window.setTimeout(fire, 4500);
    return () => {
      v?.removeEventListener('canplaythrough', onCanPlay);
      v?.removeEventListener('canplay', onCanPlay);
      v?.removeEventListener('loadeddata', onCanPlay);
      window.clearTimeout(timer);
    };
  }, [onReady]);

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
          src="/camera_lens.mp4"
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

      <motion.div
        className="bg-stack__gradient"
        style={{ opacity: gradientOpacity, background: gradientCss }}
      />
      <div className="bg-stack__vignette" />
      <div className="bg-stack__snow" />
    </div>
  );
}

/* ---------------------------------------------------------------------------
 * Colour helpers
 * ------------------------------------------------------------------------- */

function lerpRGB(a: RGB, b: RGB, t: number): RGB {
  const k = Math.max(0, Math.min(1, t));
  return [
    Math.round(a[0] + (b[0] - a[0]) * k),
    Math.round(a[1] + (b[1] - a[1]) * k),
    Math.round(a[2] + (b[2] - a[2]) * k),
  ];
}

function rgbGradient(top: RGB, bot: RGB): string {
  return `linear-gradient(180deg, rgba(${top[0]}, ${top[1]}, ${top[2]}, 0.96) 0%, rgba(${bot[0]}, ${bot[1]}, ${bot[2]}, 1) 100%)`;
}
