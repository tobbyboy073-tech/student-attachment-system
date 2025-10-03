const form = document.getElementById('companyForm');
const message = document.getElementById('message');

form.addEventListener('submit', e => {
    e.preventDefault();
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    if (!data.name || !data.location || !data.description) {
        message.textContent = 'All fields are required';
        return;
    }

    fetch('/api/companies', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data)
    })
    .then(res => res.json())
    .then(res => {
        if(res.error) {
            message.textContent = res.error;
        } else {
            message.textContent = res.message;
            form.reset();
        }
    })
    .catch(err => message.textContent = 'Network error adding company.');
});
