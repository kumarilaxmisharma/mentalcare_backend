const axios = require('axios');
const db = require('../models/index.js');
const fs = require('fs');
const path = require('path');

const { Assessment } = db;

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
    // Gender is no longer a separate field in the request body
    const { answers, specialization, companyId } = req.body;

    // --- ✅ START: New code to find the gender value ---

    // Find the gender question from our questions data
    const genderQuestion = questionsData.find(q => q.key === 'gender');
    
    // Get the numerical answer for gender from the answers array (using its ID as index - 1)
    const genderAnswerValue = answers[genderQuestion.id - 1];
    
    // Find the matching choice to get the text label (e.g., "Female")
    const genderChoice = genderQuestion.choices.find(c => c.value === genderAnswerValue);
    
    // This is the value we'll save to the database for the dashboard
    const genderLabel = genderChoice ? genderChoice.label : 'Unknown';

    // --- ✅ END: New code ---

    // 1. Format all 23 answers for the AI model
    const modelInput = formatDataForModel(answers, specialization);

    // ... (the rest of the function stays the same)
    // 2. Call the Python ML Service
    const mlServiceResponse = await axios.post('http://localhost:5001/predict', modelInput);
    const predictionResult = mlServiceResponse.data;

    // ... (lookup recommendation)
    const riskLevel = predictionResult.risk_level_label;
    const recommendationKey = riskLevel.split(' ')[0];
    const recommendationText = recommendationsData[recommendationKey] || "Please consult with HR for next steps.";

    // 4. Save the final assessment to the database
    await Assessment.create({
      answers: JSON.stringify(answers),
      riskLevel: riskLevel,
      specialization,
      gender: genderLabel, // ✅ Use the gender label we found
      companyId,
      score: predictionResult.risk_level_code || 0,
    });

    // 5. Send a success response
    res.status(201).json({
      riskLevel: riskLevel,
      recommendation: recommendationText,
    });

  } catch (error) {
    console.error('Error submitting assessment:', error.response ? error.response.data : error.message);
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
      // To protect privacy, only select anonymous, aggregated data fields
      attributes: ['riskLevel', 'specialization', 'gender', 'createdAt']
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