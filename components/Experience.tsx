import { Timeline } from "@/components/ui/timeline";

function EntryContent({
  company,
  role,
  description,
  location,
}: {
  company:     string;
  role:        string;
  description: string;
  location:    string;
}) {
  return (
    <div className="mb-4">
      <p
        className="font-display font-bold mb-1"
        style={{ fontSize: "clamp(22px, 2.5vw, 30px)", color: "var(--text)" }}
      >
        {company}
      </p>
      <p
        className="font-mono mb-3"
        style={{ fontSize: "clamp(12px, 1.1vw, 14px)", color: "var(--accent)" }}
      >
        {role}
      </p>
      <p
        className="leading-relaxed mb-4"
        style={{
          fontSize:   "clamp(13px, 1.1vw, 14px)",
          color:      "var(--muted)",
          lineHeight: 1.8,
          maxWidth:   "32rem",
        }}
      >
        {description}
      </p>
      <span
        className="font-mono"
        style={{ fontSize: 11, color: "var(--muted)", opacity: 0.5 }}
      >
        {location}
      </span>
    </div>
  );
}

const timelineData = [
  {
    title:   "2025 — Present",
    content: (
      <EntryContent
        company="Art Dubai 2026"
        role="Digital Products Consultant"
        description="Consulting on digital product strategy and platform operations. Coordinating with external developers and internal stakeholders on feature viability, cost analysis, bug tracking, and security reviews."
        location="Dubai"
      />
    ),
  },
  {
    title:   "Apr — Dec 2025",
    content: (
      <EntryContent
        company="MCN"
        role="IT Intern"
        description="Managed IT infrastructure, supported network operations, and assisted with system administration across the organization."
        location="Dubai"
      />
    ),
  },
  {
    title:   "Jan — May 2025",
    content: (
      <EntryContent
        company="Greenhouse Foodstuff"
        role="IT Intern"
        description="Handled day-to-day IT support, maintained internal systems, and assisted with technology procurement and setup."
        location="Dubai"
      />
    ),
  },
  {
    title:   "Dec 2024 — Feb 2025",
    content: (
      <EntryContent
        company="Urbizassist"
        role="AI & IT Intern"
        description="Worked on AI-driven solutions and IT infrastructure. Assisted with implementing automation tools and maintaining cloud services."
        location="Dubai"
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
