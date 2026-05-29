import { MapPin } from "lucide-react";

const coverageAreas = [
  {
    district: "Medchal-Malkajgiri",
    focus: "Education & School Infrastructure",
    beneficiaries: "3,200+",
    programs: ["Back2School Drive", "Sthree Swabhiman", "Community Health"],
    color: "#dcfce7",
    accent: "#065f46",
  },
  {
    district: "Sangareddy",
    focus: "Women & Youth Empowerment",
    beneficiaries: "1,800+",
    programs: ["Women SHG Support", "Youth Skilling", "Digital Literacy"],
    color: "#fff7ed",
    accent: "#c2410c",
  },
  {
    district: "Nalgonda",
    focus: "Farmer Empowerment",
    beneficiaries: "2,100+",
    programs: ["Sustainable Farming", "Crop Training", "Livelihood Recovery"],
    color: "#fef3c7",
    accent: "#92400e",
  },
  {
    district: "Mahaboobnagar",
    focus: "Community Awareness",
    beneficiaries: "1,500+",
    programs: ["Blood Donation Drives", "Civic Campaigns", "Social Action"],
    color: "#ede9fe",
    accent: "#5b21b6",
  },
  {
    district: "Nizamabad",
    focus: "Disaster Relief & Health",
    beneficiaries: "900+",
    programs: ["Emergency Response", "Flood Relief", "Preventive Health Camps"],
    color: "#fee2e2",
    accent: "#991b1b",
  },
  {
    district: "Rangareddy",
    focus: "Integrated Learning Centers",
    beneficiaries: "1,200+",
    programs: ["Digital Skills", "ILC Libraries", "Mentorship Programs"],
    color: "#e0f2fe",
    accent: "#0369a1",
  },
];

export default function GeographicCoverage() {
  return (
    <section className="content-section" id="coverage">
      <div className="coverage-wrap">
        <div className="section-heading">
          <p className="eyebrow">GEOGRAPHIC COVERAGE</p>
          <h2>Reaching communities across Telangana&apos;s districts.</h2>
          <p>
            Our programmes operate across 6+ districts, touching rural, tribal,
            and underserved communities through dedicated field teams and
            government partnerships.
          </p>
        </div>
        <div className="coverage-grid">
          {coverageAreas.map((area) => (
            <div
              key={area.district}
              className="coverage-card"
              style={{ borderTop: `4px solid ${area.accent}` }}
            >
              <div
                className="coverage-card-header"
                style={{ background: area.color }}
              >
                <MapPin size={18} color={area.accent} />
                <strong style={{ color: area.accent }}>{area.district}</strong>
                <small>Telangana</small>
              </div>
              <div className="coverage-card-body">
                <p className="coverage-focus">{area.focus}</p>
                <strong
                  className="coverage-stat"
                  style={{ color: area.accent }}
                >
                  {area.beneficiaries}
                </strong>
                <p className="coverage-stat-label">Beneficiaries Reached</p>
                <ul className="coverage-programs">
                  {area.programs.map((p) => (
                    <li key={p}>{p}</li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}