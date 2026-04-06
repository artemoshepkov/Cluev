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

document.addEventListener('DOMContentLoaded', () => {
    initSmoothAnchors();
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