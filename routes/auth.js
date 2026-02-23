const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../db/database");

const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || "tys_super_secret_key";

router.post("/login", (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: "Email e password richieste" });
    }

    const user = db.prepare("SELECT * FROM users WHERE email = ?").get(email);

    if (!user) {
        return res.status(401).json({ error: "Utente non trovato" });
    }

    const passwordValid = bcrypt.compareSync(password, user.password_hash);

    if (!passwordValid) {
        return res.status(401).json({ error: "Password errata" });
    }

    const token = jwt.sign(
        {
            id: user.id,
            role: user.role,
            client_id: user.client_id
        },
        JWT_SECRET,
        { expiresIn: "8h" }
    );

    res.json({
        message: "Login riuscito",
        token
    });
});

module.exports = router;