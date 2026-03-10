"use client";

import { useState } from "react";

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

// ── CertTag ───────────────────────────────────────────────────────────────────

function CertTag({ label }: { label: string }) {
  const [hovered, setHovered] = useState(false);
  return (
    <span
      className="reveal-stagger font-mono"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display:              "inline-block",
        padding:              "6px 14px",
        borderRadius:         "0.5rem",
        fontSize:             "clamp(11px, 1vw, 12px)",
        border:               `1px solid ${hovered ? "var(--accent)" : "var(--muted)"}`,
        color:                hovered ? "var(--accent)" : "var(--muted)",
        background:           "var(--bg-card)",
        backdropFilter:       "blur(10px)",
        WebkitBackdropFilter: "blur(10px)",
        transform:            hovered ? "translateY(-3px)" : "translateY(0)",
        boxShadow:            hovered
          ? "0 0 18px color-mix(in srgb, var(--accent) 15%, transparent)"
          : "none",
        transition: "border-color 0.2s, color 0.2s, transform 0.2s, box-shadow 0.2s",
        cursor:     "default",
      }}
    >
      {label}
    </span>
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
        <div className="max-w-[700px] mb-20">
          <p className="font-mono text-sm mb-6" style={{ color: "var(--muted)" }}>
            // 04 ——— Certifications
          </p>

          <h2
            className="font-display font-bold mb-10 reveal"
            style={{ fontSize: "clamp(24px, 4vw, 36px)", color: "var(--text)" }}
          >
            Certifications
          </h2>

          <div className="flex flex-wrap gap-2.5">
            {CERTS.map(cert => (
              <CertTag key={cert} label={cert} />
            ))}
          </div>
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
