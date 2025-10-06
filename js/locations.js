/**
 * Kingdom Come: Deliverance II - Сторінка локацій
 * Відповідає за інтерактивність сторінки з картами
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
    initializeMapInteractions();
    initializeAnimations();
    console.log('KCD II Locations - сторінка завантажена');
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

// ===== ВЗАЄМОДІЯ З КАРТАМИ =====
function initializeMapInteractions() {
    // Основна карта Куттенберга
    const mainMap = document.getElementById('mainMap');
    if (mainMap) {
        mainMap.addEventListener('click', function() {
            // Додаємо ефект кліку
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = '';
                // Перехід на сторінку Куттенберга
                window.location.href = 'kuttenberg.html';
            }, 150);
        });

        // Додаємо підказку при наведенні
        mainMap.addEventListener('mouseenter', function() {
            this.style.cursor = 'pointer';
            this.style.borderColor = 'rgba(212, 175, 55, 0.6)';
        });

        mainMap.addEventListener('mouseleave', function() {
            this.style.borderColor = 'rgba(139, 69, 19, 0.3)';
        });
    }

    // Галерея карт
    const galleryItems = document.querySelectorAll('.gallery-item');
    galleryItems.forEach((item, index) => {
        item.addEventListener('click', function(e) {
            e.preventDefault();

            // Ефект кліку
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = '';

                // Отримуємо назву локації
                const img = this.querySelector('img');
                const locationName = img ? img.alt : 'Невідома локація';

                // Показуємо інформацію про локацію
                showLocationInfo(locationName, index);
            }, 150);
        });

        // Плавна поява інформації
        item.addEventListener('mouseenter', function() {
            const overlay = this.querySelector('.info-overlay');
            if (overlay) {
                overlay.style.transition = 'transform 0.3s ease';
            }
        });

        // Ефект при наведенні
        item.addEventListener('mouseenter', function() {
            this.style.cursor = 'pointer';
            const img = this.querySelector('img');
            if (img) {
                img.style.filter = 'brightness(1.15) contrast(1.1)';
            }
        });

        item.addEventListener('mouseleave', function() {
            const img = this.querySelector('img');
            if (img) {
                img.style.filter = 'brightness(1) contrast(1)';
            }
        });
    });
}

// ===== ПОКАЗ ІНФОРМАЦІЇ ПРО ЛОКАЦІЮ =====
function showLocationInfo(locationName, index) {
    // Створюємо модальне вікно
    const modal = document.createElement('div');
    modal.className = 'location-modal';
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.9);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 2000;
        opacity: 0;
        transition: opacity 0.3s ease;
    `;

    // Контент модального вікна
    const modalContent = document.createElement('div');
    modalContent.className = 'modal-content';
    modalContent.style.cssText = `
        background: rgba(43, 34, 24, 0.95);
        padding: 2rem;
        border-radius: 15px;
        max-width: 500px;
        text-align: center;
        border: 2px solid #8B4513;
        position: relative;
        transform: scale(0.9);
        transition: transform 0.3s ease;
    `;

    // Заголовок
    const title = document.createElement('h3');
    title.textContent = locationName;
    title.style.cssText = `
        color: #D4AF37;
        margin-bottom: 1rem;
        font-size: 1.5rem;
        text-shadow: 2px 2px 4px rgba(0,0,0,0.8);
    `;

    // Опис локації
    const description = document.createElement('p');
    description.textContent = getLocationDescription(index);
    description.style.cssText = `
        color: #F5E6D3;
        line-height: 1.6;
        margin-bottom: 1.5rem;
        font-size: 1.1rem;
    `;

    // Кнопка закриття
    const closeButton = document.createElement('button');
    closeButton.textContent = 'Закрити';
    closeButton.style.cssText = `
        background: linear-gradient(135deg, #8B4513, #D4AF37);
        color: #F5E6D3;
        border: none;
        padding: 0.8rem 2rem;
        border-radius: 8px;
        cursor: pointer;
        font-size: 1rem;
        transition: all 0.3s ease;
        border: 1px solid #5D4037;
    `;

    closeButton.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-2px)';
        this.style.boxShadow = '0 5px 15px rgba(212, 175, 55, 0.4)';
    });

    closeButton.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0)';
        this.style.boxShadow = 'none';
    });

    closeButton.addEventListener('click', function() {
        modal.style.opacity = '0';
        setTimeout(() => {
            if (modal.parentNode) {
                modal.parentNode.removeChild(modal);
            }
        }, 300);
    });

    // Збираємо модальне вікно
    modalContent.appendChild(title);
    modalContent.appendChild(description);
    modalContent.appendChild(closeButton);
    modal.appendChild(modalContent);
    document.body.appendChild(modal);

    // Анімація появи
    setTimeout(() => {
        modal.style.opacity = '1';
        modalContent.style.transform = 'scale(1)';
    }, 10);

    // Закриття по кліку на фон
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.style.opacity = '0';
            setTimeout(() => {
                if (modal.parentNode) {
                    modal.parentNode.removeChild(modal);
                }
            }, 300);
        }
    });

    // Закриття по ESC
    const handleKeydown = (e) => {
        if (e.key === 'Escape') {
            modal.style.opacity = '0';
            setTimeout(() => {
                if (modal.parentNode) {
                    modal.parentNode.removeChild(modal);
                }
                document.removeEventListener('keydown', handleKeydown);
            }, 300);
        }
    };
    document.addEventListener('keydown', handleKeydown);
}

// ===== ОПИСИ ЛОКАЦІЙ =====
function getLocationDescription(index) {
    const descriptions = [
        "Табір кочівників розташований у віддаленій місцевості. Тут можна знайти рідкісні ресурси, торгувати з кочівниками та отримати унікальні квести.",
        "Желєйов — невелике ремісниче містечко, відоме своїми майстрами ковальської справи. Ідеальне місце для поліпшення обладунків та зброї.",
        "Замок Троски — могутня середньовічна фортеця, що височить на пагорбі. Тут відбуваються ключові сюжетні події та лицарські турніри.",
        "Диявольське лігвище — небезпечна територія, населена розбійниками та дикими звірами. Тільки найвправніші воїни ризикують заходити сюди.",
        "Тахов — мирне містечко з розвиненим фермерством. Місцеві жителі завжди раді допомогти мандрівникам та поділитися провізією.",
        "Сучдоль — торгове село на перехресті шляхів. Тут можна знайти унікальні товари та отримати інформацію про навколишні території.",
        "Табір Сигізмунда — військовий штаб королівських військ. Стратегічно важлива локація для участі у великих битвах.",
        "Семін — мальовниче містечко з невеликим замком. Відмінне місце для відпочинку та поповнення запасів.",
        "Стара Кутна — історичний район з унікальною архітектурою. Тут зберігаються давні секрети та легенди.",
        "Місковіц — затишне поселення поблизу Куттенберга. Місцеві мешканці спеціалізуються на лісівництві та полюванні.",
        "Малесов — сільськогосподарський центр регіону. Великі ферми та родючі землі забезпечують продухами весь регіон.",
        "Хоршан — стратегічно розташоване місто з потужними укріпленнями. Ключовий пункт оборони королівства.",
        "Грунд — невелике, але дуже затишне поселення. Місцеві мешканці відомі своєю гостинністю.",
        "Богуновіц — торгове село з розвиненою інфраструктурою. Ідеальне місце для початкових торгів."
    ];

    return descriptions[index] || "Ця локація ще не має детального опису. Досліджуйте її самі, щоб дізнатися більше!";
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

                // Додаткова анімація для елементів галереї
                if (entry.target.classList.contains('gallery-item')) {
                    animateGalleryItem(entry.target);
                }
            }
        });
    }, observerOptions);

    // Спостерігаємо за всіма елементами, що потребують анімації
    const animatedElements = document.querySelectorAll('.fade-in, .gallery-item');
    animatedElements.forEach(element => {
        state.observer.observe(element);
    });
}

// Анімація елементів галереї
function animateGalleryItem(item) {
    const delay = Array.from(document.querySelectorAll('.gallery-item')).indexOf(item) * 100;
    setTimeout(() => {
        item.style.opacity = '1';
        item.style.transform = 'translateY(0)';
    }, delay);
}

// ===== ОПТИМІЗАЦІЯ ЗОБРАЖЕНЬ =====
function preloadImages() {
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        // Додаємо loading="lazy" для оптимізації завантаження
        if (!img.hasAttribute('loading')) {
            img.setAttribute('loading', 'lazy');
        }
    });
}

// ===== ОБРОБКА ПОМИЛОК =====
window.addEventListener('error', function(e) {
    console.error('Помилка на сторінці локацій:', e.error);
});

// Виклик функції попереднього завантаження
setTimeout(preloadImages, 1000);