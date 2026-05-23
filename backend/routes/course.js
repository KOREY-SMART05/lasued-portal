const express = require('express');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

router.use(authenticateToken);

router.get('/', async (req, res) => {
  try {
    const pool = require('../config/database');
    const result = await pool.query('SELECT id, code, title, credits, semester, department FROM courses ORDER BY code');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch courses', details: err.message });
  }
});

router.get('/registered', async (req, res) => {
  try {
    const pool = require('../config/database');
    const result = await pool.query(
      `SELECT cr.id, c.id as course_id, c.code, c.title, c.credits, c.semester, cr.status 
       FROM course_registration cr 
       JOIN courses c ON cr.course_id = c.id 
       WHERE cr.student_id = $1 
       ORDER BY c.code`,
      [req.user.id]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch registered courses', details: err.message });
  }
});

router.post('/register', async (req, res) => {
  try {
    const pool = require('../config/database');
    const { course_id, semester } = req.body;

    if (!course_id || !semester) {
      return res.status(400).json({ error: 'Course ID and semester are required' });
    }

    const result = await pool.query(
      'INSERT INTO course_registration (student_id, course_id, semester) VALUES ($1, $2, $3) RETURNING id',
      [req.user.id, course_id, semester]
    );

    res.status(201).json({ message: 'Course registered successfully', registration_id: result.rows[0].id });
  } catch (err) {
    res.status(500).json({ error: 'Failed to register course', details: err.message });
  }
});

router.delete('/:registration_id', async (req, res) => {
  try {
    const pool = require('../config/database');
    const { registration_id } = req.params;

    await pool.query(
      'UPDATE course_registration SET status = $1 WHERE id = $2 AND student_id = $3',
      ['dropped', registration_id, req.user.id]
    );

    res.json({ message: 'Course dropped successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to drop course', details: err.message });
  }
});

module.exports = router;
