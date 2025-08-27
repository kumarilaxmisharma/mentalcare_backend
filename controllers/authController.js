// controllers/authController.js

const { Employer, Company, Invite, /* other models */ } = require('../models');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// ✅ This function is correct. No changes needed.
exports.loginCompany = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password required' });
  }
  try {
    const employer = await Employer.findOne({ where: { email } });
    if (!employer || !(await bcrypt.compare(password, employer.password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
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
        company: company ? { id: company.id, name: company.name } : null
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// ✅ This function is correct. No changes needed.
exports.registerCompany = async (req, res) => {
  const { name, email, password, companyName } = req.body;
  if (!name || !email || !password || !companyName) {
    return res.status(400).json({ message: 'All fields are required.' });
  }
  try {
    const existingEmployer = await Employer.findOne({ where: { email } });
    if (existingEmployer) {
      return res.status(400).json({ message: 'This email is already registered.' });
    }
    const newCompany = await Company.create({ name: companyName });
    const passwordHash = await bcrypt.hash(password, 10);
    const newEmployer = await Employer.create({
      name,
      email,
      password: passwordHash,
      companyId: newCompany.id,
    });
    res.status(201).json({
      message: 'Company and employer registered successfully!',
      companyId: newCompany.id,
      employerId: newEmployer.id,
    });
  } catch (error) {
    console.error("Registration Error:", error);
    res.status(500).json({ message: 'Error during registration.', error: error.message });
  }
};


// ⬇️ REPLACED loginEmployeeWithInvite with this new function ⬇️
/**
 * Allows a new employer to register and join a company using an invite code.
 */
exports.joinCompanyWithInvite = async (req, res) => {
  const { inviteCode, name, email, password } = req.body;
  if (!inviteCode || !name || !email || !password) {
    return res.status(400).json({ message: 'Invite code, name, email, and password are required.' });
  }

  try {
    // 1. Find the invite code and check if it's valid
    const invite = await Invite.findOne({ where: { code: inviteCode } });
    if (!invite) {
      return res.status(404).json({ message: 'Invalid invitation code.' });
    }

    // (Optional but recommended) Check if the invite has already been used
    // This requires a 'status' column in your Invites table.
    // if (invite.status === 'used') {
    //   return res.status(400).json({ message: 'This invitation has already been used.' });
    // }

    // 2. Check if an employer with this email already exists
    const existingEmployer = await Employer.findOne({ where: { email } });
    if (existingEmployer) {
      return res.status(400).json({ message: 'An account with this email already exists.' });
    }

    // 3. Create the new employer with the companyId from the invite
    const passwordHash = await bcrypt.hash(password, 10);
    const newEmployer = await Employer.create({
      name,
      email,
      password: passwordHash,
      companyId: invite.companyId, // Make sure your Invite model has a companyId
    });

    // 4. (Optional) Mark the invite as used so it can't be used again
    // await invite.update({ status: 'used' });

    // 5. Log the new employer in by creating a JWT
    const token = jwt.sign({ id: newEmployer.id, companyId: newEmployer.companyId }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({
      message: 'Successfully joined company!',
      token,
      user: {
        id: newEmployer.id,
        name: newEmployer.name,
        email: newEmployer.email,
        role: 'employer',
        companyId: newEmployer.companyId,
      }
    });
  } catch (error) {
    console.error("Join Company Error:", error);
    res.status(500).json({ message: 'Server error during join process.' });
  }
};