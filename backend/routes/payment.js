const express = require('express');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

router.use(authenticateToken);

router.get('/', async (req, res) => {
  try {
    const pool = require('../config/database');
    const result = await pool.query(
      `SELECT id, amount, description, status, payment_method, reference_no, payment_date, created_at 
       FROM payments 
       WHERE student_id = $1 
       ORDER BY created_at DESC`,
      [req.user.id]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch payments', details: err.message });
  }
});

router.get('/summary', async (req, res) => {
  try {
    const pool = require('../config/database');
    const result = await pool.query(
      `SELECT 
        SUM(CASE WHEN status = 'completed' THEN amount ELSE 0 END) as total_paid,
        SUM(CASE WHEN status = 'pending' THEN amount ELSE 0 END) as total_pending,
        COUNT(*) as total_transactions
       FROM payments 
       WHERE student_id = $1`,
      [req.user.id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch payment summary', details: err.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const pool = require('../config/database');
    const { amount, description, payment_method } = req.body;

    if (!amount || !description) {
      return res.status(400).json({ error: 'Amount and description are required' });
    }

    const result = await pool.query(
      'INSERT INTO payments (student_id, amount, description, payment_method, status) VALUES ($1, $2, $3, $4, $5) RETURNING id',
      [req.user.id, amount, description, payment_method || 'bank_transfer', 'pending']
    );

    res.status(201).json({ message: 'Payment initiated', payment_id: result.rows[0].id });
  } catch (err) {
    res.status(500).json({ error: 'Failed to create payment', details: err.message });
  }
});

module.exports = router;
