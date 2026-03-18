"use client";

import React from "react";
import { Shield, Cloud, Lock, Key, AlertTriangle, Globe, Terminal, Code2, Database, Server, Wifi, Monitor, Cpu, Zap, Eye, Box } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { BentoCard, BentoGrid } from "@/components/ui/bento-grid";
import type { ProjectRow } from "@/lib/db";

const ICON_MAP: Record<string, LucideIcon> = {
  Shield, Cloud, Lock, Key, AlertTriangle, Globe, Terminal, Code2,
  Database, Server, Wifi, Monitor, Cpu, Zap, Eye, Box,
};

// ── Backgrounds ───────────────────────────────────────────────────────────────

const WifiBackground = (
  <div className="absolute inset-0 opacity-[0.06]">
    <svg className="absolute bottom-0 left-0 w-64 h-64" viewBox="0 0 200 200">
      {[40, 70, 100, 130, 160].map((r, i) => (
        <circle key={i} cx="0" cy="200" r={r} fill="none" stroke="currentColor" strokeWidth="1.5"
          style={{ color: "var(--accent)" }} />
      ))}
    </svg>
    <div className="absolute inset-0" style={{ background: "linear-gradient(to top, var(--bg-card) 0%, transparent 65%)", pointerEvents: "none" }} />
  </div>
);

const AwsBackground = (
  <div className="absolute inset-0 opacity-[0.06]">
    <svg className="absolute -top-10 -right-10 w-48 h-48" viewBox="0 0 100 60">
      <ellipse cx="50" cy="35" rx="35" ry="20" fill="none" stroke="currentColor" strokeWidth="1"
        style={{ color: "var(--accent)" }} />
      <ellipse cx="35" cy="40" rx="20" ry="15" fill="none" stroke="currentColor" strokeWidth="1"
        style={{ color: "var(--accent)" }} />
      <ellipse cx="65" cy="40" rx="22" ry="16" fill="none" stroke="currentColor" strokeWidth="1"
        style={{ color: "var(--accent)" }} />
    </svg>
    <div className="absolute inset-0" style={{ background: "linear-gradient(to top, var(--bg-card) 0%, transparent 65%)", pointerEvents: "none" }} />
  </div>
);

const FirewallBackground = (
  <div
    className="absolute inset-0 opacity-[0.04]"
    style={{
      backgroundImage: [
        "repeating-linear-gradient(0deg,  var(--accent) 0px, var(--accent) 1px, transparent 1px, transparent 16px)",
        "repeating-linear-gradient(90deg, var(--accent) 0px, var(--accent) 1px, transparent 1px, transparent 16px)",
      ].join(", "),
    }}
  >
    <div className="absolute inset-0" style={{ background: "linear-gradient(to top, var(--bg-card) 0%, transparent 65%)", pointerEvents: "none" }} />
  </div>
);

const VigenereBackground = (
  <div className="absolute inset-0 overflow-hidden opacity-[0.05]">
    <div
      className="font-mono text-[10px] leading-tight p-4 select-none"
      style={{ color: "var(--accent)", wordBreak: "break-all" }}
    >
      {"ABCDEFGHIJKLMNOPQRSTUVWXYZ".repeat(30).split("").map((c, i) => (
        <span key={i} style={{ opacity: (i * 17 + 5) % 10 > 6 ? 1 : 0.3 }}>{c}</span>
      ))}
    </div>
    <div className="absolute inset-0" style={{ background: "linear-gradient(to top, var(--bg-card) 0%, transparent 65%)", pointerEvents: "none" }} />
  </div>
);

const NODES: [number, number][] = [[20,20],[50,10],[80,30],[70,60],[30,50],[50,80],[15,75]];

const NetworkBackground = (
  <div className="absolute inset-0 opacity-[0.06]">
    <svg className="absolute top-4 right-4 w-40 h-40" viewBox="0 0 100 100">
      {NODES.map(([x, y], i) => (
        <React.Fragment key={i}>
          <circle cx={x} cy={y} r="3" fill="currentColor" style={{ color: "var(--accent)" }} />
          {i > 0 && (
            <line
              x1={x} y1={y}
              x2={NODES[i - 1][0]} y2={NODES[i - 1][1]}
              stroke="currentColor" strokeWidth="0.5"
              style={{ color: "var(--accent)" }}
            />
          )}
        </React.Fragment>
      ))}
    </svg>
    <div className="absolute inset-0" style={{ background: "linear-gradient(to top, var(--bg-card) 0%, transparent 65%)", pointerEvents: "none" }} />
  </div>
);

// ── Bento grid class names cycle for D1-sourced projects ─────────────────────

const BENTO_CLASSES = [
  "lg:col-start-1 lg:col-end-2 lg:row-start-1 lg:row-end-3",
  "lg:col-start-2 lg:col-end-3 lg:row-start-1 lg:row-end-2",
  "lg:col-start-2 lg:col-end-3 lg:row-start-2 lg:row-end-3",
  "lg:col-start-3 lg:col-end-4 lg:row-start-1 lg:row-end-2",
  "lg:col-start-3 lg:col-end-4 lg:row-start-2 lg:row-end-3",
];

const BACKGROUNDS = [WifiBackground, AwsBackground, FirewallBackground, VigenereBackground, NetworkBackground];

// ── Hardcoded fallback data ───────────────────────────────────────────────────

const DEFAULT_PROJECTS: ProjectRow[] = [
  { id: 1, title: "WiFiGuard (Thesis)",     description: "Built an Intrusion Detection System for Cyber-Physical Systems that uses Wi-Fi Channel State Information as a sensing layer. Implemented Variational Autoencoders to model normal network behavior and detect anomalies in real-time. The system improved threat detection accuracy by 30% compared to traditional signature-based methods, without requiring any additional hardware.", icon_name: "Shield",        cta_text: "View on GitHub", link_url: "https://github.com/Prudhvivarma0/WiFiGuard",                                                        cover_image: "", sort_order: 1, visible: 1 },
  { id: 2, title: "AWS Threat Monitoring",  description: "Designed and deployed a cloud surveillance architecture on AWS using CloudTrail for API logging, EventBridge for real-time event routing, and SNS for instant alert delivery. Built automated detection rules for root user activity anomalies, unauthorized API calls, and compliance violations.",                                                                                      icon_name: "Cloud",         cta_text: "View on GitHub", link_url: "https://github.com/Prudhvivarma0/AWS-Cloud-monitoring",                                              cover_image: "", sort_order: 2, visible: 1 },
  { id: 3, title: "Firewall & Encryption",  description: "Engineered a dual-layer security system combining a rule-based firewall with granular IP access control lists and a public-key encryption module built on super-increasing sequences. The firewall supports dynamic rule updates and logging, while the encryption system handles key generation, message encryption, and decryption with mathematical verification.",       icon_name: "Lock",          cta_text: "View on GitHub", link_url: "https://github.com/Prudhvivarma0/Public-Key-Encryption-and-Firewall-Management-System",             cover_image: "", sort_order: 3, visible: 1 },
  { id: 4, title: "Vigenere Cipher Tool",   description: "Developed a cryptographic analysis tool that automates breaking Vigenere cipher encryptions. Implements Kasiski Examination to identify probable key lengths through repeated pattern analysis, and uses Index of Coincidence for statistical verification. Outputs ranked key length candidates with confidence scores.",                                                            icon_name: "Key",           cta_text: "View on GitHub", link_url: "https://github.com/Prudhvivarma0/Vigenere-Cipher-Key-Length-Verification-Tool",                    cover_image: "", sort_order: 4, visible: 1 },
  { id: 5, title: "Enterprise Threat Sims", description: "Performed advanced vulnerability research and threat analysis through enterprise job simulations for AIG, ANZ, Mastercard, and Telstra. Identified and mitigated Zero-Day Log4j exploits, conducted penetration testing against enterprise infrastructure, and delivered risk assessment reports with remediation strategies.",                                                  icon_name: "AlertTriangle", cta_text: "View on GitHub", link_url: "https://github.com/Prudhvivarma0?tab=repositories",                                                  cover_image: "", sort_order: 5, visible: 1 },
];

// ── Component ─────────────────────────────────────────────────────────────────

export function Projects({ projects }: { projects?: ProjectRow[] }) {
  const rows = projects && projects.length > 0 ? projects : DEFAULT_PROJECTS;

  const cards = rows.map((p, i) => ({
    name:       p.title,
    description: p.description,
    Icon:       ICON_MAP[p.icon_name] ?? Shield,
    cta:        p.cta_text,
    href:       p.link_url,
    className:  BENTO_CLASSES[i % BENTO_CLASSES.length],
    background: BACKGROUNDS[i % BACKGROUNDS.length],
  }));

  return (
    <section id="projects" className="py-[clamp(60px,8vw,120px)] px-6">
      <div className="max-w-5xl mx-auto">

        <p className="font-mono text-sm mb-6" style={{ color: "var(--muted)" }}>
          // 02 ——— Projects
        </p>

        <h2
          className="font-display font-bold mb-12 reveal"
          style={{ fontSize: "clamp(24px, 4vw, 36px)", color: "var(--text)" }}
        >
          Projects
        </h2>

        <BentoGrid className="auto-rows-[22rem]">
          {cards.map((p) => (
            <BentoCard key={p.name} {...p} />
          ))}
        </BentoGrid>

      </div>
    </section>
  );
}
