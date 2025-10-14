const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./database.db');

db.run("ALTER TABLE opportunities ADD COLUMN company INTEGER", (err) => {
  if (err && !err.message.includes('duplicate column')) {
    console.error('❌ Error adding company column:', err.message);
  } else {
    console.log('✅ Company column added successfully or already exists.');
  }
  db.close();
});
