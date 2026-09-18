// =====================================
// SPEED CHESS ACADEMY - JAVASCRIPT
// =====================================


// =====================================
// MEMBER COUNTER
// =====================================

let members = 55;
const goal = 200;

function updateMembers() {
    const counter = document.getElementById("memberCounter");

    if (!counter) {
        return;
    }

    counter.textContent = `♟️ Members: ${members} / ${goal}`;
}


// =====================================
// LOAD LICHESS TEAM MEMBERS
// =====================================

async function loadMembers() {
    const membersContainer = document.getElementById("membersList");

    // Do nothing if we are not on members.html
    if (!membersContainer) {
        return;
    }

    membersContainer.innerHTML = `
        <div class="card">
            <p>⚡ Loading members...</p>
        </div>
    `;

    try {
        const response = await fetch(
            "https://lichess.org/api/team/speed-chess-academy/users",
            {
                method: "GET",
                headers: {
                    "Accept": "application/json"
                }
            }
        );

        if (!response.ok) {
            throw new Error(
                `Lichess API error: ${response.status} ${response.statusText}`
            );
        }

        const data = await response.json();

        // =====================================
        // GET MEMBERS FROM API
        // =====================================

        let teamMembers = [];

        if (Array.isArray(data)) {
            teamMembers = data;
        } else if (Array.isArray(data.result)) {
            teamMembers = data.result;
        } else if (Array.isArray(data.users)) {
            teamMembers = data.users;
        }

        // Remove invalid members and duplicates
        const uniqueMembers = [];
        const usernames = new Set();

        teamMembers.forEach(member => {
            if (!member || typeof member !== "object") {
                return;
            }

            const username = member.username || member.name;

            if (!username) {
                return;
            }

            const normalizedUsername = username.toLowerCase();

            if (usernames.has(normalizedUsername)) {
                return;
            }

            usernames.add(normalizedUsername);
            uniqueMembers.push({
                ...member,
                username
            });
        });

        teamMembers = uniqueMembers;

        // =====================================
        // CLEAR LOADING MESSAGE
        // =====================================

        membersContainer.innerHTML = "";

        // =====================================
        // NO MEMBERS
        // =====================================

        if (teamMembers.length === 0) {
            membersContainer.innerHTML = `
                <div class="card">
                    <p>❌ No members found.</p>

                    <br>

                    <a
                        class="button"
                        href="https://lichess.org/team/speed-chess-academy"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        ♟️ View team on Lichess
                    </a>
                </div>
            `;

            return;
        }

        // =====================================
        // CREATE MEMBER CARDS
        // =====================================

        const fragment = document.createDocumentFragment();

        teamMembers.forEach(member => {
            const username = member.username;

            // ---------------------------------
            // MEMBER CARD
            // ---------------------------------

            const card = document.createElement("div");
            card.className = "member";

            // ---------------------------------
            // MEMBER TITLE
            // ---------------------------------

            const title = document.createElement("h3");

            // ---------------------------------
            // CLICKABLE USERNAME
            // ---------------------------------

            const usernameLink = document.createElement("a");

            usernameLink.className = "study-link";

            usernameLink.textContent = `♟️ ${username}`;

            usernameLink.href =
                `https://lichess.org/@/${encodeURIComponent(username)}`;

            usernameLink.target = "_blank";
            usernameLink.rel = "noopener noreferrer";

            // Put clickable username inside title
            title.appendChild(usernameLink);

            // Add title to card
            card.appendChild(title);

            // Add card to fragment
            fragment.appendChild(card);
        });

        // Add all cards at once
        membersContainer.appendChild(fragment);

        // =====================================
        // UPDATE MEMBER COUNTER
        // =====================================

        members = teamMembers.length;
        updateMembers();

    } catch (error) {
        console.error(
            "Unable to load Lichess members:",
            error
        );

        membersContainer.innerHTML = `
            <div class="card">
                <p>
                    ❌ Unable to load members automatically.
                </p>

                <br>

                <p>
                    Please try again later.
                </p>

                <br>

                <a
                    class="button"
                    href="https://lichess.org/team/speed-chess-academy"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    ♟️ Open Lichess Team
                </a>
            </div>
        `;
    }
}


// =====================================
// START MEMBER SYSTEM
// =====================================

document.addEventListener("DOMContentLoaded", () => {
    updateMembers();
    loadMembers();
});