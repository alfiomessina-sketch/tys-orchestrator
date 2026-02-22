const axios = require("axios");
const fs = require("fs");
const path = require("path");

const ELEVEN_API_KEY = process.env.ELEVEN_API_KEY;
const ELEVEN_URL = "https://api.elevenlabs.io/v1/text-to-speech";

async function generateSpeech(text, voiceId, fileName) {

    if (!ELEVEN_API_KEY) {
        throw new Error("ELEVEN_API_KEY not found in environment variables");
    }

    try {

        const response = await axios.post(
            `${ELEVEN_URL}/${voiceId}`,
            {
                text: text,
                model_id: "eleven_multilingual_v2"
            },
            {
                headers: {
                    "xi-api-key": ELEVEN_API_KEY,
                    "Content-Type": "application/json"
                },
                responseType: "arraybuffer"
            }
        );

        const outputPath = path.join(__dirname, "..", "audio");

        if (!fs.existsSync(outputPath)) {
            fs.mkdirSync(outputPath);
        }

        const fullFilePath = path.join(outputPath, fileName);

        fs.writeFileSync(fullFilePath, response.data);

        return fullFilePath;

    } catch (error) {
        console.error("ElevenLabs error:", error.response?.data || error.message);
        throw error;
    }
}

module.exports = {
    generateSpeech
};