// routes/auth.js
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Employee } = require('../models');

// POST /api/auth/register
router.post('/register', async (req, res) => {
  const { department, gender, password } = req.body;

  if (!department || !gender || !password) {
    return res.status(400).json({ message: 'Please provide all required fields' });
  }

  const passwordHash = await bcrypt.hash(password, 10);
  
  try {
    const newEmployee = await Employee.create({
      department,
      gender,
      password: passwordHash, // Assuming you add a password field to your Employee model
    });
    res.status(201).json({ message: 'Employee registered successfully', employeeId: newEmployee.id });
  } catch(error) {
    res.status(500).json({ message: 'Error registering employee', error: error.message });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  const { id, password } = req.body;
  const employee = await Employee.findByPk(id);

  if (!employee) {
    return res.status(400).json({ message: 'Invalid credentials' });
  }

  // NOTE: You must add a 'password' field to your Employee model for this to work.
  const isMatch = await bcrypt.compare(password, employee.password);
  if (!isMatch) {
    return res.status(400).json({ message: 'Invalid credentials' });
  }

  // routes/auth.js
  const token = jwt.sign(
    { id: user.id, role: user.role }, // ✅ Include the role in the token!
    process.env.JWT_SECRET,
    { expiresIn: '1d' }
  );

  res.json({
    token,
    employee: { id: employee.id, department: employee.department, gender: employee.gender },
  });
});

module.exports = router;