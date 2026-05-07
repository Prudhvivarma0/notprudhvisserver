"use client";

import type { HeroData } from "@/lib/db";

const DEFAULT: HeroData = {
  id: 1,
  name: "PRUDHVI VARMA",
  tagline: "RUNNING ON CAFFEINE & SHELL SCRIPTS",
  typing_words: "OFFENSIVE MINDSET // DEFENSIVE STRATEGY",
  cta1_text: "INITIALIZE_PORTFOLIO.EXE",
  cta1_link: "#projects",
  cta2_text: "[DOWNLOAD_RESUME.PDF]",
  cta2_link: "/Prudhvi_Resume.pdf",
};

function scrollTo(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  const y = el.getBoundingClientRect().top + window.scrollY - 80;
  window.scrollTo({ top: y, behavior: "auto" });
}

export function Hero({ heroData }: { heroData: HeroData | null }) {
  const data = heroData ?? DEFAULT;

  return (
    <section style={{
      minHeight: "100vh", display: "flex", flexDirection: "column",
      justifyContent: "center", alignItems: "center", textAlign: "center",
      padding: "calc(var(--nav-height) + 40px) 20px 40px",
      position: "relative",
    }}>
      <div className="ambient-glow" />

      <div className="glitch-wrapper">
        <div
          className="glitch"
          data-text={data.name}
          style={{ fontSize: "clamp(2.8rem, 8vw, 6rem)" }}
        >
          {data.name}
        </div>
      </div>

      <p style={{
        marginTop: "1.5rem", maxWidth: "860px", lineHeight: 1.9,
        color: "var(--text-secondary)", fontSize: "clamp(1rem, 2vw, 1.2rem)",
        opacity: 0, animation: "fadeIn 2s forwards 0.5s",
      }}>
        // SYSTEM STATUS:{" "}
        <strong style={{ color: "var(--accent-color)" }}>{data.tagline}</strong>
        <br />
        // MISSION:{" "}
        <strong style={{ color: "var(--accent-color)" }}>{data.typing_words}</strong>
        <br />
        // CURRENT LOCATION: DUBAI
      </p>

      <div style={{
        marginTop: "3rem", display: "flex", gap: "20px", flexWrap: "wrap",
        justifyContent: "center",
        opacity: 0, animation: "fadeIn 2s forwards 1s",
      }}>
        <button className="btn-glitch" onClick={() => scrollTo("projects")}>
          {data.cta1_text}
        </button>
        <a href={data.cta2_link} download className="btn-secondary">
          {data.cta2_text}
        </a>
      </div>
    </section>
  );
}
