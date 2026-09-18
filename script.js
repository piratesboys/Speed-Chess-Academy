document.addEventListener("DOMContentLoaded", async () => {
    const container = document.getElementById("membersList");

    if (!container) {
        console.error("❌ #membersList introuvable");
        return;
    }

    container.innerHTML = "<p>⏳ Connexion à Lichess...</p>";

    try {
        const response = await fetch(
            "https://lichess.org/api/team/speed-chess-academy/users"
        );

        console.log("Status Lichess :", response.status);
        console.log("Headers :", [...response.headers.entries()]);

        if (!response.ok) {
            throw new Error(
                `Lichess répond avec ${response.status}`
            );
        }

        const data = await response.json();

        console.log("Réponse Lichess :", data);

        container.innerHTML = `
            <div class="card">
                <p>✅ L'API Lichess répond !</p>
                <pre>${JSON.stringify(data, null, 2)}</pre>
            </div>
        `;

    } catch (error) {

        console.error("❌ ERREUR :", error);

        container.innerHTML = `
            <div class="card">
                <p>❌ Impossible de contacter Lichess.</p>
                <p>${error.message}</p>
            </div>
        `;
    }
});