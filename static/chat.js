/**
 * Easy Pharmacy 2.0 — Chat Frontend Logic
 * Handles: message sending, bubble rendering, markdown parsing, loading states,
 * and restoring conversation history when the page is revisited.
 */

// ─── State ────────────────────────────────────────────────────────────────────
console.log("chat.js is loading");
let isLoading = false; // prevent double-sends

// ─── Initialisation ──────────────────────────────────────────────────────────

document.addEventListener("DOMContentLoaded", async () => {
    const input = document.getElementById("userInput");

    // Auto-resize textarea as user types
    input.addEventListener("input", autoResizeTextarea);

    // Enter to send, Shift+Enter for newline
    input.addEventListener("keydown", (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });

    // ── Restore conversation history from server session ──────────────────────
    // This ensures messages are visible even after navigating away and back
    await loadHistory();

    // Check if a question was pre-filled from the landing page or medicines page
    const prefill = sessionStorage.getItem("prefillQuestion");
    if (prefill) {
        sessionStorage.removeItem("prefillQuestion");
        setTimeout(() => {
            input.value = prefill;
            autoResizeTextarea.call(input);
            sendMessage();
        }, 400);
    }

    // Focus input on load
    input.focus();
});

// ─── Load History on Page Load ────────────────────────────────────────────────

async function loadHistory() {
    try {
        const response = await fetch("/api/history");
        const data = await response.json();

        console.log("History loaded:", data.history.length, "messages"); // ADD THIS LINE

        if (data.history && data.history.length > 0) {
            hideWelcomeScreen();
            data.history.forEach((msg) => {
                const role = msg.role === "assistant" ? "bot" : "user";
                console.log("Rendering:", role, msg.content.substring(0, 30)); // ADD THIS LINE
                appendMessage(role, msg.content);
            });
        }
    } catch (error) {
        console.warn("Could not load chat history:", error);
    }
}

// ─── Core: Send Message ───────────────────────────────────────────────────────

async function sendMessage() {
    const input = document.getElementById("userInput");
    const message = input.value.trim();

    if (!message || isLoading) return;

    // Hide welcome screen once conversation starts
    hideWelcomeScreen();

    // Display user's message bubble
    appendMessage("user", message);

    // Clear input
    input.value = "";
    autoResizeTextarea.call(input);

    // Show typing indicator
    setLoading(true);

    try {
        const response = await fetch("/api/chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message }),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || "Something went wrong on the server.");
        }

        if (data.error) {
            throw new Error(data.error);
        }

        // Display bot's response
        appendMessage("bot", data.reply);

    } catch (error) {
        console.error("Chat error:", error);
        appendMessage("error", error.message || "I couldn't connect. Please check your internet and try again.");
    } finally {
        setLoading(false);
        scrollToBottom();
    }
}

// ─── Quick Question Buttons ───────────────────────────────────────────────────

function sendQuickQuestion(buttonEl) {
    const question = buttonEl.textContent.trim();
    const input = document.getElementById("userInput");
    input.value = question;
    sendMessage();
}

// ─── Clear History ────────────────────────────────────────────────────────────

async function clearHistory() {
    if (!confirm("Clear the conversation history?")) return;

    try {
        await fetch("/api/clear-history", { method: "POST" });
    } catch (e) {
        console.warn("Could not clear server history:", e);
    }

    // Clear the UI
    document.getElementById("messagesList").innerHTML = "";
    showWelcomeScreen();
}

// ─── DOM Helpers ──────────────────────────────────────────────────────────────

/**
 * Append a message bubble to the chat.
 * @param {"user"|"bot"|"error"} role
 * @param {string} content — raw text/markdown
 */
function appendMessage(role, content) {
    const list = document.getElementById("messagesList");

    const wrapper = document.createElement("div");
    wrapper.className = `message-wrapper ${role}-wrapper`;

    if (role === "bot" || role === "error") {
        const avatar = document.createElement("div");
        avatar.className = "bot-msg-avatar";
        avatar.textContent = role === "error" ? "⚠" : "⚕";
        wrapper.appendChild(avatar);
    }

    const bubble = document.createElement("div");
    bubble.className = `message-bubble ${role}-bubble`;

    if (role === "bot") {
        bubble.innerHTML = parseMarkdown(content);
    } else if (role === "error") {
        bubble.innerHTML = `<span class="error-text">⚠ ${escapeHtml(content)}</span>`;
    } else {
        bubble.textContent = content;
    }

    const time = document.createElement("span");
    time.className = "message-time";
    time.textContent = getCurrentTime();

    wrapper.appendChild(bubble);
    wrapper.appendChild(time);
    list.appendChild(wrapper);

    scrollToBottom();
}

/** Show or hide the typing indicator */
function setLoading(loading) {
    isLoading = loading;
    const indicator = document.getElementById("typingIndicator");
    const sendBtn = document.getElementById("sendBtn");
    const input = document.getElementById("userInput");

    indicator.style.display = loading ? "flex" : "none";
    sendBtn.disabled = loading;
    input.disabled = loading;

    if (loading) scrollToBottom();
}

function hideWelcomeScreen() {
    const ws = document.getElementById("welcomeScreen");
    if (ws) ws.style.display = "none";
}

function showWelcomeScreen() {
    const ws = document.getElementById("welcomeScreen");
    if (ws) ws.style.display = "flex";
}

function scrollToBottom() {
    const container = document.getElementById("messagesContainer");
    setTimeout(() => {
        container.scrollTop = container.scrollHeight;
    }, 50);
}

function autoResizeTextarea() {
    this.style.height = "auto";
    this.style.height = Math.min(this.scrollHeight, 160) + "px";
}

function getCurrentTime() {
    return new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

// ─── Markdown Parser ──────────────────────────────────────────────────────────

function parseMarkdown(text) {
    let html = escapeHtml(text);
    html = html.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
    html = html.replace(/\*(.+?)\*/g, "<em>$1</em>");
    html = html.replace(/((?:^[-•] .+\n?)+)/gm, (match) => {
        const items = match.trim().split("\n")
            .map((line) => `<li>${line.replace(/^[-•] /, "")}</li>`).join("");
        return `<ul>${items}</ul>`;
    });
    html = html.replace(/((?:^\d+\. .+\n?)+)/gm, (match) => {
        const items = match.trim().split("\n")
            .map((line) => `<li>${line.replace(/^\d+\. /, "")}</li>`).join("");
        return `<ol>${items}</ol>`;
    });
    html = html.replace(/^### (.+)$/gm, "<h4>$1</h4>");
    html = html.replace(/^## (.+)$/gm, "<h3>$1</h3>");
    html = html.replace(/\n\n/g, "</p><p>");
    html = html.replace(/\n/g, "<br>");
    html = `<p>${html}</p>`;
    html = html.replace(/<p><\/p>/g, "");
    html = html.replace(/<p><br><\/p>/g, "");
    return html;
}

function escapeHtml(text) {
    const div = document.createElement("div");
    div.appendChild(document.createTextNode(text));
    return div.innerHTML;
}
