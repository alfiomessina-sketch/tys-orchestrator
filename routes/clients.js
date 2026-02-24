const express = require("express");
const db = require("../db/database");
const bcrypt = require("bcrypt");

const router = express.Router();

// CREATE CLIENT
router.post("/create", async (req, res) => {
    try {
        const { name, email, password, plan } = req.body;

        const clientInsert = db.prepare(
            "INSERT INTO clients (name, plan, status, created_at) VALUES (?, ?, 'active', datetime('now'))"
        ).run(name, plan);

        const clientId = clientInsert.lastInsertRowid;

        const hash = await bcrypt.hash(password, 10);

        db.prepare(
            "INSERT INTO users (email, password_hash, role, client_id, created_at) VALUES (?, ?, 'client', ?, datetime('now'))"
        ).run(email, hash, clientId);

        res.json({ message: "Client creato", client_id: clientId });

    } catch (err) {
        res.status(500).json({ error: "Errore creazione client" });
    }
});

module.exports = router;