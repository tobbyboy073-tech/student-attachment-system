async function fetchOpportunities() {
  try {
    const response = await fetch('/api/opportunities');
    const opportunities = await response.json();

    const list = document.getElementById('opportunityList');
    list.innerHTML = '';

    opportunities.forEach(o => {
      const li = document.createElement('li');
      li.textContent = `${o.title} at ${o.company} - Deadline: ${o.deadline}`;
      list.appendChild(li);
    });
  } catch (err) {
    alert('Error loading opportunities.');
  }
}

fetchOpportunities();
