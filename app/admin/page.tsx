"use client";

import { useEffect, useState, useCallback, useRef, DragEvent } from "react";
import { DEFAULT_CONTENT, SiteContent } from "@/lib/content";

// ── Constants ─────────────────────────────────────────────────────────────────

const mono = "'JetBrains Mono', 'Fira Code', monospace";

const C = {
  bg:     "#ffffff",
  ink:    "#0a0a0a",
  mute:   "#8a8a8a",
  rule:   "#e6e6e6",
  accent: "#0a0a0a",
  faint:  "#f7f7f7",
};

// ── Style helpers ─────────────────────────────────────────────────────────────

const S = {
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
    boxSizing: "border-box",
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
    boxSizing: "border-box",
    resize: "vertical",
    minHeight: 80,
    marginBottom: 4,
  }),

  label: {
    display: "block",
    fontSize: 10,
    textTransform: "uppercase",
    letterSpacing: "0.12em",
    color: C.mute,
    marginBottom: 4,
  } as React.CSSProperties,

  btnPrimary: {
    padding: "10px 20px",
    background: C.accent,
    color: "#fff",
    border: "none",
    borderRadius: 4,
    fontSize: 12,
    fontFamily: mono,
    cursor: "pointer",
    letterSpacing: "0.06em",
    textTransform: "uppercase",
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
    textTransform: "uppercase",
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

  card: {
    border: `1px solid ${C.rule}`,
    borderRadius: 4,
    padding: "16px 20px",
    marginBottom: 12,
    background: C.faint,
  } as React.CSSProperties,

  sectionH: {
    fontSize: 11,
    textTransform: "uppercase",
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
    flexWrap: "wrap",
  } as React.CSSProperties,

  field: {
    display: "flex",
    flexDirection: "column",
    flex: 1,
    minWidth: 160,
  } as React.CSSProperties,
};

// ── Types ─────────────────────────────────────────────────────────────────────

type Tab =
  | "dashboard"
  | "appearance"
  | "seo"
  | "sections"
  | "media"
  | "hero"
  | "disciplines"
  | "about"
  | "projects"
  | "experience"
  | "certs"
  | "achievements"
  | "contact";

interface SideItem { id: Tab; icon: string; label: string; group?: string }

const SIDE_ITEMS: SideItem[] = [
  { id: "dashboard",    icon: "◈", label: "Dashboard",         group: "overview" },
  { id: "appearance",  icon: "◐", label: "Appearance",         group: "settings" },
  { id: "seo",         icon: "⌖", label: "SEO",                group: "settings" },
  { id: "sections",    icon: "▤", label: "Sections",            group: "settings" },
  { id: "media",       icon: "▣", label: "Media",               group: "settings" },
  { id: "hero",        icon: "✦", label: "Hero",                group: "content" },
  { id: "disciplines", icon: "≡", label: "Disciplines",         group: "content" },
  { id: "about",       icon: "☺", label: "About",               group: "content" },
  { id: "projects",    icon: "◻", label: "Projects",            group: "content" },
  { id: "experience",  icon: "⟳", label: "Experience",          group: "content" },
  { id: "certs",       icon: "✓", label: "Certifications",      group: "content" },
  { id: "achievements",icon: "★", label: "Achievements",        group: "content" },
  { id: "contact",     icon: "✉", label: "Contact",             group: "content" },
];

interface Toast { id: number; msg: string; ok: boolean }
interface EditorProps {
  content: SiteContent;
  onChange: (c: SiteContent) => void;
  onSave: () => void;
  dirty: boolean;
}

// ── Toast system ──────────────────────────────────────────────────────────────

function ToastStack({ toasts, onRemove }: { toasts: Toast[]; onRemove: (id: number) => void }) {
  return (
    <div style={{ position: "fixed", bottom: 24, right: 24, zIndex: 9999, display: "flex", flexDirection: "column", gap: 8 }}>
      {toasts.map(t => (
        <div
          key={t.id}
          style={{
            background: t.ok ? C.ink : "#cc0000",
            color: "#fff",
            padding: "12px 20px",
            borderRadius: 6,
            fontSize: 12,
            fontFamily: mono,
            letterSpacing: "0.06em",
            display: "flex",
            alignItems: "center",
            gap: 12,
            boxShadow: "0 4px 16px rgba(0,0,0,0.15)",
            animation: "slideUp 0.2s ease",
          }}
        >
          {t.msg}
          <button
            onClick={() => onRemove(t.id)}
            style={{ background: "none", border: "none", color: "rgba(255,255,255,0.6)", cursor: "pointer", fontSize: 14, padding: 0, lineHeight: 1 }}
          >×</button>
        </div>
      ))}
    </div>
  );
}

// ── Reusable field components ─────────────────────────────────────────────────

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label style={S.label}>{label}</label>
      {children}
    </div>
  );
}

function CharTextarea({
  value, onChange, maxLen = 160, label, minHeight = 80,
}: { value: string; onChange: (v: string) => void; maxLen?: number; label: string; minHeight?: number }) {
  const over = value.length > maxLen;
  return (
    <div style={{ marginBottom: 12 }}>
      <label style={S.label}>{label}</label>
      <textarea
        style={{ ...S.textarea(over), minHeight, marginBottom: 4 }}
        value={value}
        onChange={e => onChange(e.target.value)}
        onFocus={e => (e.target.style.borderColor = C.ink)}
        onBlur={e => (e.target.style.borderColor = over ? "#cc0000" : C.rule)}
      />
      <div style={{ fontSize: 10, textAlign: "right", color: over ? "#cc0000" : C.mute, fontFamily: mono }}>
        {value.length}/{maxLen}
      </div>
    </div>
  );
}

function FocusInput({
  value, onChange, invalid = false, style = {},
}: { value: string; onChange: (v: string) => void; invalid?: boolean; style?: React.CSSProperties }) {
  return (
    <input
      style={{ ...S.input(invalid), ...style }}
      value={value}
      onChange={e => onChange(e.target.value)}
      onFocus={e => (e.target.style.borderColor = C.ink)}
      onBlur={e => (e.target.style.borderColor = invalid ? "#cc0000" : C.rule)}
    />
  );
}

// ── Drag handle + list reorder ────────────────────────────────────────────────

function DragHandle() {
  return (
    <div
      style={{
        cursor: "grab",
        color: C.mute,
        fontSize: 16,
        padding: "0 8px",
        userSelect: "none",
        flexShrink: 0,
        display: "flex",
        alignItems: "center",
      }}
      title="Drag to reorder"
    >
      ⠿
    </div>
  );
}

function useDragList<T>(
  items: T[],
  onReorder: (next: T[]) => void,
) {
  const dragIdx = useRef<number | null>(null);
  const overIdx = useRef<number | null>(null);

  const onDragStart = (i: number) => { dragIdx.current = i; };
  const onDragOver = (e: DragEvent, i: number) => {
    e.preventDefault();
    overIdx.current = i;
  };
  const onDrop = (e: DragEvent) => {
    e.preventDefault();
    if (dragIdx.current === null || overIdx.current === null) return;
    const next = [...items];
    const [moved] = next.splice(dragIdx.current, 1);
    next.splice(overIdx.current, 0, moved);
    dragIdx.current = null;
    overIdx.current = null;
    onReorder(next);
  };
  const onDragEnd = () => { dragIdx.current = null; overIdx.current = null; };

  return { onDragStart, onDragOver, onDrop, onDragEnd };
}

// ── Toggle switch ─────────────────────────────────────────────────────────────

function Toggle({ value, onChange, label }: { value: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <div
      style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 0", borderBottom: `1px solid ${C.rule}` }}
    >
      <span style={{ fontSize: 13, fontFamily: mono, color: C.ink }}>{label}</span>
      <button
        onClick={() => onChange(!value)}
        style={{
          width: 44,
          height: 24,
          borderRadius: 12,
          background: value ? C.ink : C.rule,
          border: "none",
          cursor: "pointer",
          position: "relative",
          transition: "background 0.2s",
          flexShrink: 0,
        }}
      >
        <span
          style={{
            position: "absolute",
            top: 3,
            left: value ? 23 : 3,
            width: 18,
            height: 18,
            borderRadius: "50%",
            background: "#fff",
            transition: "left 0.2s",
            display: "block",
          }}
        />
      </button>
    </div>
  );
}

// ── Dashboard ─────────────────────────────────────────────────────────────────

function Dashboard({
  content,
  lastSaved,
  onTabChange,
}: { content: SiteContent; lastSaved: Date | null; onTabChange: (t: Tab) => void }) {
  const hour = new Date().getHours();
  const greet = hour < 12 ? "morning" : hour < 17 ? "afternoon" : "evening";

  const stats = [
    { label: "Projects",    value: content.projects.length },
    { label: "Certifications", value: content.certifications.length },
    { label: "Experience entries", value: content.experience.length },
    { label: "Disciplines", value: content.disciplines.length },
  ];

  return (
    <div>
      {/* Welcome */}
      <div style={{ marginBottom: 32, padding: "28px 32px", border: `1px solid ${C.rule}`, borderRadius: 4, background: C.faint }}>
        <div style={{ fontSize: 22, fontWeight: 700, marginBottom: 6, letterSpacing: "0.02em" }}>
          Good {greet}, Prudhvi.
        </div>
        <div style={{ fontSize: 13, color: C.mute }}>
          {lastSaved
            ? `Content last saved ${lastSaved.toLocaleTimeString()}`
            : "No changes saved yet this session."}
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 32 }}>
        {stats.map(s => (
          <div key={s.label} style={{ border: `1px solid ${C.rule}`, borderRadius: 4, padding: "20px 16px", textAlign: "center" }}>
            <div style={{ fontSize: 32, fontWeight: 700, marginBottom: 4 }}>{s.value}</div>
            <div style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "0.12em", color: C.mute }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Quick links */}
      <div style={{ marginBottom: 12, ...S.sectionH }}>Quick access</div>
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          style={{ ...S.btnSecondary, textDecoration: "none", display: "inline-block" }}
        >
          View Site →
        </a>
        <button style={S.btnSecondary} onClick={() => onTabChange("hero")}>Edit Hero →</button>
        <button style={S.btnSecondary} onClick={() => onTabChange("projects")}>Edit Projects →</button>
        <button style={S.btnSecondary} onClick={() => onTabChange("appearance")}>Appearance →</button>
        <button style={S.btnSecondary} onClick={() => onTabChange("seo")}>SEO →</button>
      </div>
    </div>
  );
}

// ── Appearance ────────────────────────────────────────────────────────────────

function AppearanceEditor({ content, onChange, onSave, dirty }: EditorProps) {
  const a = content.appearance;
  const set = (k: keyof SiteContent["appearance"], v: string) =>
    onChange({ ...content, appearance: { ...a, [k]: v } });

  return (
    <div>
      <div style={S.sectionH}>Appearance</div>

      <Field label="Logo text">
        <FocusInput value={a.logo} onChange={v => set("logo", v)} />
      </Field>

      <Field label="Accent color (available dot)">
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
          <input
            type="color"
            value={a.accentColor}
            onChange={e => set("accentColor", e.target.value)}
            style={{ width: 48, height: 36, border: `1px solid ${C.rule}`, borderRadius: 4, cursor: "pointer", padding: 2 }}
          />
          <FocusInput
            value={a.accentColor}
            onChange={v => set("accentColor", v)}
            style={{ marginBottom: 0, maxWidth: 140 }}
          />
        </div>
      </Field>

      {/* Preview */}
      <div style={{ border: `1px solid ${C.rule}`, borderRadius: 4, padding: "20px 24px", marginBottom: 24, background: "#fff" }}>
        <div style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "0.14em", color: C.mute, marginBottom: 16 }}>Preview</div>
        <div style={{
          padding: "16px 24px",
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr",
          alignItems: "center",
          borderBottom: `1px solid ${C.rule}`,
          fontFamily: mono,
          fontSize: 12,
          letterSpacing: "0.12em",
          textTransform: "uppercase",
        }}>
          <span>{a.logo || "PV—2026"}</span>
          <span style={{ textAlign: "center", color: C.mute }}>Projects · About · Contact</span>
          <span style={{ textAlign: "right", display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 8 }}>
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: a.accentColor, display: "inline-block" }} />
            AVAILABLE
          </span>
        </div>
      </div>

      <button style={S.btnPrimary} onClick={onSave}>Save Appearance{dirty ? " *" : ""}</button>
    </div>
  );
}

// ── SEO ───────────────────────────────────────────────────────────────────────

function SeoEditor({ content, onChange, onSave, dirty }: EditorProps) {
  const s = content.seo;
  const set = (k: keyof SiteContent["seo"], v: string) =>
    onChange({ ...content, seo: { ...s, [k]: v } });

  return (
    <div>
      <div style={S.sectionH}>SEO</div>

      <Field label="Site title">
        <FocusInput value={s.title} onChange={v => set("title", v)} invalid={!s.title} />
      </Field>

      <CharTextarea
        label="Meta description (max 160 chars)"
        value={s.description}
        onChange={v => set("description", v)}
        maxLen={160}
        minHeight={80}
      />

      <Field label="OG image URL (leave empty to skip)">
        <FocusInput value={s.ogImage} onChange={v => set("ogImage", v)} />
      </Field>

      {/* Google search preview */}
      <div style={{ border: `1px solid ${C.rule}`, borderRadius: 4, padding: "20px 24px", marginBottom: 24, background: "#fff" }}>
        <div style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "0.14em", color: C.mute, marginBottom: 16 }}>Google preview</div>
        <div style={{ maxWidth: 600 }}>
          <div style={{ fontSize: 12, color: C.mute, marginBottom: 4, fontFamily: "sans-serif" }}>https://prudhvi.dev</div>
          <div style={{ fontSize: 18, color: "#1a0dab", fontFamily: "sans-serif", marginBottom: 4, cursor: "pointer" }}>
            {s.title || "Prudhvi Varma"}
          </div>
          <div style={{ fontSize: 13, color: "#4d5156", fontFamily: "sans-serif", lineHeight: 1.5 }}>
            {s.description
              ? (s.description.length > 160 ? s.description.slice(0, 157) + "…" : s.description)
              : <span style={{ color: C.mute, fontStyle: "italic" }}>No description set.</span>
            }
          </div>
        </div>
      </div>

      <button style={S.btnPrimary} onClick={onSave}>Save SEO{dirty ? " *" : ""}</button>
    </div>
  );
}

// ── Sections ──────────────────────────────────────────────────────────────────

function SectionsEditor({ content, onChange, onSave, dirty }: EditorProps) {
  const sec = content.sections;
  const set = (k: keyof SiteContent["sections"], v: boolean) =>
    onChange({ ...content, sections: { ...sec, [k]: v } });

  const items: { key: keyof SiteContent["sections"]; label: string }[] = [
    { key: "disciplines", label: "Disciplines Band"          },
    { key: "about",       label: "About"                     },
    { key: "work",        label: "Selected Work"             },
    { key: "timeline",    label: "Experience"      },
    { key: "certs",       label: "Certifications & Achievements" },
    { key: "contact",     label: "Contact"                   },
  ];

  return (
    <div>
      <div style={S.sectionH}>Section visibility</div>
      <div style={{ border: `1px solid ${C.rule}`, borderRadius: 4, padding: "0 20px", marginBottom: 24, background: "#fff" }}>
        {items.map(({ key, label }) => (
          <Toggle key={key} label={label} value={sec[key]} onChange={v => set(key, v)} />
        ))}
      </div>
      <button style={S.btnPrimary} onClick={onSave}>Save Sections{dirty ? " *" : ""}</button>
    </div>
  );
}

// ── Media ─────────────────────────────────────────────────────────────────────

function MediaEditor({ content, onChange, onSave, dirty }: EditorProps) {
  const portrait = content.media?.portrait ?? "";
  const [dragging, setDragging] = useState(false);

  const processFile = (file: File) => {
    if (file.size > 2 * 1024 * 1024) {
      alert("File too large. Max 2 MB.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      onChange({ ...content, media: { ...content.media, portrait: result } });
    };
    reader.readAsDataURL(file);
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) processFile(f);
  };

  const onDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragging(false);
    const f = e.dataTransfer.files[0];
    if (f && f.type.startsWith("image/")) processFile(f);
  };

  const sizeKB = portrait ? Math.round((portrait.length * 3) / 4 / 1024) : 0;

  return (
    <div>
      <div style={S.sectionH}>Media — portrait</div>

      <div style={{ display: "flex", gap: 32, flexWrap: "wrap", marginBottom: 24 }}>
        {/* Preview */}
        <div>
          <div style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "0.12em", color: C.mute, marginBottom: 8 }}>Current portrait</div>
          <div
            style={{
              width: 190,
              height: 240,
              background: C.faint,
              border: `1px solid ${C.rule}`,
              borderRadius: 4,
              overflow: "hidden",
              position: "relative",
            }}
          >
            {portrait ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={portrait} alt="Portrait preview" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            ) : (
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", color: C.mute, fontSize: 12, fontFamily: mono }}>
                /portrait.jpg
              </div>
            )}
          </div>
          {sizeKB > 0 && (
            <div style={{ fontSize: 10, color: sizeKB > 500 ? "#cc0000" : C.mute, marginTop: 6, fontFamily: mono }}>
              {sizeKB} KB {sizeKB > 500 ? "— Warning: large file" : ""}
            </div>
          )}
        </div>

        {/* Upload zone */}
        <div style={{ flex: 1, minWidth: 240 }}>
          <div style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "0.12em", color: C.mute, marginBottom: 8 }}>Upload new portrait</div>
          <label
            style={{ display: "block", cursor: "pointer" }}
            onDragOver={e => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={onDrop as unknown as React.DragEventHandler<HTMLLabelElement>}
          >
            <div
              style={{
                border: `2px dashed ${dragging ? C.ink : C.rule}`,
                borderRadius: 4,
                padding: "40px 24px",
                textAlign: "center",
                background: dragging ? "#f0f0f0" : C.bg,
                transition: "all 0.15s",
              }}
            >
              <div style={{ fontSize: 28, marginBottom: 12 }}>▣</div>
              <div style={{ fontSize: 13, fontFamily: mono, color: C.ink, marginBottom: 4 }}>
                Drop image here or click to upload
              </div>
              <div style={{ fontSize: 11, color: C.mute, fontFamily: mono }}>JPG, PNG, WebP · Max 2MB</div>
              <input
                type="file"
                accept="image/*"
                onChange={onFileChange}
                style={{ display: "none" }}
              />
            </div>
          </label>

          {portrait && (
            <button
              style={{ ...S.btnDanger, marginTop: 12, display: "block" }}
              onClick={() => onChange({ ...content, media: { ...content.media, portrait: "" } })}
            >
              Remove photo (revert to /portrait.jpg)
            </button>
          )}
        </div>
      </div>

      <button style={S.btnPrimary} onClick={onSave}>Save Media{dirty ? " *" : ""}</button>
    </div>
  );
}

// ── Hero editor ───────────────────────────────────────────────────────────────

function HeroEditor({ content, onChange, onSave, dirty }: EditorProps) {
  const h = content.hero;
  const set = (k: keyof SiteContent["hero"], v: string) =>
    onChange({ ...content, hero: { ...h, [k]: v } });

  return (
    <div>
      <div style={S.sectionH}>Hero</div>
      <Field label="Meta text"><FocusInput value={h.meta} onChange={v => set("meta", v)} /></Field>
      <Field label="Headline line 1"><FocusInput value={h.headline1} onChange={v => set("headline1", v)} invalid={!h.headline1} /></Field>
      <Field label="Headline line 2"><FocusInput value={h.headline2} onChange={v => set("headline2", v)} invalid={!h.headline2} /></Field>
      <CharTextarea label="Intro paragraph" value={h.intro} onChange={v => set("intro", v)} maxLen={300} minHeight={80} />
      <Field label="CTA — Work button"><FocusInput value={h.ctaWork} onChange={v => set("ctaWork", v)} /></Field>
      <Field label="CTA — Contact button"><FocusInput value={h.ctaContact} onChange={v => set("ctaContact", v)} /></Field>
      <button style={S.btnPrimary} onClick={onSave}>Save Hero{dirty ? " *" : ""}</button>
    </div>
  );
}

// ── Disciplines ───────────────────────────────────────────────────────────────

function DisciplinesEditor({ content, onChange, onSave, dirty }: EditorProps) {
  const items = content.disciplines;
  const { onDragStart, onDragOver, onDrop, onDragEnd } = useDragList(items, next =>
    onChange({ ...content, disciplines: next }),
  );

  const setItem = (i: number, key: "num" | "label", v: string) => {
    onChange({ ...content, disciplines: items.map((d, idx) => idx === i ? { ...d, [key]: v } : d) });
  };
  const add = () => onChange({ ...content, disciplines: [...items, { num: String(items.length + 1).padStart(2, "0"), label: "New discipline" }] });
  const remove = (i: number) => onChange({ ...content, disciplines: items.filter((_, idx) => idx !== i) });

  return (
    <div>
      <div style={S.sectionH}>Disciplines</div>
      {items.map((d, i) => (
        <div
          key={i}
          draggable
          onDragStart={() => onDragStart(i)}
          onDragOver={e => onDragOver(e, i)}
          onDrop={onDrop}
          onDragEnd={onDragEnd}
          style={{ ...S.card, display: "flex", gap: 8, alignItems: "center" }}
        >
          <DragHandle />
          <div style={{ width: 64 }}>
            <label style={S.label}>Num</label>
            <FocusInput value={d.num} onChange={v => setItem(i, "num", v)} style={{ marginBottom: 0 }} />
          </div>
          <div style={{ flex: 1 }}>
            <label style={S.label}>Label</label>
            <FocusInput value={d.label} onChange={v => setItem(i, "label", v)} style={{ marginBottom: 0 }} invalid={!d.label} />
          </div>
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

function AboutEditor({ content, onChange, onSave, dirty }: EditorProps) {
  const a = content.about;
  const set = (k: keyof SiteContent["about"], v: string) =>
    onChange({ ...content, about: { ...a, [k]: v } });

  return (
    <div>
      <div style={S.sectionH}>About</div>
      <Field label="Heading line 1 (e.g. Architect.)"><FocusInput value={a.heading1} onChange={v => set("heading1", v)} /></Field>
      <Field label="Heading line 2 (e.g. Developer.)"><FocusInput value={a.heading2} onChange={v => set("heading2", v)} /></Field>
      <Field label="Heading line 3 (e.g. Curious.)"><FocusInput value={a.heading3} onChange={v => set("heading3", v)} /></Field>
      <CharTextarea label="Bio paragraph 1" value={a.bio1} onChange={v => set("bio1", v)} maxLen={400} minHeight={100} />
      <CharTextarea label="Bio paragraph 2" value={a.bio2} onChange={v => set("bio2", v)} maxLen={400} minHeight={100} />
      <div style={S.row}>
        <div style={S.field}>
          <Field label="Portrait caption"><FocusInput value={a.portraitCaption} onChange={v => set("portraitCaption", v)} /></Field>
        </div>
        <div style={S.field}>
          <Field label="Portrait year"><FocusInput value={a.portraitYear} onChange={v => set("portraitYear", v)} /></Field>
        </div>
      </div>
      <button style={S.btnPrimary} onClick={onSave}>Save About{dirty ? " *" : ""}</button>
    </div>
  );
}

// ── Projects ──────────────────────────────────────────────────────────────────

function ProjectsEditor({ content, onChange, onSave, dirty }: EditorProps) {
  const projects = content.projects;
  const { onDragStart, onDragOver, onDrop, onDragEnd } = useDragList(projects, next =>
    onChange({ ...content, projects: next }),
  );

  const setP = (i: number, k: keyof SiteContent["projects"][number], v: string) =>
    onChange({ ...content, projects: projects.map((p, idx) => idx === i ? { ...p, [k]: v } : p) });
  const add = () => onChange({
    ...content,
    projects: [...projects, { n: String(projects.length + 1).padStart(2, "0"), title: "New Project", year: "2026", meta: "", desc: "", link: "" }],
  });
  const remove = (i: number) => onChange({ ...content, projects: projects.filter((_, idx) => idx !== i) });

  return (
    <div>
      <div style={S.sectionH}>Projects ({projects.length})</div>
      {projects.map((p, i) => (
        <div
          key={i}
          draggable
          onDragStart={() => onDragStart(i)}
          onDragOver={e => onDragOver(e, i)}
          onDrop={onDrop}
          onDragEnd={onDragEnd}
          style={S.card}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <DragHandle />
              <span style={{ fontSize: 10, color: C.mute, letterSpacing: "0.1em", textTransform: "uppercase" }}>Project {i + 1}</span>
            </div>
            <button style={S.btnDanger} onClick={() => remove(i)}>Remove</button>
          </div>
          <div style={S.row}>
            <div style={{ ...S.field, maxWidth: 80 }}>
              <Field label="N"><FocusInput value={p.n} onChange={v => setP(i, "n", v)} /></Field>
            </div>
            <div style={{ ...S.field, flex: 3 }}>
              <Field label="Title"><FocusInput value={p.title} onChange={v => setP(i, "title", v)} invalid={!p.title} /></Field>
            </div>
            <div style={{ ...S.field, maxWidth: 100 }}>
              <Field label="Year"><FocusInput value={p.year} onChange={v => setP(i, "year", v)} /></Field>
            </div>
          </div>
          <Field label="Meta tags"><FocusInput value={p.meta} onChange={v => setP(i, "meta", v)} /></Field>
          <CharTextarea label="Description" value={p.desc} onChange={v => setP(i, "desc", v)} maxLen={200} minHeight={64} />
          <Field label="Link (URL or leave empty)"><FocusInput value={p.link ?? ""} onChange={v => setP(i, "link", v)} /></Field>
        </div>
      ))}
      <div style={{ display: "flex", gap: 12, marginTop: 4 }}>
        <button style={S.btnSecondary} onClick={add}>+ Add project</button>
        <button style={S.btnPrimary} onClick={onSave}>Save Projects{dirty ? " *" : ""}</button>
      </div>
    </div>
  );
}

// ── Experience ────────────────────────────────────────────────────────────────

function ExperienceEditor({ content, onChange, onSave, dirty }: EditorProps) {
  const exp = content.experience;
  const { onDragStart, onDragOver, onDrop, onDragEnd } = useDragList(exp, next =>
    onChange({ ...content, experience: next }),
  );

  const setE = (i: number, k: keyof SiteContent["experience"][number], v: string) =>
    onChange({ ...content, experience: exp.map((e, idx) => idx === i ? { ...e, [k]: v } : e) });
  const add = () => onChange({ ...content, experience: [...exp, { dateRange: "JAN 2026 —", org: "Company", role: "Role" }] });
  const remove = (i: number) => onChange({ ...content, experience: exp.filter((_, idx) => idx !== i) });

  return (
    <div>
      <div style={S.sectionH}>Experience ({exp.length})</div>
      {exp.map((e, i) => (
        <div
          key={i}
          draggable
          onDragStart={() => onDragStart(i)}
          onDragOver={ev => onDragOver(ev, i)}
          onDrop={onDrop}
          onDragEnd={onDragEnd}
          style={S.card}
        >
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12, alignItems: "center" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <DragHandle />
              <span style={{ fontSize: 10, color: C.mute, letterSpacing: "0.1em", textTransform: "uppercase" }}>Entry {i + 1}</span>
            </div>
            <button style={S.btnDanger} onClick={() => remove(i)}>Remove</button>
          </div>
          <div style={S.row}>
            <div style={S.field}>
              <Field label="Date range"><FocusInput value={e.dateRange} onChange={v => setE(i, "dateRange", v)} /></Field>
            </div>
            <div style={S.field}>
              <Field label="Organisation"><FocusInput value={e.org} onChange={v => setE(i, "org", v)} invalid={!e.org} /></Field>
            </div>
            <div style={{ ...S.field, flex: 2 }}>
              <Field label="Role"><FocusInput value={e.role} onChange={v => setE(i, "role", v)} invalid={!e.role} /></Field>
            </div>
          </div>
        </div>
      ))}
      <div style={{ display: "flex", gap: 12, marginTop: 4 }}>
        <button style={S.btnSecondary} onClick={add}>+ Add entry</button>
        <button style={S.btnPrimary} onClick={onSave}>Save Experience{dirty ? " *" : ""}</button>
      </div>
    </div>
  );
}

// ── Certifications ────────────────────────────────────────────────────────────

function CertsEditor({ content, onChange, onSave, dirty }: EditorProps) {
  const certs = content.certifications;
  const { onDragStart, onDragOver, onDrop, onDragEnd } = useDragList(certs, next =>
    onChange({ ...content, certifications: next }),
  );

  const setC = (i: number, k: keyof SiteContent["certifications"][number], v: string) =>
    onChange({ ...content, certifications: certs.map((c, idx) => idx === i ? { ...c, [k]: v } : c) });
  const add = () => onChange({ ...content, certifications: [...certs, { name: "New Cert", issuer: "Issuer", label: "JAN 2026" }] });
  const remove = (i: number) => onChange({ ...content, certifications: certs.filter((_, idx) => idx !== i) });

  return (
    <div>
      <div style={S.sectionH}>Certifications ({certs.length})</div>
      {certs.map((c, i) => (
        <div
          key={i}
          draggable
          onDragStart={() => onDragStart(i)}
          onDragOver={e => onDragOver(e, i)}
          onDrop={onDrop}
          onDragEnd={onDragEnd}
          style={{ ...S.card, display: "flex", gap: 8, alignItems: "center" }}
        >
          <DragHandle />
          <div style={{ flex: 2 }}>
            <label style={S.label}>Name</label>
            <FocusInput value={c.name} onChange={v => setC(i, "name", v)} invalid={!c.name} style={{ marginBottom: 0 }} />
          </div>
          <div style={{ flex: 2 }}>
            <label style={S.label}>Issuer</label>
            <FocusInput value={c.issuer} onChange={v => setC(i, "issuer", v)} style={{ marginBottom: 0 }} />
          </div>
          <div style={{ flex: 1 }}>
            <label style={S.label}>Date</label>
            <FocusInput value={c.label} onChange={v => setC(i, "label", v)} style={{ marginBottom: 0 }} />
          </div>
          <button style={S.btnDanger} onClick={() => remove(i)}>Remove</button>
        </div>
      ))}
      <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
        <button style={S.btnSecondary} onClick={add}>+ Add cert</button>
        <button style={S.btnPrimary} onClick={onSave}>Save Certs{dirty ? " *" : ""}</button>
      </div>
    </div>
  );
}

// ── Achievements ──────────────────────────────────────────────────────────────

function AchievementsEditor({ content, onChange, onSave, dirty }: EditorProps) {
  const ach = content.achievements;
  const { onDragStart, onDragOver, onDrop, onDragEnd } = useDragList(ach, next =>
    onChange({ ...content, achievements: next }),
  );

  const setA = (i: number, k: keyof SiteContent["achievements"][number], v: string) =>
    onChange({ ...content, achievements: ach.map((a, idx) => idx === i ? { ...a, [k]: v } : a) });
  const add = () => onChange({ ...content, achievements: [...ach, { name: "PLACE", label: "EVENT NAME" }] });
  const remove = (i: number) => onChange({ ...content, achievements: ach.filter((_, idx) => idx !== i) });

  return (
    <div>
      <div style={S.sectionH}>Achievements ({ach.length})</div>
      {ach.map((a, i) => (
        <div
          key={i}
          draggable
          onDragStart={() => onDragStart(i)}
          onDragOver={e => onDragOver(e, i)}
          onDrop={onDrop}
          onDragEnd={onDragEnd}
          style={{ ...S.card, display: "flex", gap: 8, alignItems: "center" }}
        >
          <DragHandle />
          <div style={{ flex: 1 }}>
            <label style={S.label}>Name / Place</label>
            <FocusInput value={a.name} onChange={v => setA(i, "name", v)} invalid={!a.name} style={{ marginBottom: 0 }} />
          </div>
          <div style={{ flex: 2 }}>
            <label style={S.label}>Label / Event</label>
            <FocusInput value={a.label} onChange={v => setA(i, "label", v)} style={{ marginBottom: 0 }} />
          </div>
          <button style={S.btnDanger} onClick={() => remove(i)}>Remove</button>
        </div>
      ))}
      <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
        <button style={S.btnSecondary} onClick={add}>+ Add achievement</button>
        <button style={S.btnPrimary} onClick={onSave}>Save Achievements{dirty ? " *" : ""}</button>
      </div>
    </div>
  );
}

// ── Contact ───────────────────────────────────────────────────────────────────

function ContactEditor({ content, onChange, onSave, dirty }: EditorProps) {
  const c = content.contact;
  const set = (k: keyof SiteContent["contact"], v: string) =>
    onChange({ ...content, contact: { ...c, [k]: v } });

  return (
    <div>
      <div style={S.sectionH}>Contact</div>
      <Field label="Email"><FocusInput value={c.email} onChange={v => set("email", v)} invalid={!c.email} /></Field>
      <Field label="GitHub URL"><FocusInput value={c.github} onChange={v => set("github", v)} /></Field>
      <Field label="LinkedIn URL"><FocusInput value={c.linkedin} onChange={v => set("linkedin", v)} /></Field>
      <div style={S.row}>
        <div style={S.field}>
          <Field label="Footer — left"><FocusInput value={c.footerLeft} onChange={v => set("footerLeft", v)} /></Field>
        </div>
        <div style={S.field}>
          <Field label="Footer — center"><FocusInput value={c.footerCenter} onChange={v => set("footerCenter", v)} /></Field>
        </div>
        <div style={S.field}>
          <Field label="Footer — right"><FocusInput value={c.footerRight} onChange={v => set("footerRight", v)} /></Field>
        </div>
      </div>
      <CharTextarea label="Confession text (tiny footer note)" value={c.confession} onChange={v => set("confession", v)} maxLen={200} minHeight={64} />
      <button style={S.btnPrimary} onClick={onSave}>Save Contact{dirty ? " *" : ""}</button>
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
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${pw}` },
        body: JSON.stringify(DEFAULT_CONTENT),
      });
      if (res.status === 401) { setErr("Wrong password."); setBusy(false); return; }
      onLogin(pw);
    } catch {
      onLogin(pw); // local dev fallback
    }
    setBusy(false);
  };

  return (
    <div style={{ minHeight: "100vh", background: C.bg, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: mono }}>
      <div style={{ width: 360 }}>
        <div style={{ fontSize: 26, fontWeight: 700, marginBottom: 6, letterSpacing: "0.04em" }}>prudhvi.cms</div>
        <div style={{ fontSize: 10, color: C.mute, marginBottom: 40, textTransform: "uppercase", letterSpacing: "0.14em" }}>
          Content management
        </div>
        <label style={S.label}>Admin password</label>
        <input
          style={{ ...S.input(), marginBottom: 16 }}
          type="password"
          placeholder="Enter ADMIN_SECRET"
          value={pw}
          onChange={e => setPw(e.target.value)}
          onKeyDown={e => e.key === "Enter" && submit()}
          onFocus={e => (e.target.style.borderColor = C.ink)}
          onBlur={e => (e.target.style.borderColor = C.rule)}
          autoFocus
        />
        {err && <div style={{ color: "#cc0000", fontSize: 12, marginBottom: 12 }}>{err}</div>}
        <button
          style={{ ...S.btnPrimary, width: "100%", padding: "12px" }}
          onClick={submit}
          disabled={busy}
        >
          {busy ? "Checking…" : "Login →"}
        </button>
      </div>
    </div>
  );
}

// ── App ───────────────────────────────────────────────────────────────────────

export default function AdminPage() {
  const [token,    setToken]    = useState("");
  const [tab,      setTab]      = useState<Tab>("dashboard");
  const [content,  setContent]  = useState<SiteContent>(DEFAULT_CONTENT);
  const [saved,    setSaved]    = useState<SiteContent>(DEFAULT_CONTENT);
  const [lastSaved,setLastSaved]= useState<Date | null>(null);
  const [toasts,   setToasts]   = useState<Toast[]>([]);
  const [mounted,  setMounted]  = useState(false);
  const toastId = useRef(0);

  const isDirty = JSON.stringify(content) !== JSON.stringify(saved);

  useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem("cms_token");
    if (stored) setToken(stored);
  }, []);

  const addToast = (msg: string, ok: boolean) => {
    const id = ++toastId.current;
    setToasts(t => [...t, { id, msg, ok }]);
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 3000);
  };

  const removeToast = (id: number) => setToasts(t => t.filter(x => x.id !== id));

  const loadContent = useCallback(async () => {
    try {
      const res = await fetch("/api/content");
      if (res.ok) {
        const data = await res.json() as SiteContent;
        // Merge with defaults for new fields
        const merged: SiteContent = {
          ...DEFAULT_CONTENT,
          ...data,
          seo:        { ...DEFAULT_CONTENT.seo,        ...(data.seo        ?? {}) },
          appearance: { ...DEFAULT_CONTENT.appearance, ...(data.appearance ?? {}) },
          sections:   { ...DEFAULT_CONTENT.sections,   ...(data.sections   ?? {}) },
          media:      { ...DEFAULT_CONTENT.media,      ...(data.media      ?? {}) },
        };
        setContent(merged);
        setSaved(merged);
      }
    } catch { /* local dev — use defaults */ }
  }, []);

  useEffect(() => { if (token) loadContent(); }, [token, loadContent]);

  const handleLogin = (pw: string) => {
    setToken(pw);
    localStorage.setItem("cms_token", pw);
  };

  const handleLogout = () => {
    localStorage.removeItem("cms_token");
    setToken("");
  };

  const save = useCallback(async () => {
    try {
      const res = await fetch("/api/content", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(content),
      });
      if (res.ok) {
        setSaved({ ...content });
        setLastSaved(new Date());
        addToast("Saved ✓", true);
      } else if (res.status === 401) {
        addToast("Error: unauthorized.", false);
      } else {
        addToast("Error saving.", false);
      }
    } catch {
      setSaved({ ...content });
      setLastSaved(new Date());
      addToast("Saved (local — no DB) ✓", true);
    }
  }, [token, content]);

  // Cmd+S / Ctrl+S
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "s") {
        e.preventDefault();
        save();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [save]);

  if (!mounted) return null;
  if (!token)   return <Login onLogin={handleLogin} />;

  const currentItem = SIDE_ITEMS.find(s => s.id === tab);
  const editorProps: EditorProps = { content, onChange: setContent, onSave: save, dirty: isDirty };

  const renderContent = () => {
    switch (tab) {
      case "dashboard":    return <Dashboard content={content} lastSaved={lastSaved} onTabChange={setTab} />;
      case "appearance":   return <AppearanceEditor  {...editorProps} />;
      case "seo":          return <SeoEditor         {...editorProps} />;
      case "sections":     return <SectionsEditor    {...editorProps} />;
      case "media":        return <MediaEditor       {...editorProps} />;
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
        ::-webkit-scrollbar { width: 6px; } ::-webkit-scrollbar-track { background: #f0f0f0; } ::-webkit-scrollbar-thumb { background: #ccc; border-radius: 3px; }
      `}</style>

      <div style={{ minHeight: "100vh", background: C.bg, color: C.ink, fontFamily: mono, display: "flex" }}>

        {/* ── Sidebar ── */}
        <div style={{
          width: 220,
          background: C.bg,
          borderRight: `1px solid ${C.rule}`,
          display: "flex",
          flexDirection: "column",
          flexShrink: 0,
          position: "fixed",
          top: 0,
          left: 0,
          bottom: 0,
          overflowY: "auto",
        }}>
          {/* Brand */}
          <div style={{ padding: "24px 20px 20px", borderBottom: `1px solid ${C.rule}` }}>
            <div style={{ fontSize: 14, fontWeight: 700, letterSpacing: "0.04em" }}>prudhvi.cms</div>
            <div style={{ fontSize: 9, color: C.mute, marginTop: 2, textTransform: "uppercase", letterSpacing: "0.14em" }}>Content Management</div>
          </div>

          {/* Nav groups */}
          <div style={{ flex: 1, paddingTop: 8 }}>
            {groups.map(group => {
              const items = SIDE_ITEMS.filter(s => s.group === group);
              return (
                <div key={group}>
                  <div style={{ padding: "12px 20px 4px", fontSize: 9, textTransform: "uppercase", letterSpacing: "0.16em", color: C.mute }}>
                    {groupLabels[group]}
                  </div>
                  {items.map(item => {
                    const active = tab === item.id;
                    // check dirty per tab group for indicator
                    return (
                      <button
                        key={item.id}
                        onClick={() => setTab(item.id)}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 10,
                          width: "100%",
                          padding: "9px 20px",
                          background: active ? C.ink : "transparent",
                          color: active ? "#fff" : C.mute,
                          border: "none",
                          textAlign: "left",
                          cursor: "pointer",
                          fontSize: 12,
                          fontFamily: mono,
                          letterSpacing: "0.04em",
                          transition: "all 0.1s",
                        }}
                      >
                        <span style={{ fontSize: 13, opacity: 0.8, flexShrink: 0 }}>{item.icon}</span>
                        <span>{item.label}</span>
                        {isDirty && active && (
                          <span style={{ marginLeft: "auto", width: 6, height: 6, borderRadius: "50%", background: active ? "#fff" : C.mute, flexShrink: 0 }} />
                        )}
                      </button>
                    );
                  })}
                </div>
              );
            })}
          </div>

          {/* Logout */}
          <div style={{ borderTop: `1px solid ${C.rule}`, padding: "12px 0" }}>
            <button
              onClick={handleLogout}
              style={{
                display: "flex", alignItems: "center", gap: 10,
                width: "100%", padding: "9px 20px",
                background: "transparent", color: "#cc0000",
                border: "none", textAlign: "left", cursor: "pointer",
                fontSize: 12, fontFamily: mono, letterSpacing: "0.04em",
              }}
            >
              <span style={{ fontSize: 13 }}>⏻</span>
              <span>Logout</span>
            </button>
          </div>
        </div>

        {/* ── Main area ── */}
        <div style={{ marginLeft: 220, flex: 1, display: "flex", flexDirection: "column", minHeight: "100vh" }}>

          {/* Top bar */}
          <div style={{
            position: "sticky", top: 0, zIndex: 100,
            background: C.bg,
            borderBottom: `1px solid ${C.rule}`,
            padding: "0 40px",
            display: "flex",
            alignItems: "center",
            height: 52,
            gap: 16,
          }}>
            <div style={{ flex: 1, fontSize: 13, fontWeight: 700, letterSpacing: "0.04em" }}>
              {currentItem?.label ?? ""}
              {isDirty && <span style={{ marginLeft: 8, width: 6, height: 6, borderRadius: "50%", background: C.ink, display: "inline-block", verticalAlign: "middle" }} />}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              {lastSaved && (
                <span style={{ fontSize: 10, color: C.mute, letterSpacing: "0.08em" }}>
                  Saved {lastSaved.toLocaleTimeString()}
                </span>
              )}
              <a
                href="/"
                target="_blank"
                rel="noopener noreferrer"
                style={{ ...S.btnSecondary, textDecoration: "none", fontSize: 11, padding: "6px 14px", display: "inline-block" }}
              >
                View Site →
              </a>
              <button
                onClick={save}
                style={{ ...S.btnPrimary, fontSize: 11, padding: "7px 16px" }}
                title="Cmd+S"
              >
                Save ⌘S
              </button>
            </div>
          </div>

          {/* Content */}
          <div style={{ flex: 1, padding: "40px 48px", maxWidth: 900 }}>
            {renderContent()}
          </div>
        </div>
      </div>

      <ToastStack toasts={toasts} onRemove={removeToast} />
    </>
  );
}
