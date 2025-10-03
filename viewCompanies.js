async function fetchCompanies() {
  try {
    const response = await fetch('/api/companies');
    const companies = await response.json();

    const list = document.getElementById('companyList');
    list.innerHTML = '';

    companies.forEach(c => {
      const li = document.createElement('li');
      li.textContent = `${c.name} - ${c.description}`;
      list.appendChild(li);
    });
  } catch (err) {
    alert('Error loading companies.');
  }
}

fetchCompanies();
