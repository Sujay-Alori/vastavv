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
        <div className="hero-logo-overlay">
          <img
            src="/assets/brand/vastav-logo.png"
            alt="VASTAV ARCHITECTS"
            className="hero-logo"
            width="2097"
            height="750"
            draggable={false}
          />
        </div>
      </div>
    </section>
  )
}
