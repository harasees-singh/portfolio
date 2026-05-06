import { useEffect, useState } from 'react';

/**
 * Depth anchors in metres. Each value matches the `CURRENT_DEPTH:` shown on
 * the corresponding zone card in `src/data/zones.ts` so the topnav readout
 * and the card never disagree. `contact` extrapolates past Hadal so the
 * linear ramp has somewhere to land at the bottom of the page.
 */
const depthAnchors = [
  { id: 'surface',     depth: 0     },
  { id: 'sunlit-hero', depth: 30    },
  { id: 'twilight',    depth: 200   },
  { id: 'midnight',    depth: 1500  },
  { id: 'exploration', depth: 2250  },
  { id: 'logs',        depth: 6800  },
  { id: 'contact',     depth: 11000 },
] as const;

/** 5-digit zero-padded metres so the pill width never changes. */
function formatDepth(metres: number): string {
  const safe = Math.max(0, Math.min(99999, Math.round(metres)));
  return safe.toString().padStart(5, '0');
}

const socials = [
  {
    label: 'GitHub',
    href: 'https://github.com/harasees-singh/portfolio',
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden focusable="false">
        <path
          fill="currentColor"
          d="M12 .5C5.73.5.75 5.48.75 11.75c0 4.96 3.22 9.16 7.69 10.65.56.1.77-.24.77-.54v-1.9c-3.13.68-3.79-1.51-3.79-1.51-.51-1.3-1.25-1.65-1.25-1.65-1.02-.7.08-.69.08-.69 1.13.08 1.72 1.16 1.72 1.16 1 1.72 2.63 1.22 3.27.94.1-.73.39-1.22.71-1.5-2.5-.28-5.13-1.25-5.13-5.57 0-1.23.44-2.24 1.16-3.03-.12-.29-.5-1.43.11-2.97 0 0 .94-.3 3.09 1.16.9-.25 1.86-.38 2.82-.38s1.92.13 2.82.38c2.15-1.46 3.09-1.16 3.09-1.16.61 1.54.23 2.68.11 2.97.72.79 1.16 1.8 1.16 3.03 0 4.34-2.64 5.29-5.15 5.56.4.34.76 1.02.76 2.06v3.05c0 .3.21.65.78.54 4.46-1.49 7.68-5.69 7.68-10.65C23.25 5.48 18.27.5 12 .5z"
        />
      </svg>
    ),
  },
  {
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/in/harasees-singh713/',
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden focusable="false">
        <path
          fill="currentColor"
          d="M20.45 20.45h-3.55v-5.57c0-1.33-.03-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.95v5.66H9.36V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.38-1.85 3.61 0 4.28 2.38 4.28 5.47v6.27zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.12 20.45H3.56V9h3.56v11.45zM22.23 0H1.77C.79 0 0 .77 0 1.72v20.56C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.72V1.72C24 .77 23.21 0 22.23 0z"
        />
      </svg>
    ),
  },
  {
    label: 'Codeforces',
    href: 'https://codeforces.com/profile/harasees_singh',
    icon: (
      // Codeforces "three bars" mark — three rising columns approximating
      // their identity without bundling the brand wordmark.
      <svg viewBox="0 0 24 24" aria-hidden focusable="false">
        <rect x="2"  y="11" width="5" height="11" rx="1" fill="currentColor" />
        <rect x="9.5" y="6"  width="5" height="16" rx="1" fill="currentColor" />
        <rect x="17" y="2"  width="5" height="20" rx="1" fill="currentColor" opacity="0.85" />
      </svg>
    ),
  },
];

export function TopNav({ currentDepth }: { currentDepth?: number } = {}) {
  const [depth, setDepth] = useState(currentDepth ?? 0);

  // Continuously interpolate the displayed depth between consecutive zone
  // anchors based on raw scroll position. Each zone's labelled depth is held
  // across the first half of that section so the topnav matches the
  // `CURRENT_DEPTH:` value the user is currently reading on the card. Once
  // they scroll past the midpoint, the depth ticks up *linearly* and lands
  // on the next zone's exact value the moment its trigger line is crossed.
  //
  // When `currentDepth` is provided (deep-dive routes), the interpolator is
  // skipped — the topnav simply reflects the active zone's depth instead.
  useEffect(() => {
    if (currentDepth != null) {
      setDepth(currentDepth);
      return;
    }
    type Anchor = { y: number; depth: number };
    /** Fraction of each section spent linearly transitioning to the next zone. */
    const TRANSITION_WINDOW = 0.5;

    const measure = () => {
      const anchored: Anchor[] = depthAnchors
        .map((a): Anchor | null => {
          const el = document.getElementById(a.id);
          if (!el) return null;
          // Use the same trigger line the DepthRail uses (40% of viewport)
          // so the topnav and side rail stay perceptually in sync.
          const top = el.getBoundingClientRect().top + window.scrollY - window.innerHeight * 0.4;
          return { y: Math.max(0, top), depth: a.depth };
        })
        .filter((a): a is Anchor => a !== null)
        .sort((a, b) => a.y - b.y);

      const update = () => {
        if (anchored.length === 0) return;
        const y = window.scrollY;
        if (y <= anchored[0].y) {
          setDepth(anchored[0].depth);
          return;
        }
        for (let i = 0; i < anchored.length - 1; i++) {
          const a = anchored[i];
          const b = anchored[i + 1];
          if (y >= a.y && y <= b.y) {
            const span = b.y - a.y;
            if (span <= 0) {
              setDepth(b.depth);
              return;
            }
            // Hold the current zone's depth while the user is reading the
            // card, then ramp linearly to the next zone's value so the two
            // stay synchronised at the trigger crossings.
            const holdEnd = a.y + span * (1 - TRANSITION_WINDOW);
            if (y <= holdEnd) {
              setDepth(a.depth);
            } else {
              const t = (y - holdEnd) / (b.y - holdEnd);
              setDepth(a.depth + (b.depth - a.depth) * t);
            }
            return;
          }
        }
        setDepth(anchored[anchored.length - 1].depth);
      };
      update();
      return update;
    };

    let update = measure();
    const onScroll = () => update();
    const onResize = () => {
      update = measure();
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
    };
  }, [currentDepth]);

  return (
    <nav className="topnav">
      <div className="topnav__left">
        <a className="topnav__brand" href="#surface" aria-label="Return to surface">
          {/* Refined HS monogram inside a thin luminous ring */}
          <span className="topnav__brand-mark" aria-hidden>
            <svg viewBox="0 0 32 32">
              <circle cx="16" cy="16" r="14" className="topnav__brand-ring" />
              <text
                x="16"
                y="16"
                className="topnav__brand-monogram"
                textAnchor="middle"
                dominantBaseline="central"
              >
                hs
              </text>
            </svg>
          </span>
          <span className="topnav__brand-name">Harasees Singh</span>
        </a>

        <ul className="topnav__socials" aria-label="External profiles">
          {socials.map((s) => (
            <li key={s.label}>
              <a
                className="topnav__social"
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={s.label}
                title={s.label}
              >
                {s.icon}
              </a>
            </li>
          ))}
        </ul>
      </div>

      <div className="topnav__right">
        <div
          className="topnav__telemetry"
          aria-live="polite"
          aria-label={`Current depth: ${Math.round(depth)} metres`}
        >
          <span className="topnav__telemetry-dot" aria-hidden />
          <span className="topnav__telemetry-label">Depth</span>
          <span className="topnav__telemetry-value">{formatDepth(depth)}</span>
          <span className="topnav__telemetry-unit">M</span>
        </div>

        <a href="#contact" className="topnav__cta">
          <span className="topnav__cta-dot" aria-hidden />
          <span>Open Channel</span>
        </a>
      </div>
    </nav>
  );
}

