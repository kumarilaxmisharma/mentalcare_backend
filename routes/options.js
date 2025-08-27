// routes/options.js
const express = require('express');
const router = express.Router();
const { getGenders, getSpecializations } = require('../controllers/optionsController');

// Route to get the list of genders
router.get('/genders', getGenders);

// Route to get the list of specializations
router.get('/specializations', getSpecializations);

const { Specialization } = require('../models');
router.get('/test-specializations', async (req, res) => {
  const specs = await Specialization.findAll();
  res.json(specs);
});

module.exports = router;