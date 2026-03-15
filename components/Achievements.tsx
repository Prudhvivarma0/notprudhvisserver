"use client";

import { useState } from "react";
import { motion } from "framer-motion";

// ── Cert data ─────────────────────────────────────────────────────────────────

const CERTS = [
  { icon: "🛡️", name: "BTL1 Level 1",                issuer: "Security Blue Team" },
  { icon: "🔐", name: "Certified in Cybersecurity",   issuer: "ISC2" },
  { icon: "🔍", name: "SOC Analyst",                  issuer: "Udemy" },
  { icon: "📊", name: "Intro to Splunk",              issuer: "Splunk" },
  { icon: "📊", name: "Splunk SOAR",                  issuer: "Splunk" },
  { icon: "📊", name: "Security Operations",          issuer: "Splunk" },
  { icon: "🕵️", name: "Art of Investigation",         issuer: "Splunk" },
];

// ── CTF data ──────────────────────────────────────────────────────────────────

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

// ── CertCard ──────────────────────────────────────────────────────────────────

function CertCard({ cert, index }: { cert: typeof CERTS[0]; index: number }) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.4, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position:             "relative",
        padding:              "20px",
        borderRadius:         "0.75rem",
        backdropFilter:       "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        background:           "var(--glass)",
        border:               `1px solid ${hovered ? "var(--accent)" : "var(--edge)"}`,
        transform:            hovered ? "translateY(-3px)" : "translateY(0)",
        boxShadow:            hovered
          ? "0 0 20px color-mix(in srgb, var(--accent) 10%, transparent)"
          : "none",
        transition:    "border-color 0.3s cubic-bezier(0.16,1,0.3,1), transform 0.3s cubic-bezier(0.16,1,0.3,1), box-shadow 0.3s cubic-bezier(0.16,1,0.3,1)",
        overflow:      "hidden",
        cursor:        "default",
      }}
    >
      {/* Top accent line — expands from center on hover */}
      <div style={{
        position:   "absolute",
        top:        0,
        left:       "50%",
        transform:  "translateX(-50%)",
        height:     "2px",
        background: "var(--accent)",
        width:      hovered ? "100%" : "0%",
        transition: "width 0.35s cubic-bezier(0.16,1,0.3,1)",
        borderRadius: "0 0 2px 2px",
      }} />

      {/* Icon */}
      <div style={{ fontSize: 22, marginBottom: 10, lineHeight: 1 }}>
        {cert.icon}
      </div>

      {/* Cert name */}
      <p
        className="font-mono font-bold"
        style={{
          fontSize:     "clamp(11px, 1vw, 12px)",
          color:        "var(--text)",
          lineHeight:   1.4,
          marginBottom: 6,
        }}
      >
        {cert.name}
      </p>

      {/* Issuer */}
      <p
        className="font-mono"
        style={{
          fontSize: "clamp(10px, 0.9vw, 11px)",
          color:    "var(--muted)",
          opacity:  0.8,
        }}
      >
        {cert.issuer}
      </p>
    </motion.div>
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
          <p className="font-mono text-sm mb-10" style={{ color: "var(--muted)" }}>
            // 04 ——— certifications
          </p>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {CERTS.map((cert, i) => (
              <CertCard key={cert.name} cert={cert} index={i} />
            ))}
          </div>
        </div>

        {/* CTF Achievements */}
        <div>
          <p className="font-mono text-sm mb-6" style={{ color: "var(--muted)" }}>
            // 05 ——— achievements
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
