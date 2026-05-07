import Image from "next/image";

export function About() {
  return (
    <section
      id="about"
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
          style={{
            width: 380, height: 480,
            background: "#f3f3f3",
            border: "1px solid var(--rule)",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <Image
            src="/portrait.jpg"
            alt="Prudhvi Varma"
            fill
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
          <span>Plate I</span>
          <span>2026</span>
        </div>
      </div>

      {/* Right: bio */}
      <div>
        <h2
          className="v3-display"
          style={{ fontSize: "clamp(56px, 7vw, 120px)", margin: "0 0 48px", lineHeight: 1.15 }}
        >
          <div style={{ marginBottom: "0.18em" }}>Architect.</div>
          <div style={{ marginBottom: "0.18em" }}>Developer.</div>
          <div>Entrepreneur?</div>
        </h2>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 48 }}>
          <p style={{ fontSize: 18, lineHeight: 1.5, margin: 0 }}>
            I&rsquo;ve shipped systems for cloud, biometrics, payment-rails and
            ed-tech — sometimes as the architect, sometimes as the engineer, almost
            always as both.
          </p>
          <p style={{ fontSize: 18, lineHeight: 1.5, margin: 0 }}>
            I take quiet pleasure in finding the load-bearing wall of a problem and
            removing everything else around it. Most of my work is the work of
            removal.
          </p>
        </div>
      </div>
    </section>
  );
}
