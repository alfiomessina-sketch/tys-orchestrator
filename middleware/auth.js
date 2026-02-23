const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "tys_super_secret_key";

function authenticateToken(req, res, next) {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
        return res.status(401).json({ error: "Token mancante" });
    }

    try {
        const user = jwt.verify(token, JWT_SECRET);
        req.user = user;
        next();
    } catch (err) {
        return res.status(403).json({ error: "Token non valido" });
    }
}

function requireAdmin(req, res, next) {
    if (!req.user || req.user.role !== "admin") {
        return res.status(403).json({ error: "Accesso riservato admin" });
    }
    next();
}

module.exports = {
    authenticateToken,
    requireAdmin
};