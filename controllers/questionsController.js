// Controller for questions
const { Question }  = require('../models');

exports.getAllQuestions = async (req, res) => {
  try {
    const questions = await Question.findAll({ order: [['id', 'ASC']] });
    res.status(200).json(questions);
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
};



// Add more question-related controller functions as needed
