"use client";

import { useState } from "react";
import { MagneticButton } from "@/components/MagneticButton";
import type { ContactRow } from "@/lib/db";

interface Link {
  label: string;
  href:  string;
  icon:  string;
}

const DEFAULT_LINKS: Link[] = [
  { label: "Email",    href: "mailto:prudhvivarma31@gmail.com",                   icon: "→" },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/prudhvivarma11/",        icon: "↗" },
  { label: "GitHub",   href: "https://github.com/Prudhvivarma0?tab=repositories", icon: "↗" },
];

function rowToLink(row: ContactRow): Link {
  return { label: row.label, href: row.href, icon: row.href.startsWith("mailto") ? "→" : "↗" };
}

function ContactLink({ link }: { link: Link }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div className="reveal-stagger">
    <MagneticButton>
      <a
        href={link.href}
        target={link.href.startsWith("mailto") ? undefined : "_blank"}
        rel="noopener noreferrer"
        className="font-mono"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          display:              "inline-flex",
          alignItems:           "center",
          gap:                  "0.5rem",
          padding:              "0.75rem 1.5rem",
          borderRadius:         "0.5rem",
          fontSize:             "clamp(12px, 1.2vw, 14px)",
          border:               `1px solid ${hovered
            ? "var(--accent)"
            : "color-mix(in srgb, var(--accent) 20%, transparent)"}`,
          color:                hovered ? "var(--accent)" : "var(--muted)",
          background:           "var(--bg-card)",
          backdropFilter:       "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          transform:            hovered ? "translateY(-3px)" : "translateY(0)",
          boxShadow:            hovered
            ? "0 0 20px color-mix(in srgb, var(--accent) 10%, transparent)"
            : "none",
          textDecoration: "none",
          transition:     "border-color 0.2s, color 0.2s, transform 0.2s, box-shadow 0.2s",
        }}
      >
        <span>{link.label}</span>
        <span style={{ opacity: 0.6 }}>{link.icon}</span>
      </a>
    </MagneticButton>
    </div>
  );
}

export function Contact({ links }: { links?: ContactRow[] }) {
  const displayLinks = links && links.length > 0 ? links.map(rowToLink) : DEFAULT_LINKS;

  return (
    <section id="contact" className="py-[clamp(60px,8vw,120px)] px-6">
      <div className="max-w-5xl mx-auto">

        <p className="font-mono text-sm mb-6" style={{ color: "var(--muted)" }}>
          // 06 ——— Get in Touch
        </p>

        <h2
          className="font-display font-bold leading-tight mb-4 reveal"
          style={{ fontSize: "clamp(24px, 4vw, 36px)", color: "var(--text)" }}
        >
          Let&apos;s{" "}
          <span style={{ color: "var(--accent)" }}>connect.</span>
        </h2>

        <p
          className="font-mono mb-10 reveal"
          style={{ fontSize: "clamp(12px, 1.1vw, 13px)", color: "var(--muted)" }}
        >
          prudhvivarma31@gmail.com — Dubai, UAE
        </p>

        <div className="flex flex-wrap gap-3">
          {displayLinks.map(link => (
            <ContactLink key={link.label} link={link} />
          ))}
        </div>

      </div>
    </section>
  );
}
