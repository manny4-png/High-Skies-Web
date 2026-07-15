/**
 * Apply Page - Multi-step admissions form.
 */

document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('applicationForm');
    if (!form) return;

    const formSteps = Array.from(document.querySelectorAll('.form-step'));
    const progressSteps = Array.from(document.querySelectorAll('.progress-step'));
    const prevBtns = Array.from(document.querySelectorAll('.btn-prev'));
    const nextBtns = Array.from(document.querySelectorAll('.btn-next'));
    const formStatus = document.getElementById('formStatus');
    const specialNeedsPanel = document.getElementById('specialNeedsPanel');
    const addRefereeBtn = document.getElementById('addReferee');
    const refereeList = document.getElementById('refereeList');
    const defaultMaxFileSizeMb = 1;
    let currentStep = 1;
    let refereeCount = 1;

    nextBtns.forEach(function(btn) {
        btn.addEventListener('click', function() {
            if (validateStep(currentStep) && currentStep < formSteps.length) {
                goToStep(currentStep + 1);
            }
        });
    });

    prevBtns.forEach(function(btn) {
        btn.addEventListener('click', function() {
            if (currentStep > 1) {
                goToStep(currentStep - 1);
            }
        });
    });

    form.addEventListener('input', function(event) {
        const field = event.target;
        if (field.matches('input, select, textarea')) {
            clearFieldError(field);
        }
    });

    form.addEventListener('change', function(event) {
        const field = event.target;
        if (field.matches('input, select, textarea')) {
            if (field.type === 'file') validateField(field);
            else clearFieldError(field);
        }
    });

    form.addEventListener('blur', function(event) {
        const field = event.target;
        if (field.matches('input, select, textarea') && (field.required || field.value)) {
            validateField(field);
        }
    }, true);

    document.querySelectorAll('[data-special-toggle]').forEach(function(radio) {
        radio.addEventListener('change', updateSpecialNeedsPanel);
    });

    if (addRefereeBtn && refereeList) {
        addRefereeBtn.addEventListener('click', addReferee);
    }

    form.addEventListener('submit', function(event) {
        if (!validateStep(currentStep)) {
            event.preventDefault();
            return;
        }

        formStatus.className = 'form-status loading';
        formStatus.textContent = 'Submitting your application...';

        const submitBtn = form.querySelector('.btn-submit');
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting...';
    });

    function goToStep(stepNumber, shouldScroll = true) {
        formSteps.forEach(function(step) {
            step.classList.toggle('active', Number(step.dataset.step) === stepNumber);
        });

        progressSteps.forEach(function(step) {
            const stepValue = Number(step.dataset.step);
            step.classList.toggle('active', stepValue === stepNumber);
            step.classList.toggle('completed', stepValue < stepNumber);
        });

        currentStep = stepNumber;

        if (currentStep === formSteps.length) {
            updateReviewSection();
        }

        if (shouldScroll) {
            document.querySelector('.application-section').scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    }

    function validateStep(stepNumber) {
        const currentFormStep = formSteps[stepNumber - 1];
        const requiredFields = Array.from(currentFormStep.querySelectorAll('input[required], select[required], textarea[required], input[type="file"]'));
        const requiredRadioNames = new Set(
            requiredFields
                .filter(function(field) { return field.type === 'radio'; })
                .map(function(field) { return field.name; })
        );
        let isValid = true;

        requiredFields.forEach(function(field) {
            if (field.type !== 'radio' && !validateField(field)) {
                isValid = false;
            }
        });

        requiredRadioNames.forEach(function(name) {
            const radios = Array.from(currentFormStep.querySelectorAll('input[type="radio"][name="' + name + '"]'));
            const checked = radios.some(function(radio) { return radio.checked; });
            const group = radios[0] ? radios[0].closest('.choice-group') : null;

            if (!checked) {
                isValid = false;
                if (group) {
                    group.classList.add('error');
                    const errorSpan = group.querySelector('.error-message');
                    if (errorSpan) errorSpan.textContent = 'Please select an option';
                }
            } else if (group) {
                group.classList.remove('error');
            }
        });

        return isValid;
    }

    function validateField(field) {
        clearFieldError(field);

        if (field.required && field.type === 'file' && !field.files.length) {
            return setFieldError(field, 'Please upload this document');
        }

        const maxFileSizeMb = Number(field.dataset.maxSizeMb) || defaultMaxFileSizeMb;
        if (field.type === 'file' && field.files.length && field.files[0].size > maxFileSizeMb * 1024 * 1024) {
            return setFieldError(field, 'This attachment must be ' + maxFileSizeMb + ' MB or smaller');
        }

        if (field.required && field.type === 'checkbox' && !field.checked) {
            return setFieldError(field, 'Please confirm this item');
        }

        const value = field.value.trim();
        if (field.required && !value) {
            return setFieldError(field, 'This field is required');
        }

        if (field.type === 'email' && value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
            return setFieldError(field, 'Please enter a valid email address');
        }

        if (field.type === 'tel' && value && !/^[0-9\s()+-]{7,20}$/.test(value)) {
            return setFieldError(field, 'Please enter a valid phone number');
        }

        if (field.type === 'number' && value) {
            const min = Number(field.min);
            const max = Number(field.max);
            const numberValue = Number(value);
            if ((field.min && numberValue < min) || (field.max && numberValue > max)) {
                return setFieldError(field, 'Please enter a valid year');
            }
        }

        if (value || (field.type === 'file' && field.files.length)) {
            field.classList.add('valid');
        }

        return true;
    }

    function setFieldError(field, message) {
        field.classList.add('error');
        const errorSpan = field.parentElement.querySelector('.error-message');
        if (errorSpan) errorSpan.textContent = message;
        return false;
    }

    function clearFieldError(field) {
        field.classList.remove('error', 'valid');
        const group = field.closest('.choice-group');
        if (group) group.classList.remove('error');
        const errorSpan = field.parentElement.querySelector('.error-message');
        if (errorSpan) errorSpan.textContent = '';
    }

    function updateSpecialNeedsPanel() {
        if (!specialNeedsPanel) return;
        const selected = form.querySelector('input[name="hasSpecialNeeds"]:checked');
        const showPanel = selected && selected.value === 'Yes';
        specialNeedsPanel.hidden = !showPanel;

        specialNeedsPanel.querySelectorAll('input, textarea').forEach(function(field) {
            if (!showPanel) {
                if (field.type === 'checkbox' || field.type === 'radio') field.checked = false;
                else field.value = '';
                clearFieldError(field);
            }
        });
    }

    function addReferee() {
        refereeCount += 1;
        const card = document.createElement('div');
        card.className = 'referee-card';
        card.innerHTML = [
            '<div class="form-grid">',
            '<div class="form-group"><label for="refereeName' + refereeCount + '">Name of Referee</label><input type="text" id="refereeName' + refereeCount + '" name="refereeName[]"></div>',
            '<div class="form-group"><label for="refereePhone' + refereeCount + '">Phone Number of Referee</label><input type="tel" id="refereePhone' + refereeCount + '" name="refereePhone[]"></div>',
            '<div class="form-group"><label for="refereeEmail' + refereeCount + '">Email Address of Referee</label><input type="email" id="refereeEmail' + refereeCount + '" name="refereeEmail[]"></div>',
            '<div class="form-group"><label for="refereeAddress' + refereeCount + '">Address</label><input type="text" id="refereeAddress' + refereeCount + '" name="refereeAddress[]"></div>',
            '</div>'
        ].join('');
        refereeList.appendChild(card);
    }

    function updateReviewSection() {
        setReviewValue('review-program', getFieldValue('program'));
        setReviewValue('review-name', [getFieldValue('title'), getFieldValue('fullName')].filter(Boolean).join(' '));
        setReviewValue('review-email', getFieldValue('email'));
        setReviewValue('review-phone', getFieldValue('phone'));
    }

    function getFieldValue(id) {
        const field = document.getElementById(id);
        return field ? field.value : '';
    }

    function setReviewValue(id, value) {
        const target = document.getElementById(id);
        if (target) target.textContent = value || 'Not provided';
    }

    const scrollBtn = document.createElement('button');
    scrollBtn.className = 'scroll-to-top';
    scrollBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
    scrollBtn.setAttribute('aria-label', 'Scroll to top');
    document.body.appendChild(scrollBtn);

    window.addEventListener('scroll', function() {
        scrollBtn.classList.toggle('visible', window.pageYOffset > 300);
    });

    scrollBtn.addEventListener('click', function() {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
});
