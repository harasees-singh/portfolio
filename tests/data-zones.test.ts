/**
 * `src/data/zones.ts` is the single source of truth for the descent. The
 * landing page, the depth rail, and the topnav telemetry interpolation
 * all assume a stable shape and a fixed set of slugs. These tests guard
 * against silent edits that would break the descent at runtime.
 */
import { describe, expect, it } from 'vitest';
import { zones, zonesBySlug } from '../src/data/zones';

const REQUIRED_SLUGS = ['sunlit', 'twilight', 'midnight', 'abyssal', 'hadal'] as const;

describe('zones data', () => {
  it('contains exactly the five descent slugs the rest of the app relies on', () => {
    expect(zones.map((z) => z.slug).sort()).toEqual([...REQUIRED_SLUGS].sort());
  });

  it('every zone has the fields the renderer reads', () => {
    for (const z of zones) {
      expect(z.id, `${z.slug}.id`).toMatch(/^[a-z0-9-]+$/);
      expect(z.label, `${z.slug}.label`).toBeTruthy();
      expect(z.title, `${z.slug}.title`).toBeTruthy();
      expect(z.teaser, `${z.slug}.teaser`).toBeTruthy();
      expect(z.subtitle, `${z.slug}.subtitle`).toBeTruthy();
      expect(z.depth, `${z.slug}.depth`).toMatch(/m$|km$/i);
      expect(z.temp, `${z.slug}.temp`).toBeTruthy();
      expect(z.cta, `${z.slug}.cta`).toBeTruthy();
      expect(Array.isArray(z.chapters), `${z.slug}.chapters`).toBe(true);
    }
  });

  it('every chapter has a 2-digit number, problem, narrative, and tags', () => {
    for (const zone of zones) {
      for (const ch of zone.chapters) {
        expect(ch.number, `${zone.slug} chapter number`).toMatch(/^\d{2}$/);
        expect(ch.problem, `${zone.slug}/${ch.number} problem`).toBeTruthy();
        expect(ch.narrative, `${zone.slug}/${ch.number} narrative`).toBeTruthy();
        expect(Array.isArray(ch.tags), `${zone.slug}/${ch.number} tags`).toBe(true);
      }
    }
  });

  it('zonesBySlug indexes every zone by its slug', () => {
    for (const z of zones) {
      expect(zonesBySlug[z.slug], `missing index for ${z.slug}`).toBe(z);
    }
  });

  it('orbit labels stay short enough to fit inside a bubble (<= 16 chars)', () => {
    for (const zone of zones) {
      if (!zone.orbit) continue;
      for (const item of zone.orbit) {
        expect(
          item.length,
          `${zone.slug}.orbit "${item}" too long — will overflow the bubble`,
        ).toBeLessThanOrEqual(16);
      }
    }
  });
});
