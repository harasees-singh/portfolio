import { useEffect, useRef } from 'react';

export interface ZoneOrbitProps {
  /** Short tech names rendered inside each bubble. */
  items: readonly string[];
  /**
   * Stable seed (e.g. a numeric hash of the zone slug) so each zone gets a
   * distinct but deterministic set of orbit paths.
   */
  seed: number;
}

/**
 * Maps display name → simple-icons slug. Anything not listed here is
 * skipped at render time so a tech without an official icon never shows up
 * as an empty bubble. Slugs that 404 at runtime are also self-removed via
 * the `<img onError>` handler below, so a broken slug never leaves a
 * blank bubble on screen either.
 *
 * Icons are pulled from `cdn.simpleicons.org`, which returns a coloured
 * SVG (we tint to the page's primary cyan via the `/<hex>` suffix) so the
 * bundle stays small and every glyph picks up the descent palette.
 *
 * Note: simple-icons doesn't ship marks for some core infra projects
 * (Protobuf, gRPC, Thrift, Avro, ZooKeeper). Two strategies:
 *   - Apache-family projects with no dedicated mark map to the generic
 *     `apache` feather. Use sparingly so the orbit doesn't read as
 *     "three feathers and a database".
 *   - Anything else is simply omitted, and the corresponding bubble
 *     never renders.
 */
const ICON_SLUGS: Record<string, string> = {
  PostgreSQL: 'postgresql',
  MySQL: 'mysql',
  MongoDB: 'mongodb',
  Redis: 'redis',
  Cassandra: 'apachecassandra',
  Thrift: 'apache',
  Parquet: 'apacheparquet',
  etcd: 'etcd',
  Kubernetes: 'kubernetes',
  Kafka: 'apachekafka',
  Spark: 'apachespark',
  Flink: 'apacheflink',
  Airflow: 'apacheairflow',
  Elasticsearch: 'elasticsearch',
};

/**
 * Display name → short text rendered inside a bubble for techs that have
 * no good brand icon. The string is shown as-is in the same cyan tint as
 * an icon would be, sized to the bubble. Keep the label short (≤5 chars)
 * so it doesn't crowd the bubble.
 */
const TEXT_BUBBLES: Record<string, string> = {
  gRPC: 'gRPC',
};

/**
 * Display name → path under `/public/icons/` to a single-colour SVG that
 * lives in this repo (used for techs that have no simple-icons mark but
 * still deserve a glyph rather than a text label). The SVG must use
 * `currentColor` for its strokes/fills so the CSS tint applies.
 */
const LOCAL_ICONS: Record<string, string> = {
  ZooKeeper: '/icons/zookeeper.svg',
};

/** Tint colour applied to every icon — keeps everything on-palette. */
const ICON_COLOUR = 'bae6fd'; // var(--primary-bright) hex without #

const iconUrl = (slug: string) =>
  `https://cdn.simpleicons.org/${slug}/${ICON_COLOUR}`;

/**
 * Decorative orbit of round bubbles drifting around the zone header.
 *
 * Each bubble is a small particle with:
 *   - a Lissajous "rest target" it gently steers toward (slow drift)
 *   - velocity damping (so motion is calm)
 *   - soft mutual repulsion against every other bubble (no overlap, no
 *     hard contact — just a falloff force that keeps a visible gap)
 *   - mouse repulsion (run away from the cursor when it gets close)
 *
 * A single `requestAnimationFrame` loop updates everything per frame; it
 * is paused via `IntersectionObserver` whenever the section scrolls
 * off-screen so the page never burns cycles on what nobody can see.
 *
 * Z-depth is faked with `z = sin(t)` — when z>0 the bubble is treated as
 * in-front of the text (high z-index, slightly larger and brighter); when
 * z<0 it sits behind (low z-index, slightly blurred and dimmer).
 */
export function ZoneOrbit({ items, seed }: ZoneOrbitProps) {
  const wrapRef = useRef<HTMLDivElement>(null);

  // Resolve each requested item to either an icon-bubble or a text-bubble.
  // Anything that has neither mapping is dropped so the orbit never shows
  // a blank placeholder.
  type RenderItem =
    | { kind: 'icon'; name: string; slug: string }
    | { kind: 'local'; name: string; src: string }
    | { kind: 'text'; name: string; label: string };
  const visible: RenderItem[] = items
    .map((name): RenderItem | null => {
      const slug = ICON_SLUGS[name];
      if (slug) return { kind: 'icon', name, slug };
      const local = LOCAL_ICONS[name];
      if (local) return { kind: 'local', name, src: local };
      const label = TEXT_BUBBLES[name];
      if (label) return { kind: 'text', name, label };
      return null;
    })
    .filter((b): b is RenderItem => b !== null);

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    const bubbles = Array.from(
      wrap.querySelectorAll<HTMLElement>('.zone-orbit__bubble'),
    );
    if (bubbles.length === 0) return;

    // Per-bubble parameters, generated deterministically from `seed + i`.
    // The Lissajous path defines each bubble's "rest target" — a point it
    // gently steers toward each frame. Speeds & frequencies are
    // deliberately low so the motion reads as weightless drift.
    const params = bubbles.map((_, i) => {
      const r = mulberry32(seed * 31 + i * 17 + 1);
      return {
        a: 1.1 + r() * 0.8,           // x-frequency multiplier
        b: 0.8 + r() * 0.9,           // y-frequency multiplier
        rx: 520 + r() * 320,          // x amplitude (px) — wide roaming
        ry: 240 + r() * 160,          // y amplitude (px)
        phase: r() * Math.PI * 2,
        speed: 0.06 + r() * 0.07,     // base radians per second (slow)
        zPhase: r() * Math.PI * 2,
        zSpeed: 0.22 + r() * 0.22,
      };
    });

    // Live state per bubble: actual rendered position + velocity. Starts
    // sitting on the parametric path so the first frame has zero impulse.
    const state = bubbles.map((_, i) => {
      const p = params[i];
      const sx = p.rx * Math.sin(p.phase);
      const sy = p.ry * Math.sin(p.phase * 1.3);
      return { x: sx, y: sy, vx: 0, vy: 0 };
    });

    // Soft mutual repulsion: every pair of bubbles feels a falloff push
    // whenever they get within `pairRadius` of each other. There is no
    // hard contact constraint — the field is calibrated to keep a small
    // visible gap between walls under normal motion. The peak render
    // scale below mirrors the `0.85 + (z + 1) * 0.14` line in the
    // integration loop (max ≈ 1.13).
    const probe = bubbles[0].getBoundingClientRect();
    const bubbleSize = Math.max(probe.width, probe.height) || 110;
    const MAX_SCALE = 1.13;
    /** Distance below which pairwise repulsion starts to act. Tuned a
     *  little above peak rendered diameter so the push begins before the
     *  walls actually touch. */
    const PAIR_RADIUS = bubbleSize * MAX_SCALE * 1.4;
    /** Strength of the pairwise outward push at zero distance. */
    const PAIR_STRENGTH = 2400; // px/s²

    // --- Mouse tracking ------------------------------------------------
    /** Cursor position relative to the orbit's centre, or null when the
     *  cursor is outside the listening region (no mouse repulsion then). */
    let mouse: { x: number; y: number } | null = null;
    /** Distance at which mouse repulsion starts to act. Tuned so bubbles
     *  begin a gentle drift away from the cursor well before contact. */
    const MOUSE_RADIUS = bubbleSize * 1.9;
    /** Strength of the cursor's outward push — deliberately soft so the
     *  bubble glides aside instead of bolting away. */
    const MOUSE_STRENGTH = 1100; // px/s² at zero distance

    const updateMouse = (clientX: number, clientY: number) => {
      const rect = wrap.getBoundingClientRect();
      // Origin of the orbit field is (left + 50%, top + 38%) — see the CSS
      // for `.zone-orbit__bubble`. We compute mouse relative to that origin
      // so it lines up with each bubble's local coordinate space.
      const ox = rect.left + rect.width * 0.5;
      const oy = rect.top + rect.height * 0.38;
      mouse = { x: clientX - ox, y: clientY - oy };
    };
    const onMove = (e: MouseEvent) => updateMouse(e.clientX, e.clientY);
    const onLeave = () => {
      mouse = null;
    };
    window.addEventListener('mousemove', onMove, { passive: true });
    window.addEventListener('mouseout', onLeave);

    let running = true;
    let raf = 0;
    let prev = 0;
    /** Active time the loop has been running, in seconds. We can't use
     *  `now / 1000` for the parametric targets because the loop is
     *  paused/resumed by the IntersectionObserver — the wall clock would
     *  jump forward during a pause and the targets would teleport on
     *  resume, causing a violent visible twitch when the section scrolls
     *  back into view. Accumulating `dt` here keeps the targets continuous. */
    let t = 0;

    const loop = (now: number) => {
      if (!running) return;
      if (prev === 0) prev = now;
      const dt = Math.min(0.05, (now - prev) / 1000); // clamp big gaps
      prev = now;
      t += dt;

      // 1. Steer each bubble toward its parametric target.
      const targets: { tx: number; ty: number; z: number }[] = [];
      for (let i = 0; i < bubbles.length; i++) {
        const p = params[i];
        const a = t * p.speed;
        targets.push({
          tx: p.rx * Math.sin(p.a * a + p.phase),
          ty: p.ry * Math.sin(p.b * a + p.phase * 1.3),
          z: Math.sin(a * p.zSpeed + p.zPhase),
        });
      }

      // 2. Mouse repulsion — only active when the cursor is on the page
      //    and within `MOUSE_RADIUS` of a bubble. Force falls off
      //    quadratically so distant bubbles barely react.
      if (mouse) {
        for (let i = 0; i < state.length; i++) {
          const s = state[i];
          const dx = s.x - mouse.x;
          const dy = s.y - mouse.y;
          const distSq = dx * dx + dy * dy + 0.01;
          const dist = Math.sqrt(distSq);
          if (dist < MOUSE_RADIUS) {
            // Linear (not quadratic) falloff so the response is gentle
            // even right next to the cursor — no sudden whip away.
            const k = 1 - dist / MOUSE_RADIUS; // 0..1, stronger when closer
            const force = MOUSE_STRENGTH * k;
            const nx = dx / dist;
            const ny = dy / dist;
            s.vx += nx * force * dt;
            s.vy += ny * force * dt;
          }
        }
      }

      // 3. Pull each bubble toward its target (spring-style steering).
      const k = 1.2;       // spring constant
      const damp = 0.92;   // velocity damping per frame at 60fps
      for (let i = 0; i < state.length; i++) {
        const s = state[i];
        const tgt = targets[i];
        s.vx += (tgt.tx - s.x) * k * dt;
        s.vy += (tgt.ty - s.y) * k * dt;
        s.vx *= damp;
        s.vy *= damp;
        s.x += s.vx * dt * 60; // dt is normalised; *60 gives sane px/sec scale
        s.y += s.vy * dt * 60;
      }

      // 4. SOFT MUTUAL REPULSION — every pair within `PAIR_RADIUS` exerts
      //    an outward force on each other that falls off quadratically
      //    with distance. No hard constraint, no positional correction:
      //    bubbles slide around each other smoothly and the field is
      //    tuned to keep a small visible gap under normal motion.
      for (let i = 0; i < state.length; i++) {
        for (let j = i + 1; j < state.length; j++) {
          const dx = state[j].x - state[i].x;
          const dy = state[j].y - state[i].y;
          const distSq = dx * dx + dy * dy + 0.01;
          const dist = Math.sqrt(distSq);
          if (dist < PAIR_RADIUS) {
            const k2 = 1 - dist / PAIR_RADIUS;
            const force = PAIR_STRENGTH * k2 * k2;
            const nx = dx / dist;
            const ny = dy / dist;
            state[i].vx -= nx * force * dt;
            state[i].vy -= ny * force * dt;
            state[j].vx += nx * force * dt;
            state[j].vy += ny * force * dt;
          }
        }
      }

      // 5. Commit to DOM.
      for (let i = 0; i < bubbles.length; i++) {
        const el = bubbles[i];
        const s = state[i];
        const z = targets[i].z;
        const scale = 0.85 + (z + 1) * 0.14;          // 0.85..1.13
        el.style.transform =
          `translate(-50%, -50%) translate3d(${s.x.toFixed(2)}px, ${s.y.toFixed(2)}px, 0) scale(${scale.toFixed(3)})`;
        el.style.opacity = (0.6 + (z + 1) * 0.20).toFixed(3);
        const front = z > 0;
        if (el.dataset.front !== (front ? 'true' : 'false')) {
          el.dataset.front = front ? 'true' : 'false';
        }
      }
      raf = requestAnimationFrame(loop);
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !running) {
          running = true;
          prev = 0;
          raf = requestAnimationFrame(loop);
        } else if (!entry.isIntersecting && running) {
          running = false;
          cancelAnimationFrame(raf);
        }
      },
      { rootMargin: '120px' },
    );
    io.observe(wrap);

    raf = requestAnimationFrame(loop);
    return () => {
      running = false;
      cancelAnimationFrame(raf);
      io.disconnect();
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseout', onLeave);
    };
  }, [seed, visible.length]);

  if (visible.length === 0) return null;

  return (
    <div className="zone-orbit" ref={wrapRef} aria-hidden>
      {visible.map((b, i) => (
        <span
          key={`${b.name}-${i}`}
          className="zone-orbit__bubble"
          data-front="false"
          title={b.name}
        >
          {b.kind === 'icon' ? (
            <img
              className="zone-orbit__icon"
              src={iconUrl(b.slug)}
              alt=""
              loading="lazy"
              /* The bubbles are decorative \u2014 don't compete with hero
                 video / fonts / app JS for bandwidth on first paint. */
              decoding="async"
              fetchPriority="low"
              /* Reserve aspect ratio so the late-arriving SVG doesn't
                 cause a layout shift inside the bubble. */
              width="40"
              height="40"
              // If the slug 404s (icon not in the registry), remove the
              // whole bubble so the orbit never shows an empty placeholder.
              onError={(e) => {
                const bubble = (e.currentTarget as HTMLElement).closest(
                  '.zone-orbit__bubble',
                );
                bubble?.remove();
              }}
            />
          ) : b.kind === 'local' ? (
            <span
              className="zone-orbit__icon zone-orbit__icon--local"
              style={{
                WebkitMaskImage: `url(${b.src})`,
                maskImage: `url(${b.src})`,
              }}
            />
          ) : (
            <span className="zone-orbit__label">{b.label}</span>
          )}
        </span>
      ))}
    </div>
  );
}

/** Compact deterministic PRNG. */
function mulberry32(a: number) {
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Stable numeric hash of a string — used to seed each zone's orbit. */
export function hashSeed(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}