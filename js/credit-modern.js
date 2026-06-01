/**
 * Accreditations Page — credit-modern.js
 */
document.addEventListener('DOMContentLoaded', function () {

    // Staggered scroll-in for accreditation cards
    const cards = document.querySelectorAll('.accred-card');
    const steps = document.querySelectorAll('.pathway-step');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, i) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, i * 120);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12 });

    [...cards, ...steps].forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(32px)';
        el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        observer.observe(el);
    });

    // Pathway arrows animate on scroll
    const arrows = document.querySelectorAll('.pathway-arrow');
    const arrowObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                arrowObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    arrows.forEach(arrow => {
        arrow.style.opacity = '0';
        arrow.style.transition = 'opacity 0.8s ease-out';
        arrowObserver.observe(arrow);
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

    console.log('Accreditations page initialised');
});
