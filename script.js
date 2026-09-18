// =====================================
// SPEED CHESS ACADEMY - JAVASCRIPT
// LICHESS API CURRENT VERSION
// =====================================


// =====================================
// CONFIGURATION
// =====================================

const LICHESS_TEAM_ID = "speed-chess-academy";
const LICHESS_TEAM_URL =
    `https://lichess.org/team/${LICHESS_TEAM_ID}`;

const LICHESS_API_URL =
    `https://lichess.org/api/team/${LICHESS_TEAM_ID}/users`;

let members = 0;
const goal = 200;


// =====================================
// MEMBER COUNTER
// =====================================

function updateMembers() {

    const counter =
        document.getElementById("memberCounter");

    if (!counter) {
        return;
    }

    counter.textContent =
        `♟️ Members: ${members} / ${goal}`;
}


// =====================================
// CREATE MEMBER CARD
// =====================================

function createMemberCard(username) {

    const card =
        document.createElement("div");

    card.className = "member";


    const title =
        document.createElement("h3");


    const usernameLink =
        document.createElement("a");

    usernameLink.className =
        "study-link";

    usernameLink.textContent =
        `♟️ ${username}`;

    usernameLink.href =
        `https://lichess.org/@/${encodeURIComponent(username)}`;

    usernameLink.target =
        "_blank";

    usernameLink.rel =
        "noopener noreferrer";


    title.appendChild(usernameLink);

    card.appendChild(title);


    return card;
}


// =====================================
// LOAD ONE PAGE OF MEMBERS
// =====================================

async function fetchMembersPage(before = null) {

    const url = new URL(LICHESS_API_URL);


    // Lichess pagination
    if (before) {
        url.searchParams.set("before", before);
    }


    const response =
        await fetch(url.toString(), {
            method: "GET",
            headers: {
                "Accept": "application/json"
            },
            cache: "no-store"
        });


    if (!response.ok) {

        throw new Error(
            `Lichess API error: ${response.status} ${response.statusText}`
        );
    }


    return await response.json();
}


// =====================================
// LOAD ALL TEAM MEMBERS
// =====================================

async function loadMembers() {

    const membersContainer =
        document.getElementById("membersList");


    // Not on members page
    if (!membersContainer) {
        return;
    }


    membersContainer.innerHTML = `
        <div class="card">
            <p>⚡ Loading members...</p>
        </div>
    `;


    try {

        const allMembers = [];

        let before = null;

        let safetyCounter = 0;

        const MAX_REQUESTS = 100;


        // =====================================
        // PAGINATION LOOP
        // =====================================

        while (safetyCounter < MAX_REQUESTS) {

            safetyCounter++;


            const data =
                await fetchMembersPage(before);


            // =====================================
            // NORMALIZE RESPONSE
            // =====================================

            let pageMembers = [];


            if (Array.isArray(data)) {

                pageMembers = data;

            } else if (
                data &&
                Array.isArray(data.users)
            ) {

                pageMembers = data.users;

            } else if (
                data &&
                Array.isArray(data.result)
            ) {

                pageMembers = data.result;

            }


            // =====================================
            // STOP IF EMPTY PAGE
            // =====================================

            if (pageMembers.length === 0) {
                break;
            }


            // =====================================
            // ADD MEMBERS
            // =====================================

            allMembers.push(
                ...pageMembers
            );


            // =====================================
            // GET CURSOR FOR NEXT PAGE
            // =====================================

            const lastMember =
                pageMembers[
                    pageMembers.length - 1
                ];


            const lastUsername =
                lastMember?.username ||
                lastMember?.name;


            if (!lastUsername) {
                break;
            }


            // Lichess uses the username as
            // the pagination cursor.
            before = lastUsername;


            // =====================================
            // STOP IF PAGE IS SMALL
            // =====================================

            if (pageMembers.length < 10) {
                break;
            }
        }


        // =====================================
        // REMOVE DUPLICATES
        // =====================================

        const uniqueMembers = [];

        const usernames = new Set();


        for (const member of allMembers) {

            if (!member) {
                continue;
            }


            const username =
                member.username ||
                member.name;


            if (!username) {
                continue;
            }


            const key =
                username.toLowerCase();


            if (usernames.has(key)) {
                continue;
            }


            usernames.add(key);


            uniqueMembers.push({
                ...member,
                username
            });
        }


        // =====================================
        // SORT MEMBERS
        // =====================================

        uniqueMembers.sort(
            (a, b) =>
                a.username.localeCompare(
                    b.username,
                    undefined,
                    {
                        sensitivity: "base"
                    }
                )
        );


        // =====================================
        // UPDATE MEMBER COUNT
        // =====================================

        members =
            uniqueMembers.length;

        updateMembers();


        // =====================================
        // CLEAR LOADING
        // =====================================

        membersContainer.innerHTML = "";


        // =====================================
        // NO MEMBERS
        // =====================================

        if (uniqueMembers.length === 0) {

            membersContainer.innerHTML = `
                <div class="card">

                    <p>
                        ❌ No members found.
                    </p>

                    <br>

                    <a
                        class="button"
                        href="${LICHESS_TEAM_URL}"
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
        // CREATE DOCUMENT FRAGMENT
        // =====================================

        const fragment =
            document.createDocumentFragment();


        // =====================================
        // CREATE MEMBER CARDS
        // =====================================

        uniqueMembers.forEach(member => {

            const card =
                createMemberCard(
                    member.username
                );


            fragment.appendChild(card);

        });


        membersContainer.appendChild(
            fragment
        );


        // =====================================
        // OPTIONAL MEMBER INFO
        // =====================================

        console.log(
            `Lichess: ${members} members loaded.`
        );

    }


    catch (error) {

        console.error(
            "Unable to load Lichess team members:",
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
                    href="${LICHESS_TEAM_URL}"
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
// START
// =====================================

document.addEventListener(
    "DOMContentLoaded",
    () => {

        updateMembers();

        loadMembers();

    }
);