(function () {

    const markdownPanel = document.getElementById("markdown-panel");
    const sidebar = document.getElementById("info-sidebar");
    const backdrop = document.getElementById("panel-backdrop");
    const nodeInfo = document.getElementById("node-info");

    const btnNotes = document.getElementById("mobile-toggle-notes");
    const btnInfo = document.getElementById("mobile-toggle-info");
    const btnCloseNotes = document.getElementById("close-markdown");
    const btnCloseSidebar = document.getElementById("close-sidebar");

    function isMobile() {
        return window.matchMedia("(max-width: 760px)").matches;
    }

    function closeAll() {
        markdownPanel.classList.remove("mobile-open");
        markdownPanel.classList.add("hidden");
        sidebar.classList.remove("mobile-open");
        backdrop.classList.remove("is-visible");
    }

    function openMarkdown() {
        if (!isMobile()) return;
        sidebar.classList.remove("mobile-open");
        markdownPanel.classList.remove("hidden");
        markdownPanel.classList.add("mobile-open");
        backdrop.classList.add("is-visible");
    }

    function openSidebar() {
        if (!isMobile()) return;
        markdownPanel.classList.remove("mobile-open");
        sidebar.classList.add("mobile-open");
        backdrop.classList.add("is-visible");
    }

    btnNotes.addEventListener("click", openMarkdown);
    btnInfo.addEventListener("click", openSidebar);
    btnCloseNotes.addEventListener("click", closeAll);
    btnCloseSidebar.addEventListener("click", closeAll);
    backdrop.addEventListener("click", closeAll);

    // Caso 1: clique num nó "note" -> ui.js chama setPanelState(true/false),
    // que alterna a classe "hidden" no #markdown-panel. Espelhamos isso
    // no drawer mobile.
    const markdownObserver = new MutationObserver(() => {

        if (!isMobile()) return;

        if (markdownPanel.classList.contains("hidden")) {
            markdownPanel.classList.remove("mobile-open");
            if (!sidebar.classList.contains("mobile-open")) {
                backdrop.classList.remove("is-visible");
            }
        } else {
            openMarkdown();
        }

    });
    markdownObserver.observe(markdownPanel, { attributes: true, attributeFilter: ["class"] });

    // Caso 2: clique num nó "folder"/"root" -> ui.js só reescreve o
    // #node-info via renderSidebar(), sem mexer no markdown-panel.
    // Abrimos o bottom sheet automaticamente, exceto quando o drawer
    // de notas está a abrir para o mesmo clique (nesse caso o markdown
    // tem prioridade).
    const nodeInfoObserver = new MutationObserver(() => {

        if (!isMobile()) return;

        const title = nodeInfo.querySelector(".sidebar-title");
        const hasSelection = title && title.textContent.trim() !== "No node selected";

        if (hasSelection && !markdownPanel.classList.contains("mobile-open")) {
            openSidebar();
        }

    });
    nodeInfoObserver.observe(nodeInfo, { childList: true });

    // Clicar fora de um nó (params.nodes.length === 0) faz o ui.js
    // chamar clearSidebar() + setPanelState(false) -> ambos os
    // observers acima já tratam de fechar os painéis nesse caso.

    window.addEventListener("resize", () => {
        if (!isMobile()) closeAll();
    });

})();
