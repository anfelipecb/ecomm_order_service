const express = require('express');
const cors = require('cors');
const axios = require('axios');
const { Pool } = require('pg');
const prom = require('prom-client');

const app = express();
app.use(cors());
app.use(express.json());

const register = new prom.Registry();
prom.collectDefaultMetrics({ register });

// Database connection
const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'ecommerce',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'password',
  port: 5432,
});

const PRODUCT_SERVICE_URL = process.env.PRODUCT_SERVICE_URL || 'http://localhost:3001';

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', version: '2.0-phase6' });
});

// Prometheus metrics
app.get('/metrics', async (req, res) => {
  res.set('Content-Type', register.contentType);
  res.end(await register.metrics());
});

// Get all orders
app.get('/orders', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM orders ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

// Create order
app.post('/orders', async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    // Verify product exists (call product service)
    const productResponse = await axios.get(`${PRODUCT_SERVICE_URL}/products/${productId}`);
    const product = productResponse.data;

    const totalPrice = product.price * quantity;

    const result = await pool.query(
      'INSERT INTO orders (product_id, quantity, total_price, status) VALUES ($1, $2, $3, $4) RETURNING *',
      [productId, quantity, totalPrice, 'pending']
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    if (err.response && err.response.status === 404) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.status(500).json({ error: 'Error creating order' });
  }
});

// Update order status
app.patch('/orders/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const result = await pool.query(
      'UPDATE orders SET status = $1 WHERE id = $2 RETURNING *',
      [status, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
  console.log(`Order service running on port ${PORT}`);
});
