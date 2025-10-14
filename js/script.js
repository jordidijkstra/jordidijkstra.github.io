
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
            link.addEventListener('click', function(e) {
                navLinks.classList.remove('open');
                hamburger.classList.remove('open');
                body.classList.remove('menu-open');
                
                // Handle sticky section navigation
                const href = this.getAttribute('href');
                if (href && href.startsWith('#')) {
                    e.preventDefault();
                    navigateToSection(href);
                }
            });
        });
    }
    
    // Sticky section navigation function
    function navigateToSection(targetId) {
        const targetSection = document.querySelector(targetId);
        if (!targetSection) return;
        
        if (window.innerWidth >= 769) {
            // For sticky sections on tablets/desktop
            // Use a simple index-based approach for sticky sections
            const sections = ['header', '#about', '#skills', '#projects', '#contact'];
            const sectionIndex = sections.indexOf(targetId);
            
            if (sectionIndex !== -1) {
                // Scroll to the section by calculating viewport heights
                const scrollPosition = sectionIndex * window.innerHeight;
                container.scrollTo({
                    top: scrollPosition,
                    behavior: 'smooth'
                });
            }
        } else {
            // Normal scroll for mobile
            container.scrollTo({
                top: targetSection.offsetTop - 60,
                behavior: 'smooth'
            });
        }
    }
    
    // Add navigation to CTA button as well
    const ctaButton = document.querySelector('.cta');
    if (ctaButton) {
        ctaButton.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href && href.startsWith('#')) {
                e.preventDefault();
                navigateToSection(href);
            }
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
        
        // Check welke projecten geanimeerd moeten worden op basis van fiets positie
        checkProjectAnimations(bikeTop);
    }
    
    function checkProjectAnimations(bikeTop) {
        const projectItems = document.querySelectorAll('.project-item');
        
        projectItems.forEach(item => {
            const itemRect = item.getBoundingClientRect();
            const containerRect = container.getBoundingClientRect();
            
            // Bereken de absolute positie van het project binnen de container
            const itemTop = itemRect.top - containerRect.top + container.scrollTop;
            const itemBottom = itemTop + itemRect.height;
            const itemCenter = itemTop + (itemRect.height / 2);
            
            // Bereken fiets positie relatief tot de container
            const bikeAbsoluteTop = bikeTop + container.scrollTop;
            
            // Animatie start wanneer fiets het project bereikt, stopt wanneer fiets voorbij is
            if (bikeAbsoluteTop >= itemTop && bikeAbsoluteTop <= itemBottom) {
                item.classList.add('animate-in');
            } else {
                item.classList.remove('animate-in');
            }
        });
    }
    container.addEventListener('scroll', moveBike);
    window.addEventListener('resize', moveBike);
    moveBike();
    
    // Skills Carousel Functionality
    const skillsTrack = document.getElementById('skillsTrack');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const dots = document.querySelectorAll('.dot');
    const slides = document.querySelectorAll('.carousel-slide');
    
    let currentSlide = 0;
    const totalSlides = slides.length;
    
    function updateCarousel() {
        // Move track
        const translateX = -currentSlide * (100 / totalSlides);
        skillsTrack.style.transform = `translateX(${translateX}%)`;
        
        // Update dots
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentSlide);
        });
        
        // Update slides
        slides.forEach((slide, index) => {
            slide.classList.toggle('active', index === currentSlide);
        });
        
        // Update button states
        prevBtn.disabled = currentSlide === 0;
        nextBtn.disabled = currentSlide === totalSlides - 1;
    }
    
   
    
    function nextSlide() {
        if (currentSlide < totalSlides - 1) {
            currentSlide++;
            updateCarousel();
        }
    }
    
    function prevSlide() {
        if (currentSlide > 0) {
            currentSlide--;
            updateCarousel();
        }
    }
    
    function goToSlide(slideIndex) {
        currentSlide = slideIndex;
        updateCarousel();
    }
    
    // Event listeners
    nextBtn.addEventListener('click', nextSlide);
    prevBtn.addEventListener('click', prevSlide);
    
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => goToSlide(index));
    });
    
    // Auto-play carousel
    let autoPlayInterval;
    
    function startAutoPlay() {
        autoPlayInterval = setInterval(() => {
            if (currentSlide < totalSlides - 1) {
                nextSlide();
            } else {
                currentSlide = 0;
                updateCarousel();
            }
        }, 5000); // Change slide every 5 seconds
    }
    
    function stopAutoPlay() {
        clearInterval(autoPlayInterval);
    }
    
    // Pause auto-play on hover
    const carousel = document.querySelector('.skills-carousel');
    if (carousel) {
        carousel.addEventListener('mouseenter', stopAutoPlay);
        carousel.addEventListener('mouseleave', startAutoPlay);
        
        // Start auto-play initially
        startAutoPlay();
    }
    
    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (e.key === 'ArrowLeft') {
            prevSlide();
        } else if (e.key === 'ArrowRight') {
            nextSlide();
        }
    });
    
    // Initialize carousel
    updateCarousel();
});
