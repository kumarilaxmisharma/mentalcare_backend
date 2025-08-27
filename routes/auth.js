const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
// POST /api/auth/register (For Employers to create a new Company)
router.post('/register', authController.registerCompany);

// POST /api/auth/login (For Employers)
router.post('/login', authController.loginCompany);


router.post('/join-with-invite', authController.joinCompanyWithInvite);

module.exports = router;