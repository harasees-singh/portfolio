import { motion } from 'framer-motion';

/**
 * Top of page — full viewport "Surface" entry. Anchored over the island in
 * the background video with a soft entrance and a continuous float so the
 * landing reads as a living scene rather than a static plate.
 */
export function SurfaceEntry() {
  return (
    <section id="surface" className="surface-entry">
      <div className="surface-entry__center">
        <motion.div
          className="surface-entry__enter"
          initial={{ opacity: 0, y: 24, filter: 'blur(6px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] as const, delay: 0.2 }}
        >
          <motion.div
            className="surface-entry__float"
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 7, ease: 'easeInOut', repeat: Infinity }}
          >
            <span className="surface-entry__eyebrow">Deep_Sea_Archive · Mission 014</span>
            <h2 className="surface-entry__wordmark">A descent through the platform.</h2>
            <p className="surface-entry__sub">
              Field notes from beneath the surface — pulled from the same place the
              numbers, the noise, and the cold-water APIs live.
            </p>
          </motion.div>
        </motion.div>
      </div>

      <ScrollHint targetId="sunlit-hero" />
    </section>
  );
}

/**
 * Animated cue at the bottom of the surface entry telling the user to scroll.
 * Uses a falling bead inside a thin gradient rail with a breathing chip label.
 */
export function ScrollHint({ targetId }: { targetId: string }) {
  const onClick = () => {
    document.getElementById(targetId)?.scrollIntoView({ behavior: 'smooth' });
  };
  return (
    <div className="scroll-hint">
      <motion.button
        type="button"
        className="scroll-hint__btn"
        onClick={onClick}
        aria-label="Scroll to descend"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] as const, delay: 1.6 }}
      >
        <span className="scroll-hint__chip">
          <span className="icon">expand_more</span>
          <span>Scroll to descend</span>
        </span>
        <span className="scroll-hint__rail" aria-hidden>
          <span className="scroll-hint__bead" />
        </span>
      </motion.button>
    </div>
  );
}

/**
 * Sunlit zone — first true depth section (~30m). Holds the main H1 plate so
 * the user reaches it by sinking past the surface, not by landing on it.
 */
export function Hero() {
  return (
    <section id="sunlit-hero" className="hero">
      <div className="hero__plate">
        <span className="hero__eyebrow">Sunlit Zone · 30m</span>
        <h1 className="hero__title">Charting the depths of backend architecture.</h1>
        <p className="hero__subtitle">
          Field notes from a software engineer descending through the layers of the modern
          data ecosystem — from sunlit APIs to the silent pressure of the platform abyss.
        </p>
      </div>
    </section>
  );
}
