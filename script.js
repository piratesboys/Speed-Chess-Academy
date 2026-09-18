document.addEventListener("DOMContentLoaded", async () => {
    const container = document.getElementById("membersList");
    const counter = document.getElementById("memberCounter");

    if (!container) {
        console.error("❌ #membersList introuvable");
        return;
    }

    container.innerHTML = `
        <div class="card loading-card">
            <div class="loading-icon">♟️</div>
            <p>Connexion à Lichess...</p>
        </div>
    `;

    try {
        const response = await fetch(
            "https://lichess.org/api/team/speed-chess-academy/users"
        );

        if (!response.ok) {
            throw new Error(
                `Lichess répond avec le code ${response.status}`
            );
        }

        const rawText = await response.text();

        // Lichess renvoie un membre JSON par ligne
        const lines = rawText
            .split(/\r?\n/)
            .map(line => line.trim())
            .filter(Boolean);

        const members = [];

        for (const line of lines) {
            try {
                const member = JSON.parse(line);

                if (member) {
                    members.push(member);
                }
            } catch (error) {
                console.error("❌ Ligne JSON invalide :", line);
            }
        }

        console.log("✅ Membres Lichess :", members);

        if (counter) {
            counter.textContent =
                `♟️ Members: ${members.length}`;
        }

        if (members.length === 0) {
            container.innerHTML = `
                <div class="card">
                    <p>⚠️ Aucun membre trouvé.</p>
                </div>
            `;
            return;
        }

        container.innerHTML = "";

        const grid = document.createElement("div");
        grid.className = "members-grid";

        members.forEach((member) => {

            const username =
                member.username ||
                member.name ||
                member.user?.username ||
                "Joueur";

            const lichessTitle =
                member.title ||
                member.user?.title ||
                "";

            // =========================
            // CARD
            // =========================

            const card = document.createElement("article");
            card.className = "member-card";

            // =========================
            // AVATAR
            // =========================

            const avatar = document.createElement("div");
            avatar.className = "member-avatar";

            avatar.textContent =
                username.charAt(0).toUpperCase();

            // =========================
            // NOM
            // =========================

            const name = document.createElement("h3");
            name.className = "member-name";
            name.textContent = username;

            // =========================
            // TITRE LICHESS
            // =========================

            if (lichessTitle) {
                const badge = document.createElement("span");

                badge.className = "member-title";
                badge.textContent = lichessTitle;

                card.appendChild(avatar);
                card.appendChild(name);
                card.appendChild(badge);
            } else {
                card.appendChild(avatar);
                card.appendChild(name);
            }

            // =========================
            // LIEN
            // =========================

            const profile = document.createElement("a");

            profile.className = "member-profile";

            profile.href =
                `https://lichess.org/@/${encodeURIComponent(username)}`;

            profile.target = "_blank";
            profile.rel = "noopener noreferrer";

            profile.textContent =
                "Voir le profil →";

            card.appendChild(profile);

            grid.appendChild(card);
        });

        container.appendChild(grid);

    } catch (error) {

        console.error("❌ Erreur Lichess :", error);

        if (counter) {
            counter.textContent =
                "♟️ Members: Error";
        }

        container.innerHTML = `
            <div class="card error-card">
                <h3>❌ Impossible de charger les membres</h3>
                <p>${error instanceof Error
                    ? error.message
                    : "Erreur inconnue."}</p>
            </div>
        `;
    }
});