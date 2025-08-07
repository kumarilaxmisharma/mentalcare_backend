const express = require('express');
const router = express.Router();
const protect = require('../middleware/authMiddleware');
const Assessment = require('../models/Assessment');

// Submit assessment
router.post('/submit', protect, async (req, res) => {
  const { answers } = req.body;
  const assessment = new Assessment({
    user: req.user._id,
    answers
  });
  await assessment.save();
  res.status(201).json({ message: 'Assessment submitted' });
  

});
