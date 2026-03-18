"use client";

import { useEffect, useState, useCallback, useRef } from "react";

// ── Types ─────────────────────────────────────────────────────────────────────

interface HeroData    { id: number; name: string; tagline: string; typing_words: string; cta1_text: string; cta1_link: string; cta2_text: string; cta2_link: string; background_image: string; }
interface AboutRow    { id: number; paragraph: string; sort_order: number; visible: number; profile_image: string; }
interface ExpRow      { id: number; company: string; role: string; period: string; location: string; description: string; sort_order: number; visible: number; }
interface CertRow     { id: number; name: string; issuer: string; icon: string; sort_order: number; visible: number; }
interface AchRow      { id: number; icon: string; title: string; event: string; date: string; sort_order: number; visible: number; }
interface WordRow     { id: number; word: string; color_type: string; sort_order: number; visible: number; }
interface ContactRow  { id: number; label: string; href: string; sort_order: number; visible: number; }
interface ThemeRow    { id: number; accent_dark: string; accent_light: string; bg_dark: string; bg_light: string; fg_dark: string; fg_light: string; }
interface SectionRow  { id: string; name: string; visible: number; sort_order: number; }
interface ProjectRow  { id: number; title: string; description: string; icon_name: string; cta_text: string; link_url: string; cover_image: string; sort_order: number; visible: number; }
interface MediaFile   { key: string; size: number; uploaded: string; url: string; }

type Tab = "hero" | "about" | "projects" | "experience" | "certifications" | "achievements" | "words" | "contact" | "theme" | "sections" | "media";

// ── Styles ────────────────────────────────────────────────────────────────────

const S = {
  page:      { minHeight: "100vh", background: "#06080c", color: "#e8ecf4", fontFamily: "var(--font-fira-code), monospace", display: "flex" } as React.CSSProperties,
  sidebar:   { width: 200, background: "rgba(255,255,255,0.03)", borderRight: "1px solid rgba(255,255,255,0.07)", padding: "1.5rem 0", display: "flex", flexDirection: "column" as const, gap: 2, flexShrink: 0 },
  main:      { flex: 1, padding: "2rem", overflowY: "auto" as const, maxHeight: "100vh" },
  h1:        { fontSize: 22, fontWeight: 700, color: "#00ffb4", marginBottom: "2rem", fontFamily: "var(--font-syne), sans-serif" },
  h2:        { fontSize: 16, fontWeight: 600, color: "#e8ecf4", marginBottom: "1rem" },
  card:      { background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 8, padding: "1.25rem", marginBottom: "0.75rem" },
  input:     { width: "100%", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 6, padding: "0.5rem 0.75rem", color: "#e8ecf4", fontSize: 13, fontFamily: "inherit", outline: "none", boxSizing: "border-box" as const },
  textarea:  { width: "100%", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 6, padding: "0.5rem 0.75rem", color: "#e8ecf4", fontSize: 13, fontFamily: "inherit", outline: "none", resize: "vertical" as const, minHeight: 80, boxSizing: "border-box" as const },
  btn:       { padding: "0.4rem 0.9rem", borderRadius: 6, border: "1px solid rgba(255,255,255,0.15)", background: "rgba(255,255,255,0.07)", color: "#e8ecf4", fontSize: 12, cursor: "pointer", fontFamily: "inherit" },
  btnAccent: { padding: "0.4rem 0.9rem", borderRadius: 6, border: "none", background: "#00ffb4", color: "#06080c", fontSize: 12, cursor: "pointer", fontWeight: 700, fontFamily: "inherit" },
  btnDanger: { padding: "0.4rem 0.9rem", borderRadius: 6, border: "1px solid rgba(255,80,80,0.4)", background: "transparent", color: "#ff6060", fontSize: 12, cursor: "pointer", fontFamily: "inherit" },
  label:     { fontSize: 11, color: "rgba(200,220,255,0.5)", marginBottom: 4, display: "block" as const, textTransform: "uppercase" as const, letterSpacing: "0.08em" },
  row:       { display: "flex", gap: "0.75rem", flexWrap: "wrap" as const, marginBottom: "0.75rem" },
  field:     { display: "flex", flexDirection: "column" as const, flex: 1, minWidth: 160 },
  status:    (ok: boolean) => ({ fontSize: 12, color: ok ? "#00ffb4" : "#ff6060", marginTop: 8 }),
  sideBtn:   (active: boolean) => ({
    padding: "0.5rem 1.25rem", background: active ? "rgba(0,255,180,0.1)" : "transparent",
    color: active ? "#00ffb4" : "rgba(200,220,255,0.5)", border: "none", cursor: "pointer",
    textAlign: "left" as const, fontSize: 13, fontFamily: "inherit",
    borderLeft: active ? "2px solid #00ffb4" : "2px solid transparent", transition: "all 0.15s",
  }),
};

// ── Upload helper ─────────────────────────────────────────────────────────────

async function uploadFile(file: File, token: string): Promise<{ url?: string; error?: string }> {
  const form = new FormData();
  form.append("file", file);
  const res = await fetch("/api/media", { method: "POST", headers: { Authorization: `Bearer ${token}` }, body: form });
  return res.json() as Promise<{ url?: string; error?: string }>;
}

// ── ImageUpload component ─────────────────────────────────────────────────────

function ImageUpload({ value, onChange, token }: { value: string; onChange: (url: string) => void; token: string }) {
  const [uploading, setUploading] = useState(false);
  const [msg,       setMsg]       = useState("");

  const handleFile = async (file: File) => {
    setUploading(true);
    const res = await uploadFile(file, token);
    if (res.url) { onChange(res.url); setMsg("✓ Uploaded"); }
    else          setMsg("✗ " + (res.error ?? "Upload failed"));
    setUploading(false);
  };

  return (
    <div>
      {value && (
        <div style={{ marginBottom: 8 }}>
          <img src={value} alt="" style={{ maxWidth: 220, maxHeight: 130, borderRadius: 6, border: "1px solid rgba(255,255,255,0.1)", display: "block" }} />
          <div style={{ fontSize: 10, color: "#666", marginTop: 4, wordBreak: "break-all" }}>{value}</div>
        </div>
      )}
      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
        <label style={{ ...S.btn, cursor: "pointer", display: "inline-block" }}>
          {uploading ? "Uploading\u2026" : "Choose File"}
          <input type="file" accept="image/*" style={{ display: "none" }}
            onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />
        </label>
        {value && <button style={S.btnDanger} onClick={() => { onChange(""); setMsg(""); }}>Clear</button>}
      </div>
      {msg && <div style={{ fontSize: 11, color: msg.startsWith("\u2713") ? "#00ffb4" : "#ff6060", marginTop: 4 }}>{msg}</div>}
    </div>
  );
}

// ── API helpers ───────────────────────────────────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ApiResponse = Record<string, any>;

function useApi(token: string) {
  const headers = useCallback((extra?: Record<string, string>) => ({
    "Content-Type": "application/json",
    Authorization:  `Bearer ${token}`,
    ...extra,
  }), [token]);

  const get  = useCallback(async (table: string): Promise<ApiResponse> => {
    const r = await fetch(`/api/${table}`);
    return r.json() as Promise<ApiResponse>;
  }, []);

  const post = useCallback(async (table: string, body: object): Promise<ApiResponse> => {
    const r = await fetch(`/api/${table}`, { method: "POST", headers: headers(), body: JSON.stringify(body) });
    return r.json() as Promise<ApiResponse>;
  }, [headers]);

  const put  = useCallback(async (table: string, body: object): Promise<ApiResponse> => {
    const r = await fetch(`/api/${table}`, { method: "PUT", headers: headers(), body: JSON.stringify(body) });
    return r.json() as Promise<ApiResponse>;
  }, [headers]);

  const del  = useCallback(async (table: string, id: number | string): Promise<ApiResponse> => {
    const r = await fetch(`/api/${table}?id=${id}`, { method: "DELETE", headers: headers() });
    return r.json() as Promise<ApiResponse>;
  }, [headers]);

  return { get, post, put, del };
}

function StatusMsg({ msg }: { msg: string }) {
  if (!msg) return null;
  return <div style={S.status(msg.startsWith("\u2713"))}>{msg}</div>;
}

// ── Hero Editor ───────────────────────────────────────────────────────────────

function HeroEditor({ api, token }: { api: ReturnType<typeof useApi>; token: string }) {
  const [data,   setData]   = useState<HeroData | null>(null);
  const [status, setStatus] = useState("");

  useEffect(() => { api.get("hero").then(d => setData((d as HeroData) || null)); }, [api]);

  const save = async () => {
    if (!data) return;
    const r = await api.put("hero", data);
    setStatus(r.ok ? "\u2713 Saved" : "\u2717 " + (r.error ?? "Error"));
  };

  if (!data) return <div style={{ color: "#666" }}>Loading\u2026 (requires wrangler pages dev)</div>;

  return (
    <div>
      <h2 style={S.h2}>Hero</h2>
      <div style={S.card}>
        {(["name", "tagline"] as (keyof HeroData)[]).map(k => (
          <div key={k} style={{ marginBottom: "0.75rem" }}>
            <label style={S.label}>{k}</label>
            <input style={S.input} value={String(data[k])} onChange={e => setData({ ...data, [k]: e.target.value })} />
          </div>
        ))}
        <div style={{ marginBottom: "0.75rem" }}>
          <label style={S.label}>Typing Words (comma-separated or JSON array)</label>
          <input style={S.input} value={data.typing_words} onChange={e => setData({ ...data, typing_words: e.target.value })} />
        </div>
        <div style={S.row}>
          {(["cta1_text", "cta1_link", "cta2_text", "cta2_link"] as (keyof HeroData)[]).map(k => (
            <div key={k} style={S.field}>
              <label style={S.label}>{k}</label>
              <input style={S.input} value={String(data[k])} onChange={e => setData({ ...data, [k]: e.target.value })} />
            </div>
          ))}
        </div>
        <div style={{ marginBottom: "0.75rem" }}>
          <label style={S.label}>Background Image</label>
          <ImageUpload value={data.background_image ?? ""} onChange={url => setData({ ...data, background_image: url })} token={token} />
        </div>
        <button style={S.btnAccent} onClick={save}>Save Hero</button>
        <StatusMsg msg={status} />
      </div>
    </div>
  );
}

// ── About Editor ──────────────────────────────────────────────────────────────

function AboutEditor({ api, token }: { api: ReturnType<typeof useApi>; token: string }) {
  const [rows,         setRows]         = useState<AboutRow[]>([]);
  const [profileImage, setProfileImage] = useState("");
  const [status,       setStatus]       = useState("");

  useEffect(() => {
    api.get("about").then(d => {
      const r = d as AboutRow[];
      setRows(r);
      if (r[0]?.profile_image) setProfileImage(r[0].profile_image);
    });
  }, [api]);

  const saveProfileImage = async () => {
    if (!rows[0]) return;
    const r = await api.put("about", { ...rows[0], profile_image: profileImage });
    setStatus(r.ok ? "\u2713 Image saved" : "\u2717 Error");
  };

  const update = async (row: AboutRow) => {
    const r = await api.put("about", row);
    setStatus(r.ok ? "\u2713 Saved" : "\u2717 " + (r.error ?? "Error"));
  };

  const add = async () => {
    const r = await api.post("about", { paragraph: "New paragraph.", sort_order: rows.length + 1, visible: 1, profile_image: "" });
    if (r.id) api.get("about").then(d => setRows(d as AboutRow[]));
  };

  const remove = async (id: number) => {
    await api.del("about", id);
    setRows(rows.filter(r => r.id !== id));
  };

  return (
    <div>
      <h2 style={S.h2}>About</h2>
      <div style={S.card}>
        <label style={S.label}>Profile Image (replaces ASCII portrait when set)</label>
        <ImageUpload value={profileImage} onChange={setProfileImage} token={token} />
        <button style={{ ...S.btnAccent, marginTop: 10 }} onClick={saveProfileImage}>Save Image</button>
      </div>
      <h2 style={{ ...S.h2, marginTop: "1.5rem" }}>Paragraphs</h2>
      {rows.map((row, i) => (
        <div key={row.id} style={S.card}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
            <span style={{ color: "#00ffb4", fontSize: 12 }}>#{i + 1}</span>
            <button style={S.btnDanger} onClick={() => remove(row.id)}>Delete</button>
          </div>
          <textarea style={S.textarea} value={row.paragraph}
            onChange={e => setRows(rows.map(r => r.id === row.id ? { ...r, paragraph: e.target.value } : r))} />
          <div style={{ display: "flex", gap: 8, marginTop: 8, alignItems: "center" }}>
            <button style={S.btnAccent} onClick={() => update(row)}>Save</button>
            <label style={{ ...S.label, margin: 0, cursor: "pointer" }}>
              <input type="checkbox" checked={!!row.visible}
                onChange={e => { const u = { ...row, visible: e.target.checked ? 1 : 0 }; setRows(rows.map(r => r.id === row.id ? u : r)); update(u); }} />
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

// ── Projects Editor ───────────────────────────────────────────────────────────

const ICON_OPTIONS = ["Shield", "Cloud", "Lock", "Key", "AlertTriangle", "Globe", "Terminal", "Code2", "Database", "Server", "Wifi", "Monitor", "Cpu", "Zap", "Eye", "Box"];

function ProjectsEditor({ api, token }: { api: ReturnType<typeof useApi>; token: string }) {
  const [rows,   setRows]   = useState<ProjectRow[]>([]);
  const [status, setStatus] = useState("");

  useEffect(() => { api.get("projects").then(d => setRows(d as ProjectRow[])); }, [api]);

  const update = async (row: ProjectRow) => {
    const r = await api.put("projects", row);
    setStatus(r.ok ? "\u2713 Saved" : "\u2717 " + (r.error ?? "Error"));
  };

  const add = async () => {
    const r = await api.post("projects", { title: "New Project", description: "", icon_name: "Shield", cta_text: "View on GitHub", link_url: "", cover_image: "", sort_order: rows.length + 1, visible: 1 });
    if (r.id) api.get("projects").then(d => setRows(d as ProjectRow[]));
  };

  const remove = async (id: number) => {
    await api.del("projects", id);
    setRows(rows.filter(r => r.id !== id));
  };

  return (
    <div>
      <h2 style={S.h2}>Projects</h2>
      {rows.map(row => (
        <div key={row.id} style={S.card}>
          <div style={S.row}>
            <div style={S.field}>
              <label style={S.label}>Title</label>
              <input style={S.input} value={row.title} onChange={e => setRows(rows.map(r => r.id === row.id ? { ...r, title: e.target.value } : r))} />
            </div>
            <div style={{ ...S.field, flex: "0 0 155px", minWidth: 0 }}>
              <label style={S.label}>Icon</label>
              <select style={S.input} value={row.icon_name}
                onChange={e => setRows(rows.map(r => r.id === row.id ? { ...r, icon_name: e.target.value } : r))}>
                {ICON_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
              </select>
            </div>
            <div style={{ ...S.field, flex: "0 0 65px", minWidth: 0 }}>
              <label style={S.label}>Order</label>
              <input style={S.input} type="number" value={row.sort_order}
                onChange={e => setRows(rows.map(r => r.id === row.id ? { ...r, sort_order: +e.target.value } : r))} />
            </div>
          </div>
          <div style={{ marginBottom: "0.75rem" }}>
            <label style={S.label}>Description</label>
            <textarea style={{ ...S.textarea, minHeight: 90 }} value={row.description}
              onChange={e => setRows(rows.map(r => r.id === row.id ? { ...r, description: e.target.value } : r))} />
          </div>
          <div style={S.row}>
            <div style={S.field}>
              <label style={S.label}>CTA Text</label>
              <input style={S.input} value={row.cta_text} onChange={e => setRows(rows.map(r => r.id === row.id ? { ...r, cta_text: e.target.value } : r))} />
            </div>
            <div style={{ ...S.field, flex: 2 }}>
              <label style={S.label}>Link URL</label>
              <input style={S.input} value={row.link_url} onChange={e => setRows(rows.map(r => r.id === row.id ? { ...r, link_url: e.target.value } : r))} />
            </div>
          </div>
          <div style={{ marginBottom: "0.75rem" }}>
            <label style={S.label}>Cover Image</label>
            <ImageUpload value={row.cover_image} onChange={url => setRows(rows.map(r => r.id === row.id ? { ...r, cover_image: url } : r))} token={token} />
          </div>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <button style={S.btnAccent} onClick={() => update(row)}>Save</button>
            <button style={S.btnDanger} onClick={() => remove(row.id)}>Delete</button>
            <label style={{ fontSize: 12, display: "flex", alignItems: "center", gap: 4, color: "#aaa", cursor: "pointer" }}>
              <input type="checkbox" checked={!!row.visible}
                onChange={e => { const u = { ...row, visible: e.target.checked ? 1 : 0 }; setRows(rows.map(r => r.id === row.id ? u : r)); update(u); }} />
              Visible
            </label>
          </div>
        </div>
      ))}
      <button style={S.btn} onClick={add}>+ Add Project</button>
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
    setStatus(r.ok ? "\u2713 Saved" : "\u2717 " + (r.error ?? "Error"));
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
            {(["company", "role", "period", "location"] as (keyof ExpRow)[]).map(k => (
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

// ── Certifications Editor ─────────────────────────────────────────────────────

function CertEditor({ api }: { api: ReturnType<typeof useApi> }) {
  const [rows, setRows] = useState<CertRow[]>([]);
  const [status, setStatus] = useState("");

  useEffect(() => { api.get("certifications").then(d => setRows(d as CertRow[])); }, [api]);

  const update = async (row: CertRow) => {
    const r = await api.put("certifications", row);
    setStatus(r.ok ? "\u2713 Saved" : "\u2717 " + (r.error ?? "Error"));
  };

  const add = async () => {
    const r = await api.post("certifications", { name: "New Cert", issuer: "Issuer", icon: "\U0001f393", sort_order: rows.length + 1, visible: 1 });
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
          <input style={{ ...S.input, width: 44 }} value={row.icon} onChange={e => setRows(rows.map(r => r.id === row.id ? { ...r, icon: e.target.value } : r))} />
          <input style={S.input} placeholder="Name"   value={row.name}   onChange={e => setRows(rows.map(r => r.id === row.id ? { ...r, name:   e.target.value } : r))} />
          <input style={S.input} placeholder="Issuer" value={row.issuer} onChange={e => setRows(rows.map(r => r.id === row.id ? { ...r, issuer: e.target.value } : r))} />
          <button style={S.btnAccent} onClick={() => update(row)}>\u2713</button>
          <button style={S.btnDanger} onClick={() => remove(row.id)}>\u2715</button>
        </div>
      ))}
      <button style={S.btn} onClick={add}>+ Add Cert</button>
      <StatusMsg msg={status} />
    </div>
  );
}

// ── Achievements Editor ───────────────────────────────────────────────────────

function AchEditor({ api }: { api: ReturnType<typeof useApi> }) {
  const [rows, setRows] = useState<AchRow[]>([]);
  const [status, setStatus] = useState("");

  useEffect(() => { api.get("achievements").then(d => setRows(d as AchRow[])); }, [api]);

  const update = async (row: AchRow) => {
    const r = await api.put("achievements", row);
    setStatus(r.ok ? "\u2713 Saved" : "\u2717 " + (r.error ?? "Error"));
  };

  const add = async () => {
    const r = await api.post("achievements", { icon: "\U0001f3c6", title: "Title", event: "Event", date: "2025", sort_order: rows.length + 1, visible: 1 });
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
            {(["icon", "title", "event", "date"] as (keyof AchRow)[]).map(k => (
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

// ── Word Scroll Editor ────────────────────────────────────────────────────────

function WordsEditor({ api }: { api: ReturnType<typeof useApi> }) {
  const [rows, setRows] = useState<WordRow[]>([]);
  const [status, setStatus] = useState("");

  useEffect(() => { api.get("word_scroll").then(d => setRows(d as WordRow[])); }, [api]);

  const update = async (row: WordRow) => {
    const r = await api.put("word_scroll", row);
    setStatus(r.ok ? "\u2713 Saved" : "\u2717 " + (r.error ?? "Error"));
  };

  const add = async () => {
    const r = await api.post("word_scroll", { word: "new word.", color_type: "text", sort_order: rows.length + 1, visible: 1 });
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
          <select style={{ ...S.input, width: 100 }} value={row.color_type}
            onChange={e => setRows(rows.map(r => r.id === row.id ? { ...r, color_type: e.target.value } : r))}>
            <option value="text">text</option>
            <option value="accent">accent</option>
          </select>
          <button style={S.btnAccent} onClick={() => update(row)}>\u2713</button>
          <button style={S.btnDanger} onClick={() => remove(row.id)}>\u2715</button>
        </div>
      ))}
      <button style={S.btn} onClick={add}>+ Add Word</button>
      <StatusMsg msg={status} />
    </div>
  );
}

// ── Contact Editor ────────────────────────────────────────────────────────────

function ContactEditor({ api }: { api: ReturnType<typeof useApi> }) {
  const [rows, setRows] = useState<ContactRow[]>([]);
  const [status, setStatus] = useState("");

  useEffect(() => { api.get("contact_links").then(d => setRows(d as ContactRow[])); }, [api]);

  const update = async (row: ContactRow) => {
    const r = await api.put("contact_links", row);
    setStatus(r.ok ? "\u2713 Saved" : "\u2717 " + (r.error ?? "Error"));
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
          <input style={{ ...S.input, width: 110 }} placeholder="Label" value={row.label} onChange={e => setRows(rows.map(r => r.id === row.id ? { ...r, label: e.target.value } : r))} />
          <input style={S.input} placeholder="href" value={row.href} onChange={e => setRows(rows.map(r => r.id === row.id ? { ...r, href: e.target.value } : r))} />
          <button style={S.btnAccent} onClick={() => update(row)}>\u2713</button>
          <button style={S.btnDanger} onClick={() => remove(row.id)}>\u2715</button>
        </div>
      ))}
      <button style={S.btn} onClick={add}>+ Add Link</button>
      <StatusMsg msg={status} />
    </div>
  );
}

// ── Theme Editor ──────────────────────────────────────────────────────────────

function ThemeEditor({ api }: { api: ReturnType<typeof useApi> }) {
  const [data, setData] = useState<ThemeRow | null>(null);
  const [status, setStatus] = useState("");

  useEffect(() => { api.get("theme").then(d => setData((d as ThemeRow) || null)); }, [api]);

  const save = async () => {
    if (!data) return;
    const r = await api.put("theme", data);
    setStatus(r.ok ? "\u2713 Saved" : "\u2717 " + (r.error ?? "Error"));
  };

  if (!data) return <div style={{ color: "#666" }}>Loading\u2026</div>;

  const fields: [keyof ThemeRow, string][] = [
    ["accent_dark",  "Accent (dark)"],  ["accent_light", "Accent (light)"],
    ["bg_dark",      "Background (dark)"], ["bg_light",  "Background (light)"],
    ["fg_dark",      "Text (dark)"],    ["fg_light",     "Text (light)"],
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
                <div style={{ width: 24, height: 24, borderRadius: 4, background: String(data[k]), flexShrink: 0, border: "1px solid rgba(255,255,255,0.1)" }} />
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

// ── Sections Editor ───────────────────────────────────────────────────────────

function SectionsEditor({ api }: { api: ReturnType<typeof useApi> }) {
  const [rows, setRows] = useState<SectionRow[]>([]);
  const [status, setStatus] = useState("");

  useEffect(() => { api.get("sections").then(d => setRows(d as SectionRow[])); }, [api]);

  const update = async (row: SectionRow) => {
    const r = await api.put("sections", row);
    setStatus(r.ok ? "\u2713 Saved" : "\u2717 " + (r.error ?? "Error"));
  };

  return (
    <div>
      <h2 style={S.h2}>Section Visibility</h2>
      {rows.map(row => (
        <div key={row.id} style={{ ...S.card, display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ flex: 1, fontSize: 14 }}>{row.name}</span>
          <span style={{ fontSize: 12, color: "#666" }}>order:</span>
          <input style={{ ...S.input, width: 50 }} type="number" value={row.sort_order}
            onChange={e => setRows(rows.map(r => r.id === row.id ? { ...r, sort_order: +e.target.value } : r))} />
          <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, cursor: "pointer", color: "#aaa" }}>
            <input type="checkbox" checked={!!row.visible}
              onChange={e => { const u = { ...row, visible: e.target.checked ? 1 : 0 }; setRows(rows.map(r => r.id === row.id ? u : r)); update(u); }} />
            Visible
          </label>
          <button style={S.btnAccent} onClick={() => update(row)}>Save</button>
        </div>
      ))}
      <StatusMsg msg={status} />
    </div>
  );
}

// ── Media Library ─────────────────────────────────────────────────────────────

function MediaEditor({ token }: { token: string }) {
  const [files,     setFiles]     = useState<MediaFile[]>([]);
  const [uploading, setUploading] = useState(false);
  const [status,    setStatus]    = useState("");
  const [copied,    setCopied]    = useState<string | null>(null);
  const fileInputRef              = useRef<HTMLInputElement>(null);

  const load = useCallback(async () => {
    const r = await fetch("/api/media", { headers: { Authorization: `Bearer ${token}` } });
    if (r.ok) setFiles(await r.json() as MediaFile[]);
  }, [token]);

  useEffect(() => { load(); }, [load]);

  const handleFiles = async (list: FileList) => {
    setUploading(true);
    for (const file of Array.from(list)) {
      const form = new FormData();
      form.append("file", file);
      await fetch("/api/media", { method: "POST", headers: { Authorization: `Bearer ${token}` }, body: form });
    }
    await load();
    setUploading(false);
    setStatus("\u2713 Upload complete");
  };

  const deleteFile = async (key: string) => {
    await fetch(`/api/media?key=${encodeURIComponent(key)}`, { method: "DELETE", headers: { Authorization: `Bearer ${token}` } });
    setFiles(f => f.filter(x => x.key !== key));
  };

  const copyUrl = (url: string) => {
    navigator.clipboard.writeText(url).catch(() => {});
    setCopied(url);
    setTimeout(() => setCopied(null), 2000);
  };

  const isImage = (key: string) => /\.(jpg|jpeg|png|gif|webp|svg|avif)$/i.test(key);

  return (
    <div>
      <h2 style={S.h2}>Media Library</h2>
      <div
        style={{ border: "2px dashed rgba(0,255,180,0.3)", borderRadius: 8, padding: "2rem", textAlign: "center", marginBottom: "1.25rem", cursor: "pointer" }}
        onClick={() => fileInputRef.current?.click()}
        onDragOver={e => e.preventDefault()}
        onDrop={e => { e.preventDefault(); if (e.dataTransfer.files.length) handleFiles(e.dataTransfer.files); }}
      >
        <input ref={fileInputRef} type="file" multiple accept="image/*,.pdf" style={{ display: "none" }}
          onChange={e => { if (e.target.files?.length) handleFiles(e.target.files); }} />
        <div style={{ color: "#00ffb4", fontSize: 14 }}>
          {uploading ? "Uploading\u2026" : "Click or drag files to upload"}
        </div>
        <div style={{ color: "#555", fontSize: 12, marginTop: 4 }}>
          Requires R2 bucket — enable in Cloudflare dashboard first
        </div>
      </div>
      <StatusMsg msg={status} />
      {files.length === 0 ? (
        <div style={{ color: "#555", fontSize: 13, marginTop: "1rem" }}>No files in bucket yet.</div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: "0.75rem", marginTop: "1rem" }}>
          {files.map(f => (
            <div key={f.key} style={{ ...S.card, padding: "0.75rem" }}>
              {isImage(f.key) ? (
                <img src={f.url} alt="" style={{ width: "100%", height: 90, objectFit: "cover", borderRadius: 4, marginBottom: 8, display: "block" }} />
              ) : (
                <div style={{ width: "100%", height: 90, background: "rgba(255,255,255,0.04)", borderRadius: 4, marginBottom: 8, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28 }}>
                  \U0001f4c4
                </div>
              )}
              <div style={{ fontSize: 10, color: "#ccc", marginBottom: 4, wordBreak: "break-all", lineHeight: 1.3 }}>{f.key}</div>
              <div style={{ fontSize: 10, color: "#666", marginBottom: 8 }}>{(f.size / 1024).toFixed(1)} KB \xb7 {f.uploaded.slice(0, 10)}</div>
              <div style={{ display: "flex", gap: 4 }}>
                <button style={{ ...S.btn, flex: 1, fontSize: 10, padding: "0.3rem" }} onClick={() => copyUrl(f.url)}>
                  {copied === f.url ? "\u2713 Copied" : "Copy URL"}
                </button>
                <button style={{ ...S.btnDanger, fontSize: 10, padding: "0.3rem 0.5rem" }} onClick={() => deleteFile(f.key)}>\u2715</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Login ─────────────────────────────────────────────────────────────────────

function Login({ onLogin }: { onLogin: (t: string) => void }) {
  const [pw, setPw] = useState("");
  return (
    <div style={{ minHeight: "100vh", background: "#06080c", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ ...S.card, width: 320, textAlign: "center" }}>
        <div style={{ fontSize: 28, marginBottom: 8 }}>\U0001f510</div>
        <h1 style={{ color: "#00ffb4", fontSize: 18, marginBottom: 20, fontFamily: "var(--font-syne)" }}>Admin</h1>
        <input style={S.input} type="password" placeholder="Enter password" value={pw}
          onChange={e => setPw(e.target.value)} onKeyDown={e => e.key === "Enter" && onLogin(pw)} />
        <button style={{ ...S.btnAccent, width: "100%", marginTop: 12, padding: "0.6rem" }} onClick={() => onLogin(pw)}>
          Login
        </button>
      </div>
    </div>
  );
}

// ── App ───────────────────────────────────────────────────────────────────────

const TABS: { id: Tab; label: string }[] = [
  { id: "hero",           label: "Hero"         },
  { id: "about",          label: "About"        },
  { id: "projects",       label: "Projects"     },
  { id: "experience",     label: "Experience"   },
  { id: "certifications", label: "Certs"        },
  { id: "achievements",   label: "Achievements" },
  { id: "words",          label: "Words"        },
  { id: "contact",        label: "Contact"      },
  { id: "theme",          label: "Theme"        },
  { id: "sections",       label: "Sections"     },
  { id: "media",          label: "Media"        },
];

export default function AdminPage() {
  const [token,   setToken]   = useState("");
  const [tab,     setTab]     = useState<Tab>("hero");
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
  if (!token)   return <Login onLogin={handleLogin} />;

  const renderTab = () => {
    switch (tab) {
      case "hero":           return <HeroEditor       api={api} token={token} />;
      case "about":          return <AboutEditor      api={api} token={token} />;
      case "projects":       return <ProjectsEditor   api={api} token={token} />;
      case "experience":     return <ExperienceEditor api={api} />;
      case "certifications": return <CertEditor       api={api} />;
      case "achievements":   return <AchEditor        api={api} />;
      case "words":          return <WordsEditor      api={api} />;
      case "contact":        return <ContactEditor    api={api} />;
      case "theme":          return <ThemeEditor      api={api} />;
      case "sections":       return <SectionsEditor   api={api} />;
      case "media":          return <MediaEditor      token={token} />;
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
