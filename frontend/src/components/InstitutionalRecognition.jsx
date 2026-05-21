import { FileText } from "lucide-react";
import { institutionalRecognition } from "../data/institutionalRecognition";

export default function InstitutionalRecognition() {
  return (
    <section id="institutional-recognition" className="content-section institutional-section">
      <div className="section-heading">
        <p className="eyebrow">MOUS, MOCS & INSTITUTIONAL RECOGNITION</p>
        <h2>MoUs, MoCs & Institutional Recognition</h2>
        <p>
          Government collaborations, institutional approvals, recognition, and
          partnership documents supporting Give For Society’s grassroots
          implementation.
        </p>
      </div>
      <div className="institutional-grid">
        {institutionalRecognition.map((item) => (
          <article key={`${item.title}-${item.year}`} className="institutional-card">
            <img src={item.image} alt={item.title} className="institutional-image" />
            <div className="institutional-body">
              <span className="institutional-badge">{item.type}</span>
              <h3>{item.title}</h3>
              <p className="institutional-meta">{item.institution}</p>
              <p className="institutional-year">{item.year}</p>
              <p className="institutional-description">{item.description}</p>
              {item.documentUrl && (
                <a className="btn btn-outline" href={item.documentUrl}>
                  <FileText size={16} /> View Document
                </a>
              )}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
