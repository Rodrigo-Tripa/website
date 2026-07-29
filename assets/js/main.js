/*
==========================================================
Rodrigo Tripa Portfolio
main.js - Optimized & Refactored
==========================================================
*/

document.addEventListener("DOMContentLoaded", () => {

    /* ==========================================================
       1. Seleção de Elementos Principais
       ========================================================== */
    const header = document.querySelector(".header");
    const menuToggle = document.querySelector(".menu-toggle");
    const navbar = document.querySelector(".navbar");
    const navLinks = document.querySelectorAll('.nav-links a');
    const backToTop = document.getElementById("back-to-top");
    const sections = document.querySelectorAll("section");
    const revealElements = document.querySelectorAll(
        ".hero, .section-header, .project-card, .about-content, .contact-card, .footer"
    );

    /* ==========================================================
       2. Handlers de Scroll Otimizados (requestAnimationFrame)
       ========================================================== */
    let isScrolling = false;

    function handleScrollEvents() {
        const scrollY = window.scrollY;

        // Otimização Header Scroll Effect
        if (header) {
            if (scrollY > 50) {
                header.style.background = "rgba(5, 5, 5, 0.95)";
                header.style.borderBottomColor = "#2b2b2b";
            } else {
                header.style.background = "rgba(5, 5, 5, 0.80)";
                header.style.borderBottomColor = "#1f1f1f";
            }
        }

        // Otimização Back To Top
        if (backToTop) {
            if (scrollY > 500) {
                backToTop.classList.add("show");
            } else {
                backToTop.classList.remove("show");
            }
        }

        // Active Navigation Link no Scroll (para One-Page)
        updateActiveSection(scrollY);

        isScrolling = false;
    }

    window.addEventListener("scroll", () => {
        if (!isScrolling) {
            window.requestAnimationFrame(handleScrollEvents);
            isScrolling = true;
        }
    }, { passive: true });

    // Chamada inicial para definir estados de scroll ao carregar
    handleScrollEvents();

    /* ==========================================================
       3. Back To Top Action
       ========================================================== */
    backToTop?.addEventListener("click", () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    });

    /* ==========================================================
       4. Active Navigation & Smooth Scroll
       ========================================================== */

    function updateActiveSection(scrollY) {
        if (sections.length === 0) return;

        let currentId = "";

        sections.forEach(section => {
            const top = section.offsetTop - 160;
            const height = section.offsetHeight;

            if (scrollY >= top && scrollY < top + height) {
                currentId = section.getAttribute("id");
            }
        });

        navLinks.forEach(link => {
            const href = link.getAttribute("href");
            if (href && href.startsWith("#")) {
                if (href === "#" + currentId) {
                    link.classList.add("active");
                } else {
                    link.classList.remove("active");
                }
            }
        });
    }

    navLinks.forEach(link => {
        link.addEventListener("click", e => {
            const href = link.getAttribute("href");

            if (!href || !href.startsWith("#")) return;

            e.preventDefault();
            const target = document.querySelector(href);

            if (!target) return;

            target.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });

            closeMobileMenu();
        });
    });

    /* ==========================================================
       5. Mobile Menu Controller
       ========================================================== */
    function closeMobileMenu() {
        navbar?.classList.remove("active");
        menuToggle?.classList.remove("active");
        document.body.style.overflow = ""; // Reativa o scroll do body
    }

    function toggleMobileMenu() {
        const isActive = navbar?.classList.toggle("active");
        menuToggle?.classList.toggle("active");
        
        // Bloqueia o scroll do fundo se o menu estiver aberto
        document.body.style.overflow = isActive ? "hidden" : "";
    }

    menuToggle?.addEventListener("click", toggleMobileMenu);

    /* ==========================================================
       6. IntersectionObserver (Reveal Animation)
       ========================================================== */
    if (revealElements.length > 0) {
        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("show");
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.12,
            rootMargin: "0px 0px -30px 0px"
        });

        revealElements.forEach(element => {
            element.classList.add("reveal");
            revealObserver.observe(element);
        });
    }

    /* ==========================================================
       7. Otimização de Imagens (Fade-in ao carregar)
       ========================================================== */
    document.querySelectorAll("img").forEach(img => {
        if (img.complete) {
            img.classList.add("loaded");
        } else {
            img.addEventListener("load", () => {
                img.classList.add("loaded");
            }, { once: true });
        }
    });

    /* ==========================================================
       8. Mouse Glow (Com RAF para Otimização de CPU)
       ========================================================== */
    let ticking = false;

    window.addEventListener("mousemove", (event) => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                document.documentElement.style.setProperty("--mouse-x", `${event.clientX}px`);
                document.documentElement.style.setProperty("--mouse-y", `${event.clientY}px`);
                ticking = false;
            });
            ticking = true;
        }
    }, { passive: true });

    /* ==========================================================
       9. Acessibilidade (Teclado & Prevenção de Links Vazios)
       ========================================================== */
    document.addEventListener("keydown", event => {
        if (event.key === "Escape") {
            closeMobileMenu();
        }
    });

    document.querySelectorAll('a[href="#"]').forEach(link => {
        link.addEventListener("click", e => {
            e.preventDefault();
        });
    });

    /* ==========================================================
       10. Console Signature
       ========================================================== */
    console.log(
        "%c Rodrigo Tripa %c Cybersecurity & Security Research ",
        "background: #111; color: #38d26b; font-weight: bold; padding: 4px 8px; border-radius: 4px 0 0 4px; border: 1px solid #38d26b;",
        "background: #38d26b; color: #000; font-weight: bold; padding: 4px 8px; border-radius: 0 4px 4px 0;"
    );

});