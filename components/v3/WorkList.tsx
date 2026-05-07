"use client";

import { useState } from "react";

interface Project {
  n: string;
  title: string;
  year: string;
  meta: string;
  desc: string;
  link?: string;
}

const DEFAULT_PROJECTS: Project[] = [
  { n:"01", title:"AWS Threat Monitoring",  year:"2025", meta:"cloud · security",       desc:"Cloud-wide architecture across VPCs, GuardDuty and EBS — under-budget by 40%." },
  { n:"02", title:"Vigenere Cipher Tool",   year:"2025", meta:"cryptography",            desc:"Polyalphabetic cipher tool — teaches symmetric encryption through play." },
  { n:"03", title:"WiFiGuard",              year:"2024", meta:"thesis · cyber-physical", desc:"Defensive layer against deauth and rogue-AP attacks on consumer routers." },
  { n:"04", title:"Firewall & Encryption",  year:"2024", meta:"network",                 desc:"Tunnelling solution for modern consumer hardware with audit logs." },
  { n:"05", title:"Enterprise Threat Sims", year:"2024", meta:"red-team",                desc:"Library of attack scenarios stress-testing enterprise blue-team posture." },
];

export function WorkList({ projects = DEFAULT_PROJECTS }: { projects?: Project[] }) {
  const [hover, setHover] = useState<number | null>(null);

  return (
    <section id="work" style={{ padding: "120px 32px", borderTop: "1px solid var(--rule)" }}>
      {/* Header */}
      <div
        style={{
          display: "flex", justifyContent: "space-between",
          alignItems: "baseline", marginBottom: 60,
        }}
      >
        <div
          className="v3-mono"
          style={{ fontSize: 12, textTransform: "uppercase", letterSpacing: "0.16em", color: "var(--mute)" }}
        >
          (02) Selected work · {projects.length}
        </div>
        <div
          className="v3-mono"
          style={{ fontSize: 12, textTransform: "uppercase", letterSpacing: "0.16em", color: "var(--mute)" }}
        >
          Hover ↗
        </div>
      </div>

      {/* Project rows */}
      <div>
        {projects.map((p, i) => (
          <div
            key={p.n}
            className="v3-row"
            onMouseEnter={() => setHover(i)}
            onMouseLeave={() => setHover(null)}
          >
            <div className="v3-row-bg" />

            <div className="v3-mono" style={{ fontSize: 13, color: "var(--mute)" }}>{p.n}</div>

            <div className="v3-display" style={{ fontSize: "clamp(36px, 5vw, 80px)" }}>
              {p.title}
            </div>

            <div
              className="v3-mono"
              style={{
                fontSize: 12, textTransform: "uppercase",
                letterSpacing: "0.12em", color: "var(--mute)",
              }}
            >
              {p.meta}<br />{p.year}
            </div>

            <div className="v3-arrow v3-display" style={{ fontSize: 32 }}>→</div>
          </div>
        ))}
      </div>
    </section>
  );
}
