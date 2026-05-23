const pool = require('../config/database');

// Get student profile
exports.getProfile = async (req, res) => {
  try {
    const studentId = req.user.id;

    const result = await pool.query(
      'SELECT id, email, name, matric_no, phone, department, level, status, created_at FROM users WHERE id = $1',
      [studentId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Student not found' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch profile', details: err.message });
  }
};

// Update student profile
exports.updateProfile = async (req, res) => {
  try {
    const studentId = req.user.id;
    const { phone, department, level } = req.body;

    const result = await pool.query(
      'UPDATE users SET phone = $1, department = $2, level = $3, updated_at = CURRENT_TIMESTAMP WHERE id = $4 RETURNING id, email, name, matric_no, phone, department, level',
      [phone, department, level, studentId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Student not found' });
    }

    res.json({ message: 'Profile updated successfully', user: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update profile', details: err.message });
  }
};

// Get student dashboard info
exports.getDashboard = async (req, res) => {
  try {
    const studentId = req.user.id;

    // Get student info
    const studentResult = await pool.query(
      'SELECT name, matric_no, department, level FROM users WHERE id = $1',
      [studentId]
    );

    // Get enrolled courses
    const coursesResult = await pool.query(
      `SELECT cr.id, c.code, c.title, c.credits, cr.status 
       FROM course_registration cr 
       JOIN courses c ON cr.course_id = c.id 
       WHERE cr.student_id = $1 AND cr.status = 'registered'`,
      [studentId]
    );

    // Get recent results
    const resultsResult = await pool.query(
      `SELECT r.id, c.code, c.title, r.score, r.grade, r.gpa, r.semester 
       FROM results r 
       JOIN courses c ON r.course_id = c.id 
       WHERE r.student_id = $1 
       ORDER BY r.uploaded_at DESC LIMIT 5`,
      [studentId]
    );

    // Get payment status
    const paymentsResult = await pool.query(
      `SELECT COUNT(*) as total_payments, 
              SUM(CASE WHEN status = 'completed' THEN amount ELSE 0 END) as paid_amount,
              SUM(CASE WHEN status = 'pending' THEN amount ELSE 0 END) as pending_amount
       FROM payments WHERE student_id = $1`,
      [studentId]
    );

    res.json({
      student: studentResult.rows[0],
      courses: coursesResult.rows,
      recentResults: resultsResult.rows,
      payments: paymentsResult.rows[0]
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch dashboard', details: err.message });
  }
};
