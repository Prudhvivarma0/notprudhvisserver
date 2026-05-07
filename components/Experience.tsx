import type { ExperienceRow } from "@/lib/db";

const DEFAULT_EXPERIENCE: ExperienceRow[] = [
  { id: 1, sort_order: 1, visible: 1, description: "",
    company: "MCN", role: "IT Intern", period: "APR 2025 - PRESENT", location: "DUBAI" },
  { id: 2, sort_order: 2, visible: 1, description: "",
    company: "Greenhouse Foodstuff", role: "IT Intern", period: "JAN 2025 - MAY 2025", location: "DUBAI" },
  { id: 3, sort_order: 3, visible: 1, description: "",
    company: "Urbizassist", role: "AI & IT Intern", period: "DEC 2024 - FEB 2025", location: "DUBAI" },
];

export function Experience({ experience }: { experience?: ExperienceRow[] }) {
  const items = experience && experience.length > 0 ? experience : DEFAULT_EXPERIENCE;

  return (
    <section id="experience">
      <h2 className="section-header">&lt; EXPERIENCE_LOG /&gt;</h2>
      <div className="timeline">
        {items.map(e => (
          <div key={e.id} className="timeline-item">
            <h3>{e.company} — {e.role}</h3>
            <span>{e.period} // {e.location}</span>
            {e.description && (
              <p style={{ marginTop: "0.5rem", color: "var(--text-secondary)", fontSize: "0.95rem", lineHeight: 1.6 }}>
                {e.description}
              </p>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
