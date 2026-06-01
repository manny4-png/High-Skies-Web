/**
 * Modern University Design - JavaScript
 * High Skies College
 */

(function() {
    'use strict';

    // ===================================
    // Mobile Menu Toggle
    // ===================================
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const navMenu = document.getElementById('navMenu');
    const dropdownItems = document.querySelectorAll('.nav-item-dropdown');

    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            
            // Animate hamburger icon
            const spans = this.querySelectorAll('span');
            if (navMenu.classList.contains('active')) {
                spans[0].style.transform = 'rotate(45deg) translateY(8px)';
                spans[1].style.opacity = '0';
                spans[2].style.transform = 'rotate(-45deg) translateY(-8px)';
            } else {
                spans[0].style.transform = '';
                spans[1].style.opacity = '';
                spans[2].style.transform = '';
            }
        });
    }

    // Mobile dropdown toggle
    dropdownItems.forEach(item => {
        const link = item.querySelector('.nav-link');
        
        link.addEventListener('click', function(e) {
            if (window.innerWidth <= 768) {
                e.preventDefault();
                item.classList.toggle('active');
            }
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.nav-container') && navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
            if (mobileMenuToggle) {
                const spans = mobileMenuToggle.querySelectorAll('span');
                spans[0].style.transform = '';
                spans[1].style.opacity = '';
                spans[2].style.transform = '';
            }
        }
    });

    // ===================================
    // Header Scroll Effect
    // ===================================
    const mainHeader = document.getElementById('mainHeader');
    let lastScroll = 0;

    window.addEventListener('scroll', function() {
        const currentScroll = window.pageYOffset;

        // Add shadow on scroll
        if (currentScroll > 50) {
            mainHeader.classList.add('scrolled');
        } else {
            mainHeader.classList.remove('scrolled');
        }

        lastScroll = currentScroll;
    });

    // ===================================
    // Smooth Scroll for Anchor Links
    // ===================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href !== '#' && href !== '') {
                e.preventDefault();
                const target = document.querySelector(href);
                
                if (target) {
                    const headerOffset = 80;
                    const elementPosition = target.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });

                    // Close mobile menu if open
                    if (navMenu.classList.contains('active')) {
                        navMenu.classList.remove('active');
                    }
                }
            }
        });
    });

    // ===================================
    // Intersection Observer for Animations
    // ===================================
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe elements for fade-in animation
    document.querySelectorAll('.program-card, .feature-item, .accreditation-card').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });

    // ===================================
    // Active Navigation Link
    // ===================================
    function setActiveNavLink() {
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
            
            const href = link.getAttribute('href');
            if (href === currentPage || 
                (currentPage === '' && href === 'index.html') ||
                (currentPage === 'index.html' && href === 'index')) {
                link.classList.add('active');
            }
        });
    }

    setActiveNavLink();

    // ===================================
    // Counter Animation
    // ===================================
    function animateCounter(element, target, duration = 2000) {
        const start = 0;
        const increment = target / (duration / 16);
        let current = start;

        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                element.textContent = target + (element.dataset.suffix || '');
                clearInterval(timer);
            } else {
                element.textContent = Math.floor(current) + (element.dataset.suffix || '');
            }
        }, 16);
    }

    // Animate stats when in viewport
    const statsObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const number = entry.target.querySelector('.stat-number');
                if (number && !number.classList.contains('animated')) {
                    const text = number.textContent;
                    const value = parseInt(text.replace(/\D/g, ''));
                    const suffix = text.replace(/\d/g, '');
                    
                    number.dataset.suffix = suffix;
                    animateCounter(number, value);
                    number.classList.add('animated');
                }
            }
        });
    }, { threshold: 0.5 });

    document.querySelectorAll('.stat-item').forEach(stat => {
        statsObserver.observe(stat);
    });

    // ===================================
    // Parallax Effect for Hero
    // ===================================
    if (window.innerWidth > 768) {
        window.addEventListener('scroll', function() {
            const scrolled = window.pageYOffset;
            const activeSlide = document.querySelector('.slide.active .slide-image');
            
            if (activeSlide && scrolled < window.innerHeight) {
                activeSlide.style.transform = `translateY(${scrolled * 0.3}px) scale(1.08)`;
            }
        });
    }

    // ===================================
    // Programs Slideshow
    // ===================================
    let currentSlide = 0;
    const slides = document.querySelectorAll('.slide');
    const indicators = document.querySelectorAll('.indicator');
    const prevButton = document.querySelector('.prev-slide');
    const nextButton = document.querySelector('.next-slide');
    let slideInterval;

    function showSlide(index) {
        // Wrap around
        if (index >= slides.length) {
            currentSlide = 0;
        } else if (index < 0) {
            currentSlide = slides.length - 1;
        } else {
            currentSlide = index;
        }

        // Update slides
        slides.forEach((slide, i) => {
            slide.classList.remove('active');
            if (i === currentSlide) {
                slide.classList.add('active');
            }
        });

        // Update indicators
        indicators.forEach((indicator, i) => {
            indicator.classList.remove('active');
            if (i === currentSlide) {
                indicator.classList.add('active');
            }
        });
    }

    function nextSlide() {
        showSlide(currentSlide + 1);
    }

    function prevSlide() {
        showSlide(currentSlide - 1);
    }

    function startSlideshow() {
        slideInterval = setInterval(nextSlide, 5000); // Change slide every 5 seconds
    }

    function stopSlideshow() {
        clearInterval(slideInterval);
    }

    // Event listeners for navigation
    if (nextButton) {
        nextButton.addEventListener('click', function() {
            nextSlide();
            stopSlideshow();
            startSlideshow(); // Restart timer
        });
    }

    if (prevButton) {
        prevButton.addEventListener('click', function() {
            prevSlide();
            stopSlideshow();
            startSlideshow(); // Restart timer
        });
    }

    // Indicator click events
    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', function() {
            showSlide(index);
            stopSlideshow();
            startSlideshow(); // Restart timer
        });
    });

    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (e.key === 'ArrowLeft') {
            prevSlide();
            stopSlideshow();
            startSlideshow();
        } else if (e.key === 'ArrowRight') {
            nextSlide();
            stopSlideshow();
            startSlideshow();
        }
    });

    // Pause on hover
    const slideshowContainer = document.querySelector('.programs-slideshow');
    if (slideshowContainer) {
        slideshowContainer.addEventListener('mouseenter', stopSlideshow);
        slideshowContainer.addEventListener('mouseleave', startSlideshow);
    }

    // Touch/swipe support for mobile
    let touchStartX = 0;
    let touchEndX = 0;

    if (slideshowContainer) {
        slideshowContainer.addEventListener('touchstart', function(e) {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });

        slideshowContainer.addEventListener('touchend', function(e) {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        }, { passive: true });
    }

    function handleSwipe() {
        const swipeThreshold = 50;
        const diff = touchStartX - touchEndX;

        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                // Swipe left - next slide
                nextSlide();
            } else {
                // Swipe right - previous slide
                prevSlide();
            }
            stopSlideshow();
            startSlideshow();
        }
    }

    // Start the slideshow
    if (slides.length > 0) {
        startSlideshow();
    }

    // Stop slideshow when user scrolls away
    let hasScrolledAway = false;
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > window.innerHeight && !hasScrolledAway) {
            hasScrolledAway = true;
            stopSlideshow();
        } else if (window.pageYOffset <= window.innerHeight && hasScrolledAway) {
            hasScrolledAway = false;
            startSlideshow();
        }
    });

    // ===================================
    // Lazy Loading Images
    // ===================================
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                    }
                    observer.unobserve(img);
                }
            });
        });

        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }

    // ===================================
    // Form Validation (if contact form exists)
    // ===================================
    const contactForm = document.querySelector('.contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Basic validation
            const inputs = this.querySelectorAll('input[required], textarea[required]');
            let isValid = true;
            
            inputs.forEach(input => {
                if (!input.value.trim()) {
                    isValid = false;
                    input.classList.add('error');
                } else {
                    input.classList.remove('error');
                }
            });
            
            if (isValid) {
                // Submit form or show success message
                console.log('Form is valid - ready to submit');
                // You can add AJAX submission here
            }
        });
    }

    // ===================================
    // Add subtle hover effects to cards
    // ===================================
    document.querySelectorAll('.program-card, .accreditation-card').forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.zIndex = '10';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.zIndex = '1';
        });
    });

    // ===================================
    // Prevent flash of unstyled content
    // ===================================
    window.addEventListener('load', function() {
        document.body.classList.add('loaded');
    });

    // ===================================
    // Handle window resize
    // ===================================
    let resizeTimer;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function() {
            // Close mobile menu if screen gets larger
            if (window.innerWidth > 768 && navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
            }
        }, 250);
    });

    // ===================================
    // Accessibility: Skip to main content
    // ===================================
    const skipLink = document.createElement('a');
    skipLink.href = '#main-content';
    skipLink.className = 'skip-link';
    skipLink.textContent = 'Skip to main content';
    skipLink.style.cssText = `
        position: absolute;
        top: -40px;
        left: 0;
        background: var(--primary);
        color: white;
        padding: 8px 16px;
        text-decoration: none;
        z-index: 9999;
    `;
    
    skipLink.addEventListener('focus', function() {
        this.style.top = '0';
    });
    
    skipLink.addEventListener('blur', function() {
        this.style.top = '-40px';
    });
    
    document.body.insertBefore(skipLink, document.body.firstChild);

    // ===================================
    // Console Message
    // ===================================
    console.log('%cHigh Skies College', 'font-size: 24px; font-weight: bold; color: #1a2f5a;');
    console.log('%cModern University Design System', 'font-size: 14px; color: #d4af37;');
    console.log('%cWebsite by High Skies College - Transforming Education Since 2012', 'font-size: 12px; color: #4a4a4a;');

})();

