/**
 * Bottom thumb-zone bar shown only on phones (≤720px wide).
 *
 * On a small touch device the topnav's icon row is harder to reach with
 * one hand than the bottom edge of the screen. This bar floats at the
 * bottom-safe area and exposes the primary outbound channels — email
 * + the three external profiles + a quick "Contact" jump — as 48×48
 * tap targets within easy reach of the thumb. It is hidden entirely on
 * tablet/desktop where the top row already handles all of this.
 *
 * Visibility is purely CSS — `display: none` above 720px — so the bar
 * is always rendered in the React tree and there's no resize-mount
 * jank.
 */
const links = [
  {
    label: 'Email',
    href: 'mailto:harasees1202@gmail.com',
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden focusable="false">
        <path
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M3 6.5h18v11H3zM3 7l9 6.5L21 7"
        />
      </svg>
    ),
  },
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
      <svg viewBox="0 0 24 24" aria-hidden focusable="false">
        <rect x="2"  y="11" width="5" height="11" rx="1" fill="currentColor" />
        <rect x="9.5" y="6"  width="5" height="16" rx="1" fill="currentColor" />
        <rect x="17" y="2"  width="5" height="20" rx="1" fill="currentColor" opacity="0.85" />
      </svg>
    ),
  },
];

export function MobileTabBar() {
  return (
    <nav className="mobile-bar" aria-label="Quick contact">
      {links.map((link) => (
        <a
          key={link.label}
          className="mobile-bar__item"
          href={link.href}
          target={link.href.startsWith('http') ? '_blank' : undefined}
          rel={link.href.startsWith('http') ? 'noopener noreferrer' : undefined}
          aria-label={link.label}
          title={link.label}
        >
          <span className="mobile-bar__icon" aria-hidden>{link.icon}</span>
          <span className="mobile-bar__label">{link.label}</span>
        </a>
      ))}
      <a
        className="mobile-bar__item mobile-bar__item--cta"
        href="#contact"
        aria-label="Open Channel"
      >
        <span className="mobile-bar__icon" aria-hidden>
          <svg viewBox="0 0 24 24" aria-hidden focusable="false">
            <path
              fill="currentColor"
              d="M2.5 12 22 3l-9 19.5-2-9z"
            />
          </svg>
        </span>
        <span className="mobile-bar__label">Channel</span>
      </a>
    </nav>
  );
}
