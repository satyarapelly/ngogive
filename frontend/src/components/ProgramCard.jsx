import { Link } from 'react-router-dom'

export default function ProgramCard({ program }) {
  return (
    <article className="card">
      <div className={`media-placeholder ${program.theme}`} aria-label={`${program.title} visual placeholder`} />
      <h3>{program.title}</h3>
      <p>{program.summary}</p>
      <Link to={`/programs/${program.slug}`} className="btn">Know More</Link>
    </article>
  )
}
