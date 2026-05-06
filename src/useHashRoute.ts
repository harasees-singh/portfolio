import { useEffect, useState } from 'react';

/**
 * Tiny hash-based router. Reads the slug from `window.location.hash`
 * (`#/sunlit` -> `sunlit`) and exposes a setter that updates the URL +
 * scrolls to top. No third-party router needed for a handful of routes.
 */
export function useHashRoute(): [string, (slug: string) => void] {
  const [route, setRoute] = useState(() => readHash());

  useEffect(() => {
    const onHash = () => setRoute(readHash());
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  const navigate = (slug: string) => {
    if (slug === '') {
      // Clear the hash and reset URL so back/refresh land on the descent.
      history.pushState(null, '', window.location.pathname + window.location.search);
      setRoute('');
    } else {
      window.location.hash = `/${slug}`;
    }
    window.scrollTo({ top: 0, behavior: 'auto' });
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
