import { useEffect, useState } from 'react';

/**
 * Scroll position to restore when the user returns from a deep-dive route
 * back to the landing page. Captured the moment they navigate INTO a
 * deep-dive so the descent picks up exactly where they left off rather than
 * snapping back to the top.
 */
let landingScrollY = 0;

/**
 * Tiny hash-based router. Reads the slug from `window.location.hash`
 * (`#/sunlit` -> `sunlit`) and exposes a setter that updates the URL +
 * scrolls to top. No third-party router needed for a handful of routes.
 */
export function useHashRoute(): [string, (slug: string) => void] {
  const [route, setRoute] = useState(() => readHash());

  useEffect(() => {
    const onHash = () => {
      const next = readHash();
      setRoute((prev) => {
        // Browser back/forward into the landing page — restore the saved
        // descent position on the next paint (after the new tree mounts).
        if (prev !== '' && next === '') {
          window.requestAnimationFrame(() => {
            window.scrollTo({ top: landingScrollY, behavior: 'auto' });
          });
        }
        return next;
      });
    };
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  const navigate = (slug: string) => {
    if (slug === '') {
      // Returning to the descent — restore the position we captured when
      // the user dove into the zone, after the landing tree remounts.
      history.pushState(null, '', window.location.pathname + window.location.search);
      setRoute('');
      window.requestAnimationFrame(() => {
        window.scrollTo({ top: landingScrollY, behavior: 'auto' });
      });
    } else {
      // Diving into a zone — remember where we were so the trip back can
      // land on the same card the user just clicked.
      landingScrollY = window.scrollY;
      window.location.hash = `/${slug}`;
      window.scrollTo({ top: 0, behavior: 'auto' });
    }
  };

  return [route, navigate];
}

function readHash(): string {
  const h = window.location.hash;
  if (!h || h === '#') return '';
  // Accept both '#/sunlit' (deep-dive routes) and '#sunlit-hero' (in-page anchors).
  if (h.startsWith('#/')) return h.slice(2);
  return '';
}
