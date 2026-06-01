/**
 * Programs Page - Modern University Design
 * Interactive filtering and smooth animations
 */

document.addEventListener('DOMContentLoaded', function() {
    
    // Filter functionality
    const filterButtons = document.querySelectorAll('.filter-btn');
    const programCards = document.querySelectorAll('.program-card');

    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const filterValue = this.getAttribute('data-filter');
            
            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Filter cards with animation
            programCards.forEach((card, index) => {
                const category = card.getAttribute('data-category');
                
                if (filterValue === 'all' || category === filterValue) {
                    // Show card with stagger animation
                    setTimeout(() => {
                        card.style.display = 'flex';
                        card.style.opacity = '0';
                        card.style.transform = 'translateY(20px)';
                        
                        // Trigger animation
                        setTimeout(() => {
                            card.style.transition = 'all 0.5s ease-out';
                            card.style.opacity = '1';
                            card.style.transform = 'translateY(0)';
                        }, 50);
                    }, index * 50);
                } else {
                    // Hide card
                    card.style.transition = 'all 0.3s ease-out';
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(20px)';
                    
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 300);
                }
            });

            // Smooth scroll to programs grid
            const programsGrid = document.getElementById('programsGrid');
            if (programsGrid) {
                const headerHeight = 80;
                const filterHeight = document.querySelector('.programs-filter-section').offsetHeight;
                const targetPosition = programsGrid.getBoundingClientRect().top + window.pageYOffset - headerHeight - filterHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Add hover effect to program cards
    programCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transition = 'all 0.3s ease-out';
        });
    });

    // Intersection Observer for scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = 'fadeInUp 0.6s ease-out forwards';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe program cards for animation on scroll
    programCards.forEach(card => {
        observer.observe(card);
    });

    // Observe intro content
    const introContent = document.querySelector('.intro-content');
    if (introContent) {
        observer.observe(introContent);
    }

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href !== '#' && href !== '') {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    const headerHeight = 80;
                    const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    // Add loading animation on page load
    setTimeout(() => {
        programCards.forEach((card, index) => {
            setTimeout(() => {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, index * 100);
        });
    }, 100);

    // Handle sticky filter bar shadow on scroll
    const filterSection = document.querySelector('.programs-filter-section');
    if (filterSection) {
        let lastScroll = 0;
        
        window.addEventListener('scroll', () => {
            const currentScroll = window.pageYOffset;
            
            if (currentScroll > 200) {
                filterSection.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
            } else {
                filterSection.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.05)';
            }
            
            lastScroll = currentScroll;
        });
    }

    // Add keyboard navigation for filters
    filterButtons.forEach((button, index) => {
        button.addEventListener('keydown', function(e) {
            if (e.key === 'ArrowRight') {
                e.preventDefault();
                const nextButton = filterButtons[index + 1] || filterButtons[0];
                nextButton.focus();
            } else if (e.key === 'ArrowLeft') {
                e.preventDefault();
                const prevButton = filterButtons[index - 1] || filterButtons[filterButtons.length - 1];
                prevButton.focus();
            } else if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                button.click();
            }
        });
    });

    // Count and display filtered results
    function updateResultsCount() {
        const activeFilter = document.querySelector('.filter-btn.active');
        const filterValue = activeFilter ? activeFilter.getAttribute('data-filter') : 'all';
        const visibleCards = Array.from(programCards).filter(card => {
            const category = card.getAttribute('data-category');
            return filterValue === 'all' || category === filterValue;
        });
        
        console.log(`Showing ${visibleCards.length} programs`);
    }

    // Initial count
    updateResultsCount();

    // Add touch support for mobile
    if ('ontouchstart' in window) {
        programCards.forEach(card => {
            card.addEventListener('touchstart', function() {
                this.classList.add('touch-active');
            });
            
            card.addEventListener('touchend', function() {
                setTimeout(() => {
                    this.classList.remove('touch-active');
                }, 300);
            });
        });
    }

    // Performance: Debounce scroll events
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

    // Add parallax effect to hero section (optional)
    const heroSection = document.querySelector('.programs-hero');
    if (heroSection) {
        const parallaxScroll = debounce(() => {
            const scrolled = window.pageYOffset;
            const heroContent = document.querySelector('.hero-content');
            if (heroContent && scrolled < window.innerHeight) {
                heroContent.style.transform = `translateY(${scrolled * 0.5}px)`;
                heroContent.style.opacity = 1 - (scrolled / window.innerHeight);
            }
        }, 10);

        window.addEventListener('scroll', parallaxScroll);
    }

    // Add ARIA live region for filter announcements (accessibility)
    const liveRegion = document.createElement('div');
    liveRegion.setAttribute('aria-live', 'polite');
    liveRegion.setAttribute('aria-atomic', 'true');
    liveRegion.className = 'sr-only';
    document.body.appendChild(liveRegion);

    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const filterName = this.textContent.trim();
            liveRegion.textContent = `Filtered to show: ${filterName}`;
        });
    });

    console.log('Programs page initialized successfully');
});
