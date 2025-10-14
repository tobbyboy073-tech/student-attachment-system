// database.js
const sqlite3 = require('sqlite3').verbose();

// Create or open the database file
const db = new sqlite3.Database('./student_attachment.db', (err) => {
  if (err) {
    console.error('❌ Could not connect to database:', err.message);
  } else {
    console.log('✅ Connected to SQLite database');
  }
});

// ---------- Create internship_applications table ----------
db.run(`
CREATE TABLE IF NOT EXISTS internship_applications (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  studentName TEXT NOT NULL,
  school TEXT NOT NULL,
  course TEXT NOT NULL,
  opportunity TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
)
`, (err) => {
  if (err) {
    console.error('❌ Error creating internship_applications table:', err.message);
  } else {
    console.log('✅ internship_applications table is ready');
  }
});

// ---------- Create companies table ----------
db.run(`
CREATE TABLE IF NOT EXISTS companies (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  location TEXT NOT NULL,
  description TEXT NOT NULL
)
`, (err) => {
  if (err) {
    console.error('❌ Error creating companies table:', err.message);
  } else {
    console.log('✅ companies table is ready');
  }
});

// ---------- Create opportunities table ----------
db.run(`
CREATE TABLE IF NOT EXISTS opportunities (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  companyId INTEGER NOT NULL,
  name TEXT NOT NULL,
  location TEXT NOT NULL,
  description TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (companyId) REFERENCES companies(id)
)
`, (err) => {
  if (err) {
    console.error('❌ Error creating opportunities table:', err.message);
  } else {
    console.log('✅ opportunities table is ready');
  }
});

module.exports = db;
