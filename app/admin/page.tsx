"use client";

import { useEffect, useState, useCallback } from "react";
import { DEFAULT_CONTENT, SiteContent } from "@/lib/content";

// ── Styles ────────────────────────────────────────────────────────────────────

const mono = "'JetBrains Mono', 'Fira Code', monospace";

const S = {
  page: {
    minHeight: "100vh",
    background: "#ffffff",
    color: "#111111",
    fontFamily: mono,
    display: "flex",
  } as React.CSSProperties,

  sidebar: {
    width: 200,
    background: "#f7f7f7",
    borderRight: "1px solid #e0e0e0",
    padding: "24px 0",
    display: "flex",
    flexDirection: "column" as const,
    flexShrink: 0,
    minHeight: "100vh",
  },

  main: {
    flex: 1,
    padding: "40px 48px",
    overflowY: "auto" as const,
    maxHeight: "100vh",
  },

  sideTitle: {
    padding: "0 20px 20px",
    borderBottom: "1px solid #e0e0e0",
    marginBottom: 8,
  },

  sideTitleText: {
    fontSize: 13,
    fontWeight: 700,
    letterSpacing: "0.04em",
    color: "#111",
  },

  sideSub: {
    fontSize: 10,
    color: "#999",
    marginTop: 2,
    letterSpacing: "0.08em",
    textTransform: "uppercase" as const,
  },

  sideBtn: (active: boolean) => ({
    display: "block",
    width: "100%",
    padding: "10px 20px",
    background: active ? "#111" : "transparent",
    color: active ? "#fff" : "#555",
    border: "none",
    textAlign: "left" as const,
    cursor: "pointer",
    fontSize: 12,
    fontFamily: mono,
    letterSpacing: "0.04em",
    transition: "all 0.1s",
  }),

  h1: {
    fontSize: 18,
    fontWeight: 700,
    marginBottom: 32,
    letterSpacing: "0.04em",
    textTransform: "uppercase" as const,
    borderBottom: "2px solid #111",
    paddingBottom: 12,
  },

  h2: {
    fontSize: 13,
    fontWeight: 700,
    marginBottom: 16,
    textTransform: "uppercase" as const,
    letterSpacing: "0.1em",
    color: "#555",
  },

  card: {
    border: "1px solid #e0e0e0",
    padding: "20px",
    marginBottom: 12,
    background: "#fafafa",
  },

  label: {
    display: "block" as const,
    fontSize: 10,
    textTransform: "uppercase" as const,
    letterSpacing: "0.12em",
    color: "#888",
    marginBottom: 4,
  },

  input: {
    display: "block" as const,
    width: "100%",
    border: "1px solid #ccc",
    padding: "8px 10px",
    fontSize: 13,
    fontFamily: mono,
    background: "#fff",
    color: "#111",
    outline: "none",
    boxSizing: "border-box" as const,
    marginBottom: 12,
  },

  textarea: {
    display: "block" as const,
    width: "100%",
    border: "1px solid #ccc",
    padding: "8px 10px",
    fontSize: 13,
    fontFamily: mono,
    background: "#fff",
    color: "#111",
    outline: "none",
    boxSizing: "border-box" as const,
    resize: "vertical" as const,
    minHeight: 80,
    marginBottom: 12,
  },

  btn: {
    padding: "8px 20px",
    border: "1px solid #ccc",
    background: "#fff",
    color: "#111",
    fontSize: 12,
    fontFamily: mono,
    cursor: "pointer",
    letterSpacing: "0.06em",
    textTransform: "uppercase" as const,
  },

  btnPrimary: {
    padding: "10px 24px",
    border: "2px solid #111",
    background: "#111",
    color: "#fff",
    fontSize: 12,
    fontFamily: mono,
    cursor: "pointer",
    letterSpacing: "0.06em",
    textTransform: "uppercase" as const,
    fontWeight: 700,
  },

  btnDanger: {
    padding: "6px 14px",
    border: "1px solid #cc4444",
    background: "transparent",
    color: "#cc4444",
    fontSize: 11,
    fontFamily: mono,
    cursor: "pointer",
  },

  row: {
    display: "flex",
    gap: 12,
    flexWrap: "wrap" as const,
  },

  field: {
    display: "flex",
    flexDirection: "column" as const,
    flex: 1,
    minWidth: 160,
  },

  status: (ok: boolean) => ({
    fontSize: 11,
    color: ok ? "#226622" : "#cc3333",
    marginTop: 8,
    letterSpacing: "0.06em",
    textTransform: "uppercase" as const,
  }),
};

// ── Types ─────────────────────────────────────────────────────────────────────

type Tab = "hero" | "disciplines" | "about" | "projects" | "experience" | "certs" | "achievements" | "contact";

const TABS: { id: Tab; label: string }[] = [
  { id: "hero",         label: "Hero"         },
  { id: "disciplines",  label: "Disciplines"  },
  { id: "about",        label: "About"        },
  { id: "projects",     label: "Projects"     },
  { id: "experience",   label: "Experience"   },
  { id: "certs",        label: "Certs"        },
  { id: "achievements", label: "Achievements" },
  { id: "contact",      label: "Contact"      },
];

// ── Helpers ───────────────────────────────────────────────────────────────────

function StatusMsg({ msg }: { msg: string }) {
  if (!msg) return null;
  const ok = msg.startsWith("Saved");
  return <div style={S.status(ok)}>{msg}</div>;
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label style={S.label}>{label}</label>
      {children}
    </div>
  );
}

// ── Section editors ───────────────────────────────────────────────────────────

interface EditorProps {
  content: SiteContent;
  onChange: (c: SiteContent) => void;
  onSave: () => void;
  status: string;
}

function HeroEditor({ content, onChange, onSave, status }: EditorProps) {
  const h = content.hero;
  const set = (k: keyof SiteContent["hero"], v: string) =>
    onChange({ ...content, hero: { ...h, [k]: v } });

  return (
    <div>
      <div style={S.h2}>Hero</div>
      <Field label="Meta text">
        <input style={S.input} value={h.meta} onChange={e => set("meta", e.target.value)} />
      </Field>
      <Field label="Headline line 1">
        <input style={S.input} value={h.headline1} onChange={e => set("headline1", e.target.value)} />
      </Field>
      <Field label="Headline line 2">
        <input style={S.input} value={h.headline2} onChange={e => set("headline2", e.target.value)} />
      </Field>
      <Field label="Intro paragraph">
        <textarea style={S.textarea} value={h.intro} onChange={e => set("intro", e.target.value)} />
      </Field>
      <Field label="CTA — Work">
        <input style={S.input} value={h.ctaWork} onChange={e => set("ctaWork", e.target.value)} />
      </Field>
      <Field label="CTA — Contact">
        <input style={S.input} value={h.ctaContact} onChange={e => set("ctaContact", e.target.value)} />
      </Field>
      <button style={S.btnPrimary} onClick={onSave}>Save Hero</button>
      <StatusMsg msg={status} />
    </div>
  );
}

function DisciplinesEditor({ content, onChange, onSave, status }: EditorProps) {
  const items = content.disciplines;

  const setItem = (i: number, key: "num" | "label", v: string) => {
    const next = items.map((d, idx) => idx === i ? { ...d, [key]: v } : d);
    onChange({ ...content, disciplines: next });
  };

  const add = () =>
    onChange({ ...content, disciplines: [...items, { num: String(items.length + 1).padStart(2, "0"), label: "New discipline" }] });

  const remove = (i: number) =>
    onChange({ ...content, disciplines: items.filter((_, idx) => idx !== i) });

  return (
    <div>
      <div style={S.h2}>Disciplines</div>
      {items.map((d, i) => (
        <div key={i} style={{ ...S.card, display: "flex", gap: 12, alignItems: "flex-end" }}>
          <div style={{ width: 60 }}>
            <label style={S.label}>Num</label>
            <input style={{ ...S.input, marginBottom: 0 }} value={d.num} onChange={e => setItem(i, "num", e.target.value)} />
          </div>
          <div style={{ flex: 1 }}>
            <label style={S.label}>Label</label>
            <input style={{ ...S.input, marginBottom: 0 }} value={d.label} onChange={e => setItem(i, "label", e.target.value)} />
          </div>
          <button style={{ ...S.btnDanger, marginBottom: 0 }} onClick={() => remove(i)}>Remove</button>
        </div>
      ))}
      <div style={{ display: "flex", gap: 12, marginTop: 4 }}>
        <button style={S.btn} onClick={add}>+ Add discipline</button>
        <button style={S.btnPrimary} onClick={onSave}>Save Disciplines</button>
      </div>
      <StatusMsg msg={status} />
    </div>
  );
}

function AboutEditor({ content, onChange, onSave, status }: EditorProps) {
  const a = content.about;
  const set = (k: keyof SiteContent["about"], v: string) =>
    onChange({ ...content, about: { ...a, [k]: v } });

  return (
    <div>
      <div style={S.h2}>About</div>
      <Field label="Heading line 1 (e.g. Architect.)">
        <input style={S.input} value={a.heading1} onChange={e => set("heading1", e.target.value)} />
      </Field>
      <Field label="Heading line 2 (e.g. Developer.)">
        <input style={S.input} value={a.heading2} onChange={e => set("heading2", e.target.value)} />
      </Field>
      <Field label="Heading line 3 (e.g. Curious.)">
        <input style={S.input} value={a.heading3} onChange={e => set("heading3", e.target.value)} />
      </Field>
      <Field label="Bio paragraph 1">
        <textarea style={S.textarea} value={a.bio1} onChange={e => set("bio1", e.target.value)} />
      </Field>
      <Field label="Bio paragraph 2">
        <textarea style={S.textarea} value={a.bio2} onChange={e => set("bio2", e.target.value)} />
      </Field>
      <div style={S.row}>
        <div style={S.field}>
          <Field label="Portrait caption">
            <input style={S.input} value={a.portraitCaption} onChange={e => set("portraitCaption", e.target.value)} />
          </Field>
        </div>
        <div style={S.field}>
          <Field label="Portrait year">
            <input style={S.input} value={a.portraitYear} onChange={e => set("portraitYear", e.target.value)} />
          </Field>
        </div>
      </div>
      <button style={S.btnPrimary} onClick={onSave}>Save About</button>
      <StatusMsg msg={status} />
    </div>
  );
}

function ProjectsEditor({ content, onChange, onSave, status }: EditorProps) {
  const projects = content.projects;

  const setP = (i: number, k: keyof SiteContent["projects"][number], v: string) => {
    const next = projects.map((p, idx) => idx === i ? { ...p, [k]: v } : p);
    onChange({ ...content, projects: next });
  };

  const move = (i: number, dir: -1 | 1) => {
    const next = [...projects];
    const j = i + dir;
    if (j < 0 || j >= next.length) return;
    [next[i], next[j]] = [next[j], next[i]];
    onChange({ ...content, projects: next });
  };

  const add = () => onChange({
    ...content,
    projects: [...projects, {
      n: String(projects.length + 1).padStart(2, "0"),
      title: "New Project", year: "2026", meta: "", desc: "", link: "",
    }],
  });

  const remove = (i: number) =>
    onChange({ ...content, projects: projects.filter((_, idx) => idx !== i) });

  return (
    <div>
      <div style={S.h2}>Projects</div>
      {projects.map((p, i) => (
        <div key={i} style={S.card}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
            <span style={{ fontSize: 11, color: "#888", letterSpacing: "0.08em" }}>PROJECT {i + 1}</span>
            <div style={{ display: "flex", gap: 6 }}>
              <button style={S.btn} onClick={() => move(i, -1)}>↑</button>
              <button style={S.btn} onClick={() => move(i, 1)}>↓</button>
              <button style={S.btnDanger} onClick={() => remove(i)}>Remove</button>
            </div>
          </div>
          <div style={S.row}>
            <div style={{ ...S.field, maxWidth: 80 }}>
              <Field label="N">
                <input style={S.input} value={p.n} onChange={e => setP(i, "n", e.target.value)} />
              </Field>
            </div>
            <div style={{ ...S.field, flex: 3 }}>
              <Field label="Title">
                <input style={S.input} value={p.title} onChange={e => setP(i, "title", e.target.value)} />
              </Field>
            </div>
            <div style={{ ...S.field, maxWidth: 100 }}>
              <Field label="Year">
                <input style={S.input} value={p.year} onChange={e => setP(i, "year", e.target.value)} />
              </Field>
            </div>
          </div>
          <Field label="Meta tags (e.g. ai · automation)">
            <input style={S.input} value={p.meta} onChange={e => setP(i, "meta", e.target.value)} />
          </Field>
          <Field label="Description">
            <textarea style={S.textarea} value={p.desc} onChange={e => setP(i, "desc", e.target.value)} />
          </Field>
          <Field label="Link (leave empty for no link)">
            <input style={S.input} value={p.link ?? ""} onChange={e => setP(i, "link", e.target.value)} />
          </Field>
        </div>
      ))}
      <div style={{ display: "flex", gap: 12, marginTop: 4 }}>
        <button style={S.btn} onClick={add}>+ Add project</button>
        <button style={S.btnPrimary} onClick={onSave}>Save Projects</button>
      </div>
      <StatusMsg msg={status} />
    </div>
  );
}

function ExperienceEditor({ content, onChange, onSave, status }: EditorProps) {
  const exp = content.experience;

  const setE = (i: number, k: keyof SiteContent["experience"][number], v: string) => {
    const next = exp.map((e, idx) => idx === i ? { ...e, [k]: v } : e);
    onChange({ ...content, experience: next });
  };

  const add = () => onChange({
    ...content,
    experience: [...exp, { dateRange: "JAN 2026 —", org: "Company", role: "Role" }],
  });

  const remove = (i: number) =>
    onChange({ ...content, experience: exp.filter((_, idx) => idx !== i) });

  return (
    <div>
      <div style={S.h2}>Experience</div>
      {exp.map((e, i) => (
        <div key={i} style={S.card}>
          <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 8 }}>
            <button style={S.btnDanger} onClick={() => remove(i)}>Remove</button>
          </div>
          <div style={S.row}>
            <div style={S.field}>
              <Field label="Date range">
                <input style={S.input} value={e.dateRange} onChange={ev => setE(i, "dateRange", ev.target.value)} />
              </Field>
            </div>
            <div style={S.field}>
              <Field label="Organisation">
                <input style={S.input} value={e.org} onChange={ev => setE(i, "org", ev.target.value)} />
              </Field>
            </div>
            <div style={{ ...S.field, flex: 2 }}>
              <Field label="Role">
                <input style={S.input} value={e.role} onChange={ev => setE(i, "role", ev.target.value)} />
              </Field>
            </div>
          </div>
        </div>
      ))}
      <div style={{ display: "flex", gap: 12, marginTop: 4 }}>
        <button style={S.btn} onClick={add}>+ Add entry</button>
        <button style={S.btnPrimary} onClick={onSave}>Save Experience</button>
      </div>
      <StatusMsg msg={status} />
    </div>
  );
}

function CertsEditor({ content, onChange, onSave, status }: EditorProps) {
  const certs = content.certifications;

  const setC = (i: number, k: keyof SiteContent["certifications"][number], v: string) => {
    const next = certs.map((c, idx) => idx === i ? { ...c, [k]: v } : c);
    onChange({ ...content, certifications: next });
  };

  const add = () => onChange({
    ...content,
    certifications: [...certs, { name: "New Cert", issuer: "Issuer", label: "JAN 2026" }],
  });

  const remove = (i: number) =>
    onChange({ ...content, certifications: certs.filter((_, idx) => idx !== i) });

  return (
    <div>
      <div style={S.h2}>Certifications</div>
      {certs.map((c, i) => (
        <div key={i} style={{ ...S.card, display: "flex", gap: 12, alignItems: "flex-end" }}>
          <div style={{ flex: 2 }}>
            <label style={S.label}>Name</label>
            <input style={{ ...S.input, marginBottom: 0 }} value={c.name} onChange={e => setC(i, "name", e.target.value)} />
          </div>
          <div style={{ flex: 2 }}>
            <label style={S.label}>Issuer</label>
            <input style={{ ...S.input, marginBottom: 0 }} value={c.issuer} onChange={e => setC(i, "issuer", e.target.value)} />
          </div>
          <div style={{ flex: 1 }}>
            <label style={S.label}>Label / Date</label>
            <input style={{ ...S.input, marginBottom: 0 }} value={c.label} onChange={e => setC(i, "label", e.target.value)} />
          </div>
          <button style={{ ...S.btnDanger, marginBottom: 0 }} onClick={() => remove(i)}>Remove</button>
        </div>
      ))}
      <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
        <button style={S.btn} onClick={add}>+ Add cert</button>
        <button style={S.btnPrimary} onClick={onSave}>Save Certs</button>
      </div>
      <StatusMsg msg={status} />
    </div>
  );
}

function AchievementsEditor({ content, onChange, onSave, status }: EditorProps) {
  const ach = content.achievements;

  const setA = (i: number, k: keyof SiteContent["achievements"][number], v: string) => {
    const next = ach.map((a, idx) => idx === i ? { ...a, [k]: v } : a);
    onChange({ ...content, achievements: next });
  };

  const add = () => onChange({
    ...content,
    achievements: [...ach, { name: "PLACE", label: "EVENT NAME" }],
  });

  const remove = (i: number) =>
    onChange({ ...content, achievements: ach.filter((_, idx) => idx !== i) });

  return (
    <div>
      <div style={S.h2}>Achievements</div>
      {ach.map((a, i) => (
        <div key={i} style={{ ...S.card, display: "flex", gap: 12, alignItems: "flex-end" }}>
          <div style={{ flex: 1 }}>
            <label style={S.label}>Name / Place</label>
            <input style={{ ...S.input, marginBottom: 0 }} value={a.name} onChange={e => setA(i, "name", e.target.value)} />
          </div>
          <div style={{ flex: 2 }}>
            <label style={S.label}>Label / Event</label>
            <input style={{ ...S.input, marginBottom: 0 }} value={a.label} onChange={e => setA(i, "label", e.target.value)} />
          </div>
          <button style={{ ...S.btnDanger, marginBottom: 0 }} onClick={() => remove(i)}>Remove</button>
        </div>
      ))}
      <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
        <button style={S.btn} onClick={add}>+ Add achievement</button>
        <button style={S.btnPrimary} onClick={onSave}>Save Achievements</button>
      </div>
      <StatusMsg msg={status} />
    </div>
  );
}

function ContactEditor({ content, onChange, onSave, status }: EditorProps) {
  const c = content.contact;
  const set = (k: keyof SiteContent["contact"], v: string) =>
    onChange({ ...content, contact: { ...c, [k]: v } });

  return (
    <div>
      <div style={S.h2}>Contact</div>
      <Field label="Email">
        <input style={S.input} type="email" value={c.email} onChange={e => set("email", e.target.value)} />
      </Field>
      <Field label="GitHub URL">
        <input style={S.input} value={c.github} onChange={e => set("github", e.target.value)} />
      </Field>
      <Field label="LinkedIn URL">
        <input style={S.input} value={c.linkedin} onChange={e => set("linkedin", e.target.value)} />
      </Field>
      <div style={S.row}>
        <div style={S.field}>
          <Field label="Footer — left">
            <input style={S.input} value={c.footerLeft} onChange={e => set("footerLeft", e.target.value)} />
          </Field>
        </div>
        <div style={S.field}>
          <Field label="Footer — center">
            <input style={S.input} value={c.footerCenter} onChange={e => set("footerCenter", e.target.value)} />
          </Field>
        </div>
        <div style={S.field}>
          <Field label="Footer — right">
            <input style={S.input} value={c.footerRight} onChange={e => set("footerRight", e.target.value)} />
          </Field>
        </div>
      </div>
      <Field label="Confession text (tiny footer note)">
        <textarea style={S.textarea} value={c.confession} onChange={e => set("confession", e.target.value)} />
      </Field>
      <button style={S.btnPrimary} onClick={onSave}>Save Contact</button>
      <StatusMsg msg={status} />
    </div>
  );
}

// ── Login ─────────────────────────────────────────────────────────────────────

function Login({ onLogin }: { onLogin: (pw: string) => void }) {
  const [pw,   setPw]   = useState("");
  const [err,  setErr]  = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async () => {
    if (!pw) return;
    setBusy(true);
    setErr("");
    try {
      const res = await fetch("/api/content", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${pw}`,
        },
        body: JSON.stringify(DEFAULT_CONTENT),
      });
      if (res.status === 401) {
        setErr("Wrong password.");
        setBusy(false);
        return;
      }
      onLogin(pw);
    } catch {
      // Local dev — no D1, accept any password
      onLogin(pw);
    }
    setBusy(false);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#fff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: mono,
      }}
    >
      <div style={{ width: 360 }}>
        <div style={{ fontSize: 24, fontWeight: 700, marginBottom: 8, letterSpacing: "0.04em" }}>
          prudhvi.cms
        </div>
        <div style={{ fontSize: 11, color: "#888", marginBottom: 32, textTransform: "uppercase", letterSpacing: "0.12em" }}>
          Content management
        </div>
        <label style={S.label}>Admin password</label>
        <input
          style={{ ...S.input, marginBottom: 16 }}
          type="password"
          placeholder="Enter ADMIN_SECRET"
          value={pw}
          onChange={e => setPw(e.target.value)}
          onKeyDown={e => e.key === "Enter" && submit()}
          autoFocus
        />
        {err && <div style={{ color: "#cc3333", fontSize: 12, marginBottom: 12 }}>{err}</div>}
        <button
          style={{ ...S.btnPrimary, width: "100%", padding: "12px" }}
          onClick={submit}
          disabled={busy}
        >
          {busy ? "Checking..." : "Login"}
        </button>
      </div>
    </div>
  );
}

// ── App ───────────────────────────────────────────────────────────────────────

export default function AdminPage() {
  const [token,   setToken]   = useState("");
  const [tab,     setTab]     = useState<Tab>("hero");
  const [content, setContent] = useState<SiteContent>(DEFAULT_CONTENT);
  const [status,  setStatus]  = useState<Record<Tab, string>>({
    hero: "", disciplines: "", about: "", projects: "",
    experience: "", certs: "", achievements: "", contact: "",
  });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem("cms_token");
    if (stored) setToken(stored);
  }, []);

  const loadContent = useCallback(async () => {
    try {
      const res = await fetch("/api/content");
      if (res.ok) {
        const data = await res.json() as SiteContent;
        setContent(data);
      }
    } catch {
      // local dev — use defaults
    }
  }, []);

  useEffect(() => {
    if (token) loadContent();
  }, [token, loadContent]);

  const handleLogin = (pw: string) => {
    setToken(pw);
    localStorage.setItem("cms_token", pw);
  };

  const handleLogout = () => {
    localStorage.removeItem("cms_token");
    setToken("");
  };

  const save = useCallback(async (section: Tab) => {
    try {
      const res = await fetch("/api/content", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(content),
      });
      if (res.ok) {
        setStatus(s => ({ ...s, [section]: "Saved." }));
      } else if (res.status === 401) {
        setStatus(s => ({ ...s, [section]: "Error: unauthorized." }));
      } else {
        setStatus(s => ({ ...s, [section]: "Error saving." }));
      }
    } catch {
      setStatus(s => ({ ...s, [section]: "Saved (local — no DB)." }));
    }
    setTimeout(() => setStatus(s => ({ ...s, [section]: "" })), 3000);
  }, [token, content]);

  if (!mounted) return null;
  if (!token)   return <Login onLogin={handleLogin} />;

  const editorProps: EditorProps = {
    content,
    onChange: setContent,
    status: status[tab],
    onSave: () => save(tab),
  };

  const renderTab = () => {
    switch (tab) {
      case "hero":         return <HeroEditor        {...editorProps} onSave={() => save("hero")} />;
      case "disciplines":  return <DisciplinesEditor  {...editorProps} onSave={() => save("disciplines")} />;
      case "about":        return <AboutEditor        {...editorProps} onSave={() => save("about")} />;
      case "projects":     return <ProjectsEditor     {...editorProps} onSave={() => save("projects")} />;
      case "experience":   return <ExperienceEditor   {...editorProps} onSave={() => save("experience")} />;
      case "certs":        return <CertsEditor        {...editorProps} onSave={() => save("certs")} />;
      case "achievements": return <AchievementsEditor {...editorProps} onSave={() => save("achievements")} />;
      case "contact":      return <ContactEditor      {...editorProps} onSave={() => save("contact")} />;
    }
  };

  return (
    <div style={S.page}>
      {/* Sidebar */}
      <div style={S.sidebar}>
        <div style={S.sideTitle}>
          <div style={S.sideTitleText}>prudhvi.cms</div>
          <div style={S.sideSub}>admin panel</div>
        </div>
        {TABS.map(t => (
          <button key={t.id} style={S.sideBtn(tab === t.id)} onClick={() => setTab(t.id)}>
            {t.label}
          </button>
        ))}
        <div style={{ flex: 1 }} />
        <button
          style={{ ...S.sideBtn(false), color: "#cc4444", borderTop: "1px solid #e0e0e0", marginTop: 8 }}
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>

      {/* Main */}
      <div style={S.main}>
        <div style={S.h1}>
          {TABS.find(t => t.id === tab)?.label ?? ""}
        </div>
        {renderTab()}
      </div>
    </div>
  );
}
