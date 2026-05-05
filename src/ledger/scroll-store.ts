import { useSyncExternalStore } from 'react';

/**
 * A tiny module-level store that mirrors ScrollControls progress to
 * components rendered OUTSIDE the Canvas tree (e.g. the fixed Nav).
 *
 * `<Scroll html>` wraps its children in a transformed div, which breaks
 * `position: fixed`. We work around this by rendering DOM chrome outside
 * the Canvas and publishing the scroll's current section + a scrollTo
 * helper through this store.
 */

export type Section = 'shore' | 'deep' | 'hoard';

type Snapshot = {
  section: Section;
  isDeep: boolean;
};

let snapshot: Snapshot = { section: 'shore', isDeep: false };
const subs = new Set<() => void>();
let scrollEl: HTMLElement | null = null;

export const scrollStore = {
  publish(next: Snapshot) {
    if (next.section === snapshot.section && next.isDeep === snapshot.isDeep) return;
    snapshot = next;
    subs.forEach((s) => s());
  },
  setEl(el: HTMLElement | null) {
    scrollEl = el;
  },
  scrollTo(section: Section) {
    if (!scrollEl) return;
    // Aligned with 5-page layout: shore 0..0.3, deep 0.3..0.65, hoard 0.65..1.
    const target = section === 'shore' ? 0 : section === 'deep' ? 0.34 : 0.78;
    scrollEl.scrollTo({
      top: target * (scrollEl.scrollHeight - scrollEl.clientHeight),
      behavior: 'smooth',
    });
  },
  subscribe(cb: () => void) {
    subs.add(cb);
    return () => {
      subs.delete(cb);
    };
  },
  get(): Snapshot {
    return snapshot;
  },
};

export function useNavState(): Snapshot {
  return useSyncExternalStore(scrollStore.subscribe, scrollStore.get, scrollStore.get);
}
