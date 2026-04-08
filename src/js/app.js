/**
 * CLUEV — точка входа фронтенда.
 * Секции ниже изолированы по ответственности для читаемости и тестируемости.
 */

function isWebp() {
    const testWebp = (callback) => {
        const webP = new Image();
        webP.onload = webP.onerror = () => callback(webP.height === 2);
        webP.src =
            'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';
    };

    testWebp((support) => {
        const className = support ? 'webp' : 'no-webp';
        document.documentElement.classList.add(className);
    });
}

/**
 * Плавный скролл по якорям с учётом prefers-reduced-motion.
 */
function initSmoothAnchors() {
    const prefersReduced =
        typeof window.matchMedia === 'function' &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReduced) {
        return;
    }

    document.addEventListener('click', (event) => {
        const link = event.target.closest('a[href^="#"]');
        if (!link || link.getAttribute('href') === '#') {
            return;
        }

        const id = link.getAttribute('href').slice(1);
        const target = id ? document.getElementById(id) : document.documentElement;
        if (!target) {
            return;
        }

        event.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
}

isWebp();

function initJewelrySwiper() {
    if (typeof Swiper === 'undefined') {
        return;
    }

    const el = document.querySelector('.jewelry__products-swiper');
    if (!el) {
        return;
    }

    const next = el.querySelector('.swiper-button-next');
    const prev = el.querySelector('.swiper-button-prev');

    new Swiper(el, {
        slidesPerView: 'auto',
        watchSlidesProgress: true,
        spaceBetween: 15,
        navigation: {
            nextEl: next,
            prevEl: prev,
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    initSmoothAnchors();
    initJewelrySwiper();
});

const header = document.querySelector('.header');
const header__inner = document.querySelector('.header__inner');
const heroSection = document.querySelector('section:first-of-type');

const headerHeight = header.offsetHeight;
const sectionHeight = heroSection.offsetHeight;

window.addEventListener('scroll', () => {    
    // Если прокрутка больше 50 пикселей (или высоты первого экрана)
    if (window.scrollY > sectionHeight - headerHeight) {
        header.classList.add('header--scrolled');
        header__inner.classList.add('header--scrolled-inner')
    } else {
        header.classList.remove('header--scrolled');
        header__inner.classList.remove('header--scrolled-inner')
    }
});


// jewelry section animation 

/*const jewelrySection = document.querySelector('.jewelry');
const jewelrySlides = jewelrySection
    ? jewelrySection.querySelectorAll('.swiper-slide')
    : [];

window.addEventListener('scroll', () => {
    if (!jewelrySection) {
        return;
    }

    const rect = jewelrySection.getBoundingClientRect();
    let progress = (window.innerHeight - rect.top) / (window.innerHeight + rect.height)    ;
    progress = progress * 2;
    progress = Math.min(Math.max(progress, 0), 1);

    // ADD OPTIMIZATIO

    const containerScaleX = 0.8 + (0.2 * progress);
    jewelrySection.style.transform = `scaleX(${containerScaleX})`;

    const compensationScale = 1 / containerScaleX;

    

    jewelrySlides.forEach (item =>{
        const endScaleX = Number(item.dataset.widthEndScale);
        const endScaleY = Number(item.dataset.heightEndScale);

        const currentScaleX = compensationScale * (1 + (endScaleX - 1) * (progress));
        const currentScaleY = 1 + (endScaleY - 1) * (progress);

        item.style.transform = `scale(${currentScaleX}, ${currentScaleY})`;
    });

    // const currentScaleSectionX = 0.78 + (1 - 0.78) * (progress);

    // jewelrySection.style.transform = `scaleX(${currentScaleSectionX})`;
});
*/
document.addEventListener('DOMContentLoaded', () => {
    const switchButtons = document.querySelectorAll('.service-controls__switch-button-text');
    const contentBlocks = document.querySelectorAll('.service-controls__content');

    switchButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetId = button.getAttribute('data-target');

            // 1. Удаляем активный класс у всех кнопок
            switchButtons.forEach(btn => btn.classList.remove('active'));
            
            // 2. Удаляем активный класс у всех блоков контента
            contentBlocks.forEach(content => content.classList.remove('active'));

            // 3. Добавляем активный класс текущей кнопке
            button.classList.add('active');

            // 4. Находим целевой блок по ID и делаем его активным
            const targetContent = document.getElementById(targetId);
            if (targetContent) {
                targetContent.classList.add('active');
            }
        });
    });
});

const sideMenu = {
    el: document.querySelector('.js-side-menu'),
    overlay: document.querySelector('.js-menu-overlay'),
    sub: document.querySelector('.js-side-submenu'),
    panes: document.querySelectorAll('.js-sub-pane'),
    leaveTimeout: null,

    toggleMain(state) {
        this.el.classList.toggle('is-active', state);
        this.overlay.classList.toggle('is-active', state);
        document.documentElement.classList.toggle('is-locked', state);
        document.body.classList.toggle('is-locked', state);
        if (!state) this.closeSub(0);
    },

    openSub(id) {
        clearTimeout(this.leaveTimeout);
        this.panes.forEach((p) => p.classList.remove('active'));
        document.querySelectorAll('.js-sub-trigger').forEach((t) => {
            t.classList.toggle('is-active', t.dataset.target === id);
        });
        const target = document.getElementById(id);
        if (target) {
            target.classList.add('active');
            this.sub.classList.add('is-visible');
        }
    },

    closeSub(delay = 500) {
        clearTimeout(this.leaveTimeout);
        this.leaveTimeout = setTimeout(() => {
            this.sub.classList.remove('is-visible');
            document.querySelectorAll('.js-sub-trigger').forEach((t) => t.classList.remove('is-active'));
        }, delay);
    },

    init() {
        document.addEventListener('click', e => {
            if (e.target.closest('.js-menu-open')) this.toggleMain(true);
            if (e.target.closest('.js-menu-close') || e.target === this.overlay) this.toggleMain(false);
        });

        const triggers = document.querySelectorAll('.js-sub-trigger');
        triggers.forEach(trigger => {
            trigger.addEventListener('mouseenter', () => this.openSub(trigger.dataset.target));
            trigger.addEventListener('mouseleave', () => this.closeSub());
        });

        this.sub.addEventListener('mouseenter', () => clearTimeout(this.leaveTimeout));
        this.sub.addEventListener('mouseleave', () => this.closeSub());

        const mainLinks = this.el.querySelectorAll(
            '.side-menu__main .side-menu__link:not(.js-sub-trigger)'
        );
        mainLinks.forEach((link) => {
            link.addEventListener('mouseenter', () => this.closeSub(0));
        });

        document.addEventListener('keydown', e => {
            if (e.key === 'Escape') this.toggleMain(false);
        });
    }
};

sideMenu.init();