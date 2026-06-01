/**
 * Digital Resources Page - Interactive Features
 */

document.addEventListener('DOMContentLoaded', function() {
    
    // Scroll animations for cards
    const resourceCards = document.querySelectorAll('.resource-card');
    const journalCards = document.querySelectorAll('.journal-card');
    const ebookCards = document.querySelectorAll('.ebook-card');
    
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
    
    [...resourceCards, ...journalCards, ...ebookCards].forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'all 0.6s ease-out';
        cardObserver.observe(card);
    });
    
    // Track external link clicks (for analytics)
    const externalLinks = document.querySelectorAll('a[target="_blank"]');
    externalLinks.forEach(link => {
        link.addEventListener('click', function() {
            const resourceName = this.closest('.resource-card, .journal-card, .ebook-card')
                ?.querySelector('h3, h4')?.textContent || 'Unknown';
            console.log('Digital Resource accessed:', resourceName);
            // Analytics tracking can go here
        });
    });
    
    // Add external link icon animations
    const resourceLinks = document.querySelectorAll('.resource-link, .journal-link, .ebook-link');
    resourceLinks.forEach(link => {
        link.addEventListener('mouseenter', function() {
            const icon = this.querySelector('i');
            if (icon) {
                icon.style.transform = 'translateX(3px)';
            }
        });
        
        link.addEventListener('mouseleave', function() {
            const icon = this.querySelector('i');
            if (icon) {
                icon.style.transform = 'translateX(0)';
            }
        });
    });
    
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
    
    // Count and display total resources
    const totalResources = resourceCards.length + journalCards.length + ebookCards.length;
    console.log(`Total Digital Resources Available: ${totalResources}`);
    
    console.log('Digital Resources page initialized successfully');
});
