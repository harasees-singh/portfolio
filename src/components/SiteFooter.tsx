/**
 * Minimal site footer — a single thin telemetry strip beneath the descent.
 *
 * `__APP_VERSION__` is a compile-time constant defined by Vite (see
 * `vite.config.ts`). It is sourced from `package.json` and auto-bumped on
 * every push to `main` by `.github/workflows/version-bump.yml`, so the
 * displayed build always matches what is actually deployed.
 */
const buildStack = ['React', 'TypeScript', 'Three.js', 'Framer', 'Vite'];
const version = `v${__APP_VERSION__}`;

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="foot" id="terminal">
      {/* Soft gradient blend so the deep ocean above dissolves into the
          footer with no visible seam. */}
      <div className="foot__blend" aria-hidden />

      <div className="foot__shell">
        {/* --- Telemetry strip --------------------------------------- */}
        <div className="foot__telemetry" role="contentinfo">
          <div className="foot__telemetry-group">
            <span className="foot__telemetry-key">Build</span>
            <span className="foot__telemetry-val">{version}</span>
          </div>
          <span className="foot__telemetry-sep" aria-hidden>·</span>
          <div className="foot__telemetry-group">
            <span className="foot__telemetry-key">Stack</span>
            <span className="foot__telemetry-val foot__telemetry-stack">
              {buildStack.join(' · ')}
            </span>
          </div>
          <span className="foot__telemetry-sep" aria-hidden>·</span>
          <div className="foot__telemetry-group">
            <span className="foot__telemetry-key">Pressure</span>
            <span className="foot__telemetry-val">1100 atm</span>
          </div>
          <span className="foot__telemetry-spacer" aria-hidden />
          <div className="foot__telemetry-group foot__telemetry-group--copyright">
            <span className="foot__telemetry-val">© {year} Harasees Singh</span>
          </div>
        </div>
      </div>
    </footer>
  );
}