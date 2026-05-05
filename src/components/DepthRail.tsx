import { useEffect, useState } from 'react';

const zones = [
  { id: 'surface', icon: 'light_mode', label: 'Surface' },
  { id: 'sunlit-hero', icon: 'wb_sunny', label: 'Sunlit' },
  { id: 'twilight', icon: 'water_drop', label: 'Twilight' },
  { id: 'exploration', icon: 'waves', label: 'Abyssal' },
  { id: 'logs', icon: 'visibility_off', label: 'Hadal' },
  { id: 'contact', icon: 'terminal', label: 'Terminal' },
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
    handler();
    window.addEventListener('scroll', handler, { passive: true });
    window.addEventListener('resize', handler);
    return () => {
      window.removeEventListener('scroll', handler);
      window.removeEventListener('resize', handler);
    };
  }, []);

  const handleClick = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
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
