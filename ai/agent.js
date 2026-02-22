const { generateFromOllama } = require("./providers/ollamaProvider");
const { validateActionSchema } = require("./schema");

async function processUserMessage(message, clientId) {

    const prompt = `
Genera SOLO un JSON valido.

Azioni possibili:
- create_station_ids
- create_announcement
- suggest_upsell

Formato obbligatorio:

{
  "action": "",
  "client_id": ${clientId},
  "count": 0,
  "languages": [],
  "content": []
}

Messaggio:
${message}
`;

    try {

        const rawResponse = await generateFromOllama(prompt);

        const parsed = JSON.parse(rawResponse);

        validateActionSchema(parsed);

        return parsed;

    } catch (error) {
        console.error("Agent error:", error.message);
        throw error;
    }
}

module.exports = {
    processUserMessage
};