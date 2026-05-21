import "./CoreAreas.css";

const coreAreas = [
  { title: "Health & Hygiene", image: "/images/arogyasetu.jpg" },
  {
    title: "Education & School Infrastructure",
    image: "/images/rural-learning.jpg",
  },
  { title: "Integrated Learning Centers", image: "/images/ilc.jpg" },
  {
    title: "Rural Youth Digital Employability",
    image: "/images/youth-employability.jpg",
  },
  {
    title: "Women & Adolescent Girl Empowerment",
    image: "/images/sthree-swabhiman.jpg",
  },
];

export default function CoreAreas() {
  return (
    <section id="work" className="core-areas section">
      <div className="container">
        <p className="eyebrow">OUR CORE AREAS OF WORK</p>
        <h2>Community-focused programmes creating long-term rural impact.</h2>
        <div className="core-areas-grid">
          {coreAreas.map((area) => (
            <article
              key={area.title}
              className="core-area-card"
              style={{ backgroundImage: `url(${area.image})` }}
            >
              <div className="core-area-overlay" />
              <h3>{area.title}</h3>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
