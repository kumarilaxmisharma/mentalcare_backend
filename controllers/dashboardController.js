// Controller for dashboard
const { Company, Employee, Assessment } = require('../models');
const { Op } = require('sequelize');

exports.getCompanyDashboard = async (req, res) => {
  try {
    const companyId = req.company ? req.company.id : req.query.companyId;
    if (!companyId) {
      return res.status(400).json({ message: 'Company ID required' });
    }

    // Get all employees for the company
    const employees = await Employee.findAll({ where: { companyId } });
    const totalEmployees = employees.length;
    const totalFemale = employees.filter(e => e.gender === 'female').length;
    const totalMale = employees.filter(e => e.gender === 'male').length;

    // Get all assessments for employees in this company
    const assessments = await Assessment.findAll({ where: { companyId } });
    const employeeIdsWithAssessment = new Set(assessments.map(a => a.employeeId));
    const totalAssessed = employeeIdsWithAssessment.size;

    // Number of male and female employees who have done the assessment
    const assessedMale = assessments.filter(a => a.gender === 'male').length;
    const assessedFemale = assessments.filter(a => a.gender === 'female').length;

    // Stress level by specialization
    const specializationStats = {};
    assessments.forEach(a => {
      if (!specializationStats[a.specialization]) specializationStats[a.specialization] = { low: 0, medium: 0, high: 0 };
      specializationStats[a.specialization][a.riskLevel] = (specializationStats[a.specialization][a.riskLevel] || 0) + 1;
    });

    // Stress level by gender
    const genderStats = { female: { low: 0, medium: 0, high: 0 }, male: { low: 0, medium: 0, high: 0 } };
    assessments.forEach(a => {
      if (a.gender === 'female') genderStats.female[a.riskLevel] = (genderStats.female[a.riskLevel] || 0) + 1;
      if (a.gender === 'male') genderStats.male[a.riskLevel] = (genderStats.male[a.riskLevel] || 0) + 1;
    });

    // Line chart: number of employees who have taken the test over time
    // Group by date (assuming Assessment has createdAt field)
    const lineChartData = {};
    assessments.forEach(a => {
      const date = a.createdAt.toISOString().split('T')[0];
      lineChartData[date] = (lineChartData[date] || 0) + 1;
    });
    const lineChart = Object.entries(lineChartData).map(([date, count]) => ({ date, count }));

    res.status(200).json({
      totalEmployees,
      totalFemale,
      totalMale,
      totalAssessed,
      assessedMale,
      assessedFemale,
      specializationStats,
      genderStats,
      lineChart
    });
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

exports.getEmployeeDashboard = async (req, res) => {
  try {
    const employeeId = req.employee ? req.employee.id : req.query.employeeId;
    if (!employeeId) {
      return res.status(400).json({ message: 'Employee ID required' });
    }
    const employee = await Employee.findByPk(employeeId, { include: [Company] });
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }
    res.status(200).json(employee);
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

exports.getDashboardSummary = async (req, res) => {
  try {
    const companyId = req.user.companyId;
    const assessments = await Assessment.findAll({ where: { companyId } });
    const summary = {
      totalAssessments: assessments.length,
      byRiskLevel: { Low: 0, Moderate: 0, High: 0 },
      bySpecialization: {},
      byGender: {},
    };
    assessments.forEach(assessment => {
      const { riskLevel, specialization, gender } = assessment;
      summary.byRiskLevel[riskLevel]++;
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
    console.error('Error in getDashboardSummary:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
