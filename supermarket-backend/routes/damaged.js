const express = require('express');
const router = express.Router();
const pool = require('../db');

// 1. جلب كل المرتجعات والتالف
router.get('/', async (req, res) => {
  try {
    const query = `
      SELECT d.*, p.name AS product_name, p.barcode 
      FROM damaged_products d
      JOIN products p ON d.product_id = p.id
      ORDER BY d.created_at DESC
    `;
    const result = await pool.query(query);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 2. تسجيل منتج تالف/منتهي الصلاحية وخصمه من المخزون
router.post('/', async (req, res) => {
  const { product_id, quantity, reason, buy_price } = req.body;
  const cost_loss = parseFloat(buy_price) * parseInt(quantity);

  try {
    // أ) تسجيل العملية بالجدول
    const damagedResult = await pool.query(
      `INSERT INTO damaged_products (product_id, quantity, reason, cost_loss)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [product_id, parseInt(quantity), reason, cost_loss]
    );

    // ب) خصم الكمية من جدول المنتجات الأساسي
    await pool.query(
      `UPDATE products 
       SET stock_quantity = GREATEST(0, stock_quantity - $1) 
       WHERE id = $2`,
      [parseInt(quantity), product_id]
    );

    res.status(201).json(damagedResult.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;