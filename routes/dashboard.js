// routes/dashboard.js
const express = require('express');
const router = express.Router();
const { Assessment, Employee } = require('../models');
const { protect } = require('../middleware/authMiddleware');

// GET /api/dashboard/summary
// In a real app, you might add another middleware to check if req.employee.role is 'employer'
router.get('/summary', protect, async (req, res) => {
  try {
    const assessments = await Assessment.findAll({
      include: [{ model: Employee, attributes: ['department', 'gender'] }],
    });

    const summary = {
      totalAssessments: assessments.length,
      byRiskLevel: { Low: 0, Moderate: 0, High: 0 },
      byDepartment: {},
      byGender: {},
    };

    assessments.forEach(assessment => {
      const { riskLevel } = assessment;
      const { department, gender } = assessment.Employee;

      summary.byRiskLevel[riskLevel]++;
      if (!summary.byDepartment[department]) {
        summary.byDepartment[department] = { Low: 0, Moderate: 0, High: 0 };
      }
      summary.byDepartment[department][riskLevel]++;
      if (!summary.byGender[gender]) {
        summary.byGender[gender] = { Low: 0, Moderate: 0, High: 0 };
      }
      summary.byGender[gender][riskLevel]++;
    });

    res.status(200).json(summary);
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

module.exports = router;