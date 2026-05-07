"use client";

import { useEffect, useState } from "react";
import { triggerShutter } from "@/components/CursorAndShutter";

const navLinks = [
  { label: "PROJECTS",       id: "projects"       },
  { label: "EXPERIENCE",     id: "experience"     },
  { label: "CERTIFICATIONS", id: "certifications" },
  { label: "ACHIEVEMENTS",   id: "achievements"   },
  { label: "CONTACT",        id: "contact"        },
];

function scrollToSection(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  const y = el.getBoundingClientRect().top + window.scrollY - 80;
  window.scrollTo({ top: y, behavior: "auto" });
}

function handleNav(id: string) {
  triggerShutter(() => scrollToSection(id));
}

function toggleTheme() {
  const html  = document.documentElement;
  const theme = html.getAttribute("data-theme") === "dark" ? "light" : "dark";
  html.setAttribute("data-theme", theme);
  localStorage.setItem("portfolio-theme", theme);
}

export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (!menuOpen) return;
    const close = (e: KeyboardEvent) => { if (e.key === "Escape") setMenuOpen(false); };
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, [menuOpen]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  return (
    <>
      <nav style={{
        display: "flex", justifyContent: "space-between", padding: "0 4%",
        height: "var(--nav-height)", alignItems: "center",
        position: "fixed", width: "100%", top: 0, zIndex: 1000,
        background: "rgba(5, 5, 5, 0.95)", backdropFilter: "blur(10px)",
        borderBottom: "1px solid rgba(255, 135, 0, 0.15)",
        transition: "background 0.3s",
      }}>
        <button
          onClick={() => triggerShutter(() => window.scrollTo({ top: 0, behavior: "auto" }))}
          style={{
            fontWeight: 800, fontSize: "1.3rem", letterSpacing: "2px",
            color: "var(--text-primary)", background: "none", border: "none",
            cursor: "none", fontFamily: "var(--font-mono)",
          }}
        >
          NOT<span style={{ color: "var(--accent-color)" }}>PRUDHVIS</span>SERVER.ORG
        </button>

        {/* Desktop links */}
        <div className="nav-desktop" style={{ display: "flex", alignItems: "center" }}>
          {navLinks.map((link, i) => (
            <span key={link.id} style={{ display: "flex", alignItems: "center" }}>
              {i > 0 && <span style={{ color: "var(--text-secondary)", opacity: 0.5, margin: "0 12px" }}>|</span>}
              <button
                onClick={() => handleNav(link.id)}
                style={{
                  color: "var(--text-primary)", background: "none", border: "none",
                  cursor: "none", fontFamily: "var(--font-mono)", fontSize: "0.9rem",
                  fontWeight: "bold", textTransform: "uppercase", letterSpacing: "1px",
                  transition: "color 0.2s",
                }}
                onMouseEnter={e => (e.currentTarget.style.color = "var(--accent-color)")}
                onMouseLeave={e => (e.currentTarget.style.color = "var(--text-primary)")}
              >
                {link.label}
              </button>
            </span>
          ))}
          <span style={{ color: "var(--text-secondary)", opacity: 0.5, margin: "0 12px" }}>|</span>
          <button
            onClick={toggleTheme}
            style={{
              color: "var(--text-primary)", background: "none", border: "none",
              cursor: "none", fontFamily: "var(--font-mono)", fontSize: "0.9rem",
              fontWeight: "bold", transition: "color 0.2s",
            }}
            onMouseEnter={e => (e.currentTarget.style.color = "var(--accent-color)")}
            onMouseLeave={e => (e.currentTarget.style.color = "var(--text-primary)")}
          >
            [ ☀ / ☾ ]
          </button>
        </div>

        {/* Mobile hamburger */}
        <button
          className="nav-mobile-btn"
          onClick={() => setMenuOpen(v => !v)}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          style={{ background: "none", border: "none", cursor: "none", color: "var(--text-primary)", fontSize: "1.6rem" }}
        >
          {menuOpen ? "✕" : "☰"}
        </button>
      </nav>

      {/* Mobile overlay */}
      {menuOpen && (
        <div style={{
          position: "fixed", inset: 0, zIndex: 999,
          background: "rgba(5,5,5,0.98)", display: "flex",
          flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "2rem",
        }}>
          {navLinks.map(link => (
            <button
              key={link.id}
              onClick={() => { setMenuOpen(false); setTimeout(() => handleNav(link.id), 150); }}
              style={{
                fontSize: "1.6rem", fontWeight: "bold", color: "var(--text-primary)",
                background: "none", border: "none", cursor: "none",
                fontFamily: "var(--font-mono)", letterSpacing: "3px", transition: "color 0.2s",
              }}
              onMouseEnter={e => (e.currentTarget.style.color = "var(--accent-color)")}
              onMouseLeave={e => (e.currentTarget.style.color = "var(--text-primary)")}
            >
              {link.label}
            </button>
          ))}
          <button
            onClick={toggleTheme}
            style={{ color: "var(--accent-color)", background: "none", border: "none", cursor: "none", fontSize: "1.1rem", fontFamily: "var(--font-mono)" }}
          >
            [ ☀ / ☾ ]
          </button>
        </div>
      )}

      <style>{`
        .nav-desktop { display: flex; }
        .nav-mobile-btn { display: none; }
        @media (max-width: 900px) {
          .nav-desktop { display: none !important; }
          .nav-mobile-btn { display: block !important; }
        }
        [data-theme="light"] nav { background: rgba(240,240,245,0.98) !important; }
      `}</style>
    </>
  );
}
