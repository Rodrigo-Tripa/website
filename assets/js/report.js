(function () {
    const params = new URLSearchParams(window.location.search);
    const edition = params.get("edition") || "2026/week-31";

    const basePath = `/security/${edition}`;
    const markdownUrl = `${basePath}/index.md`;
    const metadataUrl = `${basePath}/metadata.json`;

    const titleEl = document.getElementById("report-title");
    const kickerEl = document.getElementById("report-kicker");
    const descEl = document.getElementById("report-description");
    const metaRowEl = document.getElementById("report-meta-row");
    const detailsEl = document.getElementById("report-details");
    const tocEl = document.getElementById("report-toc");
    const cardEl = document.getElementById("report-card");
    const rawLinkEl = document.getElementById("raw-link");
    const downloadLinkEl = document.getElementById("download-link");

    const state = { markdown: "", metadata: null };

    function escapeHTML(value) {
        return String(value)
            .replaceAll("&", "&amp;")
            .replaceAll("<", "&lt;")
            .replaceAll(">", "&gt;")
            .replaceAll('"', "&quot;")
            .replaceAll("'", "&#39;");
    }

    function formatDate(value) {
        if (!value) return "—";
        const date = new Date(value);
        if (Number.isNaN(date.getTime())) return value;
        return new Intl.DateTimeFormat("en-GB", {
            year: "numeric",
            month: "short",
            day: "2-digit"
        }).format(date);
    }

    function formatThreatLevel(value) {
        const level = String(value || "Moderate").toLowerCase();
        if (level.includes("critical")) return "🔴 Critical";
        if (level.includes("high")) return "🟠 High";
        if (level.includes("low")) return "🟢 Low";
        return "🟡 Moderate";
    }

    function removeFrontMatter(markdown) {
        return String(markdown || "").replace(
            /^---\r?\n[\s\S]*?\r?\n---\r?\n?/,
            ""
        );
    }

    function buildAbsoluteAssetPath(relativePath) {
        if (!relativePath) return relativePath;
        if (/^(https?:|mailto:|data:|#|\/)/i.test(relativePath)) return relativePath;
        return `${basePath}/${relativePath}`.replace(/\/{2,}/g, "/");
    }

    function preprocessMarkdown(markdown) {
        return markdown
            .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, (match, alt, src) => {
                const resolved = buildAbsoluteAssetPath(src.trim());
                return `![${alt}](${resolved})`;
            })
            .replace(/\[([^\]]+)\]\(([^)]+)\)/g, (match, text, href) => {
                const trimmed = href.trim();
                if (/^(https?:|mailto:|data:|#|\/)/i.test(trimmed)) {
                    return match;
                }
                const resolved = buildAbsoluteAssetPath(trimmed);
                return `[${text}](${resolved})`;
            });
    }

    function slugify(text) {
        return String(text)
            .toLowerCase()
            .trim()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-+|-+$/g, "");
    }

    function buildToc(html) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, "text/html");
        const headings = [...doc.querySelectorAll("h2, h3")];

        if (!headings.length) {
            tocEl.innerHTML = '<span style="color: var(--text-muted);">No headings found.</span>';
            return doc.body.innerHTML;
        }

        const usedIds = new Map();

        headings.forEach((heading) => {
            const text = heading.textContent.trim();
            let id = slugify(text) || "section";

            if (usedIds.has(id)) {
                const next = usedIds.get(id) + 1;
                usedIds.set(id, next);
                id = `${id}-${next}`;
            } else {
                usedIds.set(id, 1);
            }

            heading.id = id;
        });

        const tocItems = headings.map((heading) => {
            const level = Number(heading.tagName.replace("H", ""));
            const indentClass = level === 3 ? "toc-indent-3" : "";
            const label = escapeHTML(heading.textContent.trim());
            return `<a class="${indentClass}" href="#${heading.id}">${label}</a>`;
        }).join("");

        tocEl.innerHTML = tocItems;

        return doc.body.innerHTML;
    }

    function setLoadingState(message) {
        cardEl.innerHTML = `<div class="report-loading">${escapeHTML(message)}</div>`;
        tocEl.innerHTML = `<span style="color: var(--text-muted);">${escapeHTML(message)}</span>`;
        detailsEl.innerHTML = `<span>${escapeHTML(message)}</span>`;
    }

    async function loadReport() {
        try {
            setLoadingState("Loading report content...");

            const [metadataResponse, markdownResponse] = await Promise.all([
                fetch(metadataUrl),
                fetch(markdownUrl)
            ]);

            if (!metadataResponse.ok) {
                throw new Error(`Failed to load metadata.json (${metadataResponse.status})`);
            }

            if (!markdownResponse.ok) {
                throw new Error(`Failed to load index.md (${markdownResponse.status})`);
            }

            const metadata = await metadataResponse.json();
            const markdown = await markdownResponse.text();

            state.metadata = metadata;
            state.markdown = markdown;

            renderReport();
        } catch (error) {
            console.error(error);
            titleEl.textContent = "Report unavailable";
            descEl.textContent = "The selected report could not be loaded.";
            cardEl.innerHTML = `<div class="report-error">${escapeHTML(error.message)}</div>`;
            tocEl.innerHTML = '<span style="color: var(--text-muted);">Unable to build contents.</span>';
            detailsEl.innerHTML = `<span>${escapeHTML(error.message)}</span>`;
        }
    }

    function renderReport() {
        const metadata = state.metadata || {};
        const cleanMarkdown = removeFrontMatter(state.markdown || "");
        const markdown = preprocessMarkdown(cleanMarkdown);
        const rendered = marked.parse(markdown, { breaks: true });
        const html = buildToc(rendered);

        const title = metadata.title || "Security Weekly";
        const editionLabel = metadata.edition ? `#${String(metadata.edition).padStart(3, "0")}` : "—";
        const weekLabel = metadata.week ? `Week ${String(metadata.week).padStart(2, "0")}` : "—";
        const yearLabel = metadata.year || "—";
        const publishedLabel = formatDate(metadata.published);
        const updatedLabel = formatDate(metadata.last_updated || metadata.published);
        const readingTimeLabel = metadata.readingTime ? `${metadata.readingTime} min` : "—";
        const threatLevelLabel = formatThreatLevel(metadata.threatLevel);

        document.title = `${title} | Security Weekly | Rodrigo Tripa`;
        titleEl.textContent = title;
        kickerEl.textContent = `Security Weekly ${editionLabel}`;
        descEl.textContent = metadata.summary || "Weekly cybersecurity intelligence, threat analysis and technical research.";

        metaRowEl.innerHTML = `
            <span class="report-meta-pill">${escapeHTML(weekLabel)} • ${escapeHTML(String(yearLabel))}</span>
            <span class="report-meta-pill">Published ${escapeHTML(publishedLabel)}</span>
            <span class="report-meta-pill">${escapeHTML(readingTimeLabel)}</span>
            <span class="report-meta-pill">${escapeHTML(threatLevelLabel)}</span>
        `;

        detailsEl.innerHTML = `
            <span><strong>Edition:</strong> ${escapeHTML(editionLabel)}</span>
            <span><strong>Week:</strong> ${escapeHTML(weekLabel)}</span>
            <span><strong>Year:</strong> ${escapeHTML(String(yearLabel))}</span>
            <span><strong>Published:</strong> ${escapeHTML(publishedLabel)}</span>
            <span><strong>Updated:</strong> ${escapeHTML(updatedLabel)}</span>
            <span><strong>Reading time:</strong> ${escapeHTML(readingTimeLabel)}</span>
            <span><strong>Threat level:</strong> ${escapeHTML(threatLevelLabel)}</span>
        `;

        rawLinkEl.href = markdownUrl;
        downloadLinkEl.href = markdownUrl;
        downloadLinkEl.setAttribute("download", `${edition.replace("/", "-")}.md`);

        cardEl.innerHTML = html;

        cardEl.querySelectorAll("img").forEach((img) => {
            if (!img.getAttribute("alt")) {
                img.setAttribute("alt", "Security Weekly illustration");
            }
        });

        tocEl.querySelectorAll("a").forEach((link) => {
            link.addEventListener("click", (event) => {
                event.preventDefault();
                const target = document.querySelector(link.getAttribute("href"));
                if (target) {
                    target.scrollIntoView({ behavior: "smooth", block: "start" });
                }
            });
        });
    }

    loadReport();
})();