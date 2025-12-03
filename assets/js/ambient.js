const AmbientController = {
    orbs: [],
    heroTitle: null,
    mouseX: 0.5,
    mouseY: 0.5,
    targetX: 0.5,
    targetY: 0.5,
    isActive: true,
    scrollY: 0,
    glowPhase: 0,
    config: {
        smoothing: 0.06,
        influence: 120,
        scrollInfluence: 0.15,
        parallaxLayers: [0.4, 0.6, 0.8, 0.5],
        glowColors: [
            { r: 110, g: 200, b: 212 },  // cyan
            { r: 168, g: 139, b: 215 },  // purple
            { r: 212, g: 136, b: 170 },  // magenta
            { r: 106, g: 159, b: 228 },  // blue
        ],
        glowSpeed: 0.003,
    },
    init() {
        this.orbs = document.querySelectorAll('.ambient-orb');
        this.heroTitle = document.querySelector('.hero__title');
        if (this.orbs.length === 0) {
            console.warn('⚠️ No ambient orbs found');
            return;
        }
        this.bindEvents();
        this.animate();
        console.log(`✨ Ambient orbs activated: ${this.orbs.length} orbs found`);
    },
    bindEvents() {
        document.addEventListener('mousemove', (e) => {
            this.targetX = e.clientX / window.innerWidth;
            this.targetY = e.clientY / window.innerHeight;
        });
        document.addEventListener('touchmove', (e) => {
            if (e.touches.length > 0) {
                this.targetX = e.touches[0].clientX / window.innerWidth;
                this.targetY = e.touches[0].clientY / window.innerHeight;
            }
        }, { passive: true });
        window.addEventListener('scroll', () => {
            this.scrollY = window.scrollY;
        }, { passive: true });
        document.addEventListener('visibilitychange', () => {
            this.isActive = !document.hidden;
        });
        document.addEventListener('mouseenter', () => {
            this.setOrbIntensity(1.2);
        });
        document.addEventListener('mouseleave', () => {
            this.setOrbIntensity(1);
            this.targetX = 0.5;
            this.targetY = 0.5;
        });
    },
    setOrbIntensity(multiplier) {
        this.orbs.forEach(orb => {
            orb.style.transition = 'opacity 0.5s ease';
            const baseOpacity = 0.5;
            orb.style.opacity = Math.min(baseOpacity * multiplier, 0.7);
        });
    },
    updateTitleGlow() {
        if (!this.heroTitle) return;
        
        this.glowPhase += this.config.glowSpeed;
        const colors = this.config.glowColors;
        
        const colorIndex = this.glowPhase % colors.length;
        const currentIndex = Math.floor(colorIndex);
        const nextIndex = (currentIndex + 1) % colors.length;
        const blend = colorIndex - currentIndex;
        
        const primary = {
            r: colors[currentIndex].r + (colors[nextIndex].r - colors[currentIndex].r) * blend,
            g: colors[currentIndex].g + (colors[nextIndex].g - colors[currentIndex].g) * blend,
            b: colors[currentIndex].b + (colors[nextIndex].b - colors[currentIndex].b) * blend,
        };
        
        const secondaryIndex = (currentIndex + 2) % colors.length;
        const secondary = colors[secondaryIndex];
        
        const glowIntensity = 0.3 + Math.sin(this.glowPhase * 2) * 0.1;
        const secondaryIntensity = 0.2 + Math.cos(this.glowPhase * 1.5) * 0.08;
        
        this.heroTitle.style.textShadow = `
            0 0 40px rgba(${primary.r}, ${primary.g}, ${primary.b}, ${glowIntensity}),
            0 0 80px rgba(${secondary.r}, ${secondary.g}, ${secondary.b}, ${secondaryIntensity}),
            0 0 120px rgba(${primary.r}, ${primary.g}, ${primary.b}, ${glowIntensity * 0.5}),
            0 4px 12px rgba(0, 0, 0, 0.15)
        `;
        
        this.heroTitle.style.filter = `drop-shadow(0 0 25px rgba(${primary.r}, ${primary.g}, ${primary.b}, 0.15))`;
    },
    animate() {
        if (!this.isActive) {
            requestAnimationFrame(() => this.animate());
            return;
        }
        this.mouseX += (this.targetX - this.mouseX) * this.config.smoothing;
        this.mouseY += (this.targetY - this.mouseY) * this.config.smoothing;
        const offsetX = this.mouseX - 0.5;
        const offsetY = this.mouseY - 0.5;
        this.orbs.forEach((orb, index) => {
            const parallax = this.config.parallaxLayers[index] || 0.5;
            const influence = this.config.influence;
            const moveX = offsetX * influence * parallax;
            const moveY = offsetY * influence * parallax;
            const scrollOffset = this.scrollY * this.config.scrollInfluence * parallax;
            orb.style.setProperty('--mouse-x', `${moveX}px`);
            orb.style.setProperty('--mouse-y', `${moveY - scrollOffset}px`);
        });
        
        this.updateTitleGlow();
        
        requestAnimationFrame(() => this.animate());
    }
};
document.addEventListener('componentsLoaded', () => {
    AmbientController.init();
});
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        if (AmbientController.orbs.length === 0) {
            AmbientController.init();
        }
    }, 100);
});
