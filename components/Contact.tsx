import type { ContactRow } from "@/lib/db";

const DEFAULT_LINKS: ContactRow[] = [
  { id: 1, sort_order: 1, visible: 1, label: "SEND_EMAIL", href: "mailto:prudhvivarma31@gmail.com" },
  { id: 2, sort_order: 2, visible: 1, label: "LINKEDIN",   href: "https://www.linkedin.com/in/prudhvivarma11/" },
  { id: 3, sort_order: 3, visible: 1, label: "GITHUB",     href: "https://github.com/Prudhvivarma0?tab=repositories" },
];

export function Contact({ links }: { links?: ContactRow[] }) {
  const items = links && links.length > 0 ? links : DEFAULT_LINKS;

  return (
    <footer id="contact" style={{
      textAlign: "center", padding: "6rem 2rem",
      borderTop: "1px solid #222", marginTop: "4rem",
      background: "#020202",
    }}>
      <h2 style={{ color: "var(--accent-color)", marginBottom: "20px", fontSize: "1.6rem", letterSpacing: "3px" }}>
        // TERMINATE_SESSION
      </h2>
      <p style={{ fontSize: "1.1rem", color: "#fff", marginBottom: "2rem" }}>
        prudhvivarma31@gmail.com | Dubai, UAE
      </p>
      <div style={{ display: "flex", justifyContent: "center", gap: "15px", flexWrap: "wrap" }}>
        {items.map(link => (
          <a key={link.id} href={link.href} target="_blank" rel="noopener noreferrer" className="btn-glitch">
            {link.label}
          </a>
        ))}
      </div>
    </footer>
  );
}
