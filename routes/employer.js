const express = require('express');
const router = express.Router();
const protect = require('../middleware/authMiddleware');
const Assessment = require('../models/Assessment');
const User = require('../models/User');

// Get summary insights (for employers only)
router.get('/insights', protect, async (req, res) => {
  if (req.user.role !== 'employer') return res.status(403).json({ message: 'Access denied' });

  const assessments = await Assessment.find().populate('user', 'role');
  const summary = {
    total: assessments.length,
    byStressLevel: {
      low: 0,
      moderate: 0,
      high: 0
    }
  };

  assessments.forEach((a) => {
    const avg = a.answers.reduce((acc, q) => acc + q.score, 0) / a.answers.length;
    if (avg <= 2) summary.byStressLevel.low++;
    else if (avg <= 3.5) summary.byStressLevel.moderate++;
    else summary.byStressLevel.high++;
  });

  res.json(summary);
});

module.exports = router;
