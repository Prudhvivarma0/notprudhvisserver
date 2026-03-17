import { AsciiPortrait } from "@/components/AsciiPortrait";

export function About() {
  return (
    <section id="about" className="py-[clamp(60px,8vw,120px)] px-6">
      <div
        style={{
          maxWidth:   "1000px",
          margin:     "0 auto",
          display:    "flex",
          flexWrap:   "wrap",
          alignItems: "flex-start",
          gap:        "clamp(2rem, 5vw, 4rem)",
        }}
      >
        {/* ── Left: bio text ─────────────────────────────────────────────── */}
        <div style={{ flex: "1.2 1 300px", minWidth: 0 }}>

          <p className="font-mono text-sm mb-6" style={{ color: "var(--muted)" }}>
            // 01 ——— who i am
          </p>

          <h2
            className="font-display font-bold leading-tight mb-10 reveal"
            style={{ fontSize: "clamp(24px, 4vw, 36px)", color: "var(--text)" }}
          >
            architect developer entrepreneur<span style={{ color: "var(--accent)" }}>?</span>
          </h2>

          <div className="space-y-5">

            <p className="reveal" style={{ fontSize: "clamp(13px, 1.3vw, 15px)", lineHeight: 1.9, color: "var(--muted)" }}>
              I want to build products that actually help people and lead teams that can make
              a real dent. Startups, side projects, freelance — if there&apos;s a problem
              worth solving, I&apos;m in.
            </p>

            <p className="reveal" style={{ fontSize: "clamp(13px, 1.3vw, 15px)", lineHeight: 1.9, color: "var(--muted)" }}>
              I live at the intersection of cyber, cloud, and development. Websites, apps,
              infrastructure — if it connects to the internet, I&apos;m probably interested.
              Curious by nature, always learning something new.
            </p>

            <p className="reveal" style={{ fontSize: "clamp(13px, 1.3vw, 15px)", lineHeight: 1.9, color: "var(--muted)" }}>
              My approach is smart work over hard work. I automate everything because I&apos;m
              lazy, and I&apos;ve turned that into an engineering philosophy. If a task can
              be scripted, it will be.
            </p>

          </div>
        </div>

        {/* ── Right: ASCII portrait ───────────────────────────────────────── */}
        <div
          className="portrait-col"
          style={{
            flex:        "0 0 auto",
            display:     "flex",
            alignItems:  "flex-start",
            paddingTop:  "80px",
          }}
        >
          <AsciiPortrait />
        </div>

      </div>

      {/* Hide portrait on mobile */}
      <style>{`
        @media (max-width: 768px) { .portrait-col { display: none !important; } }
      `}</style>
    </section>
  );
}
