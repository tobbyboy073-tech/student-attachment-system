const form = document.getElementById('applicationForm');
const message = document.getElementById('message');

form.addEventListener('submit', e => {
  e.preventDefault();

  const formData = new FormData(form);
  const data = Object.fromEntries(formData.entries());

  if (!data.student || !data.opportunity || !data.coverLetter) {
    message.textContent = 'All fields are required.';
    message.style.color = 'red';
    return;
  }

  fetch('/api/applications', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  })
    .then(res => res.json())
    .then(res => {
      if (res.error) {
        message.textContent = res.error;
        message.style.color = 'red';
      } else {
        message.textContent = res.message;
        message.style.color = 'green';
        form.reset();
      }
    })
    .catch(() => {
      message.textContent = 'Network error submitting application.';
      message.style.color = 'red';
    });
});
