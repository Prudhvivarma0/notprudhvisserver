CREATE TABLE IF NOT EXISTS site_settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS sections (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  visible INTEGER DEFAULT 1,
  sort_order INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS hero (
  id INTEGER PRIMARY KEY DEFAULT 1,
  name TEXT DEFAULT 'Prudhvi Varma',
  tagline TEXT DEFAULT 'Designing for the edge, building for resilience. I break things to build them better.',
  typing_words TEXT DEFAULT '["cloud architect","developer","security analyst","maybe an entrepreneur"]',
  cta1_text TEXT DEFAULT 'Projects',
  cta1_link TEXT DEFAULT '#projects',
  cta2_text TEXT DEFAULT 'Contact',
  cta2_link TEXT DEFAULT '#contact'
);

CREATE TABLE IF NOT EXISTS about (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  paragraph TEXT NOT NULL,
  sort_order INTEGER DEFAULT 0,
  visible INTEGER DEFAULT 1
);

CREATE TABLE IF NOT EXISTS projects (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  tags TEXT DEFAULT '[]',
  href TEXT DEFAULT '',
  icon TEXT DEFAULT 'Shield',
  sort_order INTEGER DEFAULT 0,
  visible INTEGER DEFAULT 1
);

CREATE TABLE IF NOT EXISTS experience (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  company TEXT NOT NULL,
  role TEXT NOT NULL,
  period TEXT NOT NULL,
  location TEXT DEFAULT 'Dubai',
  description TEXT DEFAULT '',
  sort_order INTEGER DEFAULT 0,
  visible INTEGER DEFAULT 1
);

CREATE TABLE IF NOT EXISTS certifications (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  issuer TEXT DEFAULT '',
  icon TEXT DEFAULT '🛡️',
  sort_order INTEGER DEFAULT 0,
  visible INTEGER DEFAULT 1
);

CREATE TABLE IF NOT EXISTS achievements (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  icon TEXT DEFAULT '🏆',
  title TEXT NOT NULL,
  event TEXT NOT NULL,
  date TEXT NOT NULL,
  sort_order INTEGER DEFAULT 0,
  visible INTEGER DEFAULT 1
);

CREATE TABLE IF NOT EXISTS word_scroll (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  word TEXT NOT NULL,
  color_type TEXT DEFAULT 'fg',
  sort_order INTEGER DEFAULT 0,
  visible INTEGER DEFAULT 1
);

CREATE TABLE IF NOT EXISTS contact_links (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  label TEXT NOT NULL,
  href TEXT NOT NULL,
  sort_order INTEGER DEFAULT 0,
  visible INTEGER DEFAULT 1
);

CREATE TABLE IF NOT EXISTS theme (
  id INTEGER PRIMARY KEY DEFAULT 1,
  accent_dark TEXT DEFAULT '#00ffb4',
  accent_light TEXT DEFAULT '#0a0a0a',
  bg_dark TEXT DEFAULT '#06080c',
  bg_light TEXT DEFAULT '#f5f4f0',
  fg_dark TEXT DEFAULT '#e8ecf4',
  fg_light TEXT DEFAULT '#0a0a0a'
);
