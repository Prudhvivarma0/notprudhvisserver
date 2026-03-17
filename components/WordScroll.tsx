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
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const items = sectionRef.current?.querySelectorAll("li");
    if (!items) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const el = entry.target as HTMLElement;
          el.style.opacity = entry.isIntersecting ? "1" : "0.15";
        });
      },
      { threshold: 0.5, rootMargin: "-40% 0px -40% 0px" }
    );

    items.forEach((item) => {
      (item as HTMLElement).style.opacity = "0.15";
      (item as HTMLElement).style.transition = "opacity 0.3s ease";
      observer.observe(item);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef}>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          padding: "0 clamp(16px, 5vw, 48px)",
        }}
      >
        <h2
          style={{
            position: "sticky",
            top: "calc(50vh - 0.6em)",
            height: "fit-content",
            margin: 0,
            fontFamily: "var(--font-syne), sans-serif",
            fontSize: "clamp(2rem, 5vw, 4.5rem)",
            fontWeight: 700,
            color: "var(--text)",
            whiteSpace: "nowrap",
          }}
        >
          I build&nbsp;
        </h2>
        <ul
          style={{
            listStyle: "none",
            margin: 0,
            paddingBlock: "calc(50vh - 0.6em)",
            paddingLeft: 0,
            fontFamily: "var(--font-syne), sans-serif",
            fontSize: "clamp(2rem, 5vw, 4.5rem)",
            fontWeight: 700,
          }}
        >
          {WORDS.map((word, i) => (
            <li
              key={i}
              style={{
                color: i === WORDS.length - 1 ? "var(--accent)" : "var(--text)",
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
