import Footer from '../components/Footer'
import HeroSection from '../components/HeroSection'
import ProgramsSection from '../components/ProgramsSection'
import SiteHeader from '../components/SiteHeader'
import VisionMissionSection from '../components/VisionMissionSection'

export default function HomePage() {
  return (
    <>
      <SiteHeader />
      <HeroSection />
      <VisionMissionSection />
      <section className="section" id="awards"><div className="container"><h2>Awards & Accreditations</h2><p>Recognized for grassroots impact, transparent governance, and community-centered implementation.</p></div></section>
      <ProgramsSection />
      <section className="section" id="sdg"><div className="container"><h2>SDG</h2><p>Aligned with SDG 3, SDG 4, SDG 5, SDG 6, and SDG 10 through inclusive health and education initiatives.</p></div></section>
      <section className="section" id="csr"><div className="container"><h2>CSR Partnership</h2><p>We co-create measurable CSR programs with organizations aligned to sustainable and inclusive impact.</p></div></section>
      <Footer />
    </>
  )
}
