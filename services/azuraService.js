const axios = require("axios");

/*
====================================
AZURA CONFIG
====================================
*/

// ⚠ METTI QUI LA TUA API KEY NUOVA (RIGENERALA DOPO IL TEST)
const AZURA_API_KEY = "2c95e5794a004630:cfb68f18d9f87c5d58e22d5df3d9f2ae";

const AZURA_BASE_URL = "https://tuneyourstore.net/api";

/*
====================================
CREATE STATION
====================================
*/

async function createAzuraStation(stationName) {

    try {

        // Creiamo uno short_name sempre unico
        const shortName =
            stationName
                .toLowerCase()
                .replace(/\s+/g, "-")
                .replace(/[^a-z0-9\-]/g, "")
            + "-"
            + Date.now();

        const response = await axios.post(
            `${AZURA_BASE_URL}/admin/stations`,
            {
                name: stationName,
                short_name: shortName,
                description: "Created by TYS Orchestrator",
                genre: "Various",
                url: "",
                radio_base_dir: "/var/azuracast/stations",
                enable_public_page: true,
                enable_streamers: false,
                enable_on_demand: false,
                frontend_type: "icecast",
                backend_type: "liquidsoap",
                max_listeners: 100
            },
            {
                headers: {
                    "X-API-Key": AZURA_API_KEY,
                    "Content-Type": "application/json"
                }
            }
        );

        console.log("Stazione creata su Azura:", response.data);

        return response.data;

    } catch (error) {

        console.error("Errore creazione stazione Azura:");

        if (error.response) {
            console.error(error.response.data);
        } else {
            console.error(error.message);
        }

        throw error;
    }

}

module.exports = {
    createAzuraStation
};