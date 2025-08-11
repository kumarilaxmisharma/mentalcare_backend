// models/Company.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

// models/Company.js
const Company = sequelize.define('Company', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  inviteCode: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4, // This automatically generates a new UUID
    allowNull: false,
    unique: true,
  }
});

module.exports = Company;