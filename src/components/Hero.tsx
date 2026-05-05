/**
 * Top of page — full viewport "Surface" entry with just a wordmark, depth
 * marker, and a scroll hint. The user has to scroll past this to reach the
 * Sunlit zone (~30m) where the actual H1 title plate appears.
 */
export function SurfaceEntry() {
  return (
    <section id="surface" className="surface-entry">
      <div className="surface-entry__center">
        <span className="surface-entry__eyebrow">Deep_Sea_Archive · Mission 014</span>
        <h2 className="surface-entry__wordmark">A descent through the platform.</h2>
        <p className="surface-entry__sub">
          Field notes from beneath the surface — pulled from the same place the
          numbers, the noise, and the cold-water APIs live.
        </p>
      </div>

      <ScrollHint targetId="sunlit-hero" />
    </section>
  );
}

/**
 * Persistent "scroll" cue used at the top of the page. Different visual
 * language than the inline section ScrollPrompt — this one floats and breathes.
 */
export function ScrollHint({ targetId }: { targetId: string }) {
  const onClick = () => {
    document.getElementById(targetId)?.scrollIntoView({ behavior: 'smooth' });
  };
  return (
    <button type="button" className="scroll-hint" onClick={onClick} aria-label="Scroll to descend">
      <span className="scroll-hint__chip">
        <span className="icon">expand_more</span>
        <span>Scroll to descend</span>
      </span>
      <span className="scroll-hint__rail" aria-hidden>
        <span className="scroll-hint__bead" />
      </span>
    </button>
  );
}

/**
 * Sunlit zone — first true depth section (~30m). Holds the main H1 plate so
 * the user reaches it by sinking past the surface, not by landing on it.
 */
export function Hero() {
  return (
    <section id="sunlit-hero" className="hero">
      <div className="hero__plate">
        <span className="hero__eyebrow">Sunlit Zone · 30m</span>
        <h1 className="hero__title">Charting the depths of backend architecture.</h1>
        <p className="hero__subtitle">
          Field notes from a software engineer descending through the layers of the modern
          data ecosystem — from sunlit APIs to the silent pressure of the platform abyss.
        </p>
      </div>

      <div className="hero__waterline" aria-hidden>
        <div className="hero__waterline-bar" />
        <div className="hero__depth-pill">
          <span>Depth 30m / Sunlit_Zone</span>
        </div>
      </div>
    </section>
  );
}

export function ScrollPrompt({ targetId = 'twilight' }: { targetId?: string }) {
  const onClick = () => {
    document.getElementById(targetId)?.scrollIntoView({ behavior: 'smooth' });
  };
  return (
    <button type="button" className="scroll-prompt" onClick={onClick}>
      <span className="scroll-prompt__label">Scroll to Descend</span>
      <span className="scroll-prompt__line" />
      <span className="icon scroll-prompt__icon">expand_more</span>
    </button>
  );
}
