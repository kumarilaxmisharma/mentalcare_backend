// controllers/optionsController.js

const { Specialization } = require('../models'); // 👈 ADD THIS IMPORT

// A simple array holding the gender options
const genders = ['Male', 'Female', 'Prefer not to say'];

// Controller function to get the genders
exports.getGenders = (req, res) => {
  res.status(200).json(genders);
};

// ✅ FIX: Fetch from the database to include IDs
exports.getSpecializations = async (req, res) => {
  try {
    const specializations = await Specialization.findAll({
      attributes: ['id', 'name'], // Select only the id and name fields
      order: [['id', 'ASC']]
    });
    res.status(200).json(specializations);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch specializations.' });
  }
};