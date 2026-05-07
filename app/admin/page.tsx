"use client";

import { useEffect, useState, useCallback, useRef, DragEvent } from "react";
import { DEFAULT_CONTENT, SiteContent } from "@/lib/content";

// ── Constants ─────────────────────────────────────────────────────────────────

const mono = "'JetBrains Mono', 'Fira Code', monospace";

const LIGHT_C = {
  bg:     "#ffffff",
  ink:    "#0a0a0a",
  mute:   "#8a8a8a",
  rule:   "#e6e6e6",
  accent: "#0a0a0a",
  faint:  "#f7f7f7",
};

const DARK_C = {
  bg:     "#0a0a0a",
  ink:    "#ffffff",
  mute:   "#6a6a6a",
  rule:   "#1f1f1f",
  accent: "#ffffff",
  faint:  "#111111",
};

type ColorScheme = typeof LIGHT_C;

// ── Style helpers (dynamic based on dark mode) ────────────────────────────────

function makeS(C: ColorScheme) {
  return {
    input: (invalid = false): React.CSSProperties => ({
      display: "block",
      width: "100%",
      border: `1px solid ${invalid ? "#cc0000" : C.rule}`,
      borderRadius: 4,
      padding: "8px 12px",
      fontSize: 13,
      fontFamily: mono,
      background: C.bg,
      color: C.ink,
      outline: "none",
      boxSizing: "border-box" as const,
      marginBottom: 12,
    }),
    textarea: (invalid = false): React.CSSProperties => ({
      display: "block",
      width: "100%",
      border: `1px solid ${invalid ? "#cc0000" : C.rule}`,
      borderRadius: 4,
      padding: "8px 12px",
      fontSize: 13,
      fontFamily: mono,
      background: C.bg,
      color: C.ink,
      outline: "none",
      boxSizing: "border-box" as const,
      resize: "vertical" as const,
      minHeight: 80,
      marginBottom: 4,
    }),
    label: {
      display: "block",
      fontSize: 10,
      textTransform: "uppercase" as const,
      letterSpacing: "0.12em",
      color: C.mute,
      marginBottom: 4,
    } as React.CSSProperties,
    btnPrimary: {
      padding: "10px 20px",
      background: C.accent,
      color: C.bg,
      border: "none",
      borderRadius: 4,
      fontSize: 12,
      fontFamily: mono,
      cursor: "pointer",
      letterSpacing: "0.06em",
      textTransform: "uppercase" as const,
      fontWeight: 700,
    } as React.CSSProperties,
    btnSecondary: {
      padding: "8px 16px",
      background: "transparent",
      border: `1px solid ${C.rule}`,
      borderRadius: 4,
      color: C.ink,
      fontSize: 12,
      fontFamily: mono,
      cursor: "pointer",
      letterSpacing: "0.06em",
      textTransform: "uppercase" as const,
    } as React.CSSProperties,
    btnDanger: {
      padding: "6px 14px",
      background: "transparent",
      border: "1px solid #ffcccc",
      borderRadius: 4,
      color: "#cc0000",
      fontSize: 11,
      fontFamily: mono,
      cursor: "pointer",
    } as React.CSSProperties,
    btnWarn: {
      padding: "6px 14px",
      background: "transparent",
      border: `1px solid ${C.rule}`,
      borderRadius: 4,
      color: C.mute,
      fontSize: 11,
      fontFamily: mono,
      cursor: "pointer",
    } as React.CSSProperties,
    card: {
      border: `1px solid ${C.rule}`,
      borderRadius: 4,
      padding: "16px 20px",
      marginBottom: 12,
      background: C.faint,
    } as React.CSSProperties,
    sectionH: {
      fontSize: 11,
      textTransform: "uppercase" as const,
      letterSpacing: "0.14em",
      color: C.mute,
      fontWeight: 700,
      marginBottom: 20,
      paddingBottom: 8,
      borderBottom: `1px solid ${C.rule}`,
    } as React.CSSProperties,
    row: {
      display: "flex",
      gap: 12,
      flexWrap: "wrap" as const,
    } as React.CSSProperties,
    field: {
      display: "flex",
      flexDirection: "column" as const,
      flex: 1,
      minWidth: 160,
    } as React.CSSProperties,
  };
}

// ── Types ─────────────────────────────────────────────────────────────────────

type Tab =
  | "dashboard" | "appearance" | "seo" | "sections" | "media"
  | "hero" | "disciplines" | "about" | "projects" | "experience"
  | "certs" | "achievements" | "contact"
  | "analytics" | "inbox" | "versions" | "nav" | "exportimport" | "cssvars";

interface SideItem { id: Tab; icon: string; label: string; group?: string; badge?: number }
interface Toast { id: number; msg: string; ok: boolean }
interface EditorProps {
  content: SiteContent;
  onChange: (c: SiteContent) => void;
  onSave: () => void;
  dirty: boolean;
  token: string;
  addToast: (msg: string, ok: boolean) => void;
  C: ColorScheme;
  S: ReturnType<typeof makeS>;
}

// ── Toast system ──────────────────────────────────────────────────────────────

function ToastStack({ toasts, onRemove, C }: { toasts: Toast[]; onRemove: (id: number) => void; C: ColorScheme }) {
  return (
    <div style={{ position: "fixed", bottom: 24, right: 24, zIndex: 9999, display: "flex", flexDirection: "column", gap: 8 }}>
      {toasts.map(t => (
        <div key={t.id} style={{
          background: t.ok ? C.ink : "#cc0000", color: C.bg,
          padding: "12px 20px", borderRadius: 6, fontSize: 12, fontFamily: mono,
          letterSpacing: "0.06em", display: "flex", alignItems: "center", gap: 12,
          boxShadow: "0 4px 16px rgba(0,0,0,0.15)", animation: "slideUp 0.2s ease",
        }}>
          {t.msg}
          <button onClick={() => onRemove(t.id)} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.6)", cursor: "pointer", fontSize: 14, padding: 0, lineHeight: 1 }}>×</button>
        </div>
      ))}
    </div>
  );
}

// ── Reusable components ───────────────────────────────────────────────────────

function Field({ label, children, C }: { label: string; children: React.ReactNode; C: ColorScheme }) {
  return (
    <div>
      <label style={makeS(C).label}>{label}</label>
      {children}
    </div>
  );
}

function CharTextarea({ value, onChange, maxLen = 160, label, minHeight = 80, C }: {
  value: string; onChange: (v: string) => void; maxLen?: number; label: string; minHeight?: number; C: ColorScheme;
}) {
  const S = makeS(C);
  const over = value.length > maxLen;
  return (
    <div style={{ marginBottom: 12 }}>
      <label style={S.label}>{label}</label>
      <textarea style={{ ...S.textarea(over), minHeight, marginBottom: 4 }} value={value} onChange={e => onChange(e.target.value)}
        onFocus={e => (e.target.style.borderColor = C.ink)} onBlur={e => (e.target.style.borderColor = over ? "#cc0000" : C.rule)} />
      <div style={{ fontSize: 10, textAlign: "right", color: over ? "#cc0000" : C.mute, fontFamily: mono }}>{value.length}/{maxLen}</div>
    </div>
  );
}

function FocusInput({ value, onChange, invalid = false, style = {}, C }: {
  value: string; onChange: (v: string) => void; invalid?: boolean; style?: React.CSSProperties; C: ColorScheme;
}) {
  const S = makeS(C);
  return (
    <input style={{ ...S.input(invalid), ...style }} value={value} onChange={e => onChange(e.target.value)}
      onFocus={e => (e.target.style.borderColor = C.ink)} onBlur={e => (e.target.style.borderColor = invalid ? "#cc0000" : C.rule)} />
  );
}

function DragHandle({ C }: { C: ColorScheme }) {
  return (
    <div style={{ cursor: "grab", color: C.mute, fontSize: 16, padding: "0 8px", userSelect: "none", flexShrink: 0, display: "flex", alignItems: "center" }} title="Drag to reorder">⠿</div>
  );
}

function useDragList<T>(items: T[], onReorder: (next: T[]) => void) {
  const dragIdx = useRef<number | null>(null);
  const overIdx = useRef<number | null>(null);
  const onDragStart = (i: number) => { dragIdx.current = i; };
  const onDragOver = (e: DragEvent, i: number) => { e.preventDefault(); overIdx.current = i; };
  const onDrop = (e: DragEvent) => {
    e.preventDefault();
    if (dragIdx.current === null || overIdx.current === null) return;
    const next = [...items];
    const [moved] = next.splice(dragIdx.current, 1);
    next.splice(overIdx.current, 0, moved);
    dragIdx.current = null; overIdx.current = null;
    onReorder(next);
  };
  const onDragEnd = () => { dragIdx.current = null; overIdx.current = null; };
  return { onDragStart, onDragOver, onDrop, onDragEnd };
}

function Toggle({ value, onChange, label, C }: { value: boolean; onChange: (v: boolean) => void; label: string; C: ColorScheme }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 0", borderBottom: `1px solid ${C.rule}` }}>
      <span style={{ fontSize: 13, fontFamily: mono, color: C.ink }}>{label}</span>
      <button onClick={() => onChange(!value)} style={{ width: 44, height: 24, borderRadius: 12, background: value ? C.ink : C.rule, border: "none", cursor: "pointer", position: "relative", transition: "background 0.2s", flexShrink: 0 }}>
        <span style={{ position: "absolute", top: 3, left: value ? 23 : 3, width: 18, height: 18, borderRadius: "50%", background: "#fff", transition: "left 0.2s", display: "block" }} />
      </button>
    </div>
  );
}

function ConfirmModal({ msg, onConfirm, onCancel, C }: { msg: string; onConfirm: () => void; onCancel: () => void; C: ColorScheme }) {
  const S = makeS(C);
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 10000, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ background: C.bg, border: `1px solid ${C.rule}`, borderRadius: 6, padding: "32px 40px", maxWidth: 400, width: "90%", fontFamily: mono }}>
        <div style={{ fontSize: 14, marginBottom: 24, color: C.ink }}>{msg}</div>
        <div style={{ display: "flex", gap: 12 }}>
          <button style={S.btnDanger} onClick={onConfirm}>Confirm</button>
          <button style={S.btnSecondary} onClick={onCancel}>Cancel</button>
        </div>
      </div>
    </div>
  );
}

// ── Dashboard ─────────────────────────────────────────────────────────────────

function Dashboard({ content, lastSaved, onTabChange, C, S }: {
  content: SiteContent; lastSaved: Date | null; onTabChange: (t: Tab) => void;
  C: ColorScheme; S: ReturnType<typeof makeS>; token: string; addToast: (m: string, ok: boolean) => void;
}) {
  const hour = new Date().getHours();
  const greet = hour < 12 ? "morning" : hour < 17 ? "afternoon" : "evening";
  const [autoSave, setAutoSave] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("cms_autosave") === "1") setAutoSave(true);
  }, []);

  const toggleAutoSave = (v: boolean) => { setAutoSave(v); localStorage.setItem("cms_autosave", v ? "1" : "0"); };

  const stats = [
    { label: "Projects",    value: content.projects.length },
    { label: "Certifications", value: content.certifications.length },
    { label: "Experience", value: content.experience.length },
    { label: "Disciplines", value: content.disciplines.length },
  ];

  return (
    <div>
      <div style={{ marginBottom: 32, padding: "28px 32px", border: `1px solid ${C.rule}`, borderRadius: 4, background: C.faint }}>
        <div style={{ fontSize: 22, fontWeight: 700, marginBottom: 6, letterSpacing: "0.02em", color: C.ink }}>Good {greet}, Prudhvi.</div>
        <div style={{ fontSize: 13, color: C.mute }}>{lastSaved ? `Content last saved ${lastSaved.toLocaleTimeString()}` : "No changes saved yet this session."}</div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 32 }}>
        {stats.map(s => (
          <div key={s.label} style={{ border: `1px solid ${C.rule}`, borderRadius: 4, padding: "20px 16px", textAlign: "center", background: C.bg }}>
            <div style={{ fontSize: 32, fontWeight: 700, marginBottom: 4, color: C.ink }}>{s.value}</div>
            <div style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "0.12em", color: C.mute }}>{s.label}</div>
          </div>
        ))}
      </div>
      <div style={{ border: `1px solid ${C.rule}`, borderRadius: 4, padding: "0 20px", marginBottom: 24, background: C.bg }}>
        <Toggle label="Auto-save every 60 seconds" value={autoSave} onChange={toggleAutoSave} C={C} />
      </div>
      <div style={{ marginBottom: 12, ...S.sectionH }}>Quick access</div>
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
        <a href="/" target="_blank" rel="noopener noreferrer" style={{ ...S.btnSecondary, textDecoration: "none", display: "inline-block" }}>View Site →</a>
        <button style={S.btnSecondary} onClick={() => onTabChange("hero")}>Edit Hero →</button>
        <button style={S.btnSecondary} onClick={() => onTabChange("projects")}>Edit Projects →</button>
        <button style={S.btnSecondary} onClick={() => onTabChange("analytics")}>Analytics →</button>
        <button style={S.btnSecondary} onClick={() => onTabChange("inbox")}>Inbox →</button>
        <button style={S.btnSecondary} onClick={() => onTabChange("versions")}>Versions →</button>
      </div>
    </div>
  );
}

// ── Appearance ────────────────────────────────────────────────────────────────

function AppearanceEditor({ content, onChange, onSave, dirty, C, S }: EditorProps) {
  const a = content.appearance;
  const set = (k: keyof SiteContent["appearance"], v: string) => onChange({ ...content, appearance: { ...a, [k]: v } });
  return (
    <div>
      <div style={S.sectionH}>Appearance</div>
      <Field label="Logo text" C={C}><FocusInput value={a.logo} onChange={v => set("logo", v)} C={C} /></Field>
      <Field label="Accent color (available dot)" C={C}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
          <input type="color" value={a.accentColor} onChange={e => set("accentColor", e.target.value)} style={{ width: 48, height: 36, border: `1px solid ${C.rule}`, borderRadius: 4, cursor: "pointer", padding: 2 }} />
          <FocusInput value={a.accentColor} onChange={v => set("accentColor", v)} style={{ marginBottom: 0, maxWidth: 140 }} C={C} />
        </div>
      </Field>
      <div style={{ border: `1px solid ${C.rule}`, borderRadius: 4, padding: "20px 24px", marginBottom: 24, background: "#fff" }}>
        <div style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "0.14em", color: "#8a8a8a", marginBottom: 16 }}>Preview</div>
        <div style={{ padding: "16px 24px", display: "grid", gridTemplateColumns: "1fr 1fr 1fr", alignItems: "center", borderBottom: "1px solid #e6e6e6", fontFamily: mono, fontSize: 12, letterSpacing: "0.12em", textTransform: "uppercase", color: "#0a0a0a" }}>
          <span>{a.logo || "PV—2026"}</span>
          <span style={{ textAlign: "center", color: "#8a8a8a" }}>Projects · About · Contact</span>
          <span style={{ textAlign: "right", display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 8 }}>
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: a.accentColor, display: "inline-block" }} />AVAILABLE
          </span>
        </div>
      </div>
      <button style={S.btnPrimary} onClick={onSave}>Save Appearance{dirty ? " *" : ""}</button>
    </div>
  );
}

// ── CSS Variables ─────────────────────────────────────────────────────────────

function CssVarsTab({ content, onChange, onSave, dirty, C, S }: EditorProps) {
  const vars = content.appearance?.cssVars ?? DEFAULT_CONTENT.appearance.cssVars;
  const set = (k: keyof SiteContent["appearance"]["cssVars"], v: string) =>
    onChange({ ...content, appearance: { ...content.appearance, cssVars: { ...vars, [k]: v } } });

  const varDefs: Array<{ key: keyof typeof vars; label: string; mode: "light" | "dark" }> = [
    { key: "bgLight",   label: "Background",   mode: "light" },
    { key: "inkLight",  label: "Ink (text)",    mode: "light" },
    { key: "muteLight", label: "Muted text",    mode: "light" },
    { key: "ruleLight", label: "Rules/borders", mode: "light" },
    { key: "bgDark",    label: "Background",    mode: "dark"  },
    { key: "inkDark",   label: "Ink (text)",    mode: "dark"  },
    { key: "muteDark",  label: "Muted text",    mode: "dark"  },
    { key: "ruleDark",  label: "Rules/borders", mode: "dark"  },
  ];

  return (
    <div>
      <div style={S.sectionH}>CSS Variables</div>
      <div style={{ fontSize: 12, color: C.mute, fontFamily: mono, marginBottom: 20 }}>Live preview: changes apply after save and page reload.</div>
      {(["light", "dark"] as const).map(mode => (
        <div key={mode} style={{ marginBottom: 32 }}>
          <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.14em", color: C.mute, marginBottom: 12 }}>{mode === "light" ? "Light Mode" : "Dark Mode"}</div>
          {varDefs.filter(d => d.mode === mode).map(d => (
            <div key={d.key} style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
              <input type="color" value={vars[d.key]} onChange={e => set(d.key, e.target.value)} style={{ width: 48, height: 36, border: `1px solid ${C.rule}`, borderRadius: 4, cursor: "pointer", padding: 2 }} />
              <FocusInput value={vars[d.key]} onChange={v => set(d.key, v)} style={{ maxWidth: 140, marginBottom: 0 }} C={C} />
              <span style={{ fontSize: 12, color: C.mute, fontFamily: mono }}>{d.label}</span>
            </div>
          ))}
        </div>
      ))}
      <button style={S.btnPrimary} onClick={onSave}>Save CSS Vars{dirty ? " *" : ""}</button>
    </div>
  );
}

// ── SEO ───────────────────────────────────────────────────────────────────────

function SeoEditor({ content, onChange, onSave, dirty, C, S }: EditorProps) {
  const s = content.seo;
  const set = (k: keyof SiteContent["seo"], v: string) => onChange({ ...content, seo: { ...s, [k]: v } });
  return (
    <div>
      <div style={S.sectionH}>SEO</div>
      <Field label="Site title" C={C}><FocusInput value={s.title} onChange={v => set("title", v)} invalid={!s.title} C={C} /></Field>
      <CharTextarea label="Meta description (max 160 chars)" value={s.description} onChange={v => set("description", v)} maxLen={160} minHeight={80} C={C} />
      <Field label="OG image URL" C={C}><FocusInput value={s.ogImage} onChange={v => set("ogImage", v)} C={C} /></Field>
      <div style={{ border: `1px solid ${C.rule}`, borderRadius: 4, padding: "20px 24px", marginBottom: 24, background: "#fff" }}>
        <div style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "0.14em", color: "#8a8a8a", marginBottom: 16 }}>Google preview</div>
        <div style={{ maxWidth: 600 }}>
          <div style={{ fontSize: 12, color: "#8a8a8a", marginBottom: 4, fontFamily: "sans-serif" }}>https://prudhvi.dev</div>
          <div style={{ fontSize: 18, color: "#1a0dab", fontFamily: "sans-serif", marginBottom: 4 }}>{s.title || "Prudhvi Varma"}</div>
          <div style={{ fontSize: 13, color: "#4d5156", fontFamily: "sans-serif", lineHeight: 1.5 }}>
            {s.description ? (s.description.length > 160 ? s.description.slice(0, 157) + "…" : s.description) : <span style={{ color: "#8a8a8a", fontStyle: "italic" }}>No description set.</span>}
          </div>
        </div>
      </div>
      <button style={S.btnPrimary} onClick={onSave}>Save SEO{dirty ? " *" : ""}</button>
    </div>
  );
}

// ── Sections ──────────────────────────────────────────────────────────────────

function SectionsEditor({ content, onChange, onSave, dirty, C, S }: EditorProps) {
  const sec = content.sections;
  const set = (k: keyof SiteContent["sections"], v: boolean) => onChange({ ...content, sections: { ...sec, [k]: v } });
  const items: { key: keyof SiteContent["sections"]; label: string }[] = [
    { key: "disciplines", label: "Disciplines Band" }, { key: "about", label: "About" },
    { key: "work", label: "Selected Work" }, { key: "timeline", label: "Experience" },
    { key: "certs", label: "Certifications & Achievements" }, { key: "contact", label: "Contact" },
  ];
  return (
    <div>
      <div style={S.sectionH}>Section visibility</div>
      <div style={{ border: `1px solid ${C.rule}`, borderRadius: 4, padding: "0 20px", marginBottom: 24, background: C.bg }}>
        {items.map(({ key, label }) => <Toggle key={key} label={label} value={sec[key]} onChange={v => set(key, v)} C={C} />)}
      </div>
      <button style={S.btnPrimary} onClick={onSave}>Save Sections{dirty ? " *" : ""}</button>
    </div>
  );
}

// ── Media ─────────────────────────────────────────────────────────────────────

function MediaEditor({ content, onChange, onSave, dirty, C, S }: EditorProps) {
  const portrait = content.media?.portrait ?? "";
  const [dragging, setDragging] = useState(false);
  const processFile = (file: File) => {
    if (file.size > 2 * 1024 * 1024) { alert("File too large. Max 2 MB."); return; }
    const reader = new FileReader();
    reader.onload = () => onChange({ ...content, media: { ...content.media, portrait: reader.result as string } });
    reader.readAsDataURL(file);
  };
  const sizeKB = portrait ? Math.round((portrait.length * 3) / 4 / 1024) : 0;
  return (
    <div>
      <div style={S.sectionH}>Media — portrait</div>
      <div style={{ display: "flex", gap: 32, flexWrap: "wrap", marginBottom: 24 }}>
        <div>
          <div style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "0.12em", color: C.mute, marginBottom: 8 }}>Current portrait</div>
          <div style={{ width: 190, height: 240, background: C.faint, border: `1px solid ${C.rule}`, borderRadius: 4, overflow: "hidden" }}>
            {portrait
              // eslint-disable-next-line @next/next/no-img-element
              ? <img src={portrait} alt="Portrait" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              : <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", color: C.mute, fontSize: 12, fontFamily: mono }}>/portrait.jpg</div>}
          </div>
          {sizeKB > 0 && <div style={{ fontSize: 10, color: sizeKB > 500 ? "#cc0000" : C.mute, marginTop: 6, fontFamily: mono }}>{sizeKB} KB {sizeKB > 500 ? "— Warning: large file" : ""}</div>}
        </div>
        <div style={{ flex: 1, minWidth: 240 }}>
          <div style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "0.12em", color: C.mute, marginBottom: 8 }}>Upload new portrait</div>
          <label style={{ display: "block", cursor: "pointer" }} onDragOver={e => { e.preventDefault(); setDragging(true); }} onDragLeave={() => setDragging(false)}
            onDrop={e => { e.preventDefault(); setDragging(false); const f = (e as unknown as DragEvent<HTMLDivElement>).dataTransfer?.files[0]; if (f && f.type.startsWith("image/")) processFile(f); }}>
            <div style={{ border: `2px dashed ${dragging ? C.ink : C.rule}`, borderRadius: 4, padding: "40px 24px", textAlign: "center", background: dragging ? C.faint : C.bg, transition: "all 0.15s" }}>
              <div style={{ fontSize: 28, marginBottom: 12 }}>▣</div>
              <div style={{ fontSize: 13, fontFamily: mono, color: C.ink, marginBottom: 4 }}>Drop image here or click to upload</div>
              <div style={{ fontSize: 11, color: C.mute, fontFamily: mono }}>JPG, PNG, WebP · Max 2MB</div>
              <input type="file" accept="image/*" onChange={e => { const f = e.target.files?.[0]; if (f) processFile(f); }} style={{ display: "none" }} />
            </div>
          </label>
          {portrait && <button style={{ ...S.btnDanger, marginTop: 12, display: "block" }} onClick={() => onChange({ ...content, media: { ...content.media, portrait: "" } })}>Remove photo</button>}
        </div>
      </div>
      <button style={S.btnPrimary} onClick={onSave}>Save Media{dirty ? " *" : ""}</button>
    </div>
  );
}

// ── Hero ──────────────────────────────────────────────────────────────────────

function HeroEditor({ content, onChange, onSave, dirty, C, S }: EditorProps) {
  const h = content.hero;
  const set = (k: keyof SiteContent["hero"], v: string) => onChange({ ...content, hero: { ...h, [k]: v } });
  return (
    <div>
      <div style={S.sectionH}>Hero</div>
      <Field label="Meta text" C={C}><FocusInput value={h.meta} onChange={v => set("meta", v)} C={C} /></Field>
      <Field label="Headline line 1" C={C}><FocusInput value={h.headline1} onChange={v => set("headline1", v)} invalid={!h.headline1} C={C} /></Field>
      <Field label="Headline line 2" C={C}><FocusInput value={h.headline2} onChange={v => set("headline2", v)} invalid={!h.headline2} C={C} /></Field>
      <CharTextarea label="Intro paragraph" value={h.intro} onChange={v => set("intro", v)} maxLen={300} minHeight={80} C={C} />
      <Field label="CTA — Work button" C={C}><FocusInput value={h.ctaWork} onChange={v => set("ctaWork", v)} C={C} /></Field>
      <Field label="CTA — Contact button" C={C}><FocusInput value={h.ctaContact} onChange={v => set("ctaContact", v)} C={C} /></Field>
      <button style={S.btnPrimary} onClick={onSave}>Save Hero{dirty ? " *" : ""}</button>
    </div>
  );
}

// ── Disciplines ───────────────────────────────────────────────────────────────

function DisciplinesEditor({ content, onChange, onSave, dirty, C, S }: EditorProps) {
  const items = content.disciplines;
  const { onDragStart, onDragOver, onDrop, onDragEnd } = useDragList(items, next => onChange({ ...content, disciplines: next }));
  const setItem = (i: number, key: "num" | "label", v: string) =>
    onChange({ ...content, disciplines: items.map((d, idx) => idx === i ? { ...d, [key]: v } : d) });
  const add = () => onChange({ ...content, disciplines: [...items, { num: String(items.length + 1).padStart(2, "0"), label: "New discipline" }] });
  const remove = (i: number) => onChange({ ...content, disciplines: items.filter((_, idx) => idx !== i) });
  const duplicate = (i: number) => onChange({ ...content, disciplines: [...items.slice(0, i + 1), { ...items[i] }, ...items.slice(i + 1)] });
  return (
    <div>
      <div style={S.sectionH}>Disciplines</div>
      {items.map((d, i) => (
        <div key={i} draggable onDragStart={() => onDragStart(i)} onDragOver={e => onDragOver(e, i)} onDrop={onDrop} onDragEnd={onDragEnd} style={{ ...S.card, display: "flex", gap: 8, alignItems: "center" }}>
          <DragHandle C={C} />
          <div style={{ width: 64 }}><label style={makeS(C).label}>Num</label><FocusInput value={d.num} onChange={v => setItem(i, "num", v)} style={{ marginBottom: 0 }} C={C} /></div>
          <div style={{ flex: 1 }}><label style={makeS(C).label}>Label</label><FocusInput value={d.label} onChange={v => setItem(i, "label", v)} style={{ marginBottom: 0 }} invalid={!d.label} C={C} /></div>
          <button style={S.btnWarn} onClick={() => duplicate(i)}>📋</button>
          <button style={S.btnDanger} onClick={() => remove(i)}>Remove</button>
        </div>
      ))}
      <div style={{ display: "flex", gap: 12, marginTop: 4 }}>
        <button style={S.btnSecondary} onClick={add}>+ Add discipline</button>
        <button style={S.btnPrimary} onClick={onSave}>Save Disciplines{dirty ? " *" : ""}</button>
      </div>
    </div>
  );
}

// ── About ─────────────────────────────────────────────────────────────────────

function AboutEditor({ content, onChange, onSave, dirty, C, S }: EditorProps) {
  const a = content.about;
  const set = (k: keyof SiteContent["about"], v: string) => onChange({ ...content, about: { ...a, [k]: v } });
  return (
    <div>
      <div style={S.sectionH}>About</div>
      <Field label="Heading line 1" C={C}><FocusInput value={a.heading1} onChange={v => set("heading1", v)} C={C} /></Field>
      <Field label="Heading line 2" C={C}><FocusInput value={a.heading2} onChange={v => set("heading2", v)} C={C} /></Field>
      <Field label="Heading line 3" C={C}><FocusInput value={a.heading3} onChange={v => set("heading3", v)} C={C} /></Field>
      <CharTextarea label="Bio paragraph 1" value={a.bio1} onChange={v => set("bio1", v)} maxLen={400} minHeight={100} C={C} />
      <CharTextarea label="Bio paragraph 2" value={a.bio2} onChange={v => set("bio2", v)} maxLen={400} minHeight={100} C={C} />
      <div style={S.row}>
        <div style={S.field}><Field label="Portrait caption" C={C}><FocusInput value={a.portraitCaption} onChange={v => set("portraitCaption", v)} C={C} /></Field></div>
        <div style={S.field}><Field label="Portrait year" C={C}><FocusInput value={a.portraitYear} onChange={v => set("portraitYear", v)} C={C} /></Field></div>
      </div>
      <button style={S.btnPrimary} onClick={onSave}>Save About{dirty ? " *" : ""}</button>
    </div>
  );
}

// ── Projects ──────────────────────────────────────────────────────────────────

function ProjectsEditor({ content, onChange, onSave, dirty, C, S }: EditorProps) {
  const projects = content.projects;
  const [search, setSearch] = useState("");
  const [confirmIdx, setConfirmIdx] = useState<number | null>(null);
  const { onDragStart, onDragOver, onDrop, onDragEnd } = useDragList(projects, next => onChange({ ...content, projects: next }));
  const setP = (i: number, k: keyof SiteContent["projects"][number], v: string | boolean) =>
    onChange({ ...content, projects: projects.map((p, idx) => idx === i ? { ...p, [k]: v } : p) });
  const add = () => onChange({ ...content, projects: [...projects, { n: String(projects.length + 1).padStart(2, "0"), title: "New Project", year: "2026", meta: "", desc: "", link: "", visible: true, status: "WIP" as const }] });
  const remove = (i: number) => { onChange({ ...content, projects: projects.filter((_, idx) => idx !== i) }); setConfirmIdx(null); };
  const duplicate = (i: number) => onChange({ ...content, projects: [...projects.slice(0, i + 1), { ...projects[i] }, ...projects.slice(i + 1)] });
  const filtered = projects.map((p, i) => ({ p, i })).filter(({ p }) => !search || p.title.toLowerCase().includes(search.toLowerCase()) || p.meta.toLowerCase().includes(search.toLowerCase()));
  const statusColors: Record<string, string> = { Live: "#3a7a38", Archived: "#8a8a8a", WIP: "#b07a00" };
  return (
    <div>
      <div style={S.sectionH}>Projects ({projects.length})</div>
      {projects.length >= 5 && (
        <input placeholder="Search projects…" value={search} onChange={e => setSearch(e.target.value)}
          style={{ ...makeS(C).input(), marginBottom: 16 }} onFocus={e => (e.target.style.borderColor = C.ink)} onBlur={e => (e.target.style.borderColor = C.rule)} />
      )}
      {filtered.map(({ p, i }) => (
        <div key={i} draggable onDragStart={() => onDragStart(i)} onDragOver={e => onDragOver(e, i)} onDrop={onDrop} onDragEnd={onDragEnd} style={{ ...S.card, opacity: p.visible === false ? 0.5 : 1 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <DragHandle C={C} />
              <span style={{ fontSize: 10, color: C.mute, letterSpacing: "0.1em", textTransform: "uppercase" }}>Project {i + 1}</span>
              {p.status && <span style={{ fontSize: 10, padding: "2px 8px", border: `1px solid ${statusColors[p.status] ?? C.rule}`, color: statusColors[p.status] ?? C.mute, borderRadius: 2, letterSpacing: "0.08em" }}>{p.status}</span>}
            </div>
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <button style={{ ...S.btnWarn, fontSize: 14, padding: "4px 10px" }} onClick={() => setP(i, "visible", !(p.visible !== false))} title="Toggle visibility">{p.visible !== false ? "👁" : "🚫"}</button>
              <button style={S.btnWarn} onClick={() => duplicate(i)}>📋</button>
              <button style={S.btnDanger} onClick={() => setConfirmIdx(i)}>Remove</button>
            </div>
          </div>
          <div style={S.row}>
            <div style={{ ...S.field, maxWidth: 80 }}><Field label="N" C={C}><FocusInput value={p.n} onChange={v => setP(i, "n", v)} C={C} /></Field></div>
            <div style={{ ...S.field, flex: 3 }}><Field label="Title" C={C}><FocusInput value={p.title} onChange={v => setP(i, "title", v)} invalid={!p.title} C={C} /></Field></div>
            <div style={{ ...S.field, maxWidth: 100 }}><Field label="Year" C={C}><FocusInput value={p.year} onChange={v => setP(i, "year", v)} C={C} /></Field></div>
            <div style={{ ...S.field, maxWidth: 130 }}>
              <label style={makeS(C).label}>Status</label>
              <select value={p.status ?? "Live"} onChange={e => setP(i, "status", e.target.value)} style={{ ...makeS(C).input(), marginBottom: 0 }}>
                <option>Live</option><option>WIP</option><option>Archived</option>
              </select>
            </div>
          </div>
          <Field label="Meta tags" C={C}><FocusInput value={p.meta} onChange={v => setP(i, "meta", v)} C={C} /></Field>
          <CharTextarea label="Description" value={p.desc} onChange={v => setP(i, "desc", v)} maxLen={200} minHeight={64} C={C} />
          <Field label="Link URL" C={C}><FocusInput value={p.link ?? ""} onChange={v => setP(i, "link", v)} C={C} /></Field>
        </div>
      ))}
      <div style={{ display: "flex", gap: 12, marginTop: 4 }}>
        <button style={S.btnSecondary} onClick={add}>+ Add project</button>
        <button style={S.btnPrimary} onClick={onSave}>Save Projects{dirty ? " *" : ""}</button>
      </div>
      {confirmIdx !== null && <ConfirmModal msg={`Remove project "${projects[confirmIdx]?.title}"?`} onConfirm={() => remove(confirmIdx)} onCancel={() => setConfirmIdx(null)} C={C} />}
    </div>
  );
}

// ── Experience ────────────────────────────────────────────────────────────────

function ExperienceEditor({ content, onChange, onSave, dirty, C, S }: EditorProps) {
  const exp = content.experience;
  const [confirmIdx, setConfirmIdx] = useState<number | null>(null);
  const { onDragStart, onDragOver, onDrop, onDragEnd } = useDragList(exp, next => onChange({ ...content, experience: next }));
  const setE = (i: number, k: keyof SiteContent["experience"][number], v: string | boolean) =>
    onChange({ ...content, experience: exp.map((e, idx) => idx === i ? { ...e, [k]: v } : e) });
  const add = () => onChange({ ...content, experience: [...exp, { dateRange: "JAN 2026 —", org: "Company", role: "Role", visible: true }] });
  const remove = (i: number) => { onChange({ ...content, experience: exp.filter((_, idx) => idx !== i) }); setConfirmIdx(null); };
  const duplicate = (i: number) => onChange({ ...content, experience: [...exp.slice(0, i + 1), { ...exp[i] }, ...exp.slice(i + 1)] });
  return (
    <div>
      <div style={S.sectionH}>Experience ({exp.length})</div>
      {exp.map((e, i) => (
        <div key={i} draggable onDragStart={() => onDragStart(i)} onDragOver={ev => onDragOver(ev, i)} onDrop={onDrop} onDragEnd={onDragEnd} style={{ ...S.card, opacity: e.visible === false ? 0.5 : 1 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12, alignItems: "center" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}><DragHandle C={C} /><span style={{ fontSize: 10, color: C.mute, letterSpacing: "0.1em", textTransform: "uppercase" }}>Entry {i + 1}</span></div>
            <div style={{ display: "flex", gap: 8 }}>
              <button style={{ ...S.btnWarn, fontSize: 14, padding: "4px 10px" }} onClick={() => setE(i, "visible", !(e.visible !== false))}>{e.visible !== false ? "👁" : "🚫"}</button>
              <button style={S.btnWarn} onClick={() => duplicate(i)}>📋</button>
              <button style={S.btnDanger} onClick={() => setConfirmIdx(i)}>Remove</button>
            </div>
          </div>
          <div style={S.row}>
            <div style={S.field}><Field label="Date range" C={C}><FocusInput value={e.dateRange} onChange={v => setE(i, "dateRange", v)} C={C} /></Field></div>
            <div style={S.field}><Field label="Organisation" C={C}><FocusInput value={e.org} onChange={v => setE(i, "org", v)} invalid={!e.org} C={C} /></Field></div>
            <div style={{ ...S.field, flex: 2 }}><Field label="Role" C={C}><FocusInput value={e.role} onChange={v => setE(i, "role", v)} invalid={!e.role} C={C} /></Field></div>
          </div>
        </div>
      ))}
      <div style={{ display: "flex", gap: 12, marginTop: 4 }}>
        <button style={S.btnSecondary} onClick={add}>+ Add entry</button>
        <button style={S.btnPrimary} onClick={onSave}>Save Experience{dirty ? " *" : ""}</button>
      </div>
      {confirmIdx !== null && <ConfirmModal msg={`Remove entry at "${exp[confirmIdx]?.org}"?`} onConfirm={() => remove(confirmIdx)} onCancel={() => setConfirmIdx(null)} C={C} />}
    </div>
  );
}

// ── Certifications ────────────────────────────────────────────────────────────

function CertsEditor({ content, onChange, onSave, dirty, C, S }: EditorProps) {
  const certs = content.certifications;
  const [confirmIdx, setConfirmIdx] = useState<number | null>(null);
  const { onDragStart, onDragOver, onDrop, onDragEnd } = useDragList(certs, next => onChange({ ...content, certifications: next }));
  const setC2 = (i: number, k: keyof SiteContent["certifications"][number], v: string | boolean) =>
    onChange({ ...content, certifications: certs.map((c, idx) => idx === i ? { ...c, [k]: v } : c) });
  const add = () => onChange({ ...content, certifications: [...certs, { name: "New Cert", issuer: "Issuer", label: "JAN 2026", visible: true }] });
  const remove = (i: number) => { onChange({ ...content, certifications: certs.filter((_, idx) => idx !== i) }); setConfirmIdx(null); };
  const duplicate = (i: number) => onChange({ ...content, certifications: [...certs.slice(0, i + 1), { ...certs[i] }, ...certs.slice(i + 1)] });
  return (
    <div>
      <div style={S.sectionH}>Certifications ({certs.length})</div>
      {certs.map((c, i) => (
        <div key={i} draggable onDragStart={() => onDragStart(i)} onDragOver={e => onDragOver(e, i)} onDrop={onDrop} onDragEnd={onDragEnd} style={{ ...S.card, display: "flex", gap: 8, alignItems: "center", opacity: c.visible === false ? 0.5 : 1 }}>
          <DragHandle C={C} />
          <div style={{ flex: 2 }}><label style={makeS(C).label}>Name</label><FocusInput value={c.name} onChange={v => setC2(i, "name", v)} invalid={!c.name} style={{ marginBottom: 0 }} C={C} /></div>
          <div style={{ flex: 2 }}><label style={makeS(C).label}>Issuer</label><FocusInput value={c.issuer} onChange={v => setC2(i, "issuer", v)} style={{ marginBottom: 0 }} C={C} /></div>
          <div style={{ flex: 1 }}><label style={makeS(C).label}>Date</label><FocusInput value={c.label} onChange={v => setC2(i, "label", v)} style={{ marginBottom: 0 }} C={C} /></div>
          <button style={{ ...S.btnWarn, fontSize: 14, padding: "4px 10px" }} onClick={() => setC2(i, "visible", !(c.visible !== false))}>{c.visible !== false ? "👁" : "🚫"}</button>
          <button style={S.btnWarn} onClick={() => duplicate(i)}>📋</button>
          <button style={S.btnDanger} onClick={() => setConfirmIdx(i)}>Remove</button>
        </div>
      ))}
      <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
        <button style={S.btnSecondary} onClick={add}>+ Add cert</button>
        <button style={S.btnPrimary} onClick={onSave}>Save Certs{dirty ? " *" : ""}</button>
      </div>
      {confirmIdx !== null && <ConfirmModal msg={`Remove cert "${certs[confirmIdx]?.name}"?`} onConfirm={() => remove(confirmIdx)} onCancel={() => setConfirmIdx(null)} C={C} />}
    </div>
  );
}

// ── Achievements ──────────────────────────────────────────────────────────────

function AchievementsEditor({ content, onChange, onSave, dirty, C, S }: EditorProps) {
  const ach = content.achievements;
  const [confirmIdx, setConfirmIdx] = useState<number | null>(null);
  const { onDragStart, onDragOver, onDrop, onDragEnd } = useDragList(ach, next => onChange({ ...content, achievements: next }));
  const setA = (i: number, k: keyof SiteContent["achievements"][number], v: string | boolean) =>
    onChange({ ...content, achievements: ach.map((a, idx) => idx === i ? { ...a, [k]: v } : a) });
  const add = () => onChange({ ...content, achievements: [...ach, { name: "PLACE", label: "EVENT NAME", visible: true }] });
  const remove = (i: number) => { onChange({ ...content, achievements: ach.filter((_, idx) => idx !== i) }); setConfirmIdx(null); };
  const duplicate = (i: number) => onChange({ ...content, achievements: [...ach.slice(0, i + 1), { ...ach[i] }, ...ach.slice(i + 1)] });
  return (
    <div>
      <div style={S.sectionH}>Achievements ({ach.length})</div>
      {ach.map((a, i) => (
        <div key={i} draggable onDragStart={() => onDragStart(i)} onDragOver={e => onDragOver(e, i)} onDrop={onDrop} onDragEnd={onDragEnd} style={{ ...S.card, display: "flex", gap: 8, alignItems: "center", opacity: a.visible === false ? 0.5 : 1 }}>
          <DragHandle C={C} />
          <div style={{ flex: 1 }}><label style={makeS(C).label}>Name / Place</label><FocusInput value={a.name} onChange={v => setA(i, "name", v)} invalid={!a.name} style={{ marginBottom: 0 }} C={C} /></div>
          <div style={{ flex: 2 }}><label style={makeS(C).label}>Label / Event</label><FocusInput value={a.label} onChange={v => setA(i, "label", v)} style={{ marginBottom: 0 }} C={C} /></div>
          <button style={{ ...S.btnWarn, fontSize: 14, padding: "4px 10px" }} onClick={() => setA(i, "visible", !(a.visible !== false))}>{a.visible !== false ? "👁" : "🚫"}</button>
          <button style={S.btnWarn} onClick={() => duplicate(i)}>📋</button>
          <button style={S.btnDanger} onClick={() => setConfirmIdx(i)}>Remove</button>
        </div>
      ))}
      <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
        <button style={S.btnSecondary} onClick={add}>+ Add achievement</button>
        <button style={S.btnPrimary} onClick={onSave}>Save Achievements{dirty ? " *" : ""}</button>
      </div>
      {confirmIdx !== null && <ConfirmModal msg={`Remove achievement "${ach[confirmIdx]?.name}"?`} onConfirm={() => remove(confirmIdx)} onCancel={() => setConfirmIdx(null)} C={C} />}
    </div>
  );
}

// ── Contact ───────────────────────────────────────────────────────────────────

function ContactEditor({ content, onChange, onSave, dirty, C, S }: EditorProps) {
  const c = content.contact;
  const set = (k: keyof SiteContent["contact"], v: string | boolean) => onChange({ ...content, contact: { ...c, [k]: v } });
  return (
    <div>
      <div style={S.sectionH}>Contact</div>
      <Field label="Email" C={C}><FocusInput value={c.email} onChange={v => set("email", v)} invalid={!c.email} C={C} /></Field>
      <Field label="GitHub URL" C={C}><FocusInput value={c.github} onChange={v => set("github", v)} C={C} /></Field>
      <Field label="LinkedIn URL" C={C}><FocusInput value={c.linkedin} onChange={v => set("linkedin", v)} C={C} /></Field>
      <div style={S.row}>
        <div style={S.field}><Field label="Footer — left" C={C}><FocusInput value={c.footerLeft} onChange={v => set("footerLeft", v)} C={C} /></Field></div>
        <div style={S.field}><Field label="Footer — center" C={C}><FocusInput value={c.footerCenter} onChange={v => set("footerCenter", v)} C={C} /></Field></div>
        <div style={S.field}><Field label="Footer — right" C={C}><FocusInput value={c.footerRight} onChange={v => set("footerRight", v)} C={C} /></Field></div>
      </div>
      <CharTextarea label="Confession text" value={c.confession} onChange={v => set("confession", v)} maxLen={200} minHeight={64} C={C} />
      <div style={{ border: `1px solid ${C.rule}`, borderRadius: 4, padding: "0 20px", marginBottom: 24, background: C.bg }}>
        <Toggle label="Show contact form on portfolio" value={c.showForm !== false} onChange={v => set("showForm", v)} C={C} />
      </div>
      <button style={S.btnPrimary} onClick={onSave}>Save Contact{dirty ? " *" : ""}</button>
    </div>
  );
}

// ── Analytics ─────────────────────────────────────────────────────────────────

interface AnalyticsData {
  totalViews: number; viewsToday: number; viewsThisWeek: number; topReferrer: string;
  viewsPerDay: Array<{ date: string; count: number }>; topReferrers: Array<{ referrer: string; count: number }>;
}

function AnalyticsTab({ token, C, S }: { token: string; C: ColorScheme; S: ReturnType<typeof makeS> }) {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(false);
  const load = useCallback(async () => {
    setLoading(true);
    try { const res = await fetch("/api/analytics", { headers: { Authorization: `Bearer ${token}` } }); if (res.ok) setData(await res.json()); } catch { /* ignore */ }
    setLoading(false);
  }, [token]);
  useEffect(() => { load(); }, [load]);
  const maxCount = data ? Math.max(...data.viewsPerDay.map(d => d.count), 1) : 1;
  return (
    <div>
      <div style={S.sectionH}>Analytics</div>
      {loading && <div style={{ color: C.mute, fontSize: 13 }}>Loading…</div>}
      {data && (
        <>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 32 }}>
            {[{ label: "Total Views", value: data.totalViews }, { label: "Views Today", value: data.viewsToday }, { label: "Views This Week", value: data.viewsThisWeek }, { label: "Top Referrer", value: data.topReferrer || "direct" }].map(s => (
              <div key={s.label} style={{ border: `1px solid ${C.rule}`, borderRadius: 4, padding: "20px 16px", textAlign: "center", background: C.bg }}>
                <div style={{ fontSize: typeof s.value === "number" ? 28 : 13, fontWeight: 700, marginBottom: 4, color: C.ink, wordBreak: "break-all" }}>{s.value}</div>
                <div style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "0.12em", color: C.mute }}>{s.label}</div>
              </div>
            ))}
          </div>
          {data.viewsPerDay.length > 0 && (
            <div style={{ border: `1px solid ${C.rule}`, borderRadius: 4, padding: "24px", marginBottom: 24, background: C.bg }}>
              <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.14em", color: C.mute, marginBottom: 16 }}>Views — last 30 days</div>
              <svg width="100%" viewBox={`0 0 ${data.viewsPerDay.length * 14} 90`} style={{ overflow: "visible" }}>
                {data.viewsPerDay.map((d, i) => {
                  const h = Math.max(2, (d.count / maxCount) * 64);
                  return (
                    <g key={d.date}>
                      <rect x={i * 14} y={64 - h} width={10} height={h} fill={C.ink} opacity={0.8} rx={1} />
                      {i % 7 === 0 && <text x={i * 14} y={80} fontSize={6} fill={C.mute} fontFamily={mono}>{d.date.slice(5)}</text>}
                    </g>
                  );
                })}
              </svg>
            </div>
          )}
          {data.topReferrers.length > 0 && (
            <div style={{ border: `1px solid ${C.rule}`, borderRadius: 4, overflow: "hidden", marginBottom: 24 }}>
              <div style={{ padding: "12px 16px", borderBottom: `1px solid ${C.rule}`, fontSize: 11, textTransform: "uppercase", letterSpacing: "0.14em", color: C.mute, background: C.faint }}>Top Referrers</div>
              {data.topReferrers.map(r => (
                <div key={r.referrer} style={{ display: "flex", justifyContent: "space-between", padding: "10px 16px", borderBottom: `1px solid ${C.rule}`, fontSize: 12, fontFamily: mono, color: C.ink }}>
                  <span>{r.referrer || "direct"}</span><span style={{ color: C.mute }}>{r.count}</span>
                </div>
              ))}
            </div>
          )}
          <div style={{ fontSize: 11, color: C.mute, fontFamily: mono }}>Data updates on page load.</div>
        </>
      )}
    </div>
  );
}

// ── Contact Inbox ─────────────────────────────────────────────────────────────

interface ContactSubmission { id: number; name: string; email: string; message: string; read: number; ts: string; }

function InboxTab({ token, C, S }: { token: string; C: ColorScheme; S: ReturnType<typeof makeS> }) {
  const [submissions, setSubmissions] = useState<ContactSubmission[]>([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState<"all" | "unread">("all");
  const [expanded, setExpanded] = useState<number | null>(null);
  const [readLocally, setReadLocally] = useState<Set<number>>(new Set());
  const [confirmDelete, setConfirmDelete] = useState<number | null>(null);
  const load = useCallback(async () => {
    setLoading(true);
    try { const res = await fetch("/api/contact", { headers: { Authorization: `Bearer ${token}` } }); if (res.ok) setSubmissions(await res.json()); } catch { /* ignore */ }
    setLoading(false);
  }, [token]);
  useEffect(() => { load(); }, [load]);
  const deleteOne = async (id: number) => {
    await fetch(`/api/contact?id=${id}`, { method: "DELETE", headers: { Authorization: `Bearer ${token}` } });
    setSubmissions(s => s.filter(x => x.id !== id)); setConfirmDelete(null); setExpanded(null);
  };
  const markRead = (id: number) => setReadLocally(s => new Set([...s, id]));
  const filtered = submissions.filter(s => filter === "all" || (s.read === 0 && !readLocally.has(s.id)));
  const unreadCount = submissions.filter(s => s.read === 0 && !readLocally.has(s.id)).length;
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", ...S.sectionH }}>
        <span>Contact Inbox</span>
        {unreadCount > 0 && <span style={{ background: C.ink, color: C.bg, fontSize: 10, padding: "2px 8px", borderRadius: 10, fontFamily: mono }}>{unreadCount} unread</span>}
      </div>
      <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
        {(["all", "unread"] as const).map(f => (
          <button key={f} style={{ ...S.btnSecondary, background: filter === f ? C.ink : "transparent", color: filter === f ? C.bg : C.ink }} onClick={() => setFilter(f)}>
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>
      {loading && <div style={{ color: C.mute, fontSize: 13 }}>Loading…</div>}
      {!loading && filtered.length === 0 && <div style={{ color: C.mute, fontSize: 13, fontFamily: mono }}>No messages yet. The form is live.</div>}
      {filtered.map(s => {
        const isRead = s.read === 1 || readLocally.has(s.id);
        const isExpanded = expanded === s.id;
        return (
          <div key={s.id} style={{ ...S.card, cursor: "pointer", borderLeft: isRead ? `1px solid ${C.rule}` : `3px solid ${C.ink}` }}>
            <div onClick={() => { setExpanded(isExpanded ? null : s.id); markRead(s.id); }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                <span style={{ fontSize: 13, fontWeight: isRead ? 400 : 700, color: C.ink, fontFamily: mono }}>{s.name}</span>
                <span style={{ fontSize: 11, color: C.mute, fontFamily: mono }}>{new Date(s.ts).toLocaleString()}</span>
              </div>
              <div style={{ fontSize: 12, color: C.mute, fontFamily: mono }}>{s.email}</div>
              {!isExpanded && <div style={{ fontSize: 12, color: C.mute, fontFamily: mono, marginTop: 4, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{s.message.slice(0, 80)}{s.message.length > 80 ? "…" : ""}</div>}
            </div>
            {isExpanded && (
              <div style={{ marginTop: 12, paddingTop: 12, borderTop: `1px solid ${C.rule}` }}>
                <div style={{ fontSize: 13, color: C.ink, fontFamily: mono, whiteSpace: "pre-wrap", lineHeight: 1.6, marginBottom: 16 }}>{s.message}</div>
                <button style={S.btnDanger} onClick={() => setConfirmDelete(s.id)}>Delete</button>
              </div>
            )}
          </div>
        );
      })}
      {confirmDelete !== null && <ConfirmModal msg="Delete this message permanently?" onConfirm={() => deleteOne(confirmDelete)} onCancel={() => setConfirmDelete(null)} C={C} />}
    </div>
  );
}

// ── Version History ───────────────────────────────────────────────────────────

interface Version { id: number; saved_at: string; }

function VersionsTab({ token, addToast, C, S }: { token: string; addToast: (m: string, ok: boolean) => void; C: ColorScheme; S: ReturnType<typeof makeS> }) {
  const [versions, setVersions] = useState<Version[]>([]);
  const [loading, setLoading] = useState(false);
  const [confirmId, setConfirmId] = useState<number | null>(null);
  const load = useCallback(async () => {
    setLoading(true);
    try { const res = await fetch("/api/content/versions", { headers: { Authorization: `Bearer ${token}` } }); if (res.ok) setVersions(await res.json()); } catch { /* ignore */ }
    setLoading(false);
  }, [token]);
  useEffect(() => { load(); }, [load]);
  const restore = async (id: number) => {
    try {
      const res = await fetch("/api/content/versions", { method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` }, body: JSON.stringify({ id }) });
      if (res.ok) { addToast("Content restored.", true); setConfirmId(null); } else addToast("Restore failed.", false);
    } catch { addToast("Restore failed.", false); }
  };
  return (
    <div>
      <div style={S.sectionH}>Version History</div>
      {loading && <div style={{ color: C.mute, fontSize: 13 }}>Loading…</div>}
      {!loading && versions.length === 0 && <div style={{ color: C.mute, fontSize: 13, fontFamily: mono }}>No versions saved yet. Save content to start tracking history.</div>}
      {versions.map((v, i) => (
        <div key={v.id} style={{ ...S.card, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <span style={{ fontSize: 13, color: C.ink, fontFamily: mono }}>Version {versions.length - i}</span>
            {i === 0 && <span style={{ marginLeft: 8, fontSize: 10, color: C.mute, fontFamily: mono }}>(current)</span>}
            <div style={{ fontSize: 11, color: C.mute, fontFamily: mono, marginTop: 2 }}>{new Date(v.saved_at).toLocaleString()}</div>
          </div>
          {i !== 0 && <button style={S.btnSecondary} onClick={() => setConfirmId(v.id)}>Restore</button>}
        </div>
      ))}
      {confirmId !== null && <ConfirmModal msg="Restore this version? Current content will be replaced." onConfirm={() => restore(confirmId)} onCancel={() => setConfirmId(null)} C={C} />}
    </div>
  );
}

// ── Nav Editor ────────────────────────────────────────────────────────────────

function NavEditor({ content, onChange, onSave, dirty, C, S }: EditorProps) {
  const items = content.nav?.items ?? DEFAULT_CONTENT.nav.items;
  const setLabel = (i: number, label: string) => {
    const next = items.map((item, idx) => idx === i ? { ...item, label } : item);
    onChange({ ...content, nav: { items: next } });
  };
  return (
    <div>
      <div style={S.sectionH}>Navigation Labels</div>
      <div style={{ fontSize: 12, color: C.mute, fontFamily: mono, marginBottom: 20 }}>Keys (section IDs) cannot be changed. Only the displayed labels.</div>
      {items.map((item, i) => (
        <div key={item.key} style={{ ...S.card, display: "flex", gap: 12, alignItems: "center" }}>
          <div style={{ width: 100, fontSize: 11, fontFamily: mono, color: C.mute, textTransform: "uppercase", letterSpacing: "0.12em" }}>#{item.key}</div>
          <div style={{ flex: 1 }}><FocusInput value={item.label} onChange={v => setLabel(i, v)} C={C} style={{ marginBottom: 0 }} /></div>
        </div>
      ))}
      <button style={S.btnPrimary} onClick={onSave}>Save Nav{dirty ? " *" : ""}</button>
    </div>
  );
}

// ── Export / Import ───────────────────────────────────────────────────────────

function ExportImportTab({ content, token, addToast, C, S }: { content: SiteContent; token: string; addToast: (m: string, ok: boolean) => void; C: ColorScheme; S: ReturnType<typeof makeS> }) {
  const [importJson, setImportJson] = useState<SiteContent | null>(null);
  const [importErr, setImportErr] = useState("");
  const doExport = () => {
    const blob = new Blob([JSON.stringify(content, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = "content.json"; a.click(); URL.revokeObjectURL(url);
  };
  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return;
    setImportErr(""); setImportJson(null);
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(reader.result as string) as SiteContent;
        if (!parsed.hero || !parsed.contact) throw new Error("Invalid content JSON");
        setImportJson(parsed);
      } catch (err) { setImportErr("Invalid JSON file. " + String(err)); }
    };
    reader.readAsText(file);
  };
  const doImport = async () => {
    if (!importJson) return;
    try {
      const res = await fetch("/api/content", { method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` }, body: JSON.stringify(importJson) });
      if (res.ok) { addToast("Content imported and saved.", true); setImportJson(null); window.location.reload(); } else addToast("Import failed.", false);
    } catch { addToast("Import failed.", false); }
  };
  const sections = importJson ? Object.keys(importJson).filter(k => typeof (importJson as unknown as Record<string, unknown>)[k] === "object") : [];
  return (
    <div>
      <div style={S.sectionH}>Export / Import</div>
      <div style={{ ...S.card, marginBottom: 32 }}>
        <div style={{ fontSize: 13, color: C.ink, fontFamily: mono, marginBottom: 8 }}>Export</div>
        <div style={{ fontSize: 12, color: C.mute, marginBottom: 16 }}>Download a JSON backup of all content.</div>
        <button style={S.btnPrimary} onClick={doExport}>Export content.json</button>
      </div>
      <div style={S.card}>
        <div style={{ fontSize: 13, color: C.ink, fontFamily: mono, marginBottom: 8 }}>Import</div>
        <div style={{ fontSize: 12, color: "#cc0000", marginBottom: 12, fontFamily: mono }}>Warning: Importing will overwrite all current content.</div>
        <div style={{ fontSize: 12, color: C.mute, marginBottom: 16 }}>Restore from a JSON backup.</div>
        <input type="file" accept=".json,application/json" onChange={onFileChange} style={{ fontSize: 12, fontFamily: mono, color: C.ink, marginBottom: 12, display: "block" }} />
        {importErr && <div style={{ color: "#cc0000", fontSize: 12, fontFamily: mono, marginBottom: 12 }}>{importErr}</div>}
        {importJson && (
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 11, color: C.mute, fontFamily: mono, marginBottom: 8 }}>Sections detected: {sections.join(", ")}</div>
            <button style={S.btnPrimary} onClick={doImport}>Import &amp; Save</button>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Login ─────────────────────────────────────────────────────────────────────

function Login({ onLogin }: { onLogin: (pw: string) => void }) {
  const [pw, setPw] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  const C = LIGHT_C; const S = makeS(C);
  const submit = async () => {
    if (!pw) return; setBusy(true); setErr("");
    try {
      const res = await fetch("/api/content", { method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${pw}` }, body: JSON.stringify(DEFAULT_CONTENT) });
      if (res.status === 401) { setErr("Wrong password."); setBusy(false); return; }
      onLogin(pw);
    } catch { onLogin(pw); }
    setBusy(false);
  };
  return (
    <div style={{ minHeight: "100vh", background: C.bg, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: mono }}>
      <div style={{ width: 360 }}>
        <div style={{ fontSize: 26, fontWeight: 700, marginBottom: 6, letterSpacing: "0.04em", color: C.ink }}>prudhvi.cms</div>
        <div style={{ fontSize: 10, color: C.mute, marginBottom: 40, textTransform: "uppercase", letterSpacing: "0.14em" }}>Content management</div>
        <label style={S.label}>Admin password</label>
        <input style={{ ...S.input(), marginBottom: 16 }} type="password" placeholder="Enter ADMIN_SECRET" value={pw} onChange={e => setPw(e.target.value)} onKeyDown={e => e.key === "Enter" && submit()} onFocus={e => (e.target.style.borderColor = C.ink)} onBlur={e => (e.target.style.borderColor = C.rule)} autoFocus />
        {err && <div style={{ color: "#cc0000", fontSize: 12, marginBottom: 12 }}>{err}</div>}
        <button style={{ ...S.btnPrimary, width: "100%", padding: "12px" }} onClick={submit} disabled={busy}>{busy ? "Checking…" : "Login →"}</button>
      </div>
    </div>
  );
}

// ── App ───────────────────────────────────────────────────────────────────────

export default function AdminPage() {
  const [token,     setToken]     = useState("");
  const [tab,       setTab]       = useState<Tab>("dashboard");
  const [content,   setContent]   = useState<SiteContent>(DEFAULT_CONTENT);
  const [saved,     setSaved]     = useState<SiteContent>(DEFAULT_CONTENT);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [toasts,    setToasts]    = useState<Toast[]>([]);
  const [mounted,   setMounted]   = useState(false);
  const [darkAdmin, setDarkAdmin] = useState(false);
  const [inboxCount, setInboxCount] = useState(0);
  const toastId = useRef(0);
  const autoSaveTimer = useRef<ReturnType<typeof setInterval> | null>(null);

  const C = darkAdmin ? DARK_C : LIGHT_C;
  const S = makeS(C);
  const isDirty = JSON.stringify(content) !== JSON.stringify(saved);

  useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem("cms_token"); if (stored) setToken(stored);
    if (localStorage.getItem("cms_dark") === "1") setDarkAdmin(true);
  }, []);

  const addToast = useCallback((msg: string, ok: boolean) => {
    const id = ++toastId.current;
    setToasts(t => [...t, { id, msg, ok }]);
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 3000);
  }, []);

  const removeToast = (id: number) => setToasts(t => t.filter(x => x.id !== id));

  const loadContent = useCallback(async () => {
    try {
      const res = await fetch("/api/content");
      if (res.ok) {
        const data = await res.json() as SiteContent;
        const merged: SiteContent = {
          ...DEFAULT_CONTENT, ...data,
          seo: { ...DEFAULT_CONTENT.seo, ...(data.seo ?? {}) },
          appearance: { ...DEFAULT_CONTENT.appearance, ...(data.appearance ?? {}), cssVars: { ...DEFAULT_CONTENT.appearance.cssVars, ...(data.appearance?.cssVars ?? {}) } },
          sections: { ...DEFAULT_CONTENT.sections, ...(data.sections ?? {}) },
          media: { ...DEFAULT_CONTENT.media, ...(data.media ?? {}) },
          contact: { ...DEFAULT_CONTENT.contact, ...(data.contact ?? {}) },
          nav: { items: data.nav?.items ?? DEFAULT_CONTENT.nav.items },
        };
        setContent(merged); setSaved(merged);
      }
    } catch { /* local dev */ }
  }, []);

  const loadInboxCount = useCallback(async () => {
    if (!token) return;
    try {
      const res = await fetch("/api/contact", { headers: { Authorization: `Bearer ${token}` } });
      if (res.ok) { const data = await res.json() as Array<{ read: number }>; setInboxCount(data.filter(d => d.read === 0).length); }
    } catch { /* ignore */ }
  }, [token]);

  useEffect(() => { if (token) { loadContent(); loadInboxCount(); } }, [token, loadContent, loadInboxCount]);

  const save = useCallback(async () => {
    try {
      const res = await fetch("/api/content", { method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` }, body: JSON.stringify(content) });
      if (res.ok) { setSaved({ ...content }); setLastSaved(new Date()); addToast("Saved ✓", true); }
      else if (res.status === 401) addToast("Error: unauthorized.", false);
      else addToast("Error saving.", false);
    } catch { setSaved({ ...content }); setLastSaved(new Date()); addToast("Saved (local — no DB) ✓", true); }
  }, [token, content, addToast]);

  useEffect(() => {
    if (localStorage.getItem("cms_autosave") === "1") {
      if (autoSaveTimer.current) clearInterval(autoSaveTimer.current);
      autoSaveTimer.current = setInterval(() => { if (localStorage.getItem("cms_autosave") === "1") save(); }, 60000);
    }
    return () => { if (autoSaveTimer.current) clearInterval(autoSaveTimer.current); };
  }, [save]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if ((e.metaKey || e.ctrlKey) && e.key === "s") { e.preventDefault(); save(); } };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [save]);

  const handleLogin = (pw: string) => { setToken(pw); localStorage.setItem("cms_token", pw); };
  const handleLogout = () => { localStorage.removeItem("cms_token"); setToken(""); };
  const toggleDarkAdmin = () => { const next = !darkAdmin; setDarkAdmin(next); localStorage.setItem("cms_dark", next ? "1" : "0"); };

  if (!mounted) return null;
  if (!token)   return <Login onLogin={handleLogin} />;

  const SIDE_ITEMS: SideItem[] = [
    { id: "dashboard",    icon: "◈",  label: "Dashboard",      group: "overview" },
    { id: "analytics",   icon: "📈", label: "Analytics",       group: "overview" },
    { id: "inbox",       icon: "✉",  label: "Inbox",           group: "overview", badge: inboxCount },
    { id: "versions",    icon: "🕐", label: "Versions",        group: "overview" },
    { id: "appearance",  icon: "◐",  label: "Appearance",      group: "settings" },
    { id: "cssvars",     icon: "🎨", label: "CSS Vars",        group: "settings" },
    { id: "seo",         icon: "⌖",  label: "SEO",             group: "settings" },
    { id: "sections",    icon: "▤",  label: "Sections",        group: "settings" },
    { id: "media",       icon: "▣",  label: "Media",           group: "settings" },
    { id: "nav",         icon: "⊞",  label: "Navigation",      group: "settings" },
    { id: "exportimport",icon: "⇅",  label: "Export / Import", group: "settings" },
    { id: "hero",        icon: "✦",  label: "Hero",             group: "content" },
    { id: "disciplines", icon: "≡",  label: "Disciplines",      group: "content" },
    { id: "about",       icon: "☺",  label: "About",            group: "content" },
    { id: "projects",    icon: "◻",  label: `Projects (${content.projects.length})`, group: "content" },
    { id: "experience",  icon: "⟳",  label: `Experience (${content.experience.length})`, group: "content" },
    { id: "certs",       icon: "✓",  label: `Certs (${content.certifications.length})`, group: "content" },
    { id: "achievements",icon: "★",  label: "Achievements",     group: "content" },
    { id: "contact",     icon: "✉",  label: "Contact",          group: "content" },
  ];

  const currentItem = SIDE_ITEMS.find(s => s.id === tab);
  const editorProps: EditorProps = { content, onChange: setContent, onSave: save, dirty: isDirty, token, addToast, C, S };

  const renderContent = () => {
    switch (tab) {
      case "dashboard":    return <Dashboard content={content} lastSaved={lastSaved} onTabChange={setTab} C={C} S={S} token={token} addToast={addToast} />;
      case "analytics":    return <AnalyticsTab token={token} C={C} S={S} />;
      case "inbox":        return <InboxTab token={token} C={C} S={S} />;
      case "versions":     return <VersionsTab token={token} addToast={addToast} C={C} S={S} />;
      case "appearance":   return <AppearanceEditor  {...editorProps} />;
      case "cssvars":      return <CssVarsTab        {...editorProps} />;
      case "seo":          return <SeoEditor         {...editorProps} />;
      case "sections":     return <SectionsEditor    {...editorProps} />;
      case "media":        return <MediaEditor       {...editorProps} />;
      case "nav":          return <NavEditor         {...editorProps} />;
      case "exportimport": return <ExportImportTab   content={content} token={token} addToast={addToast} C={C} S={S} />;
      case "hero":         return <HeroEditor        {...editorProps} />;
      case "disciplines":  return <DisciplinesEditor {...editorProps} />;
      case "about":        return <AboutEditor       {...editorProps} />;
      case "projects":     return <ProjectsEditor    {...editorProps} />;
      case "experience":   return <ExperienceEditor  {...editorProps} />;
      case "certs":        return <CertsEditor       {...editorProps} />;
      case "achievements": return <AchievementsEditor {...editorProps} />;
      case "contact":      return <ContactEditor     {...editorProps} />;
    }
  };

  const groups = ["overview", "settings", "content"];
  const groupLabels: Record<string, string> = { overview: "Overview", settings: "Settings", content: "Content" };

  return (
    <>
      <style>{`
        @keyframes slideUp { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 6px; } ::-webkit-scrollbar-track { background: ${C.faint}; } ::-webkit-scrollbar-thumb { background: ${C.rule}; border-radius: 3px; }
        select option { background: ${C.bg}; color: ${C.ink}; }
      `}</style>

      <div style={{ minHeight: "100vh", background: C.bg, color: C.ink, fontFamily: mono, display: "flex" }}>

        {/* Sidebar */}
        <div style={{ width: 220, background: C.bg, borderRight: `1px solid ${C.rule}`, display: "flex", flexDirection: "column", flexShrink: 0, position: "fixed", top: 0, left: 0, bottom: 0, overflowY: "auto" }}>
          <div style={{ padding: "24px 20px 20px", borderBottom: `1px solid ${C.rule}` }}>
            <div style={{ fontSize: 14, fontWeight: 700, letterSpacing: "0.04em", color: C.ink }}>prudhvi.cms</div>
            <div style={{ fontSize: 9, color: C.mute, marginTop: 2, textTransform: "uppercase", letterSpacing: "0.14em" }}>Content Management</div>
          </div>
          <div style={{ flex: 1, paddingTop: 8 }}>
            {groups.map(group => {
              const items = SIDE_ITEMS.filter(s => s.group === group);
              return (
                <div key={group}>
                  <div style={{ padding: "12px 20px 4px", fontSize: 9, textTransform: "uppercase", letterSpacing: "0.16em", color: C.mute }}>{groupLabels[group]}</div>
                  {items.map(item => {
                    const active = tab === item.id;
                    return (
                      <button key={item.id} onClick={() => setTab(item.id)} style={{ display: "flex", alignItems: "center", gap: 10, width: "100%", padding: "9px 20px", background: active ? C.ink : "transparent", color: active ? C.bg : C.mute, border: "none", textAlign: "left", cursor: "pointer", fontSize: 12, fontFamily: mono, letterSpacing: "0.04em", transition: "all 0.1s" }}>
                        <span style={{ fontSize: 13, opacity: 0.8, flexShrink: 0 }}>{item.icon}</span>
                        <span style={{ flex: 1 }}>{item.label}</span>
                        {item.badge && item.badge > 0 && (
                          <span style={{ background: active ? C.bg : C.ink, color: active ? C.ink : C.bg, fontSize: 9, padding: "1px 6px", borderRadius: 8, fontWeight: 700, flexShrink: 0 }}>{item.badge}</span>
                        )}
                        {isDirty && active && <span style={{ marginLeft: "auto", width: 6, height: 6, borderRadius: "50%", background: active ? C.bg : C.mute, flexShrink: 0 }} />}
                      </button>
                    );
                  })}
                </div>
              );
            })}
          </div>
          <div style={{ borderTop: `1px solid ${C.rule}`, padding: "12px 0" }}>
            <button onClick={handleLogout} style={{ display: "flex", alignItems: "center", gap: 10, width: "100%", padding: "9px 20px", background: "transparent", color: "#cc0000", border: "none", textAlign: "left", cursor: "pointer", fontSize: 12, fontFamily: mono, letterSpacing: "0.04em" }}>
              <span style={{ fontSize: 13 }}>⏻</span><span>Logout</span>
            </button>
          </div>
        </div>

        {/* Main area */}
        <div style={{ marginLeft: 220, flex: 1, display: "flex", flexDirection: "column", minHeight: "100vh" }}>
          <div style={{ position: "sticky", top: 0, zIndex: 100, background: C.bg, borderBottom: `1px solid ${C.rule}`, padding: "0 40px", display: "flex", alignItems: "center", height: 52, gap: 16 }}>
            <div style={{ flex: 1, fontSize: 13, fontWeight: 700, letterSpacing: "0.04em", color: C.ink }}>
              {currentItem?.label ?? ""}
              {isDirty && <span style={{ marginLeft: 8, width: 6, height: 6, borderRadius: "50%", background: C.ink, display: "inline-block", verticalAlign: "middle" }} />}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              {lastSaved && <span style={{ fontSize: 10, color: C.mute, letterSpacing: "0.08em" }}>Saved {lastSaved.toLocaleTimeString()}</span>}
              <button onClick={toggleDarkAdmin} style={{ ...S.btnSecondary, fontSize: 11, padding: "6px 14px" }}>{darkAdmin ? "☀ Light" : "☾ Dark"}</button>
              <a href="/" target="_blank" rel="noopener noreferrer" style={{ ...S.btnSecondary, textDecoration: "none", fontSize: 11, padding: "6px 14px", display: "inline-block" }}>View Site →</a>
              <button onClick={save} style={{ ...S.btnPrimary, fontSize: 11, padding: "7px 16px" }} title="Cmd+S">Save ⌘S</button>
            </div>
          </div>
          <div style={{ flex: 1, padding: "40px 48px", maxWidth: 900 }}>
            {renderContent()}
          </div>
        </div>
      </div>

      <ToastStack toasts={toasts} onRemove={removeToast} C={C} />
    </>
  );
}
