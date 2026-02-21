const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const dbPath = path.join(__dirname, "..", "database.db");

const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error("Errore connessione database:", err.message);
    } else {
        console.log("Database connesso.");
    }
});

db.serialize(() => {

    /*
    ================================
    CLIENTS TABLE (STABLE)
    ================================
    */
    db.run(`
        CREATE TABLE IF NOT EXISTS clients (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT,
            email TEXT,
            plan TEXT,
            status TEXT,
            station_id TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `);

    /*
    ================================
    NEW: STATIONS TABLE (MULTI RADIO)
    ================================
    */
    db.run(`
        CREATE TABLE IF NOT EXISTS stations (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            client_id INTEGER NOT NULL,
            station_id TEXT NOT NULL,
            azura_id INTEGER,
            status TEXT DEFAULT 'active',
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (client_id) REFERENCES clients(id)
        )
    `);

});

module.exports = db;