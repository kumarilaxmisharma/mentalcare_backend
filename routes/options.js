// routes/options.js
// routes/options.js
const express = require('express');
const router = express.Router();
const Specialization = require('../models/Specialization'); // Corrected import
const Gender = require('../models/Gender');



// @route   GET /api/specializations
// @desc    Get a list of all job specializations
router.get('/specializations', async (req, res) => {
  try {
    const specializations = await Specialization.findAll({
      order: [['name', 'ASC']],
    });
    res.status(200).json(specializations);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// @route   GET /api/genders
// @desc    Get a list of all gender options
router.get('/genders', async (req, res) => {
  try {
    const genders = await Gender.findAll({
        order: [['name', 'ASC']],
    });
    // Return a simple array of strings as the frontend expects
    const genderNames = genders.map(g => g.name);
    res.status(200).json(genderNames);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;