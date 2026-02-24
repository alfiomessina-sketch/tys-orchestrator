require("dotenv").config();

const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/auth");
const clientRoutes = require("./routes/clients");
const announcementRoutes = require("./routes/announcement-generate");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/clients", clientRoutes);
app.use("/api/announcement", announcementRoutes);

app.get("/", (req, res) => {
    res.json({ message: "TYS ORCHESTRATOR ONLINE" });
});

app.listen(PORT, () => {
    console.log(`TYS ORCHESTRATOR running on http://localhost:${PORT}`);
});