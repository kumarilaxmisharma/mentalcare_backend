// routes/profile.js
const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware'); // Your 'protect' function
const { Employer, Company } = require('../models');

// @desc    Get current employer's profile including their company info
// @route   GET /api/profile/me
// @access  Private
router.get('/me', protect, async (req, res) => {
  try {
    // The 'protect' middleware already found the logged-in user (req.user).
    // Now, we find them again but also include their company's data.
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