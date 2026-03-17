"use client";

import { useEffect, useState, useCallback } from "react";

// ── Types ──────────────────────────────────────────────────────────────────

interface HeroData { id: number; name: string; tagline: string; typing_words: string; cta1_text: string; cta1_link: string; cta2_text: string; cta2_link: string; }
interface AboutRow { id: number; paragraph: string; sort_order: number; visible: number; }
interface ExpRow { id: number; company: string; role: string; period: string; location: string; description: string; sort_order: number; visible: number; }
interface CertRow { id: number; name: string; issuer: string; icon: string; sort_order: number; visible: number; }
interface AchRow { id: number; icon: string; title: string; event: string; date: string; sort_order: number; visible: number; }
interface WordRow { id: number; word: string; color_type: string; sort_order: number; visible: number; }
interface ContactRow { id: number; label: string; href: string; sort_order: number; visible: number; }
interface ThemeRow { id: number; accent_dark: string; accent_light: string; bg_dark: string; bg_light: string; fg_dark: string; fg_light: string; }
interface SectionRow { id: string; name: string; visible: number; sort_order: number; }

type Tab = "hero" | "about" | "experience" | "certifications" | "achievements" | "words" | "contact" | "theme" | "sections";

// ── Styles ─────────────────────────────────────────────────────────────────

const S = {
  page: { minHeight: "100vh", background: "#06080c", color: "#e8ecf4", fontFamily: "var(--font-fira-code), monospace", display: "flex" } as React.CSSProperties,
  sidebar: { width: 200, background: "rgba(255,255,255,0.03)", borderRight: "1px solid rgba(255,255,255,0.07)", padding: "1.5rem 0", display: "flex", flexDirection: "column" as const, gap: 2, flexShrink: 0 },
  main: { flex: 1, padding: "2rem", overflowY: "auto" as const, maxHeight: "100vh" },
  h1: { fontSize: 22, fontWeight: 700, color: "#00ffb4", marginBottom: "2rem", fontFamily: "var(--font-syne), sans-serif" },
  h2: { fontSize: 16, fontWeight: 600, color: "#e8ecf4", marginBottom: "1rem" },
  card: { background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 8, padding: "1.25rem", marginBottom: "0.75rem" },
  input: { width: "100%", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 6, padding: "0.5rem 0.75rem", color: "#e8ecf4", fontSize: 13, fontFamily: "inherit", outline: "none", boxSizing: "border-box" as const },
  textarea: { width: "100%", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 6, padding: "0.5rem 0.75rem", color: "#e8ecf4", fontSize: 13, fontFamily: "inherit", outline: "none", resize: "vertical" as const, minHeight: 80, boxSizing: "border-box" as const },
  btn: { padding: "0.4rem 0.9rem", borderRadius: 6, border: "1px solid rgba(255,255,255,0.15)", background: "rgba(255,255,255,0.07)", color: "#e8ecf4", fontSize: 12, cursor: "pointer", fontFamily: "inherit" },
  btnAccent: { padding: "0.4rem 0.9rem", borderRadius: 6, border: "none", background: "#00ffb4", color: "#06080c", fontSize: 12, cursor: "pointer", fontWeight: 700, fontFamily: "inherit" },
  btnDanger: { padding: "0.4rem 0.9rem", borderRadius: 6, border: "1px solid rgba(255,80,80,0.4)", background: "transparent", color: "#ff6060", fontSize: 12, cursor: "pointer", fontFamily: "inherit" },
  label: { fontSize: 11, color: "rgba(200,220,255,0.5)", marginBottom: 4, display: "block" as const, textTransform: "uppercase" as const, letterSpacing: "0.08em" },
  row: { display: "flex", gap: "0.75rem", flexWrap: "wrap" as const, marginBottom: "0.75rem" },
  field: { display: "flex", flexDirection: "column" as const, flex: 1, minWidth: 160 },
  status: (ok: boolean) => ({ fontSize: 12, color: ok ? "#00ffb4" : "#ff6060", marginTop: 8 }),
  sideBtn: (active: boolean) => ({
    padding: "0.5rem 1.25rem", background: active ? "rgba(0,255,180,0.1)" : "transparent",
    color: active ? "#00ffb4" : "rgba(200,220,255,0.5)", border: "none", cursor: "pointer",
    textAlign: "left" as const, fontSize: 13, fontFamily: "inherit", borderLeft: active ? "2px solid #00ffb4" : "2px solid transparent",
    transition: "all 0.15s",
  }),
};

// ── API helpers ─────────────────────────────────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ApiResponse = Record<string, any>;

function useApi(token: string) {
  const headers = useCallback((extra?: Record<string, string>) => ({
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
    ...extra,
  }), [token]);

  const get = useCallback(async (table: string): Promise<ApiResponse> => {
    const r = await fetch(`/api/${table}`);
    return r.json() as Promise<ApiResponse>;
  }, []);

  const post = useCallback(async (table: string, body: object): Promise<ApiResponse> => {
    const r = await fetch(`/api/${table}`, { method: "POST", headers: headers(), body: JSON.stringify(body) });
    return r.json() as Promise<ApiResponse>;
  }, [headers]);

  const put = useCallback(async (table: string, body: object): Promise<ApiResponse> => {
    const r = await fetch(`/api/${table}`, { method: "PUT", headers: headers(), body: JSON.stringify(body) });
    return r.json() as Promise<ApiResponse>;
  }, [headers]);

  const del = useCallback(async (table: string, id: number | string): Promise<ApiResponse> => {
    const r = await fetch(`/api/${table}?id=${id}`, { method: "DELETE", headers: headers() });
    return r.json() as Promise<ApiResponse>;
  }, [headers]);

  return { get, post, put, del };
}

// ── Shared list editor (for about, experience, certs, achievements, words, contact) ──

function StatusMsg({ msg }: { msg: string }) {
  if (!msg) return null;
  const ok = msg.startsWith("✓");
  return <div style={S.status(ok)}>{msg}</div>;
}

// ── Hero Editor ──────────────────────────────────────────────────────────────

function HeroEditor({ api }: { api: ReturnType<typeof useApi> }) {
  const [data, setData] = useState<HeroData | null>(null);
  const [status, setStatus] = useState("");

  useEffect(() => {
    api.get("hero").then((d) => setData((d as HeroData) || null));
  }, [api]);

  const save = async () => {
    if (!data) return;
    const r = await api.put("hero", data);
    setStatus(r.ok ? "✓ Saved" : "✗ " + (r.error ?? "Error"));
  };

  if (!data) return <div style={{ color: "#666" }}>Loading… (requires wrangler pages dev)</div>;

  return (
    <div>
      <h2 style={S.h2}>Hero</h2>
      <div style={S.card}>
        {([["name","Name"],["tagline","Tagline"]] as [keyof HeroData, string][]).map(([k,l]) => (
          <div key={k} style={{ marginBottom: "0.75rem" }}>
            <label style={S.label}>{l}</label>
            <input style={S.input} value={String(data[k])} onChange={e => setData({ ...data, [k]: e.target.value })} />
          </div>
        ))}
        <div style={{ marginBottom: "0.75rem" }}>
          <label style={S.label}>Typing Words (JSON array)</label>
          <input style={S.input} value={data.typing_words} onChange={e => setData({ ...data, typing_words: e.target.value })} />
        </div>
        <div style={S.row}>
          {([["cta1_text","CTA 1 Text"],["cta1_link","CTA 1 Link"],["cta2_text","CTA 2 Text"],["cta2_link","CTA 2 Link"]] as [keyof HeroData, string][]).map(([k,l]) => (
            <div key={k} style={S.field}>
              <label style={S.label}>{l}</label>
              <input style={S.input} value={String(data[k])} onChange={e => setData({ ...data, [k]: e.target.value })} />
            </div>
          ))}
        </div>
        <button style={S.btnAccent} onClick={save}>Save Hero</button>
        <StatusMsg msg={status} />
      </div>
    </div>
  );
}

// ── About Editor ─────────────────────────────────────────────────────────────

function AboutEditor({ api }: { api: ReturnType<typeof useApi> }) {
  const [rows, setRows] = useState<AboutRow[]>([]);
  const [status, setStatus] = useState("");

  useEffect(() => { api.get("about").then(d => setRows(d as AboutRow[])); }, [api]);

  const update = async (row: AboutRow) => {
    const r = await api.put("about", row);
    setStatus(r.ok ? "✓ Saved" : "✗ " + (r.error ?? "Error"));
  };

  const add = async () => {
    const r = await api.post("about", { paragraph: "New paragraph", sort_order: rows.length + 1, visible: 1 });
    if (r.id) api.get("about").then(d => setRows(d as AboutRow[]));
  };

  const remove = async (id: number) => {
    await api.del("about", id);
    setRows(rows.filter(r => r.id !== id));
  };

  return (
    <div>
      <h2 style={S.h2}>About Paragraphs</h2>
      {rows.map((row, i) => (
        <div key={row.id} style={S.card}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
            <span style={{ color: "#00ffb4", fontSize: 12 }}>#{i + 1}</span>
            <button style={S.btnDanger} onClick={() => remove(row.id)}>Delete</button>
          </div>
          <textarea
            style={S.textarea}
            value={row.paragraph}
            onChange={e => setRows(rows.map(r => r.id === row.id ? { ...r, paragraph: e.target.value } : r))}
          />
          <div style={{ display: "flex", gap: 8, marginTop: 8, alignItems: "center" }}>
            <button style={S.btnAccent} onClick={() => update(row)}>Save</button>
            <label style={{ ...S.label, margin: 0 }}>
              <input type="checkbox" checked={!!row.visible} onChange={e => { const updated = { ...row, visible: e.target.checked ? 1 : 0 }; setRows(rows.map(r => r.id === row.id ? updated : r)); update(updated); }} />
              {" "}Visible
            </label>
          </div>
        </div>
      ))}
      <button style={S.btn} onClick={add}>+ Add Paragraph</button>
      <StatusMsg msg={status} />
    </div>
  );
}

// ── Experience Editor ─────────────────────────────────────────────────────────

function ExperienceEditor({ api }: { api: ReturnType<typeof useApi> }) {
  const [rows, setRows] = useState<ExpRow[]>([]);
  const [status, setStatus] = useState("");

  useEffect(() => { api.get("experience").then(d => setRows(d as ExpRow[])); }, [api]);

  const update = async (row: ExpRow) => {
    const r = await api.put("experience", row);
    setStatus(r.ok ? "✓ Saved" : "✗ " + (r.error ?? "Error"));
  };

  const add = async () => {
    const r = await api.post("experience", { company: "Company", role: "Role", period: "2025", location: "Dubai", description: "", sort_order: rows.length + 1, visible: 1 });
    if (r.id) api.get("experience").then(d => setRows(d as ExpRow[]));
  };

  const remove = async (id: number) => {
    await api.del("experience", id);
    setRows(rows.filter(r => r.id !== id));
  };

  return (
    <div>
      <h2 style={S.h2}>Experience</h2>
      {rows.map(row => (
        <div key={row.id} style={S.card}>
          <div style={S.row}>
            {(["company","role","period","location"] as (keyof ExpRow)[]).map(k => (
              <div key={k} style={S.field}>
                <label style={S.label}>{k}</label>
                <input style={S.input} value={String(row[k])} onChange={e => setRows(rows.map(r => r.id === row.id ? { ...r, [k]: e.target.value } : r))} />
              </div>
            ))}
          </div>
          <div style={{ marginBottom: 8 }}>
            <label style={S.label}>Description</label>
            <textarea style={S.textarea} value={row.description} onChange={e => setRows(rows.map(r => r.id === row.id ? { ...r, description: e.target.value } : r))} />
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button style={S.btnAccent} onClick={() => update(row)}>Save</button>
            <button style={S.btnDanger} onClick={() => remove(row.id)}>Delete</button>
          </div>
        </div>
      ))}
      <button style={S.btn} onClick={add}>+ Add Entry</button>
      <StatusMsg msg={status} />
    </div>
  );
}

// ── Certifications Editor ────────────────────────────────────────────────────

function CertEditor({ api }: { api: ReturnType<typeof useApi> }) {
  const [rows, setRows] = useState<CertRow[]>([]);
  const [status, setStatus] = useState("");

  useEffect(() => { api.get("certifications").then(d => setRows(d as CertRow[])); }, [api]);

  const update = async (row: CertRow) => {
    const r = await api.put("certifications", row);
    setStatus(r.ok ? "✓ Saved" : "✗ " + (r.error ?? "Error"));
  };

  const add = async () => {
    const r = await api.post("certifications", { name: "New Cert", issuer: "Issuer", icon: "🎓", sort_order: rows.length + 1, visible: 1 });
    if (r.id) api.get("certifications").then(d => setRows(d as CertRow[]));
  };

  const remove = async (id: number) => {
    await api.del("certifications", id);
    setRows(rows.filter(r => r.id !== id));
  };

  return (
    <div>
      <h2 style={S.h2}>Certifications</h2>
      {rows.map(row => (
        <div key={row.id} style={{ ...S.card, display: "flex", gap: 8, alignItems: "center" }}>
          <input style={{ ...S.input, width: 40 }} value={row.icon} onChange={e => setRows(rows.map(r => r.id === row.id ? { ...r, icon: e.target.value } : r))} />
          <input style={S.input} placeholder="Name" value={row.name} onChange={e => setRows(rows.map(r => r.id === row.id ? { ...r, name: e.target.value } : r))} />
          <input style={S.input} placeholder="Issuer" value={row.issuer} onChange={e => setRows(rows.map(r => r.id === row.id ? { ...r, issuer: e.target.value } : r))} />
          <button style={S.btnAccent} onClick={() => update(row)}>✓</button>
          <button style={S.btnDanger} onClick={() => remove(row.id)}>✕</button>
        </div>
      ))}
      <button style={S.btn} onClick={add}>+ Add Cert</button>
      <StatusMsg msg={status} />
    </div>
  );
}

// ── Achievements Editor ──────────────────────────────────────────────────────

function AchEditor({ api }: { api: ReturnType<typeof useApi> }) {
  const [rows, setRows] = useState<AchRow[]>([]);
  const [status, setStatus] = useState("");

  useEffect(() => { api.get("achievements").then(d => setRows(d as AchRow[])); }, [api]);

  const update = async (row: AchRow) => {
    const r = await api.put("achievements", row);
    setStatus(r.ok ? "✓ Saved" : "✗ " + (r.error ?? "Error"));
  };

  const add = async () => {
    const r = await api.post("achievements", { icon: "🏆", title: "Title", event: "Event", date: "2025", sort_order: rows.length + 1, visible: 1 });
    if (r.id) api.get("achievements").then(d => setRows(d as AchRow[]));
  };

  const remove = async (id: number) => {
    await api.del("achievements", id);
    setRows(rows.filter(r => r.id !== id));
  };

  return (
    <div>
      <h2 style={S.h2}>Achievements</h2>
      {rows.map(row => (
        <div key={row.id} style={S.card}>
          <div style={S.row}>
            {(["icon","title","event","date"] as (keyof AchRow)[]).map(k => (
              <div key={k} style={S.field}>
                <label style={S.label}>{k}</label>
                <input style={S.input} value={String(row[k])} onChange={e => setRows(rows.map(r => r.id === row.id ? { ...r, [k]: e.target.value } : r))} />
              </div>
            ))}
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button style={S.btnAccent} onClick={() => update(row)}>Save</button>
            <button style={S.btnDanger} onClick={() => remove(row.id)}>Delete</button>
          </div>
        </div>
      ))}
      <button style={S.btn} onClick={add}>+ Add Achievement</button>
      <StatusMsg msg={status} />
    </div>
  );
}

// ── Word Scroll Editor ───────────────────────────────────────────────────────

function WordsEditor({ api }: { api: ReturnType<typeof useApi> }) {
  const [rows, setRows] = useState<WordRow[]>([]);
  const [status, setStatus] = useState("");

  useEffect(() => { api.get("word_scroll").then(d => setRows(d as WordRow[])); }, [api]);

  const update = async (row: WordRow) => {
    const r = await api.put("word_scroll", row);
    setStatus(r.ok ? "✓ Saved" : "✗ " + (r.error ?? "Error"));
  };

  const add = async () => {
    const r = await api.post("word_scroll", { word: "new word.", color_type: "fg", sort_order: rows.length + 1, visible: 1 });
    if (r.id) api.get("word_scroll").then(d => setRows(d as WordRow[]));
  };

  const remove = async (id: number) => {
    await api.del("word_scroll", id);
    setRows(rows.filter(r => r.id !== id));
  };

  return (
    <div>
      <h2 style={S.h2}>Word Scroll</h2>
      {rows.map(row => (
        <div key={row.id} style={{ ...S.card, display: "flex", gap: 8, alignItems: "center" }}>
          <input style={S.input} value={row.word} onChange={e => setRows(rows.map(r => r.id === row.id ? { ...r, word: e.target.value } : r))} />
          <select
            style={{ ...S.input, width: 90 }}
            value={row.color_type}
            onChange={e => setRows(rows.map(r => r.id === row.id ? { ...r, color_type: e.target.value } : r))}
          >
            <option value="fg">fg</option>
            <option value="accent">accent</option>
          </select>
          <button style={S.btnAccent} onClick={() => update(row)}>✓</button>
          <button style={S.btnDanger} onClick={() => remove(row.id)}>✕</button>
        </div>
      ))}
      <button style={S.btn} onClick={add}>+ Add Word</button>
      <StatusMsg msg={status} />
    </div>
  );
}

// ── Contact Editor ───────────────────────────────────────────────────────────

function ContactEditor({ api }: { api: ReturnType<typeof useApi> }) {
  const [rows, setRows] = useState<ContactRow[]>([]);
  const [status, setStatus] = useState("");

  useEffect(() => { api.get("contact_links").then(d => setRows(d as ContactRow[])); }, [api]);

  const update = async (row: ContactRow) => {
    const r = await api.put("contact_links", row);
    setStatus(r.ok ? "✓ Saved" : "✗ " + (r.error ?? "Error"));
  };

  const add = async () => {
    const r = await api.post("contact_links", { label: "Link", href: "https://", sort_order: rows.length + 1, visible: 1 });
    if (r.id) api.get("contact_links").then(d => setRows(d as ContactRow[]));
  };

  const remove = async (id: number) => {
    await api.del("contact_links", id);
    setRows(rows.filter(r => r.id !== id));
  };

  return (
    <div>
      <h2 style={S.h2}>Contact Links</h2>
      {rows.map(row => (
        <div key={row.id} style={{ ...S.card, display: "flex", gap: 8, alignItems: "center" }}>
          <input style={{ ...S.input, width: 100 }} placeholder="Label" value={row.label} onChange={e => setRows(rows.map(r => r.id === row.id ? { ...r, label: e.target.value } : r))} />
          <input style={S.input} placeholder="href" value={row.href} onChange={e => setRows(rows.map(r => r.id === row.id ? { ...r, href: e.target.value } : r))} />
          <button style={S.btnAccent} onClick={() => update(row)}>✓</button>
          <button style={S.btnDanger} onClick={() => remove(row.id)}>✕</button>
        </div>
      ))}
      <button style={S.btn} onClick={add}>+ Add Link</button>
      <StatusMsg msg={status} />
    </div>
  );
}

// ── Theme Editor ─────────────────────────────────────────────────────────────

function ThemeEditor({ api }: { api: ReturnType<typeof useApi> }) {
  const [data, setData] = useState<ThemeRow | null>(null);
  const [status, setStatus] = useState("");

  useEffect(() => { api.get("theme").then(d => setData((d as ThemeRow) || null)); }, [api]);

  const save = async () => {
    if (!data) return;
    const r = await api.put("theme", data);
    setStatus(r.ok ? "✓ Saved" : "✗ " + (r.error ?? "Error"));
  };

  if (!data) return <div style={{ color: "#666" }}>Loading…</div>;

  const fields: [keyof ThemeRow, string][] = [
    ["accent_dark","Accent (dark)"],["accent_light","Accent (light)"],
    ["bg_dark","Background (dark)"],["bg_light","Background (light)"],
    ["fg_dark","Text (dark)"],["fg_light","Text (light)"],
  ];

  return (
    <div>
      <h2 style={S.h2}>Theme Colors</h2>
      <div style={S.card}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
          {fields.map(([k, l]) => (
            <div key={k}>
              <label style={S.label}>{l}</label>
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <input type="color" value={String(data[k])} onChange={e => setData({ ...data, [k]: e.target.value })}
                  style={{ width: 36, height: 32, border: "none", background: "none", cursor: "pointer", padding: 0 }} />
                <input style={S.input} value={String(data[k])} onChange={e => setData({ ...data, [k]: e.target.value })} />
                <div style={{ width: 24, height: 24, borderRadius: 4, background: String(data[k]), flexShrink: 0 }} />
              </div>
            </div>
          ))}
        </div>
        <button style={{ ...S.btnAccent, marginTop: "1rem" }} onClick={save}>Save Theme</button>
        <StatusMsg msg={status} />
      </div>
    </div>
  );
}

// ── Sections Editor ──────────────────────────────────────────────────────────

function SectionsEditor({ api }: { api: ReturnType<typeof useApi> }) {
  const [rows, setRows] = useState<SectionRow[]>([]);
  const [status, setStatus] = useState("");

  useEffect(() => { api.get("sections").then(d => setRows(d as SectionRow[])); }, [api]);

  const update = async (row: SectionRow) => {
    const r = await api.put("sections", row);
    setStatus(r.ok ? "✓ Saved" : "✗ " + (r.error ?? "Error"));
  };

  return (
    <div>
      <h2 style={S.h2}>Section Visibility</h2>
      {rows.map(row => (
        <div key={row.id} style={{ ...S.card, display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ flex: 1, fontSize: 14 }}>{row.name}</span>
          <span style={{ fontSize: 12, color: "#666" }}>order: </span>
          <input style={{ ...S.input, width: 50 }} type="number" value={row.sort_order}
            onChange={e => setRows(rows.map(r => r.id === row.id ? { ...r, sort_order: +e.target.value } : r))} />
          <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, cursor: "pointer" }}>
            <input type="checkbox" checked={!!row.visible}
              onChange={e => { const updated = { ...row, visible: e.target.checked ? 1 : 0 }; setRows(rows.map(r => r.id === row.id ? updated : r)); update(updated); }} />
            Visible
          </label>
          <button style={S.btnAccent} onClick={() => update(row)}>Save</button>
        </div>
      ))}
      <StatusMsg msg={status} />
    </div>
  );
}

// ── Login ──────────────────────────────────────────────────────────────────

function Login({ onLogin }: { onLogin: (t: string) => void }) {
  const [pw, setPw] = useState("");
  return (
    <div style={{ minHeight: "100vh", background: "#06080c", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ ...S.card, width: 320, textAlign: "center" as const }}>
        <div style={{ fontSize: 28, marginBottom: 8 }}>🔐</div>
        <h1 style={{ color: "#00ffb4", fontSize: 18, marginBottom: 20, fontFamily: "var(--font-syne)" }}>Admin</h1>
        <input
          style={S.input}
          type="password"
          placeholder="Enter password"
          value={pw}
          onChange={e => setPw(e.target.value)}
          onKeyDown={e => e.key === "Enter" && onLogin(pw)}
        />
        <button style={{ ...S.btnAccent, width: "100%", marginTop: 12, padding: "0.6rem" }} onClick={() => onLogin(pw)}>
          Login
        </button>
      </div>
    </div>
  );
}

// ── App ────────────────────────────────────────────────────────────────────

const TABS: { id: Tab; label: string }[] = [
  { id: "hero",          label: "Hero"          },
  { id: "about",         label: "About"         },
  { id: "experience",    label: "Experience"    },
  { id: "certifications",label: "Certs"         },
  { id: "achievements",  label: "Achievements"  },
  { id: "words",         label: "Words"         },
  { id: "contact",       label: "Contact"       },
  { id: "theme",         label: "Theme"         },
  { id: "sections",      label: "Sections"      },
];

export default function AdminPage() {
  const [token, setToken] = useState("");
  const [tab, setTab]     = useState<Tab>("hero");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem("admin_token");
    if (stored) setToken(stored);
  }, []);

  const handleLogin = (pw: string) => {
    setToken(pw);
    localStorage.setItem("admin_token", pw);
  };

  const api = useApi(token);

  if (!mounted) return null;
  if (!token) return <Login onLogin={handleLogin} />;

  const renderTab = () => {
    switch (tab) {
      case "hero":          return <HeroEditor api={api} />;
      case "about":         return <AboutEditor api={api} />;
      case "experience":    return <ExperienceEditor api={api} />;
      case "certifications":return <CertEditor api={api} />;
      case "achievements":  return <AchEditor api={api} />;
      case "words":         return <WordsEditor api={api} />;
      case "contact":       return <ContactEditor api={api} />;
      case "theme":         return <ThemeEditor api={api} />;
      case "sections":      return <SectionsEditor api={api} />;
    }
  };

  return (
    <div style={S.page}>
      <div style={S.sidebar}>
        <div style={{ padding: "0 1.25rem 1rem", borderBottom: "1px solid rgba(255,255,255,0.07)", marginBottom: 8 }}>
          <div style={{ color: "#00ffb4", fontWeight: 700, fontSize: 14 }}>prudhvi.cms</div>
          <div style={{ color: "#444", fontSize: 11, marginTop: 2 }}>admin panel</div>
        </div>
        {TABS.map(t => (
          <button key={t.id} style={S.sideBtn(tab === t.id)} onClick={() => setTab(t.id)}>
            {t.label}
          </button>
        ))}
        <div style={{ flex: 1 }} />
        <button
          style={{ ...S.sideBtn(false), color: "#ff6060", marginTop: "auto" }}
          onClick={() => { localStorage.removeItem("admin_token"); setToken(""); }}
        >
          Logout
        </button>
      </div>
      <div style={S.main}>
        <h1 style={S.h1}>prudhvi.cms</h1>
        {renderTab()}
      </div>
    </div>
  );
}
