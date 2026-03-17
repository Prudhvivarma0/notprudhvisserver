"use client";

import { useEffect, useRef } from "react";

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
];

const FONT_SIZE   = "clamp(2rem, 5vw, 4.5rem)";
const FONT_FAMILY = "var(--font-syne), sans-serif";
const FONT_WEIGHT = 700;
const LINE_HEIGHT = 1.25;

export function WordScroll() {
  const listRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const items = listRef.current?.querySelectorAll("li");
    if (!items) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const el = entry.target as HTMLElement;
          if (entry.isIntersecting) {
            el.style.opacity = "1";
            el.style.filter  = "brightness(1.2)";
          } else {
            el.style.opacity = "0.15";
            el.style.filter  = "brightness(1)";
          }
        });
      },
      {
        threshold:  0.5,
        rootMargin: "-40% 0px -40% 0px",
      }
    );

    items.forEach((item) => observer.observe(item));
    return () => observer.disconnect();
  }, []);

  return (
    // overflow: hidden keeps the sticky h2 from bleeding into the next section
    <section style={{ position: "relative", overflow: "hidden" }}>
      <div
        style={{
          display:        "flex",
          justifyContent: "center",
          // minHeight gives enough room to scroll through all 10 words
          minHeight:      "300vh",
          position:       "relative",
          padding:        "0 clamp(16px, 5vw, 48px)",
        }}
      >
        {/* Sticky "I build" — top aligns it with the center word */}
        <h2
          style={{
            position:   "sticky",
            top:        "calc(50vh - 0.625em)",
            height:     "fit-content",
            alignSelf:  "flex-start",
            margin:     0,
            padding:    0,
            fontFamily: FONT_FAMILY,
            fontSize:   FONT_SIZE,
            fontWeight: FONT_WEIGHT,
            lineHeight: LINE_HEIGHT,
            color:      "var(--text)",
            whiteSpace: "nowrap",
          }}
        >
          {"I build\u00A0"}
        </h2>

        {/* Scrolling word list */}
        <ul
          ref={listRef}
          style={{
            listStyle:     "none",
            margin:        0,
            paddingTop:    "45vh",
            paddingBottom: "45vh",
            paddingLeft:   0,
            paddingRight:  0,
            fontFamily:    FONT_FAMILY,
            fontSize:      FONT_SIZE,
            fontWeight:    FONT_WEIGHT,
            lineHeight:    LINE_HEIGHT,
          }}
        >
          {WORDS.map((word, i) => (
            <li
              key={i}
              style={{
                margin:        0,
                padding:       "0 0 0.2em 0",
                color:         i === WORDS.length - 1 ? "var(--accent)" : "var(--text)",
                opacity:       i === 0 ? 1 : 0.15,
                transition:    "opacity 0.4s ease, filter 0.4s ease",
              }}
            >
              {word}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
