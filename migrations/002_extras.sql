-- Version history (keep last 20 saves)
CREATE TABLE IF NOT EXISTS v3_versions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  data TEXT NOT NULL,
  saved_at TEXT DEFAULT (datetime('now'))
);

-- Page analytics
CREATE TABLE IF NOT EXISTS v3_analytics (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  page TEXT DEFAULT '/',
  referrer TEXT DEFAULT '',
  country TEXT DEFAULT '',
  ts TEXT DEFAULT (datetime('now'))
);

-- Contact form submissions
CREATE TABLE IF NOT EXISTS v3_contacts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  message TEXT NOT NULL,
  read INTEGER DEFAULT 0,
  ts TEXT DEFAULT (datetime('now'))
);
