"use client";

import { LiveGlobe } from "./LiveGlobe";
import { Flex }      from "./Flex";
import { Magnetic }  from "./Magnetic";
import { DEFAULT_CONTENT, SiteContent } from "@/lib/content";

interface Props {
  dark:    boolean;
  reduced: boolean;
  hero?:   SiteContent["hero"];
  onWorkClick:    () => void;
  onContactClick: () => void;
}

export function Hero({ dark, reduced, hero = DEFAULT_CONTENT.hero, onWorkClick, onContactClick }: Props) {
  return (
    <section
      className="v3-pad"
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
        }}
      >
        <span>{hero.meta}</span>
        <span>Yeah, built with Claude ✦</span>
      </div>

      {/* Headline + Globe */}
      <div
        className="v3-hero-grid"
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
          <div style={{ marginBottom: "0.08em" }}>
            <Flex text={hero.headline1} />
          </div>
          <div>
            <Flex text={hero.headline2} />.
          </div>
        </div>

        <div className="v3-hero-globe" style={{ width: "min(46vw, 560px)", aspectRatio: "1/1" }}>
          <LiveGlobe size={520} dark={dark} reduced={reduced} />
        </div>
      </div>

      {/* Tagline + CTAs */}
      <div
        className="v3-hero-bottom"
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 64,
          alignItems: "end",
        }}
      >
        <p style={{ fontSize: 22, lineHeight: 1.3, margin: 0, maxWidth: 480 }}>
          {hero.intro}
        </p>
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 16, flexWrap: "wrap" }}>
          <Magnetic strength={0.4} reduced={reduced}>
            <button onClick={onWorkClick} className="v3-mag-btn">
              {hero.ctaWork}
            </button>
          </Magnetic>
          <Magnetic strength={0.4} reduced={reduced}>
            <button onClick={onContactClick} className="v3-mag-btn v3-mag-btn-filled">
              {hero.ctaContact}
            </button>
          </Magnetic>
        </div>
      </div>
    </section>
  );
}
