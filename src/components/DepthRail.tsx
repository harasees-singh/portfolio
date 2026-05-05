import { useScroll, useMotionValueEvent } from 'framer-motion';
import { useState } from 'react';

const zones = [
  { id: 'surface', icon: 'light_mode', label: 'Sunlit', range: [0, 0.18] },
  { id: 'twilight', icon: 'water_drop', label: 'Twilight', range: [0.18, 0.42] },
  { id: 'abyssal', icon: 'waves', label: 'Abyssal', range: [0.42, 0.7] },
  { id: 'hadal', icon: 'visibility_off', label: 'Hadal', range: [0.7, 0.92] },
  { id: 'terminal', icon: 'terminal', label: 'Terminal', range: [0.92, 1.01] },
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
