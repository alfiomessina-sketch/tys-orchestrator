const axios = require("axios");

async function generateText(prompt) {
    try {
        const response = await axios.post("http://localhost:11434/api/generate", {
            model: "llama3",
            prompt: prompt,
            stream: false
        });

        return response.data.response.trim();

    } catch (error) {
        console.error("AI ERROR:", error.message);
        throw error;
    }
}

module.exports = { generateText };