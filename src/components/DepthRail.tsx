import { useScroll, useMotionValueEvent } from 'framer-motion';
import { useState } from 'react';

const zones = [
  { id: 'surface', icon: 'light_mode', label: 'Surface', range: [0, 0.06] },
  { id: 'sunlit-hero', icon: 'wb_sunny', label: 'Sunlit', range: [0.06, 0.22] },
  { id: 'twilight', icon: 'water_drop', label: 'Twilight', range: [0.22, 0.46] },
  { id: 'exploration', icon: 'waves', label: 'Abyssal', range: [0.46, 0.7] },
  { id: 'logs', icon: 'visibility_off', label: 'Hadal', range: [0.7, 0.92] },
  { id: 'contact', icon: 'terminal', label: 'Terminal', range: [0.92, 1.01] },
] as const;

export function DepthRail() {
  const { scrollYProgress } = useScroll();
  const [activeIdx, setActiveIdx] = useState(0);

  useMotionValueEvent(scrollYProgress, 'change', (p) => {
    const idx = zones.findIndex((z) => p >= z.range[0] && p < z.range[1]);
    if (idx !== -1 && idx !== activeIdx) setActiveIdx(idx);
  });

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
