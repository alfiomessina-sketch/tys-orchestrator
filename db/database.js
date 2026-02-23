const Database = require("better-sqlite3");
const path = require("path");

const dbPath = path.join(__dirname, "database.sqlite");
const db = new Database(dbPath);

/*
====================================
CLIENTS TABLE
====================================
*/
db.exec(`
CREATE TABLE IF NOT EXISTS clients (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    plan TEXT,
    status TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
);
`);

/*
====================================
ANNOUNCEMENTS TABLE
====================================
*/
db.exec(`
CREATE TABLE IF NOT EXISTS announcements (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    client_id INTEGER,
    text TEXT,
    file_path TEXT,
    created_at TEXT
);
`);

/*
====================================
USERS TABLE (SaaS Authentication)
====================================
*/
db.exec(`
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role TEXT NOT NULL CHECK(role IN ('admin','client')),
    client_id INTEGER,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
);
`);

module.exports = db;