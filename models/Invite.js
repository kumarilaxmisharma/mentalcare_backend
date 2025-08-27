// models/Invite.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const Invite = sequelize.define('Invite', {
  // It's good practice to have a standard integer ID as the primary key.
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  // Your invite code, using UUID.
  inviteCode: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4, // Sequelize will automatically generate the v4 UUID
    unique: true,
    allowNull: false,
    field: 'code'
  },
  // The crucial link to the employer.
  companyId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
});

module.exports = Invite;