/*
==========================================================
Rodrigo Tripa Portfolio
security.js
==========================================================
*/

document.addEventListener("DOMContentLoaded", () => {

    /*
    ==========================================================
    Elements
    ==========================================================
    */

    const latestReport = document.getElementById("latest-report");
    const archiveContainer = document.getElementById("archive-container");

    if (!latestReport || !archiveContainer) {
        return;
    }

    /*
    ==========================================================
    State
    ==========================================================
    */

    let archive = [];

    /*
    ==========================================================
    Helpers
    ==========================================================
    */

    function escapeHTML(value) {

        if (value === null || value === undefined) {
            return "";
        }

        return String(value)
            .replaceAll("&", "&amp;")
            .replaceAll("<", "&lt;")
            .replaceAll(">", "&gt;")
            .replaceAll('"', "&quot;")
            .replaceAll("'", "&#39;");

    }

    function formatDate(value) {

        if (!value) {
            return "—";
        }

        const date = new Date(value);

        if (Number.isNaN(date.getTime())) {
            return escapeHTML(value);
        }

        return new Intl.DateTimeFormat("en-GB", {
            year: "numeric",
            month: "short",
            day: "2-digit"
        }).format(date);

    }

    function formatWeek(week) {

        if (week === null || week === undefined || week === "") {
            return "—";
        }

        const num = Number(week);

        if (Number.isNaN(num)) {
            return escapeHTML(week);
        }

        return `Week ${String(num).padStart(2, "0")}`;

    }

    function formatEdition(edition) {

        if (edition === null || edition === undefined || edition === "") {
            return "—";
        }

        const num = Number(edition);

        if (Number.isNaN(num)) {
            return escapeHTML(edition);
        }

        return `#${String(num).padStart(3, "0")}`;

    }

    function getReportUrl(entry) {

        return entry.url || entry.href || entry.path || "#";

    }

    function getReportTitle(entry) {

        return entry.title || `Security Weekly ${formatEdition(entry.edition)}`;

    }

    function getSummary(entry) {

        return entry.summary || entry.excerpt || "No summary available.";

    }

    function getThreatLevel(entry) {

        return entry.threatLevel || entry.threat_level || "Moderate";

    }

    function getReadingTime(entry) {

        if (entry.readingTime !== undefined && entry.readingTime !== null) {
            return `${entry.readingTime} min`;
        }

        if (entry.reading_time !== undefined && entry.reading_time !== null) {
            return `${entry.reading_time} min`;
        }

        return "—";

    }

    function getReportDate(entry) {

        return entry.published || entry.date || entry.releaseDate || null;

    }

    function sortArchive(items) {

        return [...items].sort((a, b) => {

            const dateA = getReportDate(a) ? new Date(getReportDate(a)).getTime() : 0;
            const dateB = getReportDate(b) ? new Date(getReportDate(b)).getTime() : 0;

            if (dateA !== dateB) {
                return dateB - dateA;
            }

            const editionA = Number(a.edition || 0);
            const editionB = Number(b.edition || 0);

            return editionB - editionA;

        });

    }

    function sanitizePath(path) {

        if (!path || path === "#") {
            return "#";
        }

        return String(path).trim();

    }

    function threatLevelLabel(level) {

        const normalized = String(level || "Moderate").toLowerCase();

        if (normalized.includes("critical")) return "Critical";
        if (normalized.includes("high")) return "High";
        if (normalized.includes("low")) return "Low";
        return "Moderate";

    }

    /*
    ==========================================================
    Load Archive
    ==========================================================
    */

    async function loadArchive() {

        try {

            const response = await fetch("/security/archive.json");

            if (!response.ok) {
                throw new Error(`Unable to load archive.json (${response.status})`);
            }

            const data = await response.json();

            if (!Array.isArray(data)) {
                throw new Error("Archive data must be an array.");
            }

            archive = sortArchive(data);

            renderLatestEdition();
            renderArchive();

        }

        catch (error) {

            console.error("Security Weekly:", error);

            latestReport.innerHTML = `
                <p>
                    Unable to load the latest report right now.
                </p>
            `;

            archiveContainer.innerHTML = `
                <p>
                    Unable to load the archive right now.
                </p>
            `;

        }

    }

    /*
    ==========================================================
    Render Latest Edition
    ==========================================================
    */

    function renderLatestEdition() {

        if (!archive.length) {

            latestReport.innerHTML = `
                <div class="edition-header">
                    <span class="edition-number">No editions yet</span>
                </div>

                <h3>
                    Nothing published yet.
                </h3>

                <p>
                    The first Security Weekly report will appear here once it
                    is published.
                </p>
            `;

            return;

        }

        const latest = archive[0];
        const url = sanitizePath(getReportUrl(latest));
        const title = escapeHTML(getReportTitle(latest));
        const summary = escapeHTML(getSummary(latest));
        const edition = escapeHTML(formatEdition(latest.edition));
        const week = escapeHTML(formatWeek(latest.week));
        const year = escapeHTML(latest.year || new Date(getReportDate(latest) || Date.now()).getFullYear());
        const published = escapeHTML(formatDate(getReportDate(latest)));
        const threatLevel = escapeHTML(threatLevelLabel(getThreatLevel(latest)));
        const readingTime = escapeHTML(getReadingTime(latest));

        latestReport.innerHTML = `
            <div class="edition-header">
                <span class="edition-number">Edition ${edition}</span>
                <span class="edition-date">${week} • ${year}</span>
            </div>

            <h3>
                ${title}
            </h3>

            <p>
                ${summary}
            </p>

            <div class="edition-meta">
                <span>Published ${published}</span>
                <span>${readingTime}</span>
                <span>Threat Level: ${threatLevel}</span>
            </div>

            <a
                href="${url}"
                class="btn btn-primary">
                Read Report →
            </a>
        `;

    }

    /*
    ==========================================================
    Render Archive
    ==========================================================
    */

    function renderArchive() {

        if (!archive.length) {

            archiveContainer.innerHTML = `
                <p>
                    No reports published yet.
                </p>
            `;

            return;

        }

        const groupedByYear = new Map();

        archive.forEach(entry => {

            const year = String(entry.year || new Date(getReportDate(entry) || Date.now()).getFullYear());

            if (!groupedByYear.has(year)) {
                groupedByYear.set(year, []);
            }

            groupedByYear.get(year).push(entry);

        });

        const years = Array.from(groupedByYear.keys())
            .sort((a, b) => Number(b) - Number(a));

        archiveContainer.innerHTML = years.map(year => {

            const items = groupedByYear.get(year);

            const cards = items.map(entry => {
                const url = sanitizePath(getReportUrl(entry));
                const title = escapeHTML(getReportTitle(entry));
                const summary = escapeHTML(getSummary(entry));
                const edition = escapeHTML(formatEdition(entry.edition));
                const week = escapeHTML(formatWeek(entry.week));
                const published = escapeHTML(formatDate(getReportDate(entry)));
                const threatLevel = escapeHTML(threatLevelLabel(getThreatLevel(entry)));

                return `
                    <article class="archive-card">
                        <div>
                            <span class="edition">
                                ${edition}
                            </span>

                            <h3>
                                ${title}
                            </h3>

                            <p>
                                ${week} • ${published}
                            </p>

                            <p>
                                ${summary}
                            </p>

                            <p>
                                Threat Level: ${threatLevel}
                            </p>
                        </div>

                        <a
                            href="${url}"
                            class="archive-link">
                            Read
                        </a>
                    </article>
                `;
            }).join("");

            return `
                <section class="archive-year">
                    <div class="section-header">
                        <span class="section-tag">
                            ${escapeHTML(year)}
                        </span>

                        <h3>
                            ${escapeHTML(year)}
                        </h3>
                    </div>

                    <div class="archive-year-grid">
                        ${cards}
                    </div>
                </section>
            `;

        }).join("");

    }

    /*
    ==========================================================
    Initialize
    ==========================================================
    */

    loadArchive();

});