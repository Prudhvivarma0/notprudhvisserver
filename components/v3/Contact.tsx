"use client";

import { useState } from "react";
import { Flex }     from "./Flex";
import { Magnetic } from "./Magnetic";
import { DEFAULT_CONTENT, SiteContent } from "@/lib/content";

interface Props {
  reduced: boolean;
  contact?: SiteContent["contact"];
}

export function Contact({ reduced, contact = DEFAULT_CONTENT.contact }: Props) {
  const [name,    setName]    = useState("");
  const [email,   setEmail]   = useState("");
  const [message, setMessage] = useState("");
  const [status,  setStatus]  = useState<"idle" | "sending" | "ok" | "err">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message }),
      });
      if (res.ok) {
        setStatus("ok");
        setName(""); setEmail(""); setMessage("");
      } else {
        setStatus("err");
      }
    } catch {
      setStatus("err");
    }
  };

  const inputStyle: React.CSSProperties = {
    display: "block",
    width: "100%",
    background: "transparent",
    border: "1px solid var(--rule)",
    color: "var(--ink)",
    fontFamily: "var(--font-jetbrains), 'JetBrains Mono', monospace",
    fontSize: 13,
    padding: "12px 16px",
    outline: "none",
    borderRadius: 2,
    marginBottom: 12,
    boxSizing: "border-box",
    letterSpacing: "0.04em",
  };

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

      <div style={{ display: "flex", gap: 24, flexWrap: "wrap", marginBottom: contact.showForm ? 64 : 0 }}>
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

      {/* Contact form — only shown if showForm is true */}
      {contact.showForm && (
        <div style={{ maxWidth: 560, marginBottom: 80 }}>
          <div
            className="v3-mono"
            style={{
              fontSize: 10, textTransform: "uppercase",
              letterSpacing: "0.18em", color: "var(--mute)",
              marginBottom: 24,
            }}
          >
            Or send a message directly
          </div>

          {status === "ok" ? (
            <p
              className="v3-mono"
              style={{ fontSize: 13, color: "#3a7a38", letterSpacing: "0.06em" }}
            >
              Message sent. I&apos;ll get back to you.
            </p>
          ) : (
            <form onSubmit={handleSubmit}>
              <label
                className="v3-mono"
                style={{ display: "block", fontSize: 10, textTransform: "uppercase", letterSpacing: "0.14em", color: "var(--mute)", marginBottom: 6 }}
              >
                Name
              </label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                required
                style={inputStyle}
                onFocus={e => (e.target.style.borderColor = "var(--ink)")}
                onBlur={e => (e.target.style.borderColor = "var(--rule)")}
              />

              <label
                className="v3-mono"
                style={{ display: "block", fontSize: 10, textTransform: "uppercase", letterSpacing: "0.14em", color: "var(--mute)", marginBottom: 6 }}
              >
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                style={inputStyle}
                onFocus={e => (e.target.style.borderColor = "var(--ink)")}
                onBlur={e => (e.target.style.borderColor = "var(--rule)")}
              />

              <label
                className="v3-mono"
                style={{ display: "block", fontSize: 10, textTransform: "uppercase", letterSpacing: "0.14em", color: "var(--mute)", marginBottom: 6 }}
              >
                Message
              </label>
              <textarea
                value={message}
                onChange={e => setMessage(e.target.value)}
                required
                rows={4}
                style={{ ...inputStyle, resize: "vertical", minHeight: 100, marginBottom: 20 }}
                onFocus={e => (e.target.style.borderColor = "var(--ink)")}
                onBlur={e => (e.target.style.borderColor = "var(--rule)")}
              />

              {status === "err" && (
                <p
                  className="v3-mono"
                  style={{ fontSize: 12, color: "#cc0000", marginBottom: 12, letterSpacing: "0.06em" }}
                >
                  Something went wrong. Try the email above.
                </p>
              )}

              <button
                type="submit"
                disabled={status === "sending"}
                className="v3-mag-btn"
                style={{
                  background: "var(--ink)",
                  color: "var(--bg)",
                  cursor: status === "sending" ? "wait" : "pointer",
                  opacity: status === "sending" ? 0.6 : 1,
                  border: "none",
                }}
              >
                {status === "sending" ? "Sending…" : "Send →"}
              </button>
            </form>
          )}
        </div>
      )}

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
