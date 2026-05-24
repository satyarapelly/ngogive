import Footer from "../components/Footer";
import HeroSection from "../components/HeroSection";
import ProgramsSection from "../components/ProgramsSection";
import SiteHeader from "../components/SiteHeader";
import ProjectPhotoCarousel from "../components/ProjectPhotoCarousel";
import VisionMissionSection from "../components/VisionMissionSection";

const impactHighlights = [
  { value: "15+", label: "Years of grassroots action" },
  { value: "40K+", label: "Lives engaged through programs" },
  { value: "100+", label: "Villages and urban communities reached" },
  { value: "12", label: "Ongoing multi-sector interventions" },
];

const focusAreas = [
  "Education and digital learning for rural children",
  "Women and adolescent health with dignity initiatives",
  "Youth employability and local leadership development",
  "Emergency relief and climate resilient community planning",
];

export default function HomePage() {
  return (
    <>
      <SiteHeader />
      <HeroSection />

      <section className="touch-impact section" aria-label="Impact highlights">
        <div className="container">
          <div className="touch-heading">
            <p className="eyebrow">Our footprint</p>
            <h2>Community-led action with measurable outcomes</h2>
          </div>
          <div className="touch-impact-grid">
            {impactHighlights.map((item) => (
              <article className="touch-stat-card" key={item.label}>
                <strong>{item.value}</strong>
                <p>{item.label}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="touch-split section" id="mission">
        <div className="container touch-split-grid">
          <article className="touch-panel touch-panel-dark">
            <p className="eyebrow">Approach</p>
            <h3>Partnership-first model</h3>
            <p>
              We collaborate with panchayats, schools, self-help groups, and district institutions to co-design interventions that are relevant,
              localized, and sustainable.
            </p>
          </article>
          <article className="touch-panel">
            <p className="eyebrow">What we prioritize</p>
            <ul>
              {focusAreas.map((area) => (
                <li key={area}>{area}</li>
              ))}
            </ul>
          </article>
        </div>
      </section>

      <VisionMissionSection />
      <ProgramsSection />
      <ProjectPhotoCarousel />

      <section className="touch-cta section" id="csr">
        <div className="container touch-cta-inner">
          <div>
            <p className="eyebrow">CSR partnerships</p>
            <h2>Build your next high-impact social initiative with us</h2>
            <p>
              From baseline assessment to impact reporting, we deliver transparent program execution for corporates and philanthropic partners.
            </p>
          </div>
          <a className="btn btn-primary" href="/donate-now.html">
            Start a partnership
          </a>
        </div>
      </section>

      <section className="section" id="sdg">
        <div className="container">
          <h2>SDG Alignment</h2>
          <p>
            Our work aligns with SDG 3, 4, 5, 6, and 10 by advancing equitable access to health, education, and dignified livelihoods.
          </p>
        </div>
      </section>
      <Footer />
    </>
  );
}
