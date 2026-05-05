export function SiteFooter() {
  return (
    <footer className="foot" id="terminal">
      <div className="foot__brand">
        <span className="foot__brand-name">DEEP_SEA_ARCHIVE</span>
        <span className="foot__brand-meta">©2026 SEABED_TERMINAL_v1.0.4</span>
      </div>
      <div className="foot__links">
        <a className="foot__link" href="#surface">Encrypted_Link</a>
        <a className="foot__link" href="#exploration">Core_Systems</a>
        <a className="foot__link" href="#contact">Signal_Out</a>
      </div>
      <div className="foot__status">
        <span className="foot__pulse" aria-hidden />
        <span className="foot__status-label">System_Online</span>
      </div>
    </footer>
  );
}
