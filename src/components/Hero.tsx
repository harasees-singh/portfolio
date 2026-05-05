export function Hero() {
  return (
    <section id="surface" className="hero">
      <div className="hero__plate">
        <span className="hero__eyebrow">Abyss Engineering</span>
        <h1 className="hero__title">Charting the depths of backend architecture.</h1>
        <p className="hero__subtitle">
          Field notes from a software engineer descending through the layers of the modern
          data ecosystem — from sunlit APIs to the silent pressure of the platform abyss.
        </p>
      </div>

      <div className="hero__waterline" aria-hidden>
        <div className="hero__waterline-bar" />
        <div className="hero__depth-pill">
          <span>Depth 0m / Surface_Node</span>
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
