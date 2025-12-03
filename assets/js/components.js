(function () {
    'use strict';
    const ComponentLoader = {
        templates: {
            'ambient-background': `<div class="ambient-canvas" aria-hidden="true">
            <div class="ambient-orb ambient-orb--cyan"></div>
            <div class="ambient-orb ambient-orb--purple"></div>
            <div class="ambient-orb ambient-orb--magenta"></div>
            <div class="ambient-orb ambient-orb--blue"></div>
            </div>`,
            'footer': `<footer class="footer">
            <p>© 2025 Alt+F5 Group. Web Programming Fundamentals Project.</p>
            </footer>`,
            'nav-dock': `<nav class="nav-dock" role="navigation" aria-label="Main navigation">
            <a href="index.html" class="nav-dock__link" data-page="home"><span>Home</span></a>
            <a href="applications.html" class="nav-dock__link" data-page="applications"><span>Apps</span></a>
            <a href="machine-learning.html" class="nav-dock__link" data-page="machine-learning"><span>ML</span></a>
            <a href="nlp.html" class="nav-dock__link" data-page="nlp"><span>NLP</span></a>
            <a href="history.html" class="nav-dock__link" data-page="history"><span>History</span></a>
            <a href="enquiry.html" class="nav-dock__link" data-page="enquiry"><span>Enquiry</span></a>
            </nav>`
        },
        init: function () {
            this.loadAllComponents();
        },
        loadAllComponents: function () {
            const elements = document.querySelectorAll('[data-component]');
            elements.forEach(element => {
                const name = element.getAttribute('data-component');
                const template = this.templates[name];
                if (template) {
                    element.outerHTML = template;
                } else {
                    console.error(`Component not found: ${name}`);
                }
            });
            this.initializeActiveStates();
            document.dispatchEvent(new CustomEvent('componentsLoaded'));
        },
        initializeActiveStates: function () {
            const navDock = document.querySelector('.nav-dock');
            if (!navDock) return;
            const filename = window.location.pathname.split('/').pop();
            const pageMap = {
                'index.html': 'home',
                '': 'home',
                'applications.html': 'applications',
                'machine-learning.html': 'machine-learning',
                'nlp.html': 'nlp',
                'history.html': 'history',
                'enquiry.html': 'enquiry',
                'success.html': 'success'
            };
            const currentPage = pageMap[filename] || 'home';
            navDock.querySelectorAll('.nav-dock__link').forEach(link => {
                if (link.getAttribute('data-page') === currentPage) {
                    link.classList.add('nav-dock__link--active');
                }
            });
        }
    };
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => ComponentLoader.init());
    } else {
        ComponentLoader.init();
    }
})();
