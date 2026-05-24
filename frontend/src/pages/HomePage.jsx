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

export default function HomePage() {
  return (
    <>
      <SiteHeader />
      <HeroSection />

      <section className="section patterned-impact" aria-label="Impact highlights">
        <div className="container">
          <div className="patterned-head">
            <h2>Building change through trusted local partnerships</h2>
            <p>
              We design community-led programs with schools, women groups, and local institutions for measurable social impact.
            </p>
          </div>
          <div className="patterned-grid">
            {impactHighlights.map((item) => (
              <article className="patterned-card" key={item.label}>
                <strong>{item.value}</strong>
                <p>{item.label}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <VisionMissionSection />
      <section className="section" id="awards">
        <div className="container">
          <h2>Awards & Accreditations</h2>
          <p>
            Recognized for grassroots impact, transparent governance, and
            community-centered implementation.
          </p>
        </div>
      </section>
      <ProgramsSection />
      <ProjectPhotoCarousel />
      <section className="section" id="sdg">
        <div className="container">
          <h2>SDG</h2>
          <p>
            Aligned with SDG 3, SDG 4, SDG 5, SDG 6, and SDG 10 through
            inclusive health and education initiatives.
          </p>
        </div>
      </section>
      <section className="section" id="csr">
        <div className="container">
          <h2>CSR Partnership</h2>
          <p>
            We co-create measurable CSR programs with organizations aligned to
            sustainable and inclusive impact.
          </p>
        </div>
      </section>
      <Footer />
    </>
  );
}
