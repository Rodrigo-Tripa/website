/*
==========================================================
Rodrigo Tripa Portfolio
main.js
==========================================================
*/

document.addEventListener("DOMContentLoaded", () => {

    /*
    ==========================================================
    Elements
    ==========================================================
    */

    const header = document.querySelector(".header");

    const menuToggle = document.querySelector(".menu-toggle");

    const navbar = document.querySelector(".navbar");

    const navLinks = document.querySelectorAll('.nav-links a');

    const backToTop = document.getElementById("back-to-top");

    const revealElements = document.querySelectorAll(
        ".hero, .section-header, .project-card, .about-content, .contact-card, .footer"
    );

    /*
    ==========================================================
    Header Scroll Effect
    ==========================================================
    */

    function updateHeader() {

        if (window.scrollY > 50) {

            header.style.background = "rgba(5,5,5,.95)";
            header.style.borderBottomColor = "#2b2b2b";

        } else {

            header.style.background = "rgba(5,5,5,.80)";
            header.style.borderBottomColor = "#1f1f1f";

        }

    }

    window.addEventListener("scroll", updateHeader);

    updateHeader();

    /*
    ==========================================================
    Back To Top
    ==========================================================
    */

    function updateBackToTop() {

        if (window.scrollY > 500) {

            backToTop.classList.add("show");

        } else {

            backToTop.classList.remove("show");

        }

    }

    window.addEventListener("scroll", updateBackToTop);

    updateBackToTop();

    backToTop?.addEventListener("click", () => {

        window.scrollTo({

            top: 0,

            behavior: "smooth"

        });

    });

    /*
    ==========================================================
    Smooth Scroll
    ==========================================================
    */

    navLinks.forEach(link => {

        link.addEventListener("click", e => {

            const href = link.getAttribute("href");

            if (!href.startsWith("#")) return;

            e.preventDefault();

            const target = document.querySelector(href);

            if (!target) return;

            target.scrollIntoView({

                behavior: "smooth",
                block: "start"

            });

            navbar?.classList.remove("active");

        });

    });

    /*
    ==========================================================
    Mobile Menu
    ==========================================================
    */

    menuToggle?.addEventListener("click", () => {

        navbar.classList.toggle("active");

        menuToggle.classList.toggle("active");

    });

    /*
    ==========================================================
    Active Navigation
    ==========================================================
    */

    const sections = document.querySelectorAll("section");

    function updateActiveSection() {

        let current = "";

        sections.forEach(section => {

            const top = section.offsetTop - 150;

            const height = section.offsetHeight;

            if (window.scrollY >= top) {

                current = section.id;

            }

        });

        navLinks.forEach(link => {

            link.classList.remove("active");

            if (link.getAttribute("href") === "#" + current) {

                link.classList.add("active");

            }

        });

    }

    window.addEventListener("scroll", updateActiveSection);

    updateActiveSection();

    /*
    ==========================================================
    Reveal Animation
    ==========================================================
    */

    const observer = new IntersectionObserver((entries) => {

        entries.forEach(entry => {

            if (entry.isIntersecting) {

                entry.target.classList.add("show");

                observer.unobserve(entry.target);

            }

        });

    }, {

        threshold: 0.15

    });

    revealElements.forEach(element => {

        element.classList.add("reveal");

        observer.observe(element);

    });

    /*
    ==========================================================
    Keyboard Accessibility
    ==========================================================
    */

    document.addEventListener("keydown", event => {

        if (event.key === "Escape") {

            navbar?.classList.remove("active");

            menuToggle?.classList.remove("active");

        }

    });

    /*
    ==========================================================
    Prevent Empty Links
    ==========================================================
    */

    document.querySelectorAll("a").forEach(link => {

        if (link.getAttribute("href") === "#") {

            link.addEventListener("click", e => {

                e.preventDefault();

            });

        }

    });

    /*
    ==========================================================
    Image Fade In
    ==========================================================
    */

    document.querySelectorAll("img").forEach(img => {

        if (img.complete) {

            img.classList.add("loaded");

            return;

        }

        img.addEventListener("load", () => {

            img.classList.add("loaded");

        });

    });

    /*
    ==========================================================
    Console Signature
    ==========================================================
    */

    console.log(
        "%cRodrigoTripa.dev",
        "color:#ffffff;font-size:18px;font-weight:bold;"
    );

    console.log(
        "Designed & developed by Rodrigo Tripa."
    );

});