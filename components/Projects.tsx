"use client";

import { Shield, Cloud, Lock, Key, AlertTriangle } from "lucide-react";
import { BentoCard, BentoGrid } from "@/components/ui/bento-grid";

// ── Background: WiFiGuard — concentric Wi-Fi arcs from bottom-left ────────────

const WifiBackground = (
  <div className="absolute inset-0 overflow-hidden">
    <svg
      viewBox="0 0 260 260"
      preserveAspectRatio="xMinYMax meet"
      style={{ position: "absolute", bottom: -8, left: -8, width: "72%", pointerEvents: "none" }}
    >
      {([55, 95, 135, 175, 215] as const).map((r, i) => (
        <path
          key={r}
          d={`M 0 ${260 - r} A ${r} ${r} 0 0 1 ${r} 260`}
          fill="none"
          stroke="var(--accent)"
          strokeWidth={1.2}
          style={{
            animation:      `bento-pulse 3.2s ease-in-out ${i * 0.55}s infinite`,
            transformOrigin: "0 260px",
          }}
        />
      ))}
      <circle cx="2" cy="258" r="3.5" fill="var(--accent)"
        style={{ animation: "bento-pulse 3.2s ease-in-out infinite" }} />
    </svg>
    {/* Fade card text area */}
    <div style={{
      position: "absolute", inset: 0,
      background: "linear-gradient(to bottom, transparent 25%, var(--bg-card) 80%)",
      pointerEvents: "none",
    }} />
  </div>
);

// ── Background: AWS Threat Monitoring — cloud nodes + blinking data points ────

const AwsBackground = (
  <div className="absolute inset-0 overflow-hidden">
    <svg
      viewBox="0 0 320 180"
      preserveAspectRatio="xMidYMid meet"
      style={{ position: "absolute", top: 0, right: 0, width: "90%", opacity: 0.55, pointerEvents: "none" }}
    >
      {/* Connection lines */}
      {(
        [
          [160, 40, 80,  100],
          [160, 40, 240, 90],
          [80,  100, 50, 150],
          [80,  100, 130, 145],
          [240, 90,  270, 145],
          [240, 90,  200, 148],
        ] as [number,number,number,number][]
      ).map(([x1,y1,x2,y2], i) => (
        <line key={i} x1={x1} y1={y1} x2={x2} y2={y2}
          stroke="var(--accent)" strokeWidth={0.8} opacity={0.3}
          strokeDasharray="3 4"
        />
      ))}
      {/* Cloud blob (simplified as overlapping ellipses) */}
      <g style={{ animation: "bento-drift 5s ease-in-out infinite" }}>
        <ellipse cx="160" cy="40" rx="30" ry="16" fill="none"
          stroke="var(--accent)" strokeWidth={1} opacity={0.45} />
        <ellipse cx="148" cy="44" rx="18" ry="12" fill="none"
          stroke="var(--accent)" strokeWidth={0.8} opacity={0.3} />
        <ellipse cx="172" cy="44" rx="18" ry="11" fill="none"
          stroke="var(--accent)" strokeWidth={0.8} opacity={0.3} />
      </g>
      {/* Nodes with individual blink */}
      {(
        [
          [80,  100, 0],
          [240, 90,  0.6],
          [50,  150, 1.1],
          [130, 145, 1.7],
          [270, 145, 0.3],
          [200, 148, 2.0],
        ] as [number,number,number][]
      ).map(([cx,cy,delay], i) => (
        <circle key={i} cx={cx} cy={cy} r={4.5}
          fill="var(--accent)"
          style={{ animation: `bento-blink 2.8s ease-in-out ${delay}s infinite` }}
        />
      ))}
    </svg>
    <div style={{
      position: "absolute", inset: 0,
      background: "linear-gradient(to bottom, transparent 30%, var(--bg-card) 75%)",
      pointerEvents: "none",
    }} />
  </div>
);

// ── Background: Firewall & Encryption — digital brick/grid barrier ────────────

const FirewallBackground = (
  <div className="absolute inset-0 overflow-hidden">
    {/* Grid lines */}
    <div style={{
      position:        "absolute",
      inset:           0,
      backgroundImage: [
        "repeating-linear-gradient(0deg,  color-mix(in srgb, var(--accent) 12%, transparent) 0px, transparent 1px, transparent 18px)",
        "repeating-linear-gradient(90deg, color-mix(in srgb, var(--accent) 12%, transparent) 0px, transparent 1px, transparent 18px)",
      ].join(","),
      maskImage:       "linear-gradient(to bottom, black 0%, transparent 65%)",
      WebkitMaskImage: "linear-gradient(to bottom, black 0%, transparent 65%)",
      animation:       "bento-pulse 4s ease-in-out infinite",
      pointerEvents:   "none",
    }} />
    {/* Brick offset rows — every other row shifted */}
    <div style={{
      position:        "absolute",
      inset:           0,
      backgroundImage: [
        "repeating-linear-gradient(0deg,  transparent 0px, transparent 17px, color-mix(in srgb, var(--accent) 7%, transparent) 17px, color-mix(in srgb, var(--accent) 7%, transparent) 18px, transparent 18px, transparent 36px)",
        "repeating-linear-gradient(90deg, transparent 0px, transparent 35px, color-mix(in srgb, var(--accent) 14%, transparent) 35px, color-mix(in srgb, var(--accent) 14%, transparent) 36px)",
      ].join(","),
      backgroundPositionY: "9px",
      maskImage:       "linear-gradient(to bottom, black 0%, transparent 60%)",
      WebkitMaskImage: "linear-gradient(to bottom, black 0%, transparent 60%)",
      pointerEvents:   "none",
    }} />
    <div style={{
      position: "absolute", inset: 0,
      background: "linear-gradient(to bottom, transparent 35%, var(--bg-card) 80%)",
      pointerEvents: "none",
    }} />
  </div>
);

// ── Background: Vigenere Cipher — matrix of shifting characters ───────────────

const ALPHA = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
// 48 deterministic chars that look like a cipher matrix
const MATRIX_CHARS = Array.from({ length: 48 }, (_, i) => ALPHA[(i * 7 + i * i * 3) % 26]);
// Accent-highlighted positions
const ACCENT_POS   = new Set([0, 5, 11, 17, 22, 29, 35, 41, 46]);

const VigenereBackground = (
  <div className="absolute inset-0 overflow-hidden" style={{ padding: "14px 18px" }}>
    <div style={{
      display:             "grid",
      gridTemplateColumns: "repeat(8, 1fr)",
      gap:                 "6px 8px",
      pointerEvents:       "none",
    }}>
      {MATRIX_CHARS.map((char, i) => (
        <span
          key={i}
          className="font-mono"
          style={{
            fontSize:         10,
            color:            ACCENT_POS.has(i) ? "var(--accent)" : "var(--text)",
            animation:        `bento-char-fade ${2 + (i % 4) * 0.6}s ease-in-out ${(i * 0.09) % 1.8}s infinite`,
            display:          "block",
            textAlign:        "center",
          }}
        >
          {char}
        </span>
      ))}
    </div>
    <div style={{
      position:        "absolute",
      inset:           0,
      background:      "linear-gradient(to bottom, transparent 20%, var(--bg-card) 75%)",
      pointerEvents:   "none",
    }} />
  </div>
);

// ── Background: Enterprise Threat Sims — network topology graph ───────────────

const NetworkBackground = (
  <div className="absolute inset-0 overflow-hidden">
    <svg
      viewBox="0 0 300 200"
      preserveAspectRatio="xMidYMid meet"
      style={{ position: "absolute", top: 0, right: 0, width: "100%", opacity: 0.5, pointerEvents: "none" }}
    >
      {/* Edges */}
      {(
        [
          [150, 35,  75,  90],
          [150, 35,  225, 85],
          [150, 35,  150, 105],
          [75,  90,  30,  145],
          [75,  90,  115, 148],
          [225, 85,  255, 140],
          [225, 85,  190, 150],
          [150, 105, 115, 148],
          [150, 105, 190, 150],
          [30,  145, 80,  170],
          [255, 140, 210, 168],
        ] as [number,number,number,number][]
      ).map(([x1,y1,x2,y2], i) => (
        <line key={i} x1={x1} y1={y1} x2={x2} y2={y2}
          stroke="var(--accent)" strokeWidth={0.7} opacity={0.25}
        />
      ))}
      {/* Hub node */}
      <circle cx="150" cy="35" r="6" fill="var(--accent)"
        style={{ animation: "bento-pulse 2.5s ease-in-out infinite" }} />
      {/* Mid nodes */}
      {([[75,90],[225,85],[150,105]] as [number,number][]).map(([cx,cy],i) => (
        <circle key={i} cx={cx} cy={cy} r={4.5} fill="var(--accent)"
          style={{ animation: `bento-pulse 2.5s ease-in-out ${0.4 + i*0.3}s infinite` }} />
      ))}
      {/* Leaf nodes */}
      {([[30,145],[115,148],[255,140],[190,150],[80,170],[210,168]] as [number,number][]).map(([cx,cy],i) => (
        <circle key={i} cx={cx} cy={cy} r={3} fill="var(--accent)"
          style={{ animation: `bento-blink 3s ease-in-out ${i * 0.45}s infinite` }} />
      ))}
    </svg>
    <div style={{
      position: "absolute", inset: 0,
      background: "linear-gradient(to bottom, transparent 30%, var(--bg-card) 78%)",
      pointerEvents: "none",
    }} />
  </div>
);

// ── Projects data ─────────────────────────────────────────────────────────────

const projects = [
  {
    name:        "WiFiGuard (Thesis)",
    description: "Built an Intrusion Detection System for Cyber-Physical Systems that uses Wi-Fi Channel State Information as a sensing layer. Implemented Variational Autoencoders to model normal network behavior and detect anomalies in real-time. The system improved threat detection accuracy by 30% compared to traditional signature-based methods, without requiring any additional hardware.",
    Icon:        Shield,
    cta:         "View on GitHub",
    href:        "https://github.com/Prudhvivarma0/WiFiGuard",
    className:   "lg:col-start-1 lg:col-end-2 lg:row-start-1 lg:row-end-3",
    background:  WifiBackground,
  },
  {
    name:        "AWS Threat Monitoring",
    description: "Designed and deployed a cloud surveillance architecture on AWS using CloudTrail for API logging, EventBridge for real-time event routing, and SNS for instant alert delivery. Built automated detection rules for root user activity anomalies, unauthorized API calls, and compliance violations.",
    Icon:        Cloud,
    cta:         "View on GitHub",
    href:        "https://github.com/Prudhvivarma0/AWS-Cloud-monitoring",
    className:   "lg:col-start-2 lg:col-end-3 lg:row-start-1 lg:row-end-2",
    background:  AwsBackground,
  },
  {
    name:        "Firewall & Encryption",
    description: "Engineered a dual-layer security system combining a rule-based firewall with granular IP access control lists and a public-key encryption module built on super-increasing sequences. The firewall supports dynamic rule updates and logging, while the encryption system handles key generation, message encryption, and decryption with mathematical verification.",
    Icon:        Lock,
    cta:         "View on GitHub",
    href:        "https://github.com/Prudhvivarma0/Public-Key-Encryption-and-Firewall-Management-System",
    className:   "lg:col-start-2 lg:col-end-3 lg:row-start-2 lg:row-end-3",
    background:  FirewallBackground,
  },
  {
    name:        "Vigenere Cipher Tool",
    description: "Developed a cryptographic analysis tool that automates breaking Vigenere cipher encryptions. Implements Kasiski Examination to identify probable key lengths through repeated pattern analysis, and uses Index of Coincidence for statistical verification. Outputs ranked key length candidates with confidence scores.",
    Icon:        Key,
    cta:         "View on GitHub",
    href:        "https://github.com/Prudhvivarma0/Vigenere-Cipher-Key-Length-Verification-Tool",
    className:   "lg:col-start-3 lg:col-end-4 lg:row-start-1 lg:row-end-2",
    background:  VigenereBackground,
  },
  {
    name:        "Enterprise Threat Sims",
    description: "Performed advanced vulnerability research and threat analysis through enterprise job simulations for AIG, ANZ, Mastercard, and Telstra. Identified and mitigated Zero-Day Log4j exploits, conducted penetration testing against enterprise infrastructure, and delivered risk assessment reports with remediation strategies covering the full spectrum from reconnaissance to post-exploitation analysis.",
    Icon:        AlertTriangle,
    cta:         "View on GitHub",
    href:        "https://github.com/Prudhvivarma0?tab=repositories",
    className:   "lg:col-start-3 lg:col-end-4 lg:row-start-2 lg:row-end-3",
    background:  NetworkBackground,
  },
];

export function Projects() {
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
          {projects.map((p) => (
            <BentoCard key={p.name} {...p} />
          ))}
        </BentoGrid>

      </div>
    </section>
  );
}
