require("dotenv").config();

const express = require("express");
const cors = require("cors");

const { authenticateToken } = require("./middleware/auth");

const authRoutes = require("./routes/auth");
const clientRoutes = require("./routes/clients");
const announcementRoutes = require("./routes/announcement-generate");
const stationsRoutes = require("./routes/stations");

const app = express();
const PORT = process.env.PORT || 3000;

// ==============================
// MIDDLEWARE BASE
// ==============================

app.use(cors());
app.use(express.json());

// ==============================
// PUBLIC ROUTE (NO AUTH)
// ==============================

app.use("/api/auth", authRoutes);

// ==============================
// PROTECTED ROUTES
// ==============================

app.use("/api/clients", authenticateToken, clientRoutes);
app.use("/api/announcement", authenticateToken, announcementRoutes);
app.use("/api/stations", authenticateToken, stationsRoutes);

// ==============================
// HEALTH CHECK
// ==============================

app.get("/", (req, res) => {
    res.json({ message: "TYS ORCHESTRATOR ONLINE" });
});

// ==============================
// START SERVER
// ==============================

app.listen(PORT, () => {
    console.log(`TYS ORCHESTRATOR running on http://localhost:${PORT}`);
});