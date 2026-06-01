/**
 * Why Us Page - Modern Interactions
 */

document.addEventListener('DOMContentLoaded', function() {
    
    // Scroll animations for cards
    const reasonCards = document.querySelectorAll('.reason-card');
    const galleryItems = document.querySelectorAll('.gallery-item');
    const accreditationCards = document.querySelectorAll('.accreditation-card');
    
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
    
    [...reasonCards, ...galleryItems, ...accreditationCards].forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'all 0.6s ease-out';
        cardObserver.observe(card);
    });
    
    // Gallery lightbox effect (simple zoom on click)
    galleryItems.forEach(item => {
        item.addEventListener('click', function() {
            const img = this.querySelector('.gallery-img');
            if (img) {
                // Create overlay
                const overlay = document.createElement('div');
                overlay.style.cssText = `
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(0,0,0,0.9);
                    z-index: 9999;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    animation: fadeIn 0.3s ease-out;
                `;
                
                // Create enlarged image
                const enlargedImg = document.createElement('img');
                enlargedImg.src = img.src;
                enlargedImg.alt = img.alt;
                enlargedImg.style.cssText = `
                    max-width: 90%;
                    max-height: 90vh;
                    border-radius: 8px;
                    box-shadow: 0 8px 32px rgba(0,0,0,0.5);
                `;
                
                overlay.appendChild(enlargedImg);
                document.body.appendChild(overlay);
                
                // Close on click
                overlay.addEventListener('click', function() {
                    this.style.animation = 'fadeOut 0.3s ease-out';
                    setTimeout(() => {
                        document.body.removeChild(this);
                    }, 300);
                });
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
    
    // Add CSS for animations
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        @keyframes fadeOut {
            from { opacity: 1; }
            to { opacity: 0; }
        }
    `;
    document.head.appendChild(style);
    
    console.log('Why Us page initialized successfully');
});
