/* ============================================================
   PROJECTS PAGE JAVASCRIPT (projects.js)
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
       2. Reveal on Scroll com Efeito Cascata (Stagger)
       ------------------------------------------------------------ */
    const initScrollReveal = () => {
        const selector = '.featured-project, .project-card, .project-stat, .open-source-content';
        const elements = document.querySelectorAll(selector);

        if (elements.length === 0) return;

        const observer = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-revealed');
                    obs.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.12,
            rootMargin: '0px 0px -40px 0px'
        });

        elements.forEach((el, index) => {
            el.classList.add('js-reveal');
            // Atraso staggered baseado no índice dos elementos irmão
            const siblingIndex = Array.from(el.parentNode.children).indexOf(el);
            el.style.transitionDelay = `${(siblingIndex % 4) * 0.08}s`;
            observer.observe(el);
        });
    };

    /* ------------------------------------------------------------
       3. Efeito 3D Tilt & Spotlight Seguindo o Cursor
       ------------------------------------------------------------ */
    const initTiltAndSpotlight = () => {
        // Desativa em ecrãs touch para otimização de performance
        if (window.matchMedia('(pointer: coarse)').matches) return;

        const cards = document.querySelectorAll('.project-card, .featured-project, .project-stat');

        cards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;

                // Efeito Spotlight (Iluminação suave que segue o cursor)
                card.style.setProperty('--mouse-x', `${x}px`);
                card.style.setProperty('--mouse-y', `${y}px`);

                // Efeito 3D Tilt
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                const rotateX = (-(y - centerY) / centerY) * 5; // Limite de 5 graus
                const rotateY = ((x - centerX) / centerX) * 5;

                card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-4px)`;
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
                card.style.removeProperty('--mouse-x');
                card.style.removeProperty('--mouse-y');
            });
        });
    };

    /* ------------------------------------------------------------
       4. Animação de Contagem dos Números das Estatísticas
       ------------------------------------------------------------ */
    const initStatCounters = () => {
        const statHeadings = document.querySelectorAll('.project-stat h3');

        if (statHeadings.length === 0) return;

        const countObserver = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const el = entry.target;
                    const originalText = el.textContent.trim();
                    const numericValue = parseInt(originalText.replace(/\D/g, ''), 10);

                    // Se não for um número finito (ex: o símbolo ∞), ignora a contagem
                    if (isNaN(numericValue) || numericValue === 0) {
                        obs.unobserve(el);
                        return;
                    }

                    const hasPlus = originalText.includes('+');
                    const hasPercent = originalText.includes('%');
                    const duration = 1200; // 1.2 segundos
                    const frameDuration = 1000 / 60;
                    const totalFrames = Math.round(duration / frameDuration);
                    let frame = 0;

                    const counter = setInterval(() => {
                        frame++;
                        // Função de suavização (easeOutQuad)
                        const progress = frame / totalFrames;
                        const currentCount = Math.round(numericValue * (1 - Math.pow(1 - progress, 2)));

                        let output = currentCount.toString();
                        if (hasPercent) output += '%';
                        if (hasPlus) output += '+';

                        el.textContent = output;

                        if (frame === totalFrames) {
                            el.textContent = originalText;
                            clearInterval(counter);
                        }
                    }, frameDuration);

                    obs.unobserve(el);
                }
            });
        }, { threshold: 0.5 });

        statHeadings.forEach(h3 => countObserver.observe(h3));
    };

    /* ------------------------------------------------------------
       Inicializador
       ------------------------------------------------------------ */
    initScrollProgress();
    initScrollReveal();
    initTiltAndSpotlight();
    initStatCounters();

});