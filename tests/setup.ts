/**
 * Global test setup — runs once before every test file.
 *
 * Responsibilities:
 *   - Wire up jest-dom matchers (`toBeInTheDocument`, etc.) on Vitest's
 *     `expect`.
 *   - Polyfill the handful of browser APIs that jsdom doesn't ship but
 *     that our components touch on render: `IntersectionObserver`,
 *     `ResizeObserver`, `matchMedia`, `requestAnimationFrame`.
 *   - Stub the heavy 3D background (`BackgroundStack`) so component tests
 *     never have to load Three.js or react-three-fiber. The shipped
 *     module is dynamically imported, so a Vitest module mock is the
 *     cleanest way to keep the test surface tiny.
 *   - Reset the DOM between tests so RTL queries don't bleed across.
 */
import '@testing-library/jest-dom/vitest';
import { afterEach, expect, vi } from 'vitest';
import { cleanup } from '@testing-library/react';
import * as axeMatchers from 'vitest-axe/matchers';

expect.extend(axeMatchers);

afterEach(() => {
  cleanup();
});

// --- IntersectionObserver --------------------------------------------------
// framer-motion's `whileInView` registers an IO on every motion element.
// jsdom doesn't ship one, so we wire up a no-op stub that immediately
// reports the element as fully in view — that way `show` variants run on
// mount and the rendered output matches what the user actually sees.
class MockIntersectionObserver implements IntersectionObserver {
  readonly root: Element | Document | null = null;
  readonly rootMargin: string = '';
  /* `scrollMargin` was added to the IntersectionObserver lib in newer
     TS DOM definitions; jsdom doesn't actually use it but the type
     interface requires the field. */
  readonly scrollMargin: string = '';
  readonly thresholds: ReadonlyArray<number> = [];
  private readonly callback: IntersectionObserverCallback;

  constructor(callback: IntersectionObserverCallback) {
    this.callback = callback;
  }

  observe(target: Element): void {
    const entry = {
      isIntersecting: true,
      intersectionRatio: 1,
      target,
      time: 0,
      boundingClientRect: target.getBoundingClientRect(),
      intersectionRect: target.getBoundingClientRect(),
      rootBounds: null,
    } as unknown as IntersectionObserverEntry;
    this.callback([entry], this);
  }

  unobserve(): void {}
  disconnect(): void {}
  takeRecords(): IntersectionObserverEntry[] {
    return [];
  }
}

vi.stubGlobal('IntersectionObserver', MockIntersectionObserver);

// --- ResizeObserver --------------------------------------------------------
class MockResizeObserver {
  observe(): void {}
  unobserve(): void {}
  disconnect(): void {}
}
vi.stubGlobal('ResizeObserver', MockResizeObserver);

// --- matchMedia ------------------------------------------------------------
// `prefers-reduced-motion` and `(max-width: …)` queries are read by both
// framer-motion and a few of our own utilities. Default to "no match" so
// animations run as on a desktop browser; individual tests override this
// when they need to assert mobile behaviour.
if (!window.matchMedia) {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation((query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });
}

// --- requestAnimationFrame -------------------------------------------------
// jsdom ships `requestAnimationFrame`, but the rAF-throttle in TopNav and
// DepthRail expects it to actually fire. Using the default `setTimeout(0)`
// shim keeps them quiet without having to fake-time every test.
if (!window.requestAnimationFrame) {
  window.requestAnimationFrame = (cb: FrameRequestCallback): number =>
    setTimeout(() => cb(performance.now()), 16) as unknown as number;
  window.cancelAnimationFrame = (id: number): void => clearTimeout(id);
}

// --- BackgroundStack stub --------------------------------------------------
// The shipped component lazy-imports a Three.js scene that jsdom can't
// render. None of the tests need its visual output — we only assert that
// it surfaces an `onReady` signal so the loader can dismiss. Replace it
// with a tiny stub that fires `onReady` synchronously on mount.
vi.mock('../src/components/system/BackgroundStack', () => ({
  BackgroundStack: ({ onReady }: { onReady?: () => void }) => {
    if (onReady) onReady();
    return null;
  },
}));

// --- ZoneOrbit stub --------------------------------------------------------
// The orbit component fires off a per-frame physics loop, fetches icons
// from the simpleicons CDN, and uses canvas APIs jsdom doesn't ship. The
// landing page renders fine without it; the tests only need to know that
// the surrounding zone content is correct.
vi.mock('../src/components/zone/ZoneOrbit', () => ({
  ZoneOrbit: () => null,
  hashSeed: (s: string): number => {
    let h = 2166136261;
    for (let i = 0; i < s.length; i++) {
      h ^= s.charCodeAt(i);
      h = Math.imul(h, 16777619);
    }
    return h >>> 0;
  },
}));

// --- scrollTo / scrollIntoView --------------------------------------------
// Both are called by DepthRail / ScrollHint click handlers. jsdom logs a
// "Not implemented" warning otherwise.
window.scrollTo = vi.fn() as unknown as typeof window.scrollTo;
Element.prototype.scrollIntoView = vi.fn();
