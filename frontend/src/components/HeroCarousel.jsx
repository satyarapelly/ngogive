import { useEffect, useState } from "react";
import "./HeroCarousel.css";

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
    title: "Integrated Learning Centers (ILCs)",
    subtitle: "Bridge education for first-generation learners",
    description:
      "Creating safe neighborhood learning spaces that provide academic reinforcement, mentorship, and holistic growth for children.",
    image: "/images/programs/integrated-learning-centers-ilc/ilc-prog.png",
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
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  return (
    <section className="hero-carousel" aria-label="Program highlights">
      {slides.map((slide, index) => (
        <article
          key={slide.title}
          className={`hero-carousel-slide ${currentSlide === index ? "is-active" : ""}`}
          style={{ backgroundImage: `url(${slide.image})` }}
          aria-hidden={currentSlide !== index}
        >
          <div className="hero-carousel-overlay" />
          <div className="hero-carousel-content container">
            <p className="hero-carousel-subtitle">{slide.subtitle}</p>
            <h1>{slide.title}</h1>
            <p className="hero-carousel-description">{slide.description}</p>
            <div className="hero-carousel-actions">
              <a className="hero-carousel-btn hero-carousel-btn-primary" href="#work">Explore Programme</a>
              <a className="hero-carousel-btn hero-carousel-btn-outline" href="#partners">Partner With Us</a>
            </div>
          </div>
        </article>
      ))}

      <div className="hero-carousel-dots" role="tablist" aria-label="Hero slides">
        {slides.map((slide, index) => (
          <button
            key={slide.title}
            className={`hero-carousel-dot ${currentSlide === index ? "is-active" : ""}`}
            onClick={() => setCurrentSlide(index)}
            aria-label={`Go to ${slide.title}`}
            aria-selected={currentSlide === index}
            role="tab"
          />
        ))}
      </div>
    </section>
  );
}
