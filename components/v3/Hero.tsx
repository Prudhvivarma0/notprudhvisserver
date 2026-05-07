"use client";

import { LiveGlobe } from "./LiveGlobe";
import { Flex }      from "./Flex";
import { Magnetic }  from "./Magnetic";

interface Props {
  dark:    boolean;
  reduced: boolean;
  onWorkClick:    () => void;
  onContactClick: () => void;
}

export function Hero({ dark, reduced, onWorkClick, onContactClick }: Props) {
  return (
    <section
      style={{
        padding: "120px 32px 80px",
        minHeight: "85vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        gap: 40,
      }}
    >
      {/* Meta row */}
      <div
        className="v3-mono"
        style={{
          fontSize: 12, textTransform: "uppercase", letterSpacing: "0.16em",
          color: "var(--mute)", display: "flex", justifyContent: "space-between",
          flexWrap: "wrap", gap: 8,
        }}
      >
        <span>(Portfolio / 2026)</span>
        <span>Hyderabad ↗ 17.385° N</span>
        <span>Move your cursor across the type ↓</span>
      </div>

      {/* Headline + Globe */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr auto",
          gap: 40,
          alignItems: "center",
        }}
      >
        <div
          className="v3-display"
          style={{ fontSize: "clamp(80px, 14vw, 240px)", lineHeight: 1.02 }}
        >
          <div style={{ marginBottom: "0.12em" }}>
            <Flex text="PRUDHVI" />
          </div>
          <div>
            <Flex text="VARMA" />.
          </div>
        </div>

        <div style={{ width: "min(46vw, 560px)", aspectRatio: "1/1" }}>
          <LiveGlobe size={520} dark={dark} reduced={reduced} />
        </div>
      </div>

      {/* Tagline + CTAs */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 64,
          alignItems: "end",
        }}
      >
        <p style={{ fontSize: 22, lineHeight: 1.3, margin: 0, maxWidth: 480 }}>
          Developer building <em>secure systems</em>, <em>edge networks</em>, and{" "}
          <em>things that break on purpose</em>. Sometimes the architect, sometimes
          the engineer, almost always both.
        </p>
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 16, flexWrap: "wrap" }}>
          <Magnetic strength={0.4} reduced={reduced}>
            <button onClick={onWorkClick} className="v3-mag-btn">
              Selected work →
            </button>
          </Magnetic>
          <Magnetic strength={0.4} reduced={reduced}>
            <button
              onClick={onContactClick}
              className="v3-mag-btn v3-mag-btn-filled"
            >
              Get in touch
            </button>
          </Magnetic>
        </div>
      </div>
    </section>
  );
}
