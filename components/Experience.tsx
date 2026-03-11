import { Timeline } from "@/components/ui/timeline";

function EntryContent({
  role,
  description,
  location,
  period,
}: {
  role:        string;
  description: string;
  location:    string;
  period:      string;
}) {
  return (
    <div className="mb-4">
      <p
        className="font-display font-bold mb-3"
        style={{ fontSize: "clamp(18px, 2vw, 22px)", color: "var(--text)" }}
      >
        {role}
      </p>
      <p
        className="leading-relaxed mb-4"
        style={{
          fontSize:   "clamp(13px, 1.2vw, 15px)",
          color:      "var(--muted)",
          lineHeight: 1.8,
        }}
      >
        {description}
      </p>
      <div className="flex flex-wrap gap-3">
        <span
          className="font-mono"
          style={{ fontSize: 11, color: "var(--accent)", opacity: 0.7 }}
        >
          {location}
        </span>
        <span
          className="font-mono"
          style={{ fontSize: 11, color: "var(--muted)", opacity: 0.6 }}
        >
          {period}
        </span>
      </div>
    </div>
  );
}

const timelineData = [
  {
    title:   "Art Dubai 2026",
    content: (
      <EntryContent
        role="Digital Products Consultant"
        description="Consulting on digital product strategy and platform operations. Coordinating with external developers and internal stakeholders on feature viability, cost analysis, bug tracking, and security reviews."
        location="Dubai"
        period="2025 — Present"
      />
    ),
  },
  {
    title:   "MCN",
    content: (
      <EntryContent
        role="IT Intern"
        description="Managed IT infrastructure, supported network operations, and assisted with system administration across the organization."
        location="Dubai"
        period="Apr — Dec 2025"
      />
    ),
  },
  {
    title:   "Greenhouse Foodstuff",
    content: (
      <EntryContent
        role="IT Intern"
        description="Handled day-to-day IT support, maintained internal systems, and assisted with technology procurement and setup."
        location="Dubai"
        period="Jan — May 2025"
      />
    ),
  },
  {
    title:   "Urbizassist",
    content: (
      <EntryContent
        role="AI & IT Intern"
        description="Worked on AI-driven solutions and IT infrastructure. Assisted with implementing automation tools and maintaining cloud services."
        location="Dubai"
        period="Dec 2024 — Feb 2025"
      />
    ),
  },
];

export function Experience() {
  return (
    <section id="experience" className="py-[clamp(60px,8vw,120px)] px-6">
      <div className="max-w-5xl mx-auto">

        <p className="font-mono text-sm mb-6" style={{ color: "var(--muted)" }}>
          // 03 ——— what i do
        </p>

        <h2
          className="font-display font-bold mb-4 reveal"
          style={{ fontSize: "clamp(24px, 4vw, 36px)", color: "var(--text)" }}
        >
          Experience
        </h2>

      </div>

      <Timeline data={timelineData} />
    </section>
  );
}
