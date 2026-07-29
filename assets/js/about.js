/* ============================================================
   ABOUT PAGE JAVASCRIPT (about.js)
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

    /* ------------------------------------------------------------
       1. Barra de Progresso de Scroll no Topo
       ------------------------------------------------------------ */
    const initScrollProgress = () => {
        const progressBar = document.createElement('div');
        progressBar.className = 'scroll-progress-bar';
        document.body.appendChild(progressBar);

        window.addEventListener('scroll', () => {
            const winScroll = document.documentElement.scrollTop;
            const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            if (height > 0) {
                const scrolled = (winScroll / height) * 100;
                progressBar.style.width = `${scrolled}%`;
            }
        }, { passive: true });
    };


    /* ------------------------------------------------------------
       2. Efeito de Digitação no Subtítulo (Terminal / Hacker Style)
       ------------------------------------------------------------ */
    const initTypingEffect = () => {
        const leadText = document.querySelector('.about-lead');
        if (!leadText) return;

        const fullText = leadText.textContent.trim();
        leadText.textContent = '';
        leadText.classList.add('typing-cursor');

        let index = 0;
        const typeChar = () => {
            if (index < fullText.length) {
                leadText.textContent += fullText.charAt(index);
                index++;
                setTimeout(typeChar, 35);
            }
        };

        // Pequeno atraso para iniciar suavemente após o carregamento
        setTimeout(typeChar, 300);
    };


    /* ------------------------------------------------------------
       3. Reveal On Scroll (Animação de Entrada Suave dos Cards)
       ------------------------------------------------------------ */
    const initScrollReveal = () => {
        const selector = '.about-focus-card, .about-tech-card, .about-goal-card, .timeline-item, .about-contact-card';
        const revealElements = document.querySelectorAll(selector);

        if (revealElements.length === 0) return;

        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-revealed');
                    // Para de observar depois de animar uma vez
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.12,
            rootMargin: '0px 0px -30px 0px'
        });

        revealElements.forEach((el, index) => {
            el.classList.add('reveal-on-scroll');
            // Atraso staggered (em cascata) para os cards em grelha
            el.style.transitionDelay = `${(index % 3) * 0.08}s`;
            revealObserver.observe(el);
        });
    };


    /* ------------------------------------------------------------
       4. Efeito 3D Tilt nos Cards (Seguir o Ponteiro do Rato)
       ------------------------------------------------------------ */
    const initTiltEffect = () => {
        // Desativa o efeito 3D em ecrãs touch/móveis para melhorar o desempenho
        if (window.matchMedia('(pointer: coarse)').matches) return;

        const cards = document.querySelectorAll('.about-focus-card, .about-tech-card, .about-goal-card, .about-contact-card');

        cards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;

                // Rotação máxima limitada a 7 graus
                const rotateX = (-y / (rect.height / 2)) * 7;
                const rotateY = (x / (rect.width / 2)) * 7;

                card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-3px)`;
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
            });
        });
    };


    /* ------------------------------------------------------------
       Inicializador Geral
       ------------------------------------------------------------ */
    initScrollProgress();
    initTypingEffect();
    initScrollReveal();
    initTiltEffect();

});