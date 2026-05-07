"use client";

import { useEffect } from "react";
import type { HeroData, ProjectRow, ExperienceRow, CertRow, AchievementRow, ContactRow } from "@/lib/db";

/* ── Default data (matches the design handoff exactly) ─────────────────── */

const D_HERO: HeroData = {
  id: 1,
  name: "PRUDHVI VARMA",
  tagline: "RUNNING ON CAFFEINE & SHELL SCRIPTS",
  typing_words: "OFFENSIVE MINDSET // DEFENSIVE STRATEGY",
  cta1_text: "INITIALIZE_PORTFOLIO.EXE",
  cta1_link: "#work",
  cta2_text: "[DOWNLOAD_RESUME.PDF]",
  cta2_link: "/Prudhvi_Resume.pdf",
};

const D_PROJECTS: ProjectRow[] = [
  { id:1, sort_order:1, visible:1, icon_name:"", cover_image:"", cta_text:"", link_url:"https://github.com/Prudhvivarma0?tab=repositories",
    title:"Web App Penetration Test",
    description:"Conducted penetration tests on DVWA using Kali Linux and Burp Suite. Intercepted and manipulated traffic to exploit OWASP Top 10 vulnerabilities (SQLi, XSS, CSRF) and recommended mitigation strategies." },
  { id:2, sort_order:2, visible:1, icon_name:"", cover_image:"", cta_text:"", link_url:"https://github.com/Prudhvivarma0?tab=repositories",
    title:"Enterprise Job Simulations",
    description:"Performed advanced vulnerability research and threat analysis for AIG, ANZ, Mastercard, & Telstra. Mitigated Zero-Day Log4j exploits and conducted enterprise-grade risk assessments." },
  { id:3, sort_order:3, visible:1, icon_name:"", cover_image:"", cta_text:"", link_url:"https://github.com/Prudhvivarma0?tab=repositories",
    title:"AWS Threat Monitoring",
    description:"Built a cloud surveillance system using CloudTrail, EventBridge, and SNS. Secured EC2 instances by automating the detection of root user anomalies for compliance and incident response." },
  { id:4, sort_order:4, visible:1, icon_name:"", cover_image:"", cta_text:"", link_url:"https://github.com/Prudhvivarma0?tab=repositories",
    title:"Firewall & Encryption Sys",
    description:"Engineered a rule-based firewall with IP access control and implemented a public-key encryption system based on super-increasing sequences to secure data transmission." },
  { id:5, sort_order:5, visible:1, icon_name:"", cover_image:"", cta_text:"", link_url:"https://github.com/Prudhvivarma0?tab=repositories",
    title:"Deep Learning IDS",
    description:"Thesis Project: Developed an Intrusion Detection System for Cyber-Physical Systems using Wi-Fi CSI and Deep Learning (Variational Autoencoders), improving threat detection accuracy by 30%." },
];

const D_EXPERIENCE: ExperienceRow[] = [
  { id:1, sort_order:1, visible:1, description:"", company:"MCN",                  role:"IT Intern",      period:"APR 2025 - PRESENT",    location:"DUBAI" },
  { id:2, sort_order:2, visible:1, description:"", company:"Greenhouse Foodstuff", role:"IT Intern",      period:"JAN 2025 - MAY 2025",   location:"DUBAI" },
  { id:3, sort_order:3, visible:1, description:"", company:"Urbizassist",          role:"AI & IT Intern", period:"DEC 2024 - FEB 2025",   location:"DUBAI" },
];

const D_CERTS: CertRow[] = [
  { id:1, sort_order:1, visible:1, issuer:"", icon:"", name:"BTL1\nLevel 1" },
  { id:2, sort_order:2, visible:1, issuer:"", icon:"", name:"ISC2 CC\nCertified" },
  { id:3, sort_order:3, visible:1, issuer:"", icon:"", name:"SOC Analyst\nUdemy" },
  { id:4, sort_order:4, visible:1, issuer:"", icon:"", name:"Intro to\nSplunk" },
  { id:5, sort_order:5, visible:1, issuer:"", icon:"", name:"Splunk\nSOAR" },
  { id:6, sort_order:6, visible:1, issuer:"", icon:"", name:"Security\nOps" },
  { id:7, sort_order:7, visible:1, issuer:"", icon:"", name:"Art of\nInvestigation" },
];

const D_ACHIEVEMENTS: AchievementRow[] = [
  { id:1, sort_order:1, visible:1, icon:"🏆", title:"1st Place Qualifier", event:"Zayed University x Exploiters CTF", date:"FEB 2025" },
  { id:2, sort_order:2, visible:1, icon:"🥉", title:"3rd Place Winner",    event:"REDTEAM Cyber Hack CTF",            date:"FEB 2025" },
];

const D_CONTACT: ContactRow[] = [
  { id:1, sort_order:1, visible:1, label:"SEND_EMAIL", href:"mailto:prudhvivarma31@gmail.com" },
  { id:2, sort_order:2, visible:1, label:"LINKEDIN",   href:"https://www.linkedin.com/in/prudhvivarma11/" },
  { id:3, sort_order:3, visible:1, label:"GITHUB",     href:"https://github.com/Prudhvivarma0?tab=repositories" },
];

/* ── Helpers ───────────────────────────────────────────────────────────── */

function handleNav(targetId: string) {
  const overlay = document.querySelector(".shutter-overlay");
  const target  = document.getElementById(targetId);
  if (!target) return;
  overlay?.classList.add("active");
  setTimeout(() => {
    const y = target.getBoundingClientRect().top + window.scrollY - 80;
    window.scrollTo({ top: y, behavior: "auto" });
    setTimeout(() => overlay?.classList.remove("active"), 800);
  }, 500);
}

function toggleTheme() {
  const html  = document.documentElement;
  const theme = html.getAttribute("data-theme") === "dark" ? "light" : "dark";
  html.setAttribute("data-theme", theme);
  localStorage.setItem("portfolio-theme", theme);
}

/* ── Main component ────────────────────────────────────────────────────── */

interface Props {
  hero:         HeroData | null;
  projects:     ProjectRow[];
  experience:   ExperienceRow[];
  certs:        CertRow[];
  achievements: AchievementRow[];
  contacts:     ContactRow[];
}

export function PortfolioPage({ hero, projects, experience, certs, achievements, contacts }: Props) {
  const h  = hero         ?? D_HERO;
  const pr = projects.length     > 0 ? projects     : D_PROJECTS;
  const ex = experience.length   > 0 ? experience   : D_EXPERIENCE;
  const ce = certs.length        > 0 ? certs        : D_CERTS;
  const ac = achievements.length > 0 ? achievements : D_ACHIEVEMENTS;
  const co = contacts.length     > 0 ? contacts     : D_CONTACT;

  /* Cursor */
  useEffect(() => {
    const dot     = document.querySelector<HTMLElement>("[data-cursor-dot]");
    const outline = document.querySelector<HTMLElement>("[data-cursor-outline]");
    if (!dot || !outline) return;
    const onMove = (e: MouseEvent) => {
      dot.style.left = `${e.clientX}px`;
      dot.style.top  = `${e.clientY}px`;
      outline.animate(
        { left: `${e.clientX}px`, top: `${e.clientY}px` },
        { duration: 500, fill: "forwards" }
      );
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  return (
    <>
      <style>{CSS}</style>

      {/* Cyber grid */}
      <div className="cyber-grid" />

      {/* Shutter overlay */}
      <div className="shutter-overlay">
        <div className="shutter s-top" />
        <div className="shutter s-bottom" />
        <div className="loader-box">
          <div className="loader-text">[ ACCESSING_SERVER ]</div>
          <div className="progress-container"><div className="progress-bar" /></div>
        </div>
      </div>

      {/* Custom cursor */}
      <div className="cursor-dot"     data-cursor-dot />
      <div className="cursor-outline" data-cursor-outline />

      {/* Nav */}
      <nav>
        <div className="logo">NOT<span>PRUDHVIS</span>SERVER.ORG</div>
        <div className="nav-links">
          <button onClick={() => handleNav("work")}>PROJECTS</button>
          <span className="sep">|</span>
          <button onClick={() => handleNav("experience")}>EXPERIENCE</button>
          <span className="sep">|</span>
          <button onClick={() => handleNav("certifications")}>CERTIFICATIONS</button>
          <span className="sep">|</span>
          <button onClick={() => handleNav("achievements")}>ACHIEVEMENTS</button>
          <span className="sep">|</span>
          <button onClick={() => handleNav("contact")}>CONTACT</button>
          <span className="sep">|</span>
          <button onClick={toggleTheme}>[ ☀ / ☾ ]</button>
        </div>
      </nav>

      {/* Hero */}
      <section className="hero">
        <div className="ambient-glow" />
        <div className="glitch-wrapper">
          <div className="glitch" data-text={h.name}>{h.name}</div>
        </div>
        <p>
          // SYSTEM STATUS: <strong style={{ color: "var(--accent-color)" }}>{h.tagline}</strong><br />
          // MISSION: <strong style={{ color: "var(--accent-color)" }}>{h.typing_words}</strong><br />
          // CURRENT LOCATION: DUBAI
        </p>
        <div className="btn-group">
          <button className="btn-glitch" onClick={() => handleNav("work")}>{h.cta1_text}</button>
          <a href={h.cta2_link} download className="btn-secondary">{h.cta2_text}</a>
        </div>
      </section>

      {/* Projects */}
      <h2 className="section-header" id="work">&lt; PROJECTS /&gt;</h2>
      <div className="grid">
        {pr.map(p => (
          <a key={p.id} href={p.link_url} target="_blank" rel="noopener noreferrer" className="card-link">
            <div className="card">
              <div>
                <h3>{p.title}</h3>
                <p dangerouslySetInnerHTML={{ __html: p.description }} />
              </div>
            </div>
          </a>
        ))}
      </div>

      {/* Experience */}
      <h2 className="section-header" id="experience">&lt; EXPERIENCE_LOG /&gt;</h2>
      <div className="timeline">
        {ex.map(e => (
          <div key={e.id} className="timeline-item">
            <h3>{e.company} — {e.role}</h3>
            <span>{e.period} // {e.location}</span>
          </div>
        ))}
      </div>

      {/* Certifications */}
      <h2 className="section-header" id="certifications">&lt; CERTIFICATIONS /&gt;</h2>
      <div className="hex-container">
        {ce.map(c => (
          <div key={c.id} className="hex">
            <div className="hex-content">
              {c.name.split("\n").map((line, i, arr) => (
                <span key={i}>{line}{i < arr.length - 1 && <br />}</span>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Achievements */}
      <h2 className="section-header" id="achievements">&lt; ACHIEVEMENTS /&gt;</h2>
      <div className="achievements-grid">
        {ac.map(a => (
          <div key={a.id} className="achievement-card">
            <span className="trophy">{a.icon}</span>
            <h3>{a.title}</h3>
            <p>{a.event}</p>
            <span style={{ color: "var(--accent-color)", fontSize: "0.9rem", fontWeight: "bold" }}>{a.date}</span>
          </div>
        ))}
      </div>

      {/* Contact / Footer */}
      <footer id="contact">
        <h2 style={{ color: "var(--accent-color)", marginBottom: "20px" }}>// TERMINATE_SESSION</h2>
        <p style={{ fontSize: "1.2rem", color: "#fff" }}>prudhvivarma31@gmail.com | Dubai, UAE</p>
        <div style={{ marginTop: "30px", display: "flex", justifyContent: "center", gap: "15px", flexWrap: "wrap" }}>
          {co.map(c => (
            <a key={c.id} href={c.href} target="_blank" rel="noopener noreferrer" className="btn-glitch" style={{ margin: "5px" }}>
              {c.label}
            </a>
          ))}
        </div>
      </footer>
    </>
  );
}

/* ── CSS — exact copy from design handoff ──────────────────────────────── */
const CSS = `
  :root {
    --bg-color: #050505;
    --text-primary: #ffffff;
    --text-secondary: #b0b0b0;
    --accent-color: #ff8700;
    --card-bg: #0f0f0f;
    --font-mono: 'Courier New', Courier, monospace;
    --font-display: 'Arial Black', sans-serif;
    --nav-height: 90px;
  }
  [data-theme="light"] {
    --bg-color: #f0f0f5;
    --text-primary: #111111;
    --text-secondary: #444;
    --accent-color: #ff4500;
    --card-bg: #ffffff;
  }
  html { scroll-behavior: auto; }
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; cursor: none; }
  body {
    background-color: var(--bg-color);
    color: var(--text-primary);
    font-family: var(--font-mono);
    overflow-x: hidden;
    font-size: 20px;
    transition: background-color 0.3s ease, color 0.3s ease;
  }
  /* Cyber grid */
  .cyber-grid {
    position: fixed; top: 0; left: 0; width: 200vw; height: 200vh;
    background-image:
      linear-gradient(rgba(255,135,0,0.03) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255,135,0,0.03) 1px, transparent 1px);
    background-size: 50px 50px;
    z-index: -1;
    transform: perspective(500px) rotateX(60deg) translateY(-100px) translateZ(-200px);
    animation: gridMove 20s linear infinite;
    pointer-events: none;
  }
  .ambient-glow {
    position: absolute; top: 50%; left: 50%; transform: translate(-50%,-50%);
    width: 800px; height: 800px;
    background: radial-gradient(circle, rgba(255,135,0,0.08) 0%, rgba(0,0,0,0) 70%);
    z-index: -1; pointer-events: none;
  }
  @keyframes gridMove {
    0%   { transform: perspective(500px) rotateX(60deg) translateY(0) translateZ(-200px); }
    100% { transform: perspective(500px) rotateX(60deg) translateY(50px) translateZ(-200px); }
  }
  /* Nav */
  nav {
    display: flex; justify-content: space-between; padding: 0 4%;
    height: var(--nav-height); align-items: center;
    position: fixed; width: 100%; top: 0; z-index: 1000;
    background: rgba(5,5,5,0.95); backdrop-filter: blur(10px);
    border-bottom: 1px solid rgba(255,135,0,0.15);
    transition: background 0.3s;
  }
  [data-theme="light"] nav { background: rgba(240,240,245,0.98); }
  .logo { font-weight: 800; font-size: 1.6rem; letter-spacing: 2px; color: var(--text-primary); }
  .logo span { color: var(--accent-color); }
  .nav-links { display: flex; align-items: center; gap: 0; }
  .nav-links button {
    color: var(--text-primary); background: none; border: none; cursor: none;
    font-family: var(--font-mono); font-size: 1rem; font-weight: bold;
    text-transform: uppercase; letter-spacing: 1px; transition: color 0.2s;
  }
  .nav-links button:hover { color: var(--accent-color); }
  .sep { color: var(--text-secondary); margin: 0 15px; opacity: 0.5; font-weight: normal; }
  /* Hero */
  .hero {
    min-height: 100vh; display: flex; flex-direction: column;
    justify-content: center; align-items: center; text-align: center;
    padding: 100px 20px 0; position: relative;
  }
  .glitch-wrapper { position: relative; display: inline-block; margin-bottom: 20px; }
  .glitch {
    font-family: var(--font-display); font-size: 6rem; font-weight: 900;
    text-transform: uppercase; position: relative; color: var(--text-primary); line-height: 1;
  }
  .glitch::before, .glitch::after { content: attr(data-text); position: absolute; top: 0; left: 0; width: 100%; height: 100%; }
  .glitch::before { left: 3px; text-shadow: -2px 0 #ff00c1; clip: rect(44px,450px,56px,0); animation: glitch-anim 5s infinite linear alternate-reverse; }
  .glitch::after  { left: -3px; text-shadow: -2px 0 #00fff9; clip: rect(44px,450px,56px,0); animation: glitch-anim2 5s infinite linear alternate-reverse; }
  @keyframes glitch-anim  { 0%{clip:rect(12px,9999px,5px,0)}5%{clip:rect(54px,9999px,16px,0)}100%{clip:rect(33px,9999px,11px,0)} }
  @keyframes glitch-anim2 { 0%{clip:rect(65px,9999px,100px,0)}100%{clip:rect(2px,9999px,85px,0)} }
  .hero p {
    margin-top: 1.5rem; max-width: 900px; line-height: 1.8;
    color: var(--text-secondary); font-size: 1.3rem;
    opacity: 0; animation: fadeIn 2s forwards 0.5s;
  }
  .btn-group {
    margin-top: 3.5rem; display: flex; gap: 20px; flex-wrap: wrap; justify-content: center;
    opacity: 0; animation: fadeIn 2s forwards 1s;
  }
  .btn-glitch {
    padding: 18px 40px; font-size: 1.1rem; cursor: none;
    background: transparent; border: 2px solid var(--accent-color);
    color: var(--accent-color); font-family: var(--font-mono);
    font-weight: bold; letter-spacing: 2px; transition: 0.3s;
    text-decoration: none; display: inline-block;
  }
  .btn-glitch:hover { background: var(--accent-color); color: #000; box-shadow: 0 0 35px var(--accent-color); }
  .btn-secondary {
    padding: 18px 40px; font-size: 1.1rem; cursor: none;
    background: transparent; border: 2px solid var(--text-secondary);
    color: var(--text-secondary); font-family: var(--font-mono);
    font-weight: bold; letter-spacing: 2px; transition: 0.3s;
    text-decoration: none; display: inline-block;
  }
  .btn-secondary:hover { border-color: var(--accent-color); color: var(--accent-color); }
  /* Section header */
  .section-header {
    font-size: 2.2rem; text-align: center; margin: 9rem 0 4rem;
    color: var(--accent-color); text-transform: uppercase; letter-spacing: 5px;
  }
  /* Cards */
  .grid {
    display: grid; grid-template-columns: repeat(auto-fit, minmax(400px,1fr));
    gap: 2.5rem; padding: 0 8%;
  }
  .card-link { text-decoration: none; display: block; }
  .card {
    background: var(--card-bg); border: 1px solid #222; padding: 3rem; height: 100%;
    position: relative; overflow: hidden; transition: transform 0.3s;
    display: flex; flex-direction: column; justify-content: space-between;
  }
  [data-theme="light"] .card { border-color: #ddd; }
  .card:hover { transform: translateY(-7px); border-color: var(--accent-color); }
  .card h3 { font-size: 1.6rem; margin: 0 0 15px; color: var(--text-primary); }
  .card p  { font-size: 1.1rem; color: var(--text-secondary); line-height: 1.7; }
  /* Timeline */
  .timeline {
    max-width: 900px; margin: 0 auto; padding: 0 20px;
    border-left: 2px solid #222; position: relative;
  }
  .timeline-item { margin-bottom: 3rem; padding-left: 40px; position: relative; }
  .timeline-item::before {
    content: ''; position: absolute; left: -11px; top: 5px;
    width: 20px; height: 20px; background: var(--bg-color);
    border: 2px solid var(--accent-color); border-radius: 50%;
  }
  .timeline-item h3   { color: var(--text-primary); font-size: 1.6rem; margin-bottom: 5px; }
  .timeline-item span { color: var(--accent-color); font-size: 1rem; font-weight: bold; display: block; }
  /* Hex */
  .hex-container { display: flex; justify-content: center; flex-wrap: wrap; gap: 30px; padding-bottom: 0; }
  .hex {
    width: 160px; height: 140px; background: #111;
    display: flex; align-items: center; justify-content: center; text-align: center;
    clip-path: polygon(50% 0%,100% 25%,100% 75%,50% 100%,0% 75%,0% 25%);
    transition: 0.3s; border: 1px solid #333; color: #ffffff;
  }
  .hex:hover { color: #000; background: var(--accent-color); transform: scale(1.1); }
  .hex-content { z-index: 2; font-weight: bold; font-size: 0.9rem; padding: 5px; }
  /* Achievements */
  .achievements-grid {
    display: grid; grid-template-columns: repeat(auto-fit, minmax(300px,1fr));
    gap: 30px; padding: 0 10%; margin-bottom: 5rem;
  }
  .achievement-card {
    background: #111; border: 1px solid #222; padding: 30px; text-align: center; transition: 0.3s;
  }
  .achievement-card:hover { border-color: var(--accent-color); transform: translateY(-5px); }
  .trophy { font-size: 2.5rem; margin-bottom: 15px; display: block; }
  .achievement-card h3, .achievement-card p { color: #ffffff; }
  /* Footer */
  footer {
    text-align: center; padding: 6rem 2rem; border-top: 1px solid #222; margin-top: 6rem;
    background: #020202;
  }
  /* Shutter */
  .shutter-overlay {
    position: fixed; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none; z-index: 9999;
  }
  .shutter {
    position: absolute; left: 0; width: 100%; height: 50%;
    background: var(--accent-color);
    transition: transform 0.4s cubic-bezier(0.8,0,0.2,1); z-index: 100;
  }
  .s-top    { top: 0;    transform: translateY(-100%); border-bottom: 5px solid #000; }
  .s-bottom { bottom: 0; transform: translateY(100%);  border-top:    5px solid #000; }
  .shutter-overlay.active .s-top    { transform: translateY(0); }
  .shutter-overlay.active .s-bottom { transform: translateY(0); }
  .loader-box {
    position: absolute; top: 50%; left: 50%; transform: translate(-50%,-50%);
    display: flex; flex-direction: column; align-items: center; gap: 10px;
    opacity: 0; z-index: 200; transition: opacity 0.1s;
    background: #000; padding: 30px 50px; border: 2px solid #000; box-shadow: 0 0 50px rgba(0,0,0,0.8);
  }
  .shutter-overlay.active .loader-box { opacity: 1; transition-delay: 0.3s; }
  .loader-text {
    color: var(--accent-color); font-family: 'Arial Black', sans-serif;
    font-size: 1.5rem; font-weight: 900; letter-spacing: 2px; text-transform: uppercase;
  }
  .progress-container { width: 250px; height: 6px; background: #222; overflow: hidden; margin-top: 10px; }
  .progress-bar { height: 100%; width: 0%; background: var(--accent-color); transition: width 0.1s; }
  .shutter-overlay.active .progress-bar { width: 100%; transition: width 0.4s ease-in-out 0.3s; }
  /* Cursor */
  .cursor-dot {
    width: 8px; height: 8px; background-color: var(--accent-color);
    position: fixed; top: 0; left: 0; transform: translate(-50%,-50%);
    border-radius: 50%; pointer-events: none; z-index: 10002;
  }
  .cursor-outline {
    width: 40px; height: 40px; border: 1px solid var(--accent-color);
    position: fixed; top: 0; left: 0; transform: translate(-50%,-50%);
    border-radius: 50%; transition: width 0.1s, height 0.1s;
    pointer-events: none; z-index: 10002;
  }
  @keyframes fadeIn { to { opacity: 1; } }
  @media (max-width: 900px) {
    .glitch { font-size: 3.5rem; }
    .nav-links { display: none; }
    .grid { padding: 0 5%; grid-template-columns: 1fr; }
    .cyber-grid { display: none; }
  }
`;
