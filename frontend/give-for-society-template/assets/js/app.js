const counters = document.querySelectorAll('[data-count]');
const speed = 45;
const animate = (el) => {
  const target = Number(el.dataset.count);
  let current = 0;
  const tick = () => {
    const inc = Math.ceil(target / speed);
    current = Math.min(current + inc, target);
    el.textContent = current.toLocaleString();
    if (current < target) requestAnimationFrame(tick);
  };
  tick();
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      animate(entry.target);
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });

counters.forEach((counter) => observer.observe(counter));
