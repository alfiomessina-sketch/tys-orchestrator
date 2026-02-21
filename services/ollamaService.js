const axios = require("axios");

async function generateStationIDs(businessName) {
    try {
        const prompt = `
Genera 4 station ID radio professionali per una radio chiamata "${businessName}".
Devono essere brevi, stile radio commerciale.
Rispondi solo con un array JSON di 4 frasi.
`;

        const response = await axios.post(
            "http://localhost:11434/api/generate",
            {
                model: "llama3:latest",
                prompt: prompt,
                stream: false
            }
        );

        return response.data.response;

    } catch (error) {
        console.error("Ollama error:", error.message);
        throw error;
    }
}

module.exports = {
    generateStationIDs
};