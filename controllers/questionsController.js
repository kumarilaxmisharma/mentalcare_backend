// Controller for questions
const { Question } = require('../models');

exports.getAllQuestions = async (req, res) => {
  try {
    const questions = await Question.findAll({ order: [['id', 'ASC']] });
    res.status(200).json(questions);
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// exports.createQuestion = async (req, res) => {
//   const { text, type } = req.body;
//   if (!text || !type) {
//     return res.status(400).json({ message: 'Text and type required' });
//   }
//   try {
//     const question = await Question.create({ text, type });
//     res.status(201).json(question);
//   } catch (error) {
//     res.status(500).json({ message: 'Internal Server Error' });
//   }
// };

// Add more question-related controller functions as needed
