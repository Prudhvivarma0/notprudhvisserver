interface ExperienceEntry {
  company:  string;
  period:   string;
  role:     string;
  note?:    string;
  location: string;
}

const ENTRIES: ExperienceEntry[] = [
  {
    company:  "Art Dubai",
    period:   "2025 — Present",
    role:     "Digital Products Consultant",
    note:     "Consulting on digital product strategy, platform operations, and production workflows for a premier international art fair.",
    location: "Dubai",
  },
  {
    company:  "MCN",
    period:   "Apr — Dec 2025",
    role:     "IT Intern",
    location: "Dubai",
  },
  {
    company:  "Greenhouse Foodstuff",
    period:   "Jan — May 2025",
    role:     "IT Intern",
    location: "Dubai",
  },
  {
    company:  "Urbizassist",
    period:   "Dec 2024 — Feb 2025",
    role:     "AI & IT Intern",
    location: "Dubai",
  },
];

export function Experience() {
  return (
    <section id="experience" className="py-[clamp(60px,8vw,120px)] px-6">
      <div className="max-w-[700px] mx-auto">

        <p className="font-mono text-sm mb-6" style={{ color: "var(--muted)" }}>
          // 03 ——— what i do
        </p>

        <h2
          className="font-display font-bold mb-12 reveal"
          style={{ fontSize: "clamp(24px, 4vw, 36px)", color: "var(--text)" }}
        >
          Experience
        </h2>

        <div>
          {ENTRIES.map((entry) => (
            <div
              key={entry.company}
              className="reveal"
              style={{
                display:       "flex",
                flexWrap:      "wrap",
                gap:           "0.5rem 2rem",
                padding:       "1.5rem 0",
                borderBottom:  "1px solid var(--muted)",
                alignItems:    "flex-start",
              }}
            >
              {/* Left — company + period */}
              <div style={{ minWidth: 160, flex: "1 1 160px" }}>
                <p
                  className="font-mono font-semibold mb-1"
                  style={{ fontSize: "clamp(12px, 1.2vw, 13px)", color: "var(--accent)" }}
                >
                  {entry.company}
                </p>
                <p
                  className="font-mono"
                  style={{ fontSize: 11, color: "var(--muted)", opacity: 0.65 }}
                >
                  {entry.period}
                </p>
              </div>

              {/* Right — role + note + location */}
              <div style={{ flex: "2 1 240px" }}>
                <p
                  className="font-display font-bold mb-1"
                  style={{ fontSize: "clamp(14px, 1.4vw, 16px)", color: "var(--text)" }}
                >
                  {entry.role}
                </p>
                {entry.note && (
                  <p
                    className="mb-2"
                    style={{
                      fontSize:   "clamp(12px, 1.1vw, 13px)",
                      color:      "var(--muted)",
                      lineHeight: 1.7,
                    }}
                  >
                    {entry.note}
                  </p>
                )}
                <p
                  className="font-mono"
                  style={{ fontSize: 11, color: "var(--muted)", opacity: 0.5 }}
                >
                  {entry.location}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
