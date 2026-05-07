const EXP = [
  ["2026—", "Art Dubai 2026",       "Digital Products Consultant"],
  ["2025",  "MCN",                  "Intern · issue triage + automation"],
  ["2025",  "Greenhouse Foodstuff", "Intern · security & training"],
  ["2024",  "Urbizassist",          "Intern · IT infra audit"],
] as const;

export function TimelineGrid() {
  return (
    <section id="timeline" style={{ padding: "120px 32px", borderTop: "1px solid var(--rule)" }}>
      <div
        className="v3-mono"
        style={{
          fontSize: 12, textTransform: "uppercase",
          letterSpacing: "0.16em", color: "var(--mute)", marginBottom: 60,
        }}
      >
        (03) Time
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 32 }}>
        {EXP.map(([year, org, role], i) => (
          <div key={i} style={{ borderTop: "1px solid var(--ink)", paddingTop: 24 }}>
            <div
              className="v3-mono"
              style={{
                fontSize: 11, textTransform: "uppercase",
                letterSpacing: "0.16em", color: "var(--mute)", marginBottom: 16,
              }}
            >
              {year}
            </div>
            <div className="v3-display" style={{ fontSize: 32, lineHeight: 1, marginBottom: 12 }}>
              {org}
            </div>
            <div style={{ fontSize: 14, color: "var(--mute)" }}>{role}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
