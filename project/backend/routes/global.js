const express = require('express');
const { getDB } = require('../db/database');

const router = express.Router();

// GET /api/global — get global settings
router.get('/', (req, res) => {
  try {
    const db = getDB();
    const settings = db.prepare('SELECT * FROM global_settings WHERE id = 1').get();
    res.json(settings);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch settings' });
  }
});

// PATCH /api/global — update global settings
router.patch('/', (req, res) => {
  const { buttons_disabled, inputs_disabled, tables_hidden } = req.body;

  try {
    const db = getDB();
    const current = db.prepare('SELECT * FROM global_settings WHERE id = 1').get();

    const next = {
      buttons_disabled: buttons_disabled !== undefined ? (buttons_disabled ? 1 : 0) : current.buttons_disabled,
      inputs_disabled: inputs_disabled !== undefined ? (inputs_disabled ? 1 : 0) : current.inputs_disabled,
      tables_hidden: tables_hidden !== undefined ? (tables_hidden ? 1 : 0) : current.tables_hidden,
    };

    db.prepare(`
      UPDATE global_settings
      SET buttons_disabled = ?, inputs_disabled = ?, tables_hidden = ?, updated_at = datetime('now')
      WHERE id = 1
    `).run(next.buttons_disabled, next.inputs_disabled, next.tables_hidden);

    res.json({ ...next, updated_at: new Date().toISOString() });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update settings' });
  }
});

module.exports = router;
