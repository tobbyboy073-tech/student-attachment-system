// --- SERVER.JS ---
// Run with: node server.js

const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const cors = require("cors");
const path = require("path");

const app = express();
app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname, "public")));

// --- CONNECT TO DATABASE ---
const db = new sqlite3.Database("./database.db", (err) => {
  if (err) console.error("❌ Database connection failed:", err);
  else console.log("✅ Connected to SQLite database.");
});

// --- CREATE TABLES ---
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS students (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    course TEXT,
    school TEXT
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS companies (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    location TEXT
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS opportunities (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT,
    description TEXT,
    companyId INTEGER,
    FOREIGN KEY(companyId) REFERENCES companies(id)
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS applications (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    studentId INTEGER,
    opportunityId INTEGER,
    coverLetter TEXT,
    FOREIGN KEY(studentId) REFERENCES students(id),
    FOREIGN KEY(opportunityId) REFERENCES opportunities(id)
  )`);
});

// --- AUTO-SEED DATABASE ---
db.serialize(() => {
  db.get("SELECT COUNT(*) AS count FROM students", (err, row) => {
    if (row.count === 0) {
      console.log("🧑‍🎓 Inserting sample students...");
      const students = [
        ["John Mwangi", "Computer Science", "JKUAT"],
        ["Sarah Njeri", "Information Technology", "Kabarak University"],
        ["Brian Otieno", "Software Engineering", "Kenyatta University"],
        ["Faith Chebet", "Computer Engineering", "University of Nairobi"],
        ["Kevin Kiprotich", "Data Science", "Egerton University"]
      ];
      students.forEach(s =>
        db.run("INSERT INTO students (name, course, school) VALUES (?, ?, ?)", s)
      );
    }
  });

  db.get("SELECT COUNT(*) AS count FROM companies", (err, row) => {
    if (row.count === 0) {
      console.log("🏢 Inserting sample companies...");
      const companies = [
        ["Safaricom", "Nairobi"],
        ["KCB Bank", "Nakuru"],
        ["Equity Group", "Kisumu"],
        ["IBM Kenya", "Nairobi"],
        ["KenGen", "Naivasha"]
      ];
      companies.forEach(c =>
        db.run("INSERT INTO companies (name, location) VALUES (?, ?)", c)
      );
    }
  });

  db.get("SELECT COUNT(*) AS count FROM opportunities", (err, row) => {
    if (row.count === 0) {
      console.log("💼 Inserting sample opportunities...");
      const opportunities = [
        ["Software Developer Intern", "Assist in building web apps", 1],
        ["Data Analyst Trainee", "Work with data dashboards", 2],
        ["Network Support Intern", "Support system maintenance", 3],
        ["AI Research Assistant", "Work on AI-related tasks", 4],
        ["Power Systems Intern", "Help maintain electrical systems", 5]
      ];
      opportunities.forEach(o =>
        db.run("INSERT INTO opportunities (title, description, companyId) VALUES (?, ?, ?)", o)
      );
    }
  });
});

// --- GET ROUTES ---
app.get("/api/students", (req, res) => {
  console.log("📥 GET /api/students");
  db.all("SELECT * FROM students", (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.get("/api/companies", (req, res) => {
  console.log("📥 GET /api/companies");
  db.all("SELECT * FROM companies", (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.get("/api/opportunities", (req, res) => {
  console.log("📥 GET /api/opportunities");
  const query = `
    SELECT opportunities.id, opportunities.title, opportunities.description, companies.name AS company
    FROM opportunities
    JOIN companies ON opportunities.companyId = companies.id
  `;
  db.all(query, (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.get("/api/applications", (req, res) => {
  console.log("📥 GET /api/applications");
  const query = `
    SELECT applications.id, students.name AS student, opportunities.title AS opportunity, applications.coverLetter
    FROM applications
    JOIN students ON applications.studentId = students.id
    JOIN opportunities ON applications.opportunityId = opportunities.id
  `;
  db.all(query, (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// --- POST ROUTES ---
// Add student
app.post("/api/students", (req, res) => {
  const { name, course, school } = req.body;
  if (!name || !course || !school)
    return res.status(400).json({ error: "All fields are required" });

  db.run(
    "INSERT INTO students (name, course, school) VALUES (?, ?, ?)",
    [name, course, school],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: "✅ Student added successfully", id: this.lastID });
    }
  );
});

// Add company
app.post("/api/companies", (req, res) => {
  const { name, location } = req.body;
  if (!name || !location)
    return res.status(400).json({ error: "Both name and location are required" });

  db.run(
    "INSERT INTO companies (name, location) VALUES (?, ?)",
    [name, location],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: "✅ Company added successfully", id: this.lastID });
    }
  );
});

// Add opportunity
app.post("/api/opportunities", (req, res) => {
  const { title, description, companyId } = req.body;
  if (!title || !description || !companyId)
    return res.status(400).json({ error: "All fields are required" });

  db.run(
    "INSERT INTO opportunities (title, description, companyId) VALUES (?, ?, ?)",
    [title, description, companyId],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: "✅ Opportunity added successfully", id: this.lastID });
    }
  );
});

// Add application
app.post("/api/applications", (req, res) => {
  const { studentId, opportunityId, coverLetter } = req.body;
  if (!studentId || !opportunityId || !coverLetter)
    return res.status(400).json({ error: "All fields are required" });

  db.run(
    "INSERT INTO applications (studentId, opportunityId, coverLetter) VALUES (?, ?, ?)",
    [studentId, opportunityId, coverLetter],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: "✅ Application submitted successfully", id: this.lastID });
    }
  );
});

// --- START SERVER ---
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
