/**
 * MBA Program Page — mba-modern.js
 */
document.addEventListener('DOMContentLoaded', function () {

    // Tab switching functionality
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const targetTab = this.getAttribute('data-tab');
            
            // Remove active class from all buttons and contents
            tabBtns.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));
            
            // Add active class to clicked button and corresponding content
            this.classList.add('active');
            document.getElementById(targetTab).classList.add('active');
            
            // Smooth scroll to tab content on mobile
            if (window.innerWidth < 768) {
                document.querySelector('.tab-content-container').scrollIntoView({
                    behavior: 'smooth',
                    block: 'nearest'
                });
            }
        });
    });

    // Scroll animations for cards
    const cards = document.querySelectorAll(
        '.curriculum-card, .career-card, .requirement-item, .fact-card, .fee-card, .date-card'
    );

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, i) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, i * 80);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });

    cards.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(24px)';
        el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        observer.observe(el);
    });

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href !== '#' && href !== '') {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    const headerHeight = 80;
                    const pos = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;
                    window.scrollTo({ top: pos, behavior: 'smooth' });
                }
            }
        });
    });

    // Scroll-to-top button
    const scrollBtn = document.createElement('button');
    scrollBtn.className = 'scroll-to-top';
    scrollBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
    scrollBtn.setAttribute('aria-label', 'Scroll to top');
    document.body.appendChild(scrollBtn);

    window.addEventListener('scroll', () => {
        scrollBtn.classList.toggle('visible', window.pageYOffset > 300);
    });
    scrollBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

    console.log('MBA program page initialized with tabs');
});
