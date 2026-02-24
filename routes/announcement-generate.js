const express = require("express");
const db = require("../db/database");
const axios = require("axios");
const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const router = express.Router();

router.post("/generate", async (req, res) => {
    try {
        const { prompt } = req.body;

        if (!prompt) {
            return res.status(400).json({ error: "Prompt mancante" });
        }

        // ⚠️ TEST MODE: CLIENT ID FISSO
        const clientId = 1;

        const client = db.prepare("SELECT * FROM clients WHERE id = ?").get(clientId);

        if (!client) {
            return res.status(404).json({ error: "Client non trovato" });
        }

        if (client.status !== "active") {
            return res.status(403).json({ error: "Client non attivo" });
        }

        if (client.plan === "29") {
            return res.status(403).json({ error: "Piano Starter non include AI" });
        }

        // 1) GENERAZIONE TESTO
        const ollamaResponse = await axios.post(
            `${process.env.OLLAMA_BASE_URL}/api/generate`,
            {
                model: "llama3",
                prompt: prompt,
                stream: false
            }
        );

        const generatedText = ollamaResponse.data.response;

        // 2) GENERAZIONE AUDIO
        const elevenResponse = await axios.post(
            `https://api.elevenlabs.io/v1/text-to-speech/${process.env.ELEVEN_VOICE_ID}`,
            {
                text: generatedText,
                model_id: "eleven_multilingual_v2"
            },
            {
                headers: {
                    "xi-api-key": process.env.ELEVEN_API_KEY,
                    "Content-Type": "application/json"
                },
                responseType: "arraybuffer"
            }
        );

        const fileName = `announcement_${Date.now()}.mp3`;
        const rawPath = path.join(__dirname, "../uploads", fileName);
        const finalPath = path.join(__dirname, "../uploads", "processed_" + fileName);

        fs.writeFileSync(rawPath, elevenResponse.data);

        // NORMALIZZAZIONE -16 LUFS
        execSync(
            `ffmpeg -y -i "${rawPath}" -af "highpass=f=100,loudnorm=I=-16:TP=-1.0:LRA=11" "${finalPath}"`
        );

        // SALVATAGGIO DB
        db.prepare(`
            INSERT INTO announcements (client_id, text, file_path, created_at)
            VALUES (?, ?, ?, datetime('now'))
        `).run(clientId, generatedText, finalPath);

        res.json({
            message: "Annuncio generato",
            file: "processed_" + fileName
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Errore generazione annuncio" });
    }
});

module.exports = router;