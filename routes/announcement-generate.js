const express = require("express");
const db = require("../db/database");
const axios = require("axios");
const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const router = express.Router();

function getAnnouncementLimit(plan) {
    if (plan === "29") return 0;
    if (plan === "69") return 30;
    if (plan === "159") return 100;
    return 0;
}

router.post("/generate", async (req, res) => {
    try {

        const { client_id, prompt } = req.body;

        if (!client_id || !prompt) {
            return res.status(400).json({ error: "client_id e prompt obbligatori" });
        }

        const client = db.prepare("SELECT * FROM clients WHERE id = ?").get(client_id);

        if (!client) {
            return res.status(404).json({ error: "Cliente non trovato" });
        }

        if (client.status !== "active") {
            return res.status(403).json({ error: "Cliente non attivo" });
        }

        const limit = getAnnouncementLimit(client.plan);

        if (limit === 0) {
            return res.status(403).json({ error: "Il tuo piano non include annunci AI" });
        }

        const count = db.prepare(`
            SELECT COUNT(*) as total
            FROM announcements
            WHERE client_id = ?
            AND strftime('%Y-%m', created_at) = strftime('%Y-%m', 'now')
        `).get(client_id).total;

        if (count >= limit) {
            return res.status(403).json({ error: "Limite mensile annunci raggiunto" });
        }

        const ollamaResponse = await axios.post(
            `${process.env.OLLAMA_BASE_URL}/api/generate`,
            {
                model: "llama3",
                prompt: prompt,
                stream: false
            }
        );

        const generatedText = ollamaResponse.data.response;

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

        execSync(
            `ffmpeg -y -i "${rawPath}" -af "highpass=f=100,loudnorm=I=-16:TP=-1.0:LRA=11" "${finalPath}"`
        );

        db.prepare(`
            INSERT INTO announcements (client_id, text, file_path, created_at)
            VALUES (?, ?, ?, datetime('now'))
        `).run(client_id, generatedText, finalPath);

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