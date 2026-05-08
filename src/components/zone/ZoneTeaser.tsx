import { motion } from 'framer-motion';
import type { Zone } from '../../data/zones';
import { ExploreLink } from '../landing/Hero';
import { ZoneOrbit, hashSeed } from './ZoneOrbit';

interface ZoneTeaserProps {
  zone: Zone;
  onExplore: (slug: string) => void;
}

const fadeUp = {
  hidden: { opacity: 0, y: 22 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] as const } },
};

/**
 * Minimal landing-page section for a zone. Shows just the eyebrow, title, a
 * single-sentence teaser, the depth telemetry, and an animated "Explore"
 * link that navigates to the zone's deep-dive route via {@link onExplore}.
 */
export function ZoneTeaser({ zone, onExplore }: ZoneTeaserProps) {
  return (
    <section id={zone.id} className="zone zone--teaser">
      <div className="shell zone__stage">
        {zone.orbit && <ZoneOrbit items={zone.orbit} seed={hashSeed(zone.slug)} />}
        <motion.div
          className="zone__content"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.35 }}
          variants={{ show: { transition: { staggerChildren: 0.08 } } }}
        >
          <motion.header className="zone__header" variants={fadeUp}>
            <div>
              <div className="zone__eyebrow">{zone.label}</div>
              <h2 className="zone__title">{zone.title}</h2>
            </div>
            <div className="zone__telemetry">
              <span>CURRENT_DEPTH: {zone.depth}</span>
              <span>TEMP: {zone.temp}</span>
            </div>
          </motion.header>

          <motion.p className="hero__subtitle zone__teaser-body" variants={fadeUp}>
            {zone.teaser}
          </motion.p>

          <motion.div variants={fadeUp}>
            <ExploreLink label={zone.cta} onClick={() => onExplore(zone.slug)} />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
