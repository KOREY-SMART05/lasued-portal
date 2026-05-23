const express = require('express');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

router.use(authenticateToken);

router.get('/', async (req, res) => {
  try {
    const pool = require('../config/database');
    const result = await pool.query(
      `SELECT r.id, c.code, c.title, c.credits, r.score, r.grade, r.gpa, r.semester 
       FROM results r 
       JOIN courses c ON r.course_id = c.id 
       WHERE r.student_id = $1 
       ORDER BY r.semester DESC, c.code`,
      [req.user.id]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch results', details: err.message });
  }
});

router.get('/gpa/summary', async (req, res) => {
  try {
    const pool = require('../config/database');
    const result = await pool.query(
      `SELECT 
        AVG(gpa) as overall_gpa, 
        COUNT(*) as courses_completed,
        MAX(gpa) as highest_gpa,
        MIN(gpa) as lowest_gpa
       FROM results 
       WHERE student_id = $1`,
      [req.user.id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch GPA summary', details: err.message });
  }
});

module.exports = router;
