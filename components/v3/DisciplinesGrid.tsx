const DISCIPLINES = [
  ["01", "Cloud Infrastructure"],
  ["02", "Event Platforms"],
  ["03", "Web Applications"],
  ["04", "Automation Pipelines"],
  ["05", "Edge Networks"],
  ["06", "Threat Detection"],
  ["07", "Developer Tooling"],
  ["08", "Resilient Architectures"],
] as const;

export function DisciplinesGrid() {
  return (
    <section
      style={{
        borderTop: "1px solid var(--rule)",
        borderBottom: "1px solid var(--rule)",
        padding: "40px 32px",
      }}
    >
      {/* Header */}
      <div
        className="v3-mono"
        style={{
          fontSize: 11, textTransform: "uppercase", letterSpacing: "0.18em",
          color: "var(--mute)", marginBottom: 28,
          display: "flex", justifyContent: "space-between",
        }}
      >
        <span>(00) Disciplines</span>
        <span>Eight things I keep returning to</span>
      </div>

      {/* 4×2 grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)" }}>
        {DISCIPLINES.map(([n, t], i) => (
          <div
            key={n}
            style={{
              padding: "24px 20px 24px 0",
              borderTop: i >= 4 ? "1px solid var(--rule)" : "none",
              display: "flex",
              alignItems: "baseline",
              gap: 16,
            }}
          >
            <span
              className="v3-mono"
              style={{ fontSize: 11, letterSpacing: "0.16em", color: "var(--mute)", flexShrink: 0 }}
            >
              {n}
            </span>
            <span style={{ fontSize: 18, lineHeight: 1.2, fontWeight: 400 }}>{t}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
