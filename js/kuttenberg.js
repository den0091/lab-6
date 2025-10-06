/**
 * Kingdom Come: Deliverance II - Сторінка Куттенберга
 * Відповідає за інтерактивність сторінки з основним містом
 */

// Конфігурація
const CONFIG = {
    scrollThreshold: 100,
    throttleDelay: 100
};

// Стан програми
let state = {
    lastScroll: 0,
    isThrottled: false
};

// Ініціалізація при завантаженні сторінки
document.addEventListener('DOMContentLoaded', init);

function init() {
    initializeHeader();
    initializeImageInteractions();
    initializeAnimations();
    console.log('KCD II Kuttenberg - сторінка завантажена');
}

// ===== УПРАВЛІННЯ ШАПКОЮ =====
function initializeHeader() {
    const header = document.getElementById('mainHeader');
    if (!header) return;

    const handleScroll = () => {
        if (state.isThrottled) return;

        const currentScroll = window.pageYOffset;

        if (currentScroll > state.lastScroll && currentScroll > CONFIG.scrollThreshold) {
            header.classList.add('hidden');
        } else {
            header.classList.remove('hidden');
        }

        state.lastScroll = currentScroll;
        state.isThrottled = true;

        setTimeout(() => {
            state.isThrottled = false;
        }, CONFIG.throttleDelay);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
}

// ===== ВЗАЄМОДІЯ З ЗОБРАЖЕННЯМ =====
function initializeImageInteractions() {
    const mainImage = document.getElementById('mainImage');
    const infoModal = document.getElementById('infoModal');
    const closeModal = document.getElementById('closeModal');

    if (mainImage) {
        mainImage.addEventListener('click', function() {
            infoModal.classList.add('active');
            document.body.style.overflow = 'hidden';
        });

        mainImage.addEventListener('mouseenter', function() {
            this.style.cursor = 'pointer';
        });
    }

    if (closeModal) {
        closeModal.addEventListener('click', function() {
            infoModal.classList.remove('active');
            document.body.style.overflow = 'auto';
        });
    }

    // Закриття модального вікна по кліку на фон
    if (infoModal) {
        infoModal.addEventListener('click', function(e) {
            if (e.target === this) {
                this.classList.remove('active');
                document.body.style.overflow = 'auto';
            }
        });
    }

    // Закриття по ESC
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && infoModal.classList.contains('active')) {
            infoModal.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    });
}

// ===== АНІМАЦІЇ ПРИ СКРОЛІ =====
function initializeAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
            }
        });
    }, observerOptions);

    // Спостерігаємо за всіма елементами, що потребують анімації
    const animatedElements = document.querySelectorAll('.fade-in');
    animatedElements.forEach(element => {
        observer.observe(element);
    });
}

// ===== ОБРОБКА ПОМИЛОК =====
window.addEventListener('error', function(e) {
    console.error('Помилка на сторінці Куттенберга:', e.error);
});