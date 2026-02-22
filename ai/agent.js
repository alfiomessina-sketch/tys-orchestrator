const { generateFromOllama } = require("./providers/ollamaProvider");
const { validateActionSchema } = require("./schema");

async function processUserMessage(message, clientId) {

    const prompt = `
Sei il sistema AI di Tune Your Store.

Analizza il messaggio e genera SOLO un JSON valido.

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

        let parsed;

        try {
            parsed = JSON.parse(rawResponse);
        } catch (err) {
            throw new Error("AI did not return valid JSON");
        }

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