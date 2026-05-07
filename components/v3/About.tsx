import Image from "next/image";
import { DEFAULT_CONTENT, SiteContent } from "@/lib/content";

interface Props {
  about?: SiteContent["about"];
  portrait?: string;
}

export function About({ about = DEFAULT_CONTENT.about, portrait = "" }: Props) {
  const portraitSrc = portrait && portrait.length > 0 ? portrait : "/portrait.jpg";
  return (
    <section
      id="about"
      className="v3-about-grid"
      style={{
        padding: "120px 32px",
        display: "grid",
        gridTemplateColumns: "380px 1fr",
        gap: 64,
        alignItems: "start",
        borderTop: "1px solid var(--rule)",
      }}
    >
      {/* Left: portrait */}
      <div>
        <div
          className="v3-mono"
          style={{
            fontSize: 12, textTransform: "uppercase", letterSpacing: "0.16em",
            color: "var(--mute)", marginBottom: 24,
          }}
        >
          (01) About
        </div>

        {/* Portrait slot — 380×480, light gray fallback */}
        <div
          className="v3-portrait-box"
          style={{
            width: 380, height: 480,
            background: "#f3f3f3",
            border: "1px solid var(--rule)",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <Image
            src={portraitSrc}
            alt="Prudhvi Varma"
            fill
            unoptimized={portraitSrc.startsWith("data:")}
            style={{ objectFit: "cover" }}
            onError={() => {/* shows gray bg fallback */}}
          />
        </div>

        <div
          className="v3-mono"
          style={{
            fontSize: 11, textTransform: "uppercase", letterSpacing: "0.14em",
            color: "var(--mute)", marginTop: 16,
            display: "flex", justifyContent: "space-between",
          }}
        >
          <span>{about.portraitCaption}</span>
          <span>{about.portraitYear}</span>
        </div>
      </div>

      {/* Right: bio */}
      <div>
        <h2
          className="v3-display"
          style={{ fontSize: "clamp(56px, 7vw, 120px)", margin: "0 0 48px", lineHeight: 1.15 }}
        >
          <div style={{ marginBottom: "0.18em" }}>{about.heading1}</div>
          <div style={{ marginBottom: "0.18em" }}>{about.heading2}</div>
          <div>{about.heading3} <span style={{ fontSize: "0.22em", verticalAlign: "middle", color: "var(--mute)", letterSpacing: "0.04em" }}>(Pending world record verification.)</span></div>
        </h2>

        <div className="v3-bio-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 48 }}>
          <p style={{ fontSize: 18, lineHeight: 1.5, margin: 0 }}>
            {about.bio1}
          </p>
          <p style={{ fontSize: 18, lineHeight: 1.5, margin: 0 }}>
            {about.bio2}
          </p>
        </div>
      </div>
    </section>
  );
}
