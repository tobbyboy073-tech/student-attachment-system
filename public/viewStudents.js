document.addEventListener('DOMContentLoaded', () => {
  const tableBody = document.querySelector('#studentsTable tbody');
  const searchInput = document.getElementById('searchInput');

  let students = [];

  // Fetch students from backend
  fetch('/students')
    .then(res => res.json())
    .then(data => {
      students = data;
      displayStudents(students);
    })
    .catch(err => console.error('Error loading students:', err));

  // Display students in the table
  function displayStudents(list) {
    tableBody.innerHTML = '';
    list.forEach(student => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${student.name}</td>
        <td>${student.school}</td>
        <td>${student.course}</td>
      `;
      tableBody.appendChild(row);
    });
  }

  // Search filter
  searchInput.addEventListener('input', () => {
    const query = searchInput.value.toLowerCase();
    const filtered = students.filter(student =>
      student.name.toLowerCase().includes(query) ||
      student.school.toLowerCase().includes(query)
    );
    displayStudents(filtered);
  });
});
