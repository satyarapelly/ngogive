import { Link, useParams } from 'react-router-dom'
import SiteHeader from '../components/SiteHeader'
import Footer from '../components/Footer'
import { programs } from '../data/programs'

export default function ProgramDetailPage() {
  const { slug } = useParams()
  const program = programs.find((item) => item.slug === slug)

  if (!program) return <div className="container"><p>Program not found.</p><Link to="/">Go back</Link></div>

  return (
    <>
      <SiteHeader />
      <main className="section"><div className="container"><h1>{program.title}</h1><div className={`detail-img ${program.theme}`} aria-label="Program visual placeholder" /><p>{program.details}</p><Link to="/" className="btn">Back to Home</Link></div></main>
      <Footer />
    </>
  )
}
