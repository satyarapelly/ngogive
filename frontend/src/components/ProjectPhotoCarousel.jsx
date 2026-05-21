import { useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { projectPhotos } from "../data/projectPhotos";

export default function ProjectPhotoCarousel() {
  const carouselRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [imageErrors, setImageErrors] = useState({});

  const totalSlides = projectPhotos.length;
  const dots = useMemo(() => projectPhotos.map((_, index) => index), []);

  const scrollByAmount = (direction) => {
    if (!carouselRef.current) return;
    const card = carouselRef.current.querySelector(".project-photo-card");
    if (!card) return;

    const cardWidth = card.getBoundingClientRect().width;
    const gap = 20;
    carouselRef.current.scrollBy({
      left: direction * (cardWidth + gap),
      behavior: "smooth",
    });
  };

  const onScroll = () => {
    if (!carouselRef.current) return;
    const card = carouselRef.current.querySelector(".project-photo-card");
    if (!card) return;

    const cardWidth = card.getBoundingClientRect().width + 20;
    const index = Math.round(carouselRef.current.scrollLeft / cardWidth);
    setActiveIndex(Math.max(0, Math.min(index, totalSlides - 1)));
  };

  return (
    <section className="section" id="project-photos">
      <div className="container">
        <div className="section-heading photo-carousel-heading">
          <h2>Field Stories &amp; Project Photos</h2>
          <p>
            A visual glimpse of Give For Society’s grassroots programmes across
            education, health, hygiene, rural development, relief, and
            community action.
          </p>
        </div>

        <div className="photo-carousel-controls">
          <button
            type="button"
            className="photo-carousel-arrow"
            onClick={() => scrollByAmount(-1)}
            aria-label="Scroll project photos left"
          >
            ←
          </button>
          <button
            type="button"
            className="photo-carousel-arrow"
            onClick={() => scrollByAmount(1)}
            aria-label="Scroll project photos right"
          >
            →
          </button>
        </div>

        <div className="project-photo-carousel" ref={carouselRef} onScroll={onScroll}>
          {projectPhotos.map((item) => {
            const hasImageError = imageErrors[item.image];

            return (
              <article className="project-photo-card" key={item.title}>
                <div className="project-photo-image-wrap">
                  {!hasImageError ? (
                    <img
                      src={item.image}
                      alt={item.title}
                      loading="lazy"
                      onError={() =>
                        setImageErrors((prev) => ({ ...prev, [item.image]: true }))
                      }
                    />
                  ) : (
                    <div
                      className="project-photo-fallback"
                      aria-label={`${item.title} image unavailable`}
                    >
                      <span>📷</span>
                      <small>Image not available</small>
                    </div>
                  )}
                  <div className="project-photo-overlay">
                    <p className="project-photo-core-area">{item.coreArea}</p>
                    <h3>{item.title}</h3>
                  </div>
                </div>
                <div className="project-photo-body">
                  <p>{item.description}</p>
                  <Link to={`/programs/${item.linkSlug}`} className="btn btn-outline">
                    View Program
                  </Link>
                </div>
              </article>
            );
          })}
        </div>

        <div className="photo-carousel-dots" aria-label="Project photo slide indicators">
          {dots.map((dotIndex) => (
            <button
              key={dotIndex}
              className={`photo-dot ${activeIndex === dotIndex ? "active" : ""}`}
              type="button"
              onClick={() => {
                if (!carouselRef.current) return;
                const card = carouselRef.current.querySelector(".project-photo-card");
                if (!card) return;
                const slideWidth = card.getBoundingClientRect().width + 20;
                carouselRef.current.scrollTo({
                  left: slideWidth * dotIndex,
                  behavior: "smooth",
                });
              }}
              aria-label={`Go to project photo ${dotIndex + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
