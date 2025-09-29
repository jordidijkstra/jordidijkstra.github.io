
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
        
        // Sluit menu wanneer er op een navigatielink wordt geklikt
        const navLinksElements = navLinks.querySelectorAll('a');
        navLinksElements.forEach(link => {
            link.addEventListener('click', function() {
                navLinks.classList.remove('open');
                hamburger.classList.remove('open');
                body.classList.remove('menu-open');
            });
        });
    }
    
    // Project items klikbaar maken
    const projectItems = document.querySelectorAll('.project-item[data-url]');
    projectItems.forEach(item => {
        item.addEventListener('click', function() {
            const url = this.getAttribute('data-url');
            if (url && url !== '#') {
                window.open(url, '_blank');
            }
        });
        
        // Voeg cursor pointer toe voor visuele feedback
        item.style.cursor = 'pointer';
    });
    
    function moveBike() {
        const scrollTop = container.scrollTop;
        const footer = document.querySelector('footer');
        const footerHeight = footer ? footer.offsetHeight : 0;
        const docHeight = container.scrollHeight - container.clientHeight - footerHeight;
        // percentage scroll tussen 0 en 1
        const scrollPercent = Math.min(scrollTop / docHeight, 1);
        // maximale verplaatsing: container hoogte - bike hoogte - start offset - footer
        const bikeHeight = bike.offsetHeight;
        const startOffset = 60;
        const maxTop = container.clientHeight - bikeHeight - startOffset - footerHeight;
        // positie fiets op basis van scrollpercentage
        const bikeTop = startOffset + scrollPercent * maxTop;
        bike.style.top = `${bikeTop}px`;
        bikeTrack.style.height = `${bikeTop-18}px`;
    }
    container.addEventListener('scroll', moveBike);
    window.addEventListener('resize', moveBike);
    moveBike();
});
