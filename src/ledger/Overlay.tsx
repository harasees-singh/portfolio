import { useState, useEffect, useRef } from 'react';
import { useScroll } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { motion, type Variants } from 'framer-motion';
import {
  Anchor, Compass, Waves, ChevronDown, ArrowRight, Eye, DraftingCompass,
  Sparkles, Shield, Container, Cloud, Code, Boxes,
} from 'lucide-react';
import { SHORE, DEEP, HOARD } from './data';
import { scrollStore, useNavState, type Section } from './scroll-store';

/* =========================================================
   ScrollPublisher — lives INSIDE Canvas/ScrollControls. Reads scroll
   progress and republishes section + theme changes to a module-level
   store so the Nav (rendered outside Canvas) can react.
   ========================================================= */

export function ScrollPublisher() {
  const scroll = useScroll();
  const last = useRef<Section>('shore');
  const lastDeep = useRef(false);

  useEffect(() => {
    scrollStore.setEl(scroll.el);
    return () => scrollStore.setEl(null);
  }, [scroll.el]);

  useFrame(() => {
    const o = scroll.offset;
    // 5 pages: shore covers 0..0.3, deep 0.3..0.65, hoard 0.65..1.0
    const next: Section = o < 0.3 ? 'shore' : o < 0.65 ? 'deep' : 'hoard';
    const deep = o > 0.28;
    if (next !== last.current || deep !== lastDeep.current) {
      last.current = next;
      lastDeep.current = deep;
      scrollStore.publish({ section: next, isDeep: deep });
    }
  });

  return null;
}

/* =========================================================
   Top-of-canvas nav. Rendered OUTSIDE the Canvas tree so its
   position: fixed actually pins it to the viewport.
   ========================================================= */

export function Nav() {
  const { section, isDeep } = useNavState();
  return (
    <nav className={'nav' + (isDeep ? ' is-deep' : '')}>
      <div className="nav__brand">The Mariner's Ledger</div>
      <div className="nav__tabs">
        {(['shore', 'deep', 'hoard'] as const).map((id) => (
          <button
            key={id}
            className={'nav__tab' + (section === id ? ' is-active' : '')}
            onClick={() => scrollStore.scrollTo(id)}
          >
            {id === 'shore' ? 'The Shore' : id === 'deep' ? 'The Deep' : 'The Hoard'}
          </button>
        ))}
      </div>
      <div className="nav__actions">
        <button className="icon-btn" aria-label="Compass" title="Compass">
          <Compass size={20} strokeWidth={1.6} />
        </button>
        <button className="icon-btn" aria-label="Anchor" title="Anchor">
          <Anchor size={20} strokeWidth={1.6} />
        </button>
      </div>
    </nav>
  );
}

/* =========================================================
   The full HTML overlay (Shore / Deep / Hoard / Footer)
   ========================================================= */

export function Overlay() {
  return (
    <div className="overlay">
      <Shore />
      <Deep />
      <Hoard />
      <Footer />
    </div>
  );
}

/* ---------- shared motion variants ---------- */

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.85, ease: [0.16, 1, 0.3, 1] } },
};

const stagger: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.05 } },
};

const viewport = { once: false, amount: 0.25 } as const;

/* =========================================================
   SHORE
   ========================================================= */

function Shore() {
  return (
    <section className="section shore">
      <motion.div
        className="shore__inner"
        variants={stagger}
        initial="hidden"
        whileInView="visible"
        viewport={viewport}
      >
        <motion.span variants={fadeUp} className="shore__eyebrow">{SHORE.eyebrow}</motion.span>
        <motion.h1   variants={fadeUp} className="shore__title">{SHORE.title}</motion.h1>
        <motion.p    variants={fadeUp} className="shore__lede">{SHORE.lede}</motion.p>
        <motion.div  variants={fadeUp} className="shore__scroll">
          <span className="shore__scroll-label">Scroll to descend</span>
          <ChevronDown size={28} strokeWidth={1.5} />
        </motion.div>
      </motion.div>

      <motion.div
        className="shore__state"
        initial={{ opacity: 0, x: -20 }}
        whileInView={{ opacity: 1, x: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }}
        viewport={viewport}
      >
        <Waves size={20} strokeWidth={1.6} className="shore__state-icon" />
        <div>
          <p className="shore__state-label">{SHORE.state.label}</p>
          <p className="shore__state-value">{SHORE.state.value}</p>
        </div>
      </motion.div>

      {/* Bento grid */}
      <motion.div
        className="shore__bento"
        variants={stagger}
        initial="hidden"
        whileInView="visible"
        viewport={viewport}
      >
        <motion.article variants={fadeUp} className="bento-large">
          <div className="glass">
            <div className="bento-large__media">
              <img alt="" src={SHORE.cards.journal.image} />
            </div>
            <div className="bento-large__inner">
              <span className="eyebrow">{SHORE.cards.journal.eyebrow}</span>
              <h3 className="bento-large__title">{SHORE.cards.journal.title}</h3>
              <p className="bento-text">{SHORE.cards.journal.body}</p>
            </div>
          </div>
        </motion.article>

        <motion.article variants={fadeUp} className="bento-side">
          <div className="glass">
            <DraftingCompass size={42} strokeWidth={1.4} className="bento-side__icon" />
            <h3 className="bento-side__title">{SHORE.cards.tools.title}</h3>
            <p className="bento-text">{SHORE.cards.tools.body}</p>
          </div>
        </motion.article>

        <motion.article variants={fadeUp} className="bento-side bento-side--alt">
          <div className="glass">
            <span className="eyebrow">{SHORE.cards.library.eyebrow}</span>
            <h3 className="bento-side__title" style={{ color: 'var(--primary)', marginBottom: '1rem' }}>
              {SHORE.cards.library.title}
            </h3>
            <span className="bento-side--alt__cta">
              {SHORE.cards.library.cta}
              <ArrowRight size={16} strokeWidth={1.8} />
            </span>
          </div>
        </motion.article>

        <motion.article variants={fadeUp} className="bento-wide">
          <div className="glass">
            <div className="bento-wide__media">
              <img alt="" src={SHORE.cards.lighthouse.image} />
            </div>
            <div className="bento-wide__body">
              <h3 className="bento-wide__title">{SHORE.cards.lighthouse.title}</h3>
              <p className="bento-text">{SHORE.cards.lighthouse.body}</p>
              <button className="btn-primary">{SHORE.cards.lighthouse.cta}</button>
            </div>
          </div>
        </motion.article>
      </motion.div>
    </section>
  );
}

/* =========================================================
   DEEP
   ========================================================= */

function Deep() {
  return (
    <section className="section deep">
      <motion.div
        className="deep__head"
        variants={stagger}
        initial="hidden"
        whileInView="visible"
        viewport={viewport}
      >
        <motion.span variants={fadeUp} className="deep__eyebrow">{DEEP.eyebrow}</motion.span>
        <motion.h2   variants={fadeUp} className="deep__title">{DEEP.title}</motion.h2>
        <motion.p    variants={fadeUp} className="deep__lede">{DEEP.lede}</motion.p>
      </motion.div>

      <motion.div
        className="deep__grid"
        variants={stagger}
        initial="hidden"
        whileInView="visible"
        viewport={viewport}
      >
        <motion.article variants={fadeUp} className="deep-card deep-card--feature">
          <div className="deep-card__head">
            <div>
              <span className="chip">{DEEP.feature.chip}</span>
              <h3 className="deep-card__title">{DEEP.feature.title}</h3>
            </div>
            <Eye size={28} strokeWidth={1.4} className="deep-card__head-icon" />
          </div>
          <div className="deep-card__media">
            <img alt="" src={DEEP.feature.image} />
          </div>
          <p className="deep-card__body">{DEEP.feature.body}</p>
          <div className="deep-card__actions">
            <button className="btn-pill btn-pill--filled">Review Records</button>
            <button className="btn-pill">Manifest</button>
          </div>
        </motion.article>

        <motion.article variants={fadeUp} className="deep-card deep-card--vert">
          <div className="deep-card--vert__media">
            <img alt="" src={DEEP.vert.image} />
          </div>
          <span className="deep-card--vert__label">{DEEP.vert.label}</span>
          <h3 className="deep-card--vert__title">{DEEP.vert.title}</h3>
          <p className="deep-card--vert__quote">{DEEP.vert.quote}</p>
          <a className="deep-card--vert__cta" href="#" onClick={(e) => e.preventDefault()}>
            View Full Inventory
            <ArrowRight size={16} strokeWidth={1.8} />
          </a>
        </motion.article>

        {DEEP.rows.map((r) => (
          <motion.article key={r.title} variants={fadeUp} className="deep-card deep-card--row">
            <div className="deep-card--row__avatar">
              <img alt="" src={r.image} />
            </div>
            <div>
              <h3>{r.title}</h3>
              <p>{r.body}</p>
            </div>
          </motion.article>
        ))}
      </motion.div>
    </section>
  );
}

/* =========================================================
   HOARD
   ========================================================= */

const SKILL_ICONS: Record<string, React.ComponentType<{ size?: number; strokeWidth?: number }>> = {
  k8s:    Boxes,
  docker: Container,
  node:   Code,
  aws:    Cloud,
};

function Hoard() {
  return (
    <section className="section hoard">
      <motion.div
        className="hoard__intro"
        variants={stagger}
        initial="hidden"
        whileInView="visible"
        viewport={viewport}
      >
        <motion.h1 variants={fadeUp}>{HOARD.title}</motion.h1>
        <motion.p  variants={fadeUp}>{HOARD.lede}</motion.p>
      </motion.div>

      <motion.div
        className="halo"
        variants={stagger}
        initial="hidden"
        whileInView="visible"
        viewport={viewport}
      >
        {HOARD.skills.map((s) => {
          const Icon = SKILL_ICONS[s.id] ?? Sparkles;
          return (
            <motion.div key={s.id} variants={fadeUp} className="halo__skill">
              <div className="halo__icon">
                <Icon size={30} strokeWidth={1.4} />
              </div>
              <span className="halo__label">{s.label}</span>
            </motion.div>
          );
        })}
      </motion.div>

      <motion.p
        className="hoard__quote"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0, transition: { duration: 0.85, ease: [0.16, 1, 0.3, 1] } }}
        viewport={viewport}
      >
        {HOARD.quote}
      </motion.p>

      <motion.div
        className="hoard__bento"
        variants={stagger}
        initial="hidden"
        whileInView="visible"
        viewport={viewport}
      >
        {HOARD.tiles.map((t, i) => (
          <motion.div
            key={t.title}
            variants={fadeUp}
            className={
              'hoard__tile' +
              (t.wide ? ' hoard__tile--wide' : '') +
              (i === 1 ? ' hoard__tile--accent' : '')
            }
          >
            {t.wide ? (
              <Sparkles size={22} strokeWidth={1.6} className="hoard__tile__icon" />
            ) : (
              <Shield size={22} strokeWidth={1.6} className="hoard__tile__icon" />
            )}
            <h3>{t.title}</h3>
            <p>{t.body}</p>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}

/* =========================================================
   FOOTER
   ========================================================= */

function Footer() {
  return (
    <footer className="footer">
      <div className="footer__links">
        <a href="#" onClick={(e) => e.preventDefault()}>The Map</a>
        <a href="#" onClick={(e) => e.preventDefault()}>The Compass</a>
        <a href="#" onClick={(e) => e.preventDefault()}>The Crew</a>
      </div>
      <div className="footer__meta">© 1724 Coastal Navigator. Charted with precision and mist.</div>
    </footer>
  );
}

/* =========================================================
   Boot splash — fades after the first frame
   ========================================================= */

export function Boot() {
  const [done, setDone] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setDone(true), 700);
    return () => clearTimeout(t);
  }, []);
  return (
    <div className={'boot' + (done ? ' is-done' : '')}>
      <div>
        <div className="boot__title">The Mariner's Ledger</div>
        <div className="boot__sub">— Charting the depths —</div>
      </div>
    </div>
  );
}
