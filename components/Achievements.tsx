import type { CertRow, AchievementRow } from "@/lib/db";

const DEFAULT_CERTS: CertRow[] = [
  { id: 1, sort_order: 1, visible: 1, issuer: "", icon: "", name: "BTL1\nLevel 1" },
  { id: 2, sort_order: 2, visible: 1, issuer: "", icon: "", name: "ISC2 CC\nCertified" },
  { id: 3, sort_order: 3, visible: 1, issuer: "", icon: "", name: "SOC Analyst\nUdemy" },
  { id: 4, sort_order: 4, visible: 1, issuer: "", icon: "", name: "Intro to\nSplunk" },
  { id: 5, sort_order: 5, visible: 1, issuer: "", icon: "", name: "Splunk\nSOAR" },
  { id: 6, sort_order: 6, visible: 1, issuer: "", icon: "", name: "Security\nOps" },
  { id: 7, sort_order: 7, visible: 1, issuer: "", icon: "", name: "Art of\nInvestigation" },
];

const DEFAULT_ACHIEVEMENTS: AchievementRow[] = [
  { id: 1, sort_order: 1, visible: 1,
    icon: "🏆", title: "1st Place Qualifier", event: "Zayed University x Exploiters CTF", date: "FEB 2025" },
  { id: 2, sort_order: 2, visible: 1,
    icon: "🥉", title: "3rd Place Winner", event: "REDTEAM Cyber Hack CTF", date: "FEB 2025" },
];

export function Achievements({
  certs,
  achievements,
}: {
  certs?: CertRow[];
  achievements?: AchievementRow[];
}) {
  const certItems = certs && certs.length > 0 ? certs : DEFAULT_CERTS;
  const achItems  = achievements && achievements.length > 0 ? achievements : DEFAULT_ACHIEVEMENTS;

  return (
    <>
      {/* Certifications */}
      <section id="certifications">
        <h2 className="section-header">&lt; CERTIFICATIONS /&gt;</h2>
        <div className="hex-container">
          {certItems.map(c => (
            <div key={c.id} className="hex">
              <div className="hex-content">
                {c.name.split("\n").map((line, i) => (
                  <span key={i}>{line}{i < c.name.split("\n").length - 1 && <br />}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Achievements */}
      <section id="achievements">
        <h2 className="section-header">&lt; ACHIEVEMENTS /&gt;</h2>
        <div className="achievements-grid">
          {achItems.map(a => (
            <div key={a.id} className="achievement-card">
              <span className="trophy">{a.icon}</span>
              <h3>{a.title}</h3>
              <p>{a.event}</p>
              <span style={{ color: "var(--accent-color)", fontSize: "0.85rem", fontWeight: "bold", display: "block", marginTop: "8px" }}>
                {a.date}
              </span>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
