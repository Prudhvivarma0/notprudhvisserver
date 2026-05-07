const CERTS = [
  { name: "BTL1",                 issuer: "Security Blue Team", label: "DEC 2025" },
  { name: "ISC2 CC",              issuer: "ISC2",               label: "AUG 2025" },
  { name: "Splunk SOAR",          issuer: "Splunk",             label: "OCT 2025" },
  { name: "Art of Investigation", issuer: "Splunk",             label: "OCT 2025" },
  { name: "Security Ops Analyst", issuer: "Splunk",             label: "OCT 2025" },
  { name: "Intro to Splunk",      issuer: "Splunk",             label: "OCT 2025" },
  { name: "Cybersecurity Fundamentals", issuer: "IBM",          label: "JAN 2025" },
  { name: "SOC Analyst",          issuer: "Udemy",              label: "APR 2024" },
];

const ACHIEVEMENTS = [
  { name: "1ST PLACE QUALIFIER", issuer: "", label: "ZU × EXPLOITERS CTF" },
  { name: "3RD PLACE WINNER",    issuer: "", label: "REDTEAM CYBER HACK"  },
];

function CertRow({ name, issuer, label }: { name: string; issuer: string; label: string }) {
  return (
    <div style={{ borderBottom: "1px solid var(--rule)", padding: "16px 0", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16 }}>
      <div>
        <div className="v3-display" style={{ fontSize: "clamp(18px, 2.2vw, 30px)", lineHeight: 1.1 }}>
          {name}
        </div>
        {issuer && (
          <div className="v3-mono" style={{ fontSize: 10, color: "var(--mute)", letterSpacing: "0.14em", textTransform: "uppercase", marginTop: 4 }}>
            {issuer}
          </div>
        )}
      </div>
      <div className="v3-mono" style={{ fontSize: 11, color: "var(--mute)", letterSpacing: "0.12em", flexShrink: 0 }}>
        {label}
      </div>
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
        <div className="v3-mono" style={{ fontSize: 12, textTransform: "uppercase", letterSpacing: "0.16em", color: "var(--mute)", marginBottom: 32 }}>
          (04) Certs
        </div>
        {CERTS.map(c => <CertRow key={c.name} {...c} />)}
      </div>

      <div>
        <div className="v3-mono" style={{ fontSize: 12, textTransform: "uppercase", letterSpacing: "0.16em", color: "var(--mute)", marginBottom: 32 }}>
          (05) Achievements
        </div>
        {ACHIEVEMENTS.map(a => <CertRow key={a.name} {...a} />)}
      </div>
    </section>
  );
}
