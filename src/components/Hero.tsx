export default function Hero() {
  return (
    <section className="hero-section" aria-label="VASTAV Architectural & Interior Project">
      <div className="hero-image-wrapper">
        <img
          src="/assets/images/hero.png"
          alt="VASTAV Architectural & Interior Design"
          className="hero-image"
          width="1790"
          height="879"
          loading="eager"
          decoding="async"
        />
        <div className="hero-overlay" aria-hidden="true" />
        <div className="hero-caption">
          <span className="hero-caption-text">VASTAV ARCHITECTS</span>
        </div>
      </div>
    </section>
  )
}
