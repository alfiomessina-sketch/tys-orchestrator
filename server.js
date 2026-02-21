const express = require("express");
const cors = require("cors");
const sqlite3 = require("sqlite3").verbose();
const { createAzuraStation } = require("./services/azuraService");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

/*
====================================
DATABASE
====================================
*/

const db = new sqlite3.Database("./database.db", (err) => {
    if (err) {
        console.error("Errore DB:", err.message);
    } else {
        console.log("Database connesso.");
    }
});

db.serialize(() => {

    db.run(`
        CREATE TABLE IF NOT EXISTS clients (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT,
            email TEXT,
            plan TEXT,
            status TEXT,
            payment_status TEXT,
            max_stations INTEGER,
            activated_at TEXT,
            expires_at TEXT,
            created_at TEXT DEFAULT CURRENT_TIMESTAMP
        )
    `);

    db.run(`
        CREATE TABLE IF NOT EXISTS stations (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            client_id INTEGER,
            station_name TEXT,
            azura_id INTEGER,
            max_listeners INTEGER,
            created_at TEXT DEFAULT CURRENT_TIMESTAMP
        )
    `);

});

/*
====================================
HOME
====================================
*/

app.get("/", (req, res) => {
    res.json({ message: "TYS Orchestrator Running" });
});

/*
====================================
CREA CLIENTE (NUOVO)
====================================
*/

app.post("/api/clients", (req, res) => {

    const { name, email, plan } = req.body;

    if (!name || !plan) {
        return res.status(400).json({ error: "Name and plan required" });
    }

    let maxStations = 1;

    if (plan == 159) maxStations = 5;

    db.run(
        `INSERT INTO clients (name, email, plan, status, payment_status, max_stations)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [name, email || null, plan, "active", "paid", maxStations],
        function (err) {
            if (err) {
                return res.status(500).json({ error: err.message });
            }

            res.json({
                message: "Client created",
                client_id: this.lastID
            });
        }
    );
});

/*
====================================
CREA STAZIONE PER CLIENTE
====================================
*/

app.post("/api/clients/:id/create-station", async (req, res) => {

    const clientId = req.params.id;

    db.get(`SELECT * FROM clients WHERE id = ?`, [clientId], async (err, client) => {

        if (err) return res.status(500).json({ error: err.message });
        if (!client) return res.status(404).json({ message: "Client not found" });

        db.get(
            `SELECT COUNT(*) as total FROM stations WHERE client_id = ?`,
            [clientId],
            async (err2, row) => {

                if (err2) return res.status(500).json({ error: err2.message });

                if (row.total >= client.max_stations) {
                    return res.json({ message: "Station limit reached" });
                }

                try {

                    const stationName = "Radio " + client.name + " " + (row.total + 1);

                    const azuraStation = await createAzuraStation(
                        stationName.toLowerCase().replace(/\s+/g, "-"),
                        stationName
                    );

                    db.run(
                        `INSERT INTO stations (client_id, station_name, azura_id, max_listeners)
                         VALUES (?, ?, ?, ?)`,
                        [clientId, stationName, azuraStation.id, 100]
                    );

                    res.json({
                        message: "Station created",
                        station_id: azuraStation.id
                    });

                } catch (error) {
                    res.status(500).json({ error: error.message });
                }

            }
        );

    });

});

/*
====================================
LIST STATIONS
====================================
*/

app.get("/api/stations", (req, res) => {

    db.all("SELECT * FROM stations", [], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }

        res.json(rows);
    });

});

/*
====================================
START SERVER
====================================
*/

app.listen(PORT, () => {
    console.log(`Orchestrator running on http://localhost:${PORT}`);
});