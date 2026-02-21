function getPlanConfiguration(plan) {

    const now = new Date();
    const trialDays = 7;

    const expiresAt = new Date(now);
    expiresAt.setDate(expiresAt.getDate() + trialDays);

    if (plan === "29.99") {
        return {
            max_stations: 1,
            tts_enabled: false,
            max_announcements: 0,
            global_propagation: false,
            trial: true,
            payment_status: "trial",
            status: "pending_activation",
            expires_at: expiresAt
        };
    }

    if (plan === "69.99") {
        return {
            max_stations: 1,
            tts_enabled: true,
            max_announcements: 20,
            global_propagation: false,
            trial: true,
            payment_status: "trial",
            status: "pending_activation",
            expires_at: expiresAt
        };
    }

    if (plan === "159.99") {
        return {
            max_stations: 5,
            tts_enabled: true,
            max_announcements: 999,
            global_propagation: true,
            trial: true,
            payment_status: "trial",
            status: "pending_activation",
            expires_at: expiresAt
        };
    }

    throw new Error("Invalid plan");
}

module.exports = {
    getPlanConfiguration
};
