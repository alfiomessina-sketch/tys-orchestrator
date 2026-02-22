const axios = require("axios");

async function generateAudio(text) {

    const apiKey = process.env.ELEVEN_API_KEY;

    if (!apiKey) {
        throw new Error("ELEVEN_API_KEY missing in .env");
    }

    // VOICE ID CORRETTO
    const voiceId = "Ph3TiHFUEKFVrHREjXDA";

    try {

        const response = await axios.post(
            `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
            {
                text: text,
                model_id: "eleven_multilingual_v2"
            },
            {
                responseType: "arraybuffer",
                headers: {
                    "xi-api-key": apiKey,
                    "Content-Type": "application/json"
                }
            }
        );

        return response.data;

    } catch (error) {
        console.error("ELEVEN ERROR:", error.message);
        throw error;
    }
}

module.exports = { generateAudio };