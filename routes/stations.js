const express = require("express");
const db = require("../db/database");

const router = express.Router();

function getStationLimit(plan) {
    if (plan === "29") return 1;
    if (plan === "69") return 1;
    if (plan === "159") return 5;
    return 1;
}

router.post("/create", (req, res) => {
    try {
        const { client_id, name } = req.body;

        if (!client_id || !name) {
            return res.status(400).json({ error: "Dati mancanti" });
        }

        const client = db.prepare("SELECT * FROM clients WHERE id = ?").get(client_id);

        if (!client) {
            return res.status(404).json({ error: "Cliente non trovato" });
        }

        const limit = getStationLimit(client.plan);

        const count = db.prepare(`
            SELECT COUNT(*) as total
            FROM stations
            WHERE client_id = ?
        `).get(client_id).total;

        if (count >= limit) {
            return res.status(403).json({ error: "Limite stazioni raggiunto per il tuo piano" });
        }

        db.prepare(`
            INSERT INTO stations (client_id, name, status, created_at)
            VALUES (?, ?, 'active', datetime('now'))
        `).run(client_id, name);

        res.json({ message: "Stazione creata con successo" });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Errore creazione stazione" });
    }
});

router.get("/client/:id", (req, res) => {
    try {
        const clientId = req.params.id;

        const stations = db.prepare(`
            SELECT * FROM stations WHERE client_id = ?
        `).all(clientId);

        res.json(stations);

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Errore recupero stazioni" });
    }
});

module.exports = router;