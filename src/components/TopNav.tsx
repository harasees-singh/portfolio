import { useEffect, useState } from 'react';

const links = [
  { label: 'SURFACE', href: '#surface' },
  { label: 'EXPLORATION', href: '#exploration' },
  { label: 'LOGS', href: '#logs' },
];

export function TopNav() {
  const [, setActive] = useState('SURFACE');

  useEffect(() => {
    const handler = () => {
      const ids = links.map((l) => l.href.slice(1));
      let current = ids[0];
      for (const id of ids) {
        const el = document.getElementById(id);
        if (!el) continue;
        const top = el.getBoundingClientRect().top;
        if (top - window.innerHeight * 0.35 <= 0) current = id;
      }
      const found = links.find((l) => l.href.slice(1) === current);
      if (found) setActive(found.label);
    };
    handler();
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  return (
    <nav className="topnav">
      <a className="topnav__brand" href="#surface">
        <span className="topnav__brand-mark" aria-hidden />
        Deep Sea Archive
      </a>
      <a href="#contact" className="topnav__cta">
        Contact Station
      </a>
    </nav>
  );
}
