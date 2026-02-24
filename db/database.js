const Database = require("better-sqlite3");
const path = require("path");

const dbPath = path.join(__dirname, "database.sqlite");
const db = new Database(dbPath);

// =======================
// CLIENTS TABLE
// =======================
db.prepare(`
CREATE TABLE IF NOT EXISTS clients (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    plan TEXT NOT NULL,
    status TEXT DEFAULT 'inactive',
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
)
`).run();

// =======================
// STATIONS TABLE (NEW)
// =======================
db.prepare(`
CREATE TABLE IF NOT EXISTS stations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    client_id INTEGER NOT NULL,
    name TEXT NOT NULL,
    azura_station_id INTEGER,
    stream_url TEXT,
    status TEXT DEFAULT 'inactive',
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (client_id) REFERENCES clients(id)
)
`).run();

// =======================
// ANNOUNCEMENTS TABLE
// =======================
db.prepare(`
CREATE TABLE IF NOT EXISTS announcements (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    client_id INTEGER,
    station_id INTEGER,
    text TEXT,
    file_path TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
)
`).run();

module.exports = db;