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
})
