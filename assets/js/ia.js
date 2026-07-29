/* ==========================================================
   Rodrigo Tripa Portfolio
   ia.js - Cybersecurity AI Assistant Controller
========================================================== */

document.addEventListener("DOMContentLoaded", () => {
    const API_ENDPOINT = "/api/chat";

    const chatHistory = document.getElementById("chat-history");
    const chatForm = document.getElementById("chat-form");
    const userInput = document.getElementById("user-input");
    const sendBtn = document.getElementById("send-btn");
    const chips = document.querySelectorAll(".chip");

    // Configure Marked parser if present
    if (window.marked) {
        window.marked.setOptions({
            breaks: true,
            gfm: true
        });
    }

    // Chip prompt click handlers
    chips.forEach(chip => {
        chip.addEventListener("click", () => {
            const promptText = chip.getAttribute("data-prompt");
            if (promptText) {
                userInput.value = promptText;
                handleChatSubmit();
            }
        });
    });

    // Form submit handler
    chatForm?.addEventListener("submit", (e) => {
        e.preventDefault();
        handleChatSubmit();
    });

    async function handleChatSubmit() {
        const query = userInput.value.trim();
        if (!query) return;

        // Reset input and append user's query
        userInput.value = "";
        appendMessage("user", query);

        // Append assistant placeholder loading element
        const loadingIndicator = `<div class="loading-dots"><span></span><span></span><span></span></div> Thinking...`;
        const loadingMsgId = appendMessage("assistant", loadingIndicator, true);

        toggleControlsState(true);

        try {
            const response = await fetch(API_ENDPOINT, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message: query }),
            });

            if (!response.ok) {
                throw new Error("Server response status error.");
            }

            const data = await response.json();
            updateMessage(loadingMsgId, data.response || "No response received.");
        } catch (error) {
            console.error("AI Assistant API Error:", error);
            updateMessage(
                loadingMsgId, 
                "⚠️ Unable to process request. Please ensure backend endpoint `/api/chat` is active and try again."
            );
        } finally {
            toggleControlsState(false);
        }
    }

    function appendMessage(sender, text, isRawHtml = false) {
        const msgId = "msg-" + Date.now() + "-" + Math.floor(Math.random() * 1000);
        
        const msgDiv = document.createElement("div");
        msgDiv.classList.add("message", sender);
        msgDiv.id = msgId;

        const avatarDiv = document.createElement("div");
        avatarDiv.classList.add("message-avatar");
        avatarDiv.textContent = sender === "user" ? "YOU" : "AI";

        const contentDiv = document.createElement("div");
        contentDiv.classList.add("message-content");

        if (isRawHtml) {
            contentDiv.innerHTML = text;
        } else {
            contentDiv.innerHTML = renderMarkdown(text);
        }

        msgDiv.appendChild(avatarDiv);
        msgDiv.appendChild(contentDiv);

        chatHistory.appendChild(msgDiv);
        scrollToBottom();

        return msgId;
    }

    function updateMessage(msgId, text) {
        const msgDiv = document.getElementById(msgId);
        if (msgDiv) {
            const contentDiv = msgDiv.querySelector(".message-content");
            if (contentDiv) {
                contentDiv.innerHTML = renderMarkdown(text);
                scrollToBottom();
            }
        }
    }

    function renderMarkdown(rawText) {
        if (window.marked && typeof window.marked.parse === "function") {
            return window.marked.parse(rawText);
        }
        // Fallback if marked library fails to load
        return rawText
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/\n/g, "<br>");
    }

    function scrollToBottom() {
        if (chatHistory) {
            chatHistory.scrollTop = chatHistory.scrollHeight;
        }
    }

    function toggleControlsState(disabled) {
        if (userInput) userInput.disabled = disabled;
        if (sendBtn) sendBtn.disabled = disabled;
        if (!disabled && userInput) userInput.focus();
    }
});
