"use client";

import { useEffect, useRef } from "react";

// ── Data ───────────────────────────────────────────────────────────────────

const WORDS = [
  "secure systems.",
  "cloud infrastructure.",
  "event platforms.",
  "web applications.",
  "automation pipelines.",
  "edge networks.",
  "threat detection tools.",
  "developer tooling.",
  "resilient architectures.",
  "things that break (on purpose).",
] as const;

// ── Component ──────────────────────────────────────────────────────────────

export function WordScroll() {
  const listRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const list = listRef.current;
    if (!list) return;

    const items = Array.from(list.querySelectorAll<HTMLElement>("li"));
    if (!items.length) return;

    const update = () => {
      const vpCenter = window.innerHeight / 2;
      for (const item of items) {
        const rect    = item.getBoundingClientRect();
        const center  = rect.top + rect.height / 2;
        const dist    = Math.abs(center - vpCenter);
        const range   = window.innerHeight * 0.38;
        const t       = Math.max(0, 1 - dist / range);
        const opacity = 0.18 + t * t * 0.82;
        const ty      = (1 - t) * 10;
        item.style.opacity   = opacity.toFixed(3);
        item.style.transform = `translateY(${ty.toFixed(1)}px)`;
      }
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update, { passive: true });
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  return (
    <section
      aria-label="I build"
      style={{ position: "relative", zIndex: 1, overflowX: "hidden" }}
    >
      {/* Top spacer — lets the first word scroll into center */}
      <div style={{ height: "50vh" }} />

      <div
        style={{
          maxWidth:       "900px",
          margin:         "0 auto",
          padding:        "0 1.5rem",
          display:        "flex",
          justifyContent: "flex-start",
          alignItems:     "flex-start",
          gap:            "clamp(0.75rem, 2vw, 2rem)",
        }}
      >
        {/* "I build" — sticky, stays at viewport center while words scroll */}
        <div
          aria-hidden
          style={{
            position:   "sticky",
            top:        "45vh",
            alignSelf:  "flex-start",
            flexShrink: 0,
            fontSize:   "clamp(1.8rem, 4.5vw, 4rem)",
            fontFamily: "var(--font-syne), sans-serif",
            fontWeight: 800,
            lineHeight: 1.1,
            color:      "var(--text)",
            whiteSpace: "nowrap",
          }}
        >
          I build
        </div>

        {/* Scrolling word list — padding-block keeps first/last centerable */}
        <ul
          ref={listRef}
          style={{
            listStyle:    "none",
            padding:      0,
            margin:       0,
            paddingBlock: "45vh",
            display:      "flex",
            flexDirection: "column",
          }}
        >
          {WORDS.map((word, i) => {
            const isLast = i === WORDS.length - 1;
            return (
              <li
                key={word}
                style={{
                  fontSize:   "clamp(1.8rem, 4.5vw, 4rem)",
                  fontFamily: "var(--font-syne), sans-serif",
                  fontWeight: 800,
                  lineHeight: 1.4,
                  color:      isLast ? "var(--accent)" : "var(--text)",
                  opacity:    0.18,
                  transform:  "translateY(10px)",
                  transition: "opacity 0.15s ease, transform 0.15s ease",
                  willChange: "opacity, transform",
                }}
              >
                {word}
              </li>
            );
          })}
        </ul>
      </div>

      {/* Bottom spacer */}
      <div style={{ height: "50vh" }} />
    </section>
  );
}
