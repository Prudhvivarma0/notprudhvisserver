export function Footer() {
  return (
    <footer
      className="px-6 py-6 font-mono"
      style={{
        borderTop: "1px solid var(--muted)",
        display:   "flex",
        flexWrap:  "wrap",
        justifyContent: "space-between",
        gap:       "0.5rem",
      }}
    >
      <span style={{ fontSize: 10, color: "var(--muted)", opacity: 0.5 }}>
        © 2025 Prudhvi Varma
      </span>
      <span style={{ fontSize: 10, color: "var(--muted)", opacity: 0.5 }}>
        notprudhvisserver.org
      </span>
    </footer>
  );
}
