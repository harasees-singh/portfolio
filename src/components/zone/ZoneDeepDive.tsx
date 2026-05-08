import { motion } from 'framer-motion';
import { useEffect } from 'react';
import type { Chapter, Zone } from '../../data/zones';
import { techLinks } from '../../data/techLinks';

interface ZoneDeepDiveProps {
  zone: Zone;
  onBack: () => void;
}

const fadeUp = {
  hidden: { opacity: 0, y: 22 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const } },
};

/**
 * Full-page deep dive for a single zone.
 *
 * Renders the zone as a vertical "field log" timeline rather than a grid of
 * tech-stack cards. Each chapter on the rail frames a design *problem* and
 * tells the conceptual story of how it is approached; tools referenced
 * along the way live in the link pills below the narrative, where they can
 * be tapped through to their homepages without crowding the prose.
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

        {/* Vertical timeline. Numbered chapter "nodes" are connected by a
            cyan rail down the left, so the page reads as a continuous
            descent through ideas instead of a grid of disconnected cards. */}
        <motion.ol
          className="deep-dive__timeline"
          initial="hidden"
          animate="show"
          variants={{ show: { transition: { staggerChildren: 0.06, delayChildren: 0.25 } } }}
          aria-label={`${zone.label} chapters`}
        >
          {zone.chapters.map((c) => (
            <ChapterEntry key={c.number} chapter={c} />
          ))}
        </motion.ol>
      </div>
    </main>
  );
}

function ChapterEntry({ chapter }: { chapter: Chapter }) {
  return (
    <motion.li className="deep-dive__chapter" variants={fadeUp}>
      <span className="deep-dive__chapter-badge" aria-hidden>
        {chapter.number}
      </span>
      <div className="deep-dive__chapter-body">
        <h2 className="deep-dive__chapter-problem">{chapter.problem}</h2>
        <p className="deep-dive__chapter-narrative">{chapter.narrative}</p>
        <ul className="deep-dive__chapter-tags" aria-label="Tools and concepts">
          {chapter.tags.map((tag) => {
            const href = techLinks[tag];
            if (href) {
              return (
                <li key={tag}>
                  <a href={href} target="_blank" rel="noopener noreferrer">
                    {tag}
                    <span className="icon deep-dive__chapter-tag-ext" aria-hidden>
                      north_east
                    </span>
                  </a>
                </li>
              );
            }
            return <li key={tag}>{tag}</li>;
          })}
        </ul>
      </div>
    </motion.li>
  );
}
