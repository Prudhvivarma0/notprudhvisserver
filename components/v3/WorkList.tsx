"use client";

import { useState } from "react";
import { DEFAULT_CONTENT, SiteContent } from "@/lib/content";

interface Props {
  projects?: SiteContent["projects"];
}

export function WorkList({ projects = DEFAULT_CONTENT.projects }: Props) {
  const [hover, setHover] = useState<number | null>(null);

  return (
    <section id="work" className="v3-pad" style={{ padding: "120px 32px", borderTop: "1px solid var(--rule)" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 16 }}>
        <div className="v3-mono" style={{ fontSize: 12, textTransform: "uppercase", letterSpacing: "0.16em", color: "var(--mute)" }}>
          (02) Selected work · {projects.length}
        </div>
        <div className="v3-mono" style={{ fontSize: 12, textTransform: "uppercase", letterSpacing: "0.16em", color: "var(--mute)" }}>
          Hover ↗
        </div>
      </div>
      <p className="v3-mono" style={{ fontSize: 12, color: "var(--mute)", letterSpacing: "0.08em", marginBottom: 48, opacity: 0.6 }}>
        things i built instead of sleeping.
      </p>

      {/* Project rows */}
      <div>
        {projects.map((p, i) => (
          <a
            key={p.n}
            href={p.link ?? "#"}
            target={p.link ? "_blank" : undefined}
            rel="noopener noreferrer"
            style={{ textDecoration: "none", color: "inherit", display: "block" }}
            className="v3-row"
            onMouseEnter={() => setHover(i)}
            onMouseLeave={() => setHover(null)}
          >
            <div className="v3-row-bg" />
            <div className="v3-mono v3-row-num" style={{ fontSize: 13, color: "var(--mute)" }}>{p.n}</div>
            <div>
              <div className="v3-display" style={{ fontSize: "clamp(28px, 4vw, 64px)" }}>{p.title}</div>
              <div className="v3-mono" style={{ fontSize: 11, color: "var(--mute)", letterSpacing: "0.06em", marginTop: 6, maxWidth: 560 }}>{p.desc}</div>
            </div>
            <div className="v3-mono v3-row-meta" style={{ fontSize: 12, textTransform: "uppercase", letterSpacing: "0.12em", color: "var(--mute)" }}>
              {p.meta}<br />{p.year}
            </div>
            <div className="v3-arrow v3-display" style={{ fontSize: 32 }}>→</div>
          </a>
        ))}
      </div>
    </section>
  );
}
