/**
 * Augments Vitest's `expect` interface with the matchers loaded from
 * `vitest-axe` in `tests/setup.ts`. Without this, every `expect(...).toHaveNoViolations()`
 * call would type-error even though the matcher is registered at runtime.
 */
import 'vitest';
import type { AxeMatchers } from 'vitest-axe/matchers';

declare module 'vitest' {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  interface Assertion<T = unknown> extends AxeMatchers {}
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  interface AsymmetricMatchersContaining extends AxeMatchers {}
}

export {};
