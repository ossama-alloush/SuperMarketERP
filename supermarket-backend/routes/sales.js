const express = require('express');
const router = express.Router();
const pool = require('../db');

// 1. جلب جميع الفواتير والمبيعات مع عناصرها
router.get('/', async (req, res) => {
  try {
    const queryText = `
      SELECT s.id AS sale_id, s.total_amount, s.created_at,
             json_agg(json_build_object(
               'product_id', si.product_id,
               'product_name', p.name,
               'quantity', si.quantity,
               'unit_price', si.unit_price,
               'subtotal', si.subtotal
             )) AS items
      FROM sales s
      JOIN sale_items si ON s.id = si.sale_id
      JOIN products p ON si.product_id = p.id
      GROUP BY s.id
      ORDER BY s.id DESC
    `;
    const result = await pool.query(queryText);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 2. إنشاء فاتورة بيع جديدة وتحديث المخزون (Transaction)
router.post('/', async (req, res) => {
  const client = await pool.connect();
  const { items, total_amount } = req.body; // items: [{ product_id, quantity, unit_price }]

  try {
    await client.query('BEGIN'); // بدء العملية الحساسة

    // أ. تسجيل الفاتورة الرئيسية
    const saleResult = await client.query(
      'INSERT INTO sales (total_amount) VALUES ($1) RETURNING *',
      [total_amount]
    );
    const saleId = saleResult.rows[0].id;

    // ب. إضافة عناصر الفاتورة وتحديث كميات المخزن
    for (let item of items) {
      const subtotal = item.quantity * item.unit_price;

      // إضافة بند الفاتورة
      await client.query(
        'INSERT INTO sale_items (sale_id, product_id, quantity, unit_price, subtotal) VALUES ($1, $2, $3, $4, $5)',
        [saleId, item.product_id, item.quantity, item.unit_price, subtotal]
      );

      // تخصيم الكمية المباعة من جدول المنتجات
      await client.query(
        'UPDATE products SET stock_quantity = stock_quantity - $1 WHERE id = $2',
        [item.quantity, item.product_id]
      );
    }

    await client.query('COMMIT'); // إنهاء الخزينة وتأكيد البيانات
    res.status(201).json({ message: 'Sale completed successfully', sale_id: saleId });
  } catch (err) {
    await client.query('ROLLBACK'); // إلغاء كل شيء في حال حدث أي خطأ
    res.status(500).json({ error: 'Transaction failed', details: err.message });
  } finally {
    client.release();
  }
});

module.exports = router;