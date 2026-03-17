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
    <section
      ref={sectionRef}
      style={{ position: "relative" }}
    >
      {/* Outer div constrains the sticky element — sticky releases when parent scrolls out */}
      <div className="max-w-5xl mx-auto px-6" style={{ display: "flex" }}>
        <h2
          style={{
            position: "sticky",
            top: "10vh",
            height: "fit-content",
            margin: 0,
            fontFamily: "var(--font-syne), sans-serif",
            fontSize: "clamp(2rem, 5vw, 4.5rem)",
            fontWeight: 700,
            color: "var(--text)",
            whiteSpace: "nowrap",
            flexShrink: 0,
          }}
        >
          I build&nbsp;
        </h2>
        <ul
          style={{
            listStyle: "none",
            margin: 0,
            paddingTop: "10vh",
            paddingBottom: "0",
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
                color: (i === WORDS.length - 1 || i % 2 === 1) ? "var(--accent)" : "var(--text)",
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
