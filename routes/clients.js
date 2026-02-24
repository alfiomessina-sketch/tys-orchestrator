const express = require("express");
const db = require("../db/database");

const router = express.Router();

// Funzione per creare slug
function createSlug(name) {
    return name
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-");
}

// ===============================
// CREATE CLIENT + AUTO STATION
// ===============================
router.post("/", (req, res) => {
    try {
        const { name, plan } = req.body;

        if (!name || !plan) {
            return res.status(400).json({ error: "Nome e piano obbligatori" });
        }

        // 1) Crea cliente
        const result = db.prepare(`
            INSERT INTO clients (name, plan, status)
            VALUES (?, ?, 'active')
        `).run(name, plan);

        const clientId = result.lastInsertRowid;

        // 2) Crea slug dal nome
        const slug = createSlug(name);

        // 3) Crea stazione automatica
        db.prepare(`
            INSERT INTO stations (client_id, name, status)
            VALUES (?, ?, 'active')
        `).run(clientId, name);

        res.json({
            message: "Cliente e stazione creati",
            client_id: clientId,
            slug: slug
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Errore creazione cliente" });
    }
});

module.exports = router;