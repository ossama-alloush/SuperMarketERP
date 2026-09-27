const express = require('express');
const cors = require('cors');
require('dotenv').config();
const pool = require('./db');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/categories', require('./routes/categories'));
app.use('/api/products', require('./routes/products'));
app.use('/api/sales', require('./routes/sales'));
app.use('/api/damaged', require('./routes/damaged'));
// Test Route
app.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.json({
      message: 'Supermarket ERP API is running!',
      db_time: result.rows[0].now
    });
  } catch (err) {
    console.error('Database Connection Error:', err.message);
    res.status(500).json({ error: 'Database connection failed', details: err.message });
  }
});

// Suppliers Routes
app.get('/api/suppliers', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM suppliers ORDER BY id DESC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/suppliers', async (req, res) => {
  const { name, phone, company } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO suppliers (name, phone, company) VALUES ($1, $2, $3) RETURNING *',
      [name, phone, company]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});