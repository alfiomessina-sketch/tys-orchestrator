require("dotenv").config();

const { generateSpeech } = require("./services/elevenLabsService");

async function test() {

    const text = "Willkommen zum Black Friday Angebot in unserem Geschäft.";

    const voiceId = "Ph3TiHFUEKFVrHREjXDA";

    try {

        const filePath = await generateSpeech(text, voiceId, "test_black_friday.mp3");

        console.log("Audio generato in:", filePath);

    } catch (error) {
        console.error("Errore:", error.message);
    }
}

test();