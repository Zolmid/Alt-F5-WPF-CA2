(function () {
    'use strict';
    const CounterAnimation = {
        config: {
            duration: 2000,
            threshold: 0.3
        },
        easeOutExpo: (t) => t === 1 ? 1 : 1 - Math.pow(2, -10 * t),
        init: function () {
            this.counters = document.querySelectorAll('[data-counter]');
            if (this.counters.length === 0) return;
            this.setupObserver();
        },
        setupObserver: function () {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting && !entry.target.dataset.animated) {
                        entry.target.dataset.animated = 'true';
                        this.animateCounter(entry.target);
                    }
                });
            }, { threshold: this.config.threshold });
            this.counters.forEach(counter => observer.observe(counter));
        },
        animateCounter: function (element) {
            const target = parseFloat(element.dataset.target) || 0;
            const decimals = parseInt(element.dataset.decimals) || 0;
            const prefix = element.dataset.prefix || '';
            const suffix = element.dataset.suffix || '';
            const duration = this.config.duration;
            let startTime = null;
            let lastBounceTime = 0;
            const bounceInterval = 150;
            element.classList.add('counter-animating');
            const animate = (currentTime) => {
                if (!startTime) startTime = currentTime;
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                const easedProgress = this.easeOutExpo(progress);
                const currentValue = easedProgress * target;
                element.textContent = prefix + currentValue.toFixed(decimals) + suffix;
                if (progress < 1) {
                    if (currentTime - lastBounceTime > bounceInterval) {
                        lastBounceTime = currentTime;
                        const bounceScale = 1 + (0.03 * (1 - progress));
                        element.style.transform = `scale(${bounceScale})`;
                        requestAnimationFrame(() => {
                            element.style.transform = 'scale(1)';
                        });
                    }
                    requestAnimationFrame(animate);
                } else {
                    element.textContent = prefix + target.toFixed(decimals) + suffix;
                    element.classList.remove('counter-animating');
                    element.classList.add('counter-complete');
                }
            };
            requestAnimationFrame(animate);
        }
    };
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => CounterAnimation.init());
    } else {
        CounterAnimation.init();
    }
    document.addEventListener('componentsLoaded', () => CounterAnimation.init());
})();
