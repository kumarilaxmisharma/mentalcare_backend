// models/Recommendation.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const Recommendation = sequelize.define('Recommendation', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  riskLevel: {
    type: DataTypes.ENUM('Low', 'Moderate', 'High'),
    unique: true,
    allowNull: false,
  },
  text: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
});

module.exports = Recommendation;