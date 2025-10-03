const msgStu = document.getElementById('message') || (() => { const p=document.createElement('p');p.id='message';document.body.appendChild(p);return p; })();

document.getElementById('studentForm')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const name = document.getElementById('studentName').value.trim();
  const course = document.getElementById('course').value.trim();
  const school = document.getElementById('school').value.trim();

  if (!name || !course || !school) { msgStu.innerText = 'All fields are required'; return; }

  try {
    const res = await fetch('/api/students', {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({ name, course, school })
    });
    const j = await res.json();
    msgStu.innerText = j.message || j.error || 'Saved';
    if (res.ok) e.target.reset();
  } catch {
    msgStu.innerText = 'Network error adding student';
  }
});
