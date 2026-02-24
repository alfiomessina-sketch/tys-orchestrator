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