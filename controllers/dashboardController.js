// Controller for dashboard
const { Company, Employee, Assessment } = require('../models');
const { Op } = require('sequelize');
const specialization = require('../models/Specialization.js');
const db = require('../models/index.js');


exports.getDashboardSummary = async (req, res) => {
  try {
    const companyId = req.user.companyId;
    const assessments = await Assessment.findAll({ where: { companyId: companyId } });


    // Fetch an assessment by its ID and include its related specialization
    const assessmentForDashboard = await Assessment.findByPk(1, {
      include: Specialization, // This is the magic part!
    });

    const summary = {
      totalAssessments: assessments.length,
      byRiskLevel: { Low: 0, Moderate: 0, High: 0 },
      bySpecialization: {},
      byGender: {},
      assessmentsByMonth: {} // ✅ Add this to hold monthly data
    };

    assessments.forEach(assessment => {
      const { riskLevel, specialization, gender, createdAt } = assessment;

      // --- Your existing logic (which is correct) ---
      summary.byRiskLevel[riskLevel]++;
      if (!summary.bySpecialization[specialization]) {
        summary.bySpecialization[specialization] = { Low: 0, Moderate: 0, High: 0 };
      }
      summary.bySpecialization[specialization][riskLevel]++;
      if (!summary.byGender[gender]) {
        summary.byGender[gender] = { Low: 0, Moderate: 0, High: 0 };
      }
      summary.byGender[gender][riskLevel]++;
      
      // ✅ --- ADD THIS NEW LOGIC FOR THE LINE CHART ---
      // Get the month and year (e.g., "2025-08")
      const month = createdAt.toISOString().substring(0, 7); 
      if (!summary.assessmentsByMonth[month]) {
        summary.assessmentsByMonth[month] = { total: 0, Low: 0, Moderate: 0, High: 0 };
      }
      summary.assessmentsByMonth[month].total++;
      summary.assessmentsByMonth[month][riskLevel]++;
    });

    res.status(200).json(summary);
  } catch (error) {
    console.error('Error in getDashboardSummary:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};