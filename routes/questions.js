// routes/questions.js
const express = require('express');
const router = express.Router();
const { getAllQuestions } = require('../controllers/questionsController');

// This handles GET requests to '/api/questions'
router.get('/', getAllQuestions);

module.exports = router;