"use client";

import { useState } from "react";

interface Project {
  title:       string;
  description: string;
  tags:        string[];
  href?:       string;
}

const PROJECTS: Project[] = [
  {
    title:       "Art Dubai 2026 Digital",
    description: "Coordinating with external developers and internal stakeholders on digital products. Managing feature viability assessments, cost analysis, bug tracking, platform updates, and security reviews for a premier international art fair.",
    tags:        ["Digital Strategy", "CMS", "Production"],
  },
  {
    title:       "WiFiGuard (Thesis)",
    description: "Intrusion Detection System for Cyber-Physical Systems using Wi-Fi CSI and Deep Learning (Variational Autoencoders). Improved threat detection accuracy by 30%.",
    tags:        ["Python", "Deep Learning", "IDS"],
    href:        "https://github.com/Prudhvivarma0/WiFiGuard",
  },
  {
    title:       "AWS Threat Monitoring",
    description: "Cloud surveillance system using CloudTrail, EventBridge, and SNS. Automated detection of root user anomalies for compliance and incident response.",
    tags:        ["AWS", "CloudTrail", "SNS"],
    href:        "https://github.com/Prudhvivarma0/AWS-Cloud-monitoring",
  },
  {
    title:       "Firewall & Encryption System",
    description: "Rule-based firewall with IP access control and public-key encryption based on super-increasing sequences to secure data transmission.",
    tags:        ["Crypto", "Firewall", "Python"],
    href:        "https://github.com/Prudhvivarma0/Public-Key-Encryption-and-Firewall-Management-System",
  },
  {
    title:       "Vigenere Cipher Tool",
    description: "Cryptographic tool to verify key lengths using Kasiski Examination and Index of Coincidence to automate decryption processes.",
    tags:        ["Cryptography", "Analysis"],
    href:        "https://github.com/Prudhvivarma0/Vigenere-Cipher-Key-Length-Verification-Tool",
  },
  {
    title:       "Enterprise Threat Simulations",
    description: "Vulnerability research and threat analysis for AIG, ANZ, Mastercard, and Telstra. Mitigated Zero-Day Log4j exploits and conducted enterprise-grade risk assessments.",
    tags:        ["Pentest", "Log4j", "Enterprise"],
    href:        "https://github.com/Prudhvivarma0?tab=repositories",
  },
];

// ── Tag ───────────────────────────────────────────────────────────────────────

function Tag({ label }: { label: string }) {
  const [hovered, setHovered] = useState(false);
  return (
    <span
      className="font-mono rounded"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        fontSize:    10,
        padding:     "2px 7px",
        border:      `1px solid ${hovered ? "var(--accent)" : "var(--muted)"}`,
        color:       hovered ? "var(--accent)" : "var(--muted)",
        transform:   hovered ? "translateY(-2px)" : "translateY(0)",
        display:     "inline-block",
        transition:  "border-color 0.15s, color 0.15s, transform 0.15s",
        cursor:      "default",
      }}
    >
      {label}
    </span>
  );
}

// ── Card ──────────────────────────────────────────────────────────────────────

function ProjectCard({ project, index }: { project: Project; index: number }) {
  const [hovered, setHovered] = useState(false);
  const num = String(index + 1).padStart(2, "0");

  const sharedStyle: React.CSSProperties = {
    position:             "relative",
    display:              "flex",
    flexDirection:        "column",
    padding:              "1.5rem",
    borderRadius:         "0.5rem",
    overflow:             "hidden",
    background:           "var(--bg-card)",
    backdropFilter:       "blur(12px)",
    WebkitBackdropFilter: "blur(12px)",
    border:               `1px solid ${hovered ? "var(--accent)" : "var(--muted)"}`,
    transform:            hovered ? "translateY(-4px)" : "translateY(0)",
    transition:           "border-color 0.2s, transform 0.25s cubic-bezier(0.34,1.56,0.64,1)",
    textDecoration:       "none",
    color:                "inherit",
  };

  const handlers = {
    onMouseEnter: () => setHovered(true),
    onMouseLeave: () => setHovered(false),
  };

  const inner = (
    <>
      {/* Top accent line — slides in from left */}
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

      {/* External link badge — fades in top-right for linked projects */}
      {project.href && (
        <div
          style={{
            position:   "absolute",
            top:        "0.75rem",
            right:      "0.75rem",
            opacity:    hovered ? 1 : 0,
            transform:  hovered ? "translate(0, 0)" : "translate(4px, -4px)",
            transition: "opacity 0.2s, transform 0.2s",
            color:      "var(--accent)",
            fontSize:   13,
            lineHeight: 1,
          }}
        >
          ↗
        </div>
      )}

      {/* Index */}
      <p
        className="font-mono mb-3"
        style={{
          fontSize:   11,
          color:      "var(--accent)",
          opacity:    hovered ? 0.7 : 0.3,
          transition: "opacity 0.2s",
        }}
      >
        {num}
      </p>

      {/* Title */}
      <h3
        className="font-display font-bold leading-snug mb-3"
        style={{
          fontSize:   "clamp(14px, 1.4vw, 16px)",
          color:      "var(--text)",
          opacity:    hovered ? 1 : 0.85,
          transition: "opacity 0.2s",
        }}
      >
        {project.title}
      </h3>

      {/* Description */}
      <p
        className="leading-relaxed flex-1 mb-5"
        style={{
          fontSize:   "clamp(12px, 1.1vw, 13px)",
          color:      "var(--muted)",
          lineHeight: 1.75,
          opacity:    hovered ? 1 : 0.75,
          transition: "opacity 0.2s",
        }}
      >
        {project.description}
      </p>

      {/* Tags */}
      <div className="flex flex-wrap gap-1.5">
        {project.tags.map(tag => (
          <Tag key={tag} label={tag} />
        ))}
      </div>
    </>
  );

  if (project.href) {
    return (
      <a
        href={project.href}
        target="_blank"
        rel="noopener noreferrer"
        style={sharedStyle}
        {...handlers}
      >
        {inner}
      </a>
    );
  }

  return (
    <div style={sharedStyle} {...handlers}>
      {inner}
    </div>
  );
}

// ── Projects ──────────────────────────────────────────────────────────────────

export function Projects() {
  return (
    <section id="projects" className="py-[clamp(60px,8vw,120px)] px-6">
      <div className="max-w-5xl mx-auto">

        <p className="font-mono text-sm mb-6" style={{ color: "var(--muted)" }}>
          // 02 ——— Projects
        </p>

        <h2
          className="font-display font-bold mb-12"
          style={{ fontSize: "clamp(24px, 4vw, 36px)", color: "var(--text)" }}
        >
          Projects
        </h2>

        <div
          style={{
            display:             "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 300px), 1fr))",
            gap:                 "2px",
          }}
        >
          {PROJECTS.map((project, i) => (
            <ProjectCard key={project.title} project={project} index={i} />
          ))}
        </div>

      </div>
    </section>
  );
}
