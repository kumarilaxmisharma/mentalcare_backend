// routes/assessments.js
const express = require('express');
const router = express.Router();
const { Assessment, Recommendation, Company } = require('../models');

const calculateRisk = (score) => { /* ... same as before ... */ };

// POST /api/assessments/submit (Anonymous)
router.post('/submit', async (req, res) => {
  try {
    // The form now includes demographics and the invite code
    const { answers, specialization, gender, inviteCode } = req.body;

    if (!inviteCode || !answers || !specialization || !gender) {
        return res.status(400).json({ message: 'All assessment fields, including inviteCode, are required.' });
    }

    // Find the company using the invite code to get its ID
    const company = await Company.findOne({ where: { inviteCode } });
    if (!company) {
      return res.status(400).json({ message: 'Invalid invite code.' });
    }

    const score = answers.reduce((sum, value) => sum + Number(value), 0);
    const riskLevel = calculateRisk(score);

    await Assessment.create({
      specialization,
      gender,
      role: 'employee', // Role is now hardcoded as we know only employees submit this
      companyId: company.id,
      answers,
      score,
      riskLevel,
    });

    const recommendation = await Recommendation.findOne({ where: { riskLevel } });

    res.status(201).json({
      riskLevel,
      recommendation: recommendation ? recommendation.text : 'No recommendation found.',
    });
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

module.exports = router;