const express = require('express');
const router = express.Router();
const { protect, restrictTo } = require('../middleware/authMiddleware');
const assessmentController = require('../controllers/assessmentsController');

// Public route for employees to submit an assessment
router.post('/submit', assessmentController.submitAssessment);

// Protected route for an employer to view all assessments for their company
router.get('/', protect, restrictTo('employer'), assessmentController.getCompanyAssessments);

module.exports = router;