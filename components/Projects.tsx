import type { ProjectRow } from "@/lib/db";

const DEFAULT_PROJECTS: ProjectRow[] = [
  {
    id: 1, sort_order: 1, visible: 1, icon_name: "", cover_image: "",
    cta_text: "View Repo", link_url: "https://github.com/Prudhvivarma0?tab=repositories",
    title: "Web App Penetration Test",
    description: "Conducted penetration tests on DVWA using Kali Linux and Burp Suite. Intercepted and manipulated traffic to exploit OWASP Top 10 vulnerabilities (SQLi, XSS, CSRF) and recommended mitigation strategies.",
  },
  {
    id: 2, sort_order: 2, visible: 1, icon_name: "", cover_image: "",
    cta_text: "View Repo", link_url: "https://github.com/Prudhvivarma0?tab=repositories",
    title: "Enterprise Job Simulations",
    description: "Performed advanced vulnerability research and threat analysis for AIG, ANZ, Mastercard, & Telstra. Mitigated Zero-Day Log4j exploits and conducted enterprise-grade risk assessments.",
  },
  {
    id: 3, sort_order: 3, visible: 1, icon_name: "", cover_image: "",
    cta_text: "View Repo", link_url: "https://github.com/Prudhvivarma0?tab=repositories",
    title: "AWS Threat Monitoring",
    description: "Built a cloud surveillance system using CloudTrail, EventBridge, and SNS. Secured EC2 instances by automating the detection of root user anomalies for compliance and incident response.",
  },
  {
    id: 4, sort_order: 4, visible: 1, icon_name: "", cover_image: "",
    cta_text: "View Repo", link_url: "https://github.com/Prudhvivarma0?tab=repositories",
    title: "Firewall & Encryption Sys",
    description: "Engineered a rule-based firewall with IP access control and implemented a public-key encryption system based on super-increasing sequences to secure data transmission.",
  },
  {
    id: 5, sort_order: 5, visible: 1, icon_name: "", cover_image: "",
    cta_text: "View Repo", link_url: "https://github.com/Prudhvivarma0?tab=repositories",
    title: "Deep Learning IDS",
    description: "Thesis Project: Developed an Intrusion Detection System for Cyber-Physical Systems using Wi-Fi CSI and Deep Learning (Variational Autoencoders), improving threat detection accuracy by 30%.",
  },
];

export function Projects({ projects }: { projects?: ProjectRow[] }) {
  const items = projects && projects.length > 0 ? projects : DEFAULT_PROJECTS;

  return (
    <section id="projects">
      <h2 className="section-header">&lt; PROJECTS /&gt;</h2>
      <div className="card-grid">
        {items.map(p => (
          <a
            key={p.id}
            href={p.link_url || "https://github.com/Prudhvivarma0?tab=repositories"}
            target="_blank"
            rel="noopener noreferrer"
            style={{ textDecoration: "none", display: "block" }}
          >
            <div className="portfolio-card">
              <div>
                <h3>{p.title}</h3>
                <p>{p.description}</p>
              </div>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
