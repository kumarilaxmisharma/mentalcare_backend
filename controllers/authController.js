// Controller for authentication
const { Employer, Employee, Company } = require('../models');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

exports.loginCompany = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password required' });
  }
  try {
    const employer = await Employer.findOne({ where: { email } });
    if (!employer || !employer.password) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const isMatch = await bcrypt.compare(password, employer.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    // Fetch company info
    const company = await Company.findByPk(employer.companyId);
    const token = jwt.sign({ id: employer.id, companyId: employer.companyId }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.status(200).json({
      token,
      user: {
        id: employer.id,
        name: employer.name,
        email: employer.email,
        role: 'employer',
        companyId: employer.companyId,
        company: company ? { id: company.id, name: company.name, inviteCode: company.inviteCode } : null
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.registerCompany = async (req, res) => {
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
    // Step 2: Hash the password for the employer
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
      inviteCode: newCompany.inviteCode
    });
  } catch (error) {
    console.error("Registration Error:", error);
    res.status(500).json({ message: 'Error during registration.', error: error.message });
  }
};

exports.loginEmployeeWithInvite = async (req, res) => {
  const { inviteCode, name, email } = req.body;
  if (!inviteCode || !name || !email) {
    return res.status(400).json({ message: 'Invitation code, name, and email required' });
  }
  try {
    const company = await Company.findOne({ where: { invitationCode: inviteCode } });
    if (!company) {
      return res.status(404).json({ message: 'Invalid invitation code' });
    }
    let employee = await Employee.findOne({ where: { email, companyId: company.id } });
    if (!employee) {
      employee = await Employee.create({ name, email, companyId: company.id });
    }
    res.status(200).json({ message: 'Connected to company dashboard', employee: { id: employee.id, name: employee.name, email: employee.email, companyId: company.id } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};
