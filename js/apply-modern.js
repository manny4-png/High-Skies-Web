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
    const addQualificationBtn = document.getElementById('addQualification');
    const qualificationList = document.getElementById('qualificationList');
    const applicationReference = document.getElementById('applicationReference');
    const applicationSummary = document.getElementById('applicationSummary');
    const downloadApplicationBtn = document.getElementById('downloadApplication');
    const successModal = document.getElementById('applicationSuccessModal');
    const successModalMessage = document.getElementById('successModalMessage');
    const successReference = document.getElementById('successApplicationReference');
    const successDownloadPdf = document.getElementById('successDownloadPdf');
    let currentStep = 1;
    let refereeCount = 1;
    let qualificationCount = 1;
    let summaryAttached = false;

    if (applicationReference && !applicationReference.value) {
        applicationReference.value = createApplicationReference();
    }

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

    if (addQualificationBtn && qualificationList) {
        addQualificationBtn.addEventListener('click', addQualification);
    }

    if (downloadApplicationBtn) {
        downloadApplicationBtn.addEventListener('click', async function() {
            if (!validateStep(currentStep)) return;

            try {
                const summary = await createApplicationPdf();
                summary.pdf.save(summary.filename);
            } catch (error) {
                showPdfError(error);
            }
        });
    }

    if (successDownloadPdf) {
        successDownloadPdf.addEventListener('click', async function() {
            try {
                const summary = await createApplicationPdf();
                summary.pdf.save(summary.filename);
            } catch (error) {
                showPdfError(error);
            }
        });
    }

    document.querySelectorAll('[data-close-success-modal]').forEach(function(button) {
        button.addEventListener('click', closeSuccessModal);
    });

    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape' && successModal && !successModal.hidden) closeSuccessModal();
    });

    form.addEventListener('submit', async function(event) {
        event.preventDefault();

        if (!validateStep(currentStep)) {
            return;
        }

        const submitBtn = form.querySelector('.btn-submit');
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting...';
        formStatus.className = 'form-status loading';
        formStatus.textContent = 'Preparing and submitting your application...';

        try {
            if (!summaryAttached) {
                await attachApplicationPdf();
                summaryAttached = true;
            }

            const response = await fetch(form.action, {
                method: 'POST',
                headers: { Accept: 'application/json' },
                body: new FormData(form)
            });

            if (!response.ok) throw new Error('FormBold rejected the submission');

            formStatus.className = 'form-status success';
            formStatus.textContent = 'Application submitted successfully.';
            showSuccessModal();
        } catch (error) {
            formStatus.className = 'form-status error';
            formStatus.textContent = 'Your application could not be submitted. Please check your connection and try again.';
        } finally {
            submitBtn.disabled = false;
            submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Submit Application';
        }
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

        if (field.type === 'file' && field.files.length) {
            const oversizedFile = Array.from(field.files).find(function(file) {
                return file.size > 5 * 1024 * 1024;
            });
            if (oversizedFile) {
                return setFieldError(field, 'Each file must be 5 MB or smaller');
            }
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

    function addQualification() {
        qualificationCount += 1;
        const card = document.createElement('div');
        card.className = 'qualification-card';
        card.innerHTML = [
            '<div class="form-grid">',
            '<div class="form-group"><label for="qualification' + qualificationCount + '">Qualification ' + qualificationCount + '</label><input type="text" id="qualification' + qualificationCount + '" name="qualification[]" maxlength="200" placeholder="e.g., WASSCE or Diploma in Information Technology"><span class="error-message"></span></div>',
            '<div class="form-group"><label for="qualificationYear' + qualificationCount + '">Year of Qualification</label><input type="number" id="qualificationYear' + qualificationCount + '" name="qualificationYear[]" min="1950" max="2100" inputmode="numeric" placeholder="e.g., 2022"><span class="error-message"></span></div>',
            '</div>'
        ].join('');
        qualificationList.appendChild(card);
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
        setReviewValue('review-reference', applicationReference.value);
        setReviewValue('review-program', getFieldValue('program'));
        setReviewValue('review-name', [getFieldValue('title'), getFieldValue('fullName')].filter(Boolean).join(' '));
        setReviewValue('review-email', getFieldValue('email'));
        setReviewValue('review-phone', getFieldValue('phone'));
        setReviewValue('review-funding-source', getFieldValue('fundingSource'));
    }

    function getFieldValue(id) {
        const field = document.getElementById(id);
        return field ? field.value : '';
    }

    function setReviewValue(id, value) {
        const target = document.getElementById(id);
        if (target) target.textContent = value || 'Not provided';
    }

    function createApplicationReference() {
        const now = new Date();
        const date = [
            now.getFullYear(),
            String(now.getMonth() + 1).padStart(2, '0'),
            String(now.getDate()).padStart(2, '0')
        ].join('');
        const random = Math.random().toString(36).slice(2, 7).toUpperCase();
        return 'HSC-' + date + '-' + random;
    }

    async function createApplicationPdf() {
        if (!window.jspdf || !window.jspdf.jsPDF) {
            throw new Error('The PDF library could not be loaded');
        }

        const jsPDF = window.jspdf.jsPDF;
        const pdf = new jsPDF({ unit: 'mm', format: 'a4' });
        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();
        const margin = 16;
        const contentWidth = pageWidth - (margin * 2);
        let y = 18;

        pdf.setProperties({
            title: 'High Skies College Application - ' + applicationReference.value,
            subject: 'Admissions application',
            author: 'High Skies College'
        });

        function addPageIfNeeded(height) {
            if (y + height > pageHeight - 18) {
                pdf.addPage();
                y = 18;
                addPageHeader();
            }
        }

        function addPageHeader() {
            pdf.setFont('helvetica', 'bold');
            pdf.setFontSize(9);
            pdf.setTextColor(44, 62, 80);
            pdf.text('HIGH SKIES COLLEGE - APPLICATION FORM', pageWidth / 2, 10, { align: 'center' });
            pdf.text(applicationReference.value, pageWidth - margin, 10, { align: 'right' });
            pdf.setDrawColor(210, 214, 220);
            pdf.line(margin, 13, pageWidth - margin, 13);
        }

        function addSection(title) {
            addPageIfNeeded(13);
            y += 3;
            pdf.setFillColor(31, 78, 121);
            pdf.roundedRect(margin, y, contentWidth, 8, 1.5, 1.5, 'F');
            pdf.setFont('helvetica', 'bold');
            pdf.setFontSize(10);
            pdf.setTextColor(255, 255, 255);
            pdf.text(title, margin + 3, y + 5.4);
            y += 12;
        }

        function addField(label, value) {
            const safeValue = value || 'Not provided';
            pdf.setFontSize(9);
            const labelWidth = 70;
            const valueX = margin + 76;
            const labelLines = pdf.splitTextToSize(String(label), labelWidth);
            const valueLines = pdf.splitTextToSize(String(safeValue), contentWidth - 76);
            const rowHeight = Math.max(7, Math.max(labelLines.length, valueLines.length) * 4.3 + 2);
            addPageIfNeeded(rowHeight);

            pdf.setFont('helvetica', 'bold');
            pdf.setTextColor(70, 78, 86);
            pdf.text(labelLines, margin, y + 3.5);
            pdf.setFont('helvetica', 'normal');
            pdf.setTextColor(20, 25, 30);
            pdf.text(valueLines, valueX, y + 3.5);
            pdf.setDrawColor(232, 234, 237);
            pdf.line(margin, y + rowHeight - 1, pageWidth - margin, y + rowHeight - 1);
            y += rowHeight;
        }

        const photoField = document.getElementById('passportPicture');
        const photoFile = photoField && photoField.files.length ? photoField.files[0] : null;
        const photoWidth = 35;
        const photoHeight = 45;
        const photoX = pageWidth - margin - photoWidth;
        const photoY = 17;
        const logoElement = document.querySelector('.nav-brand .logo');

        pdf.setDrawColor(110, 118, 126);
        pdf.setLineWidth(0.4);
        pdf.rect(photoX, photoY, photoWidth, photoHeight);
        if (photoFile) {
            const photoData = await readFileAsDataUrl(photoFile);
            const photoFormat = photoFile.type === 'image/png' ? 'PNG' : 'JPEG';
            const photoProperties = pdf.getImageProperties(photoData);
            const availableWidth = photoWidth - 1.4;
            const availableHeight = photoHeight - 1.4;
            const photoScale = Math.min(availableWidth / photoProperties.width, availableHeight / photoProperties.height);
            const renderedWidth = photoProperties.width * photoScale;
            const renderedHeight = photoProperties.height * photoScale;
            const renderedX = photoX + ((photoWidth - renderedWidth) / 2);
            const renderedY = photoY + ((photoHeight - renderedHeight) / 2);
            pdf.addImage(photoData, photoFormat, renderedX, renderedY, renderedWidth, renderedHeight, undefined, 'FAST');
        } else {
            pdf.setFont('helvetica', 'normal');
            pdf.setFontSize(8);
            pdf.setTextColor(120, 120, 120);
            pdf.text('PASSPORT PHOTO', photoX + (photoWidth / 2), photoY + (photoHeight / 2), { align: 'center' });
        }

        if (logoElement && logoElement.complete && logoElement.naturalWidth) {
            try {
                const logoSize = 18;
                pdf.addImage(logoElement, 'PNG', (pageWidth - logoSize) / 2, 15, logoSize, logoSize, undefined, 'FAST');
            } catch (error) {
                console.warn('The application PDF was created without the college logo.', error);
            }
        }

        pdf.setFont('helvetica', 'bold');
        pdf.setFontSize(18);
        pdf.setTextColor(31, 78, 121);
        pdf.text('HIGH SKIES COLLEGE', pageWidth / 2, 40, { align: 'center' });
        pdf.setFontSize(14);
        pdf.setTextColor(35, 35, 35);
        pdf.text('ADMISSIONS APPLICATION FORM', pageWidth / 2, 48, { align: 'center' });
        pdf.setFontSize(9);
        pdf.setFont('helvetica', 'normal');
        pdf.text('Application reference: ' + applicationReference.value, margin, 56);
        pdf.text('Prepared: ' + new Date().toLocaleString('en-GB'), margin, 62);
        y = photoY + photoHeight + 3;

        const groupedFields = collectPrintableFields();
        groupedFields.forEach(function(group) {
            addSection(group.title);
            group.fields.forEach(function(field) {
                addField(field.label, field.value);
            });
        });

        addSection('OFFICE USE ONLY');
        addField('Admissions decision', '____________________________________________');
        addField('Officer / signature', '____________________________________________');
        addField('Date', '____________________________________________');
        addField('Notes', '\n\n');

        const totalPages = pdf.internal.getNumberOfPages();
        for (let page = 1; page <= totalPages; page += 1) {
            pdf.setPage(page);
            pdf.setFont('helvetica', 'normal');
            pdf.setFontSize(8);
            pdf.setTextColor(100, 100, 100);
            pdf.text('Confidential admissions record', margin, pageHeight - 8);
            pdf.text('Page ' + page + ' of ' + totalPages, pageWidth - margin, pageHeight - 8, { align: 'right' });
        }

        const applicantName = getFieldValue('fullName') || 'Applicant';
        const safeName = applicantName.replace(/[^a-z0-9]+/gi, '-').replace(/^-|-$/g, '').slice(0, 50);
        return {
            pdf: pdf,
            filename: applicationReference.value + '-' + safeName + '.pdf'
        };
    }

    function collectPrintableFields() {
        const sections = [
            { title: 'PROGRAMME', step: 1 },
            { title: 'PERSONAL & BIOGRAPHICAL INFORMATION', step: 2 },
            { title: 'EMERGENCY, EMPLOYMENT & FUNDING', step: 3 },
            { title: 'DOCUMENTS, SUPPORT & REFEREES', step: 4 }
        ];

        return sections.map(function(section) {
            const step = form.querySelector('.form-step[data-step="' + section.step + '"]');
            const fields = [];
            const processedRadioNames = new Set();
            const processedCheckboxNames = new Set();

            Array.from(step.querySelectorAll('input, select, textarea')).forEach(function(field) {
                if (!field.name || field.type === 'hidden' || field.type === 'button' || field.type === 'submit') return;

                const label = getPrintableLabel(field);
                if (field.type === 'file') {
                    fields.push({
                        label: label,
                        value: field.files.length ? Array.from(field.files).map(function(file) { return file.name; }).join(', ') : 'Not uploaded'
                    });
                    return;
                }

                if (field.type === 'radio') {
                    if (processedRadioNames.has(field.name)) return;
                    processedRadioNames.add(field.name);
                    const checkedRadio = step.querySelector('input[type="radio"][name="' + field.name + '"]:checked');
                    fields.push({ label: getGroupLabel(field), value: checkedRadio ? checkedRadio.value : 'Not provided' });
                    return;
                }

                if (field.type === 'checkbox') {
                    if (processedCheckboxNames.has(field.name)) return;
                    processedCheckboxNames.add(field.name);
                    const checked = Array.from(step.querySelectorAll('input[type="checkbox"][name="' + field.name + '"]:checked'));
                    fields.push({ label: getGroupLabel(field), value: checked.length ? checked.map(function(item) { return item.value || 'Yes'; }).join(', ') : 'None' });
                    return;
                }

                fields.push({ label: label, value: field.value });
            });

            return { title: section.title, fields: fields };
        });
    }

    function getPrintableLabel(field) {
        const explicitLabel = field.id ? form.querySelector('label[for="' + field.id + '"]') : null;
        if (explicitLabel) return explicitLabel.textContent.replace('*', '').trim();
        return field.name.replace(/\[\]/g, '').replace(/([A-Z])/g, ' $1').replace(/^./, function(char) { return char.toUpperCase(); });
    }

    function getGroupLabel(field) {
        const fieldset = field.closest('fieldset');
        const legend = fieldset ? fieldset.querySelector('legend') : null;
        return legend ? legend.textContent.replace('*', '').trim() : getPrintableLabel(field);
    }

    function readFileAsDataUrl(file) {
        return new Promise(function(resolve, reject) {
            const reader = new FileReader();
            reader.onload = function() { resolve(reader.result); };
            reader.onerror = function() { reject(new Error('The passport picture could not be read')); };
            reader.readAsDataURL(file);
        });
    }

    async function attachApplicationPdf() {
        const summary = await createApplicationPdf();
        const pdfFile = new File([summary.pdf.output('blob')], summary.filename, { type: 'application/pdf' });
        const transfer = new DataTransfer();
        transfer.items.add(pdfFile);
        applicationSummary.files = transfer.files;
    }

    function showPdfError(error) {
        console.error('Application PDF preparation failed.', error);
        formStatus.className = 'form-status error';
        formStatus.textContent = 'We could not prepare the application PDF. Please check your internet connection and try again.';
        const submitBtn = form.querySelector('.btn-submit');
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Submit Application';
    }

    function showSuccessModal() {
        const applicantName = getFieldValue('fullName');
        successModalMessage.textContent = (applicantName ? 'Thank you, ' + applicantName + '. ' : '') +
            'Your application has been received successfully. Our Admissions Office will review your submission and contact you with an update soon.';
        successReference.textContent = applicationReference.value;
        successModal.hidden = false;
        document.body.classList.add('modal-open');
        const doneButton = successModal.querySelector('[data-close-success-modal]:not(.success-modal-backdrop)');
        if (doneButton) doneButton.focus();
    }

    function closeSuccessModal() {
        if (!successModal || successModal.hidden) return;
        successModal.hidden = true;
        document.body.classList.remove('modal-open');
        form.reset();
        summaryAttached = false;
        applicationReference.value = createApplicationReference();
        formStatus.className = 'form-status';
        formStatus.textContent = '';
        updateSpecialNeedsPanel();
        goToStep(1, true);
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
