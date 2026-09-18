document.addEventListener("DOMContentLoaded", async () => {
    const container = document.getElementById("membersList");

    if (!container) {
        console.error("❌ #membersList introuvable");
        return;
    }

    container.innerHTML = "<p>⏳ Connexion à Lichess...</p>";

    try {
        const url =
            "https://lichess.org/api/team/speed-chess-academy/users";

        const response = await fetch(url);

        console.log("Status :", response.status);
        console.log("Content-Type :", response.headers.get("content-type"));

        if (!response.ok) {
            throw new Error(
                `Lichess répond avec le code ${response.status}`
            );
        }

        // IMPORTANT :
        // On récupère le texte brut.
        // On n'utilise PAS response.json().
        const rawText = await response.text();

        console.log("========== RÉPONSE LICHESS ==========");
        console.log(rawText);
        console.log("=====================================");

        // L'API Lichess renvoie normalement du NDJSON :
        // un objet JSON par ligne.
        const lines = rawText
            .split(/\r?\n/)
            .map(line => line.trim())
            .filter(Boolean);

        console.log("Nombre de lignes :", lines.length);

        const members = [];

        for (const line of lines) {
            try {
                const member = JSON.parse(line);
                members.push(member);
            } catch (error) {
                console.error("❌ Ligne JSON invalide :", line);
                console.error(error);
            }
        }

        console.log("Membres récupérés :", members);

        if (members.length === 0) {
            container.innerHTML = `
                <div class="card">
                    <p>⚠️ Aucun membre n'a pu être récupéré.</p>
                    <p>Regarde la console du navigateur pour voir la réponse Lichess.</p>
                </div>
            `;
            return;
        }

        container.innerHTML = "";

        const title = document.createElement("h2");
        title.textContent = `Membres (${members.length})`;

        const grid = document.createElement("div");
        grid.className = "members-grid";

        members.forEach(member => {
            const card = document.createElement("div");
            card.className = "card member-card";

            const name = document.createElement("h3");

            const username =
                member.username ||
                member.name ||
                member.user?.username ||
                "Joueur inconnu";

            const lichessTitle =
                member.title ||
                member.user?.title ||
                "";

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

        container.appendChild(title);
        container.appendChild(grid);

    } catch (error) {
        console.error("❌ ERREUR GÉNÉRALE :", error);

        container.innerHTML = "";

        const card = document.createElement("div");
        card.className = "card error-card";

        const message = document.createElement("p");

        message.textContent =
            `❌ ${error instanceof Error
                ? error.message
                : "Erreur inconnue"}`;

        card.appendChild(message);
        container.appendChild(card);
    }
});