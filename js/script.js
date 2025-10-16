
document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const menuOverlay = document.querySelector('.menu-overlay');
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
        
        // Close menu when clicking overlay
        if (menuOverlay) {
            menuOverlay.addEventListener('click', function() {
                navLinks.classList.remove('open');
                hamburger.classList.remove('open');
                body.classList.remove('menu-open');
            });
        }
        
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
    
    let lastScrollTop = 0;
    
    function moveBike() {
        const scrollTop = container.scrollTop;
        const footer = document.querySelector('footer');
        const footerHeight = footer ? footer.offsetHeight : 0;
        const docHeight = container.scrollHeight - container.clientHeight - footerHeight;
        // percentage scroll tussen 0 en 1
        const scrollPercent = Math.min(scrollTop / docHeight, 1);
        // maximale verplaatsing: container hoogte - bike hoogte - start offset - footer
        const bikeHeight = bike.offsetHeight;
        const startOffset = 75;
        const maxTop = container.clientHeight - bikeHeight - startOffset - footerHeight;
        // positie fiets op basis van scrollpercentage
        const bikeTop = startOffset + scrollPercent * maxTop;
        bike.style.top = `${bikeTop}px`;
        bikeTrack.style.height = `${bikeTop-28}px`;
        
        // Detecteer scroll richting en draai de fiets
        if (scrollTop === 0) {
            // Top van de pagina - fiets wijst naar beneden
            bike.style.transform = 'rotate(90deg) scaleY(-1)';
        } else if (scrollTop >= docHeight) {
            // Bottom van de pagina - fiets wijst naar boven
            bike.style.transform = 'rotate(270deg) scaleY(1)';
        } else if (scrollTop > lastScrollTop) {
            // Scroll naar beneden - fiets wijst naar beneden
            bike.style.transform = 'rotate(90deg) scaleY(-1)';
        } else if (scrollTop < lastScrollTop) {
            // Scroll naar boven - fiets wijst naar boven
            bike.style.transform = 'rotate(270deg) scaleY(1)';
        }
        lastScrollTop = scrollTop;
        
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
    
    // Update active navigation link based on scroll position
    function updateActiveNavLink() {
        const sections = document.querySelectorAll('section, header');
        const navItems = document.querySelectorAll('.nav-links li');
        
        
        let currentSection = 'home';
        
        // Loop through sections from top to bottom
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;

            const scrollPosition = container.scrollTop + sectionHeight; // Small offset from top
            
            // If we've scrolled past the start of this section
            if (scrollPosition >= sectionTop) {
                // Check if it's header or get the id
                if (section.tagName.toLowerCase() === 'header') {
                    currentSection = 'home';
                } else {
                    const sectionId = section.getAttribute('id');
                    if (sectionId) {
                        currentSection = sectionId;
                    }
                }
            }
        });
        
        // Update active class on nav items
        navItems.forEach(item => {
            const link = item.querySelector('a');
            if (!link) return;
            
            const href = link.getAttribute('href');
            
            item.classList.remove('active');
            
            // Match the current section
            if ((href === '#' && currentSection === 'home') || href === '#' + currentSection) {
                item.classList.add('active');
            }
        });
    }
    
    container.addEventListener('scroll', updateActiveNavLink);
    updateActiveNavLink(); // Initial call
    
    // Skills Carousel Functionality
    const skillsTrack = document.getElementById('skillsTrack');
    const dots = document.querySelectorAll('.dot');
    const slides = document.querySelectorAll('.carousel-slide');
    
    let currentSlide = 1; // Start at index 1 (first real slide, after clone)
    const totalSlides = slides.length; // 5 slides total (clone, 3 real, clone)
    const realSlidesCount = 3; // Number of actual content slides
    let isTransitioning = false;
    
    function updateCarousel(instant = false) {
        // Disable transition for instant jumps
        if (instant) {
            skillsTrack.style.transition = 'none';
        } else {
            skillsTrack.style.transition = 'transform 0.4s ease-in-out';
        }
        
        // Move track
        const translateX = -currentSlide * (100 / totalSlides);
        skillsTrack.style.transform = `translateX(${translateX}%)`;
        
        // Update dots based on real slide index (0-2)
        // Map carousel position to real slide: 0->2, 1->0, 2->1, 3->2, 4->0
        let realIndex;
        if (currentSlide === 0) {
            realIndex = 2; // Clone of last slide
        } else if (currentSlide === 4) {
            realIndex = 0; // Clone of first slide
        } else {
            realIndex = currentSlide - 1; // Real slides are at indices 1, 2, 3
        }
        
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === realIndex);
        });
        
        // Update slides
        slides.forEach((slide, index) => {
            slide.classList.toggle('active', index === currentSlide);
        });
        
        // Force reflow if instant
        if (instant) {
            skillsTrack.offsetHeight; // Trigger reflow
        }
    }
    
    function nextSlide() {
        if (isTransitioning) return;
        isTransitioning = true;
        
        currentSlide++;
        updateCarousel(false);
        
        // Check if we reached the clone at the end (index 4 = clone of first slide)
        if (currentSlide === totalSlides - 1) {
            // After transition ends, jump to the real first slide
            setTimeout(() => {
                currentSlide = 1;
                updateCarousel(true);
                isTransitioning = false;
            }, 400); // Match transition duration
        } else {
            setTimeout(() => {
                isTransitioning = false;
            }, 400);
        }
    }
    
    function prevSlide() {
        if (isTransitioning) return;
        isTransitioning = true;
        
        currentSlide--;
        updateCarousel(false);
        
        // Check if we reached the clone at the beginning (index 0 = clone of last slide)
        if (currentSlide === 0) {
            // After transition ends, jump to the real last slide (index 3)
            setTimeout(() => {
                currentSlide = 3;
                updateCarousel(true);
                isTransitioning = false;
            }, 400); // Match transition duration
        } else {
            setTimeout(() => {
                isTransitioning = false;
            }, 400);
        }
    }
    
    function goToSlide(slideIndex) {
        if (isTransitioning) return;
        // Map real slide index (0-2) to carousel index (1-3)
        currentSlide = slideIndex + 1;
        updateCarousel(false);
    }
    
    // Event listeners for dots
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => goToSlide(index));
    });
    
    // Touch/Swipe functionality for mobile and tablet
    let startX = 0;
    let startY = 0;
    let distX = 0;
    let distY = 0;
    let threshold = 50; // Minimum swipe distance
    let restraint = 100; // Maximum vertical distance for horizontal swipe
    
    const carouselContainer = document.querySelector('.carousel-container');
    
    if (carouselContainer) {
        // Touch start
        carouselContainer.addEventListener('touchstart', function(e) {
            const touchObj = e.changedTouches[0];
            startX = touchObj.pageX;
            startY = touchObj.pageY;
        }, false);
        
        // Touch end
        carouselContainer.addEventListener('touchend', function(e) {
            const touchObj = e.changedTouches[0];
            distX = touchObj.pageX - startX; // Horizontal distance
            distY = touchObj.pageY - startY; // Vertical distance
            
            // Check if swipe is valid (horizontal and long enough)
            if (Math.abs(distX) >= threshold && Math.abs(distY) <= restraint) {
                if (distX > 0) {
                    // Swipe right - previous slide
                    prevSlide();
                } else {
                    // Swipe left - next slide
                    nextSlide();
                }
            }
        }, false);
        
        // Prevent default touch behavior to avoid scrolling conflicts
        carouselContainer.addEventListener('touchmove', function(e) {
            e.preventDefault();
        }, { passive: false });
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
