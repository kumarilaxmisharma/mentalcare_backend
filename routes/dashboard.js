const express = require('express');
const router = express.Router();
const { protect, restrictTo } = require('../middleware/authMiddleware');
const dashboardController = require('../controllers/dashboardController');

// This route now correctly and securely points to your getDashboardSummary function
router.get('/summary', protect, restrictTo('employer'), dashboardController.getDashboardSummary);

module.exports = router;