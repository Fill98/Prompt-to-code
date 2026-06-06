const express = require('express');
const { getDB } = require('../db/database');

const router = express.Router();

// POST /api/logs — save error log
router.post('/', (req, res) => {
  const { page, field_name, message } = req.body;

  if (!page || !field_name) {
    return res.status(400).json({ error: 'page and field_name are required' });
  }

  try {
    const db = getDB();
    const stmt = db.prepare(
      `INSERT INTO error_logs (page, field_name, message, timestamp)
       VALUES (?, ?, ?, datetime('now'))`
    );
    const result = stmt.run(page, field_name, message || 'ERROR detected');
    console.log(`[LOG] Page: ${page} | Field: ${field_name} | "${message}"`);
    res.status(201).json({ id: result.lastInsertRowid });
  } catch (err) {
    console.error('DB error:', err);
    res.status(500).json({ error: 'Failed to save log' });
  }
});

// GET /api/logs — fetch all logs
router.get('/', (req, res) => {
  try {
    const db = getDB();
    const logs = db.prepare(
      `SELECT * FROM error_logs ORDER BY timestamp DESC LIMIT 100`
    ).all();
    res.json(logs);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch logs' });
  }
});

// DELETE /api/logs — clear all logs
router.delete('/', (req, res) => {
  try {
    const db = getDB();
    db.prepare('DELETE FROM error_logs').run();
    res.json({ message: 'Logs cleared' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to clear logs' });
  }
});

module.exports = router;
