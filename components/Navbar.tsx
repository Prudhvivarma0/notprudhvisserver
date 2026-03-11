"use client";

import { useTheme } from "next-themes";
import { useEffect, useRef, useState } from "react";

const navLinks: { label: string; id: string }[] = [
  { label: "About",        id: "about"        },
  { label: "Projects",     id: "projects"     },
  { label: "Experience",   id: "experience"   },
  { label: "Achievements", id: "achievements" },
  { label: "Contact",      id: "contact"      },
];

function scrollTo(id: string) {
  const el = document.getElementById(id);
  if (el) {
    const y = el.getBoundingClientRect().top + window.scrollY - 64;
    window.scrollTo({ top: y, behavior: "smooth" });
  }
}

export function Navbar() {
  const { theme, setTheme } = useTheme();
  const [mounted,  setMounted]  = useState(false);
  const [visible,  setVisible]  = useState(true);
  const [hovered,  setHovered]  = useState<string | null>(null);
  const lastScrollY = useRef(0);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    const onScroll = () => {
      const curr = window.scrollY;
      setVisible(curr < 50 || curr < lastScrollY.current);
      lastScrollY.current = curr;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      style={{
        position:   "fixed",
        top:        0,
        left:       0,
        right:      0,
        zIndex:     50,
        transform:  visible ? "translateY(0)" : "translateY(-100%)",
        transition: "transform 0.3s cubic-bezier(0.4,0,0.2,1)",
        borderBottom: "1px solid var(--muted)",
        backdropFilter:       "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        background: "color-mix(in srgb, var(--bg) 80%, transparent)",
      }}
    >
      <nav className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
        {/* Logo — scrolls to top, no hash */}
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="font-display text-lg font-semibold tracking-tight"
          style={{
            color:      "var(--text)",
            background: "none",
            border:     "none",
            cursor:     "pointer",
            padding:    0,
            transition: "color 0.2s",
          }}
          onMouseEnter={e => (e.currentTarget.style.color = "var(--accent)")}
          onMouseLeave={e => (e.currentTarget.style.color = "var(--text)")}
        >
          prudhvi.
        </button>

        <div className="flex items-center gap-6">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => scrollTo(link.id)}
              onMouseEnter={() => setHovered(link.id)}
              onMouseLeave={() => setHovered(null)}
              className="font-sans text-sm"
              style={{
                color:      hovered === link.id ? "var(--text)" : "var(--muted)",
                background: "none",
                border:     "none",
                cursor:     "pointer",
                padding:    "2px 0",
                position:   "relative",
                transition: "color 0.2s",
              }}
            >
              {link.label}
              <span
                style={{
                  position:        "absolute",
                  bottom:          0,
                  left:            0,
                  right:           0,
                  height:          "1px",
                  background:      "var(--accent)",
                  opacity:         hovered === link.id ? 1 : 0,
                  transform:       hovered === link.id ? "scaleX(1)" : "scaleX(0)",
                  transformOrigin: "left",
                  transition:      "opacity 0.2s, transform 0.2s",
                }}
              />
            </button>
          ))}

          {/* Theme toggle */}
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            aria-label="Toggle theme"
            className="w-8 h-8 flex items-center justify-center rounded-md"
            style={{
              color:      "var(--muted)",
              background: "none",
              border:     "none",
              cursor:     "pointer",
              transition: "color 0.2s",
            }}
            onMouseEnter={e => (e.currentTarget.style.color = "var(--accent)")}
            onMouseLeave={e => (e.currentTarget.style.color = "var(--muted)")}
          >
            {mounted ? (
              theme === "dark" ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"
                  fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="4" />
                  <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"
                  fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
                </svg>
              )
            ) : (
              <span className="w-[18px] h-[18px]" />
            )}
          </button>
        </div>
      </nav>
    </header>
  );
}
