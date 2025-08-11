const express = require('express');
const router = express.Router();
const { protect, restrictTo } = require('../middleware/authMiddleware');
const { Assessment } = require('../models');

const getDashboardSummary = async (req, res) => {
  try {
    const companyId = req.user.companyId;

    const assessments = await Assessment.findAll({
      where: { companyId: companyId },
    });

    // ✅ Initialize with bySpecialization
    const summary = {
      totalAssessments: assessments.length,
      byRiskLevel: { Low: 0, Moderate: 0, High: 0 },
      bySpecialization: {},
      byGender: {},
    };

    assessments.forEach(assessment => {
      // ✅ Use specialization, not department
      const { riskLevel, specialization, gender } = assessment;

      summary.byRiskLevel[riskLevel]++;

      // ✅ Correctly reference bySpecialization
      if (!summary.bySpecialization[specialization]) {
        summary.bySpecialization[specialization] = { Low: 0, Moderate: 0, High: 0 };
      }
      summary.bySpecialization[specialization][riskLevel]++;

      if (!summary.byGender[gender]) {
        summary.byGender[gender] = { Low: 0, Moderate: 0, High: 0 };
      }
      summary.byGender[gender][riskLevel]++;
    });

    res.status(200).json(summary);
  } catch (error) {
    console.error("Error in getDashboardSummary:", error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

router.get('/summary', protect, restrictTo('employer'), getDashboardSummary);

module.exports = router;