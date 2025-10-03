document.addEventListener('DOMContentLoaded', async () => {
  const tableBody = document.querySelector('#applicationsTable tbody');

  try {
    const response = await fetch('/api/applications');
    const applications = await response.json();

    if (applications.length === 0) {
      tableBody.innerHTML = '<tr><td colspan="5">No applications submitted yet.</td></tr>';
      return;
    }

    applications.forEach(app => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${app.id}</td>
        <td>${app.student}</td>
        <td>${app.opportunity}</td>
        <td>${app.coverLetter}</td>
        <td>${new Date(app.date).toLocaleString()}</td>
      `;
      tableBody.appendChild(row);
    });
  } catch (error) {
    console.error('Error fetching applications:', error);
    tableBody.innerHTML = '<tr><td colspan="5">Error loading applications.</td></tr>';
  }
});
