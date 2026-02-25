document.addEventListener("DOMContentLoaded", function () {

    const dashboardHTML = `
        <div class="dashboard-wrapper">

            <div class="dashboard-grid">

                <div class="dashboard-card">
                    <h3>Clienti Attivi</h3>
                    <p id="clients-count">--</p>
                </div>

                <div class="dashboard-card">
                    <h3>Stazioni</h3>
                    <p id="stations-count">--</p>
                </div>

                <div class="dashboard-card">
                    <h3>Annunci Generati</h3>
                    <p id="ads-count">--</p>
                </div>

                <div class="dashboard-card">
                    <h3>Stato Sistema</h3>
                    <p id="system-status">ONLINE</p>
                </div>

            </div>

        </div>
    `;

    const playerContainer = document.querySelector(".player-container");

    if (playerContainer) {
        playerContainer.insertAdjacentHTML("afterend", dashboardHTML);
    }

});