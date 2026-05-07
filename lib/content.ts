// lib/content.ts — single-table CMS content store

export interface SiteContent {
  hero: {
    meta: string;
    headline1: string;
    headline2: string;
    intro: string;
    ctaWork: string;
    ctaContact: string;
  };
  disciplines: Array<{ num: string; label: string }>;
  about: {
    heading1: string;
    heading2: string;
    heading3: string;
    bio1: string;
    bio2: string;
    portraitCaption: string;
    portraitYear: string;
  };
  projects: Array<{
    n: string;
    title: string;
    year: string;
    meta: string;
    desc: string;
    link?: string;
  }>;
  experience: Array<{
    dateRange: string;
    org: string;
    role: string;
  }>;
  certifications: Array<{
    name: string;
    issuer: string;
    label: string;
  }>;
  achievements: Array<{
    name: string;
    label: string;
  }>;
  contact: {
    email: string;
    github: string;
    linkedin: string;
    footerLeft: string;
    footerCenter: string;
    footerRight: string;
    confession: string;
  };
  seo: {
    title: string;
    description: string;
    ogImage: string;
  };
  appearance: {
    logo: string;
    accentColor: string;
  };
  sections: {
    disciplines: boolean;
    about: boolean;
    work: boolean;
    timeline: boolean;
    certs: boolean;
    contact: boolean;
  };
  media: {
    portrait: string;
  };
}

export const DEFAULT_CONTENT: SiteContent = {
  hero: {
    meta: "(Portfolio / 2026)",
    headline1: "PRUDHVI",
    headline2: "VARMA",
    intro: "Nomad building stuff that (probably) won't break. Sometimes the architect, sometimes the engineer, almost always both.",
    ctaWork: "Selected experience →",
    ctaContact: "Get in touch",
  },
  disciplines: [
    { num: "01", label: "Cloud Infrastructure" },
    { num: "02", label: "Digital Products" },
    { num: "03", label: "Data Analysis" },
    { num: "04", label: "Automation Pipelines" },
    { num: "05", label: "Edge Networks" },
    { num: "06", label: "Threat Detection" },
    { num: "07", label: "Developer Tooling" },
    { num: "08", label: "Resilient Architectures" },
  ],
  about: {
    heading1: "Architect.",
    heading2: "Developer.",
    heading3: "Curious.",
    bio1: "Born and based in Dubai. Deep love for tech and building things. I work on systems that could break any second — cyber, AI, cloud, data. If it can fail, I've probably touched it.",
    bio2: "Running joke that I'm involved in everything. I'm starting to think it's true. I take quiet pleasure in finding the load-bearing wall of a problem and removing everything else around it. Most of my work is the work of removal.",
    portraitCaption: "Plate I",
    portraitYear: "2026",
  },
  projects: [
    {
      n: "01", title: "Stock Signal Bot", year: "2026", meta: "ai · automation",
      desc: "7-agent AI stock research engine with 24/7 portfolio monitoring and real-time Telegram alerts.",
      link: "https://github.com/Prudhvivarma0/stock-signal-bot",
    },
    {
      n: "02", title: "AWS Threat Monitoring", year: "2025", meta: "cloud · security",
      desc: "Cloud-wide architecture across VPCs, GuardDuty and EBS — under-budget by 40%.",
      link: "https://github.com/Prudhvivarma0/AWS-Cloud-monitoring",
    },
    {
      n: "03", title: "Web App Penetration Test", year: "2025", meta: "red-team · owasp",
      desc: "Comprehensive pen tests on DVWA targeting CSRF, XSS, SQLi and Brute Force using Kali Linux and Burp Suite.",
      link: "https://github.com/Prudhvivarma0?tab=repositories",
    },
    {
      n: "04", title: "US Accidents Dashboard", year: "2025", meta: "data viz · d3.js",
      desc: "Interactive dashboard visualising multi-year US traffic data — choropleth maps, heatmaps, drill-down filters.",
      link: "https://github.com/Prudhvivarma0/F20DVCW2",
    },
    {
      n: "05", title: "WiFiGuard", year: "2024", meta: "thesis · cyber-physical",
      desc: "Defensive layer against deauth and rogue-AP attacks using Wi-Fi CSI and Variational Autoencoders.",
      link: "https://github.com/Prudhvivarma0/WiMANS",
    },
    {
      n: "06", title: "Brainwave", year: "2024", meta: "full-stack · real-time",
      desc: "Collaborative brainstorming platform with Socket.io messaging, shared whiteboard, and virtual exhibits.",
      link: "https://github.com/Prudhvivarma0/brain-wave",
    },
    {
      n: "07", title: "Firewall & Encryption", year: "2024", meta: "network · crypto",
      desc: "Rule-based firewall with IP access control paired with a public-key encryption system using super-increasing sequences.",
      link: "https://github.com/Prudhvivarma0/Public-Key-Encryption-and-Firewall-Management-System",
    },
    {
      n: "08", title: "Enterprise Threat Sims", year: "2024", meta: "red-team",
      desc: "Library of attack scenarios stress-testing enterprise blue-team posture for AIG, ANZ, Mastercard and Telstra.",
      link: "https://github.com/Prudhvivarma0?tab=repositories",
    },
  ],
  experience: [
    { dateRange: "APR 2026 —",          org: "Art Dubai",            role: "Digital Products Consultant" },
    { dateRange: "APR 2025 — PRESENT",  org: "MCN",                  role: "Intern · issue triage + automation" },
    { dateRange: "JAN — MAY 2025",      org: "Greenhouse Foodstuff", role: "Intern · analysis & automation" },
    { dateRange: "DEC 2024 — FEB 2025", org: "Urbizassist",          role: "Intern · analysis & automation" },
  ],
  certifications: [
    { name: "BTL1",                      issuer: "Security Blue Team", label: "DEC 2025" },
    { name: "ISC2 CC",                   issuer: "ISC2",               label: "AUG 2025" },
    { name: "Splunk SOAR",               issuer: "Splunk",             label: "OCT 2025" },
    { name: "Art of Investigation",      issuer: "Splunk",             label: "OCT 2025" },
    { name: "Security Ops Analyst",      issuer: "Splunk",             label: "OCT 2025" },
    { name: "Intro to Splunk",           issuer: "Splunk",             label: "OCT 2025" },
    { name: "Cybersecurity Fundamentals",issuer: "IBM",                label: "JAN 2025" },
    { name: "SOC Analyst",               issuer: "Udemy",              label: "APR 2024" },
  ],
  achievements: [
    { name: "1ST PLACE QUALIFIER", label: "ZU × EXPLOITERS CTF" },
    { name: "3RD PLACE WINNER",    label: "REDTEAM CYBER HACK"  },
  ],
  contact: {
    email: "prudhvivarma31@gmail.com",
    github: "https://github.com/Prudhvivarma0",
    linkedin: "https://www.linkedin.com/in/prudhvivarma11/",
    footerLeft: "© Prudhvi Varma 2026",
    footerCenter: "Built with intention",
    footerRight: "Last touched · today",
    confession: "yes, i asked an ai to design and build this. no, i'm not sorry. neither is claude.",
  },
  seo: {
    title: "Prudhvi Varma",
    description: "Nomad building stuff that (probably) won't break. Sometimes the architect, sometimes the engineer, almost always both.",
    ogImage: "",
  },
  appearance: {
    logo: "PV—2026",
    accentColor: "#4a7048",
  },
  sections: {
    disciplines: true,
    about: true,
    work: true,
    timeline: true,
    certs: true,
    contact: true,
  },
  media: {
    portrait: "",
  },
};

export async function fetchContent(db: D1Database): Promise<SiteContent> {
  try {
    const row = await db
      .prepare("SELECT data FROM v3_content WHERE id = 1")
      .first<{ data: string }>();
    if (!row?.data) return DEFAULT_CONTENT;
    const parsed = JSON.parse(row.data) as Partial<SiteContent>;
    // Merge with defaults so any missing keys still resolve
    return {
      hero:           { ...DEFAULT_CONTENT.hero,           ...(parsed.hero           ?? {}) },
      disciplines:    parsed.disciplines    ?? DEFAULT_CONTENT.disciplines,
      about:          { ...DEFAULT_CONTENT.about,          ...(parsed.about          ?? {}) },
      projects:       parsed.projects       ?? DEFAULT_CONTENT.projects,
      experience:     parsed.experience     ?? DEFAULT_CONTENT.experience,
      certifications: parsed.certifications ?? DEFAULT_CONTENT.certifications,
      achievements:   parsed.achievements   ?? DEFAULT_CONTENT.achievements,
      contact:        { ...DEFAULT_CONTENT.contact,        ...(parsed.contact        ?? {}) },
      seo:            { ...DEFAULT_CONTENT.seo,            ...(parsed.seo            ?? {}) },
      appearance:     { ...DEFAULT_CONTENT.appearance,     ...(parsed.appearance     ?? {}) },
      sections:       { ...DEFAULT_CONTENT.sections,       ...(parsed.sections       ?? {}) },
      media:          { ...DEFAULT_CONTENT.media,          ...(parsed.media          ?? {}) },
    };
  } catch {
    return DEFAULT_CONTENT;
  }
}

export async function saveContent(db: D1Database, content: SiteContent): Promise<void> {
  const data = JSON.stringify(content);
  await db
    .prepare(
      `INSERT INTO v3_content (id, data, updated_at) VALUES (1, ?, datetime('now'))
       ON CONFLICT(id) DO UPDATE SET data = excluded.data, updated_at = excluded.updated_at`
    )
    .bind(data)
    .run();
}
