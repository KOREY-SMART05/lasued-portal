const express = require('express');
const { authenticateToken, authorizeRole } = require('../middleware/auth');

const router = express.Router();

router.use(authenticateToken);
router.use(authorizeRole(['admin']));

router.get('/students', async (req, res) => {
  try {
    const pool = require('../config/database');
    const result = await pool.query(
      'SELECT id, email, name, matric_no, department, level, status FROM users WHERE role = $1 ORDER BY name',
      ['student']
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch students', details: err.message });
  }
});

router.post('/results/upload', async (req, res) => {
  try {
    const pool = require('../config/database');
    const { student_id, course_id, score, grade, gpa, semester } = req.body;

    if (!student_id || !course_id || score === undefined || !grade) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const result = await pool.query(
      `INSERT INTO results (student_id, course_id, score, grade, gpa, semester) 
       VALUES ($1, $2, $3, $4, $5, $6) 
       ON CONFLICT (student_id, course_id, semester) DO UPDATE SET 
       score = $3, grade = $4, gpa = $5 
       RETURNING id`,
      [student_id, course_id, score, grade, gpa, semester]
    );

    res.status(201).json({ message: 'Result uploaded successfully', result_id: result.rows[0].id });
  } catch (err) {
    res.status(500).json({ error: 'Failed to upload result', details: err.message });
  }
});

router.post('/courses', async (req, res) => {
  try {
    const pool = require('../config/database');
    const { code, title, credits, semester, department } = req.body;

    if (!code || !title || !credits || !semester) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const result = await pool.query(
      'INSERT INTO courses (code, title, credits, semester, department) VALUES ($1, $2, $3, $4, $5) RETURNING id',
      [code, title, credits, semester, department]
    );

    res.status(201).json({ message: 'Course created successfully', course_id: result.rows[0].id });
  } catch (err) {
    res.status(500).json({ error: 'Failed to create course', details: err.message });
  }
});

router.put('/payments/:payment_id', async (req, res) => {
  try {
    const pool = require('../config/database');
    const { payment_id } = req.params;
    const { status } = req.body;

    if (!['completed', 'failed'].includes(status)) {
      return res.status(400).json({ error: 'Invalid payment status' });
    }

    await pool.query(
      'UPDATE payments SET status = $1, payment_date = CURRENT_TIMESTAMP WHERE id = $2',
      [status, payment_id]
    );

    res.json({ message: 'Payment status updated' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update payment', details: err.message });
  }
});

module.exports = router;
