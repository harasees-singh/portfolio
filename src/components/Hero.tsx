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
 * Sunlit zone — first true depth section (~30m). Holds the main H1 title and
 * uses the same eyebrow/title/telemetry header pattern as the deeper zones
 * so the descent reads as a continuous documentary rather than a hero plate.
 *
 * The sunlit waters are where the engineer is most at home — these are the
 * "districts" of strongest proficiency, framed as a cartographer's chart of
 * data territories. The metaphor matches the deep-sea narrative: bright,
 * abundant, and well-mapped at the surface; pressure (depth) will reveal a
 * different set of strengths in the zones below.
 */
export function Hero() {
  return (
    <section id="sunlit-hero" className="hero">
      <div className="shell">
        <header className="zone__header">
          <div>
            <div className="zone__eyebrow">Sunlit Zone</div>
            <h1 className="hero__title">Charting the depths of databases</h1>
          </div>
          <div className="zone__telemetry">
            <span>CURRENT_DEPTH: 30m</span>
            <span>TEMP: 22°C</span>
          </div>
        </header>
        <p className="hero__subtitle">
          The sunlit waters — where the map is bright and the trade routes are well-worn.
          These are the data territories I navigate every day, the districts I know by
          heart.
        </p>

        <motion.div
          className="hero__atlas"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          variants={{ show: { transition: { staggerChildren: 0.08 } } }}
        >
          <DistrictCard
            districtNumber="01"
            district="The Relational Empire"
            heading="SQL"
            body="The capital city of every serious backend I ship. Schema design, query
                  planning along the Declarative River, indexing strategy, and transaction
                  semantics for long-lived OLTP workloads."
            tags={['PostgreSQL', 'MySQL', 'SQL Server', 'Oracle', 'DB2']}
          />
          <DistrictCard
            districtNumber="02"
            district="Document Data District"
            heading="NoSQL Document Stores"
            body="Flexible-schema modelling along Cape JSON — denormalised reads, change
                  streams, and TTL-driven hygiene for product surfaces that move faster
                  than a rigid schema can keep up."
            tags={['MongoDB', 'CouchDB', 'RethinkDB', 'HyperDex']}
          />
          <DistrictCard
            districtNumber="03"
            district="Column-Family District"
            heading="NoSQL Wide Column Stores"
            body="Wide-row stores for analytics and time-series at scale. Partition keys
                  that survive growth, tunable consistency, and compaction strategies that
                  keep tail latency honest."
            tags={['HBase', 'Cassandra']}
          />
          <DistrictCard
            districtNumber="04"
            district="Key-Value District"
            heading="NoSQL Key-Value Stores"
            body="Hot paths, rate limiters, distributed locks, idempotency keys, and the
                  cache layer that quietly absorbs an order of magnitude of traffic before
                  anyone notices."
            tags={['Redis', 'Aerospike', 'Riak', 'Voldemort', 'Berkeley DB']}
          />
        </motion.div>
      </div>
    </section>
  );
}

interface DistrictCardProps {
  districtNumber: string;
  district: string;
  heading: string;
  body: string;
  tags: string[];
}

function DistrictCard({ districtNumber, district, heading, body, tags }: DistrictCardProps) {
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
