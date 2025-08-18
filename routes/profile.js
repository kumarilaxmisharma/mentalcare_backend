// routes/profile.js
const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { Employer, Company } = require('../models');
const profileController = require('../controllers/profileController');

router.get('/me', protect, async (req, res) => {
  try {
    const employerProfile = await Employer.findByPk(req.user.id, {
      attributes: { exclude: ['password'] }, 
      include: {
        model: Company,
        attributes: ['name', 'inviteCode']
      }
    });

    if (!employerProfile) {
      return res.status(404).json({ message: 'Profile not found.' });
    }

    res.status(200).json(employerProfile);
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

module.exports = router;