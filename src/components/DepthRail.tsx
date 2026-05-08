import { useEffect, useState } from 'react';

/**
 * Zones follow real oceanic depth bands (Epipelagic → Hadal). Icons are
 * Material Symbols chosen to read literally for each layer of light & pressure.
 */
const zones = [
  { id: 'surface', icon: 'sailing', label: 'Surface' },
  { id: 'sunlit-hero', icon: 'wb_sunny', label: 'Sunlit' },
  { id: 'twilight', icon: 'account_tree', label: 'Twilight' },
  { id: 'midnight', icon: 'dark_mode', label: 'Midnight' },
  { id: 'exploration', icon: 'phishing', label: 'Abyssal' },
  { id: 'logs', icon: 'skull', label: 'Hadal' },
  { id: 'contact', icon: 'send', label: 'Terminal' },
] as const;

/**
 * Marks the zone whose section currently occupies the upper-half of the
 * viewport, so the rail tracks what the user is actually reading rather than
 * an absolute scroll percentage.
 */
export function DepthRail() {
  const [activeIdx, setActiveIdx] = useState(0);

  useEffect(() => {
    const handler = () => {
      const trigger = window.innerHeight * 0.4;
      let current = 0;
      for (let i = 0; i < zones.length; i++) {
        const el = document.getElementById(zones[i].id);
        if (!el) continue;
        const top = el.getBoundingClientRect().top;
        if (top - trigger <= 0) current = i;
      }
      setActiveIdx(current);
    };
    /**
     * rAF-throttle: coalesce every burst of scroll events into a single
     * frame's worth of work. Stops the per-zone `getBoundingClientRect()`
     * pass from running multiple times per displayed frame on
     * high-refresh trackpads / monitors.
     */
    let rafScheduled = 0;
    const onScroll = () => {
      if (rafScheduled) return;
      rafScheduled = window.requestAnimationFrame(() => {
        rafScheduled = 0;
        handler();
      });
    };
    handler();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (rafScheduled) window.cancelAnimationFrame(rafScheduled);
    };
  }, []);

  const handleClick = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const navOffset = 96; // fixed top nav clearance
    let targetY: number;
    if (rect.height <= window.innerHeight - navOffset) {
      // Section fits — centre it vertically in the viewport.
      targetY = window.scrollY + rect.top - (window.innerHeight - rect.height) / 2;
    } else {
      // Section is taller than the viewport — pin its top below the nav so
      // the eyebrow + heading are always visible after the jump.
      targetY = window.scrollY + rect.top - navOffset;
    }
    window.scrollTo({
      top: Math.max(0, targetY),
      behavior: 'smooth',
    });
  };

  return (
    <aside className="depth-rail" aria-label="Depth zones">
      {zones.map((z, i) => (
        <button
          key={z.id}
          type="button"
          className="depth-rail__zone"
          data-active={i === activeIdx}
          onClick={() => handleClick(z.id)}
          aria-label={`Jump to ${z.label} zone`}
        >
          <span className="icon depth-rail__icon">{z.icon}</span>
          <span className="depth-rail__label">{z.label}</span>
        </button>
      ))}
    </aside>
  );
}
