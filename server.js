const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// ===== Sample Data =====
const students = [
  { name: 'Tony Kimtai', course: 'ICT', school: 'Nakuru University' }
];

const companies = [
  { name: 'ABC Ltd', location: 'Nakuru', description: 'Tech company' }
];

const opportunities = [
  { title: 'Internship', company: 'ABC Ltd', description: 'IT internship', deadline: '2025-12-31' }
];

const applications = [
  { student: 'Tony Kimtai', opportunity: 'Internship', coverLetter: 'I am interested.' }
];

const users = [
  { username: 'admin', password: 'admin123' }
];

// ===== Authentication =====
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  const user = users.find(u => u.username === username && u.password === password);
  if(user) res.json({ success: true });
  else res.json({ success: false, message: 'Invalid username or password' });
});

// ===== API Routes =====
app.get('/api/students', (req, res) => res.json(students));
app.get('/api/companies', (req, res) => res.json(companies));
app.get('/api/opportunities', (req, res) => res.json(opportunities));
app.get('/api/applications', (req, res) => res.json(applications));

// ===== Analytics / Reports =====
app.get('/api/opportunities-per-company', (req, res) => {
  const counts = {};
  opportunities.forEach(o => {
    counts[o.company] = (counts[o.company] || 0) + 1;
  });
  res.json(counts);
});

app.get('/api/applications-per-opportunity', (req, res) => {
  const counts = {};
  applications.forEach(a => {
    counts[a.opportunity] = (counts[a.opportunity] || 0) + 1;
  });
  res.json(counts);
});

app.get('/api/stats', (req, res) => {
  res.json({
    students: students.length,
    companies: companies.length,
    opportunities: opportunities.length,
    applications: applications.length
  });
});

// ===== Add Student / Company / Opportunity / Application =====
app.post('/api/students', (req, res) => {
  const { name, school, course } = req.body;
  if(!name || !school || !course) return res.json({ error: 'All fields required' });
  students.push({ name, school, course });
  res.json({ message: 'Student added successfully' });
});

app.post('/api/companies', (req, res) => {
  const { name, location, description } = req.body;
  if(!name || !location || !description) return res.json({ error: 'All fields required' });
  companies.push({ name, location, description });
  res.json({ message: 'Company added successfully' });
});

app.post('/api/opportunities', (req, res) => {
  const { title, company, description, deadline } = req.body;
  if(!title || !company || !description || !deadline) return res.json({ error: 'All fields required' });
  opportunities.push({ title, company, description, deadline });
  res.json({ message: 'Opportunity added successfully' });
});

app.post('/api/applications', (req, res) => {
  const { student, opportunity, coverLetter } = req.body;
  if(!student || !opportunity || !coverLetter) return res.json({ error: 'All fields required' });
  applications.push({ student, opportunity, coverLetter });
  res.json({ message: 'Application submitted successfully' });
});

// ===== Serve index.html by default =====
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// ===== Start Server =====
const PORT = 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
