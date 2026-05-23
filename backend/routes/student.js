const express = require('express');
const studentController = require('../controllers/studentController');
const { authenticateToken, authorizeRole } = require('../middleware/auth');

const router = express.Router();

router.use(authenticateToken);

router.get('/profile', studentController.getProfile);
router.put('/profile', studentController.updateProfile);
router.get('/dashboard', studentController.getDashboard);

module.exports = router;
