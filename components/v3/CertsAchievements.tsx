const CERTS = [
  { name: "EC-COUNCIL CEH",  label: "2024" },
  { name: "CISCO CYBER OPS", label: "2024" },
];

const ACHIEVEMENTS = [
  { name: "HACKATHON TOP-3",      label: "NATIONAL CTF" },
  { name: "B.S. CS — DISTINCTION", label: "FIRST CLASS" },
];

function ItemList({ items }: { items: { name: string; label: string }[] }) {
  return (
    <div className="v3-display" style={{ fontSize: 42, lineHeight: 1.05 }}>
      {items.map(item => (
        <div
          key={item.name}
          style={{ borderBottom: "1px solid var(--rule)", padding: "20px 0", position: "relative" }}
        >
          {item.name}
          <span
            className="v3-mono"
            style={{
              fontSize: 12, color: "var(--mute)", letterSpacing: "0.12em",
              position: "absolute", right: 0, bottom: 20,
            }}
          >
            {item.label}
          </span>
        </div>
      ))}
    </div>
  );
}

export function CertsAchievements() {
  return (
    <section
      style={{
        padding: "120px 32px",
        borderTop: "1px solid var(--rule)",
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: 80,
      }}
    >
      <div>
        <div
          className="v3-mono"
          style={{
            fontSize: 12, textTransform: "uppercase",
            letterSpacing: "0.16em", color: "var(--mute)", marginBottom: 32,
          }}
        >
          (04) Certs
        </div>
        <ItemList items={CERTS} />
      </div>

      <div>
        <div
          className="v3-mono"
          style={{
            fontSize: 12, textTransform: "uppercase",
            letterSpacing: "0.16em", color: "var(--mute)", marginBottom: 32,
          }}
        >
          (05) Achievements
        </div>
        <ItemList items={ACHIEVEMENTS} />
      </div>
    </section>
  );
}
