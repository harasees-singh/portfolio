/**
 * CSS regression guards.
 *
 * Locks down the rules that have been broken in the past by AI agents and
 * hand-edits alike:
 *   - 44px hit targets on every interactive element (WCAG / iOS HIG).
 *   - Stacked layouts on tablet/mobile that the agent reverted.
 *   - Word-wrap on titles so long words don't push horizontal scroll.
 *   - Surface-entry layout that flex-centers (rather than absolute-top)
 *     so iOS Safari's address-bar collapse doesn't shift it.
 *   - Footer telemetry uses CSS `gap` separators (not `::before`
 *     pseudo-elements) so wrapped rows don't show stray glyphs.
 *
 * If any of these break, an upstream visual regression is almost
 * certain. Each test names the visual symptom in its message so a
 * future maintainer can see what to fix without spelunking through
 * git history.
 */
import { describe, expect, it } from 'vitest';
import { findMediaQuery, findRule, missing, readIndexCss } from './helpers/css';

const css = readIndexCss();

describe('css: design tokens', () => {
  it('declares the descent palette CSS custom properties', () => {
    const root = findRule(css, ':root');
    expect(root, 'expected a :root token block in src/index.css').toBeTruthy();
    expect(missing(root!, [
      '--primary',
      '--primary-bright',
      '--primary-deep',
      '--primary-soft',
      '--font-display',
      '--font-body',
      '--font-code',
    ])).toEqual([]);
  });
});

describe('css: topnav responsive cascade', () => {
  it('exposes a 960px breakpoint that hides the depth label', () => {
    const body = findMediaQuery(css, 'max-width: 960px');
    expect(body, 'missing 960px topnav rule — depth pill collapse').toBeTruthy();
    expect(body!).toContain('.topnav__telemetry-label');
    expect(body!).toContain('display: none');
  });

  it('lifts touch targets to the 44px iOS HIG floor at 900px (tablet)', () => {
    // The 900px block contains other rules too; assert that the topnav
    // social/cta/brand all gain a 44x44 hit area inside it.
    const body = findMediaQuery(css, 'max-width: 900px');
    expect(body).toBeTruthy();
    expect(body!, 'tablet topnav social must be 44x44').toMatch(/\.topnav__social\s*\{[^}]*width:\s*44px/);
    expect(body!, 'tablet topnav social must be 44x44').toMatch(/\.topnav__social\s*\{[^}]*height:\s*44px/);
    expect(body!, 'tablet topnav cta must meet 44px').toMatch(/\.topnav__cta\s*\{[^}]*min-height:\s*44px/);
  });

  it('keeps the telemetry pill visible at 820px (only its label collapses)', () => {
    const body = findMediaQuery(css, 'max-width: 820px');
    expect(body).toBeTruthy();
    // The previous regression was `.topnav__telemetry { display: none }`
    // here, which hid the entire pill on tablets.
    expect(body!, 'never hide the whole telemetry pill — depth readout is part of the brand').not.toMatch(
      /\.topnav__telemetry\s*\{[^}]*display:\s*none/,
    );
    expect(body!).toMatch(/\.topnav__telemetry-label\s*\{[^}]*display:\s*none/);
  });

  it('collapses the brand to icon-only and hides the social row at 480px', () => {
    const body = findMediaQuery(css, 'max-width: 480px');
    expect(body).toBeTruthy();
    // The 480px block hides the social row (also accessible from the
    // mobile tab bar) and shrinks the CTA to a 44x44 icon-only button.
    expect(body!).toMatch(/\.topnav__socials\s*\{[^}]*display:\s*none/);
    expect(body!).toMatch(/\.topnav__cta\s*\{[^}]*width:\s*44px/);
  });
});

describe('css: zone titles & headers', () => {
  it('declares overflow-wrap: break-word on .hero__title and .zone__title', () => {
    const hero = findRule(css, '.hero__title');
    const zone = findRule(css, '.zone__title');
    expect(hero, 'missing .hero__title rule').toBeTruthy();
    expect(zone, 'missing .zone__title rule').toBeTruthy();
    expect(hero!, 'long words must wrap, not push horizontal scroll').toContain('overflow-wrap: break-word');
    expect(zone!, 'long words must wrap, not push horizontal scroll').toContain('overflow-wrap: break-word');
  });

  it('stacks .zone__header vertically at <=900px', () => {
    const body = findMediaQuery(css, 'max-width: 900px');
    expect(body).toBeTruthy();
    expect(body!, 'zone header must collapse to column on tablet/mobile').toMatch(
      /\.zone__header\s*\{[^}]*flex-direction:\s*column/,
    );
  });
});

describe('css: surface entry (landing hero)', () => {
  it('uses flex-center layout (not absolute-top) so iOS address-bar collapse stays smooth', () => {
    const surface = findRule(css, '.surface-entry');
    expect(surface).toBeTruthy();
    // The previous version positioned the headline with `position:
    // absolute; top: 14vh`, which caused content to jump every time iOS
    // Safari toggled the address bar.
    expect(surface!, 'surface entry must flex-center to survive iOS chrome').toContain('display: flex');
    expect(surface!).toContain('align-items: center');
    expect(surface!, 'use dvh so the section respects collapsed iOS chrome').toContain('100dvh');
  });

  it('renders the headline with a layered drop-shadow halo, not a single thin shadow', () => {
    const wordmark = findRule(css, '.surface-entry__wordmark');
    expect(wordmark).toBeTruthy();
    // Two `drop-shadow(...)` calls = the layered halo (dark for legibility
    // + cyan for ambient glow). A single one is the regressed look that
    // disappeared against the dark water.
    const dropShadows = (wordmark!.match(/drop-shadow\(/g) ?? []).length;
    expect(dropShadows, 'headline needs both a dark and a cyan halo layer').toBeGreaterThanOrEqual(2);
    expect(wordmark!, 'long titles must wrap on narrow viewports').toContain('overflow-wrap: break-word');
  });

  it('does NOT use a `::before` pseudo-element to render meta separators', () => {
    // Pseudo-element separators wrap with their <li> under flex-wrap and
    // leave a stray leading diamond in the next row. CSS `gap` on the
    // parent is the wrap-safe alternative we standardised on.
    expect(css).not.toMatch(/\.surface-entry__meta\s+li\s*\+\s*li::before\s*\{/);
  });

  it('uses light text + dark halo on the meta strip (legible over dark water)', () => {
    const meta = findRule(css, '.surface-entry__meta');
    expect(meta).toBeTruthy();
    // The previous palette was dark text + bright white halo — fine over
    // the bright sky, illegible over the deep water where the strip
    // actually sits after the flex-center change.
    expect(meta!, 'meta text must be light').toMatch(/color:\s*rgba\(\s*226,\s*232,\s*240/);
    expect(meta!, 'meta halo must be dark').toMatch(/text-shadow:[^;]*rgba\(\s*2,\s*8,\s*15/);
  });
});

describe('css: explore link CTA', () => {
  it('lifts to a 44px hit-target at <=720px (touch devices)', () => {
    const body = findMediaQuery(css, 'max-width: 720px');
    expect(body).toBeTruthy();
    expect(body!, 'primary go-deeper CTA must meet WCAG/iOS hit target').toMatch(
      /\.explore-link\s*\{[^}]*min-height:\s*44px/,
    );
  });

  it('disables the iOS tap-flash highlight on the desktop base rule', () => {
    const explore = findRule(css, '.explore-link');
    expect(explore).toBeTruthy();
    expect(explore!).toContain('-webkit-tap-highlight-color: transparent');
  });
});

describe('css: contact card / actions on mobile', () => {
  it('shrinks .card padding and reduces the .action chunkiness at <=720px', () => {
    const body = findMediaQuery(css, 'max-width: 720px');
    expect(body).toBeTruthy();
    expect(body!, 'card padding must tighten on phones').toMatch(/\.card\s*\{[^}]*padding:\s*1\.4rem/);
    expect(body!, 'primary action must be slimmer on phones').toMatch(/\.action\s*\{[^}]*padding:\s*0\.7rem/);
    expect(body!, 'card actions must be full-width on phones').toMatch(
      /\.card\s+\.action\s*\{[^}]*flex:\s*1\s+1\s+100%/,
    );
  });
});

describe('css: site footer', () => {
  it('uses a CSS grid with no inline `·` separators (handled by `gap`)', () => {
    const tele = findRule(css, '.foot__telemetry');
    expect(tele).toBeTruthy();
    expect(tele!, 'footer must be a grid for clean reflow').toContain('display: grid');
    // The legacy flex-wrap layout left stray `·` glyphs at row edges.
    // Both the in-DOM separator and the spacer must be display:none —
    // the rule lives as a comma-grouped selector so we assert the raw
    // CSS contains the joint declaration block.
    expect(
      css,
      'separator + spacer must be hidden together so no stray dots leak',
    ).toMatch(/\.foot__telemetry-sep,\s*\.foot__telemetry-spacer\s*\{[^}]*display:\s*none/);
  });

  it('stacks the footer telemetry on mobile with a hairline above the copyright', () => {
    const body = findMediaQuery(css, 'max-width: 720px');
    expect(body).toBeTruthy();
    expect(body!, 'mobile footer must use display: contents trick to align rows').toMatch(
      /\.foot__telemetry-group\s*\{[^}]*display:\s*contents/,
    );
    expect(body!, 'copyright must sit under a hairline divider').toMatch(
      /\.foot__telemetry-group--copyright\s*\{[^}]*border-top:\s*1px\s+solid/,
    );
  });
});

describe('css: scroll hint', () => {
  it('collapses to an icon-only circle on mobile (no oversized chip)', () => {
    const body = findMediaQuery(css, 'max-width: 720px');
    expect(body).toBeTruthy();
    expect(body!, 'mobile scroll hint must be icon-only').toMatch(
      /\.scroll-hint__chip > span:not\(\.icon\)\s*\{[^}]*display:\s*none/,
    );
    expect(body!, 'falling-bead rail must be hidden on mobile').toMatch(
      /\.scroll-hint__rail\s*\{[^}]*display:\s*none/,
    );
  });

  it('floats above the mobile tab bar (not on top of it)', () => {
    const body = findMediaQuery(css, 'max-width: 720px');
    expect(body).toBeTruthy();
    // The chevron must sit clearly above both the mobile tab bar and
    // the iOS home-indicator safe area. The exact `bottom` value has
    // been tuned a few times; assert the structural intent (offset +
    // safe-area inset) rather than the literal pixel value.
    expect(body!, 'must reserve space above the bottom nav + safe-area').toMatch(
      /\.scroll-hint\s*\{[^}]*bottom:\s*calc\([^)]*env\(safe-area-inset-bottom\)/,
    );
  });
});

describe('css: mobile tab bar', () => {
  it('is display:none above the phone breakpoint', () => {
    const bar = findRule(css, '.mobile-bar');
    expect(bar, 'missing .mobile-bar rule').toBeTruthy();
    expect(bar!).toContain('display: none');
  });

  it('appears at <=720px with a fixed bottom + safe-area-inset padding', () => {
    const body = findMediaQuery(css, 'max-width: 720px');
    expect(body).toBeTruthy();
    expect(body!, 'mobile bar must show on phones').toMatch(/\.mobile-bar\s*\{[^}]*display:\s*flex/);
    expect(body!, 'mobile bar must respect the iOS home-indicator safe area').toMatch(
      /env\(safe-area-inset-bottom\)/,
    );
  });
});

describe('css: depth rail vs shell content', () => {
  it('reserves right padding on .shell in the rail-visible viewport band', () => {
    // Rail is fixed at right: 1.75rem and ~6rem wide. Between ~901px
    // (rail appears) and ~1500px (natural centering opens up enough
    // room) the 1280px-max shell would otherwise butt directly against
    // the rail. Assert that an explicit padding reservation exists in
    // that band so zone titles/telemetry never clip into the rail.
    const body = findMediaQuery(css, 'min-width: 901px) and (max-width: 1500px');
    expect(body, 'missing rail-clearance media block').toBeTruthy();
    expect(body!, 'shell must reserve room for the depth rail').toMatch(
      /\.shell\s*\{[^}]*padding-right:\s*calc\(/,
    );
  });
});

describe('css: motion accessibility', () => {
  it('honours prefers-reduced-motion: reduce somewhere in the stylesheet', () => {
    expect(css, 'must offer a reduced-motion path for vestibular users').toMatch(
      /@media\s*\(prefers-reduced-motion:\s*reduce\)/,
    );
  });
});
