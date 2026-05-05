import { motion } from 'framer-motion';
import { useEffect } from 'react';
import type { District, Zone } from '../data/zones';
import { techLinks } from '../data/techLinks';

interface ZoneDeepDiveProps {
  zone: Zone;
  onBack: () => void;
}

const fadeUp = {
  hidden: { opacity: 0, y: 22 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const } },
};

/**
 * Full-page deep dive for a single zone — replaces the landing view when the
 * URL hash matches a zone slug. Renders the zone's atlas with each tag
 * resolved to its homepage link via {@link techLinks}.
 */
export function ZoneDeepDive({ zone, onBack }: ZoneDeepDiveProps) {
  useEffect(() => {
    // Always start the deep dive scrolled to top.
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, [zone.slug]);

  return (
    <main className="deep-dive">
      <div className="shell">
        <motion.button
          type="button"
          className="deep-dive__back"
          onClick={onBack}
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] as const }}
          aria-label="Return to the descent"
        >
          <span className="icon">arrow_back</span>
          <span>Return to the descent</span>
        </motion.button>

        <motion.header
          className="deep-dive__head"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] as const, delay: 0.1 }}
        >
          <div className="deep-dive__eyebrow">{zone.label}</div>
          <h1 className="deep-dive__title">{zone.title}</h1>
          <div className="deep-dive__telemetry">
            <span>CURRENT_DEPTH: {zone.depth}</span>
            <span>TEMP: {zone.temp}</span>
          </div>
          <p className="deep-dive__subtitle">{zone.subtitle}</p>
        </motion.header>

        <motion.div
          className="deep-dive__atlas"
          initial="hidden"
          animate="show"
          variants={{ show: { transition: { staggerChildren: 0.06, delayChildren: 0.25 } } }}
        >
          {zone.districts.map((d) => (
            <DistrictDeep key={d.number} district={d} />
          ))}
        </motion.div>
      </div>
    </main>
  );
}

function DistrictDeep({ district }: { district: District }) {
  return (
    <motion.article className="atlas-card atlas-card--deep" variants={fadeUp}>
      <div className="atlas-card__head">
        <span className="atlas-card__num">{district.number}</span>
        <span className="atlas-card__district">{district.district}</span>
      </div>
      <h3 className="atlas-card__heading">{district.heading}</h3>
      <p className="atlas-card__body">{district.body}</p>
      <ul className="atlas-card__tags atlas-card__tags--linked">
        {district.tags.map((tag) => {
          const href = techLinks[tag];
          if (href) {
            return (
              <li key={tag}>
                <a href={href} target="_blank" rel="noopener noreferrer">
                  {tag}
                  <span className="icon atlas-card__ext">north_east</span>
                </a>
              </li>
            );
          }
          return <li key={tag}>{tag}</li>;
        })}
      </ul>
    </motion.article>
  );
}
