import { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform, type MotionValue } from 'framer-motion';
import './OceanScroll.css';

/* ============================================================
   Six oceanic zones, scrolled top -> bottom.
   Single "engineering at depth" dialect throughout — depth is
   purely a metaphor for capability.
   ============================================================ */
type Zone = {
  id: string;
  label: string;   // short HUD label
  depth: number;   // metres
};

const ZONES: Zone[] = [
  { id: 'surface',  label: 'Surface',  depth: 0 },
  { id: 'sunlit',   label: 'Sunlit',   depth: 200 },
  { id: 'twilight', label: 'Twilight', depth: 1000 },
  { id: 'abyssal',  label: 'Abyssal',  depth: 4000 },
  { id: 'deep',     label: 'Deep',     depth: 5500 },
  { id: 'hadal',    label: 'Hadal',    depth: 10900 },
];

export default function OceanScroll() {
  const pageRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: pageRef, offset: ['start start', 'end end'] });

  const [depth, setDepth] = useState(0);
  const [activeZoneIdx, setActiveZoneIdx] = useState(0);

  useEffect(() => {
    const max = ZONES[ZONES.length - 1].depth;
    const unsub = scrollYProgress.on('change', (p) => {
      const d = Math.round(p * max);
      setDepth(d);
      let idx = 0;
      for (let i = 0; i < ZONES.length; i++) if (d >= ZONES[i].depth) idx = i;
      setActiveZoneIdx(idx);
    });
    return () => unsub();
  }, [scrollYProgress]);

  /* Background descends from cool steel-teal surface to crushing black. */
  const bg = useTransform(
    scrollYProgress,
    [0, 0.18, 0.4, 0.62, 0.82, 1],
    [
      'linear-gradient(180deg, #0e2a33 0%, #0a1f26 100%)',
      'linear-gradient(180deg, #0a1f26 0%, #07171d 100%)',
      'linear-gradient(180deg, #07171d 0%, #051218 100%)',
      'linear-gradient(180deg, #040f15 0%, #020a0f 100%)',
      'linear-gradient(180deg, #020a0f 0%, #010609 100%)',
      'linear-gradient(180deg, #010509 0%, #000204 100%)',
    ]
  );

  /* Cyan saturation intensifies subtly with depth. */
  const accent = useTransform(
    scrollYProgress,
    [0, 0.4, 1],
    ['#7fbfae', '#4be3c4', '#4be3c4']
  );

  useCssVar('--bg-grad', bg);
  useCssVar('--accent', accent);

  return (
    <div ref={pageRef} className="ocean-scroll">
      <ZoneNav active={activeZoneIdx} />
      <DepthGauge depth={depth} zones={ZONES} activeIdx={activeZoneIdx} />

      <SurfaceSection />
      <SunlitSection />
      <TwilightSection />
      <AbyssalSection />
      <DeepSection />
      <HadalSection />

      <SurfaceFooter />
    </div>
  );
}

/* Bind a MotionValue to a CSS variable on <html>. */
function useCssVar(name: string, mv: MotionValue<string>) {
  useEffect(() => {
    const el = document.documentElement;
    const unsub = mv.on('change', (v) => el.style.setProperty(name, v));
    el.style.setProperty(name, mv.get());
    return () => unsub();
  }, [name, mv]);
}

/* ============================================================
   Top navigation
   ============================================================ */
function ZoneNav({ active }: { active: number }) {
  return (
    <header className="zone-nav">
      <div className="zone-nav__brand">
        <span className="brand-mono">DESCENT_TERMINAL</span>
      </div>
      <nav className="zone-nav__links">
        {ZONES.map((z, i) => (
          <a
            key={z.id}
            href={`#${z.id}`}
            className={`zone-nav__link ${i === active ? 'is-active' : ''}`}
          >
            {z.label.toUpperCase()}
          </a>
        ))}
      </nav>
      <div className="zone-nav__meta">
        <span className="msi">explore</span>
      </div>
    </header>
  );
}

/* ============================================================
   Persistent right-side depth gauge (HUD)
   ============================================================ */
function DepthGauge({
  depth,
  zones,
  activeIdx,
}: {
  depth: number;
  zones: Zone[];
  activeIdx: number;
}) {
  const maxDepth = zones[zones.length - 1].depth;
  const pct = Math.min(100, (depth / maxDepth) * 100);
  // Distribute zone ticks evenly along the rail — ocean depths are not linear,
  // so we use scroll-section position rather than physical metres.
  const tickPct = (i: number) => (i / (zones.length - 1)) * 100;

  return (
    <aside className="depth-gauge">
      <div className="depth-gauge__readout">
        <div className="depth-gauge__num">{depth.toLocaleString()}</div>
        <div className="depth-gauge__unit">m</div>
      </div>
      <div className="depth-gauge__rail">
        <div className="depth-gauge__fill" style={{ height: `${pct}%` }} />
        {zones.map((z, i) => (
          <div
            key={z.id}
            className={`depth-gauge__tick ${i <= activeIdx ? 'is-passed' : ''}`}
            style={{ top: `${tickPct(i)}%` }}
            title={`${z.label} — ${z.depth}m`}
          >
            <span className="depth-gauge__tick-label">{z.label}</span>
          </div>
        ))}
      </div>
      <div className="depth-gauge__legend">
        <Stat icon="water_lux"      label="0m" />
        <Stat icon="waves"          label="200m" />
        <Stat icon="dark_mode"      label="1000m" />
        <Stat icon="visibility_off" label="6000m" />
      </div>
    </aside>
  );
}

function Stat({ icon, label }: { icon: string; label: string }) {
  return (
    <div className="depth-gauge__stat">
      <span className="msi">{icon}</span>
      <span>{label}</span>
    </div>
  );
}

/* ============================================================
   Section 0 — Surface (Hero)
   ============================================================ */
function SurfaceSection() {
  return (
    <section id="surface" className="zone zone--hero">
      <div className="zone__inner zone__inner--center">
        <p className="kicker mono">SECTOR · SUNLIT_SURFACE · 0,000M</p>
        <h1 className="display">
          ENGINEERING<br />AT&nbsp;DEPTH
        </h1>
        <p className="lead">
          A descent through six ocean zones. Each layer reveals a deeper level of
          the systems I build — from surface infrastructure to kernel-level
          optimisation in the trench.
        </p>
        <a className="cta cta--primary" href="#sunlit">
          <span>INITIATE_DESCENT</span>
          <span className="msi">arrow_downward</span>
        </a>

        <div className="hero-stats">
          <div className="hero-stat"><span className="hero-stat__k mono">O2_LEVEL</span><span className="hero-stat__v mono">98%</span></div>
          <div className="hero-stat"><span className="hero-stat__k mono">PRESSURE</span><span className="hero-stat__v mono">1 atm</span></div>
          <div className="hero-stat"><span className="hero-stat__k mono">SIGNAL</span><span className="hero-stat__v mono">NOMINAL</span></div>
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   Section 1 — Sunlit (intro / about)
   ============================================================ */
function SunlitSection() {
  return (
    <section id="sunlit" className="zone">
      <div className="zone__inner">
        <ZoneHeader depth={200} label="Epipelagic / Sunlit" tagline="Where the work is visible from the surface." />
        <h2 className="display-md">PRODUCT_SURFACE</h2>
        <p className="prose">
          Interfaces that respect the user&rsquo;s attention. Component systems,
          interaction design, and the boring-but-vital details that make a
          product feel quiet, fast, and inevitable.
        </p>

        <div className="grid grid--three">
          <SpecCard icon="design_services"   tag="UX_LAYER"     title="Interface Systems"    body="Composable component libraries, motion vocabularies, and design tokens kept in lockstep across surfaces." />
          <SpecCard icon="bolt"              tag="PERF_BUDGET"  title="Frontend Performance" body="Real-user metrics over synthetic scores. Ruthless about render cost, bundle weight, and interaction latency." />
          <SpecCard icon="accessibility_new" tag="WCAG_AA"      title="Accessibility"        body="Keyboard, screen reader, and reduced-motion paths treated as core features, not afterthoughts." />
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   Section 2 — Twilight Zone (specifications)
   ============================================================ */
function TwilightSection() {
  return (
    <section id="twilight" className="zone">
      <div className="zone__inner">
        <ZoneHeader
          depth={1000}
          label="Mesopelagic / Twilight"
          tagline="Light begins to fade. Specifications begin to matter."
        />
        <h2 className="display-md">SPECIFICATIONS</h2>

        <div className="grid grid--three">
          <SpecCard icon="api"              tag="STABLE_V1.0" title="RESTful APIs"      body="Versioned, idempotent, and documented. Scalable patterns for high-throughput data exchange under marine pressure." />
          <SpecCard icon="database"         tag="SQL / NOSQL" title="Database Design"   body="Complex relational mapping, partitioning strategy, and high-availability indexing for cold-storage retrieval." />
          <SpecCard icon="developer_board"  tag="EVENT_LOOP"  title="Node.js Ecosystem" body="Asynchronous runtime optimisation for real-time data processing at variable depth and load." />
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   Section 3 — Abyssal Plane (distributed systems)
   ============================================================ */
function AbyssalSection() {
  return (
    <section id="abyssal" className="zone">
      <div className="zone__inner">
        <ZoneHeader
          depth={4000}
          label="Abyssopelagic / Abyssal Plane"
          tagline="No light. Only orchestration."
        />
        <h2 className="display-md">DISTRIBUTED SYSTEMS</h2>
        <p className="prose">
          At forty megapascals the casing groans. Software that must not. Down
          here architecture is the difference between signal and silence.
        </p>

        <div className="grid grid--three">
          <DeepCard icon="hub"       title="Kubernetes"          body="Orchestrating containerised armadas across distributed environments." chip="DEPLOY_READY" />
          <DeepCard icon="package_2" title="Docker"              body="Isolated environments ensuring consistent behaviour at any pressure." chip="CONTAINER_LOCKED" />
          <DeepCard icon="lan"       title="Distributed Systems" body="Highly fault-tolerant architecture designed for the vast abyss."     chip="NETWORK_SYNCED" />
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   Section 4 — The Deep (selected work)
   ============================================================ */
function DeepSection() {
  const projects = [
    {
      year: '2025',
      title: 'Stream Processing Platform',
      body: 'Multi-tenant ingestion plane handling 1.2M events/sec with sub-100ms p99. Custom backpressure protocol replaced the off-the-shelf broker.',
      tag: 'PLATFORM',
      cta: 'Read Case Study',
    },
    {
      year: '2024',
      title: 'Edge Inference Runtime',
      body: 'Quantised model runtime running on constrained hardware at the edge. Cold-start eliminated via shared-memory weight pages.',
      tag: 'INFRASTRUCTURE',
      cta: 'Open Repository',
    },
    {
      year: '2023',
      title: 'Observability Pipeline',
      body: 'Trace, metric, and log fusion with derived service maps. Cut incident MTTR by an order of magnitude across the org.',
      tag: 'TOOLING',
      cta: 'View Architecture',
    },
    {
      year: '2022',
      title: 'Design System Migration',
      body: 'Lifted four product surfaces onto a single component pipeline without freezing feature work. Zero visual regressions at launch.',
      tag: 'DESIGN_OPS',
      cta: 'Read Postmortem',
    },
  ];

  return (
    <section id="deep" className="zone">
      <div className="zone__inner">
        <ZoneHeader
          depth={5500}
          label="The Deep — Selected Work"
          tagline="Pressure-tested artefacts retrieved from the silent canyons."
        />
        <h2 className="display-md">SELECTED WORK</h2>

        <div className="grid grid--two">
          {projects.map((p) => (
            <article key={p.title} className="card card--abyss">
              <div className="card__meta">
                <span className="chip chip--mono">{p.tag}</span>
                <span className="card__year mono">{p.year}</span>
              </div>
              <h3 className="card__title">{p.title}</h3>
              <p className="card__body">{p.body}</p>
              <a className="card__cta" href="#hadal">
                {p.cta} <span className="msi">arrow_forward</span>
              </a>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   Section 5 — Hadal Zone (performance + contact)
   ============================================================ */
function HadalSection() {
  return (
    <section id="hadal" className="zone">
      <div className="zone__inner">
        <ZoneHeader
          depth={10900}
          label="Hadal Zone"
          tagline="Where engineering meets extreme physics."
        />
        <h2 className="display-md">PERFORMANCE TUNING</h2>
        <p className="prose">
          Minimising latency through cache-aware algorithms and assembly-level
          hot-path optimisation. We don&rsquo;t just write code; we orchestrate silicon.
        </p>

        <div className="grid grid--three stats">
          <StatBig label="LATENCY"    value="0.02" unit="ms" />
          <StatBig label="THROUGHPUT" value="12.4" unit="GB/s" />
          <StatBig label="JITTER"     value="<1"   unit="μs" />
        </div>

        <div className="grid grid--two">
          <DeepCard icon="memory" title="Custom Runtimes"     body="Arena allocation, no GC, lock-free threading. Built for the trench, not the trade winds." chip="ARCH_MOD_01" />
          <DeepCard icon="speed"  title="Kernel Optimisation" body="Direct interaction with hardware primitives, syscall reduction, custom eBPF instrumentation." chip="EBPF · ZERO_COPY" />
        </div>

        <div className="contact">
          <p className="contact__pre mono">Protocol 00 · Surface Communication</p>
          <a className="contact__btn" href="mailto:hello@example.com">
            <span className="msi">emergency_home</span>
            <span>EMERGENCY_ASCENT</span>
          </a>
          <p className="contact__post mono">SIGNAL_STRENGTH: NOMINAL</p>
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   Reusable bits
   ============================================================ */
function ZoneHeader({
  depth,
  label,
  tagline,
}: {
  depth: number;
  label: string;
  tagline: string;
}) {
  return (
    <motion.header
      className="zone-header"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-15% 0px' }}
      transition={{ duration: 0.7, ease: [0.22, 0.7, 0.2, 1] }}
    >
      <div className="zone-header__rule" />
      <div className="zone-header__row">
        <span className="mono kicker">DEPTH: {depth.toLocaleString()}M</span>
        <span className="zone-header__dot" />
        <span className="mono kicker">{label}</span>
      </div>
      <p className="zone-header__tag mono">{tagline}</p>
    </motion.header>
  );
}

function SpecCard({
  icon, tag, title, body,
}: { icon: string; tag: string; title: string; body: string }) {
  return (
    <motion.article
      className="card card--abyss"
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-10% 0px' }}
      transition={{ duration: 0.5 }}
    >
      <div className="card__meta">
        <span className="msi card__icon-sm">{icon}</span>
        <span className="chip chip--mono">{tag}</span>
      </div>
      <h3 className="card__title">{title}</h3>
      <p className="card__body">{body}</p>
    </motion.article>
  );
}

function DeepCard({
  icon, title, body, chip,
}: { icon: string; title: string; body: string; chip: string }) {
  return (
    <motion.article
      className="card card--abyss"
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-10% 0px' }}
      transition={{ duration: 0.5 }}
    >
      <div className="card__meta">
        <span className="msi card__icon-sm">{icon}</span>
        <span className="chip chip--mono">{chip}</span>
      </div>
      <h3 className="card__title">{title}</h3>
      <p className="card__body">{body}</p>
    </motion.article>
  );
}

function StatBig({ label, value, unit }: { label: string; value: string; unit: string }) {
  return (
    <div className="stat-big">
      <div className="stat-big__label mono">{label}</div>
      <div className="stat-big__value">
        <span className="stat-big__num">{value}</span>
        <span className="stat-big__unit mono">{unit}</span>
      </div>
    </div>
  );
}

function SurfaceFooter() {
  return (
    <footer className="surface-footer">
      <div className="surface-footer__inner">
        <div className="surface-footer__brand mono">DESCENT_TERMINAL</div>
        <nav className="surface-footer__links mono">
          <a href="#surface">SURFACE</a>
          <a href="#twilight">TWILIGHT</a>
          <a href="#deep">DEEP_STORAGE</a>
          <a href="#hadal">HADAL</a>
        </nav>
        <p className="surface-footer__legal mono">
          © {new Date().getFullYear()} DESCENT_TERMINAL // END_OF_DESCENT
        </p>
      </div>
    </footer>
  );
}
