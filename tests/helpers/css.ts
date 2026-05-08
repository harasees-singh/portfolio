/**
 * Tiny CSS introspection helpers used by the regression guards.
 *
 * The guards intentionally avoid pulling in a full CSS parser — we only
 * need to assert that specific declarations live inside specific
 * selectors / @media blocks. A pair of pragmatic regex helpers is enough,
 * keeps the test suite lean, and is fast (the whole stylesheet is read
 * once and shared across tests).
 */
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

let cached: string | null = null;

/**
 * Read `src/index.css` once, cache for the rest of the suite. The file
 * is resolved from the workspace root via `process.cwd()` so the lookup
 * works whether the test is run via `npm test`, an IDE runner, or
 * directly from the `vitest` binary.
 */
export function readIndexCss(): string {
  if (cached !== null) return cached;
  const path = resolve(process.cwd(), 'src/index.css');
  cached = readFileSync(path, 'utf-8');
  return cached;
}

/**
 * Find the body of a top-level CSS rule by selector, e.g.
 * `findRule(css, '.surface-entry__wordmark')` returns the text between
 * the matching braces.
 *
 * Greedy/nested rules and at-rules are not tracked — pass an explicit
 * `within` slice (e.g. the body returned by `findMediaQuery`) to scope.
 */
export function findRule(css: string, selector: string): string | null {
  // Escape regex specials in the selector then match `selector{...}`,
  // anchored on a non-word char before the selector so `.foo` doesn't
  // match `.foo-bar`.
  const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const re = new RegExp(`(?:^|[^A-Za-z0-9_-])${escaped}\\s*\\{([\\s\\S]*?)\\}`, 'm');
  const match = re.exec(css);
  return match ? match[1] : null;
}

/**
 * Find every `@media (...)` block whose condition matches `condition`
 * (substring match — pass `'max-width: 720px'` to find every mobile
 * block) and return their bodies concatenated into one string.
 *
 * The stylesheet groups responsive rules near the components they
 * customise, so the same breakpoint appears many times. The regression
 * tests only care whether a given rule lives inside *any* matching
 * block, so concatenating them yields the simplest, most ergonomic
 * assertion target.
 *
 * Returns `null` when no block matches at all.
 */
export function findMediaQuery(css: string, condition: string): string | null {
  const escaped = condition.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const headerRe = new RegExp(`@media[^{]*${escaped}[^{]*\\{`, 'g');
  const bodies: string[] = [];
  for (const m of css.matchAll(headerRe)) {
    const openIdx = m.index! + m[0].length - 1;
    bodies.push(extractBraceBody(css, openIdx));
  }
  return bodies.length === 0 ? null : bodies.join('\n');
}

/**
 * Given the index of an opening `{`, return the text between it and the
 * matching `}`. Tracks nesting depth so `@media { .foo { ... } }`
 * returns the `.foo { ... }` block intact.
 */
function extractBraceBody(css: string, openIdx: number): string {
  let depth = 0;
  for (let i = openIdx; i < css.length; i++) {
    const ch = css[i];
    if (ch === '{') depth++;
    else if (ch === '}') {
      depth--;
      if (depth === 0) {
        return css.slice(openIdx + 1, i);
      }
    }
  }
  return '';
}

/**
 * Convenience: assert that every required substring appears in `body`.
 * Returns a list of the missing substrings (empty array == all present)
 * so the caller can produce an actionable failure message.
 */
export function missing(body: string, required: readonly string[]): string[] {
  return required.filter((r) => !body.includes(r));
}
