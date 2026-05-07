import { DEFAULT_CONTENT, SiteContent } from "@/lib/content";

interface Props {
  certifications?: SiteContent["certifications"];
  achievements?:   SiteContent["achievements"];
}

function CertRow({ name, issuer, label }: { name: string; issuer?: string; label: string }) {
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

export function CertsAchievements({
  certifications = DEFAULT_CONTENT.certifications,
  achievements   = DEFAULT_CONTENT.achievements,
}: Props) {
  return (
    <section
      className="v3-certs-grid"
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
        {certifications.map(c => <CertRow key={c.name} name={c.name} issuer={c.issuer} label={c.label} />)}
      </div>

      <div>
        <div className="v3-mono" style={{ fontSize: 12, textTransform: "uppercase", letterSpacing: "0.16em", color: "var(--mute)", marginBottom: 32 }}>
          (05) Achievements
        </div>
        {achievements.map(a => <CertRow key={a.name} name={a.name} label={a.label} />)}
      </div>
    </section>
  );
}
