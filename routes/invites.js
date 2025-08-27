const express = require('express');
const router = express.Router();
// Make sure your controller functions are imported
const { createInvite, validateInviteCode } = require('../controllers/inviteController');
const { protect } = require('../middleware/authMiddleware');

// Route for creating an invite
router.post('/', protect, createInvite);

// ✅ ADD THIS ROUTE for validating an invite
router.post('/validate', validateInviteCode);

module.exports = router;