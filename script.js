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
                    Accept: "application/json"
                }
            }
        );

        console.log("Status Lichess :", response.status);

        if (!response.ok) {
            throw new Error(
                `Lichess répond avec le code ${response.status}`
            );
        }

        const data = await response.json();

        console.log("Membres Lichess :", data);

        // Vérifie que Lichess a bien renvoyé une liste
        if (!Array.isArray(data)) {
            throw new Error("Format de réponse Lichess inattendu.");
        }

        // Aucun membre
        if (data.length === 0) {
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
        title.textContent = `Membres (${data.length})`;
        container.appendChild(title);

        // Conteneur de la liste
        const list = document.createElement("div");
        list.className = "members-grid";

        data.forEach((member) => {
            const card = document.createElement("div");
            card.className = "card member-card";

            const username = member.username || "Joueur inconnu";
            const title = member.title || "";

            const name = document.createElement("h3");

            if (title) {
                name.textContent = `${title} ${username}`;
            } else {
                name.textContent = username;
            }

            const link = document.createElement("a");
            link.href = `https://lichess.org/@/${encodeURIComponent(username)}`;
            link.textContent = "Voir le profil →";
            link.target = "_blank";
            link.rel = "noopener noreferrer";

            card.appendChild(name);
            card.appendChild(link);

            list.appendChild(card);
        });

        container.appendChild(list);

    } catch (error) {
        console.error("❌ Erreur :", error);

        container.innerHTML = `
            <div class="card error-card">
                <p>❌ Impossible de charger les membres.</p>
                <p>${error instanceof Error ? error.message : "Erreur inconnue."}</p>
            </div>
        `;
    }
});