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
    <section style={{ width: "100%", padding: "0 clamp(16px, 5vw, 48px)" }}>
      <div style={{ display: "flex", justifyContent: "center", lineHeight: 1.25 }}>
        {/* Sticky "I build" */}
        <h2
          style={{
            position:     "sticky",
            top:          "45vh",
            height:       "fit-content",
            margin:       0,
            fontFamily:   "var(--font-syne), sans-serif",
            fontSize:     "clamp(2rem, 5vw, 4.5rem)",
            fontWeight:   700,
            color:        "var(--text)",
            whiteSpace:   "nowrap",
            paddingRight: "0.3em",
          }}
        >
          I build{"\u00A0"}
        </h2>

        {/* Scrolling word list */}
        <ul
          ref={listRef}
          style={{
            listStyle:  "none",
            margin:     0,
            padding:    "45vh 0",
            fontFamily: "var(--font-syne), sans-serif",
            fontSize:   "clamp(2rem, 5vw, 4.5rem)",
            fontWeight: 700,
          }}
        >
          {WORDS.map((word, i) => (
            <li
              key={i}
              style={{
                color:         i === WORDS.length - 1 ? "var(--accent)" : "var(--text)",
                opacity:       i === 0 ? 1 : 0.15,
                transition:    "opacity 0.4s ease, filter 0.4s ease",
                paddingBottom: "0.3em",
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
