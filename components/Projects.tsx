"use client";

import { Shield, Cloud, Lock, Key, AlertTriangle } from "lucide-react";
import { BentoCard, BentoGrid } from "@/components/ui/bento-grid";

const projects = [
  {
    name:        "WiFiGuard (Thesis)",
    description: "Built an Intrusion Detection System for Cyber-Physical Systems that uses Wi-Fi Channel State Information as a sensing layer. Implemented Variational Autoencoders to model normal network behavior and detect anomalies in real-time. The system improved threat detection accuracy by 30% compared to traditional signature-based methods, without requiring any additional hardware.",
    Icon:        Shield,
    cta:         "View on GitHub",
    href:        "https://github.com/Prudhvivarma0/WiFiGuard",
    className:   "lg:col-start-1 lg:col-end-2 lg:row-start-1 lg:row-end-3",
    background:  (
      <div className="absolute inset-0 opacity-[0.07]"
        style={{ background: "radial-gradient(ellipse at 30% 20%, var(--accent), transparent 65%)" }} />
    ),
  },
  {
    name:        "AWS Threat Monitoring",
    description: "Designed and deployed a cloud surveillance architecture on AWS using CloudTrail for API logging, EventBridge for real-time event routing, and SNS for instant alert delivery. Built automated detection rules for root user activity anomalies, unauthorized API calls, and compliance violations.",
    Icon:        Cloud,
    cta:         "View on GitHub",
    href:        "https://github.com/Prudhvivarma0/AWS-Cloud-monitoring",
    className:   "lg:col-start-2 lg:col-end-3 lg:row-start-1 lg:row-end-2",
    background:  (
      <div className="absolute inset-0 opacity-[0.07]"
        style={{ background: "radial-gradient(ellipse at 70% 30%, var(--accent), transparent 65%)" }} />
    ),
  },
  {
    name:        "Firewall & Encryption",
    description: "Engineered a dual-layer security system combining a rule-based firewall with granular IP access control lists and a public-key encryption module built on super-increasing sequences. The firewall supports dynamic rule updates and logging, while the encryption system handles key generation, message encryption, and decryption with mathematical verification.",
    Icon:        Lock,
    cta:         "View on GitHub",
    href:        "https://github.com/Prudhvivarma0/Public-Key-Encryption-and-Firewall-Management-System",
    className:   "lg:col-start-2 lg:col-end-3 lg:row-start-2 lg:row-end-3",
    background:  (
      <div className="absolute inset-0 opacity-[0.07]"
        style={{ background: "radial-gradient(ellipse at 50% 80%, var(--accent), transparent 65%)" }} />
    ),
  },
  {
    name:        "Vigenere Cipher Tool",
    description: "Developed a cryptographic analysis tool that automates breaking Vigenere cipher encryptions. Implements Kasiski Examination to identify probable key lengths through repeated pattern analysis, and uses Index of Coincidence for statistical verification. Outputs ranked key length candidates with confidence scores.",
    Icon:        Key,
    cta:         "View on GitHub",
    href:        "https://github.com/Prudhvivarma0/Vigenere-Cipher-Key-Length-Verification-Tool",
    className:   "lg:col-start-3 lg:col-end-4 lg:row-start-1 lg:row-end-2",
    background:  (
      <div className="absolute inset-0 opacity-[0.07]"
        style={{ background: "radial-gradient(ellipse at 20% 70%, var(--accent), transparent 65%)" }} />
    ),
  },
  {
    name:        "Enterprise Threat Sims",
    description: "Performed advanced vulnerability research and threat analysis through enterprise job simulations for AIG, ANZ, Mastercard, and Telstra. Identified and mitigated Zero-Day Log4j exploits, conducted penetration testing against enterprise infrastructure, and delivered risk assessment reports with remediation strategies covering the full spectrum from reconnaissance to post-exploitation analysis.",
    Icon:        AlertTriangle,
    cta:         "View on GitHub",
    href:        "https://github.com/Prudhvivarma0?tab=repositories",
    className:   "lg:col-start-3 lg:col-end-4 lg:row-start-2 lg:row-end-3",
    background:  (
      <div className="absolute inset-0 opacity-[0.07]"
        style={{ background: "radial-gradient(ellipse at 80% 20%, var(--accent), transparent 65%)" }} />
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

        <BentoGrid className="auto-rows-[22rem]">
          {projects.map((p) => (
            <BentoCard key={p.name} {...p} />
          ))}
        </BentoGrid>

      </div>
    </section>
  );
}
