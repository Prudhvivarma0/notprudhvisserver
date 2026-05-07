"use client";

import { useEffect, useRef, useState } from "react";

const NAV_ITEMS = [
  { key: "work",     label: "Projects"   },
  { key: "about",    label: "About"      },
  { key: "timeline", label: "Experience" },
  { key: "contact",  label: "Contact"    },
] as const;

type NavKey = typeof NAV_ITEMS[number]["key"];

interface Props {
  dark: boolean;
  setDark: (d: boolean) => void;
  activeNav: NavKey;
  onNavClick: (key: NavKey, label: string) => void;
}

export function TopNav({ dark, setDark, activeNav, onNavClick }: Props) {
  const navRef = useRef<HTMLDivElement>(null);
  const [navHover, setNavHover]   = useState<NavKey | null>(null);
  const [indicator, setIndicator] = useState({ x: 0, w: 0, opacity: 0 });

  const moveIndicator = (key: NavKey) => {
    if (!navRef.current) return;
    const el = navRef.current.querySelector<HTMLElement>(`[data-nav="${key}"]`);
    if (!el) return;
    const navRect = navRef.current.getBoundingClientRect();
    const r = el.getBoundingClientRect();
    setIndicator({ x: r.left - navRect.left, w: r.width, opacity: 1 });
  };

  useEffect(() => { moveIndicator(navHover ?? activeNav); }, [navHover, activeNav]);

  const toggleTheme = () => {
    const next = dark ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem("v3-theme", next);
    setDark(!dark);
  };

  return (
    <header
      className="v3-mono v3-topnav"
      style={{
        padding: "24px 32px",
        display: "grid",
        gridTemplateColumns: "1fr 1fr 1fr",
        alignItems: "center",
        borderBottom: "1px solid var(--rule)",
        transition: "background 0.3s",
      }}
    >
      {/* Logo */}
      <div style={{ fontSize: 12, letterSpacing: "0.12em", textTransform: "uppercase" }}>
        PV<span style={{ color: "var(--mute)" }}>—2026</span>
      </div>

      {/* Center nav (desktop) */}
      <div
        ref={navRef}
        onMouseLeave={() => setNavHover(null)}
        className="v3-topnav-center"
        style={{
          position: "relative",
          display: "flex",
          justifyContent: "center",
          gap: 32,
          fontSize: 12,
          textTransform: "uppercase",
          letterSpacing: "0.16em",
        }}
      >
        {NAV_ITEMS.map(({ key, label }) => (
          <a
            key={key}
            href={`#${key}`}
            data-nav={key}
            onMouseEnter={() => setNavHover(key)}
            onClick={(e) => { e.preventDefault(); onNavClick(key, label); }}
            style={{
              color: activeNav === key ? "var(--ink)" : "var(--mute)",
              textDecoration: "none",
              padding: "6px 0",
              transition: "color 0.3s",
            }}
          >
            {label}
          </a>
        ))}
        <span
          aria-hidden
          style={{
            position: "absolute", bottom: 0, height: 1,
            background: "var(--ink)",
            left: indicator.x, width: indicator.w, opacity: indicator.opacity,
            transition: "left 0.4s cubic-bezier(.76,0,.24,1), width 0.4s cubic-bezier(.76,0,.24,1)",
          }}
        />
      </div>

      {/* Right: available + theme */}
      <div
        style={{
          fontSize: 12, letterSpacing: "0.12em", textTransform: "uppercase",
          display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 8,
        }}
      >
        <span style={{ display: "inline-block", width: 8, height: 8, borderRadius: "50%", background: "#4a7048", flexShrink: 0 }} />
        <span className="v3-topnav-available">AVAILABLE</span>
        <span className="v3-topnav-available" style={{ color: "var(--mute)" }}>·</span>
        <button
          onClick={toggleTheme}
          style={{
            background: "none", border: "none", cursor: "pointer",
            fontSize: 12, letterSpacing: "0.12em", textTransform: "uppercase",
            color: "var(--mute)", transition: "color 0.2s", fontFamily: "inherit",
          }}
          onMouseEnter={e => (e.currentTarget.style.color = "var(--ink)")}
          onMouseLeave={e => (e.currentTarget.style.color = "var(--mute)")}
        >
          {dark ? "LIGHT" : "DARK"}
        </button>
      </div>

      {/* Mobile nav row — shown via CSS on small screens */}
      <div
        className="v3-topnav-mobile"
        style={{
          display: "none",
          gridColumn: "1 / -1",
          gap: 24,
          fontSize: 12,
          textTransform: "uppercase",
          letterSpacing: "0.16em",
          paddingTop: 16,
        }}
      >
        {NAV_ITEMS.map(({ key, label }, i) => (
          <>
            {i > 0 && <span key={`sep-${key}`} style={{ color: "var(--rule)" }}>|</span>}
            <a
              key={key}
              href={`#${key}`}
              onClick={(e) => { e.preventDefault(); onNavClick(key, label); }}
              style={{
                color: activeNav === key ? "var(--ink)" : "var(--mute)",
                textDecoration: "none",
                transition: "color 0.3s",
              }}
            >
              {label}
            </a>
          </>
        ))}
      </div>
    </header>
  );
}
