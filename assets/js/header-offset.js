(function () {

    const header = document.querySelector(".header");

    if (!header) return;

    function syncHeaderHeight() {

        const height = header.offsetHeight;

        document.documentElement.style.setProperty("--header-height", `${height}px`);

    }

    syncHeaderHeight();

    // O header pode mudar de altura (ex: nav a quebrar linha em ecrãs
    // estreitos), por isso reavaliamos sempre que o layout mudar.
    window.addEventListener("resize", syncHeaderHeight);
    window.addEventListener("load", syncHeaderHeight);

    if (window.ResizeObserver) {
        new ResizeObserver(syncHeaderHeight).observe(header);
    }

})();
