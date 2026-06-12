const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

const db = new sqlite3.Database('./database.sqlite', (err) => {
  if (err) console.error(err.message);
  console.log('Connected to the SQLite database.');
});

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    message TEXT,
    page_id TEXT,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);
});

app.post('/logs', (req, res) => {
  const { message, page_id } = req.body;
  db.run(`INSERT INTO logs (message, page_id) VALUES (?, ?)`, [message, page_id], function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(200).json({ id: this.lastID, message: 'Log saved' });
  });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
