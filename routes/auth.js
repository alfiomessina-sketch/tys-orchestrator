const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../db/database");

const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || "supersecret";

router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    const user = db.prepare("SELECT * FROM users WHERE email = ?").get(email);

    if (!user) return res.status(401).json({ error: "Utente non trovato" });

    const match = await bcrypt.compare(password, user.password_hash);

    if (!match) return res.status(401).json({ error: "Password errata" });

    const token = jwt.sign(
        {
            id: user.id,
            role: user.role,
            client_id: user.client_id
        },
        JWT_SECRET,
        { expiresIn: "8h" }
    );

    res.json({ token });
});

module.exports = router;