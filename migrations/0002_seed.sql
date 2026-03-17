INSERT OR IGNORE INTO hero (id, name, tagline, typing_words) VALUES (1, 'Prudhvi Varma', 'Designing for the edge, building for resilience. I break things to build them better.', '["cloud architect","developer","security analyst","maybe an entrepreneur"]');

INSERT OR IGNORE INTO about (paragraph, sort_order) VALUES ('I want to build products that actually help people and lead teams that can make a real dent. Startups, side projects, freelance — if there''s a problem worth solving, I''m in.', 1);
INSERT OR IGNORE INTO about (paragraph, sort_order) VALUES ('I live at the intersection of cyber, cloud, and development. Websites, apps, infrastructure — if it connects to the internet, I''m probably interested. Curious by nature, always learning something new.', 2);
INSERT OR IGNORE INTO about (paragraph, sort_order) VALUES ('My approach is smart work over hard work. I automate everything because I''m lazy, and I''ve turned that into an engineering philosophy. If a task can be scripted, it will be.', 3);

INSERT OR IGNORE INTO experience (company, role, period, location, description, sort_order) VALUES ('Art Dubai 2026', 'Digital Products Consultant', 'Jan 2026 — Present', 'Dubai', 'Consulting on digital product strategy and platform operations. Coordinating with external developers and internal stakeholders on feature viability, cost analysis, bug tracking, and security reviews.', 1);
INSERT OR IGNORE INTO experience (company, role, period, location, description, sort_order) VALUES ('MCN', 'IT Intern', 'Apr 2025 — Dec 2025', 'Dubai', 'Managed IT infrastructure, supported network operations, and assisted with system administration across the organization.', 2);
INSERT OR IGNORE INTO experience (company, role, period, location, description, sort_order) VALUES ('Greenhouse Foodstuff', 'IT Intern', 'Jan 2025 — May 2025', 'Dubai', 'Handled day-to-day IT support, maintained internal systems, and assisted with technology procurement and setup.', 3);
INSERT OR IGNORE INTO experience (company, role, period, location, description, sort_order) VALUES ('Urbizassist', 'AI & IT Intern', 'Dec 2024 — Feb 2025', 'Dubai', 'Worked on AI-driven solutions and IT infrastructure. Assisted with implementing automation tools and maintaining cloud services.', 4);

INSERT OR IGNORE INTO certifications (name, issuer, icon, sort_order) VALUES ('BTL1 Level 1', 'Security Blue Team', '🛡️', 1);
INSERT OR IGNORE INTO certifications (name, issuer, icon, sort_order) VALUES ('Certified in Cybersecurity', 'ISC2', '🔐', 2);
INSERT OR IGNORE INTO certifications (name, issuer, icon, sort_order) VALUES ('SOC Analyst', 'Udemy', '🔍', 3);
INSERT OR IGNORE INTO certifications (name, issuer, icon, sort_order) VALUES ('Intro to Splunk', 'Splunk', '📊', 4);
INSERT OR IGNORE INTO certifications (name, issuer, icon, sort_order) VALUES ('Splunk SOAR', 'Splunk', '📊', 5);
INSERT OR IGNORE INTO certifications (name, issuer, icon, sort_order) VALUES ('Security Operations', 'Splunk', '📊', 6);
INSERT OR IGNORE INTO certifications (name, issuer, icon, sort_order) VALUES ('Art of Investigation', 'Splunk', '🕵️', 7);

INSERT OR IGNORE INTO achievements (icon, title, event, date, sort_order) VALUES ('🏆', '1st Place Qualifier', 'Zayed University × Exploiters CTF', 'Feb 2025', 1);
INSERT OR IGNORE INTO achievements (icon, title, event, date, sort_order) VALUES ('🥉', '3rd Place Winner', 'REDTEAM Cyber Hack CTF', 'Feb 2025', 2);

INSERT OR IGNORE INTO word_scroll (word, color_type, sort_order) VALUES ('secure systems.', 'fg', 1);
INSERT OR IGNORE INTO word_scroll (word, color_type, sort_order) VALUES ('cloud infrastructure.', 'accent', 2);
INSERT OR IGNORE INTO word_scroll (word, color_type, sort_order) VALUES ('event platforms.', 'fg', 3);
INSERT OR IGNORE INTO word_scroll (word, color_type, sort_order) VALUES ('web applications.', 'accent', 4);
INSERT OR IGNORE INTO word_scroll (word, color_type, sort_order) VALUES ('automation pipelines.', 'fg', 5);
INSERT OR IGNORE INTO word_scroll (word, color_type, sort_order) VALUES ('edge networks.', 'accent', 6);
INSERT OR IGNORE INTO word_scroll (word, color_type, sort_order) VALUES ('threat detection tools.', 'fg', 7);
INSERT OR IGNORE INTO word_scroll (word, color_type, sort_order) VALUES ('developer tooling.', 'accent', 8);
INSERT OR IGNORE INTO word_scroll (word, color_type, sort_order) VALUES ('resilient architectures.', 'fg', 9);
INSERT OR IGNORE INTO word_scroll (word, color_type, sort_order) VALUES ('things that break (on purpose).', 'accent', 10);

INSERT OR IGNORE INTO contact_links (label, href, sort_order) VALUES ('Email', 'mailto:prudhvivarma31@gmail.com', 1);
INSERT OR IGNORE INTO contact_links (label, href, sort_order) VALUES ('LinkedIn', 'https://www.linkedin.com/in/prudhvivarma11/', 2);
INSERT OR IGNORE INTO contact_links (label, href, sort_order) VALUES ('GitHub', 'https://github.com/Prudhvivarma0?tab=repositories', 3);

INSERT OR IGNORE INTO theme (id, accent_dark, accent_light, bg_dark, bg_light, fg_dark, fg_light) VALUES (1, '#00ffb4', '#0a0a0a', '#06080c', '#f5f4f0', '#e8ecf4', '#0a0a0a');

INSERT OR IGNORE INTO sections (id, name, visible, sort_order) VALUES ('hero', 'Hero', 1, 1);
INSERT OR IGNORE INTO sections (id, name, visible, sort_order) VALUES ('wordscroll', 'Word Scroll', 1, 2);
INSERT OR IGNORE INTO sections (id, name, visible, sort_order) VALUES ('about', 'About', 1, 3);
INSERT OR IGNORE INTO sections (id, name, visible, sort_order) VALUES ('projects', 'Projects', 1, 4);
INSERT OR IGNORE INTO sections (id, name, visible, sort_order) VALUES ('experience', 'Experience', 1, 5);
INSERT OR IGNORE INTO sections (id, name, visible, sort_order) VALUES ('achievements', 'Achievements', 1, 6);
INSERT OR IGNORE INTO sections (id, name, visible, sort_order) VALUES ('contact', 'Contact', 1, 7);
