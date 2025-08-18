// routes/questions.js
const express = require('express');
const router = express.Router();
const questionsController = require('../controllers/questionsController');

// GET /api/questions
router.get('/', questionsController.getAllQuestions);

module.exports = router;