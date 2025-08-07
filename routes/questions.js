// routes/questions.js
const express = require('express');
const router = express.Router();
const { Question } = require('../models/Question');

// GET /api/questions
router.get('/', async (req, res) => {
  try {
    const questions = await Question.findAll({ order: [['id', 'ASC']] });
    res.status(200).json(questions);
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

module.exports = router;