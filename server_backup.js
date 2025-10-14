// server.js
const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files from /public folder
app.use(express.static(path.join(__dirname, 'public')));

// Database setup
const db = new sqlite3.Database('./database.db', (err) => {
  if (err) {
    console.error('❌ Error connecting to database:', err.message);
  } else {
    console.log('✅ Connected to SQLite database.');
  }
});

// ======= STUDENT ROUTES =======

// ✅ Add Student (with phone)
app.post('/api/students', (req, res) => {
  const { name, course, phone, year } = req.body;

  if (!name || !course || !phone || !year) {
    return res.status(400).json({ error: "All fields are required." });
  }

  const sql = `INSERT INTO students (name, course, phone, year) VALUES (?, ?, ?, ?)`;
  db.run(sql, [name, course, phone, year], function (err) {
    if (err) {
      console.error("❌ Database error:", err.message);
      return res.status(500).json({ error: "Failed to add student." });
    }
    res.json({ message: "Student added successfully!" });
  });
});

// Get all students
app.get('/api/students', (req, res) => {
  db.all(`SELECT * FROM students`, [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// ======= COMPANY ROUTES =======

// Add company
app.post('/api/companies', (req, res) => {
  const { name, location, description } = req.body;
  if (!name || !location || !description) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  db.run(
    `INSERT INTO companies (name, location, description) VALUES (?, ?, ?)`,
    [name, location, description],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: 'Company added successfully!', id: this.lastID });
    }
  );
});

// Get all companies
app.get('/api/companies', (req, res) => {
  db.all(`SELECT * FROM companies`, [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// ======= OPPORTUNITY ROUTES =======

// Add opportunity
app.post('/api/opportunities', (req, res) => {
  const { title, company, description, deadline } = req.body;
  if (!title || !company || !description || !deadline) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  db.run(
    `INSERT INTO opportunities (title, company, description, deadline) VALUES (?, ?, ?, ?)`,
    [title, company, description, deadline],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: 'Opportunity added successfully!', id: this.lastID });
    }
  );
});

// Get all opportunities
app.get('/api/opportunities', (req, res) => {
  db.all(`SELECT * FROM opportunities`, [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// ======= APPLICATION ROUTES =======

// Submit application
app.post('/api/applications', (req, res) => {
  const { student, opportunity, coverLetter } = req.body;
  if (!student || !opportunity || !coverLetter) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  db.run(
    `INSERT INTO applications (student, opportunity, coverLetter) VALUES (?, ?, ?)`,
    [student, opportunity, coverLetter],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: 'Application submitted successfully!', id: this.lastID });
    }
  );
});

// View all applications
app.get('/api/applications', (req, res) => {
  db.all(`SELECT * FROM applications`, [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// ======= DEFAULT ROUTE =======
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// ======= START SERVER =======
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
