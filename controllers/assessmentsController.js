const axios = require('axios');
const { Assessment, Recommendation, Company } = require('../models');
const recommendations = require('../data/recommendations.json');

// Helper function to calculate risk from the score
const calculateRisk = (score) => {
  if (score <= 42) return 'Low';
  if (score <= 66) return 'Moderate';
  return 'High';
};

/**
 * @desc    Submit an anonymous assessment
 * @route   POST /api/assessments/submit
 * @access  Public
 */
exports.submitAssessment = async (req, res) => {
  try {
    const { answers, specialization, gender, inviteCode } = req.body;
    
    if (!inviteCode || !answers || !specialization || !gender) {
        return res.status(400).json({ message: 'All assessment fields, including inviteCode, are required.' });
    }

    const company = await Company.findOne({ where: { inviteCode } });
    if (!company) {
      return res.status(400).json({ message: 'Invalid invite code.' });
    }

    // Call the Python ML Service
    const mlResponse = await axios.post('http://localhost:5001/predict', {
      answers: answers
    });
    
    const riskLevel = mlResponse.data.riskLevel;
    const score = answers.reduce((sum, value) => sum + Number(value), 0);

    // Save the assessment with the prediction from the AI model
    await Assessment.create({
      specialization,
      gender,
      role: 'employee',
      companyId: company.id,
      answers,
      score,
      riskLevel,
    });

    // ✅ Get the recommendation text directly from the JSON object
    const recommendationText = recommendations[riskLevel] || 'No recommendation found.';

    res.status(201).json({
      riskLevel,
      recommendation: recommendationText
    });


  } catch (error) {
    console.error("Error submitting assessment:", error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

/**
 * @desc    Get all assessments for the logged-in employer's company
 * @route   GET /api/assessments
 * @access  Private (Employer only)
 */
exports.getCompanyAssessments = async (req, res) => {
  try {
    // The employer's companyId is available from the 'protect' middleware via req.user
    const companyId = req.user.companyId;

    // Find all assessments that belong to this employer's company
    const assessments = await Assessment.findAll({
      where: { companyId: companyId },
      order: [['createdAt', 'DESC']] // Show the newest first
    });

    res.status(200).json(assessments);
  } catch (error) {
    console.error("Error fetching assessments:", error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};