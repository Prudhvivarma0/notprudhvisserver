"use client";

import { Globe, Shield, Cloud, Lock, Key, AlertTriangle } from "lucide-react";
import { BentoCard, BentoGrid } from "@/components/ui/bento-grid";

const projects = [
  {
    name:        "Art Dubai 2026 Digital",
    description: "Coordinating with external developers and internal stakeholders on digital products. Managing feature viability assessments, cost analysis, bug tracking, platform updates, and security reviews.",
    Icon:        Globe,
    cta:         "Learn more",
    href:        "#",
    className:   "lg:row-start-1 lg:row-end-3 lg:col-start-1 lg:col-end-2",
    background:  (
      <div className="absolute inset-0 opacity-[0.07]"
        style={{ background: "radial-gradient(ellipse at 30% 20%, var(--accent), transparent 65%)" }} />
    ),
  },
  {
    name:        "WiFiGuard (Thesis)",
    description: "IDS for Cyber-Physical Systems using Wi-Fi CSI and Variational Autoencoders. Improved threat detection by 30%.",
    Icon:        Shield,
    cta:         "View on GitHub",
    href:        "https://github.com/Prudhvivarma0/WiFiGuard",
    className:   "lg:col-start-2 lg:col-end-3 lg:row-start-1 lg:row-end-2",
    background:  (
      <div className="absolute inset-0 opacity-[0.07]"
        style={{ background: "radial-gradient(ellipse at 70% 30%, var(--accent), transparent 65%)" }} />
    ),
  },
  {
    name:        "AWS Threat Monitoring",
    description: "Cloud surveillance with CloudTrail, EventBridge, SNS. Automated root user anomaly detection.",
    Icon:        Cloud,
    cta:         "View on GitHub",
    href:        "https://github.com/Prudhvivarma0/AWS-Cloud-monitoring",
    className:   "lg:col-start-2 lg:col-end-3 lg:row-start-2 lg:row-end-3",
    background:  (
      <div className="absolute inset-0 opacity-[0.07]"
        style={{ background: "radial-gradient(ellipse at 50% 80%, var(--accent), transparent 65%)" }} />
    ),
  },
  {
    name:        "Firewall & Encryption",
    description: "Rule-based firewall with IP access control and public-key encryption using super-increasing sequences.",
    Icon:        Lock,
    cta:         "View on GitHub",
    href:        "https://github.com/Prudhvivarma0/Public-Key-Encryption-and-Firewall-Management-System",
    className:   "lg:col-start-3 lg:col-end-4 lg:row-start-1 lg:row-end-2",
    background:  (
      <div className="absolute inset-0 opacity-[0.07]"
        style={{ background: "radial-gradient(ellipse at 20% 70%, var(--accent), transparent 65%)" }} />
    ),
  },
  {
    name:        "Vigenere Cipher Tool",
    description: "Cryptographic tool using Kasiski Examination and Index of Coincidence to automate decryption.",
    Icon:        Key,
    cta:         "View on GitHub",
    href:        "https://github.com/Prudhvivarma0/Vigenere-Cipher-Key-Length-Verification-Tool",
    className:   "lg:col-start-3 lg:col-end-4 lg:row-start-2 lg:row-end-4",
    background:  (
      <div className="absolute inset-0 opacity-[0.07]"
        style={{ background: "radial-gradient(ellipse at 80% 20%, var(--accent), transparent 65%)" }} />
    ),
  },
  {
    name:        "Enterprise Threat Sims",
    description: "Vuln research for AIG, ANZ, Mastercard, Telstra. Mitigated Zero-Day Log4j exploits.",
    Icon:        AlertTriangle,
    cta:         "View on GitHub",
    href:        "https://github.com/Prudhvivarma0?tab=repositories",
    className:   "lg:col-start-1 lg:col-end-3 lg:row-start-3 lg:row-end-4",
    background:  (
      <div className="absolute inset-0 opacity-[0.07]"
        style={{ background: "radial-gradient(ellipse at 40% 60%, var(--accent), transparent 65%)" }} />
    ),
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

        <BentoGrid>
          {projects.map((p) => (
            <BentoCard key={p.name} {...p} />
          ))}
        </BentoGrid>

      </div>
    </section>
  );
}
