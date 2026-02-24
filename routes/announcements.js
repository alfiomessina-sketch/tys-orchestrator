const express = require("express");
const db = require("../db/database");

const router = express.Router();

/*
====================================
GET ANNOUNCEMENTS (MULTI-TENANT SAFE)
====================================
*/
router.get("/", (req, res) => {
    try {
        let rows;

        if (req.user.role === "admin") {
            rows = db.prepare(
                "SELECT * FROM announcements ORDER BY created_at DESC"
            ).all();
        } else {
            rows = db.prepare(
                "SELECT * FROM announcements WHERE client_id = ? ORDER BY created_at DESC"
            ).all(req.user.client_id);
        }

        res.json(rows);

    } catch (err) {
        res.status(500).json({ error: "Errore recupero annunci" });
    }
});

/*
====================================
CREATE ANNOUNCEMENT (MULTI-TENANT SAFE)
====================================
*/
router.post("/", (req, res) => {
    try {
        const { text, file_path } = req.body;

        if (!text || !file_path) {
            return res.status(400).json({ error: "Dati mancanti" });
        }

        const clientId =
            req.user.role === "admin"
                ? req.body.client_id
                : req.user.client_id;

        if (!clientId) {
            return res.status(400).json({ error: "Client ID non valido" });
        }

        // ==============================
        // CHECK CLIENT + PLAN
        // ==============================

        const client = db.prepare(
            "SELECT * FROM clients WHERE id = ?"
        ).get(clientId);

        if (!client) {
            return res.status(404).json({ error: "Cliente non trovato" });
        }

        let monthlyLimit = 0;

        if (client.plan === "29") monthlyLimit = 0;
        if (client.plan === "69") monthlyLimit = 30;
        if (client.plan === "159") monthlyLimit = 100;

        if (monthlyLimit === 0) {
            return res.status(403).json({
                error: "Il tuo piano non permette la creazione di annunci."
            });
        }

        // ==============================
        // COUNT ANNOUNCEMENTS CURRENT MONTH
        // ==============================

        const usage = db.prepare(`
            SELECT COUNT(*) as total
            FROM announcements
            WHERE client_id = ?
            AND strftime('%Y-%m', created_at) = strftime('%Y-%m', 'now')
        `).get(clientId);

        if (usage.total >= monthlyLimit) {
            return res.status(403).json({
                error: "Limite mensile annunci raggiunto.",
                limit: monthlyLimit,
                used: usage.total
            });
        }

        // ==============================
        // INSERT ANNOUNCEMENT
        // ==============================

        const insert = db.prepare(`
            INSERT INTO announcements (client_id, text, file_path, created_at)
            VALUES (?, ?, ?, datetime('now'))
        `).run(clientId, text, file_path);

        res.json({
            message: "Annuncio creato",
            announcement_id: insert.lastInsertRowid
        });

    } catch (err) {
        res.status(500).json({ error: "Errore creazione annuncio" });
    }
});

module.exports = router;