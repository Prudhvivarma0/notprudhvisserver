"use client";

import { useEffect, useRef, useState } from "react";
import { TopNav }             from "./TopNav";
import { WipeOverlay }        from "./WipeOverlay";
import { Hero }               from "./Hero";
import { DisciplinesGrid }    from "./DisciplinesGrid";
import { About }              from "./About";
import { WorkList }           from "./WorkList";
import { TimelineGrid }       from "./TimelineGrid";
import { CertsAchievements }  from "./CertsAchievements";
import { Contact }            from "./Contact";

type NavKey = "work" | "about" | "timeline" | "contact";

// ── prefers-reduced-motion ────────────────────────────────────────────────
function useReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);
  return reduced;
}

export function V3Page() {
  const rootRef  = useRef<HTMLDivElement>(null);
  const reduced  = useReducedMotion();

  const [dark,      setDark]      = useState(false);
  const [activeNav, setActiveNav] = useState<NavKey>("work");
  const [wiping,    setWiping]    = useState(false);
  const [wipeLabel, setWipeLabel] = useState("");

  // ── Theme sync from localStorage ───────────────────────────────────────
  useEffect(() => {
    const stored = localStorage.getItem("v3-theme");
    if (stored === "dark") setDark(true);
  }, []);

  // ── Scrollspy ──────────────────────────────────────────────────────────
  useEffect(() => {
    const ids: NavKey[] = ["about", "work", "timeline", "contact"];
    const onScroll = () => {
      const y = window.scrollY + 200;
      let cur: NavKey = ids[0];
      for (const id of ids) {
        const el = document.getElementById(id);
        if (el && el.offsetTop <= y) cur = id;
      }
      setActiveNav(cur);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // ── Viscous letters ────────────────────────────────────────────────────
  useEffect(() => {
    if (reduced) return;
    const root = rootRef.current;
    if (!root) return;
    const onMove = (e: MouseEvent) => {
      root.querySelectorAll<HTMLSpanElement>(".v3-flex-letter").forEach(l => {
        const r    = l.getBoundingClientRect();
        const dist = Math.hypot(
          e.clientX - (r.left + r.width  / 2),
          e.clientY - (r.top  + r.height / 2),
        );
        const t    = Math.max(0, 1 - dist / 220);
        l.style.fontVariationSettings = `"wght" ${100 + t * 800}`;
      });
    };
    root.addEventListener("mousemove", onMove);
    return () => root.removeEventListener("mousemove", onMove);
  }, [reduced]);

  // ── Nav wipe transition ────────────────────────────────────────────────
  const navTo = (key: NavKey, label: string) => {
    if (reduced) {
      // No wipe — just jump scroll
      const el = document.getElementById(key);
      if (el) el.scrollIntoView({ behavior: "auto", block: "start" });
      setActiveNav(key);
      return;
    }
    setWipeLabel(label);
    setWiping(true);
    setTimeout(() => {
      const el = document.getElementById(key);
      if (el) el.scrollIntoView({ behavior: "auto", block: "start" });
      setActiveNav(key);
    }, 700);
    setTimeout(() => setWiping(false), 1500);
  };

  return (
    <div ref={rootRef} style={{ background: "var(--bg)", color: "var(--ink)", minHeight: "100vh", overflowX: "hidden" }}>
      {/* Wipe overlay (two panels) */}
      <WipeOverlay wiping={wiping} wipeLabel={wipeLabel} />

      {/* Sticky nav */}
      <TopNav
        dark={dark}
        setDark={setDark}
        activeNav={activeNav}
        onNavClick={navTo}
      />

      {/* Hero */}
      <Hero
        dark={dark}
        reduced={reduced}
        onWorkClick={()    => navTo("work",    "Work")}
        onContactClick={() => navTo("contact", "Contact")}
      />

      {/* Disciplines band */}
      <DisciplinesGrid />

      {/* About */}
      <About />

      {/* Selected Work */}
      <WorkList />

      {/* Time / Experience */}
      <TimelineGrid />

      {/* Certs + Achievements */}
      <CertsAchievements />

      {/* Contact */}
      <Contact reduced={reduced} />
    </div>
  );
}
