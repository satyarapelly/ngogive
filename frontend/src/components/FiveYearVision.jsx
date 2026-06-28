import { CheckCircle2 } from "lucide-react";

const milestones = [
  {
    period: "2024–25",
    phase: "Strengthen Foundations",
    color: "#1e3560",
    goals: [
      "Expand Sthree Swabhiman to 50+ schools",
      "Launch 5 new Integrated Learning Centers",
      "Establish farmer groups in 3 new districts",
      "Scale menstrual hygiene program to 10,000 girls",
    ],
  },
  {
    period: "2025–26",
    phase: "Broaden Reach",
    color: "#f97316",
    goals: [
      "Partner with 20+ government institutions",
      "Reach 50,000+ direct beneficiaries",
      "Launch women's leadership incubator",
      "Establish community health surveillance network",
    ],
  },
  {
    period: "2026–27",
    phase: "Build Institutional Depth",
    color: "#0369a1",
    goals: [
      "Co-develop curriculum with state education board",
      "Launch youth entrepreneurship fund",
      "Create district-level community resource centers",
      "Scale disaster preparedness training",
    ],
  },
  {
    period: "2027–28",
    phase: "Deepen Community Leadership",
    color: "#5b21b6",
    goals: [
      "Train 500+ community leaders (women & youth)",
      "Launch women's cooperative network across 6 districts",
      "Establish farmer producer organizations (FPOs)",
      "Scale ILC model to 25+ centers",
    ],
  },
  {
    period: "2028–29",
    phase: "Self-Sustaining Community Model",
    color: "#1e3560",
    goals: [
      "Achieve community-led program sustainability",
      "100,000+ lives directly impacted",
      "Launch national knowledge-sharing initiative",
      "Establish endowment fund for long-term operations",
    ],
  },
];

export default function FiveYearVision() {
  return (
    <section id="vision" className="orange-section">
      <div className="vision-wrap">
        <div className="vision-intro-row">
          <div className="section-heading">
            <p className="eyebrow">OUR VISION 2025–2030</p>
            <h2>A five-year roadmap for transformative rural impact.</h2>
            <p>
              Give For Society is committed to a clear, measurable path toward
              community transformation — scaling programs, deepening partnerships,
              and building self-sustaining grassroots change.
            </p>
          </div>
          <div className="vision-intro-photo">
            <img
              src="/images/programs/empowering-rural-learning/vision-main.jpg"
              alt="Empowering rural education"
            />
          </div>
        </div>
        <div className="vision-grid">
          {milestones.map((milestone) => (
            <div key={milestone.period} className="vision-card">
              <div
                className="vision-period-badge"
                style={{ background: milestone.color }}
              >
                {milestone.period}
              </div>
              <h3 className="vision-phase" style={{ color: milestone.color }}>
                {milestone.phase}
              </h3>
              <ul className="vision-goals">
                {milestone.goals.map((goal) => (
                  <li key={goal}>
                    <CheckCircle2
                      size={16}
                      color={milestone.color}
                      style={{ flexShrink: 0, marginTop: 2 }}
                    />
                    <span>{goal}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}