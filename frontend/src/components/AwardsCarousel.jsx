import { useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, ImageOff } from "lucide-react";
import { awards } from "../data/awards";

const getCardsPerView = (width) => {
  if (width >= 1024) return 3;
  if (width >= 640) return 2;
  return 1;
};

export default function AwardsCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [cardsPerView, setCardsPerView] = useState(() =>
    getCardsPerView(window.innerWidth),
  );
  const [brokenImages, setBrokenImages] = useState({});

  useEffect(() => {
    const onResize = () => setCardsPerView(getCardsPerView(window.innerWidth));
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const maxStartIndex = useMemo(
    () => Math.max(awards.length - cardsPerView, 0),
    [cardsPerView],
  );

  useEffect(() => {
    setActiveIndex((prev) => Math.min(prev, maxStartIndex));
  }, [maxStartIndex]);

  return (
    <div className="awards-carousel-wrap">
      <div className="awards-carousel-head">
        <h3>Awards & Recognition</h3>
        <p>
          Recognitions received for grassroots service, women empowerment,
          health, education, and community development.
        </p>
      </div>
      <div className="awards-carousel-controls">
        <button
          className="carousel-btn"
          onClick={() => setActiveIndex((prev) => Math.max(prev - 1, 0))}
          disabled={activeIndex === 0}
          aria-label="Previous awards"
        >
          <ChevronLeft size={18} />
        </button>
        <button
          className="carousel-btn"
          onClick={() =>
            setActiveIndex((prev) => Math.min(prev + 1, maxStartIndex))
          }
          disabled={activeIndex === maxStartIndex}
          aria-label="Next awards"
        >
          <ChevronRight size={18} />
        </button>
      </div>

      <div className="awards-carousel-track-outer">
        <div
          className="awards-carousel-track"
          style={{
            transform: `translateX(-${(activeIndex * 100) / cardsPerView}%)`,
          }}
        >
          {awards.map((award) => {
            const isBroken = Boolean(brokenImages[award.image]);
            return (
              <article className="award-slide" key={award.title}>
                <div className="award-slide-image-wrap">
                  {isBroken ? (
                    <div className="award-slide-fallback" aria-hidden="true">
                      <ImageOff size={28} />
                    </div>
                  ) : (
                    <img
                      src={award.image}
                      alt={award.title}
                      onError={() =>
                        setBrokenImages((prev) => ({
                          ...prev,
                          [award.image]: true,
                        }))
                      }
                    />
                  )}
                </div>
                <div className="award-slide-body">
                  <span className="award-year-badge">{award.year}</span>
                  <h4>{award.title}</h4>
                  <p className="award-org">{award.organization}</p>
                  <p>{award.description}</p>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </div>
  );
}
