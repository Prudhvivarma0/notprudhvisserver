-- Add image columns to existing tables
ALTER TABLE hero ADD COLUMN background_image TEXT DEFAULT '';
ALTER TABLE about ADD COLUMN profile_image TEXT DEFAULT '';

-- Recreate projects table with full schema (was empty — no data loss)
DROP TABLE IF EXISTS projects;
CREATE TABLE projects (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  title       TEXT    NOT NULL DEFAULT '',
  description TEXT    DEFAULT '',
  icon_name   TEXT    DEFAULT 'Shield',
  cta_text    TEXT    DEFAULT 'View on GitHub',
  link_url    TEXT    DEFAULT '',
  cover_image TEXT    DEFAULT '',
  sort_order  INTEGER DEFAULT 0,
  visible     INTEGER DEFAULT 1
);

-- Media metadata (D1 sidecar for R2 objects)
CREATE TABLE IF NOT EXISTS media (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  key         TEXT    NOT NULL UNIQUE,
  filename    TEXT    NOT NULL,
  mime_type   TEXT    DEFAULT '',
  size        INTEGER DEFAULT 0,
  uploaded_at TEXT    DEFAULT (datetime('now')),
  alt_text    TEXT    DEFAULT ''
);

-- Custom content blocks (extensible per-section content)
CREATE TABLE IF NOT EXISTS custom_blocks (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  section_id TEXT    NOT NULL,
  block_type TEXT    NOT NULL DEFAULT 'text',
  content    TEXT    DEFAULT '',
  sort_order INTEGER DEFAULT 0,
  visible    INTEGER DEFAULT 1
);

-- Seed projects
INSERT OR IGNORE INTO projects (title, description, icon_name, cta_text, link_url, sort_order, visible) VALUES
('WiFiGuard (Thesis)',
 'Built an Intrusion Detection System for Cyber-Physical Systems that uses Wi-Fi Channel State Information as a sensing layer. Implemented Variational Autoencoders to model normal network behavior and detect anomalies in real-time. The system improved threat detection accuracy by 30% compared to traditional signature-based methods, without requiring any additional hardware.',
 'Shield', 'View on GitHub', 'https://github.com/Prudhvivarma0/WiFiGuard', 1, 1);

INSERT OR IGNORE INTO projects (title, description, icon_name, cta_text, link_url, sort_order, visible) VALUES
('AWS Threat Monitoring',
 'Designed and deployed a cloud surveillance architecture on AWS using CloudTrail for API logging, EventBridge for real-time event routing, and SNS for instant alert delivery. Built automated detection rules for root user activity anomalies, unauthorized API calls, and compliance violations.',
 'Cloud', 'View on GitHub', 'https://github.com/Prudhvivarma0/AWS-Cloud-monitoring', 2, 1);

INSERT OR IGNORE INTO projects (title, description, icon_name, cta_text, link_url, sort_order, visible) VALUES
('Firewall & Encryption',
 'Engineered a dual-layer security system combining a rule-based firewall with granular IP access control lists and a public-key encryption module built on super-increasing sequences. The firewall supports dynamic rule updates and logging, while the encryption system handles key generation, message encryption, and decryption with mathematical verification.',
 'Lock', 'View on GitHub', 'https://github.com/Prudhvivarma0/Public-Key-Encryption-and-Firewall-Management-System', 3, 1);

INSERT OR IGNORE INTO projects (title, description, icon_name, cta_text, link_url, sort_order, visible) VALUES
('Vigenere Cipher Tool',
 'Developed a cryptographic analysis tool that automates breaking Vigenere cipher encryptions. Implements Kasiski Examination to identify probable key lengths through repeated pattern analysis, and uses Index of Coincidence for statistical verification. Outputs ranked key length candidates with confidence scores.',
 'Key', 'View on GitHub', 'https://github.com/Prudhvivarma0/Vigenere-Cipher-Key-Length-Verification-Tool', 4, 1);

INSERT OR IGNORE INTO projects (title, description, icon_name, cta_text, link_url, sort_order, visible) VALUES
('Enterprise Threat Sims',
 'Performed advanced vulnerability research and threat analysis through enterprise job simulations for AIG, ANZ, Mastercard, and Telstra. Identified and mitigated Zero-Day Log4j exploits, conducted penetration testing against enterprise infrastructure, and delivered risk assessment reports with remediation strategies.',
 'AlertTriangle', 'View on GitHub', 'https://github.com/Prudhvivarma0?tab=repositories', 5, 1);
