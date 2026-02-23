const express = require("express");
const cors = require("cors");
require("dotenv").config();

const db = require("./db/database");

const authRoutes = require("./routes/auth");
const { authenticateToken } = require("./middleware/auth");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

/*
====================================
AUTH ROUTES (NON PROTETTE)
====================================
*/
app.use("/api/auth", authRoutes);

/*
====================================
PROTEZIONE TUTTE LE ALTRE API
====================================
*/
app.use("/api", authenticateToken);

/*
====================================
ROUTE TEST PROTETTA
====================================
*/
app.get("/api/protected", (req, res) => {
    res.json({
        message: "Accesso autorizzato",
        user: req.user
    });
});

/*
====================================
SERVER START
====================================
*/
app.listen(PORT, () => {
    console.log(`TYS ORCHESTRATOR v2.4 running on http://localhost:${PORT}`);
});