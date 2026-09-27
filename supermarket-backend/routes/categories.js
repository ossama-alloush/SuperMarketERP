const express = require('express');
const router = express.Router();
const pool = require('../db');

// 1. جلب كل الفئات
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM categories ORDER BY id ASC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 2. إضافة فئة جديدة
router.post('/', async (req, res) => {
  const { name } = req.body;
  try {
    const newCategory = await pool.query(
      'INSERT INTO categories (name) VALUES ($1) RETURNING *',
      [name]
    );
    res.status(201).json(newCategory.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;