const express = require("express");
const cors = require("cors");
const path = require("path");

const { processUserMessage } = require("./ai/agent");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

/* ===============================
   HOME
=================================*/
app.get("/", (req, res) => {
    res.json({
        system: "TYS Orchestrator",
        version: "v2.3",
        status: "running"
    });
});

/* ===============================
   AI ENDPOINT
=================================*/
app.post("/api/ai", async (req, res) => {

    const { message, client_id } = req.body;

    if (!message || !client_id) {
        return res.status(400).json({
            error: "message and client_id required"
        });
    }

    try {

        const action = await processUserMessage(message, client_id);

        return res.json({
            success: true,
            action: action
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            error: "AI processing failed",
            details: error.message
        });

    }
});

/* ===============================
   START SERVER
=================================*/
app.listen(PORT, () => {
    console.log(`TYS ORCHESTRATOR v2.3 running on http://localhost:${PORT}`);
});