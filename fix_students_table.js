const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./database.db');

db.run("ALTER TABLE students ADD COLUMN phone TEXT", (err) => {
  if (err && !err.message.includes('duplicate column')) {
    console.error('❌ Error adding phone column:', err.message);
  } else {
    console.log('✅ Phone column added successfully or already exists.');
  }
  db.close();
});
