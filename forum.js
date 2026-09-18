// =====================================
// SPEED CHESS ACADEMY - FORUM JAVASCRIPT
// =====================================

// ------------------------------------------
// SUPABASE CONFIGURATION
// ------------------------------------------

const SUPABASE_URL = "https://gfrqjawavkzorxzgnhqf.supabase.co";
const SUPABASE_ANON_KEY = "YOUR_PUBLISHABLE_KEY";

const supabaseClient = window.supabase
    ? window.supabase.createClient(
        SUPABASE_URL,
        SUPABASE_ANON_KEY
    )
    : null;


// ------------------------------------------
// HELPERS
// ------------------------------------------

function escapeHTML(value) {
    if (value === null || value === undefined) {
        return "";
    }

    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}


function formatDate(dateString) {
    if (!dateString) {
        return "";
    }

    const date = new Date(dateString);

    return date.toLocaleString("en-US", {
        dateStyle: "medium",
        timeStyle: "short"
    });
}


function getTopicId() {
    const params = new URLSearchParams(
        window.location.search
    );

    return params.get("id");
}


// ------------------------------------------
// CHECK SUPABASE
// ------------------------------------------

function checkSupabase() {
    if (!supabaseClient) {
        console.error("Supabase library is not loaded.");
        return false;
    }

    if (
        SUPABASE_URL === "YOUR_SUPABASE_URL" ||
        SUPABASE_ANON_KEY === "sb_publishable_6hpEe9RpVLvjHwL4CZXIXw_Maq9ivo9"
    ) {
        console.error("Supabase is not configured yet.");
        return false;
    }

    return true;
}


// ------------------------------------------
// LOAD TOPICS
// ------------------------------------------

async function loadTopics() {
    const container =
        document.getElementById("topicsContainer");

    if (!container) {
        return;
    }

    if (!checkSupabase()) {
        container.innerHTML = `
            <div class="card">
                <p>⚠️ Forum database is not configured yet.</p>
            </div>
        `;
        return;
    }

    try {
        const { data, error } = await supabaseClient
            .from("topics")
            .select("*")
            .order("created_at", {
                ascending: false
            });

        if (error) {
            throw error;
        }

        container.innerHTML = "";

        if (!data || data.length === 0) {
            container.innerHTML = `
                <div class="card">
                    <p>💬 No topics yet.</p>
                    <br>
                    <a
                        class="button"
                        href="new-topic.html"
                    >
                        ✏️ Create the first topic
                    </a>
                </div>
            `;
            return;
        }

        data.forEach(topic => {
            const card =
                document.createElement("div");

            card.className = "card forum-topic";

            card.innerHTML = `
                <h3>
                    <a
                        class="study-link"
                        href="topic.html?id=${encodeURIComponent(topic.id)}"
                    >
                        ${escapeHTML(topic.title)}
                    </a>
                </h3>

                <p>
                    📂 ${escapeHTML(topic.category)}
                </p>

                <p>
                    ${escapeHTML(topic.message)}
                </p>

                <small>
                    ♟️ ${escapeHTML(topic.username)}
                    · ${formatDate(topic.created_at)}
                </small>
            `;

            container.appendChild(card);
        });

    } catch (error) {
        console.error(
            "Unable to load topics:",
            error
        );

        container.innerHTML = `
            <div class="card">
                <p>❌ Unable to load forum topics.</p>
                <p>Please try again later.</p>
            </div>
        `;
    }
}


// ------------------------------------------
// LOAD SINGLE TOPIC
// ------------------------------------------

async function loadTopic() {
    const container =
        document.getElementById("topicContainer");

    if (!container) {
        return;
    }

    const topicId = getTopicId();

    if (!topicId) {
        container.innerHTML = `
            <div class="card">
                <p>❌ No topic was specified.</p>
                <br>
                <a
                    class="button"
                    href="forum.html"
                >
                    ⬅️ Back to Forum
                </a>
            </div>
        `;
        return;
    }

    if (!checkSupabase()) {
        container.innerHTML = `
            <div class="card">
                <p>⚠️ Forum database is not configured yet.</p>
            </div>
        `;
        return;
    }

    try {
        const { data, error } = await supabaseClient
            .from("topics")
            .select("*")
            .eq("id", topicId)
            .single();

        if (error) {
            throw error;
        }

        if (!data) {
            container.innerHTML = `
                <div class="card">
                    <p>❌ Topic not found.</p>
                </div>
            `;
            return;
        }

        document.title =
            data.title +
            " — Speed Chess Academy ♟️⚡";

        container.innerHTML = `
            <div class="card forum-topic">
                <h2>
                    ${escapeHTML(data.title)}
                </h2>

                <p>
                    📂 ${escapeHTML(data.category)}
                </p>

                <hr>

                <p>
                    ${escapeHTML(data.message)}
                </p>

                <br>

                <small>
                    ♟️ ${escapeHTML(data.username)}
                    · ${formatDate(data.created_at)}
                </small>
            </div>
        `;

    } catch (error) {
        console.error(
            "Unable to load topic:",
            error
        );

        container.innerHTML = `
            <div class="card">
                <p>❌ Unable to load this topic.</p>
            </div>
        `;
    }
}


// ------------------------------------------
// LOAD REPLIES
// ------------------------------------------

async function loadReplies() {
    const container =
        document.getElementById("repliesContainer");

    if (!container) {
        return;
    }

    const topicId = getTopicId();

    if (!topicId) {
        return;
    }

    if (!checkSupabase()) {
        container.innerHTML = `
            <div class="card">
                <p>⚠️ Database not configured.</p>
            </div>
        `;
        return;
    }

    try {
        const { data, error } = await supabaseClient
            .from("replies")
            .select("*")
            .eq("topic_id", topicId)
            .order("created_at", {
                ascending: true
            });

        if (error) {
            throw error;
        }

        container.innerHTML = "";

        if (!data || data.length === 0) {
            container.innerHTML = `
                <div class="card">
                    <p>
                        💬 No replies yet.
                        Be the first to reply!
                    </p>
                </div>
            `;
            return;
        }

        data.forEach(reply => {
            const card =
                document.createElement("div");

            card.className = "card forum-topic";

            card.innerHTML = `
                <h3>
                    ♟️ ${escapeHTML(reply.username)}
                </h3>

                <p>
                    ${escapeHTML(reply.message)}
                </p>

                <small>
                    ${formatDate(reply.created_at)}
                </small>
            `;

            container.appendChild(card);
        });

    } catch (error) {
        console.error(
            "Unable to load replies:",
            error
        );

        container.innerHTML = `
            <div class="card">
                <p>❌ Unable to load replies.</p>
            </div>
        `;
    }
}


// ------------------------------------------
// CREATE TOPIC
// ------------------------------------------

async function createTopic(event) {
    event.preventDefault();

    if (!checkSupabase()) {
        alert(
            "The forum database is not configured yet."
        );
        return;
    }

    const category =
        document.getElementById("category").value.trim();

    const title =
        document.getElementById("title").value.trim();

    const username =
        document.getElementById("username").value.trim();

    const message =
        document.getElementById("message").value.trim();

    if (
        !category ||
        !title ||
        !username ||
        !message
    ) {
        alert("Please complete all fields.");
        return;
    }

    const submitButton =
        event.target.querySelector(
            'button[type="submit"]'
        );

    if (submitButton) {
        submitButton.disabled = true;
        submitButton.textContent =
            "⚡ Creating...";
    }

    try {
        const { data, error } =
            await supabaseClient
                .from("topics")
                .insert({
                    category: category,
                    title: title,
                    username: username,
                    message: message
                })
                .select()
                .single();

        if (error) {
            throw error;
        }

        if (!data) {
            throw new Error(
                "Topic was not returned."
            );
        }

        window.location.href =
            "topic.html?id=" +
            encodeURIComponent(data.id);

    } catch (error) {
        console.error(
            "Unable to create topic:",
            error
        );

        alert(
            "Unable to create the topic. " +
            "Please try again."
        );

        if (submitButton) {
            submitButton.disabled = false;
            submitButton.textContent =
                "🚀 Create Topic";
        }
    }
}


// ------------------------------------------
// CREATE REPLY
// ------------------------------------------

async function createReply(event) {
    event.preventDefault();

    if (!checkSupabase()) {
        alert(
            "The forum database is not configured yet."
        );
        return;
    }

    const topicId = getTopicId();

    if (!topicId) {
        alert("No topic was specified.");
        return;
    }

    const username =
        document.getElementById("username").value.trim();

    const message =
        document.getElementById("message").value.trim();

    if (!username || !message) {
        alert("Please complete all fields.");
        return;
    }

    const submitButton =
        event.target.querySelector(
            'button[type="submit"]'
        );

    if (submitButton) {
        submitButton.disabled = true;
        submitButton.textContent =
            "⚡ Posting...";
    }

    try {
        const { error } =
            await supabaseClient
                .from("replies")
                .insert({
                    topic_id: topicId,
                    username: username,
                    message: message
                });

        if (error) {
            throw error;
        }

        document.getElementById("message").value = "";

        await loadReplies();

    } catch (error) {
        console.error(
            "Unable to create reply:",
            error
        );

        alert(
            "Unable to post the reply. " +
            "Please try again."
        );
    }

    if (submitButton) {
        submitButton.disabled = false;
        submitButton.textContent =
            "💬 Post Reply";
    }
}


// ------------------------------------------
// PAGE INITIALIZATION
// ------------------------------------------

document.addEventListener(
    "DOMContentLoaded",
    function() {

        loadTopics();
        loadTopic();
        loadReplies();

        const newTopicForm =
            document.getElementById("newTopicForm");

        if (newTopicForm) {
            newTopicForm.addEventListener(
                "submit",
                createTopic
            );
        }

        const replyForm =
            document.getElementById("replyForm");

        if (replyForm) {
            replyForm.addEventListener(
                "submit",
                createReply
            );
        }
    }
);