const { generateFromOllama } = require("./ai/providers/ollamaProvider");

async function test() {
    try {
        const prompt = `
Rispondi SOLO in JSON con:
{
  "status": "ok"
}
        `;

        const result = await generateFromOllama(prompt);
        console.log("RISPOSTA OLLAMA:");
        console.log(result);

    } catch (error) {
        console.error("Errore test:", error.message);
    }
}

test();