function validateActionSchema(actionObject) {

    if (!actionObject.action) {
        throw new Error("Missing action field");
    }

    switch (actionObject.action) {

        case "create_station_ids":
            if (!actionObject.client_id || !actionObject.count) {
                throw new Error("Invalid create_station_ids structure");
            }
            break;

        case "create_announcement":
            if (!actionObject.client_id || !actionObject.languages || !actionObject.content) {
                throw new Error("Invalid create_announcement structure");
            }
            break;

        case "suggest_upsell":
            if (!actionObject.client_id) {
                throw new Error("Invalid suggest_upsell structure");
            }
            break;

        default:
            throw new Error("Unknown action type");
    }

    return true;
}

module.exports = {
    validateActionSchema
};