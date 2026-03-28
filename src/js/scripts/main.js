const header = document.querySelector('.header'); // Убедись, что у шапки класс .header

window.addEventListener('scroll', () => {    
    // Если прокрутка больше 50 пикселей (или высоты первого экрана)
    if (window.scrollY > 50) {
        header.classList.add('header--scrolled');
    } else {
        header.classList.remove('header--scrolled');
    }
});