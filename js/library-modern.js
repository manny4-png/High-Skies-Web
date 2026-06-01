/**
 * Library Page - Modern University Design
 * Interactive features and animations
 */

document.addEventListener('DOMContentLoaded', function() {
    
    // Scroll animations for service cards
    const serviceCards = document.querySelectorAll('.service-card');
    const resourceCards = document.querySelectorAll('.resource-card');
    
    const cardObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, index * 100);
                cardObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    
    [...serviceCards, ...resourceCards].forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'all 0.6s ease-out';
        cardObserver.observe(card);
    });
    
    // Animate feature items
    const featureItems = document.querySelectorAll('.feature-item');
    
    featureItems.forEach((item, index) => {
        item.style.opacity = '0';
        item.style.transform = 'scale(0.9)';
        item.style.transition = 'all 0.5s ease-out';
        
        setTimeout(() => {
            cardObserver.observe(item);
        }, index * 50);
    });
    
    // Add hover effect to E-books button
    const ebooksBtn = document.querySelector('.btn-ebooks');
    if (ebooksBtn) {
        ebooksBtn.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-3px) scale(1.05)';
        });
        
        ebooksBtn.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    }
    
    // Track E-books button clicks
    if (ebooksBtn) {
        ebooksBtn.addEventListener('click', function() {
            console.log('E-books link clicked');
            // Analytics tracking can go here
        });
    }
    
    // Smooth scroll for anchor links
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
    
    // Add scroll-to-top button
    const scrollBtn = document.createElement('button');
    scrollBtn.className = 'scroll-to-top';
    scrollBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
    scrollBtn.setAttribute('aria-label', 'Scroll to top');
    document.body.appendChild(scrollBtn);
    
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            scrollBtn.classList.add('visible');
        } else {
            scrollBtn.classList.remove('visible');
        }
    });
    
    scrollBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    // Highlight current day in opening hours
    const today = new Date().getDay(); // 0 = Sunday, 6 = Saturday
    const hoursItems = document.querySelectorAll('.hours-item');
    
    if (hoursItems.length > 0) {
        let currentDayIndex = -1;
        
        // Map day indices (0-6 to actual days in hours list)
        if (today >= 1 && today <= 5) {
            currentDayIndex = 0; // Monday-Friday
        } else if (today === 6) {
            currentDayIndex = 1; // Saturday
        } else if (today === 0) {
            currentDayIndex = 2; // Sunday
        }
        
        if (currentDayIndex !== -1 && hoursItems[currentDayIndex]) {
            hoursItems[currentDayIndex].style.background = 'rgba(212, 175, 55, 0.1)';
            hoursItems[currentDayIndex].style.borderRadius = '8px';
            hoursItems[currentDayIndex].style.padding = '0.75rem 1rem';
        }
    }
    
    console.log('Library page initialized successfully');
});
