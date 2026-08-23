(function () {

    const markdownPanel = document.getElementById("markdown-panel");
    const sidebar = document.getElementById("info-sidebar");
    const backdrop = document.getElementById("panel-backdrop");

    const btnNotes = document.getElementById("mobile-toggle-notes");
    const btnInfo = document.getElementById("mobile-toggle-info");

    const btnCloseNotes = document.getElementById("close-markdown");
    const btnCloseSidebar = document.getElementById("close-sidebar");

    function isMobile() {
        return window.matchMedia("(max-width: 760px)").matches;
    }

    function closeAll() {
        markdownPanel.classList.remove("mobile-open");
        sidebar.classList.remove("mobile-open");

        backdrop.classList.remove("is-visible");

        btnNotes.classList.remove("is-active");
        btnInfo.classList.remove("is-active");
    }

    function openMarkdown() {
        if (!isMobile()) return;

        sidebar.classList.remove("mobile-open");
        btnInfo.classList.remove("is-active");

        markdownPanel.classList.remove("hidden");
        markdownPanel.classList.add("mobile-open");

        btnNotes.classList.add("is-active");

        backdrop.classList.add("is-visible");
    }

    function openSidebar() {
        if (!isMobile()) return;

        markdownPanel.classList.remove("mobile-open");
        btnNotes.classList.remove("is-active");

        sidebar.classList.add("mobile-open");

        btnInfo.classList.add("is-active");

        backdrop.classList.add("is-visible");
    }

    function toggleMarkdown() {
        if (!isMobile()) return;

        if (markdownPanel.classList.contains("mobile-open")) {
            closeAll();
            return;
        }

        openMarkdown();
    }

    function toggleSidebar() {
        if (!isMobile()) return;

        if (sidebar.classList.contains("mobile-open")) {
            closeAll();
            return;
        }

        openSidebar();
    }

    btnNotes.addEventListener("click", toggleMarkdown);
    btnInfo.addEventListener("click", toggleSidebar);

    btnCloseNotes.addEventListener("click", closeAll);
    btnCloseSidebar.addEventListener("click", closeAll);

    backdrop.addEventListener("click", closeAll);

    window.addEventListener("resize", () => {

        if (!isMobile()) {
            closeAll();
        }

    });

})();