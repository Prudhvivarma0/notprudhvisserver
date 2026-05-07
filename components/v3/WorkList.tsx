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
  {
    n: "01", title: "Stock Signal Bot", year: "2026", meta: "ai · automation",
    desc: "7-agent AI stock research engine with 24/7 portfolio monitoring and real-time Telegram alerts.",
    link: "https://github.com/Prudhvivarma0/stock-signal-bot",
  },
  {
    n: "02", title: "AWS Threat Monitoring", year: "2025", meta: "cloud · security",
    desc: "Cloud-wide architecture across VPCs, GuardDuty and EBS — under-budget by 40%.",
    link: "https://github.com/Prudhvivarma0/AWS-Cloud-monitoring",
  },
  {
    n: "03", title: "Web App Penetration Test", year: "2025", meta: "red-team · owasp",
    desc: "Comprehensive pen tests on DVWA targeting CSRF, XSS, SQLi and Brute Force using Kali Linux and Burp Suite.",
    link: "https://github.com/Prudhvivarma0?tab=repositories",
  },
  {
    n: "04", title: "US Accidents Dashboard", year: "2025", meta: "data viz · d3.js",
    desc: "Interactive dashboard visualising multi-year US traffic data — choropleth maps, heatmaps, drill-down filters.",
    link: "https://github.com/Prudhvivarma0/F20DVCW2",
  },
  {
    n: "05", title: "WiFiGuard", year: "2024", meta: "thesis · cyber-physical",
    desc: "Defensive layer against deauth and rogue-AP attacks using Wi-Fi CSI and Variational Autoencoders.",
    link: "https://github.com/Prudhvivarma0/WiMANS",
  },
  {
    n: "06", title: "Brainwave", year: "2024", meta: "full-stack · real-time",
    desc: "Collaborative brainstorming platform with Socket.io messaging, shared whiteboard, and virtual exhibits.",
    link: "https://github.com/Prudhvivarma0/brain-wave",
  },
  {
    n: "07", title: "Firewall & Encryption", year: "2024", meta: "network · crypto",
    desc: "Rule-based firewall with IP access control paired with a public-key encryption system using super-increasing sequences.",
    link: "https://github.com/Prudhvivarma0/Public-Key-Encryption-and-Firewall-Management-System",
  },
  {
    n: "08", title: "Enterprise Threat Sims", year: "2024", meta: "red-team",
    desc: "Library of attack scenarios stress-testing enterprise blue-team posture for AIG, ANZ, Mastercard and Telstra.",
    link: "https://github.com/Prudhvivarma0?tab=repositories",
  },
];

export function WorkList({ projects = DEFAULT_PROJECTS }: { projects?: Project[] }) {
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
            <div className="v3-display" style={{ fontSize: "clamp(28px, 4vw, 64px)" }}>{p.title}</div>
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
