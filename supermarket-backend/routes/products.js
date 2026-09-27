const express = require('express');
const router = express.Router();
const pool = require('../db');

// 1. جلب كل المنتجات
router.get('/', async (req, res) => {
  try {
    const queryText = `
      SELECT p.*, c.name AS category_name 
      FROM products p 
      LEFT JOIN categories c ON p.category_id = c.id 
      ORDER BY p.id DESC
    `;
    const result = await pool.query(queryText);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 2. إضافة منتج
router.post('/', async (req, res) => {
  const { barcode, name, category_id, buy_price, sell_price, stock_quantity, min_stock_alert, expiry_date } = req.body;
  try {
    const newProduct = await pool.query(
      `INSERT INTO products 
      (barcode, name, category_id, buy_price, sell_price, stock_quantity, min_stock_alert, expiry_date) 
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
      [barcode, name, category_id, buy_price, sell_price, stock_quantity || 0, min_stock_alert || 5, expiry_date || null]
    );
    res.status(201).json(newProduct.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 3. التزويد بالمخزون
router.post('/restock', async (req, res) => {
  const { product_id, quantity } = req.body;
  try {
    const result = await pool.query(
      'UPDATE products SET stock_quantity = stock_quantity + $1 WHERE id = $2 RETURNING *',
      [parseInt(quantity), parseInt(product_id)]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 4. التعديل (PUT /api/products/:id)
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { name, barcode, category_id, buy_price, sell_price, stock_quantity } = req.body;
  try {
    const result = await pool.query(
      `UPDATE products 
       SET name = $1, barcode = $2, category_id = $3, buy_price = $4, sell_price = $5, stock_quantity = $6 
       WHERE id = $7 RETURNING *`,
      [name, barcode, parseInt(category_id), parseFloat(buy_price), parseFloat(sell_price), parseInt(stock_quantity), parseInt(id)]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 5. الحذف (DELETE /api/products/:id)
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM products WHERE id = $1', [parseInt(id)]);
    res.json({ message: 'Product deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;