/**
 * Apply Page - Multi-Step Form Functionality
 */

document.addEventListener('DOMContentLoaded', function() {
    
    const form = document.getElementById('applicationForm');
    const formSteps = document.querySelectorAll('.form-step');
    const progressSteps = document.querySelectorAll('.progress-step');
    const prevBtns = document.querySelectorAll('.btn-prev');
    const nextBtns = document.querySelectorAll('.btn-next');
    const formStatus = document.getElementById('formStatus');
    let currentStep = 1;
    
    // Character counter for message textarea
    const messageField = document.getElementById('message');
    const charCount = document.getElementById('charCount');
    
    if (messageField && charCount) {
        messageField.addEventListener('input', function() {
            charCount.textContent = this.value.length;
        });
    }
    
    // Navigation: Next button
    nextBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            if (validateStep(currentStep)) {
                if (currentStep < 3) {
                    goToStep(currentStep + 1);
                }
            }
        });
    });
    
    // Navigation: Previous button
    prevBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            if (currentStep > 1) {
                goToStep(currentStep - 1);
            }
        });
    });
    
    // Go to specific step
    function goToStep(stepNumber) {
        // Hide current step
        formSteps[currentStep - 1].classList.remove('active');
        progressSteps[currentStep - 1].classList.remove('active');
        progressSteps[currentStep - 1].classList.add('completed');
        
        // Show new step
        currentStep = stepNumber;
        formSteps[currentStep - 1].classList.add('active');
        progressSteps[currentStep - 1].classList.add('active');
        
        // Update review if on step 3
        if (currentStep === 3) {
            updateReviewSection();
        }
        
        // Scroll to top of form
        window.scrollTo({
            top: document.querySelector('.application-section').offsetTop - 100,
            behavior: 'smooth'
        });
    }
    
    // Validate current step
    function validateStep(step) {
        const currentFormStep = formSteps[step - 1];
        const inputs = currentFormStep.querySelectorAll('input[required], select[required], textarea[required]');
        let isValid = true;
        
        inputs.forEach(input => {
            if (!validateField(input)) {
                isValid = false;
            }
        });
        
        return isValid;
    }
    
    // Validate individual field
    function validateField(field) {
        const value = field.value.trim();
        let isValid = true;
        let errorMessage = '';
        
        // Clear previous error
        field.classList.remove('error', 'valid');
        const errorSpan = field.parentElement.querySelector('.error-message');
        if (errorSpan) {
            errorSpan.textContent = '';
        }
        
        // Required field check
        if (field.hasAttribute('required') && !value) {
            isValid = false;
            errorMessage = 'This field is required';
        }
        
        // Email validation
        else if (field.type === 'email' && value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                isValid = false;
                errorMessage = 'Please enter a valid email address';
            }
        }
        
        // Phone validation
        else if (field.id === 'phone' && value) {
            const phoneRegex = /^[0-9\s\-\+]{7,15}$/;
            if (!phoneRegex.test(value)) {
                isValid = false;
                errorMessage = 'Please enter a valid phone number';
            }
        }
        
        // Age validation
        else if (field.id === 'age' && value) {
            const age = parseInt(value);
            if (age < 16 || age > 100) {
                isValid = false;
                errorMessage = 'Please enter a valid age (16-100)';
            }
        }
        
        // Name validation (no numbers)
        else if ((field.id === 'firstName' || field.id === 'lastName') && value) {
            if (/\d/.test(value)) {
                isValid = false;
                errorMessage = 'Name should not contain numbers';
            }
        }
        
        // Add error or valid class
        if (!isValid) {
            field.classList.add('error');
            if (errorSpan) {
                errorSpan.textContent = errorMessage;
            }
        } else if (value) {
            field.classList.add('valid');
        }
        
        return isValid;
    }
    
    // Real-time validation
    const allInputs = document.querySelectorAll('input, select, textarea');
    allInputs.forEach(input => {
        input.addEventListener('blur', function() {
            if (this.value) {
                validateField(this);
            }
        });
        
        input.addEventListener('input', function() {
            // Clear error on input
            if (this.classList.contains('error')) {
                this.classList.remove('error');
                const errorSpan = this.parentElement.querySelector('.error-message');
                if (errorSpan) {
                    errorSpan.textContent = '';
                }
            }
        });
    });
    
    // Update review section
    function updateReviewSection() {
        document.getElementById('review-name').textContent = 
            `${document.getElementById('firstName').value} ${document.getElementById('lastName').value}`;
        document.getElementById('review-email').textContent = 
            document.getElementById('email').value;
        document.getElementById('review-phone').textContent = 
            document.getElementById('phone').value;
        document.getElementById('review-program').textContent = 
            document.getElementById('program').value || 'Not selected';
        document.getElementById('review-education').textContent = 
            document.getElementById('highestEducation').value || 'Not specified';
    }
    
    // Form submission
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        
        // Verify reCAPTCHA
        const recaptchaResponse = (typeof grecaptcha !== 'undefined') ? grecaptcha.getResponse() : '';
        if (!recaptchaResponse) {
            alert('Please complete the reCAPTCHA verification');
            return;
        }
        
        // Show loading status
        formStatus.className = 'form-status loading';
        formStatus.textContent = 'Submitting your application...';
        
        const submitBtn = form.querySelector('.btn-submit');
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting...';
        
        try {
            const formData = new FormData(form);
            
            const response = await fetch(form.action, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            });
            
            if (response.ok) {
                // Success
                formStatus.className = 'form-status success';
                formStatus.innerHTML = `
                    <i class="fas fa-check-circle" style="font-size: 2rem; margin-bottom: 0.5rem;"></i>
                    <h3>Application Submitted Successfully!</h3>
                    <p>Thank you for applying to High Skies College. We will review your application and get back to you within 3-5 business days.</p>
                    <p>Please check your email for a confirmation message.</p>
                `;
                
                // Reset form
                form.reset();
                grecaptcha.reset();
                
                // Go back to step 1 after 5 seconds
                setTimeout(() => {
                    goToStep(1);
                    formStatus.className = 'form-status';
                    formStatus.textContent = '';
                }, 5000);
                
            } else {
                // Error
                const data = await response.json();
                formStatus.className = 'form-status error';
                formStatus.innerHTML = `
                    <i class="fas fa-exclamation-circle" style="font-size: 2rem; margin-bottom: 0.5rem;"></i>
                    <h3>Submission Failed</h3>
                    <p>${data.errors ? data.errors.map(e => e.message).join(', ') : 'An error occurred. Please try again.'}</p>
                `;
            }
            
        } catch (error) {
            formStatus.className = 'form-status error';
            formStatus.innerHTML = `
                <i class="fas fa-exclamation-triangle" style="font-size: 2rem; margin-bottom: 0.5rem;"></i>
                <h3>Connection Error</h3>
                <p>Unable to submit your application. Please check your internet connection and try again, or contact us directly at info@highskiescollege.com</p>
            `;
        } finally {
            submitBtn.disabled = false;
            submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Submit Application';
        }
    });
    
    // Scroll to top button
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
    
    console.log('Apply page initialized successfully');
});
