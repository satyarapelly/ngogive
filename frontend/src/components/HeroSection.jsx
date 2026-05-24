export default function HeroSection() {
  return (
    <section className="hero touch-hero">
      <div className="hero-bg" aria-hidden="true" />
      <div className="container touch-hero-grid">
        <div>
          <p className="eyebrow">Give For Society Foundation</p>
          <h1>Transforming lives through dignity, opportunity, and local leadership.</h1>
          <p>
            We are a community development organization enabling education, health, and resilience across Telangana through on-ground programs
            and partnerships.
          </p>
          <div className="hero-actions">
            <a className="btn btn-primary" href="/donate-now.html">
              Donate Now
            </a>
            <a className="btn btn-outline" href="#our-work">
              Explore Programs
            </a>
          </div>
        </div>
        <aside className="hero-card touch-hero-card" aria-label="Key commitment">
          <p className="eyebrow">2026 Focus</p>
          <h3>Integrated development</h3>
          <ul>
            <li>School and digital learning ecosystems</li>
            <li>Menstrual health and women dignity interventions</li>
            <li>Youth employability and entrepreneurship support</li>
          </ul>
        </aside>
      </div>
    </section>
  );
}
