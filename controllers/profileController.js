// controllers/profileController.js
const { Employer, Company, Invite } = require('../models'); // ✅ ADD THIS LINE

// @desc    Get current employer's profile
// @route   GET /api/profile/me
// @access  Private
exports.getMe = async (req, res) => {
  try {
    const userId = req.employer.id;

    // This line caused the error because 'Employer' was not defined
    const employerProfile = await Employer.findByPk(userId, {
      attributes: { exclude: ['password'] },
      include: [
        { model: Company,
          attributes: ['id', 'name']
         },
        { 
          model: Invite, 
          // Optionally, you can specify attributes to include/exclude for invites
          attributes: ['code']
        }
      ]
    });

    if (!employerProfile) {
      return res.status(404).json({ message: 'Profile not found.' });
    }

    res.status(200).json(employerProfile);
  } catch (error) {
    console.error('Profile Error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};