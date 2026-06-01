/**
 * Contact Page - Modern University Design
 * Form handling, validation, and interactions
 */

document.addEventListener('DOMContentLoaded', function() {
    
    // Form Elements
    const form = document.getElementById('contact-form');
    const statusDiv = document.getElementById('form-status');
    const inputs = form.querySelectorAll('input, textarea');
    const submitButton = form.querySelector('.btn-submit');
    
    // Form Validation
    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    function showStatus(message, type) {
        statusDiv.className = `form-status ${type} show`;
        statusDiv.textContent = message;
        
        // Auto-hide after 8 seconds
        setTimeout(() => {
            statusDiv.classList.remove('show');
        }, 8000);
    }

    // Real-time validation feedback
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateInput(this);
        });

        input.addEventListener('input', function() {
            if (this.classList.contains('error')) {
                validateInput(this);
            }
        });
    });

    function validateInput(input) {
        const value = input.value.trim();
        let isValid = true;
        let errorMessage = '';

        // Remove previous error state
        input.classList.remove('error', 'success');
        
        // Check if field is required and empty
        if (input.hasAttribute('required') && !value) {
            isValid = false;
            errorMessage = 'This field is required';
        }
        
        // Specific validations
        if (value && input.type === 'email') {
            if (!validateEmail(value)) {
                isValid = false;
                errorMessage = 'Please enter a valid email address';
            }
        }
        
        if (value && input.hasAttribute('minlength')) {
            const minLength = parseInt(input.getAttribute('minlength'));
            if (value.length < minLength) {
                isValid = false;
                errorMessage = `Minimum ${minLength} characters required`;
            }
        }

        // Visual feedback
        if (!isValid && value) {
            input.classList.add('error');
            input.style.borderColor = '#dc3545';
        } else if (isValid && value) {
            input.classList.add('success');
            input.style.borderColor = '#28a745';
        } else {
            input.style.borderColor = '';
        }

        return isValid;
    }

    // Form Submission
    form.addEventListener('submit', function(e) {
        e.preventDefault();

        // Validate all inputs
        let isFormValid = true;
        inputs.forEach(input => {
            if (input.hasAttribute('required')) {
                if (!validateInput(input)) {
                    isFormValid = false;
                }
            }
        });

        if (!isFormValid) {
            showStatus('Please fill in all required fields correctly.', 'error');
            return;
        }

        // Check reCAPTCHA
        if (typeof grecaptcha !== 'undefined') {
            const recaptchaResponse = grecaptcha.getResponse();
            if (!recaptchaResponse) {
                showStatus('Please complete the reCAPTCHA verification.', 'error');
                return;
            }
        }

        // Disable submit button
        submitButton.disabled = true;
        submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';

        // Submit form
        const formData = new FormData(form);

        fetch(form.action, {
            method: 'POST',
            body: formData,
            headers: {
                'Accept': 'application/json'
            }
        })
        .then(response => {
            if (response.ok) {
                showStatus('Thank you! Your message has been sent successfully. We\'ll get back to you soon.', 'success');
                form.reset();
                
                // Reset reCAPTCHA
                if (typeof grecaptcha !== 'undefined') {
                    grecaptcha.reset();
                }
                
                // Reset input styles
                inputs.forEach(input => {
                    input.classList.remove('error', 'success');
                    input.style.borderColor = '';
                });

                // Scroll to status message
                statusDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            } else {
                return response.json().then(data => {
                    if (data.errors) {
                        throw new Error(data.errors.map(error => error.message).join(', '));
                    } else {
                        throw new Error('Something went wrong. Please try again.');
                    }
                });
            }
        })
        .catch(error => {
            console.error('Form submission error:', error);
            showStatus(error.message || 'Oops! Connection error. Please try again later or email us directly.', 'error');
        })
        .finally(() => {
            // Re-enable submit button
            submitButton.disabled = false;
            submitButton.innerHTML = '<i class="fas fa-paper-plane"></i> Send Message';
        });
    });

    // Add floating label effect
    inputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.parentElement.classList.add('focused');
        });

        input.addEventListener('blur', function() {
            if (!this.value) {
                this.parentElement.classList.remove('focused');
            }
        });
    });

    // Character counter for textarea
    const messageTextarea = document.getElementById('message');
    if (messageTextarea) {
        const maxLength = messageTextarea.getAttribute('maxlength');
        
        if (maxLength) {
            const counterDiv = document.createElement('div');
            counterDiv.className = 'character-counter';
            counterDiv.style.cssText = 'text-align: right; font-size: 0.875rem; color: var(--text-light); margin-top: 0.5rem;';
            messageTextarea.parentElement.appendChild(counterDiv);

            function updateCounter() {
                const currentLength = messageTextarea.value.length;
                counterDiv.textContent = `${currentLength} / ${maxLength} characters`;
                
                if (currentLength > maxLength * 0.9) {
                    counterDiv.style.color = '#dc3545';
                } else {
                    counterDiv.style.color = 'var(--text-light)';
                }
            }

            messageTextarea.addEventListener('input', updateCounter);
            updateCounter();
        }
    }

    // Smooth scroll to form on page load with hash
    if (window.location.hash === '#contact-form') {
        setTimeout(() => {
            form.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 500);
    }

    // Add scroll-to-top button functionality
    createScrollToTop();

    function createScrollToTop() {
        const scrollBtn = document.createElement('button');
        scrollBtn.className = 'scroll-to-top';
        scrollBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
        scrollBtn.setAttribute('aria-label', 'Scroll to top');
        document.body.appendChild(scrollBtn);

        // Show/hide button based on scroll position
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 300) {
                scrollBtn.classList.add('visible');
            } else {
                scrollBtn.classList.remove('visible');
            }
        });

        // Scroll to top on click
        scrollBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // Add animation to contact detail items on scroll
    const observerOptions = {
        threshold: 0.2,
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

    // Observe contact detail items
    const detailItems = document.querySelectorAll('.contact-detail-item');
    detailItems.forEach((item, index) => {
        item.style.opacity = '0';
        item.style.animationDelay = `${index * 0.1}s`;
        observer.observe(item);
    });

    // Observe quick link cards
    const quickLinkCards = document.querySelectorAll('.quick-link-card');
    quickLinkCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.animationDelay = `${index * 0.15}s`;
        observer.observe(card);
    });

    // Phone number click to call
    const phoneLinks = document.querySelectorAll('a[href^="tel:"]');
    phoneLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Track phone clicks for analytics (if needed)
            console.log('Phone number clicked:', this.textContent);
        });
    });

    // Email link click tracking
    const emailLinks = document.querySelectorAll('a[href^="mailto:"]');
    emailLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Track email clicks for analytics (if needed)
            console.log('Email clicked:', this.textContent);
        });
    });

    // Add hover effect to form inputs
    inputs.forEach(input => {
        input.addEventListener('mouseenter', function() {
            if (!this.classList.contains('error')) {
                this.style.transform = 'scale(1.01)';
            }
        });

        input.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
        });
    });

    // Prevent form submission on Enter key (except in textarea)
    form.addEventListener('keypress', function(e) {
        if (e.key === 'Enter' && e.target.tagName !== 'TEXTAREA') {
            e.preventDefault();
        }
    });

    // Auto-resize textarea as user types
    if (messageTextarea) {
        messageTextarea.addEventListener('input', function() {
            this.style.height = 'auto';
            this.style.height = (this.scrollHeight) + 'px';
        });
    }

    // Add loading animation to page
    window.addEventListener('load', function() {
        document.body.classList.add('loaded');
    });

    // Add CSS for animations
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fadeInUp {
            from {
                opacity: 0;
                transform: translateY(30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        .form-input, .form-textarea {
            transition: transform 0.2s ease, border-color 0.3s ease;
        }

        body {
            opacity: 0;
            transition: opacity 0.3s ease;
        }

        body.loaded {
            opacity: 1;
        }
    `;
    document.head.appendChild(style);

    console.log('Contact page initialized successfully');
});
