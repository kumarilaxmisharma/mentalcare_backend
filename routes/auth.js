const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Employer, Company } = require('../models');

// POST /api/auth/register (For Employers to create a new Company)
router.post('/register', async (req, res) => {
  const { name, email, password, companyName } = req.body;

  if (!name || !email || !password || !companyName) {
    return res.status(400).json({ message: 'Name, email, password, and companyName are all required.' });
  }

  try {
    // Check if an employer with this email already exists
    const existingEmployer = await Employer.findOne({ where: { email } });
    if (existingEmployer) {
      return res.status(400).json({ message: 'An account with this email already exists.' });
    }

    // Step 1: Create the new company. The inviteCode (UUID) will be auto-generated.
    const newCompany = await Company.create({ name: companyName });

    // Step 2: Hash the password for the first user (the employer)
    const passwordHash = await bcrypt.hash(password, 10);

    // Step 3: Create the employer user and link them to the new company
    const newEmployer = await Employer.create({
      name,
      email,
      password: passwordHash,
      companyId: newCompany.id,
    });

    // Step 4: Return the success message and the new invite code
    res.status(201).json({ 
      message: 'Company and employer registered successfully!',
      companyId: newCompany.id,
      employerId: newEmployer.id,
      inviteCode: newCompany.inviteCode // Send the code back so they can share it
    });
  } catch (error) {
    console.error("Registration Error:", error);
    res.status(500).json({ message: 'Error during registration.', error: error.message });
  }
});

// POST /api/auth/login (For Employers)
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password.' });
    }

    // Find the employer by their email address
    const employer = await Employer.findOne({ where: { email } });
    if (!employer) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check if password matches
    const isMatch = await bcrypt.compare(password, employer.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Create the token and include all necessary info
    const token = jwt.sign(
      { 
        id: employer.id, 
        role: 'employer', // Hardcode role as this is the employer auth file
        companyId: employer.companyId 
      },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.json({
      token,
      user: { 
        id: employer.id,
        name: employer.name,
        email: employer.email,
        role: 'employer',
        companyId: employer.companyId
      },
    });
  } catch(error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

module.exports = router;