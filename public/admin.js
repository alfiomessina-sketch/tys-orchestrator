async function loadClients() {

    const response = await fetch("/api/clients");
    const clients = await response.json();

    const table = document.getElementById("clientTable");
    table.innerHTML = "";

    let total = clients.length;
    let active = 0;
    let unpaid = 0;

    clients.forEach(client => {

        if (client.status === "active") active++;
        if (client.payment_status !== "paid") unpaid++;

        const row = document.createElement("tr");

        const canCreateStation = client.station_count < client.max_stations;

        row.innerHTML = `
            <td>${client.id}</td>
            <td>${client.name}</td>
            <td>${client.plan}</td>
            <td class="${client.status}">${client.status}</td>
            <td class="${client.payment_status === "paid" ? "paid" : "unpaid"}">
                ${client.payment_status || "unpaid"}
            </td>
            <td>${client.station_count} / ${client.max_stations}</td>
            <td>
                <button onclick="markPaid(${client.id})">Pagato</button>
                ${canCreateStation ? `<button onclick="createStation(${client.id})">+ Stazione</button>` : ""}
            </td>
        `;

        table.appendChild(row);

    });

    document.getElementById("total").innerText = "Clienti: " + total;
    document.getElementById("active").innerText = "Attivi: " + active;
    document.getElementById("unpaid").innerText = "Non pagati: " + unpaid;

}

async function markPaid(id) {

    await fetch(`/api/clients/${id}/payment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "paid" })
    });

    loadClients();
}

async function createStation(id) {

    const stationName = prompt("Nome nuova stazione:");

    if (!stationName) return;

    const response = await fetch(`/api/clients/${id}/stations`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stationName })
    });

    const data = await response.json();

    alert(data.message);

    loadClients();
}

loadClients();