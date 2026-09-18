document.addEventListener("DOMContentLoaded", async () => {
    const container = document.getElementById("membersList");

    if (!container) {
        console.error("❌ #membersList introuvable");
        return;
    }

    container.innerHTML = "<p>⏳ Chargement des membres...</p>";

    try {
        const response = await fetch(
            "https://lichess.org/api/team/speed-chess-academy/users",
            {
                method: "GET",
                headers: {
                    Accept: "application/x-ndjson"
                }
            }
        );

        console.log("Status Lichess :", response.status);

        if (!response.ok) {
            throw new Error(
                `Lichess répond avec le code ${response.status}`
            );
        }

        // L'API renvoie du NDJSON :
        // un objet JSON par ligne.
        const text = await response.text();

        console.log("Réponse brute Lichess :", text);

        const members = text
            .split("\n")
            .map(line => line.trim())
            .filter(line => line.length > 0)
            .map(line => JSON.parse(line));

        console.log("Membres :", members);

        if (members.length === 0) {
            container.innerHTML = `
                <div class="card">
                    <p>ℹ️ Aucun membre trouvé.</p>
                </div>
            `;
            return;
        }

        // Nettoyage
        container.innerHTML = "";

        // Titre
        const title = document.createElement("h2");
        title.textContent = `Membres (${members.length})`;
        container.appendChild(title);

        // Grille
        const grid = document.createElement("div");
        grid.className = "members-grid";

        members.forEach(member => {
            const card = document.createElement("div");
            card.className = "card member-card";

            const username = member.username || "Joueur inconnu";
            const lichessTitle = member.title || "";

            const name = document.createElement("h3");

            name.textContent = lichessTitle
                ? `${lichessTitle} ${username}`
                : username;

            const link = document.createElement("a");

            link.href =
                `https://lichess.org/@/${encodeURIComponent(username)}`;

            link.textContent = "Voir le profil →";
            link.target = "_blank";
            link.rel = "noopener noreferrer";

            card.appendChild(name);
            card.appendChild(link);

            grid.appendChild(card);
        });

        container.appendChild(grid);

    } catch (error) {
        console.error("❌ Erreur :", error);

        container.innerHTML = "";

        const card = document.createElement("div");
        card.className = "card error-card";

        const title = document.createElement("p");
        title.textContent = "❌ Impossible de charger les membres.";

        const message = document.createElement("p");
        message.textContent =
            error instanceof Error
                ? error.message
                : "Erreur inconnue.";

        card.appendChild(title);
        card.appendChild(message);

        container.appendChild(card);
    }
});