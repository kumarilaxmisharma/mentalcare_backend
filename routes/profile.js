// routes/profile.js
const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { getMe } = require('../controllers/profileController'); // Import the controller function

// This route is now clean and points to the getMe function
router.get('/me', protect, getMe);

module.exports = router;