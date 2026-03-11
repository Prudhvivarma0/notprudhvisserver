"use client";

import { useState, useEffect } from "react";

const CERTS = [
  "BTL1 Level 1",
  "ISC2 CC",
  "SOC Analyst",
  "Intro to Splunk",
  "Splunk SOAR",
  "Security Ops (Splunk)",
  "Art of Investigation",
];

interface CTF {
  rank:  string;
  title: string;
  event: string;
  date:  string;
}

const CTFS: CTF[] = [
  {
    rank:  "🏆 1st",
    title: "Place Qualifier",
    event: "Zayed University × Exploiters CTF",
    date:  "Feb 2025",
  },
  {
    rank:  "🥉 3rd",
    title: "Place Winner",
    event: "REDTEAM Cyber Hack CTF",
    date:  "Feb 2025",
  },
];

// ── Terminal Certs ─────────────────────────────────────────────────────────────

function TerminalCerts() {
  const [visibleCount, setVisibleCount] = useState(0);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    // Stagger each cert line with 120ms delay
    const timers: ReturnType<typeof setTimeout>[] = [];
    CERTS.forEach((_, i) => {
      timers.push(setTimeout(() => setVisibleCount(i + 1), 300 + i * 120));
    });
    return () => timers.forEach(clearTimeout);
  }, [mounted]);

  return (
    <div
      className="reveal rounded-lg overflow-hidden"
      style={{
        background:  "#0a0c10",
        border:      "1px solid rgba(0,255,180,0.15)",
        boxShadow:   "0 0 40px rgba(0,255,180,0.04), inset 0 0 80px rgba(0,0,0,0.4)",
        position:    "relative",
        maxWidth:    "640px",
      }}
    >
      {/* Scanline overlay */}
      <div
        style={{
          position:        "absolute",
          inset:           0,
          backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.07) 2px, rgba(0,0,0,0.07) 4px)",
          pointerEvents:   "none",
          zIndex:          1,
        }}
      />

      {/* Title bar */}
      <div
        style={{
          display:         "flex",
          alignItems:      "center",
          gap:             "6px",
          padding:         "10px 14px",
          borderBottom:    "1px solid rgba(0,255,180,0.08)",
          background:      "rgba(0,0,0,0.3)",
          position:        "relative",
          zIndex:          2,
        }}
      >
        <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#ff5f57", display: "inline-block" }} />
        <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#febc2e", display: "inline-block" }} />
        <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#28c840", display: "inline-block" }} />
        <span
          className="font-mono"
          style={{ fontSize: 11, color: "rgba(0,255,180,0.5)", marginLeft: 10 }}
        >
          prudhvi@cloud:~/certs
        </span>
      </div>

      {/* Terminal body */}
      <div style={{ padding: "16px 20px 20px", position: "relative", zIndex: 2 }}>
        <p
          className="font-mono mb-4"
          style={{ fontSize: 11, color: "rgba(0,255,180,0.35)" }}
        >
          $ ls -la ./certifications/
        </p>

        <div className="space-y-1">
          {CERTS.map((cert, i) => (
            <div
              key={cert}
              onMouseEnter={() => setHoveredIndex(i)}
              onMouseLeave={() => setHoveredIndex(null)}
              style={{
                display:         "flex",
                alignItems:      "center",
                justifyContent:  "space-between",
                padding:         "4px 8px",
                borderRadius:    "4px",
                background:      hoveredIndex === i ? "rgba(0,255,180,0.06)" : "transparent",
                opacity:         mounted && i < visibleCount ? 1 : 0,
                transform:       mounted && i < visibleCount ? "translateX(0)" : "translateX(-8px)",
                transition:      "opacity 0.3s ease, transform 0.3s ease, background 0.15s",
                cursor:          "default",
              }}
            >
              <span className="font-mono" style={{ fontSize: 12, color: "rgba(0,255,180,0.5)" }}>
                &gt;&nbsp;
                <span style={{ color: hoveredIndex === i ? "#e8ecf4" : "rgba(200,220,255,0.65)" }}>
                  {cert}
                </span>
              </span>
              <span
                className="font-mono"
                style={{
                  fontSize:    10,
                  color:       "#00ffb4",
                  opacity:     mounted && i < visibleCount ? 1 : 0,
                  transition:  "opacity 0.2s ease",
                  transitionDelay: `${i * 120 + 200}ms`,
                  letterSpacing: "0.05em",
                }}
              >
                [VERIFIED]
              </span>
            </div>
          ))}
        </div>

        <p
          className="font-mono mt-5"
          style={{
            fontSize:     11,
            color:        "rgba(0,255,180,0.35)",
            opacity:      mounted && visibleCount >= CERTS.length ? 1 : 0,
            transition:   "opacity 0.4s ease",
            transitionDelay: `${CERTS.length * 120 + 400}ms`,
          }}
        >
          $ echo &quot;total: {CERTS.length} active certifications&quot;
          <br />
          <span style={{ color: "rgba(200,220,255,0.4)" }}>
            total: {CERTS.length} active certifications
          </span>
        </p>
      </div>
    </div>
  );
}

// ── CTFCard ───────────────────────────────────────────────────────────────────

function CTFCard({ ctf }: { ctf: CTF }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      className="reveal-stagger"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position:             "relative",
        padding:              "1.5rem",
        borderRadius:         "0.5rem",
        overflow:             "hidden",
        background:           "var(--bg-card)",
        backdropFilter:       "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        border:               `1px solid ${hovered ? "var(--accent)" : "var(--muted)"}`,
        transform:            hovered ? "translateY(-4px)" : "translateY(0)",
        boxShadow:            hovered
          ? "0 0 24px color-mix(in srgb, var(--accent) 12%, transparent)"
          : "none",
        transition: "border-color 0.2s, transform 0.25s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.2s",
      }}
    >
      {/* Top edge glow */}
      <div
        style={{
          position:   "absolute",
          top: 0, left: 0,
          height:     "2px",
          background: "var(--accent)",
          width:      hovered ? "100%" : "0%",
          transition: "width 0.3s ease",
        }}
      />

      <p
        className="font-display font-bold mb-1"
        style={{ fontSize: "clamp(18px, 2vw, 22px)", color: "var(--text)" }}
      >
        {ctf.rank} {ctf.title}
      </p>
      <p
        className="font-mono mb-2"
        style={{ fontSize: "clamp(11px, 1.1vw, 12px)", color: "var(--accent)", opacity: 0.8 }}
      >
        {ctf.event}
      </p>
      <p
        className="font-mono"
        style={{ fontSize: 11, color: "var(--muted)", opacity: 0.5 }}
      >
        {ctf.date}
      </p>
    </div>
  );
}

// ── Achievements ──────────────────────────────────────────────────────────────

export function Achievements() {
  return (
    <section id="achievements" className="py-[clamp(60px,8vw,120px)] px-6">
      <div className="max-w-5xl mx-auto">

        {/* Certifications */}
        <div className="mb-20">
          <p className="font-mono text-sm mb-6" style={{ color: "var(--muted)" }}>
            // 04 ——— Certifications
          </p>

          <h2
            className="font-display font-bold mb-10 reveal"
            style={{ fontSize: "clamp(24px, 4vw, 36px)", color: "var(--text)" }}
          >
            Certifications
          </h2>

          <TerminalCerts />
        </div>

        {/* CTF Achievements */}
        <div>
          <p className="font-mono text-sm mb-6" style={{ color: "var(--muted)" }}>
            // 05 ——— Achievements
          </p>

          <h2
            className="font-display font-bold mb-10 reveal"
            style={{ fontSize: "clamp(24px, 4vw, 36px)", color: "var(--text)" }}
          >
            Achievements
          </h2>

          <div
            style={{
              display:             "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 240px), 1fr))",
              gap:                 "2px",
            }}
          >
            {CTFS.map(ctf => (
              <CTFCard key={ctf.event} ctf={ctf} />
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
