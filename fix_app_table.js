// fix_app_table.js
// Run: node fix_app_table.js
// This script will:
// 1) Connect to ./database.db
// 2) Show the current columns for table 'applications'
// 3) Add missing columns: student, opportunity, coverLetter (if not present)

const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const dbPath = './database.db';

if (!fs.existsSync(dbPath)) {
  console.error(`Error: database file not found at ${dbPath}`);
  process.exit(1);
}

const db = new sqlite3.Database(dbPath, sqlite3.OPEN_READWRITE, (err) => {
  if (err) {
    console.error('Failed to open database:', err.message);
    process.exit(1);
  }
});

function getColumns(cb) {
  db.all(`PRAGMA table_info(applications);`, (err, rows) => {
    if (err) return cb(err);
    const cols = rows.map(r => r.name);
    cb(null, cols);
  });
}

function addColumnIfMissing(colName, type, cb) {
  getColumns((err, cols) => {
    if (err) return cb(err);
    if (cols.includes(colName)) {
      console.log(`Column '${colName}' already exists — skipping.`);
      return cb(null, false);
    }
    const sql = `ALTER TABLE applications ADD COLUMN ${colName} ${type};`;
    db.run(sql, function (err) {
      if (err) return cb(err);
      console.log(`Added column '${colName}' (${type}).`);
      cb(null, true);
    });
  });
}

function main() {
  console.log('Checking applications table columns...');
  getColumns((err, cols) => {
    if (err) {
      console.error('Error reading table info:', err.message);
      db.close();
      process.exit(1);
    }

    console.log('Existing columns:', cols.join(', ') || '(none)');

    // List of columns we expect (as used by your server.js)
    const expected = [
      { name: 'student', type: 'TEXT' },
      { name: 'opportunity', type: 'TEXT' },
      { name: 'coverLetter', type: 'TEXT' }
    ];

    // Process sequentially
    (function next(i) {
      if (i >= expected.length) {
        console.log('Done. Final table columns:');
        getColumns((err2, finalCols) => {
          if (!err2) console.log(finalCols.join(', '));
          db.close();
        });
        return;
      }
      const c = expected[i];
      addColumnIfMissing(c.name, c.type, (err3) => {
        if (err3) {
          console.error(`Failed to ensure column ${c.name}:`, err3.message);
          db.close();
          process.exit(1);
        }
        next(i + 1);
      });
    })(0);
  });
}

main();
