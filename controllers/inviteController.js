// controllers/inviteController.js
const { Invite } = require('../models');

exports.createInvite = async (req, res) => {
  try {
    const employerId = req.employer.id;
    const companyId = req.employer.companyId;

    const newInviteInstance = await Invite.create({
      employerId: employerId,
      companyId: companyId,
    });

    // Convert the Sequelize object to a plain JavaScript object
    const newInvite = newInviteInstance.toJSON();

    res.status(201).json({
      message: 'Invitation code created successfully.',
      inviteCode: newInvite.inviteCode, // Now you can access it directly
    });

  } catch (error) {
    console.error('Error creating invite code:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};


exports.validateInviteCode = async (req, res) => {
  try {
    const { inviteCode } = req.body;
    if (!inviteCode) {
      return res.status(400).json({ message: 'Invitation code is required.' });
    }

    const invite = await Invite.findOne({ where: { code: inviteCode } });

    if (!invite) {
      // The code does not exist in our database.
      return res.status(404).json({ message: 'Invalid invitation code.' });
    }

    // Success! The code is valid.
    // Send back the employerId so the frontend knows who this assessment is for.
    res.status(200).json({
      message: 'Invitation code is valid.',
      employerId: invite.employerId // The frontend needs this!
    });

  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

