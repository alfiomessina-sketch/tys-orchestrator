const express = require("express");
const router = express.Router();
const path = require("path");
const fs = require("fs");
const { exec } = require("child_process");

const { generateText } = require("../services/aiService");
const { generateAudio } = require("../services/elevenLabsService");
const db = require("../db/database");

const FFMPEG_PATH = `"C:\\Program Files (x86)\\By Click Downloader\\ffmpeg.exe"`;

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

        exec(ffmpegCommand, (error, stdout, stderr) => {

            if (error) {
                console.error("=== FFMPEG ERROR ===");
                console.error(error.message);
                console.error(stderr);
                return res.status(500).json({ error: "Audio processing failed" });
            }

            fs.unlinkSync(rawPath);

            const stmt = db.prepare(`
                INSERT INTO announcements (client_id, text, file_path, created_at)
                VALUES (?, ?, ?, datetime('now'))
            `);

            stmt.run(client_id, text, finalPath);

            res.json({
                success: true,
                text: text,
                file: finalFileName
            });

        });

    } catch (error) {

        console.error("=== PIPELINE ERROR ===");
        console.error(error.message);
        console.error(error.response?.data);

        res.status(500).json({ error: "Pipeline error" });
    }

});

module.exports = router;