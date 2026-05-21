import { programs } from "../data/programs";
import ProgramCard from "./ProgramCard";

export default function ProgramsSection() {
  return (
    <section className="section" id="our-work">
      <div className="container">
        <h2>Our Work</h2>
        <div className="grid">
          {programs.map((program) => (
            <ProgramCard key={program.slug} program={program} />
          ))}
        </div>
      </div>
    </section>
  );
}
