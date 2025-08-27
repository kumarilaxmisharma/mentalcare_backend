const axios = require('axios');
const db = require('../models/index.js');
const fs = require('fs');
const path = require('path');
const { Assessment, Specialization } = db;


// --- Module-level Data Loading (for efficiency) ---
// Load the questions file, which acts as a map between answer values and feature labels.
const questionsPath = path.resolve(process.cwd(), 'data', 'questions.json');
const questionsData = JSON.parse(fs.readFileSync(questionsPath, 'utf-8'));

// Load the recommendations file to provide dynamic feedback.
const recommendationsPath = path.resolve(process.cwd(), 'data', 'recommendations.json');
const recommendationsData = JSON.parse(fs.readFileSync(recommendationsPath, 'utf-8'));


/**
 * Helper function to format frontend data for the Python AI model.
 * Converts an array of numerical answers into a dictionary of human-readable
 * string answers that the Python AI model is expecting.
 * @param {Array<number>} answers - The array of numerical answers from the quiz.
 * @param {string} gender - The gender selected on the home page.
 * @param {string} specialization - The specialization selected on the home page.
 * @returns {object} - The formatted object ready for the AI model.
 */
const formatDataForModel = (answers, gender, specialization) => {
  const modelInput = {};

  answers.forEach((answerValue, index) => {
    const question = questionsData[index];
    if (question && question.key) {
      const choice = question.choices.find(c => c.value === answerValue);
      // ✅ FIX: If a choice isn't found, default to "Don't know" instead of null.
      modelInput[question.key] = choice ? choice.label : "Don't know";
    }
  });

  modelInput.gender = gender;
  modelInput.specialization = specialization;

  return modelInput;
};

/**
 * Controller to handle the submission of a new assessment.
 * This function orchestrates the call to the AI service and saves the result.
 */
const submitAssessment = async (req, res) => {
  try {
    // FIX #3: Get companyId from the request body.
    const { answers, gender, specializationId, companyId } = req.body;
    // Use the variables directly, not 'payload'
    console.log({ answers, gender, specializationId, companyId }); 

    // Validate that we have the data we need.
    if (!answers || !gender || !specializationId) {
      return res.status(400).json({ message: 'Missing required assessment data.' });
    }

    // FIX #1: Use the correct Sequelize method 'findByPk' to find the specialization.
    const specialization = await Specialization.findByPk(specializationId);

    if (!specialization) {
      return res.status(404).json({ error: 'Specialization not found for the given ID.' });
    }

    // Now you have the correct name.
    const specializationName = specialization.name;

    // FIX #2: Call formatDataForModel with all THREE required arguments in the correct order.
    const modelInput = formatDataForModel(answers, gender, specializationName);

    // Call the Python ML Service
    const mlServiceResponse = await axios.post('http://localhost:5007/predict', modelInput);
    const predictionResult = mlServiceResponse.data;

    // Look up the recommendation based on the risk level
    const riskLevel = predictionResult.risk_level_label;
    const recommendationKey = riskLevel.split(' ')[0]; // e.g., "Low"
    const recommendationText = recommendationsData[recommendationKey] || "Please consult with HR for next steps.";

    // Save the final assessment to the database
    await Assessment.create({
      answers: JSON.stringify(answers),
      riskLevel: riskLevel,
      specializationId: specializationId, // Save the ID
      gender: gender, // Save the gender string from the frontend
      companyId: companyId, // Save the companyId
      score: predictionResult.risk_level_code || 0,
    });

    

    // Send a success response back to the frontend
    res.status(201).json({
      riskLevel: riskLevel,
      recommendation: recommendationText,
    });

  } catch (error) {
    // Improved error logging for easier debugging
    console.error('Error submitting assessment:', error.message);
    if (error.response) {
      console.error('Error details from service:', error.response.data);
    }
    res.status(500).json({ message: 'Failed to submit assessment.' });
  }
};

/**
 * Controller to fetch all assessments for a specific company.
 * Used for the employer dashboard.
 */
const getCompanyAssessments = async (req, res) => {
  try {
    // This assumes your 'protect' middleware adds the employer object (with companyId) to the request
    const companyId = req.employer.companyId;

    if (!companyId) {
      return res.status(400).json({ message: 'Company ID not found for this employer.' });
    }

    const assessments = await Assessment.findAll({
      where: { companyId: companyId },
      // ✅ CHANGED: We now join the Specialization table
      attributes: ['riskLevel', 'gender', 'createdAt'], // Removed 'specialization'
      include: [{
        model: Specialization,
        attributes: ['name'] // Only fetch the 'name' field from the Specialization table
      }]
    });

    res.status(200).json({
      status: 'success',
      results: assessments.length,
      data: {
        assessments,
      },
    });
  } catch (error) {
    console.error('Error fetching company assessments:', error);
    res.status(500).json({ message: 'Failed to retrieve company assessments.' });
  }
};


// Export all controller functions
module.exports = {
  submitAssessment,
  getCompanyAssessments,
};