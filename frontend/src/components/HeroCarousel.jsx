import { useEffect, useState } from "react";
import "./HeroCarousel.css";

function ChevronLeft() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M15 18l-6-6 6-6" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function ChevronRight() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M9 18l6-6-6-6" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

const slides = [
  {
    title: "Sthree Swabhiman",
    subtitle: "Menstrual health and dignity initiative",
    description:
      "Improving access to menstrual hygiene products, awareness sessions, and safe sanitation infrastructure for adolescent girls and women.",
    image: "/images/programs/sthree-swabhiman/sthree-swabhiman.jpg",
  },
  {
    title: "ArogyaSetu",
    subtitle: "Community health outreach",
    description:
      "Delivering preventive healthcare awareness, health camps, and early screening support in underserved rural communities.",
    image: "/images/programs/arogyasetu-health-initiative/arogyasetu.jpg",
  },
  {
    title: "Empowering Rural Learning",
    subtitle: "Strengthening school education",
    description:
      "Enhancing learning outcomes through school infrastructure, classroom support, and child-centered educational interventions.",
    image: "/images/programs/empowering-rural-learning/rural-learning.jpg",
  },
  {
    title: "Integrated Learning Centers",
    subtitle: "Bridge education for first-generation learners",
    description:
      "Creating safe neighbourhood learning spaces that provide academic reinforcement, mentorship, and holistic growth for children.",
    image: "/images/programs/integrated-learning-centers-ilc/ilc-main.jpg",
  },
  {
    title: "Rural Youth Digital Employability",
    subtitle: "Skilling youth for modern livelihoods",
    description:
      "Building digital and workplace readiness among rural youth through practical training, career guidance, and employability pathways.",
    image: "/images/programs/women-youth-empowerment/youth-employability.jpg",
  },
];

export default function HeroCarousel() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const prev = () => setCurrent((c) => (c - 1 + slides.length) % slides.length);
  const next = () => setCurrent((c) => (c + 1) % slides.length);

  return (
    <section className="hero-carousel" aria-label="Program highlights">
      {slides.map((slide, index) => (
        <article
          key={slide.title}
          className={`hero-carousel-slide${current === index ? " is-active" : ""}`}
          style={{ backgroundImage: `url(${slide.image})` }}
          aria-hidden={current !== index}
        >
          <div className="hero-carousel-overlay" />
          <div className="hero-carousel-content">
            <div className="hero-carousel-text">
              <p className="hero-carousel-subtitle">{slide.subtitle}</p>
              <h1>{slide.title}</h1>
              <p className="hero-carousel-description">{slide.description}</p>
              <div className="hero-carousel-actions">
                <a className="hero-carousel-btn hero-carousel-btn-primary" href="#work">Explore Programme</a>
                <a className="hero-carousel-btn hero-carousel-btn-outline" href="#partners">Partner With Us</a>
              </div>
            </div>
          </div>
        </article>
      ))}

      <button className="hero-nav-arrow hero-nav-prev" onClick={prev} aria-label="Previous slide">
        <ChevronLeft />
      </button>
      <button className="hero-nav-arrow hero-nav-next" onClick={next} aria-label="Next slide">
        <ChevronRight />
      </button>

      <div className="hero-carousel-dots" role="tablist" aria-label="Hero slides">
        {slides.map((slide, index) => (
          <button
            key={slide.title}
            className={`hero-carousel-dot${current === index ? " is-active" : ""}`}
            onClick={() => setCurrent(index)}
            aria-label={`Go to ${slide.title}`}
            aria-selected={current === index}
            role="tab"
          />
        ))}
      </div>
    </section>
  );
}
