/**
 * Vitest configuration.
 *
 * Kept in its own file (rather than merged into `vite.config.ts`) so the
 * production Vite build never has to load the test runner, jsdom, or any
 * test-only plugins. The two configs share nothing at runtime — the
 * `define` block here mirrors the one in `vite.config.ts` so compile-time
 * constants like `__APP_VERSION__` are available inside tests.
 */
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

const pkg = JSON.parse(
  readFileSync(fileURLToPath(new URL('./package.json', import.meta.url)), 'utf-8'),
) as { version: string };

export default defineConfig({
  plugins: [react()],
  define: {
    __APP_VERSION__: JSON.stringify(pkg.version),
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./tests/setup.ts'],
    css: false,
    // The test suite intentionally lives under `/tests` so the source
    // tree under `/src` stays focused on shipped code. Co-located unit
    // tests are still picked up via the `**/*.test.ts(x)` glob.
    include: ['tests/**/*.test.{ts,tsx}', 'src/**/*.test.{ts,tsx}'],
    // Three.js + react-three-fiber + the cdn icon URLs in ZoneOrbit pull
    // in a lot of unsupported jsdom code paths. None of those modules
    // need to run for the tests we care about, so they're stubbed in
    // setup.ts and skipped here.
    exclude: ['node_modules', 'dist'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov'],
      include: ['src/**/*.{ts,tsx}'],
      exclude: [
        'src/**/*.test.{ts,tsx}',
        'src/main.tsx',
        'src/three/**',
        'src/**/*.d.ts',
      ],
    },
  },
});
