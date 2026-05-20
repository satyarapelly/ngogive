import { Link, useParams } from 'react-router-dom'
import SiteHeader from '../components/SiteHeader'
import Footer from '../components/Footer'
import { getSdgImagePath, programs } from '../data/programs'

export default function ProgramDetailPage() {
  const { slug } = useParams()
  const program = programs.find((item) => item.slug === slug)

  if (!program) return <div className="container"><p>Program not found.</p><Link to="/">Go back</Link></div>

  return (<>
    <SiteHeader />
    <main>
      <section className="detail-hero">
        <div className="detail-grid">
          <div>
            <Link className="back-link" to="/">← Back to Home</Link>
            <h1>{program.title}</h1>
            <p>{program.overview}</p>
          </div>
        </div>
      </section>

      <section className="content-section"><div className="section-heading"><h2>Program Overview</h2><p>{program.overview}</p></div></section>
      <section className="gray-section"><div className="section-heading"><h2>Problem / Need</h2><p>{program.problemStatement}</p></div></section>

      <section className="content-section"><div><h2>Objectives</h2><ul className="nice-list">{program.objectives.map((item) => <li key={item}>{item}</li>)}</ul></div></section>

      <section className="gray-section"><div><h2>Sub-category / Project Cards</h2><div className="subcat-grid">{program.subCategories.map((sub) => (
        <article className="subcat-tile" key={sub.title}>
          <div className="subcat-image-wrap"><img src={sub.image} alt={sub.title} loading="lazy" /></div>
          <div className="subcat-tile-body"><h3>{sub.title}</h3><p>{sub.description}</p>{sub.kpi ? <span className="subcat-kpi-tag">{sub.kpi}</span> : null}</div>
        </article>
      ))}</div></div></section>

      <section className="content-section"><div><h2>Key Activities</h2><ul className="nice-list">{program.activities.map((item) => <li key={item}>{item}</li>)}</ul></div></section>
      <section className="gray-section"><div><h2>Target Beneficiaries</h2><ul className="nice-list">{program.beneficiaries.map((item) => <li key={item}>{item}</li>)}</ul></div></section>
      <section className="content-section"><div><h2>Impact Metrics</h2><ul className="nice-list">{program.metrics.map((item) => <li key={item}>{item}</li>)}</ul></div></section>
      <section className="gray-section"><div><h2>KPIs</h2><ul className="nice-list">{program.kpis.map((item) => <li key={item}>{item}</li>)}</ul></div></section>
      <section className="content-section"><div><h2>Monitoring & Evaluation</h2><ul className="nice-list">{program.monitoring.map((item) => <li key={item}>{item}</li>)}</ul></div></section>

      <section className="sdg-section"><div><h2>SDG Alignment</h2><div className="big-sdgs">{program.sdgs.map((sdg) => <img key={sdg} src={getSdgImagePath(sdg)} alt={`SDG ${sdg}`} loading="lazy" />)}</div></div></section>
      <section className="gray-section"><div><h2>Gallery / Field Photos</h2><div className="gallery-grid">{program.gallery.map((image, i) => <div className="gallery-tile" key={`${image}-${i}`}><img src={image} alt={`${program.shortTitle} field photo ${i + 1}`} loading="lazy" /></div>)}</div></div></section>
      <section className="content-section"><div><h2>Related Downloads / Proposal Documents</h2>{program.downloads.length ? <ul className="nice-list">{program.downloads.map((file) => <li key={file.url}><a href={file.url} target="_blank" rel="noreferrer">{file.title}</a></li>)}</ul> : <p>No downloads available for this program yet.</p>}</div></section>
      <section className="content-section"><div className="cta"><h2>Call to Action</h2><p>Support {program.shortTitle} by partnering with GIVE for scalable and measurable outcomes across underserved communities.</p><Link className="btn btn-primary" to="/">Partner With Us</Link></div></section>
    </main>
    <Footer />
  </>)
}
