const rolePermissions = {

    role_admin: {
        canAccess: [
            "nav_dashboard",
            "nav_radio",
            "nav_playlists",
            "nav_tts",
            "nav_ads",
            "nav_planner",
            "nav_packages",
            "nav_subscription"
        ]
    },

    role_client: {
        canAccess: [
            "nav_dashboard",
            "nav_radio",
            "nav_playlists",
            "nav_tts",
            "nav_ads"
        ]
    },

    role_collab: {
        canAccess: [
            "nav_dashboard",
            "nav_radio"
        ]
    }

};