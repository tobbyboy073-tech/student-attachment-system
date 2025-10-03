async function fetchApplications() {
  try {
    const response = await fetch('/api/applications');
    const applications = await response.json();

    const list = document.getElementById('applicationList');
    list.innerHTML = '';

    applications.forEach(a => {
      const li = document.createElement('li');
      li.textContent = `${a.studentName} applied to ${a.companyName} for ${a.opportunityTitle}`;
      list.appendChild(li);
    });
  } catch (err) {
    alert('Error loading applications.');
  }
}

fetchApplications();
