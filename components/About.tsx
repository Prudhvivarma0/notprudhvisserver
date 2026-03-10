export function About() {
  return (
    <section id="about" className="py-[clamp(60px,8vw,120px)] px-6">
      <div className="max-w-[700px] mx-auto">

        <p className="font-mono text-sm mb-6" style={{ color: "var(--muted)" }}>
          // 01 ——— About
        </p>

        <h2
          className="font-display font-bold leading-tight mb-10"
          style={{ fontSize: "clamp(24px, 4vw, 36px)", color: "var(--text)" }}
        >
          Cybersecurity Engineer.{" "}
          <span style={{ color: "var(--accent)" }}>Builder.</span>
        </h2>

        <div className="space-y-5">

          <p style={{ fontSize: "clamp(13px, 1.3vw, 15px)", lineHeight: 1.9, color: "var(--muted)" }}>
            I&apos;m a cybersecurity engineer and full-stack developer. I work across the
            stack — cloud infrastructure, threat detection, applied ML, and web products.
            Currently finishing a thesis on Wi-Fi-based intrusion detection using deep
            learning, and consulting on digital products for Art Dubai.
          </p>

          <p style={{ fontSize: "clamp(13px, 1.3vw, 15px)", lineHeight: 1.9, color: "var(--muted)" }}>
            On the security side: cloud threat monitoring on AWS, vulnerability research
            for enterprises including AIG, ANZ, Mastercard, and Telstra, and building
            tooling for cryptography and network defence. On the product side: full-stack
            development, platform strategy, and whatever ships fastest without cutting corners.
          </p>

          <p style={{ fontSize: "clamp(13px, 1.3vw, 15px)", lineHeight: 1.9, color: "var(--muted)" }}>
            I&apos;m looking for roles where security and engineering overlap — building
            infrastructure that&apos;s hard to break, or tools that make it easier to
            find out when something has.
          </p>

        </div>

      </div>
    </section>
  );
}
