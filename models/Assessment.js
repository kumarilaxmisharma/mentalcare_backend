// models/Assessment.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const Assessment = sequelize.define('Assessment', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  answers: {
    type: DataTypes.JSON, // Stores the array of 18 answers
    allowNull: false,
  },
  score: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  riskLevel: {
    type: DataTypes.ENUM('Low', 'Moderate', 'High'),
    allowNull: false,
  },
});

module.exports = Assessment;