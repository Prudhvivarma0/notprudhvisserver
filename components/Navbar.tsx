"use client";

import { useTheme } from "next-themes";
import { useEffect, useRef, useState } from "react";

const navLinks: { label: string; href: string }[] = [
  { label: "About",        href: "#about"        },
  { label: "Projects",     href: "#projects"     },
  { label: "Experience",   href: "#experience"   },
  { label: "Achievements", href: "#achievements" },
  { label: "Contact",      href: "#contact"      },
];

export function Navbar() {
  const { theme, setTheme } = useTheme();
  const [mounted,  setMounted]  = useState(false);
  const [visible,  setVisible]  = useState(true);
  const [hovered,  setHovered]  = useState<string | null>(null);
  const lastScrollY = useRef(0);

  useEffect(() => {
    setMounted(true);
  }, []);

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
        <a
          href="#"
          className="font-display text-lg font-semibold tracking-tight"
          onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: "smooth" }); }}
          style={{ color: "var(--text)", textDecoration: "none", transition: "color 0.2s", cursor: "pointer" }}
          onMouseEnter={e => (e.currentTarget.style.color = "var(--accent)")}
          onMouseLeave={e => (e.currentTarget.style.color = "var(--text)")}
        >
          prudhvi.
        </a>

        <div className="flex items-center gap-6">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="font-sans text-sm"
              onClick={(e) => {
                e.preventDefault();
                document.querySelector(link.href)?.scrollIntoView({ behavior: "smooth" });
              }}
              onMouseEnter={() => setHovered(link.href)}
              onMouseLeave={() => setHovered(null)}
              style={{
                color:          hovered === link.href ? "var(--text)" : "var(--muted)",
                textDecoration: "none",
                transition:     "color 0.2s",
                position:       "relative",
                paddingBottom:  "2px",
                cursor:         "pointer",
              }}
            >
              {link.label}
              {/* Bottom glow bar */}
              <span
                style={{
                  position:        "absolute",
                  bottom:          0,
                  left:            0,
                  right:           0,
                  height:          "1px",
                  background:      "var(--accent)",
                  opacity:         hovered === link.href ? 1 : 0,
                  transform:       hovered === link.href ? "scaleX(1)" : "scaleX(0)",
                  transformOrigin: "left",
                  transition:      "opacity 0.2s, transform 0.2s",
                }}
              />
            </a>
          ))}

          {/* Theme toggle */}
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            aria-label="Toggle theme"
            className="w-8 h-8 flex items-center justify-center rounded-md"
            style={{
              color:      "var(--muted)",
              transition: "color 0.2s",
              background: "none",
              border:     "none",
              cursor:     "pointer",
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
