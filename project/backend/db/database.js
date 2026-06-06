const Database = require('better-sqlite3');
const path = require('path');

const DB_PATH = path.join(__dirname, '..', 'data', 'app.db');

let db;

function initDB() {
  const fs = require('fs');
  const dir = path.dirname(DB_PATH);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

  db = new Database(DB_PATH);

  db.exec(`
    CREATE TABLE IF NOT EXISTS error_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      page TEXT NOT NULL,
      field_name TEXT NOT NULL,
      message TEXT NOT NULL,
      timestamp TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS global_settings (
      id INTEGER PRIMARY KEY CHECK (id = 1),
      buttons_disabled INTEGER NOT NULL DEFAULT 0,
      inputs_disabled INTEGER NOT NULL DEFAULT 0,
      tables_hidden INTEGER NOT NULL DEFAULT 0,
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    INSERT OR IGNORE INTO global_settings (id, buttons_disabled, inputs_disabled, tables_hidden)
    VALUES (1, 0, 0, 0);
  `);

  console.log('DB initialized at', DB_PATH);
}

function getDB() {
  return db;
}

module.exports = { initDB, getDB };
