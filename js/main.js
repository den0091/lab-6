/**
 * Kingdom Come: Deliverance II - Основний JavaScript
 * Відповідає за інтерактивність та анімації
 */

// Конфігурація
const CONFIG = {
    scrollThreshold: 100,
    throttleDelay: 100,
    animationOffset: 50
};

// Стан програми
let state = {
    lastScroll: 0,
    isThrottled: false,
    observer: null
};

// Ініціалізація при завантаженні сторінки
document.addEventListener('DOMContentLoaded', init);

function init() {
    initializeHeader();
    initializeAnimations();
    initializeSmoothScrolling();
    console.log('Kingdom Come: Deliverance II - сторінка завантажена');
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

    // Додаємо обробник з пасивним слухачем для кращої продуктивності
    window.addEventListener('scroll', handleScroll, { passive: true });
}

// ===== АНІМАЦІЇ ПРИ СКРОЛІ =====
function initializeAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: `0px 0px -${CONFIG.animationOffset}px 0px`
    };

    state.observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
            }
        });
    }, observerOptions);

    // Спостерігаємо за всіма елементами, що потребують анімації
    const animatedElements = document.querySelectorAll('.window, .feature-card, .footer');
    animatedElements.forEach(element => {
        state.observer.observe(element);
    });
}

// ===== ПЛАВНА ПРОКРУТКА =====
function initializeSmoothScrolling() {
    const navLinks = document.querySelectorAll('a[href^="#"]');

    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();

            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                const headerHeight = document.getElementById('mainHeader').offsetHeight;
                const targetPosition = targetElement.offsetTop - headerHeight - 20;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ===== ОПТИМІЗАЦІЯ ПРОДУКТИВНОСТІ =====
// Debounce функція для оптимізації скролу
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Throttle функція для оптимізації скролу
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

// ===== ОБРОБКА ПОМИЛОК =====
window.addEventListener('error', function(e) {
    console.error('Сталася помилка:', e.error);
});