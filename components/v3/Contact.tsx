"use client";

import { Flex }     from "./Flex";
import { Magnetic } from "./Magnetic";
import { DEFAULT_CONTENT, SiteContent } from "@/lib/content";

interface Props {
  reduced: boolean;
  contact?: SiteContent["contact"];
}

export function Contact({ reduced, contact = DEFAULT_CONTENT.contact }: Props) {
  return (
    <section
      id="contact"
      className="v3-pad"
      style={{
        padding: "160px 32px 80px",
        borderTop: "1px solid var(--rule)",
      }}
    >
      <div
        className="v3-mono"
        style={{
          fontSize: 12, textTransform: "uppercase",
          letterSpacing: "0.16em", color: "var(--mute)", marginBottom: 24,
        }}
      >
        (06) Let&rsquo;s talk
      </div>

      <h2
        className="v3-display v3-contact-heading"
        style={{ fontSize: "clamp(120px, 22vw, 360px)", margin: "0 0 60px", lineHeight: 0.85 }}
      >
        <div style={{ marginBottom: "0.18em" }}><Flex text="SAY" /></div>
        <div><Flex text="HELLO." /></div>
      </h2>

      <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
        <Magnetic strength={0.3} reduced={reduced}>
          <a href={`mailto:${contact.email}`} className="v3-mag-btn v3-mag-btn-filled">
            {contact.email} →
          </a>
        </Magnetic>
        <Magnetic strength={0.3} reduced={reduced}>
          <a href={contact.github} target="_blank" rel="noopener noreferrer" className="v3-mag-btn">
            github
          </a>
        </Magnetic>
        <Magnetic strength={0.3} reduced={reduced}>
          <a href={contact.linkedin} target="_blank" rel="noopener noreferrer" className="v3-mag-btn">
            linkedin
          </a>
        </Magnetic>
      </div>

      {/* Footer row */}
      <div
        className="v3-mono v3-footer"
        style={{
          marginTop: 120, paddingTop: 32,
          borderTop: "1px solid var(--rule)",
          display: "flex", justifyContent: "space-between",
          fontSize: 11, textTransform: "uppercase",
          letterSpacing: "0.16em", color: "var(--mute)",
        }}
      >
        <span>{contact.footerLeft}</span>
        <span>{contact.footerCenter}</span>
        <span>{contact.footerRight}</span>
      </div>

      {/* tiny confession */}
      <p
        className="v3-mono"
        style={{
          marginTop: 24,
          fontSize: 10,
          color: "var(--mute)",
          opacity: 0.45,
          textAlign: "center",
          letterSpacing: "0.12em",
        }}
      >
        {contact.confession}
      </p>
    </section>
  );
}
