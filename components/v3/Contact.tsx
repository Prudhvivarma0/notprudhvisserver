"use client";

import { Flex }     from "./Flex";
import { Magnetic } from "./Magnetic";

interface Props { reduced: boolean; }

export function Contact({ reduced }: Props) {
  return (
    <section
      id="contact"
      style={{
        padding: "160px 32px 80px",
        borderTop: "1px solid var(--rule)",
      }}
    >
      <div
        className="v3-mono"
        style={{
          fontSize: 12, textTransform: "uppercase",
          letterSpacing: "0.16em", color: "var(--mute)", marginBottom: 24,
        }}
      >
        (06) Let&rsquo;s talk
      </div>

      <h2
        className="v3-display"
        style={{ fontSize: "clamp(120px, 22vw, 360px)", margin: "0 0 60px", lineHeight: 0.85 }}
      >
        <div><Flex text="SAY" /></div>
        <div><Flex text="HELLO." /></div>
      </h2>

      <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
        <Magnetic strength={0.3} reduced={reduced}>
          <a href="mailto:prudhvivarma31@gmail.com" className="v3-mag-btn v3-mag-btn-filled">
            prudhvivarma31@gmail.com →
          </a>
        </Magnetic>
        <Magnetic strength={0.3} reduced={reduced}>
          <a href="https://github.com/Prudhvivarma0" target="_blank" rel="noopener noreferrer" className="v3-mag-btn">
            github
          </a>
        </Magnetic>
        <Magnetic strength={0.3} reduced={reduced}>
          <a href="https://www.linkedin.com/in/prudhvivarma11/" target="_blank" rel="noopener noreferrer" className="v3-mag-btn">
            linkedin
          </a>
        </Magnetic>
        <Magnetic strength={0.3} reduced={reduced}>
          <a href="https://www.linkedin.com/in/prudhvivarma11/" target="_blank" rel="noopener noreferrer" className="v3-mag-btn">
            x / twitter
          </a>
        </Magnetic>
      </div>

      {/* Footer row */}
      <div
        className="v3-mono"
        style={{
          marginTop: 120, paddingTop: 32,
          borderTop: "1px solid var(--rule)",
          display: "flex", justifyContent: "space-between",
          fontSize: 11, textTransform: "uppercase",
          letterSpacing: "0.16em", color: "var(--mute)",
        }}
      >
        <span>© Prudhvi Varma 2026</span>
        <span>Built in Hyderabad</span>
        <span>Last touched · today</span>
      </div>
    </section>
  );
}
