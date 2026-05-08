import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Read the current version from package.json so we can ship it to the client
// as a compile-time constant (`__APP_VERSION__`). The CI workflow at
// `.github/workflows/version-bump.yml` auto-bumps this number on every push
// to main, so the footer always reflects the deployed build.
const pkg = JSON.parse(
  readFileSync(fileURLToPath(new URL('./package.json', import.meta.url)), 'utf-8'),
) as { version: string }

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    __APP_VERSION__: JSON.stringify(pkg.version),
  },
  build: {
    /* Don't auto-emit `<link rel="modulepreload">` tags. Vite would
       otherwise preload the three.js chunk (~880kB) on page load,
       defeating the lazy import. We rely on the dynamic `import()` in
       BackgroundStack.tsx to fetch it in idle time. */
    modulePreload: false,
    /**
     * Split the heaviest libraries into their own chunks so the entry
     * bundle stays small and parseable on first paint. The Three.js +
     * react-three-fiber + drei stack is the biggest offender (~450kB);
     * isolating it means it streams in parallel instead of blocking the
     * initial JS that draws the loader, top nav, and surface entry.
     *
     * Chunk names are unhashed prefixes; Rollup will append a hash for
     * cache-busting.
     */
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (id.includes('node_modules')) {
            if (id.includes('three') || id.includes('@react-three')) {
              return 'three';
            }
            if (id.includes('framer-motion')) {
              return 'motion';
            }
          }
          return undefined;
        },
      },
    },
    /* Bump the warning threshold past the three chunk so the build log
       isn't dominated by a known-large vendor bundle. */
    chunkSizeWarningLimit: 700,
  },
})
