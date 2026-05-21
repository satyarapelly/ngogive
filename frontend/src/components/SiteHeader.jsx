import { Link } from "react-router-dom";
import { programs } from "../data/programs";

export default function SiteHeader() {
  return (
    <header className="site-header">
      <div className="container nav-wrap">
        <Link to="/" className="brand" aria-label="Give For Society home">
          <span className="brand-mark" aria-hidden="true">
            GFS
          </span>
          <span>Give For Society</span>
        </Link>
        <nav>
          <a href="#mission">Mission</a>
          <a href="#vision">Vision</a>
          <div className="dropdown">
            <button type="button">Our Work</button>
            <div className="dropdown-menu">
              {programs.map((program) => (
                <Link key={program.slug} to={`/programs/${program.slug}`}>
                  {program.title}
                </Link>
              ))}
            </div>
          </div>
          <a href="#sdg">SDG</a>
          <a href="#csr">CSR Partnership</a>
        </nav>
      </div>
    </header>
  );
}
