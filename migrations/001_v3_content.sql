CREATE TABLE IF NOT EXISTS v3_content (
  id INTEGER PRIMARY KEY DEFAULT 1,
  data TEXT NOT NULL,
  updated_at TEXT DEFAULT (datetime('now'))
);
INSERT OR IGNORE INTO v3_content (id, data) VALUES (1, '{}');
