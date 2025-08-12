
document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const container = document.querySelector('.parallax-container');
    const bike = document.getElementById('bike');
    const bikeTrack = document.getElementById('bike-track');
    const body = document.body;
    if (hamburger && navLinks) {
        hamburger.addEventListener('click', function() {
            navLinks.classList.toggle('open');
            hamburger.classList.toggle('open');
            body.classList.toggle('menu-open', navLinks.classList.contains('open'));
        });
    }
    function moveBike() {
        const scrollTop = container.scrollTop;
        const footer = document.querySelector('footer');
        const footerHeight = footer ? footer.offsetHeight : 0;
        const docHeight = container.scrollHeight - container.clientHeight - footerHeight;
        // percentage scroll tussen 0 en 1
        const scrollPercent = Math.min(scrollTop / docHeight, 1);
        // maximale verplaatsing: container hoogte - bike hoogte - start offset - footer
        const bikeHeight = bike.offsetHeight;
        const startOffset = 80;
        const maxTop = container.clientHeight - bikeHeight - startOffset - footerHeight;
        // positie fiets op basis van scrollpercentage
        const bikeTop = startOffset + scrollPercent * maxTop;
        bike.style.top = `${bikeTop}px`;
        bikeTrack.style.height = `${bikeTop}px`;
    }
    container.addEventListener('scroll', moveBike);
    window.addEventListener('resize', moveBike);
    moveBike();
});
