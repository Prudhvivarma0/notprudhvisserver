import { DEFAULT_CONTENT, SiteContent } from "@/lib/content";

interface Props {
  experience?: SiteContent["experience"];
}

export function TimelineGrid({ experience = DEFAULT_CONTENT.experience }: Props) {
  return (
    <section id="timeline" className="v3-pad" style={{ padding: "120px 32px", borderTop: "1px solid var(--rule)" }}>
      <div
        className="v3-mono"
        style={{
          fontSize: 12, textTransform: "uppercase",
          letterSpacing: "0.16em", color: "var(--mute)", marginBottom: 60,
        }}
      >
        (03) Experience
      </div>

      <div className="v3-timeline-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 32 }}>
        {experience.map(({ dateRange, org, role }, i) => (
          <div key={i} style={{ borderTop: "1px solid var(--ink)", paddingTop: 24 }}>
            <div
              className="v3-mono"
              style={{
                fontSize: 11, textTransform: "uppercase",
                letterSpacing: "0.16em", color: "var(--mute)", marginBottom: 16,
              }}
            >
              {dateRange}
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
