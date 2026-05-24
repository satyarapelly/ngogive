import { useState } from "react";
import { Link } from "react-router-dom";
import { programs } from "../data/programs";

const navLinks = [
  { label: "Mission", href: "#mission" },
  { label: "Vision", href: "#vision" },
  { label: "SDG", href: "#sdg" },
  { label: "CSR Partnership", href: "#csr" },
];

export default function SiteHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <header className="site-header">
      <div className="container nav-wrap">
        <Link to="/" className="brand" aria-label="Give For Society home" onClick={closeMenu}>
          <span className="brand-mark" aria-hidden="true">
            <span className="brand-mark-ring">
              <span className="brand-mark-core">GFS</span>
            </span>
          </span>
          <span className="brand-copy">
            <strong>Give For Society</strong>
            <small>NGO for Education, Dignity & Sustainable Change</small>
          </span>
        </Link>

        <button
          type="button"
          className={`hamburger ${isMenuOpen ? "is-open" : ""}`}
          aria-label={isMenuOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-controls="primary-navigation"
          aria-expanded={isMenuOpen}
          onClick={() => setIsMenuOpen((prev) => !prev)}
        >
          <span />
          <span />
          <span />
        </button>

        <nav id="primary-navigation" className={`site-nav ${isMenuOpen ? "is-open" : ""}`} aria-label="Primary navigation">
          {navLinks.map((link) => (
            <a key={link.href} href={link.href} onClick={closeMenu}>
              {link.label}
            </a>
          ))}

          <div className="nav-programs" aria-label="Our work programs">
            <p>Our Work</p>
            {programs.map((program) => (
              <Link key={program.slug} to={`/programs/${program.slug}`} onClick={closeMenu}>
                {program.title}
              </Link>
            ))}
          </div>
        </nav>
      </div>
    </header>
  );
}
