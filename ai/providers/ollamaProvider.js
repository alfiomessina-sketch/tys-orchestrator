const axios = require("axios");

const OLLAMA_URL = "http://localhost:11434/api/generate";
const MODEL = "llama3:latest";

async function generateFromOllama(prompt) {
    try {
        const response = await axios.post(OLLAMA_URL, {
            model: MODEL,
            prompt: prompt,
            stream: false,
            format: "json"
        });

        if (response.data && response.data.response) {
            return response.data.response;
        } else {
            throw new Error("Invalid response from Ollama");
        }

    } catch (error) {
        console.error("Ollama error:", error.message);
        throw error;
    }
}

module.exports = {
    generateFromOllama
};