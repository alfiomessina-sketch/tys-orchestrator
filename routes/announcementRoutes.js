const express = require("express");
const router = express.Router();
const path = require("path");
const fs = require("fs");
const { exec } = require("child_process");
const axios = require("axios");
const FormData = require("form-data");

const { generateText } = require("../services/aiService");
const { generateAudio } = require("../services/elevenLabsService");
const db = require("../db/database");

const FFMPEG_PATH = `"C:\\Program Files (x86)\\By Click Downloader\\ffmpeg.exe"`;

// ==============================
// AZURA CONFIG
// ==============================

const AZURA_BASE_URL = process.env.AZURA_BASE_URL;
const AZURA_API_KEY = process.env.AZURA_API_KEY;
const STATION_ID = process.env.STATION_ID;
const SWEEP_PLAYLIST_ID = 133;

if (!AZURA_BASE_URL || !AZURA_API_KEY || !STATION_ID) {
    throw new Error("Variabili ambiente Azura mancanti");
}

// ==============================
// GENERATE + AUTO UPLOAD
// ==============================

router.post("/generate", async (req, res) => {

    try {

        const { client_id, topic } = req.body;

        if (!client_id || !topic) {
            return res.status(400).json({ error: "Missing data" });
        }

        const prompt = `Scrivi un annuncio radio professionale per: ${topic}. Massimo 3 frasi.`;
        const text = await generateText(prompt);

        const timestamp = Date.now();

        const rawFileName = `raw_${timestamp}.mp3`;
        const rawPath = path.join(__dirname, "..", "uploads", rawFileName);

        const rawAudio = await generateAudio(text);
        fs.writeFileSync(rawPath, rawAudio);

        const finalFileName = `announcement_${timestamp}.mp3`;
        const finalPath = path.join(__dirname, "..", "uploads", finalFileName);

        const ffmpegCommand = `${FFMPEG_PATH} -y -i "${rawPath}" -af "highpass=f=80,loudnorm=I=-16:LRA=8:TP=-1.0" -codec:a libmp3lame -b:a 320k "${finalPath}"`;

        exec(ffmpegCommand, async (error, stdout, stderr) => {

            if (error) {
                console.error("FFMPEG ERROR:", stderr);
                return res.status(500).json({ error: "Audio processing failed" });
            }

            fs.unlinkSync(rawPath);

            try {

                // =========================
                // UPLOAD SU AZURA
                // =========================

                const form = new FormData();
                form.append("file", fs.createReadStream(finalPath));

                await axios.post(
                    `${AZURA_BASE_URL}/station/${STATION_ID}/files/upload`,
                    form,
                    {
                        headers: {
                            ...form.getHeaders(),
                            "X-API-Key": AZURA_API_KEY
                        }
                    }
                );

                // =========================
                // RECUPERA FILE ID
                // =========================

                const filesResponse = await axios.get(
                    `${AZURA_BASE_URL}/station/${STATION_ID}/files`,
                    {
                        headers: {
                            "X-API-Key": AZURA_API_KEY
                        }
                    }
                );

                const uploadedFile = filesResponse.data
                    .filter(f => f.path.includes(finalFileName))
                    .sort((a, b) => b.id - a.id)[0];

                if (!uploadedFile) {
                    return res.status(500).json({ error: "File non trovato su Azura" });
                }

                // =========================
                // ASSEGNA PLAYLIST
                // =========================

                await axios.put(
                    `${AZURA_BASE_URL}/station/${STATION_ID}/file/${uploadedFile.id}`,
                    {
                        playlists: [132, SWEEP_PLAYLIST_ID]
                    },
                    {
                        headers: {
                            "X-API-Key": AZURA_API_KEY
                        }
                    }
                );

                // =========================
                // SALVA DB
                // =========================

                const stmt = db.prepare(`
                    INSERT INTO announcements (client_id, text, file_path, created_at)
                    VALUES (?, ?, ?, datetime('now'))
                `);

                stmt.run(client_id, text, finalPath);

                res.json({
                    success: true,
                    text: text,
                    file: finalFileName,
                    azura_file_id: uploadedFile.id
                });

            } catch (azuraError) {

                console.error("AZURA ERROR:", azuraError.response?.data || azuraError.message);
                return res.status(500).json({ error: "Azura upload failed" });

            }

        });

    } catch (error) {

        console.error("PIPELINE ERROR:", error.response?.data || error.message);
        res.status(500).json({ error: "Pipeline error" });
    }

});

module.exports = router;