<script>
    const form = document.getElementById('contact-form');
    const status = document.getElementById('form-status');

    async function handleSubmit(event) {
        event.preventDefault(); // Stop normal submission/refresh

        const data = new FormData(event.target);

        fetch(event.target.action, {
            method: form.method,
            body: data,
            headers: {
                'Accept': 'application/json'
            }
        }).then(response => {
            if (response.ok) {
                status.innerHTML = "<p style='color: green;'>Thank you, we will get back to you soon!</p>";
                form.reset(); // Clear the form
            } else {
                status.innerHTML = "<p style='color: red;'>Oops! There was a problem. Please try again or email us directly.</p>";
            }
        }).catch(error => {
            status.innerHTML = "<p style='color: red;'>Oops! There was a problem. Please try again or email us directly.</p>";
        });
    }

    form.addEventListener('submit', handleSubmit);
</script>

