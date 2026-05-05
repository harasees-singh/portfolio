import { motion } from 'framer-motion';

const fadeUp = {
  hidden: { opacity: 0, y: 22 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] as const } },
};

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
            <span className="surface-entry__eyebrow">Harasees Singh · Portfolio</span>
            <h2 className="surface-entry__wordmark">A deep dive into my work.</h2>
            <p className="surface-entry__sub">
                A software engineer's field notes from the depths of backend architecture —
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
 * Sunlit zone — first true depth section (~30m). Renders as a minimal
 * teaser on the landing page and links to the Sunlit deep-dive route for
 * the full atlas.
 */
export function Hero({ onExplore }: { onExplore: (slug: string) => void }) {
  return (
    <section id="sunlit-hero" className="hero">
      <div className="shell">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
          variants={{ show: { transition: { staggerChildren: 0.08 } } }}
        >
          <motion.header className="zone__header" variants={fadeUp}>
            <div>
              <div className="zone__eyebrow">Sunlit Zone</div>
              <h1 className="hero__title">Charting the depths of databases and storage.</h1>
            </div>
            <div className="zone__telemetry">
              <span>CURRENT_DEPTH: 30m</span>
              <span>TEMP: 22°C</span>
            </div>
          </motion.header>

          <motion.p className="hero__subtitle" variants={fadeUp}>
            The sunlit waters — where the map is bright and the trade routes are
            well-worn. The data territories I navigate every day, the districts I know
            by heart before the pressure starts to mount.
          </motion.p>

          <motion.div variants={fadeUp}>
            <ExploreLink label="Chart the Sunlit territories" onClick={() => onExplore('sunlit')} />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

/**
 * Animated link that reads as a continuation of the descent. Shared between
 * the Hero and the deeper ZoneTeaser sections so the visual language is
 * consistent across the landing page.
 */
export function ExploreLink({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button type="button" className="explore-link" onClick={onClick}>
      <span className="explore-link__label">{label}</span>
      <span className="explore-link__rule" aria-hidden />
      <span className="icon explore-link__arrow" aria-hidden>
        arrow_forward
      </span>
    </button>
  );
}

interface DistrictCardProps {
  districtNumber: string;
  district: string;
  heading: string;
  body: string;
  tags: string[];
}

export function DistrictCard({ districtNumber, district, heading, body, tags }: DistrictCardProps) {
  return (
    <motion.article className="atlas-card" variants={fadeUp}>
      <div className="atlas-card__head">
        <span className="atlas-card__num">{districtNumber}</span>
        <span className="atlas-card__district">{district}</span>
      </div>
      <h3 className="atlas-card__heading">{heading}</h3>
      <p className="atlas-card__body">{body}</p>
      <ul className="atlas-card__tags">
        {tags.map((t) => (
          <li key={t}>{t}</li>
        ))}
      </ul>
    </motion.article>
  );
}
