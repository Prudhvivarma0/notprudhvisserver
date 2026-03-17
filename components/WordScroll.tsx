"use client";

import { useEffect, useRef } from "react";
import type { WordRow } from "@/lib/db";

const DEFAULT_WORDS: { word: string; color_type: string }[] = [
  { word: "secure systems.",              color_type: "text"   },
  { word: "cloud infrastructure.",        color_type: "accent" },
  { word: "event platforms.",             color_type: "text"   },
  { word: "web applications.",            color_type: "accent" },
  { word: "automation pipelines.",        color_type: "text"   },
  { word: "edge networks.",               color_type: "accent" },
  { word: "threat detection tools.",      color_type: "text"   },
  { word: "developer tooling.",           color_type: "accent" },
  { word: "resilient architectures.",     color_type: "text"   },
  { word: "things that break (on purpose).", color_type: "accent" },
];

export function WordScroll({ words }: { words?: WordRow[] }) {
  const items = words && words.length > 0 ? words : DEFAULT_WORDS;
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
          {items.map((item, i) => (
            <li
              key={i}
              style={{
                color: item.color_type === "accent" ? "var(--accent)" : "var(--text)",
              }}
            >
              {item.word}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
