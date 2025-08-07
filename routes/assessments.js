// routes/assessments.js
const express = require('express');
const router = express.Router();
const { Assessment } = require ('../models/Assessment');
const { Recommendation } = require('../models/Recommendation');
const { protect } = require('../middleware/authMiddleware');

const calculateRisk = (score) => {
  if (score <= 42) return 'Low';
  if (score <= 66) return 'Moderate';
  return 'High';
};

// POST /api/assessments/submit
router.post('/submit', protect, async (req, res) => {
  const { answers } = req.body;
  const employeeId = req.employee.id; // Get ID from the authenticated user

  if (!Array.isArray(answers) || answers.length !== 18) {
    return res.status(400).json({ message: 'An array of 18 answers is required.' });
  }

  const score = answers.reduce((sum, value) => sum + Number(value), 0);
  const riskLevel = calculateRisk(score);

  await Assessment.create({ employeeId, answers, score, riskLevel });
  const recommendation = await Recommendation.findOne({ where: { riskLevel } });

  res.status(201).json({
    riskLevel,
    recommendation: recommendation.text,
  });
});

module.exports = router;