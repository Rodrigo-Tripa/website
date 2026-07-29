const info = document.getElementById("node-info");

// Metadata cache to avoid repeated API calls
const metadataCache = new Map();

// Track currently selected node in sidebar to avoid redundant updates
let currentSelectedNodeId = null;

function initializeUI(network, tree) {

    const main = document.getElementById("knowledge-main");
    const panel = document.getElementById("markdown-panel");
    const resizer = document.getElementById("panel-resizer");
    const markdownContent = document.getElementById("markdown-content");
    let panelWidth = 420;

    function setPanelState(isVisible) {

        main.classList.toggle("is-collapsed", !isVisible);
        panel.classList.toggle("hidden", !isVisible);
        resizer.classList.toggle("is-hidden", !isVisible);

        if (!isVisible) {
            markdownContent.innerHTML = "<p>Select a note...</p>";
            return;
        }

        main.style.setProperty("--markdown-width", `${panelWidth}px`);
    }

    function updatePanelWidth(width) {

        const clampedWidth = Math.min(Math.max(width, 320), 800);
        panelWidth = clampedWidth;
        main.style.setProperty("--markdown-width", `${clampedWidth}px`);

    }

    function countConnections(nodeId) {

        const edges = network.body.data.edges.get();

        return edges.filter((edge) => edge.from === nodeId || edge.to === nodeId).length;

    }

    function formatBytes(bytes) {

        if (bytes === null || bytes === undefined) {
            return "—";
        }

        const kb = bytes / 1024;
        return `${kb.toFixed(kb >= 10 ? 1 : 2)} KB`;

    }

    function formatDate(value) {

        if (!value) {
            return "—";
        }

        const date = new Date(value);

        if (Number.isNaN(date.getTime())) {
            return value;
        }

        return date.toLocaleDateString("en", {
            year: "numeric",
            month: "short",
            day: "numeric"
        });

    }

    function getNodeDisplayPath(node) {

        if (node.type === "note" && node.path) {
            return node.path;
        }

        if (!tree) {
            return node.label;
        }

        const pathSegments = findTreePath(tree, node.id);

        if (pathSegments && pathSegments.length > 0) {
            return pathSegments.join("/");
        }

        return node.label;
    }

    function findTreePath(current, targetId, segments = []) {

        if (!current) {
            return null;
        }

        if (current.id === targetId) {
            return segments;
        }

        if (!current.children || current.children.length === 0) {
            return null;
        }

        for (const child of current.children) {
            const result = findTreePath(child, targetId, [...segments, child.name]);

            if (result) {
                return result;
            }
        }

        return null;
    }

    function buildBreadcrumb(node) {

        const segments = node.type === "note" && node.path
            ? node.path.split("/")
            : getNodeDisplayPath(node).split("/");

        if (segments.length === 0) {
            return '<span class="sidebar-breadcrumb-root">Cyber Notes</span>';
        }

        const breadcrumbParts = segments.map((segment, index) => {
            const isLast = index === segments.length - 1;
            const icon = isLast
                ? (node.type === "note" ? "📄" : "📁")
                : "📁";

            return `<span class="sidebar-breadcrumb-item">${icon} ${segment}</span>`;
        });

        return `<span class="sidebar-breadcrumb-root">📁 Cyber-Notes</span>${breadcrumbParts.join("")}`;
    }

    function countFolderStats(folderNode) {

        let notes = 0;
        let subfolders = 0;
        let descendants = 0;

        function walk(node) {
            if (!node.children || node.children.length === 0) {
                notes += 1;
                descendants += 1;
                return;
            }

            subfolders += 1;
            node.children.forEach(walk);
        }

        if (tree && folderNode.id !== "root") {
            const foundNode = findTreeNode(tree, folderNode.id);
            if (foundNode) {
                walk(foundNode);
                return { notes, subfolders, descendants };
            }
        }

        return { notes: 0, subfolders: 0, descendants: 0 };
    }

    function findTreeNode(current, targetId) {

        if (!current) {
            return null;
        }

        if (current.id === targetId) {
            return current;
        }

        if (!current.children || current.children.length === 0) {
            return null;
        }

        for (const child of current.children) {
            const match = findTreeNode(child, targetId);
            if (match) {
                return match;
            }
        }

        return null;
    }

    function estimateReadingTime(words) {

        if (!words || words <= 0) {
            return "—";
        }

        const minutes = Math.max(1, Math.round(words / 200));
        return `${minutes} min`;
    }

    function countLines(markdown) {

        if (!markdown) {
            return "—";
        }

        return markdown.split(/\r?\n/).length;
    }

    function countWords(markdown) {

        if (!markdown) {
            return "—";
        }

        const words = markdown.trim().split(/\s+/).filter(Boolean);
        return words.length;
    }

    async function fetchNoteMetadata(path) {

        // Check cache first
        if (metadataCache.has(path)) {
            return metadataCache.get(path);
        }

        const encodedPath = path.split("/").map(encodeURIComponent).join("/");
        const metadataUrl = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${encodedPath}`;
        const commitUrl = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/commits?path=${encodedPath}&per_page=1`;

        const headers = typeof getGitHubHeaders === 'function' ? getGitHubHeaders() : {};

        let metadata = null;
        let lastUpdated = null;

        try {
            const metadataResponse = await fetch(metadataUrl, { headers });
            if (metadataResponse.ok) {
                metadata = await metadataResponse.json();
            }
        } catch (error) {
            console.warn("Unable to load GitHub metadata", error);
        }

        try {
            const commitResponse = await fetch(commitUrl, { headers });
            if (commitResponse.ok) {
                const commitData = await commitResponse.json();
                if (commitData && commitData[0] && commitData[0].commit) {
                    lastUpdated = commitData[0].commit.author?.date || commitData[0].commit.committer?.date;
                }
            }
        } catch (error) {
            console.warn("Unable to load GitHub commit history", error);
        }

        const result = {
            name: metadata?.name || path.split("/").pop(),
            path,
            sha: metadata?.sha ? metadata.sha.slice(0, 8) : "—",
            size: metadata?.size ?? null,
            lastUpdated,
            htmlUrl: metadata?.html_url || `https://github.com/${REPO_OWNER}/${REPO_NAME}/blob/${BRANCH}/${path}`,
            rawUrl: `https://raw.githubusercontent.com/${REPO_OWNER}/${REPO_NAME}/${BRANCH}/${path}`,
            downloadUrl: metadata?.download_url || `https://raw.githubusercontent.com/${REPO_OWNER}/${REPO_NAME}/${BRANCH}/${path}`
        };

        // Cache the result
        metadataCache.set(path, result);

        return result;
    }

    function renderNoteSidebar(node, details, markdown) {

        const lines = typeof markdown === "string" ? countLines(markdown) : "—";
        const words = typeof markdown === "string" ? countWords(markdown) : "—";
        const readingTime = typeof markdown === "string" ? estimateReadingTime(words) : "—";
        const connections = countConnections(node.id);

        info.innerHTML = `
            <div class="sidebar-card hero-card">
                <div class="sidebar-title">${node.label}</div>
                <div class="sidebar-subtitle">${node.type === "note" ? "Markdown Note" : "Folder"}</div>
            </div>

            <div class="sidebar-card">
                <div class="sidebar-section-title">Repository</div>
                <div class="sidebar-metrics-grid">
                    <div class="sidebar-metric">
                        <span>Name</span>
                        <strong>${node.label}</strong>
                    </div>
                    <div class="sidebar-metric">
                        <span>Type</span>
                        <strong>${node.type === "note" ? "Note" : "Folder"}</strong>
                    </div>
                    <div class="sidebar-metric">
                        <span>Path</span>
                        <strong>${getNodeDisplayPath(node)}</strong>
                    </div>
                    <div class="sidebar-metric">
                        <span>Connections</span>
                        <strong>${connections}</strong>
                    </div>
                </div>
            </div>

            <div class="sidebar-card">
                <div class="sidebar-section-title">Tree</div>
                <div class="sidebar-breadcrumb">${buildBreadcrumb(node)}</div>
            </div>

            <div class="sidebar-card">
                <div class="sidebar-section-title">Metadata</div>
                <div class="sidebar-metrics-grid">
                    <div class="sidebar-metric">
                        <span>Size</span>
                        <strong>${formatBytes(details?.size)}</strong>
                    </div>
                    <div class="sidebar-metric">
                        <span>Last Updated</span>
                        <strong>${formatDate(details?.lastUpdated)}</strong>
                    </div>
                    <div class="sidebar-metric">
                        <span>SHA</span>
                        <strong>${details?.sha || "—"}</strong>
                    </div>
                    <div class="sidebar-metric">
                        <span>Lines</span>
                        <strong>${lines}</strong>
                    </div>
                    <div class="sidebar-metric">
                        <span>Words</span>
                        <strong>${words}</strong>
                    </div>
                    <div class="sidebar-metric">
                        <span>Reading Time</span>
                        <strong>${readingTime}</strong>
                    </div>
                </div>
            </div>

            <div class="sidebar-card">
                <div class="sidebar-actions">
                    <a href="${details?.htmlUrl || "#"}" target="_blank" rel="noreferrer">Open on GitHub</a>
                    <a href="${details?.rawUrl || "#"}" target="_blank" rel="noreferrer">View Raw</a>
                    <a href="${details?.downloadUrl || "#"}" download="${details?.name || node.label}">Download Markdown</a>
                </div>
            </div>
        `;
    }

    function renderFolderSidebar(node) {

        const stats = countFolderStats(node);
        const connections = countConnections(node.id);
        const pathValue = getNodeDisplayPath(node);

        info.innerHTML = `
            <div class="sidebar-card hero-card">
                <div class="sidebar-title">${node.label}</div>
                <div class="sidebar-subtitle">Folder</div>
            </div>

            <div class="sidebar-card">
                <div class="sidebar-section-title">Repository</div>
                <div class="sidebar-metrics-grid">
                    <div class="sidebar-metric">
                        <span>Name</span>
                        <strong>${node.label}</strong>
                    </div>
                    <div class="sidebar-metric">
                        <span>Type</span>
                        <strong>Folder</strong>
                    </div>
                    <div class="sidebar-metric">
                        <span>Path</span>
                        <strong>${pathValue}</strong>
                    </div>
                    <div class="sidebar-metric">
                        <span>Connections</span>
                        <strong>${connections}</strong>
                    </div>
                </div>
            </div>

            <div class="sidebar-card">
                <div class="sidebar-section-title">Folder Summary</div>
                <div class="sidebar-metrics-grid">
                    <div class="sidebar-metric">
                        <span>Notes</span>
                        <strong>${stats.notes}</strong>
                    </div>
                    <div class="sidebar-metric">
                        <span>Subfolders</span>
                        <strong>${stats.subfolders}</strong>
                    </div>
                    <div class="sidebar-metric">
                        <span>Descendants</span>
                        <strong>${stats.descendants}</strong>
                    </div>
                </div>
            </div>

            <div class="sidebar-card">
                <div class="sidebar-section-title">Tree</div>
                <div class="sidebar-breadcrumb">${buildBreadcrumb(node)}</div>
            </div>
        `;
    }

    async function renderSidebar(node, markdown = null) {

        if (!node) {
            info.innerHTML = `
                <div class="sidebar-card hero-card">
                    <div class="sidebar-title">No node selected</div>
                    <div class="sidebar-subtitle">Click a node in the graph.</div>
                </div>
            `;
            return;
        }

        if (node.type === "note") {
            const details = await fetchNoteMetadata(node.path);
            renderNoteSidebar(node, details, markdown);
            return;
        }

        renderFolderSidebar(node);
    }

    window.updateSidebar = (node, markdown = null) => {
        renderSidebar(node, markdown);
    };

    window.clearSidebar = () => {
        info.innerHTML = `
            <div class="sidebar-card hero-card">
                <div class="sidebar-title">No node selected</div>
                <div class="sidebar-subtitle">Click a node in the graph.</div>
            </div>
        `;
    };

    resizer.addEventListener("mousedown", (event) => {

        if (main.classList.contains("is-collapsed")) {
            return;
        }

        event.preventDefault();

        const startX = event.clientX;
        const startWidth = panelWidth;

        resizer.classList.add("is-dragging");
        document.body.style.userSelect = "none";
        document.body.style.cursor = "ew-resize";

        const onMouseMove = (moveEvent) => {
            updatePanelWidth(startWidth + (moveEvent.clientX - startX));
        };

        const onMouseUp = () => {
            resizer.classList.remove("is-dragging");
            document.body.style.userSelect = "";
            document.body.style.cursor = "";
            document.removeEventListener("mousemove", onMouseMove);
            document.removeEventListener("mouseup", onMouseUp);
        };

        document.addEventListener("mousemove", onMouseMove);
        document.addEventListener("mouseup", onMouseUp);

    });

    setPanelState(false);
    clearSidebar();

    network.on("click", async (params) => {

        if (params.nodes.length === 0) {
            currentSelectedNodeId = null;
            clearSidebar();
            setPanelState(false);
            return;
        }

        const id = params.nodes[0];
        const node = network.body.data.nodes.get(id);

        // Only update sidebar if clicking a different node
        const nodeChanged = currentSelectedNodeId !== id;
        currentSelectedNodeId = id;

        if (node.type !== "note") {
            setPanelState(false);
            if (nodeChanged) {
                renderSidebar(node);
            }
            return;
        }

        setPanelState(true);
        const markdown = await fetchMarkdown(node.path);
        markdownContent.innerHTML = marked.parse(markdown);
        if (nodeChanged) {
            renderSidebar(node, markdown);
        }

    });

    network.on("doubleClick", (params) => {

        if (params.nodes.length === 0) {
            return;
        }

        const node = network.body.data.nodes.get(params.nodes[0]);

        window.open(
            `https://github.com/${REPO_OWNER}/${REPO_NAME}/blob/${BRANCH}/${node.path}`,
            "_blank"
        );

    });

}